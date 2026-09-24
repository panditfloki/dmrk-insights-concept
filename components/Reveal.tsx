import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Marks a subtree for scroll reveal. GSAP hides only targets below the viewport.
 * `group` makes siblings stagger together (0.15s apart) instead of each firing alone.
 */
export default function Reveal({
  children,
  group,
  as: Tag = "div",
  className,
  style,
}: {
  children: ReactNode;
  group?: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Tag className={className} style={style} data-reveal="" data-reveal-group={group}>
      {children}
    </Tag>
  );
}
