import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import profileImg from "@/assets/profile.png";
import { supabase } from "@/integrations/supabase/client";
import { toArray, useCollection, useMediaUrl, useSingleton, type Row } from "@/lib/cms";

/* Columns of `profile` that anonymous visitors are allowed to read. */
const PUBLIC_PROFILE_COLUMNS =
  "id,avatar_url,cover_url,full_name,title,typing_texts,short_bio,long_bio,career_objective,nationality,location,phone,email,linkedin,github,facebook,instagram,twitter,portfolio_url,created_at,updated_at";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nabil Hasan Evan — ICE Student & Web Developer" },
      { name: "description", content: "Portfolio of Nabil Hasan Evan — ICE student at BUP building modern web apps, UI/UX, database & network projects." },
      { property: "og:title", content: "Nabil Hasan Evan — Portfolio" },
      { property: "og:description", content: "ICE student, web developer & UI/UX designer crafting immersive digital experiences." },
    ],
  }),
  component: Portfolio,
});

const ROLES = [
  "ICE Student",
  "Web Developer",
  "UI/UX Designer",
  "Frontend Developer",
  "Database Enthusiast",
  "Networking Learner",
];

const NAV = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Skills" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

function useTypewriter(words: string[], speed = 90, pause = 1400) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[i % words.length];
    const t = setTimeout(() => {
      if (!del) {
        const next = word.slice(0, text.length + 1);
        setText(next);
        if (next === word) setTimeout(() => setDel(true), pause);
      } else {
        const next = word.slice(0, text.length - 1);
        setText(next);
        if (next === "") { setDel(false); setI((v) => v + 1); }
      }
    }, del ? 40 : speed);
    return () => clearTimeout(t);
  }, [text, del, i, words, speed, pause]);
  return text;
}

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity .8s ease ${delay}ms, transform .8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      ref.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-0 h-[400px] w-[400px] rounded-full opacity-40 blur-3xl transition-transform duration-300 ease-out"
      style={{ background: "radial-gradient(circle, rgba(59,130,246,0.5), transparent 70%)" }}
    />
  );
}

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setP(scrolled);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full bg-transparent">
      <div className="h-full skill-bar transition-[width] duration-150" style={{ width: `${p}%` }} />
    </div>
  );
}

