import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./CinematicHeroV67.css";

const LOGO = "https://cdn.shopify.com/s/files/1/0268/0098/0048/files/SWY-fif-05.png?v=1776831372";
const SCENES = [
  { code: "01", label: { en: "THE JOURNEY", zh: "漂流" },
    copy: { en: "Every scent carries a part of you, into a world you've yet to know.", zh: "每一縷香氣，都帶著你的一部分，飄向一個尚未相識的世界。" } },
  { code: "02", label: { en: "THE ARRIVAL", zh: "抵岸" },
    copy: { en: "And sometimes, the things we let go travel further than we ever imagined.", zh: "而有時，我們交託出去的心事，會抵達比想像中更遠的地方。" } },
  { code: "03", label: { en: "THE CONNECTION", zh: "相遇" },
    copy: { en: "Somewhere, someone will find a little of themselves in your story.", zh: "在世界某個角落，總有人會在你的故事裡，找到一點自己的影子。" } },
] as const;
/** Split only at existing punctuation. Preserve every approved word and mark. */
function punctuationClauses(copy: string): string[] {
  return copy.split(/(?<=[，。！？；、,.!?;:])\s*/u).map(part => part.trim()).filter(Boolean);
}
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ramp = (x: number, a: number, b: number) => { const v = clamp((x-a)/(b-a)); return v*v*(3-2*v); };

export function CinematicHeroV67() {
  const { locale } = useLanguage();
  const lang = locale === "en" ? "en" : "zh";
  const el = useRef<HTMLElement>(null);
  const raf = useRef(0);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const target = el.current;
    if (!target) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReduceMotion(preference.matches);
    const measure = () => {
      raf.current = 0;
      const distance = Math.max(1, target.offsetHeight - window.innerHeight);
      const p = clamp(-target.getBoundingClientRect().top / distance);
      setProgress(old => Math.abs(p-old) >= .002 ? p : old);
    };
    const schedule = () => { if (!raf.current) raf.current = requestAnimationFrame(measure); };
    onMotion();
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    preference.addEventListener("change", onMotion);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      preference.removeEventListener("change", onMotion);
    };
  }, []);

  const cut1 = ramp(progress,.23,.43), cut2 = ramp(progress,.59,.80);
  const shotAlpha = [1-cut1,cut1*(1-cut2),cut2];
  const textAlpha = [
    ramp(progress,.14,.25)*(1-ramp(progress,.35,.45)),
    ramp(progress,.44,.54)*(1-ramp(progress,.64,.75)),
    ramp(progress,.79,.91),
  ];
  const scene = progress < .34 ? 0 : progress < .70 ? 1 : 2;
  const sceneHeading = lang === "en" ? "A STORY FINDS ITS SHORE" : "故事終有彼岸";
  return <section className={"swy-v67 swy-v67--"+lang} ref={el} aria-label={lang === "en" ? "SWY brand film" : "SWY 品牌故事"}>
    <div className="swy-v67__stage">
      {SCENES.map((item,i) => <div key={item.code} className="swy-v67__shot" style={{opacity: shotAlpha[i]}} aria-hidden="true">
        <picture className="swy-v67__picture">
          <source media="(max-width: 767px)" srcSet={"/hero/v67/m"+(i+1)+".webp"} />
          <img className="swy-v67__image" src={"/hero/v67/d"+(i+1)+".webp"} alt="" width={1672} height={941}
            loading="eager" fetchPriority={i===0 ? "high" : "auto"} decoding="async"
            style={{transform:reduceMotion ? "none" : "scale("+(1.008+.016*clamp((progress-i*.28)/.7))+")"}} />
        </picture>
      </div>)}
      <div className="swy-v67__transition" style={{opacity:.32*Math.sin(Math.PI*cut1)+.27*Math.sin(Math.PI*cut2)}} aria-hidden="true" />
      <div className="swy-v67__vignette" aria-hidden="true" />
      <div className="swy-v67__eyebrow">{sceneHeading}</div>
      <div className="swy-v67__logo" style={{opacity:1-ramp(progress,.055,.145)}} aria-hidden={progress>.145}>
        <img src={LOGO} alt="SWY — Scent With You" width={1047} height={510} />
      </div>
      <div className="swy-v67__opening-signature" style={{opacity:1-ramp(progress,.11,.20)}} aria-hidden="true">
        <span>Scent With You.</span><em>Tell Me Your Story.</em>
      </div>
      {SCENES.map((item,i) => <div key={item.code} className={"swy-v67__text swy-v67__text--"+(i+1)}
        style={{opacity:textAlpha[i],visibility:textAlpha[i]<.004?"hidden":"visible",transform:reduceMotion?undefined:"translateY("+((1-textAlpha[i])*12)+"px)"}} aria-hidden={textAlpha[i]<.5}>
        <small>{item.code} / {item.label[lang]}</small>
        <h2 aria-label={item.copy[lang]}>{punctuationClauses(item.copy[lang]).map((clause, index) => <span key={index} className="swy-v67__punctuation-line" aria-hidden="true">{clause}</span>)}</h2>
        {i===2 && <div className="swy-v67__closing-signature"><span>Scent With You.</span><em>Tell Me Your Story.</em></div>}
      </div>)}
      <div className="swy-v67__footer"><span>{lang==="en" ? "SCENT WITH YOU / A STORY FINDS ITS SHORE" : "SCENT WITH YOU / 故事終有彼岸"}</span><span>{String(scene+1).padStart(2,"0")} / 03</span></div>
      <div className="swy-v67__scroll" style={{opacity:1-ramp(progress,.01,.15)}} aria-hidden="true">{lang==="en"?"SCROLL TO EXPLORE":"向下閱讀"}</div>
    </div>
  </section>;
}
