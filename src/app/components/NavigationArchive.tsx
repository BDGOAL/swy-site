import { useEffect, useState, useRef, useMemo, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useShopify } from '../context/ShopifyContext';
import { useCollectionSearch } from '../context/CollectionSearchContext';
import { useLanguage } from '../context/LanguageContext';
import { siteCopy } from '../content/siteCopy';
import { ROUTES } from '../constants/routes';
import {
  filterCollectionItemsByQuery,
  getStaticSearchableItem,
  normalizeSearchQuery,
  SEARCH_NO_RESULT_FALLBACK_IDS,
  type SearchableCollectionItem,
} from '../utils/collectionSearch';
import { SECTION_IDS, toLandingHash } from '../constants/landingSectionIds';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CollectionLink } from './CollectionLink';
import { LocalizedLink } from './LocalizedLink';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function SearchResultRow({
  item,
  onPick,
}: {
  item: SearchableCollectionItem;
  onPick: () => void;
}) {
  const { t } = useLanguage();
  const teaser = item.elevatorPitch.trim() || item.storyIntro;
  return (
    <button
      type="button"
      onClick={onPick}
      className="flex w-full gap-3 border border-white/[0.09] bg-black/25 px-3 py-2.5 text-left transition hover:border-white/[0.16] hover:bg-black/38"
    >
      <div className="aspect-[864/1184] h-[4.25rem] w-auto shrink-0 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.imageAlt}
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-[11px] text-[#F2F0ED]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {item.title}
        </p>
        <p
          className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[#F2F0ED]/62"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {teaser}
        </p>
        {item.scentFamily ? (
          <p
            className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#F2F0ED]/42"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {item.scentFamily}
          </p>
        ) : null}
        <p
          className="mt-1.5 text-[9px] uppercase tracking-[0.22em] text-[#F2F0ED]/34"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {t(siteCopy.search.viewStory)}
        </p>
      </div>
    </button>
  );
}

export function NavigationArchive() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, locale, localizePath } = useLanguage();
  const { openCart, cartCount } = useShopify();
  const {
    items: searchItems,
    isOpen: searchOpen,
    query: searchQuery,
    openSearch,
    closeSearch,
    setQuery: setSearchQuery,
  } = useCollectionSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  /** 0 = full brand presence (hero entry), 1 = quietest framing (immersed in collection) */
  const [navRecess, setNavRecess] = useState(0);
  /** 0 = hidden (hero), 1 = fully shown (post-hero) */
  const [navReveal, setNavReveal] = useState(1);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const updateRecess = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const onHome = location.pathname === '/';
      const archive = document.getElementById(SECTION_IDS.archive);

      let recess = 0;

      if (onHome && archive) {
        const archiveTop = archive.offsetTop;
        const stage2Start = 44;
        const collectionBlendStart = archiveTop - vh * 0.56;
        const collectionDeep = archiveTop - vh * 0.2;
        const revealStart = archiveTop - vh * 0.22;
        const revealEnd = archiveTop - vh * 0.04;

        if (y <= stage2Start) {
          recess = 0;
        } else if (y < collectionBlendStart) {
          recess = 0.66 * smoothstep(stage2Start, collectionBlendStart, y);
        } else {
          const t = smoothstep(collectionBlendStart, collectionDeep, y);
          recess = lerp(0.66, 1, t);
        }

        setNavReveal(smoothstep(revealStart, revealEnd, y));
      } else {
        const t = smoothstep(48, 420, y);
        recess = t * 0.62;
        setNavReveal(1);
      }

      setNavRecess(recess);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateRecess);
    };

    updateRecess();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [location.pathname]);

  type NavItem = {
    label: string;
    to: string;
    landingSectionId?: string;
  };

  const navLinks = useMemo<NavItem[]>(
    () => [
      { label: t(siteCopy.nav.collection), to: ROUTES.collection },
      {
        label: t(siteCopy.nav.story),
        to: toLandingHash('brandDna'),
        landingSectionId: SECTION_IDS.brandDna,
      },
      {
        label: t(siteCopy.nav.about),
        to: toLandingHash('brandVision'),
        landingSectionId: SECTION_IDS.brandVision,
      },
      {
        label: t(siteCopy.nav.contact),
        to: toLandingHash('siteFooter'),
        landingSectionId: SECTION_IDS.siteFooter,
      },
    ],
    [t]
  );

  const onLandingSectionNav =
    (sectionId: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      const onLanding = location.pathname === '/' || location.pathname === '/landing';
      if (!onLanding) return;
      e.preventDefault();
      navigate(localizePath(`/#${sectionId}`));
      window.requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    };

  /** On landing routes, logo goes to canonical home top (locale preserved); other pages use normal Link navigation. */
  const onHomeLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const onLanding = location.pathname === '/' || location.pathname === '/landing';
    if (!onLanding) return;
    e.preventDefault();
    navigate(localizePath(ROUTES.home), { replace: true });
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
      });
    });
  };

  const recess = menuOpen ? Math.min(navRecess, 0.22) : navRecess;
  const reveal = menuOpen ? 1 : navReveal;

  const navBgAlpha = lerp(0.22, 0.035, recess);
  const navBlurPx = lerp(7.5, 2.25, recess);
  const navPadY = lerp(1.12, 0.7, recess);
  const edgeFeatherTopAlpha = lerp(0.026, 0.008, recess);
  const linkAlpha = lerp(0.64, 0.54, recess);
  const accentAlpha = lerp(0.82, 0.7, recess);
  const logoScale = lerp(1, 0.92, recess);

  const filteredSearchItems = useMemo(
    () => filterCollectionItemsByQuery(searchItems, searchQuery),
    [searchItems, searchQuery]
  );

  const recommendationItems = useMemo(() => {
    return SEARCH_NO_RESULT_FALLBACK_IDS.map((id) => {
      const fromLive = searchItems.find((i) => i.id === id);
      return fromLive ?? getStaticSearchableItem(id, locale);
    }).filter(Boolean) as SearchableCollectionItem[];
  }, [searchItems, locale]);

  const toggleSearchPanel = () => {
    if (searchOpen) {
      closeSearch();
      return;
    }
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(localizePath(toLandingHash('archive')));
      window.setTimeout(() => openSearch(), 450);
    } else {
      document.getElementById(SECTION_IDS.archive)?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
      openSearch();
    }
  };

  const pickSearchResult = (id: string) => {
    navigate(localizePath(ROUTES.product(id)));
    closeSearch();
  };

  useEffect(() => {
    if (!searchOpen) return;
    const t = window.setTimeout(() => searchInputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen, closeSearch]);

  const searchHasQuery = normalizeSearchQuery(searchQuery).length > 0;

  return (
    <>
      {searchOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[78] cursor-default border-0 bg-black/35 backdrop-blur-[2px]"
          aria-label={t(siteCopy.search.ariaClose)}
          onClick={closeSearch}
        />
      ) : null}

      <div className="fixed top-0 left-0 right-0 z-[80]">
      <div
        style={{
          opacity: reveal,
          transform: `translateY(${lerp(-18, 0, reveal)}px)`,
          pointerEvents: reveal < 0.05 ? 'none' : 'auto',
          transition: 'opacity 320ms ease, transform 360ms ease',
        }}
      >
      <nav
        className="w-full"
        style={{
          backgroundColor: `rgba(10, 10, 10, ${navBgAlpha})`,
          backdropFilter: `saturate(1.03) blur(${navBlurPx}px)`,
          WebkitBackdropFilter: `saturate(1.03) blur(${navBlurPx}px)`,
        }}
      >
        <div
          className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-12"
          style={{ paddingTop: `${navPadY}rem`, paddingBottom: `${navPadY}rem` }}
        >
          <div className="flex items-center justify-between gap-3">
            <LocalizedLink
              to={ROUTES.home}
              onClick={onHomeLogoClick}
              className="pointer-events-auto flex origin-left shrink-0 items-center gap-2"
              style={{ transform: `scale(${logoScale})` }}
            >
              <img src="/swy-logo.png" alt={t(siteCopy.brand.logoAlt)} className="h-20 w-auto sm:h-28" />
            </LocalizedLink>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3 lg:gap-5">
              <nav
                className="hidden min-w-0 items-center gap-x-5 lg:flex xl:gap-x-7"
                aria-label={t(siteCopy.nav.primaryAria)}
              >
                {navLinks.map((link) =>
                  link.to === ROUTES.collection ? (
                    <CollectionLink
                      key={`${link.to}-${link.label}`}
                      className="whitespace-nowrap text-[10px] uppercase tracking-[0.24em] transition hover:text-[#F2F0ED]"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        color: `rgba(242, 240, 237, ${linkAlpha})`,
                      }}
                    >
                      {link.label}
                    </CollectionLink>
                  ) : (
                    <LocalizedLink
                      key={`${link.to}-${link.label}`}
                      to={link.to}
                      onClick={
                        link.landingSectionId
                          ? onLandingSectionNav(link.landingSectionId)
                          : undefined
                      }
                      className="whitespace-nowrap text-[10px] uppercase tracking-[0.24em] transition hover:text-[#F2F0ED]"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        color: `rgba(242, 240, 237, ${linkAlpha})`,
                      }}
                    >
                      {link.label}
                    </LocalizedLink>
                  )
                )}
              </nav>

              <div
                className="flex items-center gap-1.5 sm:gap-2 lg:border-l lg:border-white/[0.1] lg:pl-3 xl:pl-4"
                aria-label={t(siteCopy.nav.utilitiesAria)}
              >
                <LanguageSwitcher />
                <button
                  type="button"
                  onClick={toggleSearchPanel}
                  className="pointer-events-auto inline-flex items-center justify-center rounded border border-white/15 p-2 text-[#F2F0ED]/75 transition hover:text-[#F2F0ED]"
                  style={{ color: `rgba(242, 240, 237, ${accentAlpha})` }}
                  aria-expanded={searchOpen}
                  aria-label={searchOpen ? t(siteCopy.search.ariaClose) : t(siteCopy.search.ariaOpen)}
                >
                  {searchOpen ? <X size={15} strokeWidth={1.5} /> : <Search size={15} strokeWidth={1.5} />}
                </button>
                <button
                  type="button"
                  onClick={openCart}
                  className="pointer-events-auto hidden items-center gap-2 border px-3 py-2 text-[10px] uppercase tracking-[0.18em] transition hover:text-[#F2F0ED] lg:inline-flex"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: `rgba(242, 240, 237, ${accentAlpha})`,
                    borderColor: `rgba(255, 255, 255, ${lerp(0.15, 0.1, recess)})`,
                  }}
                  aria-label={t(siteCopy.nav.cart)}
                >
                  <ShoppingBag size={14} />
                  {cartCount > 0 ? `${cartCount}` : t(siteCopy.nav.cart)}
                </button>
                <button
                  type="button"
                  onClick={openCart}
                  className="pointer-events-auto inline-flex rounded border p-2 lg:hidden"
                  style={{
                    color: `rgba(242, 240, 237, ${accentAlpha})`,
                    borderColor: `rgba(255, 255, 255, ${lerp(0.15, 0.1, recess)})`,
                  }}
                  aria-label={t(siteCopy.nav.cart)}
                >
                  <ShoppingBag size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="pointer-events-auto inline-flex rounded border p-2 lg:hidden"
                  style={{
                    color: `rgba(242, 240, 237, ${accentAlpha})`,
                    borderColor: `rgba(255, 255, 255, ${lerp(0.15, 0.1, recess)})`,
                  }}
                  aria-expanded={menuOpen}
                  aria-label={menuOpen ? t(siteCopy.nav.menuClose) : t(siteCopy.nav.menuToggle)}
                >
                  {menuOpen ? <X size={15} /> : <Menu size={15} />}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="pointer-events-none h-1.5 sm:h-2"
          style={{
            marginTop: "-0.02rem",
            background: `linear-gradient(to bottom, rgba(242, 240, 237, ${edgeFeatherTopAlpha}) 0%, rgba(10, 10, 10, 0.004) 28%, transparent 100%)`,
            filter: "blur(2px)",
          }}
          aria-hidden
        />
      </nav>
      </div>

      {searchOpen ? (
        <div
          className="w-full border-t border-white/[0.08] bg-[rgba(7,9,12,0.94)] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
          onMouseDown={(e) => e.stopPropagation()}
          role="search"
        >
          <div className="mx-auto max-w-[1920px] px-4 pb-4 pt-3 sm:px-8 lg:px-12">
            <div className="flex w-full items-stretch gap-2 sm:gap-3">
              <label htmlFor="header-scent-search" className="sr-only">
                {t(siteCopy.search.ariaOpen)}
              </label>
              <input
                ref={searchInputRef}
                id="header-scent-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(siteCopy.search.placeholder)}
                autoComplete="off"
                className="min-h-[48px] min-w-0 flex-1 rounded-sm border border-white/[0.12] bg-black/40 px-4 py-3 text-sm text-[#F2F0ED] outline-none transition placeholder:text-[#F2F0ED]/32 focus:border-white/[0.2] focus:bg-black/48"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
              <button
                type="button"
                onClick={closeSearch}
                className="inline-flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-sm border border-white/[0.12] text-[#F2F0ED]/55 transition hover:border-white/[0.18] hover:text-[#F2F0ED]/85 sm:min-w-0 sm:px-3"
                aria-label={t(siteCopy.search.ariaClose)}
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-3 max-h-[min(58vh,440px)] overflow-y-auto overscroll-contain pr-0.5">
              {!searchHasQuery ? (
                <p
                  className="px-0.5 py-3 text-[11px] leading-relaxed text-[#F2F0ED]/45"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {t(siteCopy.search.hintEmpty)}
                </p>
              ) : filteredSearchItems.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {filteredSearchItems.map((item) => (
                    <li key={item.id}>
                      <SearchResultRow
                        item={item}
                        onPick={() => pickSearchResult(item.id)}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-4">
                  <p
                    className="text-[12px] leading-relaxed text-[#F2F0ED]/68"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {t(siteCopy.search.noMatch)}
                  </p>
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/38"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {t(siteCopy.search.suggested)}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {recommendationItems.map((item) => (
                      <li key={`rec-${item.id}`}>
                        <SearchResultRow
                          item={item}
                          onPick={() => pickSearchResult(item.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[79] bg-black/88 px-6 pt-24 lg:hidden">
          <div className="space-y-5">
            {navLinks.map((link) =>
              link.to === ROUTES.collection ? (
                <CollectionLink
                  key={link.label}
                  onClick={() => setMenuOpen(false)}
                  className="block text-base uppercase tracking-[0.2em] text-[#F2F0ED]/80"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {link.label}
                </CollectionLink>
              ) : (
                <LocalizedLink
                  key={link.label}
                  to={link.to}
                  onClick={(e) => {
                    setMenuOpen(false);
                    if (link.landingSectionId) {
                      onLandingSectionNav(link.landingSectionId)(e);
                    }
                  }}
                  className="block text-base uppercase tracking-[0.2em] text-[#F2F0ED]/80"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {link.label}
                </LocalizedLink>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
