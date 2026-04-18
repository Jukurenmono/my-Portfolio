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

// ─── Data ────────────────────────────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    id: 1,
    name: "Project Tracker",
    description: "A productivity app for managing projects and tasks.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    githubUrl: "https://github.com/Jukurenmono/project-tracker.git",
    liveUrl: "https://capstone-project-tracker.vercel.app/",
    image: "/projects/projectTracker.png",
  },
  {
    id: 2,
    name: "Portfolio Website",
    description: "Modern developer portfolio with smooth animations.",
    techStack: ["React", "Framer Motion", "Tailwind CSS"],
    githubUrl: "https://github.com/yourusername/portfolio",
    liveUrl: "https://portfolio-demo.com",
    image: "/projects/portfolio.png",
  },
  {
    id: 3,
    name: "E-commerce Platform",
    description: "Full-stack e-commerce solution.",
    techStack: ["Next.js", "MongoDB", "Stripe"],
    githubUrl: "https://github.com/yourusername/ecommerce",
    liveUrl: "https://ecommerce-demo.com",
    image: "/projects/ecommerce.png",
  },
];

const SKILLS: Skill[] = [
  { name: "Next.js", icon: "SiNextdotjs" },
  { name: "React", icon: "FaReact" },
  { name: "TypeScript", icon: "SiTypescript" },
  { name: "JavaScript", icon: "SiJavascript" },
  { name: "HTML5", icon: "FaHtml5" },
  { name: "CSS3", icon: "FaCss3Alt" },
  { name: "Tailwind CSS", icon: "SiTailwindcss" },
  { name: "Sass", icon: "SiSass" },
  { name: "Framer Motion", icon: "SiFramer" },
  { name: "Node.js", icon: "FaNodeJs" },
  { name: "Express", icon: "SiExpress" },
  { name: "MongoDB", icon: "SiMongodb" },
  { name: "Firebase", icon: "SiFirebase" },
  { name: "Supabase", icon: "SiSupabase" },
  { name: "Git", icon: "FaGitAlt" },
  { name: "GitHub", icon: "FaGithub" },
  { name: "Vercel", icon: "SiVercel" },
  { name: "Figma", icon: "FaFigma" },
  { name: "GraphQL", icon: "SiGraphql" },
  { name: "Prisma", icon: "SiPrisma" },
  { name: "Docker", icon: "FaDocker" },
];

const getIcon = (iconName: string) => {
  const FaIcon = FaIcons[iconName as keyof typeof FaIcons];
  if (FaIcon) return FaIcon;

  const SiIcon = SiIcons[iconName as keyof typeof SiIcons];
  if (SiIcon) return SiIcon;

  return null;
};

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
    name: "Build Complete CMS Blog in PHP MySQL Bootstrap & PDO",
    issuer: "Udemy",
    date: "Dec 2024",
    category: "Backend",
    pdfUrl: "certificates/Udemy Certificate 2.pdf",
  },
  {
    id: 3,
    name: "Learn PHP and MySQL for Web Application and Web Development",
    issuer: "Udemy",
    date: "Sept 2024",
    category: "Backend",
    pdfUrl: "certificates/Udemy Certificate.pdf",
  },
  {
    id: 4,
    name: "Node.js Application Development",
    issuer: "OpenJS Foundation",
    date: "Apr 2024",
    category: "Backend",
    pdfUrl: "/certificates/nodejs-dev.pdf",
  },
  {
    id: 5,
    name: "MongoDB Associate Developer",
    issuer: "MongoDB University",
    date: "May 2024",
    category: "Database",
    pdfUrl: "/certificates/mongodb-associate.pdf",
  },
  {
    id: 6,
    name: "Google UX Design",
    issuer: "Google / Coursera",
    date: "Jun 2024",
    category: "Design",
    pdfUrl: "/certificates/google-ux.pdf",
  },
  {
    id: 7,
    name: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "Jul 2024",
    category: "Cloud",
    pdfUrl: "/certificates/aws-cloud.pdf",
  },
  {
    id: 8,
    name: "Docker & Kubernetes Fundamentals",
    issuer: "KodeKloud",
    date: "Aug 2024",
    category: "DevOps",
    pdfUrl: "/certificates/docker-k8s.pdf",
  },
];

