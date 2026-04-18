import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { products } from "../data/products";
import { DriftBottleScrollItem } from "./DriftBottleScrollItem";

export function DriftBottleScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const isResettingRef = useRef(false);
  
  // Manual progress control (0 to 1)
  const progress = useMotionValue(0);
  
  // Get viewport width for calculation
  const [viewportWidth, setViewportWidth] = useState(0);
  
  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };
    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);
  
  // Linear smooth scroll - convert vw to px based on actual viewport
  // 0 = 0px (Product 1), 1 = -(products.length - 1) * viewportWidth (Product 8)
  const xRaw = useTransform(
    progress, 
    [0, 1], 
    [0, -(products.length - 1) * viewportWidth]
  );
  
  // Add spring physics for smooth, weighty motion - optimized to prevent overshoot
  const x = useSpring(xRaw, {
    stiffness: 200,  // Reduced for smoother, controlled motion
    damping: 50,     // Increased to prevent overshoot (critical damping)
    mass: 1.0        // Increased for more deliberate, weighty feel
  });
  
  // Calculate display progress from raw X position (before spring, for accurate sync)
  const progressDisplay = useTransform(
    xRaw,
    [0, -(products.length - 1) * viewportWidth],
    [0, 1]
  );
  
  // Bottle animations
  const bottleRotate = useTransform(progress, [0, 1], [-5, 5]);
  const bottleFloat = useTransform(progress, [0, 0.25, 0.5, 0.75, 1], [0, -15, 0, 15, 0]);

  // Track current product index based on raw X position (before spring)
  useEffect(() => {
    const unsubscribe = xRaw.on('change', (latest) => {
      // Calculate product index directly from raw X position
      // X range: 0 to -700vw for 8 products
      // Each product is 100vw apart
      const productIndex = Math.round(Math.abs(latest) / viewportWidth);
      setCurrentProductIndex(Math.min(productIndex, products.length - 1));
    });
    return () => unsubscribe();
  }, [xRaw, viewportWidth]);

  // Handle reset when section is far away
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container || isResettingRef.current) return;
      
      const rect = container.getBoundingClientRect();
      
      // Reset progress when section is completely out of view
      const isFarAbove = rect.bottom < -window.innerHeight;
      const isFarBelow = rect.top > window.innerHeight * 2;
      
      if (isFarAbove || isFarBelow) {
        // Reset progress silently
        progress.set(0, false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [progress]);

  // Scroll lock with manual progress control - ONLY lock when in active range
  useEffect(() => {
    let snapTimeout: NodeJS.Timeout | null = null;
    let lastScrollTime = 0;
    
    // Snap to nearest product when user stops scrolling
    const snapToNearest = () => {
      const currentProgress = progress.get();
      const totalProducts = products.length;
      
      // Calculate which product we're closest to
      const currentIndex = currentProgress * (totalProducts - 1);
      const targetIndex = Math.round(currentIndex);
      const targetProgress = targetIndex / (totalProducts - 1);
      
      // Always snap to nearest product (no threshold check)
      // This ensures we always end up perfectly aligned
      progress.set(targetProgress);
    };
    
    // Desktop: Mouse wheel handler
    const handleWheel = (e: WheelEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const delta = e.deltaY;
      const isScrollingDown = delta > 0;
      const currentProgress = progress.get();
      
      // Define the red box activation zone (based on viewport)
      const activationZone = {
        top: window.innerHeight * 0.13,      // ~130px from top (below nav)
        bottom: window.innerHeight * 0.91,   // ~60px from bottom (above progress)
        left: window.innerWidth * 0.125,     // ~125px from left
        right: window.innerWidth * 0.865,    // ~135px from right
      };
      
      // Check if mouse cursor is inside the red box activation zone
      const isMouseInZone = 
        e.clientY >= activationZone.top &&
        e.clientY <= activationZone.bottom &&
        e.clientX >= activationZone.left &&
        e.clientX <= activationZone.right;
      
      // Also check if section is in viewport
      const isSectionInView = rect.top <= 0 && rect.bottom > window.innerHeight * 0.5;
      
      // Only activate when mouse is in zone AND section is visible
      const isInActiveRange = isMouseInZone && isSectionInView;
      
      // Only activate horizontal scroll when in active range AND not at boundaries
      const shouldLock = isInActiveRange && (
        (currentProgress > 0 && currentProgress < 1) || // In middle of products
        (currentProgress === 0 && isScrollingDown) ||   // At start, scrolling down
        (currentProgress === 1 && !isScrollingDown)     // At end, scrolling up
      );
      
      // Clear any pending snap
      if (snapTimeout) {
        clearTimeout(snapTimeout);
        snapTimeout = null;
      }
      
      if (shouldLock) {
        e.preventDefault();
        lastScrollTime = Date.now();
        
        // Calculate current position relative to products
        const totalProducts = products.length;
        const currentIndex = currentProgress * (totalProducts - 1);
        const nearestIndex = Math.round(currentIndex);
        const distanceFromNearest = Math.abs(currentIndex - nearestIndex);
        
        // Simplified magnetic resistance - only apply very close to products
        let scrollResistance = 1;
        if (distanceFromNearest < 0.15) {
          // Linear falloff in the final 15% approach
          scrollResistance = 0.3 + (distanceFromNearest / 0.15) * 0.7;
        }
        
        if (isScrollingDown && currentProgress < 1) {
          // Scrolling down through products
          const baseIncrement = 0.003; // Increased for more responsive feel
          const increment = baseIncrement * scrollResistance;
          const newProgress = Math.min(1, currentProgress + increment);
          progress.set(newProgress);
          snapTimeout = setTimeout(snapToNearest, 120);
        } else if (!isScrollingDown && currentProgress > 0) {
          // Scrolling up through products
          const baseDecrement = 0.003; // Increased for more responsive feel
          const decrement = baseDecrement * scrollResistance;
          const newProgress = Math.max(0, currentProgress - decrement);
          progress.set(newProgress);
          snapTimeout = setTimeout(snapToNearest, 120);
        }
      }
      // Otherwise, allow normal page scroll
    };

    // Mobile: Touch swipe handler
    let touchStartX = 0;
    let touchStartProgress = 0;
    let isTouching = false;

    const handleTouchStart = (e: TouchEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const isSectionInView = rect.top <= 0 && rect.bottom > window.innerHeight * 0.5;
      
      if (isSectionInView) {
        touchStartX = e.touches[0].clientX;
        touchStartProgress = progress.get();
        isTouching = true;
        
        // Clear any pending snap when touch starts
        if (snapTimeout) {
          clearTimeout(snapTimeout);
          snapTimeout = null;
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching) return;

      const touchCurrentX = e.touches[0].clientX;
      const deltaX = touchCurrentX - touchStartX;
      
      // Convert pixel movement to progress (negative because swipe left = move forward)
      const rawDeltaProgress = -(deltaX / viewportWidth);
      
      // Calculate new progress - simpler approach without complex damping
      let newProgress = touchStartProgress + rawDeltaProgress;
      
      // Clamp to valid range
      newProgress = Math.max(0, Math.min(1, newProgress));
      progress.set(newProgress);
      
      // Prevent vertical scroll while swiping horizontally
      if (Math.abs(deltaX) > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (isTouching) {
        isTouching = false;
        // Immediate snap on touch end
        snapToNearest();
      }
    };

    // Add desktop wheel listener
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Add mobile touch listeners
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      if (snapTimeout) clearTimeout(snapTimeout);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [progress, viewportWidth]);

  return (
    <section 
      ref={containerRef}
      className="relative z-30"
      style={{ 
        backgroundColor: '#0A0A0A',
        height: '100vh', // Changed to single viewport height
        minHeight: '100vh',
        position: 'relative' // ✅ Added for scroll offset calculation
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Horizontal scroll container */}
        <motion.div
          style={{ x }}
          className="flex gap-0"
        >
          {products.map((product, index) => (
            <DriftBottleScrollItem
              key={product.id}
              product={product}
              index={index}
              scrollYProgress={progress}
              bottleRotate={bottleRotate}
              bottleFloat={bottleFloat}
            />
          ))}
        </motion.div>

        {/* Product counter - Top Left */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-[100]">
          <motion.p 
            key={currentProductIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs sm:text-[10px] tracking-[0.3em] uppercase whitespace-nowrap"
            style={{ 
              fontFamily: 'var(--font-sans)', 
              color: '#F2F0ED',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)'
            }}
          >
            {String(currentProductIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
          </motion.p>
        </div>

        {/* Scroll/Swipe Guidance - Above progress bar, shows on first product */}
        <motion.div
          className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4 pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: currentProductIndex === 0 ? 0.4 : 0 }}
          transition={{ 
            duration: 1.5,
            repeat: currentProductIndex === 0 ? Infinity : 0,
            repeatType: "reverse",
            repeatDelay: 0.5
          }}
        >
          <svg 
            width="20" 
            height="10" 
            viewBox="0 0 24 12" 
            fill="none"
            className="opacity-60 rotate-180"
          >
            <path 
              d="M0 6L18 6M18 6L13 1M18 6L13 11" 
              stroke="#F2F0ED" 
              strokeWidth="0.5"
            />
          </svg>
          <p 
            className="text-[8px] tracking-[0.4em] uppercase whitespace-nowrap"
            style={{ fontFamily: 'var(--font-sans)', color: '#F2F0ED' }}
          >
            <span className="hidden sm:inline">Scroll to explore</span>
            <span className="sm:hidden">Swipe to explore</span>
          </p>
          <svg 
            width="20" 
            height="10" 
            viewBox="0 0 24 12" 
            fill="none"
            className="opacity-60"
          >
            <path 
              d="M0 6L18 6M18 6L13 1M18 6L13 11" 
              stroke="#F2F0ED" 
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>

        {/* Scroll progress indicator - Bottom */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4 z-50">
          <div className="w-32 sm:w-48 h-[0.5px] bg-white/10 overflow-hidden">
            <motion.div
              style={{ scaleX: progressDisplay }}
              className="h-full bg-white/30 origin-left"
            />
          </div>
          <p className="text-[8px] opacity-20 tracking-wider whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)', color: '#F2F0ED' }}>
            {String(currentProductIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
          </p>
        </div>
      </div>
    </section>
  );
}