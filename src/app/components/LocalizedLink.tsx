import { Link, type LinkProps } from "react-router";
import { useLanguage } from "../context/LanguageContext";

/** Like `<Link>` but preserves `lang` query for the current locale. */
export function LocalizedLink({ to, ...rest }: LinkProps) {
  const { localizePath } = useLanguage();
  const resolved = typeof to === "string" ? localizePath(to) : to;
  return <Link to={resolved} {...rest} />;
}
