# SWY Avenir Fonts

## 📁 Font Files Location

Place your Avenir font files here:

- `Avenir-Regular.woff2` (from `/src/imports/binary-data.txt`)
- `Avenir-Black.woff2` (from `/src/imports/binary-data-1.txt`)

## 🔧 How to Add Fonts:

### Option 1: Rename and Move (Recommended)

1. Download `/src/imports/binary-data.txt`
2. Rename to `Avenir-Regular.ttf` or `.woff2`
3. Place in `/public/fonts/` folder
4. Update `/src/styles/fonts.css` to reference:
   ```css
   src: url('/fonts/Avenir-Regular.woff2') format('woff2');
   ```

### Option 2: Keep in /src/imports/

The fonts are currently referenced from `/src/imports/` but browsers cannot load `.txt` files as fonts.

**Current Issue:** Browsers reject `.txt` files as invalid font format.

**Solution:** Rename files from `.txt` to `.woff2` or `.ttf`

## 📝 Font Format

The files contain Base64-encoded TrueType or WOFF2 font data.
