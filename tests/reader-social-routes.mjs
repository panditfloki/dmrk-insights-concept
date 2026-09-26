// Run after npm run build. Tests only isolated local servers with synthetic accounts.
import assert from 'node:assert/strict';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {once} from 'node:events';

const origin = 'https://review.example.test';
const token = 'a'.repeat(64);
const state = 'b'.repeat(64);
let providerUrlOverride;
let completion = {token, next: '/insights/test-story'};
const api = http.createServer(async (req, res) => {
  let text = '';
  for await (const chunk of req) text += chunk;
  res.setHeader('Content-Type', 'application/json');
  if (req.url === '/readers/social/providers') return res.end(JSON.stringify({google: true, apple: true}));
  if (req.url === '/website') return res.end(JSON.stringify({version: 1, menus: [], categories: [], pages: []}));
  if (req.url.endsWith('/start')) {
    const provider = req.url.includes('/apple/') ? 'apple' : 'google';
    const url = new URL(provider === 'google' ? 'https://accounts.google.com/o/oauth2/v2/auth' : 'https://appleid.apple.com/auth/authorize');
    url.searchParams.set('redirect_uri', `${origin}/api/readers/social/${provider}/callback`);
    url.searchParams.set('state', state);
    assert.match(JSON.parse(text).binding, /^[a-f0-9]{64}$/);
    return res.end(JSON.stringify({url: providerUrlOverride || url.href}));
  }
  if (req.url.endsWith('/complete')) {
    assert.match(JSON.parse(text).binding, /^[a-f0-9]{64}$/);
    if (completion.error) res.statusCode = 422;
    return res.end(JSON.stringify(completion));
  }
  res.statusCode = 404; res.end('{}');
});
api.listen(0, '127.0.0.1'); await once(api, 'listening');
const port = 3212;
const base = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(port), '--hostname', '127.0.0.1'], {
  env: {...process.env, DMRK_API_URL: `http://127.0.0.1:${api.address().port}`, DMRK_SITE_ORIGIN: origin, DMRK_PUBLIC_SITE: 'false'}, stdio: 'pipe',
});
let output = ''; child.stdout.on('data', b => output += b); child.stderr.on('data', b => output += b);
const post = (provider, body = {terms: true, next: '/insights/test-story'}, requestOrigin = origin) => fetch(`${base}/api/readers/social/${provider}/start`, {method: 'POST', headers: {origin: requestOrigin, 'Content-Type': 'application/json'}, body: JSON.stringify(body), redirect: 'manual'});
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw new Error(output);
    try {await fetch(`${base}/api/readers/me`); ready = true; break;} catch {await new Promise(r => setTimeout(r, 100));}
  }
  assert.ok(ready, output);
  assert.equal((await post('google', undefined, 'https://evil.example')).status, 403);
  assert.equal((await post('unknown')).status, 404);
  assert.equal((await post('google', {terms: false})).status, 422);
  for (const provider of ['google', 'apple']) {
    const start = await post(provider);
    assert.equal(start.status, 200);
    const cookie = start.headers.get('set-cookie');
    assert.match(cookie, /HttpOnly/); assert.match(cookie, /Secure/); assert.match(cookie, /Max-Age=600/);
    assert.match(cookie, provider === 'apple' ? /SameSite=none/i : /SameSite=lax/i);
    assert.match(cookie, /Path=\/api\/readers\/social/);
    const fields = new URLSearchParams({state, code: 'test-code'});
    const callback = await fetch(`${base}/api/readers/social/${provider}/callback${provider === 'google' ? `?${fields}` : ''}`, {
      method: provider === 'google' ? 'GET' : 'POST', redirect: 'manual',
      headers: {cookie: cookie.split(';')[0], ...(provider === 'apple' ? {'Content-Type': 'application/x-www-form-urlencoded'} : {})},
      ...(provider === 'apple' ? {body: fields.toString()} : {}),
    });
    assert.equal(callback.status, 303);
    assert.equal(callback.headers.get('location'), `${origin}/insights/test-story`);
    assert.match(callback.headers.get('set-cookie'), /dmrk_reader=.*HttpOnly/);
    assert.match(callback.headers.get('set-cookie'), /Max-Age=0/);
    assert.match(callback.headers.get('cache-control'), /no-store/);
    assert.equal(callback.headers.get('referrer-policy'), 'no-referrer');
    assert.ok(!(await callback.text()).includes(token));
  }
  providerUrlOverride = 'https://evil.example/oauth';
  assert.equal((await post('google')).status, 503);
  providerUrlOverride = undefined;
  const callbackUrl = `${base}/api/readers/social/google/callback?state=${state}&code=test`;
  const missing = await fetch(callbackUrl, {redirect: 'manual'});
  assert.match(missing.headers.get('location'), /social_error=expired/);
  assert.ok(!missing.headers.get('set-cookie').includes('dmrk_reader='));
  completion = {error: 'existing_account', next: '/insights/test-story'};
  const conflict = await fetch(callbackUrl, {redirect: 'manual', headers: {cookie: `dmrk_oauth_google=${'c'.repeat(64)}`}});
  assert.match(conflict.headers.get('location'), /social_error=existing_account/);
  assert.ok(!conflict.headers.get('set-cookie').includes('dmrk_reader='));
  completion = {token, next: '//evil.example'};
  const safe = await fetch(callbackUrl, {redirect: 'manual', headers: {cookie: `dmrk_oauth_google=${'c'.repeat(64)}`}});
  assert.equal(safe.headers.get('location'), `${origin}/insights`);
  console.log('PASS: Google GET and Apple form POST callbacks, secure cookies, origin and consent checks, provider allowlist, errors and safe redirects.');
  if (process.env.DMRK_KEEP_TEST_PREVIEW === 'true') {
    console.log(`Synthetic provider preview at ${base}/reader/login. No real provider sign-in.`);
    await new Promise(() => {});
  }
} finally {
  child.kill('SIGTERM'); api.close();
}