const NAV_LINKS = ["About", "Projects", "Certificates", "Contact"] as const;

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

      // Subtle grid lines
      ctx.strokeStyle = "rgba(0,255,200,0.15)";
      ctx.lineWidth = 1;
      const grid = 80;
      for (let x = 0; x < w; x += grid) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += grid) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Vignette
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [scrolled, setScrolled]           = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [activeCert, setActiveCert]       = useState<Certificate | null>(null);

  // Navbar glass on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active nav — scroll-based, works correctly in both directions including bottom of page
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
              whileHover={{scale: 1.06}}
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
              className="text-primary font-bold tracking-widest text-xs md:text-sm select-none">
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

                    {isActive && (
                      <motion.span
                        layoutId="navDot"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_#00ffc8]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {window.open('/resume/Alparo, Christian Lorrence B. - Resume.pdf', '_blank'); return false}}
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
            className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3"
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
                    <Icon
                      className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300"
                    />
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {PROJECTS.map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariant}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="group relative rounded-2xl overflow-hidden
                           border border-white/10 bg-white/4 backdrop-blur-md
                           hover:border-primary/40
                           hover:shadow-[0_20px_60px_rgba(0,255,200,0.1)]
                           transition-all duration-300"
              >
                {/* Project image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-dark3 via-transparent to-transparent opacity-80" />
                </div>

                {/* Shine sweep on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(0,255,200,0.05) 50%, transparent 60%)",
                  }}
                />

                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {project.name}
                  </h4>
                  <p className="text-grayish text-sm mb-5 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-3 py-1 rounded-full
                                   bg-primary/8 border border-primary/20
                                   text-primary/80 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
                {/* Holographic shimmer on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,255,200,0.07) 0%, transparent 40%, rgba(0,140,255,0.07) 70%, transparent 100%)",
                  }}
                />

                {/* Category badge */}
                <span className="inline-block text-[10px] font-mono tracking-widest uppercase
                                 px-2.5 py-1 rounded-full border border-primary/30
                                 bg-primary/8 text-primary/80 mb-4">
                  {cert.category}
                </span>

                {/* Cert name */}
                <h4 className="text-sm font-semibold text-white leading-snug mb-1
                               group-hover:text-primary transition-colors duration-300">
                  {cert.name}
                </h4>

                {/* Issuer */}
                <p className="text-xs text-grayish mb-4">{cert.issuer}</p>

                {/* Date */}
                <p className="text-[10px] font-mono text-grayish/60">{cert.date}</p>

                {/* VERIFIED stamp — rotates in on hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100
                               rotate-[-20deg] group-hover:rotate-[-12deg]
                               transition-all duration-300">
                  <div className="px-2 py-0.5 rounded border-2 border-primary/70
                                  text-primary text-[9px] font-black tracking-[0.2em] uppercase
                                  shadow-[0_0_10px_rgba(0,255,200,0.4)]">
                    Verified
                  </div>
                </div>

                {/* Click hint */}
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
              {/* Modal header */}
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

              {/* PDF viewer */}
              <iframe
                src={`${activeCert.pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
                title={activeCert.name}
                className="flex-1 w-full border-0 bg-dark2"
              />

              {/* Bottom accent line */}
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

            <motion.a
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:youremail@example.com"
              className="inline-block mt-8 px-8 py-3.5 bg-primary text-dark1
                         rounded-xl font-bold text-sm tracking-wide
                         shadow-[0_0_30px_rgba(0,255,200,0.45)]
                         hover:shadow-[0_0_50px_rgba(0,255,200,0.65)]
                         transition-shadow duration-300"
            >
              Email Me →
            </motion.a>
          </motion.div>
        </section>

        {/* ════ FOOTER ════ */}
        <footer className="px-10 md:px-20 py-8 border-t border-white/5 text-center">
          <p className="text-grayish/40 text-xs font-mono tracking-wider">
            © {new Date().getFullYear()} Christian · Built with Next.js &amp; Framer Motion
          </p>
        </footer>

      </div>
    </div>
  );
}