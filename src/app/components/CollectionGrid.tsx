import { motion } from "motion/react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { products } from "../data/products";
import { getLocalizedElevatorPitch } from "../data/collectionElevatorPitches";
import { useCollectionSearch } from "../context/CollectionSearchContext";
import { useLanguage } from "../context/LanguageContext";
import { siteCopy } from "../content/siteCopy";
import { ROUTES } from "../constants/routes";
import { localizeSearchableItem, type SearchableCollectionItem } from "../utils/collectionSearch";
import { shopifyConfig } from "../config/shopify";
import { BOTTLE_IMAGE } from "../data/bottleImage";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
}

type ShopifyImage = { url: string; altText?: string | null };

function ProductCard({
  item,
  navigate,
  compact,
  toProduct,
  viewStoryLabel,
}: {
  item: SearchableCollectionItem;
  navigate: ReturnType<typeof useNavigate>;
  compact: boolean;
  toProduct: (id: string) => string;
  viewStoryLabel: string;
}) {
  const moodLimit = compact ? 2 : 3;
  const moodGap = compact ? "gap-1.5" : "gap-2";
  const moodPad = compact ? "px-2 py-0.5" : "px-3 py-1";
  const teaser = item.elevatorPitch.trim() || item.storyIntro;

  return (
    <motion.article
      className="group cursor-pointer overflow-hidden border border-white/10 bg-black/25 shadow-[0_8px_28px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:border-white/20"
      onClick={() => navigate(toProduct(item.id))}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5 }}
    >
      <div className="aspect-[864/1184] w-full overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.imageAlt}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div
        className={
          compact ? "space-y-2 px-2.5 py-3" : "space-y-4 p-5 sm:p-6"
        }
      >
        <div>
          <h3
            className={
              compact
                ? "text-[13px] leading-snug text-[#F2F0ED]"
                : "text-xl leading-tight text-[#F2F0ED]"
            }
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {item.title}
          </h3>
          <p
            className={
              compact
                ? "mt-1.5 line-clamp-1 text-[11px] leading-snug text-[#F2F0ED]/68"
                : "mt-3 line-clamp-2 text-sm leading-relaxed text-[#F2F0ED]/68"
            }
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {teaser}
          </p>
          <p
            className="mt-1.5 text-[9px] uppercase tracking-[0.22em] text-[#F2F0ED]/38 transition group-hover:text-[#F2F0ED]/55 sm:text-[10px]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {viewStoryLabel}
          </p>
        </div>

        <div
          className={
            compact
              ? "space-y-1.5 border-t border-white/10 pt-2"
              : "space-y-3 border-t border-white/10 pt-4"
          }
        >
          {item.scentFamily && (
            <p
              className={
                compact
                  ? "text-[9px] uppercase tracking-[0.2em] text-[#F2F0ED]/48"
                  : "text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/48"
              }
            >
              {item.scentFamily}
            </p>
          )}
          {!!item.moodKeywords.length && (
            <div className={`flex flex-wrap ${moodGap}`}>
              {item.moodKeywords.slice(0, moodLimit).map((keyword) => (
                <span
                  key={`${item.id}-${keyword}`}
                  className={`border border-white/14 bg-black/10 ${moodPad} uppercase tracking-[0.08em] text-[#F2F0ED]/68 ${
                    compact ? "text-[9px]" : "text-[10px]"
                  }`}
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function CollectionGrid() {
  const navigate = useNavigate();
  const { locale, t, localizePath } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const { setItems } = useCollectionSearch();
  const compactCards = useMediaQuery("(max-width: 767px)");
  const [collectionData, setCollectionData] = useState<SearchableCollectionItem[]>([]);
  const [isLoadingCollection, setIsLoadingCollection] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const variantMap = new Map<string, string>();
    const variantIds = products
      .map((p) => {
        if (!p.shopifyVariantId) return null;
        variantMap.set(p.shopifyVariantId, p.id);
        return p.shopifyVariantId;
      })
      .filter(Boolean) as string[];

    if (!variantIds.length) return;

    const fetchCollectionData = async () => {
      setIsLoadingCollection(true);
      try {
        const query = `
          query CollectionCardsByVariantIds($variantIds: [ID!]!) {
            nodes(ids: $variantIds) {
              ... on ProductVariant {
                id
                product {
                  id
                  title
                  featuredImage { url altText }
                  storyIntro: metafield(namespace: "custom", key: "story_intro") { value }
                  storyImage: metafield(namespace: "custom", key: "story_image") {
                    reference {
                      ... on MediaImage {
                        image { url altText }
                      }
                    }
                  }
                  scentFamily: metafield(namespace: "custom", key: "scent_family") { value }
                }
              }
            }
          }
        `;

        const response = await fetch(
          `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Storefront-Access-Token":
                shopifyConfig.storefrontAccessToken,
            },
            body: JSON.stringify({
              query,
              variables: { variantIds },
            }),
          }
        );

        if (!response.ok) return;
        const data = await response.json();
        const nodes = data?.data?.nodes || [];

        const mapped = nodes
          .map((node: any) => {
            const localId = variantMap.get(node?.id || "");
            if (!localId) return null;
            const localProduct = products.find((p) => p.id === localId);
            if (!localProduct) return null;

            const storyImage: ShopifyImage | null = node?.product?.storyImage?.reference?.image || null;
            const featuredImage: ShopifyImage | null = node?.product?.featuredImage || null;
            const imageUrl =
              storyImage?.url ||
              featuredImage?.url ||
              BOTTLE_IMAGE;

            return {
              id: localId,
              title: node?.product?.title || localProduct.name,
              storyIntro:
                node?.product?.storyIntro?.value || localProduct.descriptor.en,
              elevatorPitch: getLocalizedElevatorPitch(localId, "en"),
              scentFamily:
                node?.product?.scentFamily?.value || localProduct.scentFamily.en || "",
              /** Display tags come from `products.ts` via localizeSearchableItem — not Shopify metafield. */
              moodKeywords: [],
              imageUrl,
              imageAlt:
                storyImage?.altText ||
                featuredImage?.altText ||
                node?.product?.title ||
                localProduct.name,
            } as SearchableCollectionItem;
          })
          .filter(Boolean) as SearchableCollectionItem[];

        if (!cancelled && mapped.length) {
          const order = new Map(products.map((p, idx) => [p.id, idx]));
          mapped.sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));
          setCollectionData(mapped);
        }
      } catch {
        // fallback below
      } finally {
        if (!cancelled) {
          setIsLoadingCollection(false);
        }
      }
    };

    fetchCollectionData();
    return () => {
      cancelled = true;
    };
  }, []);

  const fallbackCollectionData = useMemo(
    () =>
      products.map((product) => ({
        id: product.id,
        title: product.name,
        storyIntro: product.descriptor.en,
        elevatorPitch: getLocalizedElevatorPitch(product.id, "en"),
        scentFamily: product.scentFamily.en || "",
        moodKeywords: [],
        imageUrl: BOTTLE_IMAGE,
        imageAlt: product.name,
      })),
    []
  );

  const baseData = collectionData.length ? collectionData : fallbackCollectionData;
  const displayData = useMemo(
    () => baseData.map((row) => localizeSearchableItem(row, locale)),
    [baseData, locale]
  );

  useEffect(() => {
    setItems(displayData);
  }, [displayData, setItems]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full py-14 md:py-32 px-3 sm:px-8 md:px-16"
      style={{ backgroundColor: "#0A0E14" }}
    >
      {/* Static continuation of hero: same blue-black family, calmer / flatter toward bottom — no motion, no canvas */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              #0A0E14 0%,
              #0A0D13 28%,
              #090B10 58%,
              #080910 82%,
              #07080E 100%
            )`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.7]"
          style={{
            background: `radial-gradient(ellipse 140% 80% at 50% -20%, rgba(14, 18, 26, 0.68) 26%, transparent 80%)`,
          }}
        />
      </div>

      <div className="relative z-10 mb-12 px-2 sm:mb-20 sm:px-4">
        <p
          className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#F2F0ED]/42"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {t(siteCopy.landing.collectionPreview.eyebrow)}
        </p>
        <h2 className="text-3xl sm:text-5xl md:text-6xl text-[#F2F0ED] uppercase tracking-widest font-black">
          {t(siteCopy.landing.collectionPreview.title)}
        </h2>
        <div className="mt-4 h-[0.5px] w-24 bg-white/20 sm:w-28" />
        <p
          className="mt-6 max-w-2xl text-sm leading-[1.75] text-[#F2F0ED]/55 sm:text-base"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {t(siteCopy.landing.collectionPreview.body)}
        </p>
      </div>

      <div 
        className="relative z-[50] mx-auto grid max-w-[1600px] grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {displayData.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            navigate={navigate}
            compact={compactCards}
            toProduct={(id) => localizePath(ROUTES.product(id))}
            viewStoryLabel={t(siteCopy.landing.collectionPreview.viewStory)}
          />
        ))}
      </div>

      {isLoadingCollection && (
        <div className="mt-8 text-center text-[11px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">
          {t(siteCopy.landing.collectionPreview.syncing)}
        </div>
      )}
    </section>
  );
}
