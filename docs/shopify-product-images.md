# Shopify product images (SWY storefront)

Product visuals on [scentwithyou.com](https://www.scentwithyou.com/) are driven by **Shopify Admin** uploads. Replacing images does **not** require a code deploy.

Storefront API version: see `VITE_SHOPIFY_STORE_DOMAIN` / token env vars and `src/app/config/shopify.ts` (`apiVersion`).

## Image hierarchy (runtime)

| Surface | Prefer | Then | If none |
|---------|--------|------|---------|
| Collection / landing / related card | Product **featured image** | — | Dark aspect wrapper only (no stock / bottle fallback) |
| PDP main | Product **featured image** | First gallery image | Dark product-image stage only |
| PDP gallery | Product **media / images** (Admin order, deduped; featured prepended only if absent) | — | Empty gallery (no fallback URL) |
| PDP scent-story narrative slot | `custom.story_image` only | — | Nothing (dark wrapper only if the image node renders and then fails to load) |

Optional metafields **not wired yet** (ready for a future sprint): `custom.packaging_image`, `custom.campaign_image`.

## Create `custom.story_image` (once)

1. Shopify Admin  
2. **Settings** → **Custom data** → **Products**  
3. **Add definition**  
4. **Name:** Story image  
5. **Namespace and key:** `custom.story_image`  
6. **Type:** **File**  
7. Accept **images only**  
8. **Single value** (one file)  
9. Save  

Storefront access: confirm the definition is available to the Storefront API (standard product metafields with storefront access enabled).

## `custom.story_image` vs Product Media

These are **independent placements** with different jobs:

| Placement | Driven by | Role |
|-----------|-----------|------|
| PDP **Scent story** narrative slot | Always `custom.story_image` | Editorial pause between story intro and body (`intro → image → body`) |
| Product Media / featured / gallery | Admin Product media only | Bottle / hero / alternate product shots on the PDP gallery |
| Collection / landing / search / related card | Always Product **featured image** | Product thumbnail crop |

Rules:

- A valid `custom.story_image` **always** renders in the dedicated PDP narrative slot.
- The same file **may also** appear in Product Media if you want that crop in the gallery — the storefront does **not** suppress the narrative slot when URLs match.
- Collection-style thumbnails do **not** use `custom.story_image`; they use Shopify `featuredImage` only.
- Do **not** expect the narrative slot to inject itself into the gallery, and do **not** mix `story_image` into `texture_images`.
- Product Media keeps its own URL deduplication; that does not affect the narrative slot.

## Per-product workflow

1. **Products** → open a product (e.g. The Last Snow).  
2. Upload / reorder **Product media**. The **first media item** is the featured product image (PDP main + gallery start).  
3. In **Metafields**, set **Story image** (`custom.story_image`) to the PDP narrative crop.
4. Choose the Shopify **featured image** for collection / landing / search / related thumbnails.
5. Optionally also add the story crop (or a different one) to Product Media if it should appear in the gallery.
6. Fill **ALT text** on each media image (and the story image file).
7. **Save**.

### Recommended media order

1. Product front (bottle / hero — featured)  
2. Optional story / campaign crop in Product Media (gallery only; thumbnails still come from the featured image)
3. Bottle close-up  
4. Packaging  
5. Unboxing  
6. Alternate angle  

### Recommended specs

- Story / card ratio: **864∶1184** (export e.g. **1080×1480** or **1296×1776**)  
- PDP images: at least **1600×2000**  
- Format: JPEG or WebP  
- Avoid text-heavy creatives (type is supplied by the site)  
- Filenames, e.g.  
  - `01-the-last-snow-product-front.jpg`  
  - `01-the-last-snow-story.jpg`

## Local product IDs ↔ Shopify handles

| Local ID | Shopify handle (typical) |
|----------|--------------------------|
| `the-last-snow` | `the-last-snow` |
| `the-first-rose` | `the-first-rose` |
| `no-worries` | `no-worries` |
| `old-library` | `old-library` |
| `mens-garage` | `mens-garage` |
| `im-rich` | `im-rich` |
| `morning-after-quit` | `morning-after-quit` |
| `night-was-mine` | `night-was-mine` |

## Code map

- Canonical helpers: `src/app/lib/productImages.ts`  
- Collection browse fetch: `src/app/lib/shopifyBrowseCollectionImages.ts`  
- Landing cards: `src/app/components/CollectionGrid.tsx`  
- `/collection` cards: `src/app/components/CollectionBrowsePage.tsx`  
- PDP: `src/app/components/UnboxingExperience.tsx`

Do not commit Storefront access tokens into the repo; use environment variables only.
