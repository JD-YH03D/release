// ============================================================
// IMPORTS
// ============================================================
import React from "react";
import { useState, useEffect, useRef, useCallback, memo, SVGProps } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

// ============================================================
// CONSTANTS
// ============================================================
const LAYOUT = {
  HEADER_SCROLL_THRESHOLD: 20,
  MOBILE_BREAKPOINT: 768,
} as const;

const VIDEO_SOURCES = {
  // Path lokal — file ada di public/image/sasuke/sasuke-Landscape/background-1.mp4
  // Saat di-serve oleh dev server / build, public/ menjadi root, jadi path-nya:
  primary: "/image/sasuke/sasuke-Landscape/background-1.mp4",
  poster: "/image/sasuke/sasuke-Landscape/background-1-poster.jpg", // opsional poster
} as const;

// ============================================================
// TYPES
// ============================================================
interface KeyboardControl {
  key: string;
  label: string;
  desc: string;
  isPrimary?: boolean;
  isDiscord?: boolean;
}

interface NavItemMobile {
  href: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  external?: boolean;
}

interface ScriptAsset {
  version: string;
  desc: string;
  url: string;
}

interface ScriptCard {
  id: string;
  name: string;
  version: string;
  assetCount: number;
  image: string;
  fallbackText: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  accentHover: string;
  accentInstall: string;
  accentInstallHover: string;
  accentInstallActive: string;
  hoverRowBg: string;
  assets: ScriptAsset[];
  hasGuide?: boolean;
}

interface DocFeature {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

type ActiveTab = "production" | "legacy";

// ============================================================
// DATA
// ============================================================
const KEYBOARD_CONTROLS: KeyboardControl[] = [
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
  { key: "D", label: "Discord", desc: "Send the location data to a Discord webhook", isDiscord: true },
];

const SCRIPT_CARDS: ScriptCard[] = [
  {
    id: "geoguessr",
    name: "GeoGuessr — Exploration Suite",
    version: "v1.8.0-stable",
    assetCount: 4,
    image: "https://raw.githubusercontent.com/JD-YH03D/Releases-Published/main/public/image/geoguessr.jpg",
    fallbackText: "GG",
    accentColor: "text-emerald-400",
    accentBg: "bg-emerald-500/20",
    accentBorder: "border-emerald-500/30",
    accentHover: "hover:border-emerald-500/30",
    accentInstall: "bg-emerald-600",
    accentInstallHover: "hover:bg-emerald-500",
    accentInstallActive: "active:bg-emerald-700",
    hoverRowBg: "hover:bg-emerald-500/[0.04]",
    hasGuide: true,
    assets: [
      {
        version: "v2.0.0-release.js",
        desc: "",
        url: "https://greasyfork.org/id/scripts/578278-geoguessr-let-s-explore-the-world",
      },
    ],
  },
  {
    id: "chess",
    name: "Chess.com — Board Analysis",
    version: "v1.0.0-stable",
    assetCount: 1,
    image: "https://raw.githubusercontent.com/JD-YH03D/Releases-Published/main/public/image/chess.com.png",
    fallbackText: "Chess",
    accentColor: "text-[#8fa866]",
    accentBg: "bg-[#769656]/20",
    accentBorder: "border-[#769656]/30",
    accentHover: "hover:border-[#769656]/30",
    accentInstall: "bg-[#769656]",
    accentInstallHover: "hover:bg-[#8fa866]",
    accentInstallActive: "active:bg-[#5a7340]",
    hoverRowBg: "hover:bg-[#769656]/[0.05]",
    hasGuide: false,
    assets: [
      {
        version: "v1.2.0-release.js",
        desc: "Initial build for board detection and analysis.",
        url: "https://greasyfork.org/id/scripts/579299-chess-com-play-chess-online-free-games/code",
      },
    ],
  },
];

const DOC_FEATURES: DocFeature[] = [
  {
    icon: ZoomIn,
    title: "ES6+ Standards",
    desc: "Modern syntax with high-level runtime optimizations.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Info,
    title: "Namespace Validation",
    desc: "Mandatory UserScript headers for browser environment validation.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Code,
    title: "Semantic Versioning",
    desc: "Every release strictly follows the SemVer specification.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Settings,
    title: "Auto-Update Ready",
    desc: "Fully compatible with the Tampermonkey auto-update system.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

const TERMINAL_LINES = [
  { num: 1, content: <span className="text-slate-500"># Clone the repository</span>, mt: false },
  {
    num: 2,
    content: (
      <span className="text-blue-400">
        git clone <span className="text-emerald-400">&quot;https://github.com/JD-YH03D/Scripts&quot;</span>
      </span>
    ),
    mt: false,
  },
  {
    num: 3,
    content: (
      <span className="text-blue-400">
        cd <span className="text-slate-300">Scripts/build</span>
      </span>
    ),
    mt: false,
  },
  { num: 4, content: <span className="text-slate-500"># Install dependencies and optimize</span>, mt: true },
  {
    num: 5,
    content: (
      <span className="text-blue-400">
        npm <span className="text-slate-300">install</span> && npm <span className="text-slate-300">run optimize</span>
      </span>
    ),
    mt: false,
  },
  {
    num: 6,
    content: (
      <span className="text-emerald-400 font-bold">
        ✓ Build success: <span className="text-slate-300 font-normal">2 packages optimized.</span>
      </span>
    ),
    mt: true,
  },
];

// ============================================================
// CUSTOM HOOKS
// ============================================================
function useScrollPosition(threshold: number = LAYOUT.HEADER_SCROLL_THRESHOLD): boolean {
  const [isScrolled, setIsScrolled] = useState(false);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > threshold);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return isScrolled;
}

function useModalState() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}

function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= LAYOUT.MOBILE_BREAKPOINT) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, toggle, close };
}

