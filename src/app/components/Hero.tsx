import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";

const BOTTLE_IMAGE = "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400";

export function Hero() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const { scrollYProgress } = useScroll();

  // Spring damping to simulate physical friction when pulling out
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Derive current step from scroll progress
  const currentStep = smoothProgress.get() < 0.3 ? 1 : smoothProgress.get() < 0.7 ? 2 : 3;
  
  // Layer 3: Sleeve slides up with gravity
  const sleeveY = useTransform(smoothProgress, [0, 0.3], ["0%", "-120%"]);
  const sleeveOpacity = useTransform(smoothProgress, [0, 0.25, 0.3], [1, 0.8, 0]);

  // Layer 2: Acetate blur and opacity changes, simulating light refraction
  const acetateBlur = useTransform(smoothProgress, [0.3, 0.6], [8, 0]);
  const acetateOpacity = useTransform(smoothProgress, [0.3, 0.5, 0.8], [0, 1, 0]);

  // Layer 1: Photo card scaling for depth
  const photoScale = useTransform(smoothProgress, [0.5, 1], [1.15, 1]);
  
  // Bottle floating with slight rotation, like in liquid
  const bottleFloating = useTransform(smoothProgress, [0, 1], [30, -30]);
  const bottleRotate = useTransform(smoothProgress, [0, 0.5, 1], [-2, 2, -2]);

  // Scanning line
  const scanLineY = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className="relative h-[300vh]" style={{ position: 'relative' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#0A0E14' }}>
        
        {/* Coordinate grid overlay - visible only in layer 1 */}
        <motion.div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none z-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(26,26,26,1) 0.5px, transparent 0.5px),
              linear-gradient(to bottom, rgba(26,26,26,1) 0.5px, transparent 0.5px)
            `,
            backgroundSize: '40px 40px',
          }}
          animate={{ opacity: currentStep === 3 ? 0.02 : 0 }}
        />

        {/* Film grain - subtle */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
        />

        {/* Scanning line effect */}
        <motion.div 
          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/20 to-transparent z-50 pointer-events-none"
          style={{ 
            y: scanLineY,
            opacity: 0.2,
          }}
        />

        {/* Corner marks - Archive aesthetic */}
        <motion.div 
          className="absolute top-8 left-8 w-12 h-12 border-t-[0.5px] border-l-[0.5px] z-50"
          style={{ borderColor: 'rgba(26,26,26,0.1)' }}
          animate={{ opacity: currentStep === 3 ? 1 : 0 }}
        />
        <motion.div 
          className="absolute top-8 right-8 w-12 h-12 border-t-[0.5px] border-r-[0.5px] z-50"
          style={{ borderColor: 'rgba(26,26,26,0.1)' }}
          animate={{ opacity: currentStep === 3 ? 1 : 0 }}
        />
        <motion.div 
          className="absolute bottom-8 left-8 w-12 h-12 border-b-[0.5px] border-l-[0.5px] z-50"
          style={{ borderColor: 'rgba(26,26,26,0.1)' }}
          animate={{ opacity: currentStep === 3 ? 1 : 0 }}
        />
        <motion.div 
          className="absolute bottom-8 right-8 w-12 h-12 border-b-[0.5px] border-r-[0.5px] z-50"
          style={{ borderColor: 'rgba(26,26,26,0.1)' }}
          animate={{ opacity: currentStep === 3 ? 1 : 0 }}
        />

        {/* Archive metadata - top right */}
        <motion.div 
          className="absolute top-12 right-12 text-right z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: currentStep === 3 ? 0.2 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <p 
            className="text-[7px] tracking-[0.3em] font-mono mb-1"
            style={{ color: '#1A1A1A' }}
          >
            UNBOXING_HERO.SWY
          </p>
          <p 
            className="text-[7px] tracking-[0.3em] font-mono opacity-60"
            style={{ color: '#1A1A1A' }}
          >
            2026.03.07
          </p>
        </motion.div>

        {/* Timestamp - bottom left */}
        <motion.div 
          className="absolute bottom-12 left-12 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: currentStep === 3 ? 0.15 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <p 
            className="text-[7px] tracking-[0.3em] font-mono"
            style={{ color: '#1A1A1A' }}
          >
            14:32:18 UTC+8
          </p>
        </motion.div>
        
        {/* Vertical sidebar navigation - Art Exhibition style */}
        <div className="fixed left-0 top-0 h-screen flex flex-col justify-between py-12 px-6 z-50">
          <div className="flex flex-col gap-8">
            <button 
              onClick={() => navigate('/')}
              className="text-[10px] tracking-[0.3em] rotate-180 opacity-60 hover:opacity-100 transition-opacity"
              style={{ 
                writingMode: 'vertical-rl',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.3em',
              }}
            >
              SWY
            </button>
          </div>
          
          {/* Step indicators with file system labels */}
          <div className="flex flex-col gap-3 items-center">
            {[
              { step: 1, label: 'SLEEVE' },
              { step: 2, label: 'ACETATE' },
              { step: 3, label: 'REVEAL' }
            ].map(({ step, label }) => (
              <div key={step} className="flex flex-col items-center gap-1">
                <div
                  className="transition-all duration-300"
                  style={{
                    width: currentStep === step ? '2px' : '1px',
                    height: currentStep === step ? '32px' : '16px',
                    backgroundColor: currentStep === step ? '#1A1A1A' : 'rgba(26,26,26,0.2)',
                  }}
                />
                {currentStep === step && (
                  <p 
                    className="text-[6px] tracking-wider opacity-30 font-mono rotate-180"
                    style={{ 
                      writingMode: 'vertical-rl',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {label}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Layer 1: 內盒底層 (Cushioning & Photo Card) */}
        <motion.div
          style={{ scale: photoScale }}
          className="absolute inset-0 z-10"
        >
          {/* 藍調場景照 - 120 底片質感 */}
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(10,14,20,0.6), rgba(10,14,20,0.6)), url(https://images.unsplash.com/photo-1530538987395-032d1800fdd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBib29rc2hlbGYlMjB2aW50YWdlJTIwZmlsbXxlbnwxfHx8fDE3NzIyNjY2NjV8MA&ixlib=rb-4.1.0&q=80&w=1080)`,
              filter: 'grayscale(0.5) contrast(1.15)',
            }}
          />
          
          {/* 瓶身物件：帶有浮力感與旋轉 */}
          <motion.div
            style={{ 
              y: bottleFloating,
              rotate: bottleRotate,
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative w-[200px] h-[320px]">
              {/* 瓶身實拍 */}
              <div 
                className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${BOTTLE_IMAGE})`,
                  filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))',
                }}
              />
              
              {/* 40mm x 60mm 瓶身標籤 - 紙張凸印效果 */}
              <div 
                className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center px-4 py-6"
                style={{
                  width: '80px',
                  height: '120px',
                  backgroundColor: '#F2F0ED',
                  border: '0.5px solid rgba(26, 26, 26, 0.15)',
                  borderRadius: '1px',
                  boxShadow: '1px 1px 0px rgba(0,0,0,0.05)',
                  fontFamily: 'var(--font-serif)',
                }}
              >
                <p className="text-[10px] tracking-[0.2em] mb-2">SWY</p>
                <p className="text-[6px] opacity-40 tracking-widest" style={{ fontFamily: 'var(--font-sans)' }}>
                  40 × 60mm
                </p>
              </div>
            </div>
          </motion.div>

          {/* Archive info overlay - only visible in final step */}
          <motion.div
            className="absolute bottom-16 right-16 text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: currentStep === 3 ? 0.3 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[8px] tracking-[0.3em] font-mono mb-2" style={{ color: '#F2F0ED' }}>
              LABEL SPEC
            </p>
            <p className="text-[7px] tracking-wider font-mono opacity-60" style={{ color: '#F2F0ED' }}>
              40mm × 60mm
            </p>
            <p className="text-[7px] tracking-wider font-mono opacity-60" style={{ color: '#F2F0ED' }}>
              EGGSHELL PAPER
            </p>
          </motion.div>
        </motion.div>

        {/* Layer 2: 白墨膠片層 (Acetate) */}
        <motion.div
          style={{ 
            backdropFilter: acetateBlur.get() !== undefined ? `blur(${acetateBlur.get()}px) contrast(1.05)` : 'blur(8px) contrast(1.05)',
            opacity: acetateOpacity,
          }}
          className="absolute inset-0 z-20 flex items-center justify-center"
        >
          <div 
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(10, 14, 20, 0.5)',
            }}
          />
          
          <div className="relative max-w-3xl text-center px-10">
            {/* Archive marker */}
            <motion.div 
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: currentStep === 2 ? 0.3 : 0 }}
            >
              <div className="w-12 h-[0.5px] bg-white/20" />
              <p 
                className="text-[8px] tracking-[0.5em] uppercase font-mono"
                style={{ color: '#FFFFFF' }}
              >
                Layer 02 / Acetate
              </p>
              <div className="w-12 h-[0.5px] bg-white/20" />
            </motion.div>

            {/* White ink printed text - Art Exhibition style */}
            <h2 
              className="mb-8"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '3.5rem',
                fontWeight: 400,  // ✅ Changed from 300 to 400 (Avenir Regular)
                letterSpacing: '0.15em',
                lineHeight: 1.3,
                color: '#FFFFFF',
                textTransform: 'uppercase',
              }}
            >
              Every Scent
            </h2>
            <p 
              className="mb-12"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '2.5rem',
                fontWeight: 400,  // ✅ Changed from 300 to 400 (Avenir Regular)
                fontStyle: 'normal',  // ✅ Changed from 'italic' to 'normal'
                letterSpacing: '0.05em',
                lineHeight: 1.4,
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              Is a Drift Bottle
            </p>
            
            {/* Minimal divider line */}
            <div className="w-32 h-[0.5px] bg-white/30 mx-auto mb-6" />
            
            <p 
              className="text-[9px] tracking-[0.4em] uppercase opacity-50 font-mono"
              style={{
                fontFamily: 'var(--font-sans)',
                color: '#FFFFFF',
              }}
            >
              Carrying Forgotten Memories
            </p>
          </div>
        </motion.div>

        {/* Layer 3: 外部封套 (Sleeve) - 極簡幾何 */}
        <motion.div
          style={{ 
            y: sleeveY, 
            opacity: sleeveOpacity,
            backgroundColor: '#FAFAF9',
          }}
          className="absolute inset-0 z-30 flex items-center justify-center"
        >
          <div className="text-center">
            {/* Geometric frame */}
            <div 
              className="relative inline-block p-20 mb-12"
              style={{
                border: '0.5px solid rgba(0,0,0,0.08)',
              }}
            >
              <div 
                className="w-48 h-48 bg-contain bg-center bg-no-repeat opacity-60"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1709232584134-d259fbf93522?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm93JTIwYmlyZCUyMGlsbHVzdHJhdGlvbiUyMGJsYWNrfGVufDF8fHx8MTc3MjI2NjY2NHww&ixlib=rb-4.1.0&q=80&w=1080)`,
                  filter: 'grayscale(1) contrast(1.5)',
                }}
              />
            </div>
            
            {/* Bold typography */}
            <h1 
              className="mb-4"
              style={{ 
                fontFamily: 'var(--font-sans)',
                fontSize: '5rem',
                fontWeight: 900,  // ✅ Avenir Black for main titles
                letterSpacing: '0.25em',
                color: '#1A1A1A',
              }}
            >
              SWY
            </h1>
            <p 
              className="text-[9px] opacity-30 tracking-[0.5em] uppercase mb-20 font-mono"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Digital Unboxing
            </p>

            {/* Scroll indicator with circle */}
            <div className="flex items-center justify-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  border: '0.5px solid rgba(0,0,0,0.15)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3L8 13M8 13L12 9M8 13L4 9" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
                </svg>
              </div>
              <p 
                className="text-[9px] tracking-[0.3em] opacity-30 font-mono"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                SCROLL
              </p>
            </div>
          </div>

          {/* Minimal footer line */}
          <div 
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '0.5px',
              backgroundColor: 'rgba(0,0,0,0.05)',
            }}
          />
        </motion.div>

        {/* Right side navigation */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-6">
          <button
            onClick={() => navigate('/archive')}
            className="text-[9px] tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity duration-300 font-mono"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Archive
          </button>
          <div className="w-[0.5px] h-12 bg-black/10 mx-auto" />
          <p className="text-[8px] opacity-20 tracking-wider font-mono" style={{ fontFamily: 'var(--font-sans)' }}>
            {currentStep}/3
          </p>
        </div>
      </div>
    </div>
  );
}