function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-30 blur-3xl animate-float-slow"
           style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)" }} />
      <div className="absolute top-1/3 -right-32 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl animate-float-slow"
           style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)", animationDelay: "-4s" }} />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full opacity-25 blur-3xl animate-float-slow"
           style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)", animationDelay: "-8s" }} />
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-5 py-3 sm:px-6 ${scrolled ? "glass mx-4" : "bg-transparent"}`}>
        <a href="#home" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg btn-glow btn-glow-hover text-sm">NHE</span>
          <span className="hidden sm:inline text-gradient">Nabil.dev</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="hidden rounded-lg btn-glow btn-glow-hover px-4 py-2 text-sm font-medium md:inline-flex">
          Let's talk
        </a>
        <button aria-label="menu" onClick={() => setOpen(v => !v)} className="md:hidden rounded-lg glass p-2">
          <div className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
          </div>
        </button>
      </div>
      {open && (
        <div className="mx-4 mt-2 glass rounded-2xl p-4 md:hidden">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}
               className="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5">
              {n.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function Hero({ profile, about }: { profile: Row; about: Row }) {
  const words = toArray(profile.typing_texts);
  const role = useTypewriter(words.length ? words : ROLES);
  const avatar = useMediaUrl(profile.avatar_url);
  const resume = useMediaUrl(about.resume_url) ?? "/cv.pdf";
  const name = String(profile.full_name ?? "Nabil Hasan Evan").trim();
  const parts = name.split(" ");
  const last = parts.length > 1 ? parts.pop()! : "";
  const first = parts.join(" ");
  const email = String(profile.email ?? "nabilhasanevan2005@gmail.com");
  const phone = String(profile.phone ?? "+8801641976902");
  const linkedin = String(profile.linkedin ?? "https://linkedin.com/in/nabilhasan-evan-047736368");

  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-32">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <FloatingShapes />
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-24 lg:grid-cols-2 lg:items-center">
        <div className="animate-fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-white/70">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-glow" />
            Available for projects & collaborations
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            {first}
            {last && (
              <>
                <br />
                <span className="text-gradient animate-gradient">{last}</span>
              </>
            )}
          </h1>
          <div className="mt-6 flex items-center gap-2 text-lg text-white/80 sm:text-2xl">
            <span className="text-white/50">I'm a</span>
            <span className="font-display font-semibold text-gradient">{role || "\u00A0"}</span>
            <span className="animate-blink text-primary">|</span>
          </div>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            {String(
              profile.long_bio ||
                profile.short_bio ||
                "I'm currently pursuing a Bachelor of Science in Information & Communication Engineering (ICE) under the Department of ICT at Bangladesh University of Professionals (BUP).",
            )}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href={resume} download target="_blank" rel="noopener" className="group inline-flex items-center gap-2 rounded-xl btn-glow btn-glow-hover px-6 py-3 text-sm font-semibold">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {String(about.resume_button_label ?? "Download CV")}
            </a>
            <a href="#contact" className="group inline-flex items-center gap-2 rounded-xl glass px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Contact Me
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-white/50">
            <a href={linkedin} target="_blank" rel="noopener" className="transition hover:text-primary">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5V9h3zm-1.5-11.3A1.7 1.7 0 118.2 6a1.7 1.7 0 01-1.7 1.7zM19 19h-3v-5.3c0-3.2-3.5-2.9-3.5 0V19h-3V9h3v1.7c1.4-2.6 6.5-2.8 6.5 2.5z"/></svg>
            </a>
            <a href={`mailto:${email}`} className="transition hover:text-primary">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </a>
            <a href={`tel:${phone.replace(/\s|-/g, "")}`} className="transition hover:text-primary">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8 9.6a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"/></svg>
            </a>
          </div>
        </div>

        {/* Right visual */}
        <div className="relative mx-auto flex h-[420px] w-[420px] max-w-full items-center justify-center sm:h-[500px] sm:w-[500px]">
          {/* Rotating rings */}
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-spin-slow"
               style={{ background: "conic-gradient(from 0deg, transparent 0deg, rgba(59,130,246,0.4) 90deg, transparent 180deg)" }} />
          <div className="absolute inset-6 rounded-full border border-accent/30 animate-spin-reverse" />
          <div className="absolute inset-12 rounded-full border border-purple-500/30 animate-spin-slow"
               style={{ animationDuration: "30s" }} />
          {/* Glow */}
          <div className="absolute inset-16 rounded-full opacity-70 blur-2xl animate-pulse-glow"
               style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)" }} />
          {/* Profile */}
          <div className="relative z-10 h-64 w-64 overflow-hidden rounded-full border-4 border-white/10 glow-blue sm:h-80 sm:w-80">
            <img src={avatar ?? profileImg} alt={name} className="h-full w-full object-cover" />
          </div>
          {/* Floating tech icons */}
          {[
            { label: "JS", x: "10%", y: "10%", d: "0s" },
            { label: "React", x: "85%", y: "20%", d: "-1s" },
            { label: "SQL", x: "5%", y: "70%", d: "-2s" },
            { label: "C++", x: "82%", y: "75%", d: "-3s" },
            { label: "UI", x: "45%", y: "-2%", d: "-4s" },
            { label: "Net", x: "48%", y: "95%", d: "-5s" },
          ].map((t) => (
            <div key={t.label}
                 className="absolute grid h-12 w-12 place-items-center rounded-xl glass text-xs font-bold text-white animate-float"
                 style={{ left: t.x, top: t.y, animationDelay: t.d }}>
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <Reveal className="mx-auto mb-14 max-w-2xl text-center">
      <div className="mb-3 inline-flex rounded-full glass px-4 py-1 text-xs uppercase tracking-widest text-primary">{eyebrow}</div>
      <h2 className="font-display text-3xl font-bold sm:text-5xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {sub && <p className="mt-4 text-white/60">{sub}</p>}
    </Reveal>
  );
}

function About({ profile, about }: { profile: Row; about: Row }) {
  const stats = [
    { n: about.stat1_value, l: about.stat1_label },
    { n: about.stat2_value, l: about.stat2_label },
    { n: about.stat3_value, l: about.stat3_label },
    { n: about.stat4_value, l: about.stat4_label },
  ].filter((s) => s.n || s.l);
  const bio: [string, string][] = [
    ["Name", String(profile.full_name ?? "")],
    ["Position", String(profile.title ?? "")],
    ["Nationality", String(profile.nationality ?? "")],
    ["Location", String(profile.location ?? "")],
    ["Email", String(profile.email ?? "")],
    ["Phone", String(profile.phone ?? "")],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <section id="about" className="relative py-24">
      <SectionTitle eyebrow="About" title={String(about.heading ?? "Who I Am")} sub={String(about.description ?? "A quick look at who's behind the code.")} />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <div className="glass rounded-3xl p-8">
            <h3 className="font-display text-2xl font-bold">Personal Bio</h3>
            <dl className="mt-6 space-y-3 text-sm">
              {bio.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,1fr)_2fr] gap-4 border-b border-white/5 py-2">
                  <dt className="text-white/50">{k}</dt>
                  <dd className="break-words text-white/90">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="glass-strong rounded-3xl p-8">
            <h3 className="font-display text-2xl font-bold">Career Objective</h3>
            <p className="mt-4 leading-relaxed text-white/70">
              {String(profile.career_objective ?? "Aspiring to build a successful career in the Communication and Telecommunications industry while continuously improving my skills in software development, networking, and modern web technologies.")}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={String(s.l)} className="gradient-border gradient-border-glow rounded-2xl p-5 text-center">
                  <div className="font-display text-3xl font-bold text-gradient">{String(s.n ?? "")}</div>
                  <div className="mt-1 text-xs text-white/60">{String(s.l ?? "")}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Education() {
  const { data } = useCollection("education");
  const items = data ?? [];
  if (!items.length) return null;
  return (
    <section id="education" className="relative py-24">
      <SectionTitle eyebrow="Education" title="Academic Journey" />
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary via-accent to-purple-500 sm:left-1/2" />
          {items.map((it, i) => (
            <Reveal key={String(it.id)} delay={i * 100}>
              <div className="relative mb-10 pl-12 sm:pl-0">
                <div className="absolute left-2 top-4 h-5 w-5 rounded-full btn-glow glow-blue sm:left-1/2 sm:-translate-x-1/2" />
                <div className="glass rounded-2xl p-6 sm:ml-auto sm:w-1/2 sm:pl-10">
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {[it.start_year, it.end_year].filter(Boolean).join(" — ")}
                  </div>
                  <h3 className="mt-2 font-display text-xl font-bold">{String(it.degree || it.program || it.institution)}</h3>
                  <p className="mt-1 text-white/70">{String(it.institution ?? "")}</p>
                  <p className="mt-3 text-sm text-white/50">{String(it.description ?? it.department ?? "")}</p>
                  {it.is_current ? (
                    <span className="mt-4 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">In Progress</span>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const { data } = useCollection("experience");
  const items = data ?? [];
  if (!items.length) return null;
  return (
    <section id="experience" className="relative py-24">
      <SectionTitle eyebrow="Experience" title="Where I've Worked" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2">
        {items.map((e, i) => (
          <Reveal key={String(e.id)} delay={i * 80}>
            <div className="h-full rounded-3xl glass p-6 transition hover:-translate-y-1">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                {[e.start_date, e.is_current ? "Present" : e.end_date].filter(Boolean).join(" — ")}
              </div>
              <h3 className="mt-2 font-display text-xl font-bold">{String(e.position ?? "")}</h3>
              <p className="mt-1 text-white/70">{String(e.company ?? "")}{e.location ? ` · ${String(e.location)}` : ""}</p>
              <p className="mt-3 text-sm text-white/55">{String(e.description ?? "")}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  const cats = useCollection("skill_categories");
  const skills = useCollection("skills");
  const groups = (cats.data ?? []).map((c) => ({
    title: String(c.name),
    items: (skills.data ?? []).filter((s) => s.category_id === c.id),
  }));
  const loose = (skills.data ?? []).filter((s) => !s.category_id);
  if (loose.length) groups.push({ title: "Other", items: loose });
  if (!groups.length) return null;

  return (
    <section id="skills" className="relative py-24">
      <SectionTitle eyebrow="Skills" title="Technical Toolkit" sub="Tools I use to bring ideas to life." />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => (
          <Reveal key={g.title} delay={i * 80}>
            <div className="group h-full rounded-3xl glass p-6 transition hover:-translate-y-1 hover:border-primary/40">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg btn-glow">
                  <span className="text-sm font-bold">{g.title[0]}</span>
                </div>
                <h3 className="font-display text-lg font-bold">{g.title}</h3>
              </div>
              <div className="space-y-4">
                {g.items.length === 0 && <p className="text-sm text-white/40">Coming soon.</p>}
                {g.items.map((s) => (
                  <div key={String(s.id)}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-white/80">{String(s.name)}</span>
                      <span className="text-white/40">{Number(s.percentage ?? 0)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full skill-bar transition-all duration-1000 group-hover:brightness-125"
                        style={{ width: `${Number(s.percentage ?? 0)}%`, ...(s.color ? { background: String(s.color) } : {}) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const { data } = useCollection("services");
  const services = data ?? [];
  if (!services.length) return null;
  return (
    <section id="services" className="relative py-24">
      <SectionTitle eyebrow="Services" title="What I Do" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={String(s.id)} delay={i * 80}>
            <div className="group relative h-full overflow-hidden rounded-3xl glass p-8 transition hover:-translate-y-2">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition group-hover:opacity-60"
                   style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)" }} />
              <div className="relative text-4xl">{String(s.icon ?? "✨")}</div>
              <h3 className="relative mt-5 font-display text-xl font-bold">{String(s.title ?? "")}</h3>
              <p className="relative mt-3 text-sm text-white/60">{String(s.description ?? "")}</p>
              <div className="relative mt-6 inline-flex items-center gap-2 text-sm text-primary">
                Learn more <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
         className="h-full transition-transform duration-200 ease-out">
      {children}
    </div>
  );
}

const GRADIENTS = [
  "from-blue-500/30 to-cyan-500/30",
  "from-purple-500/30 to-pink-500/30",
  "from-cyan-500/30 to-emerald-500/30",
  "from-amber-500/30 to-red-500/30",
];

function ProjectCard({ p, i }: { p: Row; i: number }) {
  const thumb = useMediaUrl(p.thumbnail_url);
  return (
    <Reveal delay={i * 100}>
      <TiltCard>
        <div className="group relative h-full overflow-hidden rounded-3xl glass">
          <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`}>
            <div className="absolute inset-0 bg-grid opacity-40" />
            {thumb ? (
              <img src={thumb} alt={String(p.title ?? "")} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-6xl">🚀</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent" />
            {p.is_featured ? (
              <span className="absolute right-3 top-3 rounded-full bg-amber-400/20 px-3 py-1 text-xs text-amber-200">★ Featured</span>
            ) : null}
          </div>
          <div className="p-6">
            <h3 className="font-display text-xl font-bold">{String(p.title ?? "")}</h3>
            <p className="mt-3 text-sm text-white/60">{String(p.short_description ?? "")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {toArray(p.tech_stack).map((t) => (
                <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs text-primary ring-1 ring-primary/20">{t}</span>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <a href={String(p.github_url || "#")} target="_blank" rel="noopener"
                 className="flex-1 rounded-lg glass px-4 py-2 text-center text-xs font-semibold hover:bg-white/10">GitHub</a>
              <a href={String(p.live_url || "#")} target="_blank" rel="noopener"
                 className="flex-1 rounded-lg btn-glow btn-glow-hover px-4 py-2 text-center text-xs font-semibold">Live Demo</a>
            </div>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

function Projects() {
  const { data } = useCollection("projects");
  const projects = (data ?? []).filter((p) => p.status === "published");
  if (!projects.length) return null;
  return (
    <section id="projects" className="relative py-24">
      <SectionTitle eyebrow="Portfolio" title="Featured Projects" sub="Selected work from my academic journey." />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => <ProjectCard key={String(p.id)} p={p} i={i} />)}
      </div>
    </section>
  );
}

function GalleryItem({ g }: { g: Row }) {
  const url = useMediaUrl(g.image_url);
  if (!url) return null;
  return (
    <div className="group relative overflow-hidden rounded-2xl glass">
      <img src={url} alt={String(g.title ?? "Gallery image")} loading="lazy"
           className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
      {g.title ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B0F19] to-transparent p-4 text-sm text-white/85">
          {String(g.title)}
        </div>
      ) : null}
    </div>
  );
}

function Gallery() {
  const { data } = useCollection("gallery");
  const items = data ?? [];
  if (!items.length) return null;
  return (
    <section id="gallery" className="relative py-24">
      <SectionTitle eyebrow="Gallery" title="Moments & Visuals" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g, i) => (
          <Reveal key={String(g.id)} delay={i * 60}><GalleryItem g={g} /></Reveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const { data } = useCollection("testimonials");
  const items = data ?? [];
  if (!items.length) return null;
  return (
    <section id="testimonials" className="relative py-24">
      <SectionTitle eyebrow="Testimonials" title="Kind Words" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <Reveal key={String(t.id)} delay={i * 80}>
            <div className="h-full rounded-3xl glass p-6">
              <div className="text-amber-300">{"★".repeat(Math.max(1, Math.min(5, Number(t.rating ?? 5))))}</div>
              <p className="mt-4 text-sm leading-relaxed text-white/70">{String(t.review ?? "")}</p>
              <div className="mt-5 text-sm font-semibold text-white/90">{String(t.name ?? "")}</div>
              <div className="text-xs text-white/40">{[t.designation, t.company].filter(Boolean).join(" · ")}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Certificates() {
  const { data } = useCollection("certificates");
  const items = data ?? [];
  if (!items.length) return null;
  return (
    <section id="certificates" className="relative py-24">
      <SectionTitle eyebrow="Credentials" title="Certificates" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c, i) => (
          <Reveal key={String(c.id)} delay={i * 80}>
            <div className="h-full rounded-3xl glass p-6">
              <div className="text-3xl">🏅</div>
              <h3 className="mt-4 font-display text-lg font-bold">{String(c.name ?? "")}</h3>
              <p className="mt-1 text-sm text-white/60">{String(c.organization ?? "")}</p>
              <p className="mt-2 text-xs text-white/40">{String(c.issue_date ?? "")}</p>
              {c.credential_url ? (
                <a href={String(c.credential_url)} target="_blank" rel="noopener" className="mt-4 inline-flex text-sm text-primary hover:underline">
                  View credential →
                </a>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Achievements() {
  const { data } = useCollection("achievements");
  const items = data ?? [];
  if (!items.length) return null;
  return (
    <section id="achievements" className="relative py-24">
      <SectionTitle eyebrow="Milestones" title="Achievements" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a, i) => (
          <Reveal key={String(a.id)} delay={i * 80}>
            <div className="h-full rounded-3xl glass p-6">
              <div className="text-3xl">🏆</div>
              <h3 className="mt-4 font-display text-lg font-bold">{String(a.title ?? "")}</h3>
              <p className="mt-2 text-sm text-white/60">{String(a.description ?? "")}</p>
              <p className="mt-3 text-xs text-white/40">{String(a.date ?? "")}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Blog() {
  const { data } = useCollection("blog_posts", { orderBy: "created_at", ascending: false });
  const posts = (data ?? []).filter((p) => p.status === "published");
  if (!posts.length) return null;
  return (
    <section id="blog" className="relative py-24">
      <SectionTitle eyebrow="Writing" title="Latest Posts" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 6).map((p, i) => (
          <Reveal key={String(p.id)} delay={i * 80}>
            <article className="h-full rounded-3xl glass p-6">
              <div className="text-xs uppercase tracking-widest text-primary">{String(p.category ?? "Article")}</div>
              <h3 className="mt-3 font-display text-lg font-bold">{String(p.title ?? "")}</h3>
              <p className="mt-3 text-sm text-white/60">{String(p.excerpt ?? "")}</p>
              <p className="mt-4 text-xs text-white/40">{String(p.publish_date ?? "")}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const EMAILJS_SERVICE_ID = "service_1094ace";
const EMAILJS_TEMPLATE_ID = "template_udffqxc";
const EMAILJS_PUBLIC_KEY = "YYNSAJNFKHoOGplmc";

function Contact({ profile }: { profile: Row }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const contacts = [
    { icon: "✉️", label: "Email", value: String(profile.email ?? ""), href: `mailto:${String(profile.email ?? "")}` },
    { icon: "📞", label: "Phone", value: String(profile.phone ?? ""), href: `tel:${String(profile.phone ?? "").replace(/\s|-/g, "")}` },
    { icon: "📍", label: "Location", value: String(profile.location ?? "") },
    { icon: "🔗", label: "LinkedIn", value: String(profile.linkedin ?? ""), href: String(profile.linkedin ?? "") },
  ].filter((c) => c.value);

  return (
    <section id="contact" className="relative py-24">
      <SectionTitle eyebrow="Contact" title="Let's Build Together" sub="Drop a message or reach out through any channel." />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {contacts.map((c, i) => (
            <Reveal key={c.label} delay={i * 60}>
              <a href={c.href ?? "#"} target={c.href?.startsWith("http") ? "_blank" : undefined}
                 rel="noopener"
                 className="block h-full rounded-2xl glass p-5 transition hover:-translate-y-1 hover:border-primary/40">
                <div className="text-2xl">{c.icon}</div>
                <div className="mt-3 text-xs uppercase tracking-widest text-white/40">{c.label}</div>
                <div className="mt-1 break-words text-sm text-white/90">{c.value}</div>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal delay={150}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const fd = new FormData(form);
              setStatus("sending");
              try {
                await supabase.from("messages").insert({
                  name: String(fd.get("name") ?? ""),
                  email: String(fd.get("email") ?? ""),
                  subject: String(fd.get("subject") ?? ""),
                  message: String(fd.get("message") ?? ""),
                  status: "unread",
                });
              } catch {
                /* still try email */
              }
              try {
                const emailjs = (await import("@emailjs/browser")).default;
                await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, {
                  publicKey: EMAILJS_PUBLIC_KEY,
                });
                setStatus("sent");
                form.reset();
              } catch {
                setStatus("error");
              }
              setTimeout(() => setStatus("idle"), 4000);
            }}
            className="glass-strong rounded-3xl p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required maxLength={100} name="name" placeholder="Your Name"
                     className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-primary" />
              <input required maxLength={255} name="email" type="email" placeholder="Email"
                     className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-primary" />
            </div>
            <input required maxLength={150} name="subject" placeholder="Subject"
                   className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-primary" />
            <textarea required maxLength={1000} name="message" placeholder="Your message..." rows={5}
                      className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-primary" />
            <button type="submit" disabled={status === "sending"}
                    className="mt-5 group relative w-full overflow-hidden rounded-xl btn-glow btn-glow-hover px-6 py-3 text-sm font-semibold disabled:opacity-70">
              {status === "sending" ? "Sending…" : status === "sent" ? "✓ Message sent — thanks!" : status === "error" ? "✕ Failed — try again" : "Send Message"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ profile, settings }: { profile: Row; settings: Row }) {
  const socials = [
    { href: profile.linkedin, label: "in" },
    { href: profile.github, label: "gh" },
    { href: profile.email ? `mailto:${String(profile.email)}` : null, label: "@" },
    { href: profile.phone ? `tel:${String(profile.phone).replace(/\s|-/g, "")}` : null, label: "☎" },
  ].filter((s) => s.href);

  return (
    <footer className="relative overflow-hidden border-t border-white/5 py-12">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-3">
        <div>
          <div className="font-display text-lg font-bold text-gradient">{String(settings.website_name || profile.full_name || "Nabil Hasan Evan")}</div>
          <p className="mt-2 text-sm text-white/50">{String(profile.short_bio ?? "")}</p>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">Quick Links</div>
          <ul className="grid grid-cols-2 gap-1 text-sm text-white/70">
            {NAV.map((n) => <li key={n.href}><a className="hover:text-primary" href={n.href}>{n.label}</a></li>)}
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">Connect</div>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a key={s.label} href={String(s.href)} target="_blank" rel="noopener"
                 className="grid h-10 w-10 place-items-center rounded-lg glass transition hover:bg-primary/20">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="relative mx-auto mt-10 max-w-6xl border-t border-white/5 px-6 pt-6 text-center text-xs text-white/40">
        {String(settings.footer_text ?? "© 2026 Nabil Hasan Evan. Crafted with passion in Dhaka.")}
        <span className="mx-2 text-white/20">·</span>
        <a href="/admin/login" className="hover:text-primary">Admin</a>
      </div>

      <a href="#home"
         className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full btn-glow btn-glow-hover">
        ↑
      </a>
    </footer>
  );
}

function Portfolio() {
  // Only request the columns that are publicly readable — private fields
  // (e.g. birthday) are not granted to anonymous visitors.
  const profile = useSingleton("profile", PUBLIC_PROFILE_COLUMNS).data ?? {};
  const about = useSingleton("about").data ?? {};
  const settings = useSingleton("site_settings").data ?? {};

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <main className="relative z-10">
        <Hero profile={profile} about={about} />
        <About profile={profile} about={about} />
        <Education />
        <Experience />
        <Skills />
        <Services />
        <Projects />
        <Certificates />
        <Achievements />
        <Gallery />
        <Testimonials />
        <Blog />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} settings={settings} />
    </div>
  );
}
