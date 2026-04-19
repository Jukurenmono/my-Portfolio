"use client";

import { motion, scale, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  id: number;
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  image: string;
}

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  fork: boolean;
}

interface Skill {
  name: string;
  icon: string;
}

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  date: string;
  category: string;
  pdfUrl: string;
}

interface Social {
  label: string;
  icon: string;
  url: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const SKILLS: Skill[] = [
  { name: "Next.js",       icon: "SiNextdotjs"  },
  { name: "React",         icon: "FaReact"       },
  { name: "TypeScript",    icon: "SiTypescript"  },
  { name: "JavaScript",    icon: "SiJavascript"  },
  { name: "HTML5",         icon: "FaHtml5"       },
  { name: "CSS3",          icon: "FaCss3Alt"     },
  { name: "Tailwind CSS",  icon: "SiTailwindcss" },
  { name: "Framer Motion", icon: "SiFramer"      },
  { name: "Node.js",       icon: "FaNodeJs"      },
  { name: "Express",       icon: "SiExpress"     },
  { name: "Firebase",      icon: "SiFirebase"    },
  { name: "Supabase",      icon: "SiSupabase"    },
  { name: "Git",           icon: "FaGitAlt"      },
  { name: "GitHub",        icon: "FaGithub"      },
  { name: "Vercel",        icon: "SiVercel"      },
  { name: "Figma",         icon: "FaFigma"       },
];

const getIcon = (iconName: string) => {
  const FaIcon = FaIcons[iconName as keyof typeof FaIcons];
  if (FaIcon) return FaIcon;
  const SiIcon = SiIcons[iconName as keyof typeof SiIcons];
  if (SiIcon) return SiIcon;
  return null;
};

const SOCIALS: Social[] = [
  { label: "GitHub",    icon: "FaGithub",    url: "https://github.com/Jukurenmono" },
  { label: "LinkedIn",  icon: "FaLinkedin",  url: "https://linkedin.com/in/christian-lorrence-alparo-78bb5434b" },
  { label: "Facebook",  icon: "FaFacebook",  url: "https://facebook.com/Lorrence.Alparo" },
  { label: "Instagram", icon: "FaInstagram", url: "https://www.instagram.com/rencelationism/" },
  { label: "YouTube",   icon: "FaYoutube",   url: "https://www.youtube.com/@defectivemelody9419" },
  { label: "Twitter/X", icon: "FaTwitter",   url: "https://x.com/rencelationism" },
];

const MY_EMAIL = "lorrence.alparo@gmail.com";

const CERTIFICATES: Certificate[] = [
  {
    id: 1,
    name: "Introduction to SQL",
    issuer: "simplilearn SkillUp",
    date: "Sept 2024",
    category: "Backend",
    pdfUrl: "certificates/Simplilearn SkillUp SQL Certificate.pdf",
  },
  {
    id: 2,
    name: "Learn PHP and MySQL for Web Application and Web Development",
    issuer: "Udemy",
    date: "Sept 2024",
    category: "Backend",
    pdfUrl: "certificates/Udemy Certificate.pdf",
  },
  {
    id: 3,
    name: "Build Complete CMS Blog in PHP MySQL Bootstrap & PDO",
    issuer: "Udemy",
    date: "Dec 2024",
    category: "Backend",
    pdfUrl: "certificates/Udemy Certificate 2.pdf",
  },
];

const NAV_LINKS = ["About", "Projects", "Certificates", "Contact"] as const;

const GITHUB_USERNAME = "Jukurenmono";

// ─── Animation Variants ───────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const skillVariant: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

// ─── Aurora Canvas ────────────────────────────────────────────────────────────
function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let t = 0;
    let raf: number;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const blobs = [
      { cx: 0.3, cy: 0.3, sx: 0.42, sy: 0.38, r: 380, color: [0, 255, 200] },
      { cx: 0.7, cy: 0.2, sx: 0.33, sy: 0.44, r: 320, color: [0, 180, 255] },
      { cx: 0.8, cy: 0.7, sx: 0.38, sy: 0.4,  r: 400, color: [0, 255, 200] },
      { cx: 0.2, cy: 0.8, sx: 0.45, sy: 0.35, r: 280, color: [80, 255, 220] },
      { cx: 0.5, cy: 0.5, sx: 0.28, sy: 0.5,  r: 350, color: [0, 140, 255] },
      { cx: 0.6, cy: 0.4, sx: 0.5,  sy: 0.3,  r: 260, color: [0, 255, 180] },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#060e1f";
      ctx.fillRect(0, 0, w, h);

      blobs.forEach((b, i) => {
        const phase = t * 0.45 + i * 1.1;
        const x = w * (b.cx + Math.sin(phase) * b.sx);
        const y = h * (b.cy + Math.cos(phase * 0.9) * b.sy);
        const radius = b.r + Math.sin(t * 1.1 + i) * 60;
        const [r, g, bl] = b.color;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0,   `rgba(${r},${g},${bl},0.22)`);
        grad.addColorStop(0.4, `rgba(${r},${g},${bl},0.09)`);
        grad.addColorStop(1,   `rgba(${r},${g},${bl},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      ctx.strokeStyle = "rgba(0,255,200,0.15)";
      ctx.lineWidth = 1;
      const grid = 80;
      for (let x = 0; x < w; x += grid) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += grid) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      const vignette = ctx.createRadialGradient(
        w / 2, h / 2, h * 0.2,
        w / 2, h / 2, h * 0.85
      );
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      t += 0.0025;
      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}

// ─── Scroll Progress ──────────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY     = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const dotOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1">
      <div className="w-0.5 h-32 bg-white/10 rounded-full overflow-hidden relative">
        <motion.div
          className="absolute top-0 left-0 w-full bg-primary rounded-full origin-top"
          style={{ scaleY, height: "100%" }}
        />
      </div>
      <motion.div
        className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#00ffc8]"
        style={{ opacity: dotOpacity }}
      />
    </div>
  );
}

// ─── Smooth Scroll ────────────────────────────────────────────────────────────
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: "smooth" });
}

// ─── Project Card Skeleton ────────────────────────────────────────────────────
function ProjectSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/4 animate-pulse">
      <div className="h-48 bg-white/8" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-white/8 rounded w-3/4" />
        <div className="h-3 bg-white/8 rounded w-full" />
        <div className="h-3 bg-white/8 rounded w-2/3" />
        <div className="flex gap-2 mt-4">
          <div className="h-5 w-16 bg-white/8 rounded-full" />
          <div className="h-5 w-16 bg-white/8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Social Icons Row ─────────────────────────────────────────────────────────
function SocialIcons({ direction = "row" }: { direction?: "row" | "col" }) {
  return (
    <div className={`flex ${direction === "col" ? "flex-col" : "flex-row"} gap-3`}>
      {SOCIALS.map((s) => {
        const Icon = getIcon(s.icon);
        return (
          <motion.a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, y: direction === "col" ? 0 : -2 }}
            whileTap={{ scale: 0.9 }}
            title={s.label}
            className="w-9 h-9 rounded-full border border-white/10 bg-white/5
                       flex items-center justify-center text-grayish
                       hover:border-primary/60 hover:text-primary
                       hover:shadow-[0_0_12px_rgba(0,255,200,0.3)]
                       transition-all duration-200"
          >
            {Icon ? <Icon className="w-4 h-4" /> : null}
          </motion.a>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [scrolled, setScrolled]           = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [activeCert, setActiveCert]       = useState<Certificate | null>(null);
  const [repos, setRepos]                 = useState<GithubRepo[]>([]);
  const [reposLoading, setReposLoading]   = useState(true);
  const [reposError, setReposError]       = useState(false);
  const [copied, setCopied]               = useState(false);

  // Copy email to clipboard
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(MY_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = MY_EMAIL;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Fetch GitHub repos with topic:portfolio (owned + collaborated)
  useEffect(() => {
    const fetchRepos = async () => {
      setReposLoading(true);
      setReposError(false);
      try {
        const headers = { Accept: "application/vnd.github+json" };

        const [ownedRes, involvedRes] = await Promise.all([
          fetch(
            `https://api.github.com/search/repositories?q=topic:portfolio+user:${GITHUB_USERNAME}+fork:true&per_page=30`,
            { headers }
          ),
          fetch(
            `https://api.github.com/search/repositories?q=topic:portfolio+involves:${GITHUB_USERNAME}+fork:true&per_page=30`,
            { headers }
          ),
        ]);

