import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import profileImg from "@/assets/profile.jpg";

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

function Hero() {
  const role = useTypewriter(ROLES);
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
            Nabil Hasan
            <br />
            <span className="text-gradient animate-gradient">Evan</span>
          </h1>
          <div className="mt-6 flex items-center gap-2 text-lg text-white/80 sm:text-2xl">
            <span className="text-white/50">I'm a</span>
            <span className="font-display font-semibold text-gradient">{role || "\u00A0"}</span>
            <span className="animate-blink text-primary">|</span>
          </div>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            I'm currently pursuing a Bachelor of Science in Information & Communication Engineering (ICE)
            under the Department of ICT at Bangladesh University of Professionals (BUP). I enjoy building
            modern web applications, designing intuitive user interfaces, solving technical problems, and
            continuously exploring new technologies.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/cv.pdf" download className="group inline-flex items-center gap-2 rounded-xl btn-glow btn-glow-hover px-6 py-3 text-sm font-semibold">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download CV
            </a>
            <a href="#contact" className="group inline-flex items-center gap-2 rounded-xl glass px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Contact Me
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-white/50">
            <a href="https://linkedin.com/in/nabilhasan-evan-047736368" target="_blank" rel="noopener" className="transition hover:text-primary">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5V9h3zm-1.5-11.3A1.7 1.7 0 118.2 6a1.7 1.7 0 01-1.7 1.7zM19 19h-3v-5.3c0-3.2-3.5-2.9-3.5 0V19h-3V9h3v1.7c1.4-2.6 6.5-2.8 6.5 2.5z"/></svg>
            </a>
            <a href="mailto:nabilhasanevan2005@gmail.com" className="transition hover:text-primary">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </a>
            <a href="tel:+8801641976902" className="transition hover:text-primary">
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
            <img src={profileImg} alt="Nabil Hasan Evan" className="h-full w-full object-cover" />
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

function About() {
  const stats = [
    { n: "3+", l: "Academic Projects" },
    { n: "5+", l: "Technical Skills" },
    { n: "3rd", l: "Year Student" },
    { n: "2027", l: "Graduation" },
  ];
  return (
    <section id="about" className="relative py-24">
      <SectionTitle eyebrow="About" title="Who I Am" sub="A quick look at who's behind the code." />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <div className="glass rounded-3xl p-8">
            <h3 className="font-display text-2xl font-bold">Personal Bio</h3>
            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["Name", "Nabil Hasan Evan"],
                ["Position", "3rd Year Undergraduate"],
                ["Degree", "Bachelor of Science (B.Sc.)"],
                ["Program", "Information & Communication Engineering"],
                ["Department", "Information & Communication Technology"],
                ["University", "Bangladesh University of Professionals (BUP)"],
                ["Graduation", "Expected 2027"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,1fr)_2fr] gap-4 border-b border-white/5 py-2">
                  <dt className="text-white/50">{k}</dt>
                  <dd className="text-white/90">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="glass-strong rounded-3xl p-8">
            <h3 className="font-display text-2xl font-bold">Career Objective</h3>
            <p className="mt-4 text-white/70 leading-relaxed">
              "Aspiring to build a successful career in the Communication and Telecommunications
              industry while continuously improving my skills in software development, networking,
              and modern web technologies."
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.l} className="gradient-border gradient-border-glow rounded-2xl p-5 text-center">
                  <div className="font-display text-3xl font-bold text-gradient">{s.n}</div>
                  <div className="mt-1 text-xs text-white/60">{s.l}</div>
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
  const items = [
    {
      year: "2023 — 2027",
      title: "B.Sc. in Information & Communication Engineering",
      org: "Bangladesh University of Professionals (BUP)",
      desc: "Department of ICT · Currently Third-Year Student · Expected Graduation 2027",
      status: "In Progress",
    },
  ];
  return (
    <section id="education" className="relative py-24">
      <SectionTitle eyebrow="Education" title="Academic Journey" />
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary via-accent to-purple-500 sm:left-1/2" />
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="relative mb-10 pl-12 sm:pl-0">
                <div className="absolute left-2 top-4 h-5 w-5 rounded-full btn-glow glow-blue sm:left-1/2 sm:-translate-x-1/2" />
                <div className="glass rounded-2xl p-6 sm:ml-auto sm:w-1/2 sm:pl-10">
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">{it.year}</div>
                  <h3 className="mt-2 font-display text-xl font-bold">{it.title}</h3>
                  <p className="mt-1 text-white/70">{it.org}</p>
                  <p className="mt-3 text-sm text-white/50">{it.desc}</p>
                  <span className="mt-4 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                    {it.status}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const groups = [
    { title: "Programming", items: [["C", 85], ["C++", 80], ["Java", 70]] },
    { title: "Web Development", items: [["HTML5", 95], ["CSS3", 90], ["JavaScript", 80], ["AI-assisted Dev", 85]] },
    { title: "UI / UX", items: [["Figma", 75], ["Wireframing", 80], ["Responsive Design", 90]] },
    { title: "Database", items: [["MySQL", 80], ["Database Design", 75]] },
    { title: "Networking", items: [["Cisco Packet Tracer", 78], ["Network Config", 70], ["Routing & Switching", 72]] },
  ] as const;
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
                {g.items.map(([name, val]) => (
                  <div key={name}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-white/80">{name}</span>
                      <span className="text-white/40">{val}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full skill-bar transition-all duration-1000 group-hover:brightness-125"
                           style={{ width: `${val}%` }} />
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
  const services = [
    { icon: "🌐", title: "Web Development", desc: "Responsive websites built with modern frontend technologies." },
    { icon: "🎨", title: "Frontend Development", desc: "Interactive UIs using HTML, CSS, JavaScript & AI-assisted workflows." },
    { icon: "✨", title: "UI/UX Design", desc: "Modern user experiences with intuitive, responsive interfaces." },
    { icon: "🗄️", title: "Database Design", desc: "Relational schemas, SQL queries and MySQL implementation." },
    { icon: "🛰️", title: "Network Design", desc: "Cisco configuration, topology design, routing and switching." },
  ];
  return (
    <section id="services" className="relative py-24">
      <SectionTitle eyebrow="Services" title="What I Do" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 80}>
            <div className="group relative h-full overflow-hidden rounded-3xl glass p-8 transition hover:-translate-y-2">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition group-hover:opacity-60"
                   style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)" }} />
              <div className="relative text-4xl">{s.icon}</div>
              <h3 className="relative mt-5 font-display text-xl font-bold">{s.title}</h3>
              <p className="relative mt-3 text-sm text-white/60">{s.desc}</p>
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

function Projects() {
  const projects = [
    {
      title: "Car Parking Management System",
      desc: "Database-driven parking management with vehicle registration, slot allocation, entry/exit tracking and parking database management.",
      tech: ["HTML", "CSS", "MySQL"],
      gradient: "from-blue-500/30 to-cyan-500/30",
      emoji: "🚗",
    },
    {
      title: "CPU Scheduling Simulator",
      desc: "Implementation and visualization of OS CPU scheduling algorithms — FCFS, SJF, Priority Scheduling and Round Robin.",
      tech: ["C/C++", "Java"],
      gradient: "from-purple-500/30 to-pink-500/30",
      emoji: "🧠",
    },
    {
      title: "IIR Audio Signal Filter",
      desc: "Digital Signal Processing project implementing an IIR filter for audio enhancement and noise reduction.",
      tech: ["MATLAB", "DSP"],
      gradient: "from-cyan-500/30 to-emerald-500/30",
      emoji: "🎧",
    },
  ];
  return (
    <section id="projects" className="relative py-24">
      <SectionTitle eyebrow="Portfolio" title="Featured Projects" sub="Selected work from my academic journey." />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <TiltCard>
              <div className="group relative h-full overflow-hidden rounded-3xl glass">
                <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${p.gradient}`}>
                  <div className="absolute inset-0 bg-grid opacity-40" />
                  <div className="absolute inset-0 grid place-items-center text-6xl">{p.emoji}</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold">{p.title}</h3>
                  <p className="mt-3 text-sm text-white/60">{p.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs text-primary ring-1 ring-primary/20">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <a href="#" className="flex-1 rounded-lg glass px-4 py-2 text-center text-xs font-semibold hover:bg-white/10">
                      GitHub
                    </a>
                    <a href="#" className="flex-1 rounded-lg btn-glow btn-glow-hover px-4 py-2 text-center text-xs font-semibold">
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const contacts = [
    { icon: "✉️", label: "Email", value: "nabilhasanevan2005@gmail.com", href: "mailto:nabilhasanevan2005@gmail.com" },
    { icon: "📞", label: "Phone", value: "+880 1641-976902", href: "tel:+8801641976902" },
    { icon: "📍", label: "Location", value: "Mirpur-12, Dhaka, Bangladesh" },
    { icon: "🔗", label: "LinkedIn", value: "nabilhasan-evan-047736368", href: "https://linkedin.com/in/nabilhasan-evan-047736368" },
  ];
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
            onSubmit={(e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 3000); (e.target as HTMLFormElement).reset(); }}
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
            <button type="submit"
                    className="mt-5 group relative w-full overflow-hidden rounded-xl btn-glow btn-glow-hover px-6 py-3 text-sm font-semibold">
              {sent ? "✓ Message ready — thanks!" : "Send Message"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 py-12">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-3">
        <div>
          <div className="font-display text-lg font-bold text-gradient">Nabil Hasan Evan</div>
          <p className="mt-2 text-sm text-white/50">ICE Student · Web Developer · Dhaka, Bangladesh</p>
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
            {[
              { href: "https://linkedin.com/in/nabilhasan-evan-047736368", label: "in" },
              { href: "mailto:nabilhasanevan2005@gmail.com", label: "@" },
              { href: "tel:+8801641976902", label: "☎" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener"
                 className="grid h-10 w-10 place-items-center rounded-lg glass transition hover:bg-primary/20">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="relative mx-auto mt-10 max-w-6xl border-t border-white/5 px-6 pt-6 text-center text-xs text-white/40">
        © 2026 Nabil Hasan Evan. Crafted with passion in Dhaka.
      </div>
      <a href="#home"
         className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full btn-glow btn-glow-hover">
        ↑
      </a>
    </footer>
  );
}

function Portfolio() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Education />
        <Skills />
        <Services />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
