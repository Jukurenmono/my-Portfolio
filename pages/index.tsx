"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CursorTrail from "@/components/cursorTrail";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const projects = [
    {
      id: 1,
      name: "Project Tracker",
      description: "A productivity app for managing projects and tasks.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
      githubUrl: "https://github.com/Jukurenmono/project-tracker.git",
      liveUrl: "https://task-manager-demo.com",
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

  const skills = [
    // Core Frontend
    { name: "Next.js", icon: "nextdotjs" },
    { name: "React", icon: "react" },
    { name: "TypeScript", icon: "typescript" },
    { name: "JavaScript", icon: "javascript" },
    { name: "HTML5", icon: "html5" },
    { name: "CSS3", icon: "css3" },
  
    // Styling
    { name: "Tailwind CSS", icon: "tailwindcss" },
    { name: "Sass", icon: "sass" },
    { name: "Framer Motion", icon: "framer" },
  
    // Backend / DB
    { name: "Node.js", icon: "nodedotjs" },
    { name: "Express", icon: "express" },
    { name: "MongoDB", icon: "mongodb" },
    { name: "Firebase", icon: "firebase" },
    { name: "Supabase", icon: "supabase" },
  
    // Tools
    { name: "Git", icon: "git" },
    { name: "GitHub", icon: "github" },
    { name: "Vercel", icon: "vercel" },
    { name: "Figma", icon: "figma" },
  
    // Optional / Advanced
    { name: "GraphQL", icon: "graphql" },
    { name: "Prisma", icon: "prisma" },
    { name: "Docker", icon: "docker" },
  ];

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  // 🌌 SHADER-STYLE BACKGROUND
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    let t = 0;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // soft dark base
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);

      // floating mesh blobs
      for (let i = 0; i < 6; i++) {
        const x =
          w * (0.5 + Math.sin(t * 0.6 + i * 1.2) * 0.35);
        const y =
          h * (0.5 + Math.cos(t * 0.5 + i * 1.5) * 0.35);

        const radius = 300 + Math.sin(t + i) * 80;

        const gradient = ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          radius
        );

        gradient.addColorStop(0, "rgba(0, 255, 200, 0.16)");
        gradient.addColorStop(0.5, "rgba(0, 255, 200, 0.06)");
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      t += 0.003;
      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* <CursorTrail /> */}

      <div className="relative z-10">
        
      {/* NAVBAR */}
      <nav
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 
        transition-all duration-300 w-full flex justify-center px-4
        ${scrolled ? "scale-95 opacity-90" : "scale-100 opacity-100"}`}
      >
        <div
          className="flex items-center justify-between 
                    w-fit md:w-auto gap-6 md:gap-10 px-6 md:px-8 py-3
                    rounded-full bg-white/5 backdrop-blur-xl 
                    border border-white/10 shadow-lg shadow-black/20"
        >
          {/* Logo */}
          <h1 className="text-primary font-bold tracking-widest text-xs md:text-sm">
            MyPortfolio
          </h1>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 text-sm text-grayish">
            {["About", "Projects", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative group"
              >
                <span className="group-hover:text-primary transition">
                  {item}
                </span>

                <span className="absolute left-0 -bottom-1 w-0 h-[1px] 
                                bg-primary group-hover:w-full 
                                transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA (desktop only) */}
          <a
            href="#contact"
            className="hidden md:inline-flex px-4 py-1.5 rounded-full 
                      bg-primary text-dark1 text-xs font-semibold
                      hover:scale-105 transition"
          >
            Hire Me
          </a>

          {/* Mobile Button */}
          <a
            href="#contact"
            className="md:hidden px-4 py-1.5 rounded-full 
                      bg-primary text-dark1 text-xs font-semibold"
          >
            Hire
          </a>
        </div>
      </nav>

        {/* HERO */}
        <section className="px-10 md:px-20 h-[90vh] flex flex-col justify-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold"
          >
            Hi, I'm{" "}
            <span className="text-primary">Christian</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-xl text-grayish"
          >
            I build modern, interactive, high-performance web apps.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-6 py-3 bg-primary text-dark1 rounded-xl"
          >
            View My Work
          </motion.button>
        </section>

        {/* ABOUT */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="px-10 md:px-20 py-20"
        >
          <h3 className="text-3xl text-primary mb-6">
            About Me
          </h3>
          <p className="max-w-2xl text-grayish">
            I’m a developer focused on building clean UI, smooth
            animations, and scalable applications. I enjoy turning
            complex ideas into intuitive experiences.
          </p>
        </motion.section>

        {/* TECH STACK */}
        <section className="px-10 md:px-20 py-20">
          <h3 className="text-3xl text-primary mb-10">
            Tech Stack
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="group flex flex-col items-center justify-center gap-3 
                          p-4 rounded-2xl border border-white/10 
                          bg-white/5 backdrop-blur-md 
                          hover:border-primary hover:shadow-[0_0_20px_rgba(0,255,200,0.2)]
                          transition-all duration-300"
              >
                <img
                  src={`https://cdn.simpleicons.org/${skill.icon}/00ffc8`}
                  alt={skill.name}
                  className="w-8 h-8 group-hover:scale-110 transition"
                />

                <span className="text-xs text-grayish text-center">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="px-10 md:px-20 py-24 bg-dark3/30 backdrop-blur-md"
        >
          <h3 className="text-3xl font-bold mb-12 text-primary">
            Projects
          </h3>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            className="grid md:grid-cols-3 gap-10"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={item}
                whileHover={{ scale: 1.03 }}
                className="group rounded-2xl overflow-hidden border border-white/10 bg-dark2"
              >
                <div className="relative h-48">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>

                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2 group-hover:text-primary transition">
                    {project.name}
                  </h4>

                  <p className="text-grayish text-sm mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10"
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

        {/* CONTACT */}
        <section
          id="contact"
          className="px-10 md:px-20 py-20 text-center"
        >
          <h3 className="text-3xl text-primary mb-6">
            Contact
          </h3>

          <p className="text-grayish mb-6">
            Let’s build something amazing together.
          </p>

          <motion.a
            whileHover={{ scale: 1.1 }}
            href="mailto:youremail@example.com"
            className="px-6 py-3 bg-primary text-dark1 rounded-xl"
          >
            Email Me
          </motion.a>
        </section>
      </div>
    </div>
  );
}