        if (!ownedRes.ok && !involvedRes.ok) throw new Error("GitHub API error");

        const [ownedData, involvedData] = await Promise.all([
          ownedRes.ok ? ownedRes.json() : { items: [] },
          involvedRes.ok ? involvedRes.json() : { items: [] },
        ]);

        const merged = [
          ...(ownedData.items ?? []),
          ...(involvedData.items ?? []),
        ] as GithubRepo[];

        const seen = new Set<number>();
        const unique = merged.filter((r) => {
          if (seen.has(r.id)) return false;
          seen.add(r.id);
          return true;
        });

        setRepos(unique);
      } catch {
        setReposError(true);
      } finally {
        setReposLoading(false);
      }
    };

    fetchRepos();
  }, []);

  // Navbar glass on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active nav — scroll-based
  useEffect(() => {
    const ids = NAV_LINKS.map((n) => n.toLowerCase());

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

      setActiveSection(best);
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

  // Close modal on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveCert(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Format repo name: "my-cool-repo" → "My Cool Repo"
  const formatRepoName = (name: string) =>
    name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">

      {/* Aurora */}
      <AuroraCanvas />

      {/* Grain */}
      <div
        className="fixed inset-0 z-1 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* ── Copied toast ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : 20 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-200 pointer-events-none
                   px-5 py-2.5 rounded-full bg-primary text-dark1 text-xs font-bold
                   shadow-[0_0_24px_rgba(0,255,200,0.5)] tracking-wide"
      >
        ✓ Email copied to clipboard!
      </motion.div>

      {/* Scroll indicator */}
      <ScrollProgress />

      {/* ── All page content ── */}
      <div className="relative z-10">

        {/* ════ NAVBAR ════ */}
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={[
              "flex items-center justify-between gap-6 md:gap-10 px-6 md:px-8 py-3",
              "rounded-full border transition-all duration-500",
              scrolled
                ? "bg-white/8 backdrop-blur-2xl border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                : "bg-white/4 backdrop-blur-md border-white/8 shadow-none",
            ].join(" ")}
          >
            <motion.span
              whileHover={{ scale: 1.06 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-primary font-bold tracking-widest text-xs md:text-sm select-none cursor-pointer"
            >
              Christian.dev
            </motion.span>

            <div className="hidden md:flex gap-6 text-sm">
              {NAV_LINKS.map((label) => {
                const id       = label.toLowerCase();
                const isActive = activeSection === id;
                return (
                  <button
                    key={label}
                    onClick={() => scrollToSection(id)}
                    className="relative group py-1 focus:outline-none"
                  >
                    <span
                      className={`transition-colors duration-300 ${
                        isActive
                          ? "text-primary"
                          : "text-grayish group-hover:text-primary"
                      }`}
                    >
                      {label}
                    </span>

                    <motion.span
                      className="absolute left-0 -bottom-0.5 h-[1.5px] bg-primary rounded-full"
                      initial={false}
                      animate={{ width: isActive ? "100%" : "0%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { window.open("/resume/Alparo, Christian Lorrence B. - Resume.pdf", "_blank"); return false; }}
              className="px-4 py-1.5 rounded-full bg-primary text-dark1
                         text-xs font-bold tracking-wide
                         shadow-[0_0_16px_rgba(0,255,200,0.35)]
                         hover:shadow-[0_0_24px_rgba(0,255,200,0.55)]
                         transition-shadow duration-300"
            >
              <span className="hidden md:inline">Resume</span>
              <span className="md:hidden">Hire</span>
            </motion.button>
          </motion.div>
        </nav>

        {/* ════ HERO ════ */}
        <section className="relative px-10 md:px-20 h-screen flex flex-col justify-center">

          {/* Social icons — fixed left side, vertically centered */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4"
          >
            <SocialIcons direction="col" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3"
          >
            <span className="text-xs font-mono tracking-[0.25em] text-primary/70 uppercase">
              Full-Stack Developer
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
          >
            Hi, I&apos;m{" "}
            <span
              className="text-primary"
              style={{ textShadow: "0 0 40px rgba(0,255,200,0.4)" }}
            >
              Christian
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            className="mt-5 max-w-xl text-grayish text-lg leading-relaxed"
          >
            I build modern, interactive, high-performance web apps — crafted
            with precision and a deep love for clean UX.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex gap-4 items-center"
          >
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("projects")}
              className="px-7 py-3 bg-primary text-dark1 rounded-xl font-bold text-sm
                         shadow-[0_0_28px_rgba(0,255,200,0.4)]
                         hover:shadow-[0_0_40px_rgba(0,255,200,0.6)]
                         transition-shadow duration-300"
            >
              View My Work
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("contact")}
              className="px-7 py-3 rounded-xl font-bold text-sm text-primary
                         border border-primary/30 hover:border-primary/70
                         hover:bg-primary/5 transition-all duration-300"
            >
              Contact Me
            </motion.button>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-grayish/50 tracking-widest uppercase font-mono">
              scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-px h-8 bg-linear-to-b from-primary/60 to-transparent"
            />
          </motion.div>
        </section>

        {/* ════ ABOUT ════ */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="px-10 md:px-20 py-24"
        >
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-3xl font-bold text-primary">About Me</h3>
            <div className="flex-1 h-px bg-linear-to-r from-primary/40 to-transparent" />
          </div>
          <div className="max-w-2xl space-y-4">
            <p className="text-grayish text-lg leading-relaxed">
              I&apos;m a developer focused on building clean UI, smooth animations,
              and scalable applications. I enjoy turning complex ideas into
              intuitive experiences.
            </p>
            <p className="text-grayish leading-relaxed">
              With a passion for both design and engineering, I bridge the gap
              between pixel-perfect interfaces and rock-solid backend systems.
            </p>
          </div>
        </motion.section>

        {/* ════ TECH STACK ════ */}
        <section className="px-10 md:px-20 py-20">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-3xl font-bold text-primary">Tech Stack</h3>
            <div className="flex-1 h-px bg-linear-to-r from-primary/40 to-transparent" />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3"
          >
            {SKILLS.map((skill) => (
              <motion.div
                key={skill.name}
                variants={skillVariant}
                whileHover={{ scale: 1.08, borderColor: "rgba(0,255,200,0.6)" }}
                className="group flex flex-col items-center justify-center gap-2.5
                           p-4 rounded-2xl border border-white/8
                           bg-white/4 backdrop-blur-md
                           hover:shadow-[0_0_20px_rgba(0,255,200,0.15)]
                           transition-all duration-300 cursor-default"
              >
                {(() => {
                  const Icon = getIcon(skill.icon);
                  return Icon ? (
                    <Icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                  ) : null;
                })()}
                <span className="text-[10px] text-grayish text-center leading-tight">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ════ PROJECTS ════ */}
        <section id="projects" className="px-10 md:px-20 py-24">
          <div className="flex items-center gap-4 mb-12">
            <h3 className="text-3xl font-bold text-primary">Projects</h3>
            <div className="flex-1 h-px bg-linear-to-r from-primary/40 to-transparent" />
          </div>

          {/* Loading skeletons */}
          {reposLoading && (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => <ProjectSkeleton key={i} />)}
            </div>
          )}

          {/* Error state */}
          {reposError && !reposLoading && (
            <div className="text-center py-16">
              <p className="text-grayish text-sm mb-4">
                Couldn&apos;t load projects from GitHub.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-xs text-primary border border-primary/30 px-4 py-2 rounded-full
                           hover:bg-primary/5 transition-all duration-200"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!reposLoading && !reposError && repos.length === 0 && (
            <p className="text-grayish text-sm text-center py-16">
              No repos with the <span className="text-primary font-mono">portfolio</span> topic found.
            </p>
          )}

          {/* Repos grid */}
          {!reposLoading && !reposError && repos.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid md:grid-cols-3 gap-8"
            >
              {repos.map((repo) => (
                <motion.div
                  key={repo.id}
                  variants={cardVariant}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="group relative rounded-2xl overflow-hidden
                             border border-white/10 bg-white/4 backdrop-blur-md
                             hover:border-primary/40
                             hover:shadow-[0_20px_60px_rgba(0,255,200,0.1)]
                             transition-all duration-300"
                >
                  {/* Shine sweep on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 40%, rgba(0,255,200,0.05) 50%, transparent 60%)",
                    }}
                  />

                  <div className="p-6 flex flex-col h-full min-h-[200px]">
                    <h4 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                      {formatRepoName(repo.name)}
                    </h4>

                    <p className="text-grayish text-sm mb-5 leading-relaxed flex-1">
                      {repo.description ?? "No description provided."}
                    </p>

                    {/* Topics as tech stack tags (excluding "portfolio") */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {repo.topics
                        .filter((t) => t !== "portfolio")
                        .slice(0, 6)
                        .map((topic, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-3 py-1 rounded-full
                                       bg-primary/8 border border-primary/20
                                       text-primary/80 font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                    </div>

                    {/* Action buttons — slide up on hover */}
                    <div className="flex gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold
                                   border border-white/20 bg-white/5 text-white
                                   hover:border-primary/60 hover:text-primary
                                   transition-all duration-200"
                      >
                        {(() => { const I = getIcon("FaGithub"); return I ? <I className="w-3.5 h-3.5" /> : null; })()}
                        GitHub
                      </a>

                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold
                                     bg-primary text-dark1
                                     shadow-[0_0_12px_rgba(0,255,200,0.3)]
                                     hover:shadow-[0_0_20px_rgba(0,255,200,0.5)]
                                     transition-all duration-200"
                        >
                          {(() => { const I = getIcon("FaExternalLinkAlt"); return I ? <I className="w-3 h-3" /> : null; })()}
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* ════ CERTIFICATES ════ */}
        <section id="certificates" className="px-10 md:px-20 py-24">
          <div className="flex items-center gap-4 mb-12">
            <h3 className="text-3xl font-bold text-primary">Certificates</h3>
            <div className="flex-1 h-px bg-linear-to-r from-primary/40 to-transparent" />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {CERTIFICATES.map((cert) => (
              <motion.div
                key={cert.id}
                variants={cardVariant}
                whileHover={{ y: -5 }}
                onClick={() => setActiveCert(cert)}
                className="group relative cursor-pointer rounded-2xl overflow-hidden
                           border border-white/10 bg-white/4 backdrop-blur-md p-6
                           hover:border-primary/50
                           hover:shadow-[0_0_40px_rgba(0,255,200,0.12)]
                           transition-all duration-300"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,255,200,0.07) 0%, transparent 40%, rgba(0,140,255,0.07) 70%, transparent 100%)",
                  }}
                />

                <span className="inline-block text-[10px] font-mono tracking-widest uppercase
                                 px-2.5 py-1 rounded-full border border-primary/30
                                 bg-primary/8 text-primary/80 mb-4">
                  {cert.category}
                </span>

                <h4 className="text-sm font-semibold text-white leading-snug mb-1
                               group-hover:text-primary transition-colors duration-300">
                  {cert.name}
                </h4>

                <p className="text-xs text-grayish mb-4">{cert.issuer}</p>
                <p className="text-[10px] font-mono text-grayish/60">{cert.date}</p>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100
                               rotate-[-20deg] group-hover:rotate-[-12deg]
                               transition-all duration-300">
                  <div className="px-2 py-0.5 rounded border-2 border-primary/70
                                  text-primary text-[9px] font-black tracking-[0.2em] uppercase
                                  shadow-[0_0_10px_rgba(0,255,200,0.4)]">
                    Verified
                  </div>
                </div>

                <div className="absolute bottom-4 right-5 opacity-0 group-hover:opacity-100
                               transition-opacity duration-300">
                  <span className="text-[9px] font-mono text-primary/60 tracking-wider">
                    view →
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ════ CERTIFICATE MODAL ════ */}
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCert(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
            style={{ background: "rgba(2,6,23,0.88)", backdropFilter: "blur(14px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl h-[82vh] rounded-2xl overflow-hidden
                         border border-primary/30 bg-dark2 flex flex-col
                         shadow-[0_0_80px_rgba(0,255,200,0.12)]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-dark1/60">
                <div>
                  <p className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">
                    {activeCert.category} · {activeCert.date}
                  </p>
                  <h4 className="text-base font-bold text-white mt-0.5">
                    {activeCert.name}
                  </h4>
                  <p className="text-xs text-grayish">{activeCert.issuer}</p>
                </div>

                <button
                  onClick={() => setActiveCert(null)}
                  className="w-8 h-8 rounded-full border border-white/10 bg-white/5
                             flex items-center justify-center text-grayish text-sm font-bold
                             hover:border-primary/50 hover:text-primary
                             transition-all duration-200 shrink-0"
                >
                  ✕
                </button>
              </div>

              <iframe
                src={`${activeCert.pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
                title={activeCert.name}
                className="flex-1 w-full border-0 bg-dark2"
              />

              <div className="absolute bottom-0 left-0 right-0 h-[2px]
                             bg-linear-to-r from-transparent via-primary/60 to-transparent" />
            </motion.div>
          </motion.div>
        )}

        {/* ════ CONTACT ════ */}
        <section id="contact" className="px-10 md:px-20 py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-lg mx-auto"
          >
            <span className="text-xs font-mono tracking-[0.25em] text-primary/60 uppercase">
              Get in touch
            </span>

            <h3
              className="mt-3 text-4xl md:text-5xl font-extrabold text-primary"
              style={{ textShadow: "0 0 60px rgba(0,255,200,0.25)" }}
            >
              Let&apos;s Build Together
            </h3>

            <p className="mt-4 text-grayish leading-relaxed">
              Have a project in mind? I&apos;m open to freelance, full-time, or
              just a good chat about tech.
            </p>

            {/* Email copy button */}
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyEmail}
              className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-primary text-dark1
                         rounded-xl font-bold text-sm tracking-wide
                         shadow-[0_0_30px_rgba(0,255,200,0.45)]
                         hover:shadow-[0_0_50px_rgba(0,255,200,0.65)]
                         transition-shadow duration-300"
            >
              {(() => {
                const Icon = getIcon(copied ? "FaCheck" : "FaRegCopy");
                return Icon ? <Icon className="w-4 h-4" /> : null;
              })()}
              {copied ? "Copied!" : "Copy Email"}
            </motion.button>

            <p className="mt-3 text-grayish/50 text-xs font-mono">{MY_EMAIL}</p>

            {/* Socials row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex lg:hidden justify-center mt-8"
            >
              <SocialIcons direction="row" />
            </motion.div>
          </motion.div>
        </section>

        {/* ════ FOOTER ════ */}
        <footer className="px-10 md:px-20 py-8 border-t border-white/5">
          <div className="flex justify-center">
            <p className="text-grayish/40 text-xs font-mono tracking-wider text-center">
              © {new Date().getFullYear()} Christian · Built with Next.js & Framer Motion
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}