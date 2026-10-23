"use client";

import { MotionConfig, motion, type Variants } from "framer-motion";
import emailjs from "@emailjs/browser";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";

// Types
interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
}
interface Certificate {
  id: number;
  name: string;
  issuer: string;
  date: string;
  category: string;
  pdfUrl: string;
}
interface Highlight {
  role?: string;
  points: string[];
}

// Content
const PROFILE = {
  name: "Christian Lorrence Alparo",
  title: "IT Professional and Full-Stack Developer",
  summary:
    "I build web and mobile systems from database to interface: authentication, payments, real-time data, and admin dashboards. I use AI tools to move faster, and I review and test everything I ship.",
  // Check before publishing
  availability: "Open to full-time and internship roles",
  education: "Information Technology, Holy Cross of Davao College",
  focus: "Full-stack web and mobile applications",
  email: "lorrence.alparo@gmail.com",
  resume: "/resume/Christian_Lorrence_Alparo_Resume.pdf",
  // Portrait (leave empty to hide)
  photo: "/images/profile.jpg",
  github: "https://github.com/Jukurenmono",
  linkedin: "https://linkedin.com/in/christian-lorrence-alparo-78bb5434b",
};

// EmailJS settings (from env)
const EMAILJS = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_USER_ID ?? "",
};
const emailReady = Boolean(EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey);

const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];

// featured = show in footer
const SOCIALS = [
  { label: "GitHub", icon: "FaGithub", url: PROFILE.github, featured: true },
  { label: "LinkedIn", icon: "FaLinkedin", url: PROFILE.linkedin, featured: true },
  { label: "Facebook", icon: "FaFacebook", url: "https://facebook.com/Lorrence.Alparo", featured: false },
  { label: "Instagram", icon: "FaInstagram", url: "https://www.instagram.com/rencelationism/", featured: false },
  { label: "YouTube", icon: "FaYoutube", url: "https://www.youtube.com/@defectivemelody9419", featured: false },
  { label: "Twitter/X", icon: "FaTwitter", url: "https://x.com/rencelationism", featured: false },
];

const SKILL_GROUPS: { title: string; items: { name: string; icon?: string }[] }[] = [
  {
    title: "Frontend",
    items: [
      { name: "Next.js", icon: "SiNextdotjs" }, { name: "React", icon: "FaReact" },
      { name: "Angular", icon: "SiAngular" }, { name: "TypeScript", icon: "SiTypescript" },
      { name: "JavaScript", icon: "SiJavascript" }, { name: "Tailwind CSS", icon: "SiTailwindcss" },
      { name: "HTML5", icon: "FaHtml5" }, { name: "CSS3", icon: "FaCss3Alt" },
    ],
  },
  {
    title: "Backend and data",
    items: [
      { name: "Node.js", icon: "FaNodeJs" }, { name: "Express", icon: "SiExpress" },
      { name: "PHP", icon: "SiPhp" }, { name: "Python", icon: "FaPython" },
      { name: "PostgreSQL", icon: "SiPostgresql" }, { name: "MySQL", icon: "SiMysql" },
      { name: "Supabase", icon: "SiSupabase" }, { name: "Firebase", icon: "SiFirebase" },
    ],
  },
  {
    title: "Mobile and IoT",
    items: [
      { name: "React Native", icon: "FaReact" }, { name: "Expo", icon: "SiExpo" },
      { name: "RFID integration" }, { name: "PayMongo payments" },
    ],
  },
  {
    title: "Tools and delivery",
    items: [
      { name: "Git", icon: "FaGitAlt" }, { name: "GitHub", icon: "FaGithub" },
      { name: "Vercel", icon: "SiVercel" }, { name: "Figma", icon: "FaFigma" },
    ],
  },
  {
    title: "AI tools",
    // Only list tools you use
    items: [
      { name: "Claude" }, { name: "ChatGPT" }, { name: "Gemini" }, { name: "GitHub Copilot" },
    ],
  },
];

