import { useState, useEffect } from 'react';
import { productImageFallbacks } from '../data/productImageFallbacks';

interface ProductImageProps {
  productId: string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

/**
 * ProductImage component with intelligent fallback mechanism
 * 
 * Behavior:
 * 1. First tries to load image from /products/{productId}.png
 * 2. If that fails, falls back to high-quality Unsplash image
 * 
 * This ensures images always display, whether using uploaded PNGs or fallbacks
 */
export function ProductImage({ productId, className, style, alt }: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageError, setImageError] = useState(false);

  // Map product IDs to their public folder filenames
  const productFileNames: Record<string, string> = {
    'the-last-snow': 'the-last-snow.png',
    'the-first-rose': 'the-first-rose.png',
    'no-worries': 'it-means-no-worries.png',
    'old-library': 'the-old-library.png',
    'mens-garage': 'mens-garage.png',
    'im-rich': 'i-am-rich.png',
    'morning-after-quit': 'morning-after-i-quit.png',
    'night-was-mine': 'the-night-was-mine.png',
  };

  useEffect(() => {
    // Reset error state when productId changes
    setImageError(false);
    
    // Try to load from public folder first
    const fileName = productFileNames[productId];
    if (fileName) {
      setImageSrc(`/products/${fileName}`);
    } else {
      // If no filename mapping, go straight to fallback
      setImageError(true);
    }
  }, [productId]);

  const handleError = () => {
    // On error, switch to fallback image
    setImageError(true);
  };

  // Use fallback if error occurred or no primary source
  const finalSrc = imageError 
    ? productImageFallbacks[productId] || ''
    : imageSrc;

  if (!finalSrc) {
    // If no image source at all, return empty div
    return <div className={className} style={style} />;
  }

  return (
    <img
      src={finalSrc}
      alt={alt || productId}
      className={className}
      style={style}
      onError={handleError}
    />
  );
}
