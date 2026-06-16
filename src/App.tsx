import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  ChevronRight,
  Code,
  FolderOpen,
  Book,
  Keyboard,
  X,
  Terminal,
  Settings,
  ZoomIn,
  Info,
  ArrowUp,
  ExternalLink,
  Sparkles,
  Shield,
  Layers,
  Globe,
  Download,
  Star,
  GitBranch,
  ChevronDown,
  Menu,
} from "lucide-react";

/* ─── Custom GitHub SVG Icon ─── */
const GitHubIcon = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 18, className = "", ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
};

/* ─── 3D Tilt Card Hook (desktop only) ─── */
function use3DTilt(intensity = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || window.innerWidth < 1024) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientY - centerY) / (rect.height / 2);
    const y = (e.clientX - centerX) / (rect.width / 2);
    rotateX.set(-x * intensity);
    rotateY.set(y * intensity);
  }, [rotateX, rotateY, intensity]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return { ref, springX, springY, handleMouseMove, handleMouseLeave };
}

/* ─── Mouse Glow (desktop only) ─── */
function MouseGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handler = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [x, y, isMobile]);

  if (isMobile) return null;

  return (
    <motion.div className="pointer-events-none fixed inset-0 z-[1] hidden md:block">
      <motion.div
        className="absolute w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-full pointer-events-none"
        style={{
          x, y,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

/* ─── Floating Particles (reduced on mobile) ─── */
function FloatingParticles() {
  const [count, setCount] = useState(20);
  useEffect(() => {
    setCount(window.innerWidth < 768 ? 10 : 25);
  }, []);

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.25 + 0.05,
  }));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
          animate={{ y: [-20, 20, -20], x: [-10, 15, -10] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── 3D Isometric Grid ─── */
function IsometricGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          transform: "perspective(500px) rotateX(60deg) scale(2.5)",
          transformOrigin: "center top",
        }}
      />
    </div>
  );
}