const AI_WORKFLOW = [
  { title: "Speed up", text: "Scaffolding, boilerplate, refactors, and first drafts of tests and documentation." },
  { title: "Check", text: "I read, run, and test generated code before it ships, and I can explain every line in my projects." },
  { title: "Learn", text: "I use AI to explain unfamiliar APIs and errors, then confirm against official docs." },
];

// Project highlights, keyed by repo name (lowercase, no symbols)
const HIGHLIGHTS: Record<string, Highlight> = {
  hcdcitsportal: { points: ["Attendance monitoring for IT students", "Separate student and admin dashboards", "Online membership fee payments and sanction tracking"] },
  bayadbox: { points: ["Secure sign-in and account management", "RFID-based payments with top-up management", "Real-time transaction history"] },
  hcdcssgcomelec2025: { points: ["Voter authentication for online elections", "Real-time vote tallying", "Admin dashboard for election management"] },
  synchronate: { points: ["Team task management in Angular and TypeScript", "Supabase backend with SCSS-styled UI"] },
  projecttracker: { points: ["Task tracking and progress monitoring", "Real-time collaboration with Firebase"] },
  tamagacha: { points: ["Virtual pet with live stat changes", "Interactive actions and dynamic feedback"] },
  myportfolio: { points: ["This site: Next.js, Tailwind, GitHub API integration"] },
};
const HIDDEN_TOPICS = ["portfolio", "private-repository"];

const CERTIFICATES: Certificate[] = [
  // TODO: add dates
  { id: 8, name: "TOPCIT 12th Test: Certificate and Results", issuer: "TOPCIT (IITP)", date: "", category: "IT Competency", pdfUrl: "certificates/12TH TOPCIT CERTIFICATE AND RESULTS.pdf" },
  { id: 7, name: "TOPCIT 11th Test: Certificate and Results", issuer: "TOPCIT (IITP)", date: "", category: "IT Competency", pdfUrl: "certificates/11TH TOPCIT CERTIFICATE AND RESULTS.pdf" },
  { id: 6, name: "Introduction to Front End Development", issuer: "Simplilearn", date: "May 2026", category: "Frontend", pdfUrl: "certificates/Introduction to Front End Development.pdf" },
  { id: 5, name: "Introduction to OpenCV for Beginners", issuer: "Simplilearn", date: "May 2026", category: "Machine Learning", pdfUrl: "certificates/Introduction to OpenCV for Beginners.pdf" },
  { id: 4, name: "Machine Learning using Python", issuer: "Simplilearn", date: "May 2026", category: "Machine Learning", pdfUrl: "certificates/Machine Learning using Python.pdf" },
  { id: 3, name: "Build Complete CMS Blog in PHP MySQL Bootstrap & PDO", issuer: "Udemy", date: "Dec 2024", category: "Backend", pdfUrl: "certificates/Udemy Certificate 2.pdf" },
  { id: 2, name: "Learn PHP and MySQL for Web Application and Web Development", issuer: "Udemy", date: "Sept 2024", category: "Backend", pdfUrl: "certificates/Udemy Certificate.pdf" },
  { id: 1, name: "Introduction to SQL", issuer: "Simplilearn SkillUp", date: "Sept 2024", category: "Backend", pdfUrl: "certificates/Simplilearn SkillUp SQL Certificate.pdf" },
];

// Helpers
const getIcon = (name?: string) => {
  if (!name) return null;
  return FaIcons[name as keyof typeof FaIcons] ?? SiIcons[name as keyof typeof SiIcons] ?? null;
};
const containerVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const cardVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};
const fieldCls =
  "mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-normal text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-2 focus:outline-offset-1 focus:outline-blue-700 dark:focus:outline-blue-400";
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const formatRepoName = (n: string) => n.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const certSrc = (p: string) => encodeURI(p.startsWith("/") ? p : `/${p}`);
const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function ProjectSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 border-t border-slate-200 dark:border-slate-800 py-8 md:grid-cols-[1fr_2fr] md:gap-10">
      <div className="space-y-3"><div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" /></div>
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="flex gap-2 pt-2"><div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-800" /></div>
      </div>
    </div>
  );
}

