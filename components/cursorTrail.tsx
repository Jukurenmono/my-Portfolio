"use client";

import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<
    { x: number; y: number; vx: number; vy: number; life: number }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // 🔥 MORE PARTICLES PER MOVE
    const spawnParticles = (x: number, y: number) => {
      for (let i = 0; i < 10; i++) { // ⬅️ increased from 4 → 10
        particles.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2.2, // wider spread
          vy: (Math.random() - 0.5) * 2.2,
          life: 0,
        });
      }
    };

    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();

      // 🔥 more frequent emission
      if (now - lastTime > 5) { // was 10 → now 5
        spawnParticles(e.clientX, e.clientY);
        lastTime = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // allow more lifespan for richer cloud
      particles.current = particles.current.filter((p) => p.life < 40);

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];

        p.x += p.vx;
        p.y += p.vy;

        // slight drag (powder drift feel)
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.life++;

        const opacity = 1 - p.life / 40;
        const size = 5 - p.life * 0.1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(0, 255, 200, ${opacity * 0.7})`;

        ctx.shadowColor = "rgba(0,255,200,0.6)";
        ctx.shadowBlur = 18;

        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-screen"
    />
  );
}