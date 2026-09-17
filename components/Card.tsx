import Link from "next/link";
import Image from "next/image";
import { Arrow } from "./Icons";
import { TYPE_LABEL, formatDate, readingMinutes, type ContentItem } from "@/lib/content";

export default function Card({ item, priority = false }: { item: ContentItem; priority?: boolean }) {
  return (
    <article className="card">
      <div className="card-media">
        <Image
          src={item.image}
          alt=""
          width={640}
          height={360}
          priority={priority}
          sizes="(max-width: 700px) 100vw, 33vw"
        />
        <span className="pill">{TYPE_LABEL[item.type]}</span>
      </div>
      <div className="card-body">
        <div className="meta">
          <span>{item.industry}</span>
          <i className="dot" />
          <time dateTime={item.publishDate}>{formatDate(item.publishDate)}</time>
        </div>
        <h3>
          <Link href={`/insights/${item.slug}`} className="stretched">
            {item.title}
          </Link>
        </h3>
        <p>{item.summary}</p>
        <div className="card-foot">
          <span className="textlink">
            Read {TYPE_LABEL[item.type].toLowerCase()} · {readingMinutes(item)} min <Arrow />
          </span>
        </div>
      </div>
    </article>
  );
}