/* ─── 3D Cube (Hero) ─── */
function HeroCube() {
  const faces = [
    { color: "from-blue-500/20 to-blue-600/10", border: "border-blue-400/30", rot: "translateZ(40px)" },
    { color: "from-purple-500/20 to-purple-600/10", border: "border-purple-400/30", rot: "rotateY(180deg) translateZ(40px)" },
    { color: "from-cyan-500/20 to-cyan-600/10", border: "border-cyan-400/30", rot: "rotateY(-90deg) translateZ(40px)" },
    { color: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-400/30", rot: "rotateY(90deg) translateZ(40px)" },
    { color: "from-blue-400/20 to-blue-500/10", border: "border-blue-300/30", rot: "rotateX(90deg) translateZ(40px)" },
    { color: "from-violet-500/20 to-violet-600/10", border: "border-violet-400/30", rot: "rotateX(-90deg) translateZ(40px)" },
  ];
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: "800px" }}>
      <div className="cube-spin relative" style={{ width: 80, height: 80, transformStyle: "preserve-3d" }}>
        {faces.map((face, i) => (
          <div
            key={i}
            className={`absolute inset-0 border ${face.border} bg-gradient-to-br ${face.color} rounded-lg backdrop-blur-sm`}
            style={{ transform: face.rot }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Orbit Rings (Hero) ─── */
function OrbitRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="absolute w-52 md:w-72 h-52 md:h-72 rounded-full border border-blue-500/10" style={{ transform: "rotateX(70deg)" }}>
        <div className="animate-orbit absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-blue-500/60 shadow-lg shadow-blue-500/30" />
        </div>
      </div>
      <div className="absolute w-36 md:w-48 h-36 md:h-48 rounded-full border border-purple-500/10" style={{ transform: "rotateX(70deg) rotateZ(60deg)" }}>
        <div className="animate-orbit-reverse absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-purple-400/60" />
        </div>
      </div>
      <div className="absolute w-24 md:w-32 h-24 md:h-32 rounded-full border border-cyan-500/10" style={{ transform: "rotateX(70deg) rotateZ(120deg)" }}>
        <div className="animate-orbit absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: "10s" }}>
          <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-cyan-400/60" />
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Counter ─── */
function StatCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        const duration = 2000;
        const start = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * value));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ═════════════════════════════════════
   MAIN APP
   ═════════════════════════════════════ */
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"production" | "legacy">("production");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const heroTilt = use3DTilt(10);

  useEffect(() => {
    const onScroll = () => {
      setIsHeaderScrolled(window.scrollY > 30);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) { setIsModalOpen(false); document.body.style.overflow = ""; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setIsMobileMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const openModal = () => { setIsModalOpen(true); document.body.style.overflow = "hidden"; };
  const closeModal = () => { setIsModalOpen(false); document.body.style.overflow = ""; };
  const handleModalClick = (e: React.MouseEvent) => { if (e.target === modalRef.current) closeModal(); };

  const scrollToSection = (id: string) => {
    if (id === "#") { window.scrollTo({ top: 0, behavior: "smooth" }); setIsMobileMenuOpen(false); return; }
    const el = document.querySelector(id);
    if (el) {
      const hh = document.querySelector("header")?.offsetHeight || 0;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - hh - 16, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const keyboardControls = [
    { key: "Tab", label: "Settings Panel", desc: "Open or close the settings interface" },
    { key: "V", label: "Info Panel", desc: "Toggle the location info display" },
    { key: "M", label: "Manual Marker", desc: "Place a marker on the game map" },
    { key: "X", label: "Refresh", desc: "Reset state for the next round" },
    { key: "1", label: "Auto Place", desc: "Place marker at the exact predicted position", isPrimary: true },
    { key: "2", label: "Safe Place", desc: "Place marker with a randomized offset", isPrimary: true },
    { key: "S", label: "Zoom In", desc: "Increase the mini-map zoom level" },
    { key: "A", label: "Zoom Out", desc: "Decrease the mini-map zoom level" },
    { key: "C", label: "Copy Coords", desc: "Copy current coordinates to clipboard" },
    { key: "G", label: "Google Maps", desc: "Open the current location in Google Maps" },
    { key: "D", label: "Discord", desc: "Send location data to Discord webhook", isDiscord: true },
  ];

  const stats = [
    { value: 15, suffix: "K+", label: "Active Users", icon: Globe },
    { value: 99, suffix: "%", label: "Uptime", icon: Shield },
    { value: 20, suffix: "+", label: "Scripts Built", icon: Layers },
    { value: 5, suffix: "+", label: "Years Active", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden noise">
      <MouseGlow />
      <FloatingParticles />

      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
        style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)" }}
      />

      {/* Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-30 md:opacity-40">
          <source src="https://raw.githubusercontent.com/JD-YH03D/Releases-Published/main/public/image/Itachi/background-1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90" />
        <IsometricGrid />
        <div className="absolute inset-0 dot-grid opacity-20 md:opacity-30" />
        <div className="mesh-1 absolute -top-40 -left-40 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-blue-600/[0.06] blur-[80px] md:blur-[100px]" />
        <div className="mesh-2 absolute -bottom-20 -right-40 w-[250px] md:w-[500px] h-[250px] md:h-[500px] rounded-full bg-purple-600/[0.06] blur-[60px] md:blur-[80px]" />
        <div className="mesh-3 absolute top-1/3 right-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] rounded-full bg-cyan-500/[0.04] blur-[50px] md:blur-[70px]" />
      </div>

      {/* ═══ MODAL ═══ */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-950/85 backdrop-blur-md p-0 sm:p-4 md:p-6"
            onClick={handleModalClick}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.35, type: "spring", damping: 22 }}
              className="relative w-full sm:max-w-2xl glass-strong rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-slate-900/90 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-700/30 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Keyboard className="text-emerald-400" size={13} />
                  </div>
                  <h3 className="font-bold text-white text-xs sm:text-sm tracking-wide">Keyboard Controls</h3>
                </div>
                <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700/50 text-slate-500 hover:text-white transition-all" aria-label="Close">
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-5">
                {/* Mobile: Card layout */}
                <div className="sm:hidden space-y-2">
                  {keyboardControls.map((c, i) => (
                    <motion.div
                      key={c.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/20"
                    >
                      <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 text-[11px] font-bold text-emerald-400 bg-slate-800/80 border border-slate-600/50 rounded-md shadow-[0_2px_0_rgba(0,0,0,0.4)]">
                        {c.key}
                      </kbd>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-semibold ${c.isDiscord ? "text-[#5865F2]" : c.isPrimary ? "text-emerald-400" : "text-white"}`}>
                          {c.label}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{c.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Desktop: Table layout */}
                <div className="hidden sm:block overflow-hidden border border-slate-700/30 rounded-xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-800/40 text-slate-500 text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-semibold border-b border-slate-700/30 w-16">Key</th>
                        <th className="px-4 py-3 font-semibold border-b border-slate-700/30 w-32">Function</th>
                        <th className="px-4 py-3 font-semibold border-b border-slate-700/30">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/20 text-slate-300">
                      {keyboardControls.map((c, i) => (
                        <motion.tr key={c.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.025 }} className="hover:bg-slate-700/20 transition-colors">
                          <td className="px-4 py-2.5">
                            <kbd className="inline-flex items-center justify-center min-w-[26px] h-6 px-1.5 text-[10px] font-bold text-emerald-400 bg-slate-800/80 border border-slate-600/50 rounded-md shadow-[0_2px_0_rgba(0,0,0,0.4)]">{c.key}</kbd>
                          </td>
                          <td className={`px-4 py-2.5 text-xs font-medium ${c.isDiscord ? "text-[#5865F2]" : c.isPrimary ? "text-emerald-400" : "text-white"}`}>{c.label}</td>
                          <td className="px-4 py-2.5 text-slate-500 text-xs">{c.desc}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-900/40 border-t border-slate-700/30 flex justify-end flex-shrink-0">
                <button onClick={closeModal} className="px-5 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg text-xs font-bold transition-all border border-slate-600/30">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ HEADER ═══ */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isHeaderScrolled
            ? "bg-slate-950/70 backdrop-blur-2xl border-b border-slate-700/20 shadow-2xl shadow-slate-950/40"
            : "bg-transparent border-b border-transparent"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-14 sm:h-16 flex justify-between items-center">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center space-x-2.5 sm:space-x-3.5 group"
            onClick={(e) => { e.preventDefault(); scrollToSection("#"); }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/40 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900 shadow-lg">
                <img
                  src="https://raw.githubusercontent.com/JD-YH03D/Releases-Published/main/public/image/hero1.png"
                  alt="JD-YH03D"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.style.display = "none";
                    t.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700"><span class="text-[10px] sm:text-xs font-black text-white">JD</span></div>';
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white">JD-YH03D</span>
              <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em]">Scripts Hub</span>
            </div>
          </motion.a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 text-xs font-semibold">
            {[
              { href: "#directory", label: "Directory" },
              { href: "#documentation", label: "Docs" },
              { href: "https://github.com/JD-YH03D/Releases-Published/issues", label: "Issues", isExternal: true, isDanger: true },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                className={`px-3 lg:px-4 py-2 rounded-lg transition-all uppercase tracking-wider ${item.isDanger ? "text-slate-400 hover:text-red-400 hover:bg-red-500/5" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                onClick={(e) => { if (item.href.startsWith("#")) { e.preventDefault(); scrollToSection(item.href); } }}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://github.com/JD-YH03D/Releases-Published"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 lg:ml-2 flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-white text-xs font-semibold transition-all"
            >
              <GitHubIcon size={14} />
              <span>GitHub</span>
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors active:scale-95"
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-slate-700/20 bg-slate-950/95 backdrop-blur-2xl overflow-hidden"
            >
              <nav className="flex flex-col py-3 px-4 space-y-0.5">
                {[
                  { href: "#directory", label: "Directory", icon: FolderOpen, color: "text-blue-400" },
                  { href: "#documentation", label: "Documentation", icon: Book, color: "text-purple-400" },
                  { href: "https://github.com/JD-YH03D/Releases-Published/issues", label: "Issues", icon: GitHubIcon, color: "text-red-400" },
                  { href: "https://github.com/JD-YH03D/Releases-Published", label: "GitHub", icon: GitHubIcon, color: "text-slate-400" },
                ].map((item) => (
                  <a
                    key={item.href + item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center space-x-3 text-slate-400 hover:text-white active:bg-slate-800/50 hover:bg-slate-800/30 px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors"
                    onClick={(e) => { if (item.href.startsWith("#")) { e.preventDefault(); scrollToSection(item.href); } }}
                  >
                    <item.icon size={18} className={item.color} />
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ═══ MAIN ═══ */}
      <main className="relative z-10">

        {/* ── HERO ── */}
        <motion.section
          className="relative min-h-[100dvh] flex items-center overflow-hidden"
          style={{ y: heroParallax, opacity: heroOpacity }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <OrbitRings />
          </div>

          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-10 sm:gap-12 lg:gap-16 xl:gap-20 pt-20 sm:pt-24 pb-8 sm:pb-12">

              {/* Left — Text */}
              <motion.div
                className="flex-1 text-center lg:text-left w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center space-x-2 bg-blue-500/[0.08] border border-blue-500/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-6 sm:mb-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-blue-300 uppercase tracking-[0.12em] sm:tracking-[0.15em]">v2.0 — Production</span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  className="text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 tracking-tight"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.4 }}
                >
                  <span className="gradient-text">Web Automation</span>
                  <br />
                  <span className="gradient-text-blue">Script Engine</span>
                </motion.h1>

                <motion.p
                  className="text-slate-400 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  A centralized hub for <span className="text-white font-semibold">high-quality UserScripts</span>. Built for performance, stability, and seamless browser integration.
                </motion.p>

                {/* CTA */}
                <motion.div
                  className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.a
                    href="#directory"
                    onClick={(e) => { e.preventDefault(); scrollToSection("#directory"); }}
                    className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center cursor-pointer overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="relative z-10 flex items-center">
                      Explore Scripts
                      <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                  <motion.a
                    href="#documentation"
                    onClick={(e) => { e.preventDefault(); scrollToSection("#documentation"); }}
                    className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-slate-300 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm transition-all cursor-pointer text-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Documentation
                  </motion.a>
                </motion.div>

                {/* Stats */}
                <motion.div
                  className="mt-10 sm:mt-14 lg:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  {stats.map((s) => (
                    <div key={s.label} className="text-center lg:text-left p-2 sm:p-0">
                      <div className="flex items-center justify-center lg:justify-start space-x-1.5 sm:space-x-2 mb-0.5 sm:mb-1">
                        <s.icon size={11} className="text-blue-400/60" />
                        <span className="text-xl sm:text-2xl font-black text-white">
                          <StatCounter value={s.value} suffix={s.suffix} />
                        </span>
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{s.label}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right — 3D Hero Visual (desktop only) */}
              <motion.div
                ref={heroTilt.ref}
                onMouseMove={heroTilt.handleMouseMove}
                onMouseLeave={heroTilt.handleMouseLeave}
                className="flex-1 w-full max-w-md lg:max-w-lg hidden lg:block"
                aria-hidden="true"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{ perspective: "1200px" }}
              >
                <motion.div style={{ rotateX: heroTilt.springX, rotateY: heroTilt.springY, transformStyle: "preserve-3d" }} className="relative">
                  <div className="absolute -inset-8 bg-gradient-to-r from-blue-600/20 via-purple-600/15 to-cyan-500/20 rounded-3xl blur-2xl glow-pulse" />

                  <div className="relative glass-strong rounded-2xl p-5 xl:p-6 shadow-2xl shadow-slate-950/50">
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500/60" />
                      </div>
                      <span className="text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em]">engine_status</span>
                    </div>

                    <div className="space-y-2.5 font-mono text-[10px] xl:text-[11px]" style={{ transform: "translateZ(30px)" }}>
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-700 w-4 text-right select-none">01</span>
                        <span className="text-slate-500">{"// Initialize Script Engine"}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-700 w-4 text-right select-none">02</span>
                        <span><span className="text-purple-400">const</span> <span className="text-blue-300">engine</span> <span className="text-slate-500">=</span> <span className="text-emerald-400">new</span> <span className="text-yellow-300">ScriptEngine</span><span className="text-slate-500">()</span></span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-700 w-4 text-right select-none">03</span>
                        <span><span className="text-blue-300">engine</span><span className="text-slate-500">.</span><span className="text-yellow-300">configure</span><span className="text-slate-500">({"{"}</span></span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-700 w-4 text-right select-none">04</span>
                        <span className="ml-4"><span className="text-cyan-300">mode</span><span className="text-slate-500">:</span> <span className="text-emerald-400">&apos;production&apos;</span><span className="text-slate-500">,</span></span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-700 w-4 text-right select-none">05</span>
                        <span className="ml-4"><span className="text-cyan-300">optimize</span><span className="text-slate-500">:</span> <span className="text-orange-400">true</span></span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-700 w-4 text-right select-none">06</span>
                        <span className="text-slate-500">{"}"})</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-700 w-4 text-right select-none">07</span>
                        <span className="text-emerald-400 font-semibold cursor-blink">✓ Engine ready</span>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2" style={{ transform: "translateZ(50px)" }}>
                      <div className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Stable</span>
                      </div>
                      <div className="px-2.5 py-1.5 bg-slate-800/50 border border-slate-700/30 rounded-lg">
                        <span className="text-[9px] font-mono text-slate-500">v2.0.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-6 -right-6 w-16 h-16 animate-float"><HeroCube /></div>

                  <motion.div className="absolute -bottom-4 -left-4 xl:-left-6 glass rounded-xl px-3 py-2.5 shadow-xl animate-float-slow" style={{ transform: "translateZ(60px)" }}>
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center"><Download size={12} className="text-blue-400" /></div>
                      <div>
                        <div className="text-[9px] text-slate-500 font-medium">Downloads</div>
                        <div className="text-xs font-bold text-white">15.2K+</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="flex justify-center pb-6 sm:pb-8">
              <motion.button
                onClick={() => scrollToSection("#directory")}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center space-y-1.5 text-slate-600 hover:text-slate-400 transition-colors"
              >
                <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Scroll</span>
                <ChevronDown size={14} />
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* ── DIRECTORY ── */}
        <section id="directory" className="py-16 sm:py-20 md:py-28 lg:py-32 relative">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <motion.div
              className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 lg:mb-16 gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em] block mb-2 sm:mb-3">Repository</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  Active <span className="gradient-text-blue">Directory</span>
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1.5 sm:mt-2">Official script repository and production builds.</p>
              </div>

              <motion.div className="flex glass rounded-xl p-1 w-fit" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                {(["production", "legacy"] as const).map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-4 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all capitalize ${activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
                    whileTap={{ scale: 0.97 }}
                  >
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute inset-0 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/30" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab === "production" && (
                  <div className="space-y-6 sm:space-y-8">
                    {/* GeoGuessr */}
                    <motion.article className="glass rounded-xl sm:rounded-2xl overflow-hidden group card-lift hover:border-emerald-500/20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                      <div className="relative bg-gradient-to-r from-slate-900/80 to-slate-800/40 px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-700/20 overflow-hidden">
                        <div className="absolute inset-0 shimmer" />
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0">
                              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden border border-emerald-500/30 bg-slate-900 shadow-lg">
                                <img src="https://raw.githubusercontent.com/JD-YH03D/Releases-Published/main/public/image/geoguessr.jpg" alt="GeoGuessr" className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/56x56/0f172a/10b981?text=GG"; }} />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-white text-sm sm:text-lg tracking-tight truncate">GeoGuessr — Exploration Suite</h3>
                              <div className="flex items-center space-x-2 sm:space-x-3 mt-0.5 sm:mt-1">
                                <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono uppercase tracking-wider bg-slate-800/50 px-1.5 sm:px-2 py-0.5 rounded">v2.0.0</span>
                                <div className="flex items-center space-x-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span className="text-[8px] sm:text-[9px] text-emerald-400 font-semibold">Active</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <button onClick={openModal} className="text-[11px] sm:text-xs font-bold text-emerald-400 hover:bg-emerald-400/10 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all border border-emerald-400/20 hover:border-emerald-400/40 flex items-center space-x-1.5 sm:space-x-2">
                              <Book size={13} />
                              <span>Guide</span>
                            </button>
                            <span className="text-[8px] sm:text-[9px] font-mono text-slate-600 bg-slate-950/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-slate-700/30 hidden xs:inline-block">4 ASSETS</span>
                          </div>
                        </div>
                      </div>

                      {/* Table — Mobile cards / Desktop table */}
                      <div className="sm:hidden p-3 space-y-2">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/20 border border-slate-700/15">
                          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0"><GitBranch size={11} className="text-emerald-400" /></div>
                            <div className="min-w-0">
                              <div className="font-mono text-emerald-400 font-medium text-[11px] truncate">v2.0.0-release.js</div>
                              <div className="text-[9px] text-slate-500">Production Build</div>
                            </div>
                          </div>
                          <a href="https://greasyfork.org/id/scripts/578278-geoguessr-let-s-explore-the-world" target="_blank" rel="noopener noreferrer"
                            className="flex items-center space-x-1.5 text-[10px] font-black uppercase text-white bg-gradient-to-r from-emerald-600 to-emerald-700 px-3.5 py-2 rounded-lg tracking-wider flex-shrink-0 ml-3">
                            <Download size={11} /><span>Install</span>
                          </a>
                        </div>
                      </div>

                      <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="text-[9px] uppercase tracking-[0.15em] text-slate-500 bg-slate-950/30">
                            <tr>
                              <th className="px-4 md:px-6 py-3 md:py-4 font-bold border-b border-slate-700/20">Build Name</th>
                              <th className="px-4 md:px-6 py-3 md:py-4 font-bold border-b border-slate-700/20 hidden md:table-cell">Status</th>
                              <th className="px-4 md:px-6 py-3 md:py-4 font-bold border-b border-slate-700/20 text-right">Deploy</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-emerald-500/[0.03] transition-colors">
                              <td className="px-4 md:px-6 py-3 md:py-4">
                                <div className="flex items-center space-x-2 md:space-x-3">
                                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><GitBranch size={11} className="text-emerald-400" /></div>
                                  <span className="font-mono text-emerald-400 font-medium text-[11px] md:text-xs">v2.0.0-release.js</span>
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-xs hidden md:table-cell">
                                <div className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span>Production — Optimized</span></div>
                              </td>
                              <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                                <a href="https://greasyfork.org/id/scripts/578278-geoguessr-let-s-explore-the-world" target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1.5 text-[10px] font-black uppercase text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 px-4 py-2 md:py-2.5 rounded-lg transition-all tracking-[0.1em] shadow-lg shadow-emerald-600/20">
                                  <Download size={11} /><span>Install</span>
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </motion.article>

                    {/* Chess.com */}
                    <motion.article className="glass rounded-xl sm:rounded-2xl overflow-hidden group card-lift hover:border-[#769656]/20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                      <div className="relative bg-gradient-to-r from-slate-900/80 to-slate-800/40 px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-700/20 overflow-hidden">
                        <div className="absolute inset-0 shimmer" />
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0">
                              <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden border border-[#769656]/30 bg-slate-900 shadow-lg">
                                <img src="https://raw.githubusercontent.com/JD-YH03D/Releases-Published/main/public/image/chess.com.png" alt="Chess.com" className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/56x56/0f172a/769656?text=♛"; }} />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-white text-sm sm:text-lg tracking-tight truncate">Chess.com — Board Analysis</h3>
                              <div className="flex items-center space-x-2 sm:space-x-3 mt-0.5 sm:mt-1">
                                <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono uppercase tracking-wider bg-slate-800/50 px-1.5 sm:px-2 py-0.5 rounded">v1.2.0</span>
                                <div className="flex items-center space-x-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="text-[8px] sm:text-[9px] text-emerald-400 font-semibold">Active</span></div>
                              </div>
                            </div>
                          </div>
                          <span className="text-[8px] sm:text-[9px] font-mono text-slate-600 bg-slate-950/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-slate-700/30 w-fit">1 ASSET</span>
                        </div>
                      </div>

                      {/* Mobile */}
                      <div className="sm:hidden p-3 space-y-2">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/20 border border-slate-700/15">
                          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                            <div className="w-7 h-7 rounded-lg bg-[#769656]/10 flex items-center justify-center flex-shrink-0"><GitBranch size={11} className="text-[#8fa866]" /></div>
                            <div className="min-w-0">
                              <div className="font-mono text-[#8fa866] font-medium text-[11px] truncate">v1.2.0-release.js</div>
                              <div className="text-[9px] text-slate-500">Board Analysis</div>
                            </div>
                          </div>
                          <a href="https://greasyfork.org/id/scripts/579299-chess-com-play-chess-online-free-games/code" target="_blank" rel="noopener noreferrer"
                            className="flex items-center space-x-1.5 text-[10px] font-black uppercase text-white bg-gradient-to-r from-[#769656] to-[#6b8a4e] px-3.5 py-2 rounded-lg tracking-wider flex-shrink-0 ml-3">
                            <Download size={11} /><span>Install</span>
                          </a>
                        </div>
                      </div>

                      {/* Desktop */}
                      <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="text-[9px] uppercase tracking-[0.15em] text-slate-500 bg-slate-950/30">
                            <tr>
                              <th className="px-4 md:px-6 py-3 md:py-4 font-bold border-b border-slate-700/20">Build Name</th>
                              <th className="px-4 md:px-6 py-3 md:py-4 font-bold border-b border-slate-700/20 hidden md:table-cell">Details</th>
                              <th className="px-4 md:px-6 py-3 md:py-4 font-bold border-b border-slate-700/20 text-right">Deploy</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-[#769656]/[0.03] transition-colors">
                              <td className="px-4 md:px-6 py-3 md:py-4">
                                <div className="flex items-center space-x-2 md:space-x-3">
                                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#769656]/10 flex items-center justify-center"><GitBranch size={11} className="text-[#8fa866]" /></div>
                                  <span className="font-mono text-[#8fa866] font-medium text-[11px] md:text-xs">v1.2.0-release.js</span>
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-xs hidden md:table-cell">Board detection and real-time analysis.</td>
                              <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                                <a href="https://greasyfork.org/id/scripts/579299-chess-com-play-chess-online-free-games/code" target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1.5 text-[10px] font-black uppercase text-white bg-gradient-to-r from-[#769656] to-[#6b8a4e] hover:from-[#8fa866] hover:to-[#769656] px-4 py-2 md:py-2.5 rounded-lg transition-all tracking-[0.1em] shadow-lg shadow-[#769656]/20">
                                  <Download size={11} /><span>Install</span>
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </motion.article>

                    {/* Coming Soon */}
                    <motion.div className="border-2 border-dashed border-slate-800/40 p-8 sm:p-12 lg:p-16 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-center group hover:border-blue-500/20 transition-all duration-500 overflow-hidden relative"
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.02] to-purple-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <div className="h-12 w-12 sm:h-16 sm:w-16 glass rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 text-slate-600 group-hover:text-blue-400 transition-colors mx-auto">
                          <Sparkles size={20} className="sm:hidden" /><Sparkles size={24} className="hidden sm:block" />
                        </div>
                        <p className="text-slate-400 text-sm font-bold tracking-wide">More Projects Coming Soon</p>
                        <p className="text-slate-600 text-[11px] sm:text-xs mt-1.5 sm:mt-2 max-w-xs mx-auto">New scripts are under active development.</p>
                      </div>
                    </motion.div>
                  </div>
                )}

                {activeTab === "legacy" && (
                  <motion.div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="h-16 w-16 sm:h-20 sm:w-20 glass rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 text-slate-600">
                      <FolderOpen size={24} className="sm:hidden" /><FolderOpen size={28} className="hidden sm:block" />
                    </div>
                    <p className="text-slate-400 text-base sm:text-lg font-bold">Legacy Archive</p>
                    <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xs sm:max-w-sm px-4">Older script versions are not publicly available. Contact the developer for access.</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ── DOCUMENTATION ── */}
        <section id="documentation" className="py-16 sm:py-20 md:py-28 lg:py-32 relative">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <motion.div className="text-center mb-12 sm:mb-16 lg:mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em] block mb-2 sm:mb-3">Architecture</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Standardized <span className="gradient-text-blue">Architecture</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-3 sm:mt-4 max-w-xl mx-auto leading-relaxed px-2">
                All scripts conform to the <span className="text-blue-400 font-semibold">Standardized Script Schema (S3)</span>. Built for security, performance, and reliability.
              </p>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-12 sm:mb-16 lg:mb-20">
              {[
                { icon: ZoomIn, title: "ES6+ Standards", desc: "Modern syntax with runtime optimizations.", color: "text-blue-400", gradient: "from-blue-500/10 to-blue-600/5" },
                { icon: Info, title: "Namespace Validation", desc: "Mandatory UserScript headers.", color: "text-purple-400", gradient: "from-purple-500/10 to-purple-600/5" },
                { icon: Code, title: "Semantic Versioning", desc: "Strict SemVer specification.", color: "text-emerald-400", gradient: "from-emerald-500/10 to-emerald-600/5" },
                { icon: Settings, title: "Auto-Update Ready", desc: "Tampermonkey compatible.", color: "text-orange-400", gradient: "from-orange-500/10 to-orange-600/5" },
              ].map((item, i) => (
                <motion.div key={item.title} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 card-lift transition-all group"
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3 sm:mb-4 lg:mb-5 group-hover:scale-110 transition-transform`}>
                    <item.icon size={16} className={`${item.color} sm:hidden`} />
                    <item.icon size={18} className={`${item.color} hidden sm:block`} />
                  </div>
                  <h4 className="text-white font-bold text-[11px] sm:text-xs lg:text-sm mb-1 sm:mb-2">{item.title}</h4>
                  <p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Terminal + Side */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
              {/* Terminal */}
              <motion.div className="lg:col-span-3 glass rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-slate-950/50 card-lift"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3.5 bg-slate-900/60 border-b border-slate-700/20">
                  <div className="flex space-x-1.5 sm:space-x-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/40 border border-red-500/50" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/40 border border-yellow-500/50" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/40 border border-green-500/50" />
                  </div>
                  <div className="flex items-center text-[8px] sm:text-[9px] font-mono text-slate-600 font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    <Terminal size={10} className="mr-1.5 sm:mr-2" />
                    <span className="hidden xs:inline">development_</span>shell
                  </div>
                </div>
                <div className="p-3 sm:p-4 md:p-6 text-[10px] sm:text-[11px] font-mono leading-[1.7] sm:leading-[1.8] overflow-x-auto">
                  {[
                    { n: "1", c: <span className="text-slate-500"># Clone the repository</span> },
                    { n: "2", c: <span><span className="text-blue-400">git clone</span> <span className="text-emerald-400 break-all">&quot;https://github.com/JD-YH03D/Scripts&quot;</span></span> },
                    { n: "3", c: <span><span className="text-blue-400">cd</span> <span className="text-slate-300">Scripts/build</span></span>, mb: true },
                    { n: "4", c: <span className="text-slate-500"># Install & optimize</span> },
                    { n: "5", c: <span><span className="text-blue-400">npm</span> <span className="text-slate-300">install</span> <span className="text-slate-500">&&</span> <span className="text-blue-400">npm</span> <span className="text-slate-300">run optimize</span></span>, mb: true },
                    { n: "6", c: <span className="text-emerald-400 font-semibold">✓ Build success: <span className="text-slate-300 font-normal">2 pkgs optimized.</span></span> },
                    { n: "7", c: <span className="text-emerald-400 font-semibold">✓ Tests passed: <span className="text-slate-300 font-normal">48/48</span></span> },
                    { n: "8", c: <span className="text-blue-400">▸ <span className="text-slate-300">Ready</span> <span className="text-slate-600">—</span> <span className="text-yellow-400">production</span></span> },
                  ].map((line, i) => (
                    <motion.div key={i} className={`flex gap-2 sm:gap-3 md:gap-4 ${line.mb ? "mb-2 sm:mb-3" : ""}`}
                      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                      <span className="text-slate-700 select-none w-3 sm:w-4 text-right flex-shrink-0">{line.n}</span>
                      <div className="min-w-0">{line.c}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Side */}
              <motion.div className="lg:col-span-2 space-y-4 sm:space-y-6"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>

                {/* Bug Report */}
                <a href="https://github.com/JD-YH03D/Releases-Published/issues" target="_blank" rel="noopener noreferrer"
                  className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 card-lift hover:border-red-500/20 transition-all block group">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 transition-all flex-shrink-0">
                      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <span className="text-white font-bold text-sm block group-hover:text-red-300 transition-colors">Found a Bug?</span>
                      <span className="text-slate-500 text-[11px] sm:text-xs">Open an Issue on GitHub →</span>
                    </div>
                  </div>
                </a>

                {/* Quick Links */}
                <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <h4 className="text-white font-bold text-xs sm:text-sm mb-2 sm:mb-3">Quick Links</h4>
                  {[
                    { label: "Releases", desc: "Latest builds", href: "https://github.com/JD-YH03D/Releases-Published/releases", icon: Sparkles },
                    { label: "Repository", desc: "Source code", href: "https://github.com/JD-YH03D/Releases-Published", icon: GitHubIcon },
                    { label: "Greasyfork", desc: "Install hub", href: "https://greasyfork.org/id/scripts/578278-geoguessr-let-s-explore-the-world", icon: Globe },
                  ].map((link) => (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center space-x-2.5 sm:space-x-3 group/l p-2 sm:p-3 -mx-2 sm:-mx-3 rounded-xl hover:bg-slate-800/30 transition-colors">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-800/50 flex items-center justify-center flex-shrink-0 group-hover/l:bg-blue-500/10 transition-colors">
                        <link.icon size={13} className="text-slate-400 group-hover/l:text-blue-400 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] sm:text-xs font-bold text-slate-300 group-hover/l:text-white transition-colors">{link.label}</div>
                        <div className="text-[9px] sm:text-[10px] text-slate-600 truncate">{link.desc}</div>
                      </div>
                      <ExternalLink size={11} className="text-slate-700 group-hover/l:text-blue-400 transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>

                {/* Version */}
                <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div><span className="text-[8px] sm:text-[9px] text-slate-600 font-mono uppercase tracking-wider">Version</span><div className="text-white font-bold text-base sm:text-lg font-mono mt-0.5">v2.4.0</div></div>
                    <div className="text-right"><span className="text-[8px] sm:text-[9px] text-slate-600 font-mono uppercase tracking-wider">Build</span><div className="text-slate-400 font-mono text-[11px] sm:text-xs mt-0.5">REV2024</div></div>
                  </div>
                  <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }} />
                  </div>
                  <div className="flex justify-between mt-1.5 sm:mt-2">
                    <span className="text-[8px] sm:text-[9px] text-slate-600">Stability</span>
                    <span className="text-[8px] sm:text-[9px] text-emerald-400 font-bold">100%</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 border-t border-slate-800/30 bg-slate-950/80 backdrop-blur-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2.5 sm:space-x-3 mb-2 sm:mb-3">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Code size={14} className="text-white sm:hidden" /><Code size={16} className="text-white hidden sm:block" />
                </div>
                <span className="font-bold text-white text-base sm:text-lg tracking-tight">JD-YH03D</span>
              </div>
              <p className="text-slate-600 text-[10px] sm:text-xs font-medium">© {new Date().getFullYear()} JD-YH03D. MIT License.</p>
              <p className="text-slate-700 text-[9px] sm:text-[10px] mt-1 uppercase tracking-wider">Production-Grade Web Automation.</p>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-3 sm:gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <a href="#directory" onClick={(e) => { e.preventDefault(); scrollToSection("#directory"); }} className="text-slate-500 hover:text-white transition-colors text-[11px] sm:text-xs font-bold uppercase tracking-wider">Scripts</a>
                <a href="#documentation" onClick={(e) => { e.preventDefault(); scrollToSection("#documentation"); }} className="text-slate-500 hover:text-white transition-colors text-[11px] sm:text-xs font-bold uppercase tracking-wider">Docs</a>
                <a href="https://github.com/JD-YH03D/Releases-Published" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl glass text-slate-400 hover:text-white hover:border-slate-600 transition-all">
                  <GitHubIcon size={15} />
                </a>
              </div>
              <p className="text-slate-700 text-[8px] sm:text-[9px] font-mono tracking-[0.2em]">v2.4.0-REV2024</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => scrollToSection("#")}
            className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-600/80 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/25 flex items-center justify-center transition-colors backdrop-blur-sm border border-blue-400/20"
            aria-label="Scroll to top"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={16} className="sm:hidden" /><ArrowUp size={18} className="hidden sm:block" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
