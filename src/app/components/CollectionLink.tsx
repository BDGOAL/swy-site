import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "../constants/routes";
import { useLanguage } from "../context/LanguageContext";

export type CollectionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
};

/**
 * Reliable SPA navigation to `/collection` with locale query preserved.
 * Real `href` for accessibility / new tab; `navigate()` on primary click so the route always updates.
 */
export function CollectionLink({ className, children, onClick, ...rest }: CollectionLinkProps) {
  const navigate = useNavigate();
  const { localizePath } = useLanguage();
  const href = localizePath(ROUTES.collection);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href);
  };

  return (
    <a {...rest} href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
