import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

export interface ChromaGridProps {
  items?: Resume[];
  className?: string;
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

type SetterFn = (v: number | string) => void;

const ChromaGrid: React.FC<ChromaGridProps> = ({
  items,
  className = "",
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<SetterFn | null>(null);
  const setY = useRef<SetterFn | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const { fs } = usePuterStore();
  const [resumeUrls, setResumeUrls] = useState<Record<string, string>>({});

  const data = items;

  useEffect(() => {
    const loadImages = async () => {
      const urls: Record<string, string> = {};
      for (const r of data!) {
        if (!r.imagePath) continue;
        try {
          const blob = await fs.read(r.imagePath); // فقط یک فایل
          if (blob) {
            urls[r.imagePath] = URL.createObjectURL(blob);
          }
        } catch (e) {
          console.error("Error reading file:", e);
        }
      }
      setResumeUrls(urls);
    };

    loadImages();
  }, [data, fs]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px") as SetterFn;
    setY.current = gsap.quickSetter(el, "--y", "px") as SetterFn;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url?: string) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCardMove: React.MouseEventHandler<HTMLElement> = (e) => {
    const c = e.currentTarget as HTMLElement;
    const rect = c.getBoundingClientRect();
    c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`w-10/12 mx-auto relative h-full grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}
      style={
        {
          "--r": `${radius}px`,
          "--x": "50%",
          "--y": "50%",
        } as React.CSSProperties
      }
    >
      {data!.map((c, i) => (
        <Link
          to={`/resume/${c.id}`}
          className="resume-card animate-in fade-in duration-1000"
          key={i}
        >
          <article
            onMouseMove={handleCardMove}
            onClick={() => handleCardClick(c.url)}
            className="group relative flex flex-col w-full rounded-[20px] overflow-hidden border-2 border-transparent transition-colors duration-300 cursor-pointer"
            style={
              {
                "--card-border": c.borderColor || "transparent",
                background: c.gradient,
                "--spotlight-color": "rgba(255,255,255,0.3)",
              } as React.CSSProperties
            }
          >
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)",
              }}
            />
            <div className="relative z-10 flex-1 p-[10px] box-border">
              <img
                src={resumeUrls[c.imagePath ?? ""] || c.imagePath}
                alt={c.companyName}
                loading="lazy"
                className="w-full h-[400px] object-cover object-top rounded-[10px]"
              />
            </div>
            <footer className="relative z-10 p-3 text-white font-sans flex items-center justify-between gap-x-3">
              <h4 className="m-0 text-[1.05rem] font-semibold truncate max-w-[60%]">
                to : {c.companyName}
              </h4>
              <p className="m-0 text-[0.85rem] opacity-85 ">
                as : <span className="uppercase">{c.jobTitle}</span>
              </p>
            </footer>
          </article>
        </Link>
      ))}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          backdropFilter: "grayscale() ",
          WebkitBackdropFilter: "grayscale(1) ",
          background: "rgba(0, 0, 0, 0)",
          maskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)",
          WebkitMaskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)",
        }}
      />
      <div
        ref={fadeRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-[250ms] z-40"
        style={{
          backdropFilter: "grayscale(1) brightness(0.78)",
          WebkitBackdropFilter: "grayscale(1) brightness(0.78)",
          background: "rgba(0,0,0,0.001)",
          maskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)",
          opacity: 1,
        }}
      />
    </div>
  );
};

export default ChromaGrid;
