import { useState, useEffect, useRef, useCallback, type SVGProps, type MouseEvent as ReactMouseEvent } from "react";
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

type ControlItem = {
  key: string;
  label: string;
  desc: string;
  isPrimary?: boolean;
  isDiscord?: boolean;
  isRange?: boolean;
  isAction?: boolean;
};

const GitHubIcon = (props: SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 18, className = "", ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
};

function use3DTilt(intensity = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!ref.current || window.innerWidth < 1024) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientY - centerY) / (rect.height / 2);
      const y = (e.clientX - centerX) / (rect.width / 2);
      rotateX.set(-x * intensity);
      rotateY.set(y * intensity);
    },
    [rotateX, rotateY, intensity],
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return { ref, springX, springY, handleMouseMove, handleMouseLeave };
}

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
    const handler = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [x, y, isMobile]);

  if (isMobile) return null;

  return (
    <motion.div className="pointer-events-none fixed inset-0 z-[1] hidden md:block">
      <motion.div
        className="absolute h-[400px] w-[400px] rounded-full pointer-events-none lg:h-[500px] lg:w-[500px]"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

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
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
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

function IsometricGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: "perspective(500px) rotateX(60deg) scale(2.5)",
          transformOrigin: "center top",
        }}
      />
    </div>
  );
}

function HeroCube() {
  const faces = [
    { color: "from-blue-500/20 to-blue-600/10", border: "border-blue-400/30", rot: "translateZ(40px)" },
    {
      color: "from-purple-500/20 to-purple-600/10",
      border: "border-purple-400/30",
      rot: "rotateY(180deg) translateZ(40px)",
    },
    { color: "from-cyan-500/20 to-cyan-600/10", border: "border-cyan-400/30", rot: "rotateY(-90deg) translateZ(40px)" },
    { color: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-400/30", rot: "rotateY(90deg) translateZ(40px)" },
    { color: "from-blue-400/20 to-blue-500/10", border: "border-blue-300/30", rot: "rotateX(90deg) translateZ(40px)" },
    {
      color: "from-violet-500/20 to-violet-600/10",
      border: "border-violet-400/30",
      rot: "rotateX(-90deg) translateZ(40px)",
    },
  ];
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ perspective: "800px" }}>
      <div className="cube-spin relative" style={{ width: 80, height: 80, transformStyle: "preserve-3d" }}>
        {faces.map((face, i) => (
          <div
            key={i}
            className={`absolute inset-0 rounded-lg border ${face.border} bg-gradient-to-br ${face.color} backdrop-blur-sm`}
            style={{ transform: face.rot }}
          />
        ))}
      </div>
    </div>
  );
}

function OrbitRings() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="absolute h-52 w-52 rounded-full border border-blue-500/10 md:h-72 md:w-72" style={{ transform: "rotateX(70deg)" }}>
        <div className="animate-orbit absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-2 w-2 rounded-full bg-blue-500/60 shadow-lg shadow-blue-500/30 md:h-3 md:w-3" />
        </div>
      </div>
      <div
        className="absolute h-36 w-36 rounded-full border border-purple-500/10 md:h-48 md:w-48"
        style={{ transform: "rotateX(70deg) rotateZ(60deg)" }}
      >
        <div className="animate-orbit-reverse absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-1.5 w-1.5 rounded-full bg-purple-400/60 md:h-2 md:w-2" />
        </div>
      </div>
      <div
        className="absolute h-24 w-24 rounded-full border border-cyan-500/10 md:h-32 md:w-32"
        style={{ transform: "rotateX(70deg) rotateZ(120deg)" }}
      >
        <div className="animate-orbit absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: "10s" }}>
          <div className="h-1 w-1 rounded-full bg-cyan-400/60 md:h-1.5 md:w-1.5" />
        </div>
      </div>
    </div>
  );
}

function StatCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
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
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalScript, setModalScript] = useState<"geoguessr" | "chess">("geoguessr");
  const [activeTab, setActiveTab] = useState<"production" | "legacy">("production");
  const [lang, setLang] = useState<"id" | "en">("id");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introProgress, setIntroProgress] = useState(0);
  const [isIntroReady, setIsIntroReady] = useState(false);
  const INTRO_DURATION_MS = 11000;
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
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
        document.body.style.overflow = "";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!showIntro) return;

    let animationFrame = 0;
    const start = performance.now();
    setIntroProgress(0);
    setIsIntroReady(false);

    const updateProgress = (now: number) => {
      const elapsed = now - start;
      const nextProgress = Math.min((elapsed / INTRO_DURATION_MS) * 100, 100);
      setIntroProgress(nextProgress);

      if (nextProgress >= 100) {
        setIsIntroReady(true);
        return;
      }

      animationFrame = window.requestAnimationFrame(updateProgress);
    };

    animationFrame = window.requestAnimationFrame(updateProgress);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [showIntro, INTRO_DURATION_MS]);

  useEffect(() => {
    if (!showIntro) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntro]);

  useEffect(() => {
    if (!showIntro || !isIntroReady) return;
    const autoEnter = window.setTimeout(() => {
      setShowIntro(false);
    }, 300);
    return () => window.clearTimeout(autoEnter);
  }, [showIntro, isIntroReady]);

  const closeIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  const openModal = (script: "geoguessr" | "chess") => {
    setModalScript(script);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
  };
  const handleModalClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) closeModal();
  };

  const scrollToSection = (id: string) => {
    if (id === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMobileMenuOpen(false);
      return;
    }
    const el = document.querySelector(id);
    if (el) {
      const hh = (document.querySelector("header") as HTMLElement | null)?.offsetHeight || 0;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - hh - 16, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const geoguessrControls: ControlItem[] = [
    { key: "Tab", label: lang === "id" ? "Panel Pengaturan" : "Settings Panel", desc: lang === "id" ? "Buka atau tutup panel pengaturan" : "Open or close the settings interface" },
    { key: "V", label: lang === "id" ? "Panel Info" : "Info Panel", desc: lang === "id" ? "Tampilkan atau sembunyikan informasi lokasi" : "Toggle the location info display" },
    { key: "M", label: lang === "id" ? "Penanda Manual" : "Manual Marker", desc: lang === "id" ? "Pasang penanda di peta game" : "Place a marker on the game map" },
    { key: "X", label: "Refresh", desc: lang === "id" ? "Reset state untuk ronde berikutnya" : "Reset state for the next round" },
    { key: "1", label: "Auto Place", desc: lang === "id" ? "Pasang marker tepat di posisi prediksi" : "Place marker at the exact predicted position", isPrimary: true },
    { key: "2", label: "Safe Place", desc: lang === "id" ? "Pasang marker dengan offset acak" : "Place marker with a randomized offset", isPrimary: true },
    { key: "S", label: lang === "id" ? "Perbesar Zoom" : "Zoom In", desc: lang === "id" ? "Menambah level zoom mini-map" : "Increase the mini-map zoom level" },
    { key: "A", label: lang === "id" ? "Perkecil Zoom" : "Zoom Out", desc: lang === "id" ? "Mengurangi level zoom mini-map" : "Decrease the mini-map zoom level" },
    { key: "C", label: lang === "id" ? "Salin Koordinat" : "Copy Coords", desc: lang === "id" ? "Salin koordinat saat ini ke clipboard" : "Copy current coordinates to clipboard" },
    { key: "G", label: "Google Maps", desc: lang === "id" ? "Buka lokasi saat ini di Google Maps" : "Open the current location in Google Maps" },
    { key: "D", label: "Discord", desc: lang === "id" ? "Kirim data lokasi ke webhook Discord" : "Send location data to Discord webhook", isDiscord: true },
  ];

  const chessControls: ControlItem[] = [
    { key: "Alt + Q-P", label: "Depth 1-10", desc: lang === "id" ? "Atur depth analisis engine dari 1 (Q) sampai 10 (P)" : "Set engine analysis depth from 1 (Q) to 10 (P)", isRange: true },
    { key: "Alt + A-L", label: "Depth 11-19", desc: lang === "id" ? "Atur depth analisis engine dari 11 (A) sampai 19 (L)" : "Set engine analysis depth from 11 (A) to 19 (L)", isRange: true },
    { key: "Alt + Z-M", label: "Depth 20-26", desc: lang === "id" ? "Atur depth analisis engine dari 20 (Z) sampai 26 (M)" : "Set engine analysis depth from 20 (Z) to 26 (M)", isRange: true },
    { key: "Esc", label: lang === "id" ? "Toggle Panel" : "Toggle Panel", desc: lang === "id" ? "Minimize atau maximize panel analisis" : "Minimize or maximize the analysis panel", isAction: true },
  ];

  const modalData = {
    geoguessr: {
      title: lang === "id" ? "GeoGuessr - Kontrol Keyboard" : "GeoGuessr - Keyboard Controls",
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      controls: geoguessrControls,
    },
    chess: {
      title: lang === "id" ? "Chess.com - Hotkeys" : "Chess.com - Hotkeys",
      iconColor: "text-[#8fa866]",
      iconBg: "bg-[#769656]/10",
      controls: chessControls,
    },
  };

  const stats = [
    { value: 15, suffix: "K+", label: lang === "id" ? "Pengguna Aktif" : "Active Users", icon: Globe },
    { value: 99, suffix: "%", label: "Uptime", icon: Shield },
    { value: 20, suffix: "+", label: lang === "id" ? "Script Dibuat" : "Scripts Built", icon: Layers },
    { value: 5, suffix: "+", label: lang === "id" ? "Tahun Aktif" : "Years Active", icon: Star },
  ];

  const installSteps = [
    {
      id: "01",
      icon: Download,
      title: lang === "id" ? "Instal Tampermonkey" : "Install Tampermonkey",
      desc: lang === "id" ? "Pasang extension browser sekali, lalu semua script bisa di-install dengan satu klik." : "Add the browser extension once, then every script can be installed with one click.",
      cta: lang === "id" ? "Buka Tampermonkey" : "Open Tampermonkey",
      href: "https://www.tampermonkey.net/",
    },
    {
      id: "02",
      icon: Code,
      title: lang === "id" ? "Pilih Build Script" : "Choose a Script Build",
      desc: lang === "id" ? "Pilih GeoGuessr atau Chess.com dari direktori aktif lalu klik Install." : "Pick GeoGuessr or Chess.com from the active directory and click Install.",
      cta: lang === "id" ? "Buka Direktori" : "Go to Directory",
      href: "#directory",
    },
    {
      id: "03",
      icon: Keyboard,
      title: lang === "id" ? "Atur Hotkeys dan Jalankan" : "Set Hotkeys and Run",
      desc: lang === "id" ? "Buka tombol Guide di tiap script card untuk mengatur hotkeys dengan benar." : "Open the Guide button in each script card to configure hotkeys correctly.",
      cta: lang === "id" ? "Buka Panduan" : "Read Guide",
      href: "#documentation",
    },
  ];

  const trustSignals = [
    { icon: Shield, label: lang === "id" ? "Baseline Keamanan" : "Security Baseline", value: lang === "id" ? "Validasi Header" : "Header Validation", note: lang === "id" ? "Namespace dan metadata diperiksa sebelum rilis." : "Namespace and metadata are checked before release." },
    { icon: Globe, label: lang === "id" ? "Dukungan Browser" : "Browser Support", value: "Chromium + Firefox", note: lang === "id" ? "Dibangun untuk browser desktop yang kompatibel dengan Tampermonkey." : "Built for Tampermonkey-compatible desktop browsers." },
    { icon: Star, label: lang === "id" ? "Disiplin Rilis" : "Release Discipline", value: "Semantic Versioning", note: lang === "id" ? "Setiap perubahan dirilis dengan versi yang jelas." : "Every change ships with explicit version tags." },
  ];

  const faqItems = [
    {
      q: lang === "id" ? "Apakah script ini aman dipakai?" : "Are these scripts safe to use?",
      a: lang === "id" ? "Ya, semua build production mengikuti format UserScript standar dengan metadata yang jelas dan rilis terverifikasi." : "Yes. Production builds follow a standard UserScript structure with clear metadata and verified releases.",
    },
    {
      q: lang === "id" ? "Bagaimana cara update script ke versi terbaru?" : "How do I update scripts to the latest version?",
      a: lang === "id" ? "Jika memakai Tampermonkey, update akan terdeteksi otomatis. Kamu juga bisa cek manual di halaman Releases atau GreasyFork." : "With Tampermonkey, updates are detected automatically. You can also check manually via Releases or GreasyFork.",
    },
    {
      q: lang === "id" ? "Kalau ada bug atau hotkey bentrok harus ke mana?" : "Where do I report bugs or hotkey conflicts?",
      a: lang === "id" ? "Gunakan tombol Issues di header atau bagian dokumentasi. Sertakan browser, versi script, dan langkah reproduksi agar cepat diproses." : "Use the Issues link in the header or documentation area. Include browser, script version, and reproduction steps for faster handling.",
    },
  ];
  const introSecond = Math.min(11, Math.floor((introProgress / 100) * 11));
  const introRemaining = Math.max(0, 11 - introSecond);
  const introPhase =
    introProgress < 24
      ? lang === "id"
        ? "Memuat inti sistem"
        : "Loading core modules"
      : introProgress < 58
        ? lang === "id"
          ? "Validasi dependensi"
          : "Validating dependencies"
        : introProgress < 88
          ? lang === "id"
            ? "Sinkronisasi aset"
            : "Syncing assets"
          : lang === "id"
            ? "Finalisasi startup"
            : "Finalizing startup";

  return (
    <div className="noise min-h-screen overflow-x-hidden bg-slate-950 text-slate-200">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="fixed inset-0 z-[130]"
            aria-label="Loading screen"
          >
            <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
              <source
                src="https://raw.githubusercontent.com/JD-YH03D/CDN/main/public/sasuke/sasuke-Landscape/background-6.mp4"
                type="video/mp4"
              />
            </video>

            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="text-xs font-mono tracking-[0.28em] text-white uppercase [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]"
              >
                Initializing Script Engine
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="mt-3 text-3xl leading-tight font-black tracking-tight text-white sm:text-4xl"
              >
                JD-YH03D / BintangToba
              </motion.h2>

              <p className="mt-2 text-xs font-mono tracking-[0.18em] text-white uppercase [text-shadow:0_2px_10px_rgba(0,0,0,0.75)]">
                WELLCOM
              </p>
              <p className="mt-2 text-[11px] font-medium text-white/95 [text-shadow:0_2px_10px_rgba(0,0,0,0.75)] sm:text-xs">
                {introPhase}
              </p>

              <AnimatePresence>
                {isIntroReady && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3 }}
                    onClick={closeIntro}
                    className="mt-7 rounded-xl border border-white/50 bg-black/35 px-6 py-3 text-sm font-bold text-white backdrop-blur-[2px] transition-colors hover:bg-black/50"
                  >
                    {lang === "id" ? "Masuk Website" : "Enter Website"}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-8 sm:px-10 sm:pb-10">
              <div className="mx-auto w-full max-w-6xl">
                <div className="relative h-3 w-full overflow-hidden rounded-full border border-white/25 bg-black/45 shadow-[0_0_24px_rgba(15,23,42,0.55)]">
                  <motion.div
                    className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ["-20%", "620%"] }}
                    transition={{ duration: 1.4, ease: "linear", repeat: Infinity }}
                  />
                  <motion.div
                    className="relative h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-300"
                    animate={{ width: `${introProgress}%` }}
                    transition={{ ease: "easeOut", duration: 0.18 }}
                  >
                    <div
                      className="absolute inset-0 opacity-35"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(120deg, rgba(255,255,255,0.85) 0px, rgba(255,255,255,0.85) 8px, transparent 8px, transparent 16px)",
                      }}
                    />
                  </motion.div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
                  <span>{lang === "id" ? "Loading aset" : "Loading assets"}</span>
                  <span>
                    {introSecond} / 11s
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-white/90 [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
                  <span>{Math.round(introProgress)}%</span>
                  <span>{lang === "id" ? `sisa ${introRemaining}s` : `${introRemaining}s left`}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showIntro && (
        <>
          <MouseGlow />
          <FloatingParticles />

      <motion.div
        className="fixed top-0 right-0 left-0 z-[60] h-[2px] origin-left"
        style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)" }}
      />

      <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-55 md:opacity-65">
           <source
        src="/Releases-Published/image/sasuke/sasuke-Landscape/background-5.mp4"
       type="video/mp4"
       />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/35 to-slate-950/55" />
        <IsometricGrid />
        <div className="dot-grid absolute inset-0 opacity-12 md:opacity-20" />
        <div className="mesh-1 absolute -top-40 -left-40 h-[300px] w-[300px] rounded-full bg-blue-600/[0.06] blur-[80px] md:h-[600px] md:w-[600px] md:blur-[100px]" />
        <div className="mesh-2 absolute -right-40 -bottom-20 h-[250px] w-[250px] rounded-full bg-purple-600/[0.06] blur-[60px] md:h-[500px] md:w-[500px] md:blur-[80px]" />
        <div className="mesh-3 absolute top-1/3 right-1/4 h-[200px] w-[200px] rounded-full bg-cyan-500/[0.04] blur-[50px] md:h-[400px] md:w-[400px] md:blur-[70px]" />
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/85 p-0 backdrop-blur-md sm:items-center sm:p-4 md:p-6"
            onClick={handleModalClick}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.35, type: "spring", damping: 22 }}
              className="glass-strong relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl shadow-2xl sm:max-h-[85vh] sm:max-w-2xl sm:rounded-2xl"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-slate-700/30 bg-slate-900/90 px-4 py-2.5 sm:px-6 sm:py-3">
                <div className="flex items-center space-x-2.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${modalData[modalScript].iconBg}`}>
                    <Keyboard className={modalData[modalScript].iconColor} size={13} />
                  </div>
                  <h3 className="text-xs font-bold tracking-wide text-white sm:text-sm">{modalData[modalScript].title}</h3>
                </div>
                <button
                  onClick={closeModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-700/50 hover:text-white"
                  aria-label={lang === "id" ? "Tutup" : "Close"}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2.5 sm:p-4">
                <div className="space-y-2 sm:hidden">
                  {modalData[modalScript].controls.map((c, i) => (
                    <motion.div
                      key={c.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="flex items-center space-x-3 rounded-xl border border-slate-700/20 bg-slate-800/30 p-3"
                    >
                      <kbd className={`inline-flex h-7 min-w-[28px] items-center justify-center rounded-md border border-slate-600/50 bg-slate-800/80 px-1.5 text-[11px] font-bold shadow-[0_2px_0_rgba(0,0,0,0.4)] ${c.isRange ? "text-[#8fa866]" : c.isAction ? "text-orange-400" : c.isDiscord ? "text-[#5865F2]" : c.isPrimary ? "text-emerald-400" : modalData[modalScript].iconColor}`}>
                        {c.key}
                      </kbd>
                      <div className="min-w-0 flex-1">
                        <div className={`text-xs font-semibold ${c.isRange ? "text-[#8fa866]" : c.isAction ? "text-orange-400" : c.isDiscord ? "text-[#5865F2]" : c.isPrimary ? "text-emerald-400" : "text-white"}`}>
                          {c.label}
                        </div>
                        <div className="truncate text-[10px] text-slate-500">{c.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="hidden overflow-hidden rounded-xl border border-slate-700/30 sm:block">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-slate-800/40 text-[10px] uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="w-28 border-b border-slate-700/30 px-4 py-3 font-semibold">{lang === "id" ? "Kombinasi" : "Combination"}</th>
                        <th className="w-32 border-b border-slate-700/30 px-4 py-3 font-semibold">{lang === "id" ? "Fungsi" : "Function"}</th>
                        <th className="border-b border-slate-700/30 px-4 py-3 font-semibold">{lang === "id" ? "Deskripsi" : "Description"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/20 text-slate-300">
                      {modalData[modalScript].controls.map((c, i) => (
                        <motion.tr
                          key={c.key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.025 }}
                          className="transition-colors hover:bg-slate-700/20"
                        >
                          <td className="px-4 py-2.5">
                            <kbd className={`inline-flex h-6 min-w-[26px] items-center justify-center rounded-md border border-slate-600/50 bg-slate-800/80 px-1.5 text-[10px] font-bold shadow-[0_2px_0_rgba(0,0,0,0.4)] ${c.isRange ? "text-[#8fa866]" : c.isAction ? "text-orange-400" : c.isDiscord ? "text-[#5865F2]" : c.isPrimary ? "text-emerald-400" : modalData[modalScript].iconColor}`}>
                              {c.key}
                            </kbd>
                          </td>
                          <td className={`px-4 py-2.5 text-xs font-medium ${c.isRange ? "text-[#8fa866]" : c.isAction ? "text-orange-400" : c.isDiscord ? "text-[#5865F2]" : c.isPrimary ? "text-emerald-400" : "text-white"}`}>
                            {c.label}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-slate-500">{c.desc}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex shrink-0 justify-end border-t border-slate-700/30 bg-slate-900/40 px-4 py-2 sm:px-6 sm:py-2.5">
                <button
                  onClick={closeModal}
                  className="rounded-lg border border-slate-600/30 bg-slate-700/50 px-5 py-2 text-xs font-bold text-white transition-all hover:bg-slate-600/50"
                >
                  {lang === "id" ? "Tutup" : "Close"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          isHeaderScrolled
            ? "border-b border-slate-700/20 bg-slate-950/70 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl"
            : "border-b border-transparent bg-transparent"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <motion.a
            href="#"
            className="group flex items-center space-x-2.5 sm:space-x-3.5"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#");
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-blue-500/40 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-slate-700/50 bg-slate-900 shadow-lg sm:h-10 sm:w-10 sm:rounded-xl">
                <img
                  src="https://raw.githubusercontent.com/JD-YH03D/Releases-Published/main/public/image/hero1.png"
                  alt="JD-YH03D"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.style.display = "none";
                    if (t.parentElement) {
                      t.parentElement.innerHTML =
                        '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700"><span class="text-[10px] sm:text-xs font-black text-white">JD</span></div>';
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight text-white sm:text-base">JD-YH03D</span>
              <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-slate-500 sm:text-[9px] sm:tracking-[0.2em]">
                Scripts Hub
              </span>
            </div>
          </motion.a>

          <nav className="hidden items-center space-x-1 text-xs font-semibold md:flex">
            {[
              { href: "#directory", label: lang === "id" ? "Direktori" : "Directory" },
              { href: "#install", label: lang === "id" ? "Instalasi" : "Install" },
              { href: "#trust", label: lang === "id" ? "Kepercayaan" : "Trust" },
              { href: "#documentation", label: "Docs" },
              {
                href: "https://github.com/JD-YH03D/Releases-Published/issues",
                label: lang === "id" ? "Isu" : "Issues",
                isExternal: true,
                isDanger: true,
              },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                className={`rounded-lg px-3 py-2 uppercase tracking-wider transition-all lg:px-4 ${item.isDanger ? "text-slate-400 hover:bg-red-500/5 hover:text-red-400" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                onClick={(e) => {
                  if (item.href.startsWith("#")) {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }
                }}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://github.com/JD-YH03D/Releases-Published"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 flex items-center space-x-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition-all hover:border-white/[0.15] hover:bg-white/[0.08] lg:ml-2 lg:px-4"
            >
              <GitHubIcon size={14} />
              <span>GitHub</span>
            </a>
            <div className="ml-2 flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
              <button
                className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition-colors ${lang === "id" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                onClick={() => setLang("id")}
                aria-label="Switch language to Indonesian"
              >
                ID
              </button>
              <button
                className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition-colors ${lang === "en" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                onClick={() => setLang("en")}
                aria-label="Switch language to English"
              >
                EN
              </button>
            </div>
          </nav>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors active:scale-95 hover:bg-slate-800/50 hover:text-white md:hidden"
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-slate-700/20 bg-slate-950/95 backdrop-blur-2xl md:hidden"
            >
              <nav className="flex flex-col space-y-0.5 px-4 py-3">
                <div className="mb-2 flex items-center justify-end gap-1">
                  <button
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition-colors ${lang === "id" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"}`}
                    onClick={() => setLang("id")}
                  >
                    ID
                  </button>
                  <button
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition-colors ${lang === "en" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"}`}
                    onClick={() => setLang("en")}
                  >
                    EN
                  </button>
                </div>
                {[
                  { href: "#directory", label: lang === "id" ? "Direktori" : "Directory", icon: FolderOpen, color: "text-blue-400" },
                  { href: "#install", label: lang === "id" ? "Instalasi" : "Install", icon: Download, color: "text-cyan-400" },
                  { href: "#trust", label: lang === "id" ? "Kepercayaan" : "Trust", icon: Shield, color: "text-emerald-400" },
                  { href: "#documentation", label: lang === "id" ? "Dokumentasi" : "Documentation", icon: Book, color: "text-purple-400" },
                  {
                    href: "https://github.com/JD-YH03D/Releases-Published/issues",
                    label: lang === "id" ? "Isu" : "Issues",
                    icon: GitHubIcon,
                    color: "text-red-400",
                  },
                  {
                    href: "https://github.com/JD-YH03D/Releases-Published",
                    label: "GitHub",
                    icon: GitHubIcon,
                    color: "text-slate-400",
                  },
                ].map((item) => (
                  <a
                    key={item.href + item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:bg-slate-800/30 hover:text-white active:bg-slate-800/50"
                    onClick={(e) => {
                      if (item.href.startsWith("#")) {
                        e.preventDefault();
                        scrollToSection(item.href);
                      }
                    }}
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

      <main className="relative z-10">
        <motion.section className="relative flex min-h-[100dvh] items-center overflow-hidden" style={{ y: heroParallax, opacity: heroOpacity }}>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <OrbitRings />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-6 pt-16 pb-6 sm:gap-8 sm:pt-20 sm:pb-8 lg:flex-row lg:gap-12 xl:gap-16">
              <motion.div
                className="w-full flex-1 text-center lg:text-left"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.div
                  className="mb-3 inline-flex items-center space-x-2 rounded-full border border-blue-500/20 bg-blue-500/[0.08] px-3 py-1.5 sm:mb-3 sm:px-4 sm:py-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-blue-300 sm:text-[10px] sm:tracking-[0.15em]">
                    v2.0 - Production
                  </span>
                </motion.div>

                <motion.h1
                  className="mb-2 text-[2.5rem] leading-[1.05] font-black tracking-tight sm:mb-2.5 sm:text-5xl md:text-6xl lg:text-7xl"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.4 }}
                >
                  <span className="text-white">JD-YH03D</span>
                  <br />
                  <span className="gradient-text-blue">Scripts Hub</span>
                </motion.h1>

                <motion.p
                  className="mx-auto mb-4 max-w-xl text-base leading-relaxed text-slate-400 sm:mb-5 sm:text-lg md:text-xl lg:mx-0"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {lang === "id"
                    ? "Production-grade UserScripts untuk GeoGuessr dan Chess.com, dengan rilis stabil, dokumentasi jelas, dan hotkeys yang siap dipakai."
                    : "Production-grade UserScripts for GeoGuessr and Chess.com, with stable releases, clear docs, and ready-to-use hotkeys."}
                </motion.p>

                <motion.div
                  className="flex flex-col justify-center gap-2.5 xs:flex-row sm:gap-3 lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.a
                    href="#directory"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("#directory");
                    }}
                    className="group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/30 sm:px-8 sm:py-4"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="relative z-10 flex items-center">
                      {lang === "id" ? "Jelajahi Script" : "Explore Scripts"}
                      <ChevronRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
                  </motion.a>
                  <motion.a
                    href="#install"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("#install");
                    }}
                    className="cursor-pointer rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3.5 text-center text-sm font-bold text-slate-300 transition-all hover:border-white/[0.15] hover:bg-white/[0.08] sm:px-8 sm:py-4"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {lang === "id" ? "Cara Instalasi" : "How to Install"}
                  </motion.a>
                </motion.div>

                <motion.div
                  className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-4 sm:gap-3 lg:mt-7"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  {stats.map((s) => (
                    <div key={s.label} className="p-1 text-center sm:p-0 lg:text-left">
                      <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 lg:justify-start">
                        <s.icon size={11} className="text-blue-400/60" />
                        <span className="text-xl leading-none font-black text-white sm:text-2xl">
                          <StatCounter value={s.value} suffix={s.suffix} />
                        </span>
                      </div>
                      <span className="text-[9px] leading-tight font-semibold tracking-wider text-slate-500 uppercase sm:text-[10px]">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                ref={heroTilt.ref}
                onMouseMove={heroTilt.handleMouseMove}
                onMouseLeave={heroTilt.handleMouseLeave}
                className="hidden w-full max-w-md flex-1 lg:block lg:max-w-lg"
                aria-hidden="true"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{ perspective: "1200px" }}
              >
                <motion.div style={{ rotateX: heroTilt.springX, rotateY: heroTilt.springY, transformStyle: "preserve-3d" }} className="relative">
                  <div className="glow-pulse absolute -inset-8 rounded-3xl bg-gradient-to-r from-blue-600/20 via-purple-600/15 to-cyan-500/20 blur-2xl" />

                  <div className="glass-strong relative rounded-2xl p-4 shadow-2xl shadow-slate-950/50 xl:p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex space-x-2">
                        <div className="h-3 w-3 rounded-full border border-red-500/60 bg-red-500/50" />
                        <div className="h-3 w-3 rounded-full border border-yellow-500/60 bg-yellow-500/50" />
                        <div className="h-3 w-3 rounded-full border border-green-500/60 bg-green-500/50" />
                      </div>
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-600">engine_status</span>
                    </div>

                    <div className="space-y-1.5 font-mono text-[10px] xl:text-[11px]" style={{ transform: "translateZ(30px)" }}>
                      <div className="flex items-center space-x-3">
                        <span className="w-4 select-none text-right text-slate-700">01</span>
                        <span className="text-slate-500">{"// Initialize Script Engine"}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="w-4 select-none text-right text-slate-700">02</span>
                        <span>
                          <span className="text-purple-400">const</span> <span className="text-blue-300">engine</span>{" "}
                          <span className="text-slate-500">=</span> <span className="text-emerald-400">new</span>{" "}
                          <span className="text-yellow-300">ScriptEngine</span>
                          <span className="text-slate-500">()</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="w-4 select-none text-right text-slate-700">03</span>
                        <span>
                          <span className="text-blue-300">engine</span>
                          <span className="text-slate-500">.</span>
                          <span className="text-yellow-300">configure</span>
                          <span className="text-slate-500">({"{"}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="w-4 select-none text-right text-slate-700">04</span>
                        <span className="ml-4">
                          <span className="text-cyan-300">mode</span>
                          <span className="text-slate-500">:</span> <span className="text-emerald-400">&apos;production&apos;</span>
                          <span className="text-slate-500">,</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="w-4 select-none text-right text-slate-700">05</span>
                        <span className="ml-4">
                          <span className="text-cyan-300">optimize</span>
                          <span className="text-slate-500">:</span> <span className="text-orange-400">true</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="w-4 select-none text-right text-slate-700">06</span>
                        <span className="text-slate-500">{"}"})</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="w-4 select-none text-right text-slate-700">07</span>
                        <span className="cursor-blink font-semibold text-emerald-400">Engine ready</span>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2" style={{ transform: "translateZ(50px)" }}>
                      <div className="flex items-center space-x-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-bold tracking-wider text-emerald-400 uppercase">Stable</span>
                      </div>
                      <div className="rounded-lg border border-slate-700/30 bg-slate-800/50 px-2.5 py-1.5">
                        <span className="text-[9px] font-mono text-slate-500">v2.0.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="animate-float absolute -top-6 -right-6 h-16 w-16">
                    <HeroCube />
                  </div>

                  <motion.div
                    className="glass animate-float-slow absolute -bottom-4 -left-4 rounded-xl px-3 py-2.5 shadow-xl xl:-left-6"
                    style={{ transform: "translateZ(60px)" }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15">
                        <Download size={12} className="text-blue-400" />
                      </div>
                      <div>
                        <div className="text-[9px] font-medium text-slate-500">Downloads</div>
                        <div className="text-xs font-bold text-white">15.2K+</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="flex justify-center pb-4 sm:pb-5">
              <motion.button
                onClick={() => scrollToSection("#directory")}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center space-y-1.5 text-slate-600 transition-colors hover:text-slate-400"
              >
                <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Scroll</span>
                <ChevronDown size={14} />
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        <section id="directory" className="relative py-8 sm:py-10 md:py-14 lg:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="mb-5 flex flex-col justify-between gap-2 sm:mb-6 sm:flex-row sm:items-end sm:gap-3 lg:mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <span className="mb-1 block text-[10px] font-mono tracking-[0.3em] text-blue-400 uppercase sm:mb-1.5">Repository</span>
                <h2 className="text-2xl leading-tight font-black tracking-tight text-white sm:text-3xl md:text-4xl">
                  {lang === "id" ? "Direktori" : "Active"} <span className="gradient-text-blue">{lang === "id" ? "Aktif" : "Directory"}</span>
                </h2>
                <p className="mt-0.5 text-xs leading-tight text-slate-500 sm:mt-1 sm:text-sm">
                  {lang === "id" ? "Repositori script resmi dan build production." : "Official script repository and production builds."}
                </p>
              </div>

              <motion.div className="glass flex w-fit rounded-xl p-1" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                {(["production", "legacy"] as const).map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative rounded-lg px-4 py-2 text-[11px] font-bold capitalize transition-all sm:px-6 sm:py-2.5 sm:text-xs ${activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
                    whileTap={{ scale: 0.97 }}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-lg bg-blue-600 shadow-lg shadow-blue-600/30"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4 }}>
                {activeTab === "production" && (
                  <div className="space-y-4 sm:space-y-5">
                    <motion.article
                      className="glass card-lift group overflow-hidden rounded-xl hover:border-emerald-500/20 sm:rounded-2xl"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <div className="relative overflow-hidden border-b border-slate-700/20 bg-gradient-to-r from-slate-900/80 to-slate-800/40 px-4 py-3 sm:px-6 sm:py-3.5">
                        <div className="shimmer absolute inset-0" />
                        <div className="relative z-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="relative h-10 w-10 shrink-0 sm:h-14 sm:w-14">
                              <div className="absolute inset-0 rounded-xl bg-emerald-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                              <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-emerald-500/30 bg-slate-900 shadow-lg sm:h-14 sm:w-14 sm:rounded-xl">
                                <img
                                  src="https://raw.githubusercontent.com/JD-YH03D/Releases-Published/main/public/image/geoguessr.jpg"
                                  alt="GeoGuessr"
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://placehold.co/56x56/0f172a/10b981?text=GG";
                                  }}
                                />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-bold tracking-tight text-white sm:text-lg">GeoGuessr - Exploration Suite</h3>
                              <div className="mt-0.5 flex items-center space-x-2 sm:mt-1 sm:space-x-3">
                                <span className="rounded bg-slate-800/50 px-1.5 py-0.5 text-[8px] font-mono tracking-wider text-slate-500 uppercase sm:px-2 sm:text-[9px]">
                                  v2.1.2
                                </span>
                                <div className="flex items-center space-x-1">
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  <span className="text-[8px] font-semibold text-emerald-400 sm:text-[9px]">{lang === "id" ? "Aktif" : "Active"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                              onClick={() => openModal("geoguessr")}
                              className="flex items-center space-x-1.5 rounded-lg border border-emerald-400/20 px-3 py-2 text-[11px] font-bold text-emerald-400 transition-all hover:border-emerald-400/40 hover:bg-emerald-400/10 sm:space-x-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-xs"
                            >
                              <Book size={13} />
                              <span>{lang === "id" ? "Panduan" : "Guide"}</span>
                            </button>
                            <span className="hidden rounded-lg border border-slate-700/30 bg-slate-950/50 px-2 py-1.5 text-[8px] font-mono text-slate-600 xs:inline-block sm:px-3 sm:py-2 sm:text-[9px]">
                              4 {lang === "id" ? "ASET" : "ASSETS"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 p-2.5 sm:hidden">
                        <div className="flex items-center justify-between rounded-xl border border-slate-700/15 bg-slate-800/20 p-2.5">
                          <div className="flex min-w-0 flex-1 items-center space-x-2.5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                              <GitBranch size={11} className="text-emerald-400" />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-mono text-[11px] font-medium text-emerald-400">v2.1.2-release.js</div>
                              <div className="text-[9px] text-slate-500">{lang === "id" ? "Build Produksi" : "Production Build"}</div>
                            </div>
                          </div>
                          <a
                            href="https://greasyfork.org/id/scripts/578278-geoguessr-let-s-explore-the-world"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 flex shrink-0 items-center space-x-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-3.5 py-2 text-[10px] font-black tracking-wider text-white uppercase"
                          >
                            <Download size={11} />
                            <span>{lang === "id" ? "Pasang" : "Install"}</span>
                          </a>
                        </div>
                      </div>

                      <div className="hidden overflow-x-auto sm:block">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-950/30 text-[9px] tracking-[0.15em] text-slate-500 uppercase">
                          </thead>
                          <tbody>
                            <tr className="transition-colors hover:bg-emerald-500/[0.03]">
                              <td className="px-4 py-2 md:px-6 md:py-2.5">
                                <div className="flex items-center space-x-2 md:space-x-3">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 md:h-8 md:w-8">
                                    <GitBranch size={11} className="text-emerald-400" />
                                  </div>
                                  <span className="font-mono text-[11px] font-medium text-emerald-400 md:text-xs">v2.1.2-release.js</span>
                                </div>
                              </td>
                              <td className="hidden px-4 py-3 text-xs text-slate-400 md:table-cell md:px-6 md:py-4">
                                <div className="flex items-center space-x-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  <span>{lang === "id" ? "Produksi - Optimal" : "Production - Optimized"}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right md:px-6 md:py-4">
                                <a
                                  href="https://greasyfork.org/id/scripts/578278-geoguessr-let-s-explore-the-world"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2 text-[10px] font-black tracking-[0.1em] text-white uppercase shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-emerald-600 md:py-2.5"
                                >
                                  <Download size={11} />
                                  <span>{lang === "id" ? "Pasang" : "Install"}</span>
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </motion.article>

                    <motion.article
                      className="glass card-lift group overflow-hidden rounded-xl hover:border-[#769656]/20 sm:rounded-2xl"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="relative overflow-hidden border-b border-slate-700/20 bg-gradient-to-r from-slate-900/80 to-slate-800/40 px-4 py-3 sm:px-6 sm:py-3.5">
                        <div className="shimmer absolute inset-0" />
                        <div className="relative z-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="relative h-10 w-10 shrink-0 sm:h-14 sm:w-14">
                              <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-[#769656]/30 bg-slate-900 shadow-lg sm:h-14 sm:w-14 sm:rounded-xl">
                                <img
                                  src="https://raw.githubusercontent.com/JD-YH03D/Releases-Published/main/public/image/chess.com.png"
                                  alt="Chess.com"
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://placehold.co/56x56/0f172a/769656?text=Q";
                                  }}
                                />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-bold tracking-tight text-white sm:text-lg">Chess.com - {lang === "id" ? "Analisis Papan" : "Board Analysis"}</h3>
                              <div className="mt-0.5 flex items-center space-x-2 sm:mt-1 sm:space-x-3">
                                <span className="rounded bg-slate-800/50 px-1.5 py-0.5 text-[8px] font-mono tracking-wider text-slate-500 uppercase sm:px-2 sm:text-[9px]">
                                  v1.2.0
                                </span>
                                <div className="flex items-center space-x-1">
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  <span className="text-[8px] font-semibold text-emerald-400 sm:text-[9px]">{lang === "id" ? "Aktif" : "Active"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                              onClick={() => openModal("chess")}
                              className="flex items-center space-x-1.5 rounded-lg border border-[#769656]/20 px-3 py-2 text-[11px] font-bold text-[#8fa866] transition-all hover:border-[#769656]/40 hover:bg-[#769656]/10 sm:space-x-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-xs"
                            >
                              <Book size={13} />
                              <span>{lang === "id" ? "Panduan" : "Guide"}</span>
                            </button>
                            <span className="hidden w-fit rounded-lg border border-slate-700/30 bg-slate-950/50 px-2 py-1.5 text-[8px] font-mono text-slate-600 xs:inline-block sm:px-3 sm:py-2 sm:text-[9px]">
                              1 {lang === "id" ? "ASET" : "ASSET"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 p-2.5 sm:hidden">
                        <div className="flex items-center justify-between rounded-xl border border-slate-700/15 bg-slate-800/20 p-2.5">
                          <div className="flex min-w-0 flex-1 items-center space-x-2.5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#769656]/10">
                              <GitBranch size={11} className="text-[#8fa866]" />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-mono text-[11px] font-medium text-[#8fa866]">v1.2.0-release.js</div>
                              <div className="text-[9px] text-slate-500">{lang === "id" ? "Analisis Papan" : "Board Analysis"}</div>
                            </div>
                          </div>
                          <a
                            href="https://greasyfork.org/id/scripts/579299-chess-com-play-chess-online-free-games/code"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 flex shrink-0 items-center space-x-1.5 rounded-lg bg-gradient-to-r from-[#769656] to-[#6b8a4e] px-3.5 py-2 text-[10px] font-black tracking-wider text-white uppercase"
                          >
                            <Download size={11} />
                            <span>{lang === "id" ? "Pasang" : "Install"}</span>
                          </a>
                        </div>
                      </div>

                      <div className="hidden overflow-x-auto sm:block">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-950/30 text-[9px] tracking-[0.15em] text-slate-500 uppercase">
                          </thead>
                          <tbody>
                            <tr className="transition-colors hover:bg-[#769656]/[0.03]">
                              <td className="px-4 py-2 md:px-6 md:py-2.5">
                                <div className="flex items-center space-x-2 md:space-x-3">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#769656]/10 md:h-8 md:w-8">
                                    <GitBranch size={11} className="text-[#8fa866]" />
                                  </div>
                                  <span className="font-mono text-[11px] font-medium text-[#8fa866] md:text-xs">v1.2.0-release.js</span>
                                </div>
                              </td>
                              <td className="hidden px-4 py-3 text-xs text-slate-400 md:table-cell md:px-6 md:py-4">
                                {lang === "id" ? "Deteksi papan dan analisis real-time." : "Board detection and real-time analysis."}
                              </td>
                              <td className="px-4 py-3 text-right md:px-6 md:py-4">
                                <a
                                  href="https://greasyfork.org/id/scripts/579299-chess-com-play-chess-online-free-games/code"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-[#769656] to-[#6b8a4e] px-4 py-2 text-[10px] font-black tracking-[0.1em] text-white uppercase shadow-lg shadow-[#769656]/20 transition-all hover:from-[#8fa866] hover:to-[#769656] md:py-2.5"
                                >
                                  <Download size={11} />
                                  <span>{lang === "id" ? "Pasang" : "Install"}</span>
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </motion.article>

                    <motion.div
                      className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-800/40 p-6 text-center transition-all duration-500 hover:border-blue-500/20 sm:rounded-2xl sm:p-8 lg:p-10"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.02] to-purple-500/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative z-10">
                        <div className="glass mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors group-hover:text-blue-400 sm:mb-3 sm:h-12 sm:w-12 sm:rounded-2xl">
                          <Sparkles size={20} className="sm:hidden" />
                          <Sparkles size={24} className="hidden sm:block" />
                        </div>
                        <p className="text-sm leading-tight font-bold tracking-wide text-slate-400">{lang === "id" ? "Project Lain Segera Hadir" : "More Projects Coming Soon"}</p>
                        <p className="mx-auto mt-0.5 max-w-xs text-[11px] leading-tight text-slate-600 sm:mt-1 sm:text-xs">
                          {lang === "id" ? "Script baru sedang dikembangkan secara aktif." : "New scripts are under active development."}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                )}

                {activeTab === "legacy" && (
                  <motion.div className="flex flex-col items-center justify-center py-10 text-center sm:py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="glass mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-slate-600 sm:mb-4 sm:h-16 sm:w-16 sm:rounded-2xl">
                      <FolderOpen size={24} className="sm:hidden" />
                      <FolderOpen size={28} className="hidden sm:block" />
                    </div>
                    <p className="text-base leading-tight font-bold text-slate-400 sm:text-lg">{lang === "id" ? "Arsip Versi Lama" : "Legacy Archive"}</p>
                    <p className="mt-1 max-w-xs px-4 text-xs leading-tight text-slate-600 sm:max-w-sm sm:text-sm">
                      {lang === "id" ? "Versi script lama tidak tersedia publik. Hubungi developer untuk akses." : "Older script versions are not publicly available. Contact the developer for access."}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section id="install" className="relative py-8 sm:py-10 md:py-14 lg:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div className="mb-6 text-center sm:mb-7 lg:mb-8" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-1.5 block text-[10px] font-mono tracking-[0.3em] text-cyan-400 uppercase">Onboarding</span>
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">{lang === "id" ? "Cara Instalasi" : "How To Install"}</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">{lang === "id" ? "Tiga langkah cepat supaya script langsung aktif dengan konfigurasi yang benar." : "Three quick steps to activate scripts with the right setup."}</p>
            </motion.div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
              {installSteps.map((step, i) => (
                <motion.article key={step.id} className="glass card-lift rounded-xl p-4 sm:rounded-2xl sm:p-5" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                      <step.icon size={16} className="text-blue-300" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-600">STEP {step.id}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white sm:text-base">{step.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-sm">{step.desc}</p>
                  <a
                    href={step.href}
                    onClick={(e) => {
                      if (step.href.startsWith("#")) {
                        e.preventDefault();
                        scrollToSection(step.href);
                      }
                    }}
                    target={step.href.startsWith("http") ? "_blank" : undefined}
                    rel={step.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="mt-4 inline-flex items-center text-[11px] font-semibold text-blue-300 transition-colors hover:text-white"
                  >
                    {step.cta}
                    <ChevronRight size={13} className="ml-1" />
                  </a>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="trust" className="relative py-8 sm:py-10 md:py-14 lg:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div className="mb-6 text-center sm:mb-7" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-1.5 block text-[10px] font-mono tracking-[0.3em] text-emerald-400 uppercase">{lang === "id" ? "Reliabilitas" : "Reliability"}</span>
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">{lang === "id" ? "Sinyal Kepercayaan" : "Trust Signals"}</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">{lang === "id" ? "Transparansi teknis yang membantu user percaya sebelum install." : "Technical transparency that builds trust before install."}</p>
            </motion.div>

            <motion.div className="glass overflow-hidden rounded-xl sm:rounded-2xl" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {trustSignals.map((signal, i) => (
                <div key={signal.label} className={`flex items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5 ${i !== trustSignals.length - 1 ? "border-b border-slate-700/20" : ""}`}>
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 sm:h-10 sm:w-10">
                      <signal.icon size={15} className="text-emerald-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{signal.label}</p>
                      <p className="text-[11px] text-slate-500 sm:text-xs">{signal.note}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono tracking-wider text-emerald-300 uppercase sm:text-xs">{signal.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="documentation" className="relative py-8 sm:py-10 md:py-14 lg:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div className="mb-6 text-center sm:mb-7 lg:mb-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-1 block text-[10px] font-mono tracking-[0.3em] text-blue-400 uppercase sm:mb-1.5">{lang === "id" ? "Arsitektur" : "Architecture"}</span>
              <h2 className="text-2xl leading-tight font-black tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                {lang === "id" ? "Arsitektur" : "Standardized"} <span className="gradient-text-blue">{lang === "id" ? "Terstandar" : "Architecture"}</span>
              </h2>
              <p className="mx-auto mt-1.5 max-w-xl px-2 text-sm leading-relaxed text-slate-400 sm:mt-2 sm:text-base">
                {lang === "id"
                  ? <><span>Semua script mengikuti </span><span className="font-semibold text-blue-400">Standardized Script Schema (S3)</span><span>. Dibangun untuk keamanan, performa, dan reliabilitas.</span></>
                  : <><span>All scripts conform to the </span><span className="font-semibold text-blue-400">Standardized Script Schema (S3)</span><span>. Built for security, performance, and reliability.</span></>}
              </p>
            </motion.div>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-7 sm:gap-4 lg:mb-8 lg:grid-cols-4 lg:gap-5">
              {[
                {
                  icon: ZoomIn,
                  title: "ES6+ Standards",
                  desc: "Modern syntax with runtime optimizations.",
                  color: "text-blue-400",
                  gradient: "from-blue-500/10 to-blue-600/5",
                },
                {
                  icon: Info,
                  title: "Namespace Validation",
                  desc: "Mandatory UserScript headers.",
                  color: "text-purple-400",
                  gradient: "from-purple-500/10 to-purple-600/5",
                },
                {
                  icon: Code,
                  title: "Semantic Versioning",
                  desc: "Strict SemVer specification.",
                  color: "text-emerald-400",
                  gradient: "from-emerald-500/10 to-emerald-600/5",
                },
                {
                  icon: Settings,
                  title: "Auto-Update Ready",
                  desc: "Tampermonkey compatible.",
                  color: "text-orange-400",
                  gradient: "from-orange-500/10 to-orange-600/5",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="glass card-lift group rounded-xl p-3 transition-all sm:rounded-2xl sm:p-4 lg:p-5"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div
                    className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient} transition-transform group-hover:scale-110 sm:mb-2.5 sm:h-10 sm:w-10 sm:rounded-xl lg:mb-3 lg:h-11 lg:w-11`}
                  >
                    <item.icon size={16} className={`${item.color} sm:hidden`} />
                    <item.icon size={18} className={`${item.color} hidden sm:block`} />
                  </div>
                  <h4 className="mb-0.5 text-[11px] font-bold text-white sm:mb-1 sm:text-xs lg:text-sm">{item.title}</h4>
                  <p className="text-[10px] leading-relaxed text-slate-500 sm:text-xs">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-5">
              <motion.div
                className="glass card-lift overflow-hidden rounded-xl shadow-2xl shadow-slate-950/50 sm:rounded-2xl lg:col-span-3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between border-b border-slate-700/20 bg-slate-900/60 px-3 py-2.5 sm:px-5 sm:py-3.5">
                  <div className="flex space-x-1.5 sm:space-x-2">
                    <div className="h-2.5 w-2.5 rounded-full border border-red-500/50 bg-red-500/40 sm:h-3 sm:w-3" />
                    <div className="h-2.5 w-2.5 rounded-full border border-yellow-500/50 bg-yellow-500/40 sm:h-3 sm:w-3" />
                    <div className="h-2.5 w-2.5 rounded-full border border-green-500/50 bg-green-500/40 sm:h-3 sm:w-3" />
                  </div>
                  <div className="flex items-center text-[8px] font-mono tracking-[0.15em] text-slate-600 uppercase sm:text-[9px] sm:tracking-[0.2em]">
                    <Terminal size={10} className="mr-1.5 sm:mr-2" />
                    <span className="hidden xs:inline">development_</span>shell
                  </div>
                </div>
                <div className="overflow-x-auto p-3 font-mono text-[10px] leading-[1.7] sm:p-4 sm:text-[11px] sm:leading-[1.8] md:p-6">
                  {[
                    { n: "1", c: <span className="text-slate-500"># Clone the repository</span> },
                    {
                      n: "2",
                      c: (
                        <span>
                          <span className="text-blue-400">git clone</span>{" "}
                          <span className="break-all text-emerald-400">&quot;https://github.com/JD-YH03D/Scripts&quot;</span>
                        </span>
                      ),
                    },
                    {
                      n: "3",
                      c: (
                        <span>
                          <span className="text-blue-400">cd</span> <span className="text-slate-300">Scripts/build</span>
                        </span>
                      ),
                      mb: true,
                    },
                    { n: "4", c: <span className="text-slate-500"># {lang === "id" ? "Install & optimasi" : "Install & optimize"}</span> },
                    {
                      n: "5",
                      c: (
                        <span>
                          <span className="text-blue-400">npm</span> <span className="text-slate-300">install</span>{" "}
                          <span className="text-slate-500">&&</span> <span className="text-blue-400">npm</span>{" "}
                          <span className="text-slate-300">run optimize</span>
                        </span>
                      ),
                      mb: true,
                    },
                    {
                      n: "6",
                      c: (
                        <span className="font-semibold text-emerald-400">
                          {lang === "id" ? "Build sukses" : "Build success"}: <span className="font-normal text-slate-300">2 {lang === "id" ? "paket dioptimasi" : "pkgs optimized."}</span>
                        </span>
                      ),
                    },
                    {
                      n: "7",
                      c: (
                        <span className="font-semibold text-emerald-400">
                          {lang === "id" ? "Tes lulus" : "Tests passed"}: <span className="font-normal text-slate-300">48/48</span>
                        </span>
                      ),
                    },
                    {
                      n: "8",
                      c: (
                        <span className="text-blue-400">
                          <span className="text-slate-300">{lang === "id" ? "Siap" : "Ready"}</span> <span className="text-slate-600">-</span>{" "}
                          <span className="text-yellow-400">production</span>
                        </span>
                      ),
                    },
                  ].map((line, i) => (
                    <motion.div
                      key={i}
                      className={`flex gap-2 sm:gap-3 md:gap-4 ${line.mb ? "mb-2 sm:mb-3" : ""}`}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <span className="w-3 shrink-0 select-none text-right text-slate-700 sm:w-4">{line.n}</span>
                      <div className="min-w-0">{line.c}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="space-y-2 sm:space-y-3 lg:col-span-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
              >
                <a
                  href="https://github.com/JD-YH03D/Releases-Published/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass card-lift group block rounded-xl p-3 transition-all hover:border-red-500/20 sm:rounded-2xl sm:p-4"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 transition-all group-hover:bg-red-500/20 sm:h-12 sm:w-12 sm:rounded-xl">
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-400"
                      >
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-bold text-white transition-colors group-hover:text-red-300">{lang === "id" ? "Menemukan Bug?" : "Found a Bug?"}</span>
                      <span className="text-[11px] text-slate-500 sm:text-xs">{lang === "id" ? "Buka Issue di GitHub" : "Open an Issue on GitHub"}</span>
                    </div>
                  </div>
                </a>

                <div className="glass space-y-2 rounded-xl p-3 sm:space-y-3 sm:rounded-2xl sm:p-4">
                  <h4 className="mb-2 text-xs font-bold text-white sm:mb-3 sm:text-sm">{lang === "id" ? "Tautan Cepat" : "Quick Links"}</h4>
                  {[
                    {
                      label: "Releases",
                      desc: lang === "id" ? "Build terbaru" : "Latest builds",
                      href: "https://github.com/JD-YH03D/Releases-Published/releases",
                      icon: Sparkles,
                    },
                    {
                      label: "Repository",
                      desc: "Source code",
                      href: "https://github.com/JD-YH03D/Releases-Published",
                      icon: GitHubIcon,
                    },
                    {
                      label: "Greasyfork",
                      desc: lang === "id" ? "Pusat instalasi" : "Install hub",
                      href: "https://greasyfork.org/id/scripts/578278-geoguessr-let-s-explore-the-world",
                      icon: Globe,
                    },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/l -mx-1.5 flex items-center space-x-2.5 rounded-xl p-1.5 transition-colors hover:bg-slate-800/30 sm:-mx-2 sm:space-x-3 sm:p-2"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/50 transition-colors group-hover/l:bg-blue-500/10 sm:h-9 sm:w-9">
                        <link.icon size={13} className="text-slate-400 transition-colors group-hover/l:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-slate-300 transition-colors group-hover/l:text-white sm:text-xs">{link.label}</div>
                        <div className="truncate text-[9px] text-slate-600 sm:text-[10px]">{link.desc}</div>
                      </div>
                      <ExternalLink size={11} className="shrink-0 text-slate-700 transition-colors group-hover/l:text-blue-400" />
                    </a>
                  ))}
                </div>

                <div className="glass rounded-xl p-3 sm:rounded-2xl sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[8px] font-mono tracking-wider text-slate-600 uppercase sm:text-[9px]">{lang === "id" ? "Versi" : "Version"}</span>
                      <div className="mt-0.5 font-mono text-base font-bold text-white sm:text-lg">v2.4.0</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-mono tracking-wider text-slate-600 uppercase sm:text-[9px]">Build</span>
                      <div className="mt-0.5 font-mono text-[11px] text-slate-400 sm:text-xs">REV2024</div>
                    </div>
                  </div>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between sm:mt-2">
                    <span className="text-[8px] text-slate-600 sm:text-[9px]">{lang === "id" ? "Stabilitas" : "Stability"}</span>
                    <span className="text-[8px] font-bold text-emerald-400 sm:text-[9px]">100%</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="faq" className="relative py-8 sm:py-10 md:py-14 lg:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div className="mb-6 text-center sm:mb-7" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-1.5 block text-[10px] font-mono tracking-[0.3em] text-blue-400 uppercase">{lang === "id" ? "Bantuan" : "Support"}</span>
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">FAQ</h2>
              <p className="mt-2 text-sm text-slate-400 sm:text-base">{lang === "id" ? "Jawaban cepat untuk pertanyaan paling sering dari user baru." : "Quick answers to common questions from new users."}</p>
            </motion.div>

            <div className="glass overflow-hidden rounded-xl sm:rounded-2xl">
              {faqItems.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={item.q} className={index !== faqItems.length - 1 ? "border-b border-slate-700/20" : ""}>
                    <button
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-white/[0.02] sm:px-6 sm:py-5"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    >
                      <span className="text-sm font-semibold text-white sm:text-base">{item.q}</span>
                      <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 text-sm leading-relaxed text-slate-400 sm:px-6 sm:pb-5">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-800/30 bg-slate-950/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-5">
            <div className="text-center sm:text-left">
              <div className="mb-2 flex items-center justify-center space-x-2.5 sm:mb-3 sm:justify-start sm:space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/20 sm:h-9 sm:w-9 sm:rounded-xl">
                  <Code size={14} className="text-white sm:hidden" />
                  <Code size={16} className="hidden text-white sm:block" />
                </div>
                <span className="text-base font-bold tracking-tight text-white sm:text-lg">JD-YH03D</span>
              </div>
              <p className="text-[10px] font-medium text-slate-600 sm:text-xs">&copy; {new Date().getFullYear()} JD-YH03D. MIT License.</p>
              <p className="mt-1 text-[9px] tracking-wider text-slate-700 uppercase sm:text-[10px]">Production-Grade Web Automation.</p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:items-end sm:gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <a
                  href="#directory"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#directory");
                  }}
                  className="text-[11px] font-bold tracking-wider text-slate-500 uppercase transition-colors hover:text-white sm:text-xs"
                >
                  {lang === "id" ? "Script" : "Scripts"}
                </a>
                <a
                  href="#install"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#install");
                  }}
                  className="text-[11px] font-bold tracking-wider text-slate-500 uppercase transition-colors hover:text-white sm:text-xs"
                >
                  {lang === "id" ? "Instalasi" : "Install"}
                </a>
                <a
                  href="#faq"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#faq");
                  }}
                  className="text-[11px] font-bold tracking-wider text-slate-500 uppercase transition-colors hover:text-white sm:text-xs"
                >
                  FAQ
                </a>
                <a
                  href="#documentation"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#documentation");
                  }}
                  className="text-[11px] font-bold tracking-wider text-slate-500 uppercase transition-colors hover:text-white sm:text-xs"
                >
                  {lang === "id" ? "Dokumentasi" : "Docs"}
                </a>
                <a
                  href="https://github.com/JD-YH03D/Releases-Published"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="glass flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:border-slate-600 hover:text-white sm:h-10 sm:w-10 sm:rounded-xl"
                >
                  <GitHubIcon size={15} />
                </a>
              </div>
              <p className="text-[8px] font-mono tracking-[0.2em] text-slate-700 sm:text-[9px]">v2.4.0-REV2024</p>
            </div>
          </div>
        </div>
      </footer>

          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                onClick={() => scrollToSection("#")}
                className="fixed right-4 bottom-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-600/80 text-white shadow-xl shadow-blue-600/25 backdrop-blur-sm transition-colors hover:bg-blue-500 sm:right-8 sm:bottom-8 sm:h-12 sm:w-12 sm:rounded-xl"
                aria-label="Scroll to top"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowUp size={16} className="sm:hidden" />
                <ArrowUp size={18} className="hidden sm:block" />
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
