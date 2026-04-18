import { Outlet } from "react-router";
import { CollectionSearchProvider } from "../context/CollectionSearchContext";
import { LanguageProvider } from "../context/LanguageContext";
import { ThemeProvider } from "../context/ThemeContext";
import { useShopify } from "../context/ShopifyContext";
import { FilmGrainOverlay } from "./FilmGrainOverlay";
import { NavigationArchive } from "./NavigationArchive";
import { ShoppingCart } from "./ShoppingCart";

function RootContent() {
  const { isCartOpen, closeCart } = useShopify();

  return (
    <div 
      className="min-h-screen w-full overflow-x-hidden relative" 
      style={{ 
        position: 'relative',
        backgroundColor: '#0A0E14'
      }}
    >
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
