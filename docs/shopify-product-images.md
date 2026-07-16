# Shopify product images (SWY storefront)

Product visuals on [scentwithyou.com](https://www.scentwithyou.com/) are driven by **Shopify Admin** uploads. Replacing images does **not** require a code deploy.

Storefront API version: see `VITE_SHOPIFY_STORE_DOMAIN` / token env vars and `src/app/config/shopify.ts` (`apiVersion`).

## Image hierarchy (runtime)

| Surface | Prefer | Then | If none |
|---------|--------|------|---------|
| Collection / landing / related card | `custom.story_image` | Product **featured image** | Dark aspect wrapper only (no stock / bottle fallback) |
| PDP main | Product **featured image** | First gallery image | Dark product-image stage only |
| PDP gallery | Product **media / images** (Admin order, deduped; featured prepended only if absent) | — | Empty gallery (no fallback URL) |

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

## Per-product workflow

1. **Products** → open a product (e.g. The Last Snow).  
2. Upload / reorder **Product media**. The **first media item** is the featured product image (PDP main + gallery start).  
3. In **Metafields**, set **Story image** (`custom.story_image`) to the collection/story card crop.  
4. Fill **ALT text** on each media image (and the story image file).  
5. **Save**.

### Recommended media order

1. Product front (bottle / hero — featured)  
2. Story / campaign crop (also assign to Story image metafield)  
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
