import React, { useEffect, useRef } from 'react';

interface CockpitCanvasProps {
  mode: 'hangar' | 'warp' | 'orbit' | 'combat';
  className?: string;
}

export const CockpitCanvas: React.FC<CockpitCanvasProps> = ({ mode, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Starfield particles
    interface Star {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      speed: number;
    }

    const starCount = mode === 'warp' ? 220 : 140;
    const stars: Star[] = [];
    const colors = ['#38BDF8', '#818CF8', '#A78BFA', '#FFFFFF', '#FDE047'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 1,
      });
    }

    let angle = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(3, 6, 17, 0.45)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw Hangar Ambience Grid if in hangar mode
      if (mode === 'hangar') {
        // Perspective docking bay runway lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1;
        const lineCount = 12;
        for (let i = 0; i <= lineCount; i++) {
          const x = (width / lineCount) * i;
          ctx.beginPath();
          ctx.moveTo(x, height);
          ctx.lineTo(cx + (x - cx) * 0.25, cy * 1.1);
          ctx.stroke();
        }

        // Horizontal runway stripes
        for (let y = cy * 1.1; y < height; y += (height - cy * 1.1) / 7) {
          const progress = (y - cy * 1.1) / (height - cy * 1.1);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.05 + progress * 0.15})`;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Render 3D Starfield / Warp effect
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (mode === 'warp') {
          star.z -= star.speed * 8; // high speed hyperspace
        } else if (mode === 'orbit') {
          star.z -= star.speed * 0.8;
        } else {
          star.z -= star.speed * 0.4;
        }

        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 250 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = Math.max(0.6, (1 - star.z / width) * star.size * (mode === 'warp' ? 1.8 : 1.2));
          const alpha = Math.min(1, Math.max(0.15, (1 - star.z / width) * 1.3));

          if (mode === 'warp') {
            // Draw warp streaks
            const prevK = 250 / (star.z + star.speed * 20);
            const prevPx = star.x * prevK + cx;
            const prevPy = star.y * prevK + cy;

            ctx.strokeStyle = star.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = size * 0.8;
            ctx.beginPath();
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.stroke();
            ctx.globalAlpha = 1;
          } else {
            ctx.fillStyle = star.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Orbital planetary limb glow in 'orbit' mode
      if (mode === 'orbit') {
        const grad = ctx.createRadialGradient(cx, height * 1.5, height * 0.4, cx, height * 1.5, height * 1.1);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
        grad.addColorStop(0.3, 'rgba(14, 116, 144, 0.25)');
        grad.addColorStop(0.7, 'rgba(3, 6, 17, 0.05)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, height * 1.5, height * 1.1, Math.PI, 0);
        ctx.fill();
      }

      angle += 0.01;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [mode]);

  return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none z-0 ${className}`} />;
};