function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    const container = containerRef.current;
    const sel = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusable = container.querySelectorAll<HTMLElement>(sel);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);

  return containerRef;
}

function useScrollToSection() {
  return useCallback((id: string, onDone?: () => void) => {
    if (id === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      onDone?.();
      return;
    }
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      onDone?.();
    }
  }, []);
}

// ============================================================
// SHARED / REUSABLE COMPONENTS
// ============================================================

/** GitHub SVG Icon */
const GitHubIcon = memo(({ size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    width={size}
    height={size}
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
));
GitHubIcon.displayName = "GitHubIcon";

/** Image with built-in fallback */
const SafeImage = memo(
  ({
    src,
    alt,
    fallbackText = "?",
    className,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fallbackText?: string }) => {
    const [hasError, setHasError] = useState(false);
    const fallback = `https://placehold.co/48x48/0f172a/60a5fa?text=${encodeURIComponent(fallbackText)}`;

    return (
      <img
        src={hasError ? fallback : src}
        alt={alt}
        className={className}
        onError={() => setHasError(true)}
        loading="lazy"
        {...props}
      />
    );
  }
);
SafeImage.displayName = "SafeImage";

// ============================================================
// VIDEO BACKGROUND — uses local file from public/
// ============================================================
const VideoBackground = memo(() => {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Attempt to play on mount (some browsers need this)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      // Autoplay blocked or failed — just show the poster / gradient
    });
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          // poster statis (opsional) — bisa taruh screenshot pertama di public/
          // poster={VIDEO_SOURCES.poster}
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* 
            Path lokal:  /image/sasuke/sasuke-Landscape/background-1.mp4
            File asli:   public/image/sasuke/sasuke-Landscape/background-1.mp4
            
            Vite / CRA akan serve folder public/ sebagai root "/".
            Jadi cukup tulis path tanpa "public/".
          */}
          <source src={VIDEO_SOURCES.primary} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        /* Gradient fallback kalau video gagal dimuat */
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />
      )}

      {/* Dark overlay agar konten tetap terbaca */}
      <div className="absolute inset-0 bg-slate-950/70" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[20px_20px] opacity-40" />
    </div>
  );
});
VideoBackground.displayName = "VideoBackground";

