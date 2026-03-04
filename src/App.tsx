import React from "react";
import { useState, useEffect, useRef } from "react";

const Icon = ({ d, size = 24, style = {} }: { d: any; size?: number; style?: any }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const Phone    = p => <Icon {...p} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>;
const Arrow    = p => <Icon {...p} d={["M5 12h14","M12 5l7 7-7 7"]}/>;
const VideoI   = p => <svg width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={p.style}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;
const MicI     = p => <Icon {...p} d={["M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z","M19 10v2a7 7 0 0 1-14 0v-2","M12 19v4","M8 23h8"]}/>;
const BldI     = p => <Icon {...p} d={["M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z","M6 12H4a2 2 0 0 0-2 2v8h4","M18 9h2a2 2 0 0 1 2 2v11h-4","M10 6h4","M10 10h4","M10 14h4","M10 18h4"]}/>;
const StarI    = p => <Icon {...p} d={["m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z","M5 3v4","M19 17v4","M3 5h4","M17 19h4"]}/>;
const ChkI     = p => <Icon {...p} d={["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","m9 12 2 2 4-4"]}/>;
const MenuI    = p => <Icon {...p} d={["M3 12h18","M3 6h18","M3 18h18"]}/>;
const CloseI   = p => <Icon {...p} d={["M18 6 6 18","m6 6 12 12"]}/>;
const MailI    = p => <Icon {...p} d={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","m22 6-10 7L2 6"]}/>;
const PinI     = p => <Icon {...p} d={["M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z","M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"]}/>;

/* Scroll reveal */
function useReveal(thr = 0.1): [React.RefObject<any>, boolean] {
  const ref = useRef<any>(null); const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: thr });
    o.observe(el); return () => o.disconnect();
  }, []);
  return [ref, v];
}
function Reveal({ children, delay = 0, y = 22, style = {}, className = "" }: { children: any; delay?: number; y?: number; style?: any; className?: string }) {
  const [ref, v] = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: v?1:0, transform: v?"translateY(0)":`translateY(${y}px)`, transition:`opacity .7s cubic-bezier(.22,1,.36,1) ${delay}s,transform .7s cubic-bezier(.22,1,.36,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

/* Ticker */
function Ticker({ items, speed = 50, dir = 1 }: { items: any; speed?: number; dir?: number }) {
  const [x, setX] = useState(0);
  const ref = useRef<any>(null); const raf = useRef<any>(); const lt = useRef<any>();
  useEffect(() => {
    const fn = (t: number) => {
      if (!lt.current) lt.current = t;
      const dt = (t - lt.current) / 1000; lt.current = t;
      if (ref.current) {
        const half = ref.current.scrollWidth / 2;
        setX((p: number) => { const n = p + speed * dt * dir; return Math.abs(n) >= half ? 0 : n; });
      }
      raf.current = requestAnimationFrame(fn);
    };
    raf.current = requestAnimationFrame(fn);
    return () => cancelAnimationFrame(raf.current);
  }, [speed, dir]);
  return (
    <div style={{ overflow:"hidden" }}>
      <div ref={ref} style={{ display:"flex", transform:`translateX(${-x}px)`, willChange:"transform" }}>
        {items}{items}
      </div>
    </div>
  );
}

/* Counter */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const [ref, vis] = useReveal(); const done = useRef<boolean>(false);
  useEffect(() => {
    if (!vis || done.current) return; done.current = true;
    const s = performance.now();
    const fn = (t: number) => { const p = Math.min((t-s)/1800,1); setV(Math.round((1-(1-p)**3)*to)); if(p<1) requestAnimationFrame(fn); };
    requestAnimationFrame(fn);
  }, [vis, to]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

export default function App() {
  const [tab, setTab] = useState("A");
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn);
  }, []);

  const clients = ["삼성전자","SeAH","현대자동차","SK하이닉스","코오롱","LG","한국수력원자력","LOTTE","국방부","CJ그룹","LINEPlus","GS칼텍스","포스코","한화"];
  const navItems = ["영상프로덕션","사운드프로덕션","콘텐츠 마케팅","브랜드","공지"];

  const studios = [
    { id:"A", title:"Studio A", sub:"촬영·영상", items:["촬영·포토 스튜디오","라이브 커머스 방송","크리에이터 영상 제작"] },
    { id:"B", title:"Studio B", sub:"사운드·음원", items:["녹음·사운드 스튜디오","작곡·음원 발매","크리에이터 음원 제작"] },
    { id:"Edit", title:"Edit Room", sub:"편집·후반", items:["영상 편집실","색보정 작업실","후반 작업 공간"] },
  ];

  const powers = [
    { lbl:"Software Power", accent:"#7c3aed", bg:"#f5f3ff", iconBg:"#ede9fe", border:"#ddd6fe",
      title:"검증된 콘텐츠 제작\n파트 별 전문가",
      desc:"기획/구성/촬영/편집/사운드 각 파트 전문가가 최적화된 솔루션을 제시합니다.",
      certs:["영상콘텐츠 기술평가 'T4' 등급","콘텐츠 기술 벤처기업","수출/혁신바우처 수행기관","대중문화예술기획 인증기업"] },
    { lbl:"Hardware Power", accent:"#0369a1", bg:"#f0f9ff", iconBg:"#e0f2fe", border:"#bae6fd",
      title:"인하우스\n멀티플렉스 스튜디오",
      desc:"촬영/사운드 프로덕션 스튜디오를 사내 보유, 안정적이고 효율적인 운영.",
      certs:["콘텐츠 기업 창작 전담 부서","콘텐츠 기업 부설 연구소","동영상 직접 생산 확인기업","비디오 제작업 신고기업"] },
    { lbl:"ESG Power", accent:"#047857", bg:"#f0fdf4", iconBg:"#dcfce7", border:"#bbf7d0",
      title:"사회적 책임과 혁신으로\n인정받은 전문 기업",
      desc:"검증된 시스템과 혁신 역량으로 신뢰할 수 있는 영상 서비스를 제공합니다.",
      certs:["메인비즈(MAIN-Biz) 인증","PMS 인증기업","이노비즈(Inno-Biz) 인증","가족친화우수기업 인증"] },
  ];

  const services = [
    { Ic:VideoI, title:"교육 콘텐츠 제작", desc:"끝까지 보게 만드는 교육영상. 시청자 중심 설계로 학습 완강률을 높입니다.", tags:["인터뷰형","인포그래픽형","숏츠형","스톡소스형"], big:true, accent:"#7c3aed", tagBg:"#f5f3ff", tagColor:"#7c3aed", tagBorder:"#ddd6fe" },
    { Ic:MicI,   title:"조직문화 프로그램", desc:"MZ세대부터 시니어까지 모두가 즐기는 참여형 사내 프로그램 기획·운영.", tags:["노래경연대회","핵심가치송","기념 이벤트"], big:true, accent:"#0369a1", tagBg:"#f0f9ff", tagColor:"#0369a1", tagBorder:"#bae6fd" },
    { Ic:BldI,   title:"기업 홍보영상", desc:"기업PR · 제품소개 · 브랜드필름\n기업의 가치를 영상 한 편에.", tags:[], accent:"#be185d" },
    { Ic:StarI,  title:"모션그래픽 / 3D", desc:"인포그래픽 · 2D/3D 애니메이션\n복잡한 정보를 직관적으로.", tags:[], accent:"#d97706" },
    { Ic:VideoI, title:"행사 / 이벤트 영상", desc:"오프닝 · 시상식 · 현장 기록\n행사의 품격을 높이는 영상.", tags:[], accent:"#0f766e" },
  ];

  const portfolio = [
    { title:"삼화페인트 기업 홍보영상", cat:"기업/제품 홍보", h:260 },
    { title:"LG에너지솔루션 배터리 홍보", cat:"3D 모션그래픽", h:210 },
    { title:"삼성생명 67주년 창립기념", cat:"기업 행사/이벤트", h:280 },
    { title:"무림페이퍼 우수 성과 소개", cat:"뮤직비디오/기획", h:160 },
    { title:"인하대학교 홍보영상", cat:"학교 홍보", h:240 },
    { title:"한수원 사내 노무 교육", cat:"교육 콘텐츠", h:320 },
    { title:"인천 환경보건센터 홍보", cat:"공공기관 홍보", h:190 },
    { title:"플랜두씨 어플 소개 영상", cat:"2D 인포그래픽", h:295 },
  ];

  const logoItems = (
    <>{[...clients,...clients].map((c,i)=>(
      <span key={i} style={{ fontSize:12, fontWeight:700, color:"rgba(240,238,255,.28)", padding:"0 28px", whiteSpace:"nowrap", letterSpacing:"0.06em" }}>{c}</span>
    ))}</>
  );
  const clientRow1 = (
    <>{[...clients,...clients].map((c,i)=>(
      <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"0 24px" }}>
        <div style={{ width:34, height:34, borderRadius:"50%", background:`hsl(${i*24},35%,88%)`, border:`1px solid rgba(0,0,0,.06)`, flexShrink:0 }}/>
        <span style={{ fontSize:14, fontWeight:700, color:"#444", whiteSpace:"nowrap" }}>{c}</span>
      </div>
    ))}</>
  );
  const clientRow2 = (
    <>{[...[...clients].reverse(),...clients].map((c,i)=>(
      <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"0 24px" }}>
        <div style={{ width:34, height:34, borderRadius:"50%", background:`hsl(${i*30+120},30%,86%)`, border:`1px solid rgba(0,0,0,.06)`, flexShrink:0 }}/>
        <span style={{ fontSize:14, fontWeight:700, color:"#444", whiteSpace:"nowrap" }}>{c}</span>
      </div>
    ))}</>
  );

  /* Dark BG token */
  const D = { bg:"#07071a", border:"rgba(255,255,255,.07)", borderA:"rgba(139,122,255,.3)", accent:"#8b7aff", accentL:"#a78bfa", glow:"rgba(139,122,255,.15)", text:"#f0eeff", muted:"rgba(240,238,255,.42)", faint:"rgba(240,238,255,.2)" };

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif", backgroundColor:D.bg, color:D.text, overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none;color:inherit}
        button{font-family:inherit}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#07071a}
        ::-webkit-scrollbar-thumb{background:#8b7aff44;border-radius:99px}

        .hl:hover{color:#a78bfa !important;transition:color .2s}
        .ch-dark{transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s,border-color .35s}
        .ch-dark:hover{transform:translateY(-5px);box-shadow:0 20px 56px rgba(139,122,255,.2);border-color:rgba(139,122,255,.35) !important}
        .ch-light{transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s}
        .ch-light:hover{transform:translateY(-5px);box-shadow:0 16px 48px rgba(0,0,0,.12)}
        .bp{background:linear-gradient(135deg,#7c6ff7,#a78bfa);color:#fff;border:none;cursor:pointer;transition:transform .2s,box-shadow .2s}
        .bp:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(139,122,255,.45)}
        .bo-dark{background:transparent;border:1px solid rgba(255,255,255,.14);color:rgba(240,238,255,.65);cursor:pointer;transition:background .2s,border-color .2s,color .2s}
        .bo-dark:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.28);color:#f0eeff}
        .bo-light{background:#fff;border:1px solid #e5e7eb;color:#333;cursor:pointer;transition:box-shadow .2s,border-color .2s}
        .bo-light:hover{box-shadow:0 4px 16px rgba(0,0,0,.1);border-color:#c4b5fd}
        .pfc .pfo{opacity:0;transition:opacity .3s}
        .pfc:hover .pfo{opacity:1}
        .pfc:hover .pft{transform:scale(1.07)}
        .pft{transition:transform .5s cubic-bezier(.22,1,.36,1)}
        .stab{cursor:pointer;transition:background .25s,border-color .25s,transform .25s}
        .stab:hover{transform:translateX(4px)}
        @keyframes pulse{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.18)}}
        @keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}
        @media(max-width:768px){
          .dnav{display:none !important}
          .mbtn{display:flex !important}
          .hstats{flex-direction:column;gap:24px !important;align-items:center}
          .pgrid{grid-template-columns:1fr !important}
          .sgrid2{grid-template-columns:1fr !important}
          .sgrid3{grid-template-columns:1fr !important}
          .pfgrid{grid-template-columns:1fr 1fr !important}
          .slayout{grid-template-columns:1fr !important}
          .ctabtns{flex-direction:column;align-items:center}
          .vstrip{flex-direction:column !important}
          .foot-inner{flex-direction:column;text-align:center}
          .studioimg{grid-template-columns:1fr !important}
        }
        @media(max-width:440px){.pfgrid{grid-template-columns:1fr !important}}
      `}</style>

      {/* ══ NAV ══ */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:999, height:60, background: scrolled?"rgba(7,7,26,.94)":"transparent", backdropFilter: scrolled?"blur(22px)":"none", borderBottom: scrolled?`1px solid ${D.border}`:"1px solid transparent", transition:"background .4s,border-color .4s", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px" }}>
        <a href="#" style={{ fontSize:16, fontWeight:900, letterSpacing:"-0.02em" }}>SAMSONG <span style={{ color:D.accent }}>E&M</span></a>
        <ul className="dnav" style={{ display:"flex", gap:28, listStyle:"none" }}>
          {navItems.map(n=><li key={n}><a href="#" className="hl" style={{ fontSize:13, color:D.muted, fontWeight:500 }}>{n}</a></li>)}
        </ul>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:12, color:D.faint }}>02-599-1415</span>
          <a href="#" className="bp" style={{ padding:"8px 18px", borderRadius:8, fontSize:12, fontWeight:700 }}>영상 제작 문의</a>
          <button className="mbtn" onClick={()=>setMenu(v=>!v)} style={{ display:"none", background:"none", border:"none", color:D.text, cursor:"pointer", padding:4 }}>
            {menu?<CloseI size={22}/>:<MenuI size={22}/>}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menu && (
        <div style={{ position:"fixed", top:60, left:0, right:0, zIndex:998, background:"rgba(7,7,26,.98)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${D.border}`, padding:"24px 28px 32px" }}>
          <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:20 }}>
            {navItems.map(n=><li key={n}><a href="#" style={{ fontSize:18, fontWeight:700 }} onClick={()=>setMenu(false)}>{n}</a></li>)}
          </ul>
          <div style={{ marginTop:28, paddingTop:24, borderTop:`1px solid ${D.border}`, display:"flex", flexDirection:"column", gap:12 }}>
            <a href="tel:0255991415" style={{ fontSize:14, color:D.muted, display:"flex", alignItems:"center", gap:8 }}><Phone size={16}/> 02-599-1415</a>
            <a href="#" className="bp" style={{ padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:700, textAlign:"center" }}>영상 제작 문의하기</a>
          </div>
        </div>
      )}

      {/* ══ HERO (dark) ══ */}
      <section style={{ minHeight:"auto", display:"flex", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"100px 24px 60px", position:"relative", overflow:"hidden", background:D.bg }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 80% 60% at 50% 110%, rgba(139,122,255,.22), transparent 65%), radial-gradient(ellipse 50% 40% at 15% 0%, rgba(92,124,255,.09), transparent 60%)` }}/>
        <div style={{ position:"absolute", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,122,255,.06), transparent 70%)", top:"50%", left:"50%", animation:"pulse 7s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(139,122,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(139,122,255,.035) 1px,transparent 1px)", backgroundSize:"60px 60px", maskImage:"radial-gradient(ellipse at 50% 50%, black 25%, transparent 75%)" }}/>

        <div style={{ position:"relative", zIndex:2, maxWidth:860, width:"100%" }}>
          <Reveal delay={0}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:999, border:`1px solid ${D.borderA}`, background:D.glow, fontSize:12, fontWeight:600, color:D.accentL, marginBottom:28, letterSpacing:"0.07em" }}>✦ 우리 회사가 찾던</div>
          </Reveal>

          {/* ★ 한 줄 헤드라인 */}
          <Reveal delay={0.1}>
            <h1 style={{ fontSize:"clamp(28px,5vw,58px)", fontWeight:900, lineHeight:1.1, marginBottom:24, letterSpacing:"-0.04em", whiteSpace:"nowrap" }}>
              완벽한 콘텐츠 제작 파트너.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p style={{ fontSize:"clamp(14px,2vw,17px)", color:D.muted, lineHeight:1.8, maxWidth:520, margin:"0 auto 52px" }}>
              17년간 500개 이상의 기업과 함께한 영상 프로덕션 전문 기업
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="hstats" style={{ display:"flex", justifyContent:"center", gap:56, flexWrap:"wrap" }}>
              {[{n:500,s:"+",l:"영상 제작 클라이언트"},{n:3000,s:"+",l:"영상 제작 프로젝트"},{n:17,s:"+",l:"프로덕션 연차"}].map(st=>(
                <div key={st.l} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:"clamp(28px,5vw,50px)", fontWeight:900, letterSpacing:"-0.04em", background:"linear-gradient(135deg,#fff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                    <Counter to={st.n} suffix={st.s}/>
                  </div>
                  <div style={{ fontSize:11, color:D.faint, marginTop:6, letterSpacing:"0.08em", textTransform:"uppercase" }}>{st.l}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <div style={{ display:"flex", gap:14, justifyContent:"center", marginTop:52, flexWrap:"wrap" }}>
              <a href="#" className="bp" style={{ padding:"14px 32px", borderRadius:12, fontWeight:800, fontSize:15, display:"inline-flex", alignItems:"center", gap:8 }}>영상 제작 문의하기 <Arrow size={18}/></a>
              <a href="#portfolio" className="bo-dark" style={{ padding:"14px 28px", borderRadius:12, fontWeight:700, fontSize:15 }}>포트폴리오 보기</a>
            </div>
          </Reveal>
        </div>
        <div style={{ position:"absolute", bottom:32, left:"50%", display:"flex", flexDirection:"column", alignItems:"center", gap:6, animation:"bounce 2.6s ease-in-out infinite" }}>
          <div style={{ width:1, height:36, background:`linear-gradient(to bottom, transparent, ${D.accentL})` }}/>
          <div style={{ fontSize:10, color:D.faint, letterSpacing:"0.15em", textTransform:"uppercase" }}>Scroll</div>
        </div>
      </section>

      {/* ══ LOGO TICKER (dark) ══ */}
      <div style={{ padding:"16px 0", background:"rgba(255,255,255,.02)", borderTop:`1px solid ${D.border}`, borderBottom:`1px solid ${D.border}`, position:"relative" }}>
        <div style={{ position:"absolute", top:0, bottom:0, left:0, width:80, background:`linear-gradient(to right,${D.bg},transparent)`, zIndex:2 }}/>
        <div style={{ position:"absolute", top:0, bottom:0, right:0, width:80, background:`linear-gradient(to left,${D.bg},transparent)`, zIndex:2 }}/>
        <Ticker items={logoItems} speed={52}/>
      </div>

      {/* ══ POWER (LIGHT — 흰/파스텔) ══ */}
      <section style={{ padding:"96px 0", background:"#ffffff" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:60 }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.28em", color:"#7c3aed", textTransform:"uppercase", marginBottom:14 }}>Why Samsong E&M</p>
              <h2 style={{ fontSize:"clamp(26px,4vw,42px)", fontWeight:900, letterSpacing:"-0.03em", color:"#111" }}>세 가지 핵심 경쟁력</h2>
            </div>
          </Reveal>
          <div className="pgrid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:22 }}>
            {powers.map((pw,i)=>(
              <Reveal key={pw.lbl} delay={i*0.1}>
                <div className="ch-light" style={{ background:pw.bg, border:`1px solid ${pw.border}`, borderRadius:20, padding:34, display:"flex", flexDirection:"column", height:"100%" }}>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:22 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:pw.iconBg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:pw.accent }}/>
                    </div>
                    <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.2em", color:pw.accent, textTransform:"uppercase" }}>{pw.lbl}</span>
                  </div>
                  <h3 style={{ fontSize:21, fontWeight:900, lineHeight:1.35, marginBottom:14, whiteSpace:"pre-line", color:"#111" }}>{pw.title}</h3>
                  <p style={{ fontSize:13.5, color:"#555", lineHeight:1.8, marginBottom:28 }}>{pw.desc}</p>
                  <div style={{ marginTop:"auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
                    {pw.certs.map((cert,j)=>(
                      <div key={j} style={{ display:"flex", alignItems:"flex-start", gap:7, padding:"10px 11px", background:"rgba(255,255,255,.7)", borderRadius:10, border:`1px solid ${pw.border}` }}>
                        <div style={{ width:16, height:16, borderRadius:"50%", background:pw.accent, flexShrink:0, marginTop:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <ChkI size={10} style={{ color:"#fff" }}/>
                        </div>
                        <span style={{ fontSize:11, color:"#444", lineHeight:1.45 }}>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CLIENTS (light gray) ══ */}
      <section style={{ padding:"80px 0", overflow:"hidden", background:"#f8f8fb" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", textAlign:"center", marginBottom:48 }}>
          <Reveal>
            <p style={{ fontSize:20, color:"#888", marginBottom:12, fontWeight:500 }}>국내 유수의 기업들이 선택한</p>
            <h2 style={{ fontSize:"clamp(26px,4vw,42px)", fontWeight:900, letterSpacing:"-0.03em", color:"#111" }}>
              500개 이상 <span style={{ color:"#7c3aed" }}>클라이언트의 선택</span>
            </h2>
          </Reveal>
        </div>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", inset:"0 auto 0 0", width:100, background:"linear-gradient(to right,#f8f8fb,transparent)", zIndex:2 }}/>
          <div style={{ position:"absolute", inset:"0 0 0 auto", width:100, background:"linear-gradient(to left,#f8f8fb,transparent)", zIndex:2 }}/>
          <div style={{ marginBottom:16 }}><Ticker items={clientRow1} speed={46}/></div>
          <Ticker items={clientRow2} speed={36} dir={-1}/>
        </div>
      </section>

      {/* ══ VOUCHER BAND (full-width 띠 배너) ══ */}
      <div style={{ background:"linear-gradient(135deg,#6d28d9,#4c1d95)", borderTop:"1px solid rgba(255,255,255,.08)", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="vstrip" style={{ display:"flex" }}>
            {[{t:"수출바우처 홍보 동영상 제작 수행기관",s:"글로벌 시장 진출을 위한 최적의 영상 솔루션"},{t:"혁신바우처 홍보 동영상 제작 수행기관",s:"주식회사 삼송이앤엠홀딩스를 검색하세요"}].map((v,i)=>(
              <div key={i} style={{ flex:1, padding:"22px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", borderLeft:i===1?"1px solid rgba(255,255,255,.12)":"none", transition:"background .2s" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.07)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <ChkI size={16} style={{ color:"#fff" }}/>
                  </div>
                  <div>
                    <p style={{ fontSize:14, fontWeight:800, color:"#fff", marginBottom:3 }}>{v.t}</p>
                    <p style={{ fontSize:12, color:"rgba(255,255,255,.55)" }}>{v.s}</p>
                  </div>
                </div>
                <Arrow size={15} style={{ color:"rgba(255,255,255,.4)", flexShrink:0, marginLeft:12 }}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SERVICES (white) ══ */}
      <section style={{ padding:"80px 0 100px", background:"#ffffff" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
          <Reveal>
            <div style={{ marginBottom:52 }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.28em", color:"#7c3aed", textTransform:"uppercase", marginBottom:14 }}>Our Services</p>
              <h2 style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:900, letterSpacing:"-0.03em", marginBottom:12, color:"#111" }}>영상 목적에 맞는 최적의 솔루션</h2>
              <p style={{ fontSize:15.5, color:"#777" }}>교육, 조직문화, 홍보, 행사영상까지 니즈에 맞는 영상 솔루션을 제안합니다.</p>
            </div>
          </Reveal>

          {/* Big 2 */}
          <div className="sgrid2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>
            {services.filter(s=>s.big).map((sv,i)=>(
              <Reveal key={sv.title} delay={i*0.1}>
                <div className="ch-light" style={{ background:`linear-gradient(145deg,${sv.tagBg},#ffffff)`, border:`1.5px solid ${sv.tagBorder}`, borderRadius:20, padding:34, display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
                  <span style={{ display:"inline-flex", padding:"3px 10px", borderRadius:4, background:sv.accent, color:"#fff", fontSize:10, fontWeight:800, letterSpacing:"0.15em", marginBottom:22 }}>SPECIAL</span>
                  <sv.Ic size={30} style={{ color:sv.accent, marginBottom:16 }}/>
                  <h3 style={{ fontSize:21, fontWeight:900, marginBottom:12, color:"#111" }}>{sv.title}</h3>
                  <p style={{ fontSize:14, color:"#666", lineHeight:1.8, marginBottom:20 }}>{sv.desc}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:24 }}>
                    {sv.tags.map(t=>(
                      <span key={t} style={{ padding:"5px 12px", borderRadius:999, fontSize:11.5, fontWeight:700, background:sv.tagBg, color:sv.tagColor, border:`1px solid ${sv.tagBorder}` }}>{t}</span>
                    ))}
                  </div>
                  <a href="#" style={{ marginTop:"auto", fontSize:13, fontWeight:700, color:sv.accent, display:"inline-flex", alignItems:"center", gap:6 }}>자세히 알아보기 <Arrow size={13}/></a>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Small 3 */}
          <div className="sgrid3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
            {services.filter(s=>!s.big).map((sv,i)=>(
              <Reveal key={sv.title} delay={i*0.08}>
                <div className="ch-light" style={{ background:"#fafafa", border:"1.5px solid #ebebeb", borderRadius:18, padding:28 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${sv.accent}14`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                    <sv.Ic size={22} style={{ color:sv.accent }}/>
                  </div>
                  <h3 style={{ fontSize:17, fontWeight:800, marginBottom:10, color:"#111" }}>{sv.title}</h3>
                  <p style={{ fontSize:13, color:"#666", lineHeight:1.7, marginBottom:16, whiteSpace:"pre-line" }}>{sv.desc}</p>
                  <a href="#" style={{ fontSize:12, fontWeight:700, color:sv.accent, display:"inline-flex", alignItems:"center", gap:5 }}>포트폴리오 보기 <Arrow size={12}/></a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PORTFOLIO (dark) ══ */}
      <section id="portfolio" style={{ padding:"100px 0", background:"#0a0a18" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
          <Reveal>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:20, marginBottom:48 }}>
              <div>
                <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.28em", color:D.accentL, textTransform:"uppercase", marginBottom:14 }}>Portfolio</p>
                <h2 style={{ fontSize:"clamp(26px,4vw,42px)", fontWeight:900, letterSpacing:"-0.03em" }}>다양한 기업과의<br/>영상 프로젝트</h2>
              </div>
              <button className="bo-dark" style={{ padding:"12px 22px", borderRadius:10, fontSize:13, fontWeight:700 }}>전체 보기</button>
            </div>
          </Reveal>
          <div className="pfgrid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
            {portfolio.map((item,i)=>(
              <Reveal key={i} delay={i*0.06}>
                <div className="pfc" style={{ cursor:"pointer", borderRadius:14, overflow:"hidden" }}>
                  <div style={{ aspectRatio:"16/10", background:`linear-gradient(135deg,hsl(${item.h},28%,11%),hsl(${item.h},38%,17%))`, position:"relative", overflow:"hidden" }}>
                    <div className="pft" style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <VideoI size={26} style={{ color:`hsla(${item.h},55%,72%,.3)` }}/>
                    </div>
                    <div className="pfo" style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.75),transparent 55%)", display:"flex", alignItems:"flex-end", padding:12 }}>
                      <span style={{ fontSize:11, fontWeight:800, color:D.accentL, display:"flex", alignItems:"center", gap:4 }}>VIEW <Arrow size={10}/></span>
                    </div>
                  </div>
                  <div style={{ padding:"11px 2px 4px" }}>
                    <span style={{ fontSize:10, fontWeight:800, color:D.accentL, letterSpacing:"0.1em", textTransform:"uppercase", display:"block", marginBottom:4 }}>{item.cat}</span>
                    <p style={{ fontSize:13, fontWeight:700, lineHeight:1.4 }}>{item.title}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STUDIO (light) ══ */}
      <section style={{ padding:"100px 0", background:"#f4f4f8" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
          <Reveal>
            <div style={{ marginBottom:48 }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.28em", color:"#7c3aed", textTransform:"uppercase", marginBottom:14 }}>Studio</p>
              <h2 style={{ fontSize:"clamp(26px,5vw,52px)", fontWeight:900, letterSpacing:"-0.03em", lineHeight:1.1, color:"#111" }}>
                SAMSONG E&M<br/>
                <span style={{ background:"linear-gradient(135deg,#5c7cff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>MULTIPLEX</span> STUDIO
              </h2>
              <p style={{ fontSize:14, color:"#888", marginTop:10 }}>삼송E&M 멀티플렉스 프로덕션 스튜디오</p>
            </div>
          </Reveal>
          <div className="slayout" style={{ display:"grid", gridTemplateColumns:"250px 1fr", gap:24 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {studios.map(st=>{
                const active = tab===st.id;
                return (
                  <div key={st.id} className="stab" onClick={()=>setTab(st.id)} style={{ padding:"16px 18px", borderRadius:14, border:`1px solid ${active?"#c4b5fd":"#e0e0ea"}`, background: active?"#ede9fe":"#ffffff" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                      <h4 style={{ fontSize:14, fontWeight:800, color: active?"#7c3aed":"#222" }}>{st.title}</h4>
                      <span style={{ fontSize:10, fontWeight:600, color:"#aaa" }}>{st.sub}</span>
                    </div>
                    <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:4 }}>
                      {st.items.map((it,j)=>(
                        <li key={j} style={{ fontSize:12, color:"#666", display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ width:4, height:4, borderRadius:"50%", background:active?"#7c3aed":"#ccc", flexShrink:0 }}/>
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="studioimg" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {["촬영 현장","라이브 커머스","레코딩 스튜디오","편집 공간"].map((lbl,i)=>(
                <div key={i} style={{ aspectRatio:"16/10", borderRadius:14, background:"linear-gradient(135deg,#e8e4f8,#eff0f8)", border:"1px solid #dddaee", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(124,58,237,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.04) 1px,transparent 1px)", backgroundSize:"20px 20px" }}/>
                  <span style={{ fontSize:12, fontWeight:600, color:"#aaa", position:"relative" }}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA (violet gradient) ══ */}
      <section style={{ padding:"120px 24px", textAlign:"center", position:"relative", overflow:"hidden", background:"linear-gradient(160deg,#3b2aab 0%,#5b3fd6 45%,#7c3aed 100%)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,255,255,.12), transparent 70%)" }}/>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)", backgroundSize:"60px 60px", opacity:0.4 }}/>
        <div style={{ position:"relative", zIndex:2, maxWidth:580, margin:"0 auto" }}>
          <Reveal>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:999, border:"1px solid rgba(255,255,255,.3)", background:"rgba(255,255,255,.15)", fontSize:12, fontWeight:600, color:"#fff", marginBottom:28 }}>✦ 원하는 영상을 문의해보세요</div>
            <h2 style={{ fontSize:"clamp(30px,5vw,52px)", fontWeight:900, lineHeight:1.12, marginBottom:20, letterSpacing:"-0.04em", color:"#fff" }}>영상 제작이<br/>필요하신가요?</h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,.9)", lineHeight:1.8, marginBottom:48 }}>목적과 예산에 맞는 최적의 방식을 제안해드립니다.<br/>편하게 문의 주시면 담당 PM이 직접 상담해드립니다.</p>
            <div className="ctabtns" style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:48 }}>
              <button className="bp" style={{ padding:"16px 36px", borderRadius:12, fontWeight:800, fontSize:16, display:"inline-flex", alignItems:"center", gap:10 }}>영상 제작 문의하기 <Arrow size={18}/></button>
              <button className="bo-dark" style={{ padding:"16px 28px", borderRadius:12, fontWeight:700, fontSize:16, display:"inline-flex", alignItems:"center", gap:10 }}><Phone size={17}/> 02-599-1415</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:9, alignItems:"center" }}>
              {[{Ic:MailI,t:"samsongenm@tpenm.com"},{Ic:PinI,t:"서울특별시 강남구 학동로3길 27 메르디엠타워"}].map(({Ic,t})=>(
                <div key={t} style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, color:"rgba(255,255,255,.65)" }}><Ic size={13}/> {t}</div>
              ))}
              <p style={{ fontSize:12, color:"rgba(255,255,255,.55)", marginTop:4 }}>평일 09:00 – 18:00</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ padding:"28px 24px", background:"#050510", borderTop:`1px solid ${D.border}` }}>
        <div className="foot-inner" style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
          <span style={{ fontSize:14, fontWeight:900 }}>SAMSONG <span style={{ color:D.accent }}>E&M</span></span>
          <p style={{ fontSize:11, color:D.faint, lineHeight:1.7, textAlign:"center" }}>㈜삼송E&M | 대표이사 이호선 | 사업자등록번호 114-87-06304<br/>서울특별시 강남구 학동로3길 27 메르디엠타워 101</p>
          <p style={{ fontSize:11, color:D.faint }}>© 2026 SAMSONG E&M</p>
        </div>
      </footer>
    </div>
  );
}
