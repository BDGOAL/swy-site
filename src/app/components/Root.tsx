import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { CollectionSearchProvider } from "../context/CollectionSearchContext";
import { LanguageProvider } from "../context/LanguageContext";
import { ThemeProvider } from "../context/ThemeContext";
import { useShopify } from "../context/ShopifyContext";
import { FilmGrainOverlay } from "./FilmGrainOverlay";
import { NavigationArchive } from "./NavigationArchive";
import { ShoppingCart } from "./ShoppingCart";
import { SiteSeo } from "./SiteSeo";

function RootContent() {
  const { isCartOpen, closeCart } = useShopify();
  const location = useLocation();

  /** Reset scroll on route changes only. Locale query changes must preserve cinematic hero progress. */
  useLayoutEffect(() => {
    if (location.hash) return;
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div 
      // overflow-x-hidden computes overflow-y:auto and breaks sticky descendants (cinematic hero).
      className="min-h-screen w-full overflow-x-clip relative" 
      style={{ 
        position: 'relative',
        backgroundColor: '#0A0E14'
      }}
    >
      <SiteSeo />
      <ShoppingCart isOpen={isCartOpen} onClose={closeCart} />

      {/* Global Film Grain Overlay */}
      <FilmGrainOverlay />

      {/* Global Navigation */}
      <NavigationArchive />

      <Outlet />
    </div>
  );
}

export function Root() {
  return (
    <ThemeProvider>
      <CollectionSearchProvider>
        <LanguageProvider>
          <RootContent />
        </LanguageProvider>
      </CollectionSearchProvider>
    </ThemeProvider>
  );
}