function SocialIcons({ all = false }: { all?: boolean }) {
  return (
    <div className="flex justify-center gap-3">
      {SOCIALS.filter((s) => all || s.featured).map((s) => {
        const Icon = getIcon(s.icon);
        return (
          <motion.a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.92 }}
            title={s.label}
            aria-label={s.label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors hover:border-blue-700 dark:hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-400"
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
          </motion.a>
        );
      })}
    </div>
  );
}

const linkBtn =
  "inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";

// Page
export default function ProfessionalSite() {
  const [active, setActive] = useState("");
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [dark, setDark] = useState(false);

  // Load saved theme
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      setDark(saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
    } catch {}
  }, []);
  const probeRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    const probe = probeRef.current;
    if (probe) {
      const on = getComputedStyle(probe).textDecorationLine.includes("underline");
      if (on !== dark) {
        console.warn(
          'Dark mode is not wired up. In styles/globals.css, right after @import "tailwindcss"; add: @custom-variant dark (&:where(.dark, .dark *));'
        );
      }
    }
    return () => {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "";
    };
  }, [dark]);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = PROFILE.email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) return; // honeypot
    if (!emailReady) { setStatus("error"); return; }
    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        { name: form.name, email: form.email, message: form.message, time: new Date().toLocaleString() },
        { publicKey: EMAILJS.publicKey }
      );
      setStatus("sent");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error("Failed to fetch repositories");
        const data: GithubRepo[] = await res.json();
        const order = Object.keys(HIGHLIGHTS);
        const rank = (r: GithubRepo) => {
          const i = order.indexOf(normalize(r.name));
          return i === -1 ? order.length : i;
        };
        setRepos([...data].sort((a, b) => rank(a) - rank(b)));
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Navbar shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active nav on scroll
  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const getActiveId = () => {
      const mid = window.innerHeight * 0.45;
      let best: string = ids[0];
      let bestDist = Infinity;
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - mid);
        if (rect.top <= mid + 80 && dist < bestDist) {
          bestDist = dist;
          best = id;
        }
      });
      setActive(best);
    };
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          getActiveId();
          ticking = false;
        });
        ticking = true;
      }
    };
    getActiveId();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActiveCert(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 antialiased ${dark ? "dark" : ""}`}>
        <span ref={probeRef} aria-hidden className="sr-only dark:underline" />
        {/* Header */}
        <header className={`sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 backdrop-blur transition-shadow duration-300 ${scrolled ? "bg-slate-50/95 dark:bg-slate-950/95 shadow-sm" : "bg-slate-50/70 dark:bg-slate-950/70"}`}>
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3" aria-label="Primary">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-sm font-semibold text-slate-900 dark:text-white"
            >
              {PROFILE.name}
            </button>
            <div className="hidden gap-6 text-sm md:flex">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => scrollToSection(n.id)}
                  aria-current={active === n.id ? "true" : undefined}
                  className={`border-b-2 py-1 transition-colors ${
                    active === n.id ? "border-blue-700 dark:border-blue-400 text-slate-900 dark:text-white" : "border-transparent hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                title={dark ? "Switch to light mode" : "Switch to dark mode"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                {dark ? <FaIcons.FaSun className="h-4 w-4" /> : <FaIcons.FaMoon className="h-4 w-4" />}
              </button>
              <a
                href={PROFILE.resume}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkBtn} bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-500`}
              >
                Resume
              </a>
            </div>
          </nav>
        </header>

        <main>
          {/* Hero */}
          <section className="mx-auto max-w-5xl px-6 pb-12 pt-16 md:pt-24">
            <div className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-6xl">{PROFILE.name}</h1>
              <p className="mt-3 text-xl text-blue-800 dark:text-blue-300 md:text-2xl">{PROFILE.title}</p>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed">{PROFILE.summary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => scrollToSection("contact")}
                  className={`${linkBtn} bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-500`}
                >
                  Contact me
                </button>
                <button
                  onClick={() => scrollToSection("projects")}
                  className={`${linkBtn} border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800`}
                >
                  View projects
                </button>
              </div>
            </motion.div>
            {PROFILE.photo && (
              <Image
                src={PROFILE.photo}
                alt={`Portrait of ${PROFILE.name}`}
                width={224}
                height={224}
                priority
                className="h-40 w-40 shrink-0 rounded-full border border-slate-200 dark:border-slate-800 object-cover md:h-56 md:w-56"
              />
            )}
            </div>

            <dl className="mt-14 grid gap-6 border-t border-slate-200 dark:border-slate-800 pt-8 text-sm sm:grid-cols-3">
              {[
                ["Availability", PROFILE.availability],
                ["Focus", PROFILE.focus],
                ["Education", PROFILE.education],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-medium text-slate-900 dark:text-white">{k}</dt>
                  <dd className="mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* About */}
          <Section id="about" title="About">
            <div className="max-w-2xl space-y-4 leading-relaxed">
              <p>
                I work across the stack. On the frontend I build with React, Next.js, and Angular. On the backend I
                use Node.js, PHP, and SQL databases such as PostgreSQL and MySQL, with Supabase and Firebase for
                authentication and real-time data.
              </p>
              <p>
                My projects solve concrete problems: student elections, attendance tracking, RFID payments, and team
                task management. I care about secure sign-in, clear admin tools, and interfaces people can use without
                instructions.
              </p>
            </div>
          </Section>

          {/* Skills */}
          <Section id="skills" title="Skills">
            <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
              {SKILL_GROUPS.map((g) => (
                <div key={g.title} className="grid gap-3 py-5 md:grid-cols-[200px_1fr]">
                  <h3 className="font-medium text-slate-900 dark:text-white">{g.title}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {g.items.map((s) => {
                      const Icon = getIcon(s.icon);
                      return (
                        <li
                          key={s.name}
                          className="flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm"
                        >
                          {Icon && <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden />}
                          {s.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <h3 className="mt-12 text-lg font-semibold text-slate-900 dark:text-white">How I use AI in my work</h3>
            <div className="mt-4 grid gap-8 md:grid-cols-3">
              {AI_WORKFLOW.map((a) => (
                <div key={a.title} className="border-l-2 border-blue-700 dark:border-blue-400 pl-4">
                  <p className="font-medium text-slate-900 dark:text-white">{a.title}</p>
                  <p className="mt-1 text-sm leading-relaxed">{a.text}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Projects */}
          <Section id="projects" title="Projects">
            {loading && (
              <div className="border-b border-slate-200 dark:border-slate-800">{[1, 2, 3].map((i) => <ProjectSkeleton key={i} />)}</div>
            )}
            {error && !loading && (
              <div className="text-sm">
                <p>
                  Projects could not be loaded. You can also see them on{" "}
                  <a className="text-blue-700 dark:text-blue-400 underline" href={PROFILE.github}>GitHub</a>.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Try again
                </button>
              </div>
            )}
            {!loading && !error && repos.length === 0 && (
              <p className="text-sm">No projects found yet. Add the topic &quot;portfolio&quot; to a repository to show it here.</p>
            )}
            {!loading && !error && repos.length > 0 && (
              <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="border-b border-slate-200 dark:border-slate-800">
              {repos.map((repo) => {
                const h = HIGHLIGHTS[normalize(repo.name)];
                const isPrivate = repo.topics.includes("private-repository");
                const tags = repo.topics.filter((t) => !HIDDEN_TOPICS.includes(t)).slice(0, 7);
                return (
                  <motion.article key={repo.id} variants={cardVariant} className="grid gap-4 border-t border-slate-200 dark:border-slate-800 py-8 md:grid-cols-[1fr_2fr] md:gap-10">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{formatRepoName(repo.name)}</h3>
                      {h?.role && <p className="mt-1 text-sm">{h.role}</p>}
                      <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
                        {repo.homepage && (
                          <a className="text-blue-700 dark:text-blue-400 underline underline-offset-2" href={repo.homepage} target="_blank" rel="noopener noreferrer">
                            Live demo
                          </a>
                        )}
                        {isPrivate ? (
                          <span className="text-slate-500 dark:text-slate-400">Private repository. Code walkthrough on request.</span>
                        ) : (
                          <a className="text-blue-700 dark:text-blue-400 underline underline-offset-2" href={repo.html_url} target="_blank" rel="noopener noreferrer">
                            Source code
                          </a>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="leading-relaxed">{repo.description ?? "No description provided."}</p>
                      {h && (
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                          {h.points.map((p) => <li key={p}>{p}</li>)}
                        </ul>
                      )}
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {tags.map((t) => (
                          <li key={t} className="rounded bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-700 dark:text-slate-300">{t}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
            )}
          </Section>

          {/* Certificates */}
          <Section id="certificates" title="Certificates">
            <motion.ul variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
              {CERTIFICATES.map((c) => (
                <motion.li key={c.id} variants={cardVariant}>
                  <button
                    onClick={() => setActiveCert(c)}
                    className="grid w-full gap-1 py-4 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 md:grid-cols-[1fr_160px_100px_90px] md:items-center md:gap-4 md:px-2"
                  >
                    <span className="font-medium text-slate-900 dark:text-white">{c.name}</span>
                    <span className="text-sm">{c.issuer}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{c.date}</span>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400 md:text-right">View PDF</span>
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </Section>

          {/* Contact */}
          <Section id="contact" title="Contact">
            <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
              <div>
                <p className="max-w-md leading-relaxed">
                  I am looking for a role where I can build and maintain real systems with a team. Send me a message
                  here, or copy my email address and write from your own inbox.
                </p>
                <div className="mt-6 flex items-center gap-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm">
                  <span className="min-w-0 flex-1 truncate text-slate-900 dark:text-white">{PROFILE.email}</span>
                  <button onClick={copyEmail} className="shrink-0 font-medium text-blue-700 dark:text-blue-400 hover:underline">
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="mt-4 flex gap-5 text-sm font-medium">
                  <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 underline underline-offset-2">LinkedIn</a>
                  <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 underline underline-offset-2">GitHub</a>
                </div>
              </div>

              <form onSubmit={sendMessage} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-900 dark:text-white">
                    Name
                    <input required maxLength={100} type="text" name="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldCls} />
                  </label>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white">
                    Email
                    <input required maxLength={200} type="email" name="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={fieldCls} />
                  </label>
                </div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white">
                  Message
                  <textarea required rows={5} maxLength={2000} name="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={fieldCls} />
                </label>
                {/* Honeypot (bots only) */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" />
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === "sending" || !emailReady}
                    className={`${linkBtn} bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {status === "sending" ? "Sending..." : "Send message"}
                  </button>
                  <p role="status" aria-live="polite" className="text-sm">
                    {status === "sent" && "Thanks, your message was sent. I will reply to the email you gave."}
                    {status === "error" && "The message could not be sent. Please copy my email address and write to me directly."}
                    {status === "idle" && !emailReady && "Direct messages are not set up yet. Use Copy for now."}
                  </p>
                </div>
              </form>
            </div>
          </Section>
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <div className="mb-4"><SocialIcons /></div>
          © {new Date().getFullYear()} {PROFILE.name}. Built with Next.js and Tailwind CSS.
        </footer>

        {/* Copied toast */}
        <motion.div
          initial={false}
          animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : 12 }}
          transition={{ duration: 0.2 }}
          aria-hidden
          className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-md bg-slate-900 dark:bg-slate-100 px-4 py-2 text-sm text-white shadow-lg dark:text-slate-900"
        >
          Email copied to clipboard
        </motion.div>

        {/* Certificate modal */}
        {activeCert && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeCert.name}
            onClick={() => setActiveCert(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 md:p-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-[82vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white dark:bg-slate-900 shadow-xl"
            >
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{activeCert.name}</h3>
                  <p className="text-sm">{[activeCert.issuer, activeCert.date].filter(Boolean).join(", ")}</p>
                </div>
                <button onClick={() => setActiveCert(null)} className="rounded px-2 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close certificate">
                  Close
                </button>
              </div>
              <iframe src={`${certSrc(activeCert.pdfUrl)}#toolbar=0&navpanes=0&view=FitH`} title={activeCert.name} className="w-full flex-1 border-0" />
            </motion.div>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}