// ============================================================
// MODAL — Keyboard Controls
// ============================================================
const KeyboardControlsModal = memo(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const focusTrapRef = useFocusTrap(isOpen);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) onClose();
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 md:p-6"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            ref={focusTrapRef}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25, type: "spring", damping: 25 }}
            className="relative max-w-2xl w-full mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Keyboard className="text-emerald-400" size={16} />
                <h3 id="modal-title" className="font-semibold text-white text-sm tracking-wide uppercase">
                  GeoGuessr Controls
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-500 hover:text-white transition"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 max-h-[65vh] overflow-y-auto">
              <div className="overflow-hidden border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900/50 text-slate-500 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 font-semibold border-b border-slate-800 w-1/4">Key</th>
                      <th className="px-4 py-3 font-semibold border-b border-slate-800 w-1/4">Function</th>
                      <th className="px-4 py-3 font-semibold border-b border-slate-800 hidden sm:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-300">
                    {KEYBOARD_CONTROLS.map((c, i) => (
                      <motion.tr
                        key={c.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <kbd className="inline-flex items-center justify-center w-6 h-5 text-[10px] font-bold text-emerald-400 bg-slate-800/70 border border-slate-700 rounded shadow-[0_2px_0_rgba(0,0,0,0.3)]">
                            {c.key}
                          </kbd>
                        </td>
                        <td
                          className={`px-4 py-3 text-xs font-medium ${
                            c.isDiscord ? "text-[#5865F2]" : c.isPrimary ? "text-emerald-400" : "text-white"
                          }`}
                        >
                          {c.label}
                        </td>
                        <td className="px-4 py-3 text-slate-500 hidden sm:table-cell text-xs">{c.desc}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
KeyboardControlsModal.displayName = "KeyboardControlsModal";

// ============================================================
// HEADER
// ============================================================
const Header = memo(({ onOpenGuide }: { onOpenGuide: () => void }) => {
  const isScrolled = useScrollPosition();
  const { isOpen: isMobileOpen, toggle: toggleMobile, close: closeMobile } = useMobileMenu();
  const scrollTo = useScrollToSection();

  const mobileItems: NavItemMobile[] = [
    { href: "#directory", label: "Directory", Icon: FolderOpen, color: "text-blue-500" },
    { href: "#documentation", label: "Documentation", Icon: Book, color: "text-purple-500" },
    {
      href: "https://github.com/JD-YH03D/Releases-Published/issues",
      label: "Issues",
      Icon: GitHubIcon,
      color: "text-red-500",
      external: true,
    },
    {
      href: "https://github.com/JD-YH03D/Releases-Published",
      label: "GitHub Repository",
      Icon: GitHubIcon,
      color: "text-slate-400",
      external: true,
    },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-slate-800/50 shadow-lg shadow-slate-950/20"
          : "bg-slate-950/50 border-slate-800/30"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center space-x-4 group"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("#");
          }}
          aria-label="JD-YH03D Scripts Hub — Home"
        >
          <div className="relative">
            <div
              className="absolute inset-0 bg-blue-500/30 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition"
              aria-hidden="true"
            />
            <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-inner">
              <SafeImage
                src="https://raw.githubusercontent.com/JD-YH03D/Releases-Published/main/public/image/hero1.png"
                alt="JD-YH03D Logo"
                fallbackText="JD"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-white">JD-YH03D</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Scripts Hub</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider"
          aria-label="Main navigation"
        >
          {[
            { href: "#directory", label: "Directory", hoverColor: "hover:text-blue-400" },
            { href: "#documentation", label: "Docs", hoverColor: "hover:text-purple-400" },
            {
              href: "https://github.com/JD-YH03D/Releases-Published/issues",
              label: "Issues",
              hoverColor: "hover:text-red-400",
              external: true,
            },
          ].map((item, i) => (
            <motion.a
              key={item.href}
              href={item.href}
              className={`transition-colors duration-200 flex items-center text-slate-400 ${item.hoverColor}`}
              onClick={(e) => {
                if (!item.external) {
                  e.preventDefault();
                  scrollTo(item.href);
                }
              }}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {item.label}
            </motion.a>
          ))}
          <motion.a
            href="https://github.com/JD-YH03D/Releases-Published"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 text-white transition flex items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GitHubIcon size={14} className="mr-2" />
            GitHub
          </motion.a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-white transition w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-800"
          aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-menu"
          onClick={toggleMobile}
        >
          {isMobileOpen ? <X size={20} /> : <Code size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col py-4 px-6 space-y-1" aria-label="Mobile navigation">
              {mobileItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-slate-400 hover:text-white hover:bg-slate-800/50 px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center"
                  onClick={(e) => {
                    if (!item.external) {
                      e.preventDefault();
                      scrollTo(item.href, closeMobile);
                    } else {
                      closeMobile();
                    }
                  }}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                >
                  <item.Icon size={16} className={`mr-3 ${item.color}`} />
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
});
Header.displayName = "Header";

// ============================================================
// HERO SECTION
// ============================================================
const HeroVisual = memo(() => (
  <motion.div
    className="flex-1 w-full max-w-lg hidden lg:block"
    aria-hidden="true"
    initial={{ opacity: 0, x: 40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-700" />
      <div className="relative bg-slate-950/90 border border-slate-800 p-6 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/50" />
          </div>
          <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">engine_status: stable</span>
        </div>
        <div className="space-y-4">
          {(
            [
              ["75%", 0],
              ["100%", 0.2],
              ["83.33%", 0.3],
              ["66.67%", 0.4],
            ] as const
          ).map(([width, delay], i) => (
            <motion.div
              key={i}
              className={`h-2.5 rounded-full ${i % 2 === 0 ? "bg-slate-800/70" : "bg-slate-800/50"}`}
              initial={{ width: 0 }}
              animate={{ width }}
              transition={{ duration: 1, ease: "easeOut", delay }}
            />
          ))}
          <div className="flex gap-3 pt-4">
            <div className="h-8 w-16 bg-blue-500/15 border border-blue-500/20 rounded-lg" />
            <div className="h-8 w-28 bg-slate-800/50 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
));
HeroVisual.displayName = "HeroVisual";

const PulseBadge = memo(() => (
  <motion.div
    className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full mb-6"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <span className="relative flex h-2 w-2 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
    </span>
    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Version 1.0.0 — Production Live</span>
  </motion.div>
));
PulseBadge.displayName = "PulseBadge";

const HeroSection = memo(
  ({ onScrollToDirectory, onScrollToDocs }: { onScrollToDirectory: () => void; onScrollToDocs: () => void }) => (
    <section className="py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-16" aria-labelledby="hero-heading">
      <motion.div
        className="flex-1 text-center md:text-left"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <PulseBadge />
        <motion.h1
          id="hero-heading"
          className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Web Automation
          <br />
          <span className="text-blue-500">Script Engine</span>
        </motion.h1>
        <motion.p
          className="text-slate-400 text-base md:text-lg mb-10 max-w-xl leading-relaxed mx-auto md:mx-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          A centralized hub for high-quality UserScripts. Built for maximum performance, long-term stability, and
          seamless browser integration.
        </motion.p>
        <motion.div
          className="flex flex-wrap gap-4 justify-center md:justify-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            onClick={onScrollToDirectory}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-transform shadow-lg shadow-blue-500/35 flex items-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Scripts
            <ChevronRight size={16} className="ml-3 opacity-70" />
          </motion.button>
          <motion.button
            onClick={onScrollToDocs}
            className="bg-slate-900/50 backdrop-blur hover:bg-slate-800 text-slate-300 px-8 py-3.5 rounded-xl font-bold transition border border-slate-800"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Documentation
          </motion.button>
        </motion.div>
      </motion.div>
      <HeroVisual />
    </section>
  )
);
HeroSection.displayName = "HeroSection";

// ============================================================
// DIRECTORY SECTION
// ============================================================
const ScriptCardItem = memo(({ card, onOpenGuide }: { card: ScriptCard; onOpenGuide?: () => void }) => (
  <motion.article
    className={`rounded-2xl overflow-hidden group border bg-slate-800/30 backdrop-blur-xl border-slate-700/50 ${card.accentHover} transition-all`}
    aria-label={`${card.name} Script`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5 }}
  >
    {/* Card header */}
    <div className="bg-slate-900/60 px-6 py-5 border-b border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="relative w-12 h-12 flex-shrink-0">
          <div
            className={`absolute inset-0 ${card.accentBg} blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition`}
            aria-hidden="true"
          />
          <div className={`relative w-12 h-12 rounded-xl overflow-hidden border ${card.accentBorder} bg-slate-900`}>
            <SafeImage src={card.image} alt={card.name} fallbackText={card.fallbackText} className="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white text-base">{card.name}</h3>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{card.version}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {card.hasGuide && onOpenGuide && (
          <button
            onClick={onOpenGuide}
            className="text-xs font-bold text-emerald-400 hover:bg-emerald-400/10 px-4 py-2 rounded-lg transition border border-emerald-400/20 flex items-center"
          >
            <Book size={14} className="mr-2" />
            Guide
          </button>
        )}
        <span className="text-[10px] font-mono text-slate-600 bg-slate-950/50 px-3 py-1.5 rounded-md border border-slate-800">
          {card.assetCount} ASSET{card.assetCount !== 1 ? "S" : ""}
        </span>
      </div>
    </div>

    {/* Assets table */}
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-[10px] uppercase tracking-widest text-slate-500 bg-slate-950/40">
          <tr>
            <th className="px-6 py-4 font-bold border-b border-slate-800/50">Build Name</th>
            <th className="px-6 py-4 font-bold border-b border-slate-800/50 hidden sm:table-cell">Details</th>
            <th className="px-6 py-4 font-bold border-b border-slate-800/50 text-right w-36">Deployment</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/30">
          {card.assets.map((asset, i) => (
            <motion.tr
              key={asset.version}
              className={`${card.hoverRowBg} transition-colors`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <td className={`px-6 py-4 font-mono ${card.accentColor} font-medium text-xs`}>{asset.version}</td>
              <td className="px-6 py-4 text-slate-400 text-xs hidden sm:table-cell">{asset.desc || "—"}</td>
              <td className="px-6 py-4 text-right">
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block text-[10px] font-black uppercase text-white ${card.accentInstall} ${card.accentInstallHover} ${card.accentInstallActive} px-5 py-2.5 rounded-lg transition tracking-widest`}
                >
                  Install
                </a>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.article>
));
ScriptCardItem.displayName = "ScriptCardItem";

const TabFilter = memo(({ activeTab, onSwitch }: { activeTab: ActiveTab; onSwitch: (t: ActiveTab) => void }) => (
  <motion.div
    className="flex bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 w-fit"
    role="tablist"
    aria-label="Script category"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
  >
    {(["production", "legacy"] as ActiveTab[]).map((tab) => (
      <motion.button
        key={tab}
        role="tab"
        aria-selected={activeTab === tab}
        onClick={() => onSwitch(tab)}
        className={`px-5 py-2 text-xs font-bold rounded-lg transition-all capitalize ${
          activeTab === tab ? "text-white bg-blue-600 shadow-lg" : "text-slate-500 hover:text-slate-300"
        }`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {tab}
      </motion.button>
    ))}
  </motion.div>
));
TabFilter.displayName = "TabFilter";

const DirectorySection = memo(({ onOpenGuide }: { onOpenGuide: () => void }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("production");
  const switchTab = useCallback((tab: ActiveTab) => setActiveTab(tab), []);

  return (
    <section id="directory" className="py-20 border-t border-slate-900 scroll-mt-24" aria-labelledby="directory-heading">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h2 id="directory-heading" className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Active Directory
          </h2>
          <p className="text-slate-500 text-sm">Official script repository and production builds.</p>
        </div>
        <TabFilter activeTab={activeTab} onSwitch={switchTab} />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          role="tabpanel"
          initial={{ opacity: 0, x: activeTab === "production" ? 60 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === "production" ? -60 : 60 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          {activeTab === "production" ? (
            <div className="grid grid-cols-1 gap-10">
              {SCRIPT_CARDS.map((card) => (
                <ScriptCardItem key={card.id} card={card} onOpenGuide={card.hasGuide ? onOpenGuide : undefined} />
              ))}

              {/* Coming soon placeholder */}
              <motion.div
                className="border-2 border-dashed border-slate-800/60 p-12 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-slate-700 transition-colors"
                role="presentation"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="h-14 w-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-600 group-hover:text-blue-500 group-hover:border-blue-500/30 transition-colors">
                  <ChevronRight size={24} />
                </div>
                <p className="text-slate-400 text-sm font-bold tracking-wide">More Projects Coming Soon</p>
                <p className="text-slate-600 text-xs mt-1.5">New scripts are currently under active development.</p>
              </motion.div>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-5 text-slate-600">
                <FolderOpen size={24} />
              </div>
              <p className="text-slate-400 text-base font-bold">Legacy Archive</p>
              <p className="text-slate-600 text-sm mt-2 max-w-xs">
                Older script versions are not publicly available. Please contact the developer for access.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
});
DirectorySection.displayName = "DirectorySection";

// ============================================================
// DOCUMENTATION SECTION
// ============================================================
const TerminalPreview = memo(() => (
  <motion.div
    className="bg-[#0b1120] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl"
    role="complementary"
    aria-label="Terminal preview"
    initial={{ opacity: 0, x: 40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/80 border-b border-slate-800">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/40" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/40" />
        <div className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/40" />
      </div>
      <div className="flex items-center text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
        <Terminal size={12} className="mr-2" />
        development_shell
      </div>
    </div>
    <div className="p-6 text-[12px] font-mono leading-relaxed overflow-x-auto">
      {TERMINAL_LINES.map(({ num, content, mt }) => (
        <div key={num} className={`flex gap-4 mb-1 ${mt ? "mt-4" : ""}`}>
          <span className="text-slate-700 select-none w-4 text-right flex-shrink-0">{num}</span>
          <p>{content}</p>
        </div>
      ))}
    </div>
  </motion.div>
));
TerminalPreview.displayName = "TerminalPreview";

const DocumentationSection = memo(() => (
  <section id="documentation" className="py-24 border-t border-slate-900 scroll-mt-24" aria-labelledby="docs-heading">
    <div className="grid lg:grid-cols-2 gap-16 items-start">
      {/* Left column */}
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div>
          <h2 id="docs-heading" className="text-3xl font-black text-white mb-4 tracking-tight">
            Standardized Architecture
          </h2>
          <p className="text-slate-400 leading-relaxed">
            All scripts conform to the <span className="text-blue-400 font-bold">Standardized Script Schema (S3)</span>.
            We prioritize code security, runtime performance, and a smooth experience for end users.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {DOC_FEATURES.map((item, i) => (
            <motion.div
              key={item.title}
              className="p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center mb-4`}>
                <item.icon size={18} className={item.color} />
              </div>
              <h4 className="text-white font-bold text-sm mb-2">{item.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="pt-6 border-t border-slate-900"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href="https://github.com/JD-YH03D/Releases-Published/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center space-x-3 w-fit"
          >
            <div className="h-11 w-11 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 group-hover:border-red-500/40 transition-all">
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500"
                aria-hidden="true"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-300 block group-hover:text-white transition-colors">
                Found a Bug?
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Open an Issue on GitHub →</span>
            </div>
          </a>
        </motion.div>
      </motion.div>

      {/* Right column — terminal */}
      <TerminalPreview />
    </div>
  </section>
));
DocumentationSection.displayName = "DocumentationSection";

// ============================================================
// FOOTER
// ============================================================
const Footer = memo(() => {
  const scrollTo = useScrollToSection();

  return (
    <motion.footer
      className="py-14 border-t border-slate-900 bg-slate-950/90 mt-12 relative z-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Left */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200/20">
                <Code size={18} className="text-white" />
              </div>
              <span className="font-black text-white text-lg tracking-tight">JD-YH03D</span>
            </div>
            <p className="text-slate-600 text-xs font-medium">© 2024 JD-YH03D. Released under the MIT License.</p>
            <p className="text-slate-700 text-[10px] mt-1 uppercase tracking-tight max-w-xs">
              Production-Grade Web Automation Solutions.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center space-x-6">
              <a
                href="#directory"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#directory");
                }}
                className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
              >
                Scripts
              </a>
              <a
                href="#documentation"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#documentation");
                }}
                className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
              >
                Docs
              </a>
              <a
                href="https://github.com/JD-YH03D/Releases-Published"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all shadow-inner"
              >
                <GitHubIcon size={18} />
              </a>
            </div>
            <p className="text-slate-700 text-[10px] font-mono tracking-widest">v2.4.0-REV2024</p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
});
Footer.displayName = "Footer";

// ============================================================
// ERROR BOUNDARY
// ============================================================
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = memo(({ error, resetErrorBoundary }: ErrorFallbackProps) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <div className="text-center p-8">
      <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <X size={28} className="text-red-400" />
      </div>
      <h2 className="text-white text-xl font-bold mb-3">Something went wrong</h2>
      <pre className="text-red-400 text-xs mb-6 bg-slate-900 p-4 rounded-xl border border-slate-800 max-w-md overflow-auto">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition text-sm"
      >
        Try Again
      </button>
    </div>
  </div>
));
ErrorFallback.displayName = "ErrorFallback";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  FallbackComponent: React.ComponentType<ErrorFallbackProps>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, info);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      return <this.props.FallbackComponent error={this.state.error} resetErrorBoundary={this.reset} />;
    }
    return this.props.children;
  }
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function App() {
  const modal = useModalState();
  const scrollTo = useScrollToSection();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden">
        {/* Video BG — local file from public/ */}
        <VideoBackground />

        {/* Keyboard modal */}
        <KeyboardControlsModal isOpen={modal.isOpen} onClose={modal.close} />

        {/* Sticky header */}
        <Header onOpenGuide={modal.open} />

        {/* Page content */}
        <main className="container mx-auto px-6 max-w-6xl relative z-10">
          <HeroSection
            onScrollToDirectory={() => scrollTo("#directory")}
            onScrollToDocs={() => scrollTo("#documentation")}
          />
          <DirectorySection onOpenGuide={modal.open} />
          <DocumentationSection />
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
