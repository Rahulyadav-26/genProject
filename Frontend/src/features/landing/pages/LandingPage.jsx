import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  Sparkles, ArrowRight, ChevronRight,
  ScanLine, Target, FileEdit, CheckCircle2, Zap, Award,
  Star, ShieldCheck, TrendingUp, Upload, Brain, Trophy
} from 'lucide-react';
import s from './LandingPage.module.css';

/* ─────────── Scroll-triggered fade ─────────── */
function useFadeIn() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {}, className = '' }) {
  const [ref, visible] = useFadeIn();
  return (
    <div ref={ref} className={`${s.reveal} ${visible ? s.in : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/* ─────────── Animated number ─────────── */
function AnimNum({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  const [ref, visible] = useFadeIn();
  useEffect(() => {
    if (!visible) return;
    let frame;
    const start = performance.now();
    const dur = 1600;
    const run = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * to));
      if (p < 1) frame = requestAnimationFrame(run);
    };
    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [visible, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─────────── SVG Score Ring ─────────── */
function ScoreRing({ pct = 94 }) {
  const [on, setOn] = useState(false);
  const [ref, visible] = useFadeIn();
  const R = 52, C = 2 * Math.PI * R;
  useEffect(() => { if (visible) setTimeout(() => setOn(true), 150); }, [visible]);
  return (
    <div ref={ref} className={s.ring}>
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
        <circle cx="64" cy="64" r={R} fill="none" stroke="#00d4aa" strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={on ? C - (pct / 100) * C : C}
          transform="rotate(-90 64 64)"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(.34,1.56,.64,1)' }} />
      </svg>
      <div className={s.ringInner}>
        <span className={s.ringNum}>{pct}<span className={s.ringPct}>%</span></span>
        <span className={s.ringLabel}>ATS</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════ */
export default function LandingPage() {
  const go = useNavigate();
  const toRegister = useCallback(() => go('/register'), [go]);
  const toLogin = useCallback(() => go('/login'), [go]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const features = [
    { icon: <ScanLine />, title: 'ATS Simulator', desc: 'Predict your parser score before you click "Apply".' },
    { icon: <Target />, title: 'Keyword Radar', desc: 'Find every exact phrase the JD demands — none missed.' },
    { icon: <FileEdit />, title: 'Smart Rewrite', desc: 'AI rewrites your bullets to pass both parsers and humans.' },
    { icon: <CheckCircle2 />, title: 'Skill Gap Map', desc: 'Know the exact skills to gain before your next application.' },
    { icon: <Zap />, title: 'Mock Interviews', desc: 'Practice with a coach trained on your specific JD.' },
    { icon: <Award />, title: '30-60-90 Plan', desc: 'A structured prep roadmap mapped to your weaknesses.' },
  ];

  const testimonials = [
    { name: 'Priya Nair', role: 'SWE @ Stripe', avatar: 'P',
      body: `Went from 5% callback to 60% in 3 weeks. ResumeIQ found keyword gaps I'd never have caught myself.` },
    { name: 'Arjun Mehta', role: 'PM @ Google', avatar: 'A',
      body: 'The mock interview coach asked me follow-ups before my actual interviewer did. Felt unfairly prepared.' },
    { name: 'Sara Kim', role: 'Data Scientist @ Netflix', avatar: 'S',
      body: 'ATS score jumped from 34 → 91% in one session. Four interview invites landed that same week.' },
  ];

  return (
    <div className={s.page}>

      {/* ── NAVBAR ── */}
      <header className={`${s.nav} ${scrolled ? s.navSolid : ''}`}>
        <div className={s.navWrap}>
          <a href="/" className={s.logo}><Sparkles size={15} className={s.logoDot} />ResumeIQ</a>
          <nav className={s.navCenter}>
            <a href="#how" className={s.navA}>How it works</a>
            <a href="#features" className={s.navA}>Features</a>
            <a href="#proof" className={s.navA}>Testimonials</a>
          </nav>
          <div className={s.navRight}>
            <button className={s.navLogin} onClick={toLogin}>Log in</button>
            <button className={s.navCta} onClick={toRegister}>Get started <ChevronRight size={13} /></button>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className={s.hero}>
          <div className={s.heroGlow} />

          <div className={s.heroWrap}>
            {/* Left text column */}
            <div className={s.heroLeft}>
              <Reveal>
                <span className={s.pill}><span className={s.pillDot}/>AI-Powered Resume Intelligence</span>
              </Reveal>

              <Reveal delay={80}>
                <h1 className={s.h1}>
                  Land your next job<br />
                  <em className={s.em}>before the ATS</em><br />
                  even reads your name.
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className={s.heroSub}>
                  Upload a resume. Paste a job description. In under 2 minutes, get a precise ATS score, every missing keyword, AI-rewritten bullets, and a personalised 90-day prep plan.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className={s.heroBtns}>
                  <button className={s.btnPrimary} onClick={toRegister}>
                    Analyse My Resume <ArrowRight size={15} />
                  </button>
                  <button className={s.btnGhost}>See a sample report</button>
                </div>
                <p className={s.heroNote}>No credit card · Free for 3 analyses</p>
              </Reveal>

              {/* Inline stat chips */}
              <Reveal delay={320}>
                <div className={s.chips}>
                  <div className={s.chip}><span className={s.chipNum}>47k+</span> resumes analysed</div>
                  <div className={s.chip}><span className={s.chipNum}>87%</span> interview success rate</div>
                  <div className={s.chip}><span className={s.chipNum}>2 min</span> avg. turnaround</div>
                </div>
              </Reveal>
            </div>

            {/* Right card mockup */}
            <Reveal delay={120} className={s.heroRight}>
              <div className={s.mockCard}>
                <div className={s.mockBar}>
                  <span className={s.dot} style={{background:'#ff5f57'}}/>
                  <span className={s.dot} style={{background:'#ffbd2e'}}/>
                  <span className={s.dot} style={{background:'#28c840'}}/>
                  <span className={s.mockFile}>analysis_result.json</span>
                </div>
                <div className={s.mockBody}>
                  <ScoreRing pct={94} />
                  <div className={s.mockRows}>
                    {[
                      { k: 'Keywords matched', v: '32 / 36', good: true },
                      { k: 'Experience fit', v: '98%', good: true },
                      { k: 'Skill gaps found', v: '4 items', good: false },
                      { k: 'Formatting issues', v: 'None', good: true },
                    ].map(r => (
                      <div key={r.k} className={s.mockRow}>
                        <span className={s.mockKey}>{r.k}</span>
                        <span className={`${s.mockVal} ${r.good ? s.green : s.amber}`}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={s.mockFoot}>
                  <TrendingUp size={13} /> 92nd percentile · Better than 92% of applicants
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── TRUST LOGOS ── */}
        <section className={s.logos}>
          <Reveal>
            <p className={s.logosLabel}>Trusted by engineers at</p>
            <div className={s.logosRow}>
              {['Google', 'Stripe', 'Amazon', 'Spotify', 'Netflix', 'Notion', 'Figma'].map(c => (
                <span key={c} className={s.co}>{c}</span>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className={s.section} id="how">
          <Reveal><p className={s.eyebrow}>Process</p></Reveal>
          <Reveal delay={60}><h2 className={s.h2}>Three steps. One offer.</h2></Reveal>
          <Reveal delay={120}><p className={s.sub}>From raw resume to interview-ready in minutes, not days.</p></Reveal>

          <div className={s.steps}>
            {[
              { n:'01', Icon: Upload, title:'Upload & Target', desc:'Drop your PDF resume and paste the job description. No reformatting needed.' },
              { n:'02', Icon: Brain,  title:'Deep AI Scan',    desc:'Our model maps every skill, keyword, and gap against the exact JD requirements.' },
              { n:'03', Icon: Trophy, title:'Get Your Blueprint', desc:'Receive rewritten bullets, a keyword-optimised summary, 30 mock questions, and a study plan.' },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <div className={s.stepCard}>
                  <div className={s.stepTop}>
                    <span className={s.stepN}>{step.n}</span>
                    <step.Icon size={20} className={s.stepIcon} />
                  </div>
                  <h3 className={s.stepTitle}>{step.title}</h3>
                  <p className={s.stepDesc}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className={s.featureBand} id="features">
          <div className={s.section} style={{maxWidth:'1120px',margin:'0 auto'}}>
            <Reveal><p className={s.eyebrow}>Capabilities</p></Reveal>
            <Reveal delay={60}><h2 className={s.h2}>Everything you need to compete.</h2></Reveal>
            <Reveal delay={120}><p className={s.sub}>Built for engineers, designers & PMs who are serious about their next role.</p></Reveal>

            <div className={s.featGrid}>
              {features.map((f, i) => (
                <Reveal key={f.title} delay={i * 60}>
                  <div className={s.featCard}>
                    <div className={s.featIcon}>{f.icon}</div>
                    <h4 className={s.featTitle}>{f.title}</h4>
                    <p className={s.featDesc}>{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className={`${s.section} ${s.tSection}`} id="proof">
          <Reveal><p className={s.eyebrow}>Social Proof</p></Reveal>
          <Reveal delay={60}><h2 className={s.h2}>Real people. Real offers.</h2></Reveal>

          <div className={s.tGrid}>
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <div className={s.tCard}>
                  <div className={s.stars}>{'★★★★★'.split('').map((st, j) => <span key={j} className={s.star}>{st}</span>)}</div>
                  <p className={s.tBody}>"{t.body}"</p>
                  <div className={s.tMeta}>
                    <div className={s.avatar}>{t.avatar}</div>
                    <div>
                      <p className={s.tName}>{t.name}</p>
                      <p className={s.tRole}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className={s.cta}>
          <div className={s.ctaGlow} />
          <Reveal>
            <div className={s.ctaBox}>
              <ShieldCheck size={36} className={s.ctaIcon} />
              <h2 className={s.ctaH}>Your dream role is waiting.</h2>
              <p className={s.ctaSub}>Join 47,000+ job seekers who used ResumeIQ to land interviews at top companies.</p>
              <button className={s.btnPrimary} onClick={toRegister}>
                Start Free — No Credit Card <ArrowRight size={15} />
              </button>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className={s.footer}>
        <div className={s.footerTop}>
          <div className={s.footerBrand}>
            <a href="/" className={s.logo}><Sparkles size={15} className={s.logoDot}/>ResumeIQ</a>
            <p className={s.footerTag}>AI-powered career intelligence for the modern professional.</p>
          </div>
          <div className={s.footerCols}>
            {[
              { h:'Product', links:['Resume Scanner','ATS Optimizer','Mock Interviews','Cover Letters'] },
              { h:'Resources', links:['Blog','ATS Guide','Success Stories','Pricing'] },
              { h:'Company', links:['About','Privacy','Terms','Contact'] },
            ].map(col => (
              <div key={col.h} className={s.footerCol}>
                <h5 className={s.footerHead}>{col.h}</h5>
                {col.links.map(l => <a key={l} href="#" className={s.footerA}>{l}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className={s.footerBot}>
          <p>© {new Date().getFullYear()} ResumeIQ, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
