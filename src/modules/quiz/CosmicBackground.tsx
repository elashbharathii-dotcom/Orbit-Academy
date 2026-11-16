import React, { useEffect, useRef, useState } from 'react';

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mouse parallax tracking
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = (e.clientX - cx) / cx; // -1 to 1
      targetY = (e.clientY - cy) / cy;
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      setMouseOffset({ x: currentX, y: currentY });
      animId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Star & particle system
    interface Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      alpha: number;
      alphaSpeed: number;
    }

    const starCount = 95;
    const particles: Particle[] = [];
    const colors = [
      'rgba(56, 221, 248, 0.85)', // Cyan
      'rgba(167, 139, 250, 0.85)', // Violet
      'rgba(232, 121, 249, 0.75)', // Magenta
      'rgba(251, 191, 36, 0.75)',  // Amber
      'rgba(255, 255, 255, 0.95)', // White
    ];

    for (let i = 0; i < starCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.8 + 0.2,
        alphaSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    // Light trails / subtle shooting star
    interface LightTrail {
      x: number;
      y: number;
      length: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }
    let shootingStar: LightTrail | null = null;
    let nextShootingStarTime = Date.now() + 2500;
    let orbitAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle animated orbital rings in background
      orbitAngle += 0.002;
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(orbitAngle);
      ctx.strokeStyle = 'rgba(56, 221, 248, 0.035)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.45, height * 0.35, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(167, 139, 250, 0.025)';
      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.55, height * 0.45, -Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 1. Draw glowing stars
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.95 || p.alpha < 0.2) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.radius * 4;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Occasional soft shooting light trail
      const now = Date.now();
      if (!shootingStar && now > nextShootingStarTime) {
        shootingStar = {
          x: Math.random() * (width * 0.7),
          y: Math.random() * (height * 0.4),
          length: Math.random() * 120 + 80,
          vx: Math.random() * 6 + 7,
          vy: Math.random() * 3 + 3,
          alpha: 0.85,
          color: Math.random() > 0.5 ? '#38DDF8' : '#A78BFA',
        };
        nextShootingStarTime = now + Math.random() * 6000 + 4000;
      }

      if (shootingStar) {
        ctx.save();
        ctx.globalAlpha = shootingStar.alpha;
        const grad = ctx.createLinearGradient(
          shootingStar.x - shootingStar.vx * 8,
          shootingStar.y - shootingStar.vy * 8,
          shootingStar.x,
          shootingStar.y
        );
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, shootingStar.color);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = shootingStar.color;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x - (shootingStar.vx * shootingStar.length) / 8, shootingStar.y - (shootingStar.vy * shootingStar.length) / 8);
        ctx.lineTo(shootingStar.x, shootingStar.y);
        ctx.stroke();
        ctx.restore();

        shootingStar.x += shootingStar.vx;
        shootingStar.y += shootingStar.vy;
        shootingStar.alpha -= 0.02;

        if (shootingStar.alpha <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar = null;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#050816]">
      {/* Deep Space Base Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0B1024] via-[#050816] to-[#02040B]" />

      {/* Atmospheric Nebula Ambient Glows with Parallax Shift */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out pointer-events-none"
        style={{
          transform: `translate3d(${mouseOffset.x * -20}px, ${mouseOffset.y * -20}px, 0)`,
        }}
      >
        {/* Cyan Nebula Top Left */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-[#38DDF8]/14 blur-[140px]" />

        {/* Violet / Purple Nebula Top Right */}
        <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-[#A78BFA]/14 blur-[150px]" />

        {/* Magenta Nebula Center Bottom */}
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-[#E879F9]/12 blur-[130px]" />

        {/* Amber Stellar Forge Center */}
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-[#F59E0B]/8 blur-[160px]" />
      </div>

      {/* Subtle Grid Line Perspective Mesh */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none transition-transform duration-500 ease-out"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          transform: `translate3d(${mouseOffset.x * -10}px, ${mouseOffset.y * -10}px, 0)`,
        }}
      />

      {/* Interactive / Animated Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
