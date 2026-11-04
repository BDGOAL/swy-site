import { useLayoutEffect } from "react";
import { useLocation } from "react-router";
import { CollectionGrid } from "./CollectionGrid";
import { BrandDNA } from "./BrandDNA";
import { BrandVision } from "./BrandVision";
import { AcetateReveal } from "./AcetateReveal";
import { ConversionSection } from "./ConversionSection";
import { ArchiveFooter } from "./ArchiveFooter";
import { CinematicHeroV67 } from "./CinematicHeroV67";
import { SECTION_IDS } from "../constants/landingSectionIds";

const HASH_IDS = new Set<string>(Object.values(SECTION_IDS));
function useLandingHashAlign() {
  const { pathname,hash } = useLocation();
  useLayoutEffect(() => {
    if(pathname!=="/" && pathname!=="/landing") return;
    const id=hash.replace(/^#/,"");
    if(!id || !HASH_IDS.has(id)) return;
    let cancelled=false;
    const run=()=>{ if(cancelled) return; document.getElementById(id)?.scrollIntoView({block:"start",behavior:"auto"}); };
    const raf=requestAnimationFrame(()=>requestAnimationFrame(run));
    return ()=>{cancelled=true;cancelAnimationFrame(raf);};
  },[pathname,hash]);
}
export function LandingPage(){
  useLandingHashAlign();
  return <div className="relative w-full">
    <CinematicHeroV67 />
    <div id={SECTION_IDS.archive} className="landing-scroll-target relative z-0"><CollectionGrid /></div>
    <div id={SECTION_IDS.storyContinue} className="landing-scroll-target relative z-0"><BrandDNA/><BrandVision/></div>
    <AcetateReveal/>
    <ConversionSection/>
    <ArchiveFooter/>
  </div>;
}
