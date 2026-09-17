import Link from "next/link";
import { Logo } from "./Icons";

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="wrap">
        <div>
          <Link href="/" className="brand" style={{ marginBottom: 12 }}>
            <Logo size={32} />
            <span>DMRK<small>Insights</small></span>
          </Link>
          <p style={{ maxWidth: "34ch", fontSize: "0.92rem" }}>
            Market intelligence, customer research, competitor analysis, surveys and strategic
            consulting for confident growth decisions.
          </p>
        </div>
        <div>
          <h3>Company</h3>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/industries">Industries</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3>Resources</h3>
          <ul>
            <li><Link href="/insights">Insights</Link></li>
            <li><Link href="/insights?type=report">Reports</Link></li>
            <li><Link href="/insights?type=case">Case studies</Link></li>
            <li><span style={{ opacity: 0.55 }}>Newsletter — not in this concept</span></li>
          </ul>
        </div>
        <div>
          <h3>Legal</h3>
          <ul>
            <li><span style={{ opacity: 0.55 }}>Privacy policy — not in this concept</span></li>
            <li><span style={{ opacity: 0.55 }}>Terms of use — not in this concept</span></li>
          </ul>
        </div>
      </div>
      <div className="footer-base">
        <div className="wrap">
          <span>© {new Date().getFullYear()} DMRK Insights. All rights reserved.</span>
          <span>Concept build by dydxfx — not the live site.</span>
        </div>
      </div>
    </footer>
  );
}
