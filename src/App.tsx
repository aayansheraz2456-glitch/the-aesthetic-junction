import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Clock, Calendar, Check, ArrowRight, X, Phone, ShieldCheck, Heart, Instagram, MapPin, Mail } from 'lucide-react';

// ==========================================
// IMAGE URLS (Optimized WebP, loaded locally for instant high-performance rendering)
// ==========================================
const HERO_IMAGE = '/hero.webp';
const SECTION2_IMAGE = '/gallery-facial.webp';
const SECTION3_IMG1 = '/regenerative.webp';
const SECTION3_IMG2 = '/lab.webp';
const SECTION3_BG = '/botox.webp';

// ==========================================
// DATA CONSTANTS
// ==========================================
const featureBars = [
  'Advanced Aesthetic Medicine',
  'World-Class Laser Technology',
  'Expert & Well-Trained Practitioners'
];

const services = [
  { name: 'Anti-Aging\nFillers & Botox', num: '01', active: true },
  { name: 'Advance Skincare\nLaser & Glow', num: '02', active: false },
  { name: 'Revitalizing\nPRP & Meso', num: '03', active: false },
  { name: 'Face & Body\nThread Lifts', num: null, active: false },
];

const CORE_SERVICES = [
  {
    id: 'botox-fillers',
    title: 'Botox & Fillers',
    category: 'Injectables',
    tag: 'Anti-Aging & Sculpting',
    desc: 'Restore youthful volume, soften expressions, and redefine facial contours with our expert, high-precision injectables.',
    image: '/botox.webp',
    duration: '30 - 45 Mins',
    downtime: 'Minimal (0-24 Hours)',
    benefits: [
      'Softens forehead lines, crow’s feet, and frown lines',
      'Plumps lips and defines jawlines with natural-looking dermal fillers',
      'FDA-approved, premium products administered by expert practitioners',
      'Tailored results that respect your unique facial expressions'
    ],
    subServices: ['Baby Botox / Xeomin', 'Lip Fillers & Contouring', 'Jawline & Cheek Sculpting', 'Nasolabial & Tear Trough Fillers']
  },
  {
    id: 'laser-hair',
    title: 'Laser Therapies',
    category: 'Lasers',
    tag: 'Advanced Laser Center',
    desc: 'Experience high-precision CO2 resurfacing, pain-free hair removal, and revolutionary Pico laser pigmentation removal.',
    image: '/laser.webp',
    duration: '15 - 60 Mins',
    downtime: 'Varies (None to 3 Days)',
    benefits: [
      'CO2 Fractional Laser stimulates massive collagen for deep acne scars',
      'Pico Laser targets melasma, pigmentation, and tattoo ink with speed',
      'World-class, painless laser technology for long-term smooth hair-free skin',
      'Carbon peel (Hollywood Peel) for immediate pore tightening and radiance'
    ],
    subServices: ['CO2 Fractional Laser', 'Pico Pigmentation & Tattoo Removal', 'Carbon Laser Peel', 'Premium Laser Hair Removal']
  },
  {
    id: 'hydrafacials',
    title: 'Clinical Glow Facials',
    category: 'Facials & Skincare',
    tag: 'Deep Skin Revitalization',
    desc: 'Deep cleanse, extract, hydrate, and nourish with our advanced HydraFacial regimens, exosome boosters, and microneedling.',
    image: '/gallery-facial.webp',
    duration: '45 - 75 Mins',
    downtime: 'None (Immediate Glow)',
    benefits: [
      'Multi-step HydraFacial deeply purifies pores and infuses rich serums',
      'Exosome booster therapy supercharges cell regeneration and cellular glow',
      'Microneedling RF improves skin elasticity, texture, and active acne scar healing',
      'Instantly hydrates, leaving skin plump, dewy, and camera-ready'
    ],
    subServices: ['HydraFacial Deluxe', 'Exosome Radiance Boost', 'Microneedling RF Therapy', 'Active Acne Correction']
  },
  {
    id: 'prp-meso',
    title: 'Mesotherapy & PRP',
    category: 'Regenerative',
    tag: 'Regenerative Science',
    desc: 'Harness the power of your body’s growth factors and tailored vitamin cocktails to stimulate natural hair and skin rejuvenation.',
    image: '/regenerative.webp',
    duration: '45 - 60 Mins',
    downtime: '12 - 24 Hours',
    benefits: [
      'Platelet-Rich Plasma (PRP) triggers hair follicle regrowth and counters thinning',
      'Vampire Facials utilize growth factors to smooth out fine lines and build skin density',
      'Mesotherapy cocktails inject custom vitamins, amino acids, and hyaluronic boosters',
      'Perfect natural solution for structural skin vitality and hair density'
    ],
    subServices: ['PRP Hair Regrowth', 'Vampire PRP Facelift', 'Vitamin Mesotherapy', 'Skin Booster Hydration']
  }
];

// ==========================================
// TYPES
// ==========================================
interface MaskPosition {
  x: number;
  y: number;
  sw: number;
  sh: number;
}

// ==========================================
// HOOKS
// ==========================================

function useMaskPositions(
  sectionRef: React.RefObject<HTMLElement | null>,
  cardRefs: React.RefObject<(HTMLElement | null)[]>
) {
  const [positions, setPositions] = useState<MaskPosition[]>([]);

  const updatePositions = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const sectionRect = section.getBoundingClientRect();
    const cards = cardRefs.current || [];

    const newPositions = cards.map((card) => {
      if (!card) {
        return { x: 0, y: 0, sw: sectionRect.width, sh: sectionRect.height };
      }
      const cardRect = card.getBoundingClientRect();
      return {
        x: cardRect.left - sectionRect.left,
        y: cardRect.top - sectionRect.top,
        sw: sectionRect.width,
        sh: sectionRect.height,
      };
    });

    setPositions(newPositions);
  }, [sectionRef, cardRefs]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new ResizeObserver(() => {
      updatePositions();
    });

    observer.observe(section);
    updatePositions();
    window.addEventListener('resize', updatePositions);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePositions);
    };
  }, [sectionRef, updatePositions]);

  // Handle minor layouts shifting as images/fonts load
  useEffect(() => {
    const t1 = setTimeout(updatePositions, 100);
    const t2 = setTimeout(updatePositions, 600);
    const t3 = setTimeout(updatePositions, 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [updatePositions]);

  return positions;
}

function useImageWidth(bgImage: string, sectionHeight: number) {
  const [imageWidth, setImageWidth] = useState<number>(0);

  useEffect(() => {
    if (!bgImage) return;
    const img = new Image();
    img.src = bgImage;
    const handleLoad = () => {
      if (img.naturalHeight > 0 && sectionHeight > 0) {
        const width = img.naturalWidth * (sectionHeight / img.naturalHeight);
        setImageWidth(width);
      }
    };
    img.onload = handleLoad;
    if (img.complete) {
      handleLoad();
    }
  }, [bgImage, sectionHeight]);

  return imageWidth;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return isMobile;
}

function useStaggeredReveal(count: number, threshold = 0.15) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(el);
      }
    }, { threshold });

    observer.observe(el);
    return () => {
      if (el) observer.disconnect();
    };
  }, [threshold]);

  const getAnimStyle = (index: number): React.CSSProperties => {
    const delay = index * 90;
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1) rotate(0deg)' : 'translateY(35px) scale(0.97) rotate(0.5deg)',
      transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    };
  };

  return { containerRef, getAnimStyle, visible };
}

// ==========================================
// COMPONENTS
// ==========================================

interface MaskedCardProps {
  bgImage: string;
  position?: MaskPosition;
  imageWidth: number;
  focalX: number;
  className?: string;
  children?: React.ReactNode;
  cardRef?: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
}

const MaskedCard: React.FC<MaskedCardProps> = ({
  bgImage,
  position,
  imageWidth,
  focalX,
  className = '',
  children,
  cardRef,
  style = {},
}) => {
  const inlineStyle: React.CSSProperties = { ...style };

  inlineStyle.backgroundImage = `url(${bgImage})`;

  if (position && position.sh > 0) {
    const overflow = imageWidth > position.sw ? imageWidth - position.sw : 0;
    const focalOffset = overflow * focalX;

    (inlineStyle as any)['--bg-pos-desktop'] = `-${position.x + focalOffset}px -${position.y}px`;
    (inlineStyle as any)['--bg-size-desktop'] = `auto ${position.sh}px`;
  }

  return (
    <div
      ref={cardRef as any}
      style={inlineStyle}
      className={`${className} bg-cover bg-center bg-no-repeat md:[background-position:var(--bg-pos-desktop)] md:[background-size:var(--bg-size-desktop)] md:bg-no-repeat transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] card-glow-hover`}
    >
      {children}
    </div>
  );
};

// ==========================================
// SPLASH SCREEN
// ==========================================
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [counter, setCounter] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20); // 100 steps * 20ms = 2000ms

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (counter === 100) {
      const exitTimer = setTimeout(() => {
        setExiting(true);
      }, 200); // Wait 200ms after reaching 100

      const completeTimer = setTimeout(() => {
        onComplete();
      }, 900); // 200ms wait + 700ms transition = 900ms total after reaching 100

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [counter, onComplete]);

  return (
    <div
      id="splash-screen"
      className={`fixed inset-0 bg-white z-[100] flex items-end justify-start transition-opacity duration-700 ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-7xl md:text-9xl font-black tabular-nums p-6 md:p-10 leading-none text-black select-none">
        {counter}%
      </div>
    </div>
  );
};

// ==========================================
// BRAND VECTOR LOGO
// ==========================================
const Logo = () => {
  return (
    <img
      src="/logo.png"
      alt="Aesthetic Junction"
      className="h-14 md:h-20 object-contain shrink-0 mix-blend-multiply"
    />
  );
};

// ==========================================
// NAVBAR
// ==========================================
interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-100 transition-all duration-300"
    >
      {/* Brand logo (left side) */}
      <a href="#home" className="hover:opacity-90 transition-opacity">
        <Logo />
      </a>

      {/* Desktop Navigation (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-8">
        <div className="flex items-center gap-6">
          <a href="#home" className="text-sm font-semibold cursor-pointer hover:text-[#C5A059] transition-colors">Home</a>
          <a href="#about" className="text-sm font-semibold cursor-pointer hover:text-[#C5A059] transition-colors">About</a>
          <a href="#services" className="text-sm font-semibold cursor-pointer hover:text-[#C5A059] transition-colors">Services</a>
          <a href="#gallery" className="text-sm font-semibold cursor-pointer hover:text-[#C5A059] transition-colors">Gallery</a>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-full shadow-sm magnetic-btn cursor-pointer"
          >
            MENU
          </button>
        </div>
      </div>

      {/* Mobile hamburger (visible only on mobile) */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden w-10 h-10 flex items-center justify-center relative focus:outline-none z-50 transition-all duration-300"
        aria-label="Toggle menu"
      >
        <div className="flex flex-col gap-1.5 w-6 items-end">
          <span
            className={`h-0.5 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'
            }`}
          />
          <span
            className={`h-0.5 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isMenuOpen ? 'w-0 opacity-0' : 'w-4'
            }`}
          />
          <span
            className={`h-0.5 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'
            }`}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsMenuOpen(false)}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          className="absolute inset-0 transition-opacity"
        />

        {/* Slide-out Panel */}
        <div
          style={{ backgroundColor: '#ffffff' }}
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm shadow-2xl flex flex-col justify-between p-8 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Slide-out Top Row */}
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100 mt-2">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C5A059] select-none">
              Skin & Body Bliss
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="hidden md:flex w-10 h-10 rounded-full border border-neutral-100 items-center justify-center hover:bg-neutral-50 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>

          {/* Slide-out Links */}
          <div className="flex flex-col gap-6 py-6 my-auto select-none">
            {['Home', 'About', 'Services', 'Gallery', 'Contact'].map((link, i) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  transitionDelay: `${isMenuOpen ? 80 + i * 50 : 0}ms`,
                }}
                className={`text-3xl font-bold text-black hover:text-[#C5A059] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Bottom section of slide panel */}
          <div
            style={{ transitionDelay: isMenuOpen ? '350ms' : '0ms' }}
            className={`pt-6 border-t border-neutral-100 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-xs text-neutral-500 font-medium mb-1 select-none">
              Where beauty meets science.
            </p>
            <p className="text-sm font-bold text-black mb-4 select-none">
              Call Helpline: <a href="tel:03111145510" className="text-[#C5A059] hover:underline">0311 1145510</a>
            </p>
            <a
              href="https://www.instagram.com/the_aestheticjunction"
              target="_blank"
              rel="noreferrer"
              className="block text-center w-full px-6 py-3.5 bg-black text-white hover:bg-[#C5A059] rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-200"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Core Services & Booking States
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Background Image Preloader for instant rendering
  useEffect(() => {
    const urlsToPreload = [
      HERO_IMAGE,
      SECTION2_IMAGE,
      SECTION3_IMG1,
      SECTION3_IMG2,
      SECTION3_BG,
      ...CORE_SERVICES.map(s => s.image)
    ];
    urlsToPreload.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, []);
  const [activeDetailService, setActiveDetailService] = useState<typeof CORE_SERVICES[0] | null>(null);
  const [bookingService, setBookingService] = useState<typeof CORE_SERVICES[0] | null>(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const openBooking = (service: typeof CORE_SERVICES[0]) => {
    setBookingService(service);
    setBookingSuccess(false);
    setBookingName('');
    setBookingPhone('');
    setBookingDate('');
    setBookingTime('');
    setBookingNotes('');
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone) return;
    setBookingSuccess(true);
  };

  // Section 1 Refs & Hooks (Hero)
  const section1Ref = useRef<HTMLElement | null>(null);
  const s1CardsRef = useRef<(HTMLElement | null)[]>([]);
  const [s1Height, setS1Height] = useState(800);

  // Section 2 Refs & Hooks (Gallery)
  const section2Ref = useRef<HTMLElement | null>(null);
  const s2CardsRef = useRef<(HTMLElement | null)[]>([]);
  const [s2Height, setS2Height] = useState(800);

  // Sync heights for hooks
  useEffect(() => {
    const s1 = section1Ref.current;
    if (s1) {
      const obs = new ResizeObserver(() => setS1Height(s1.clientHeight));
      obs.observe(s1);
      setS1Height(s1.clientHeight);
      return () => obs.disconnect();
    }
  }, []);

  useEffect(() => {
    const s2 = section2Ref.current;
    if (s2) {
      const obs = new ResizeObserver(() => setS2Height(s2.clientHeight));
      obs.observe(s2);
      setS2Height(s2.clientHeight);
      return () => obs.disconnect();
    }
  }, []);

  // Retrieve mask layout coordinates
  const s1Positions = useMaskPositions(section1Ref, s1CardsRef);
  const s2Positions = useMaskPositions(section2Ref, s2CardsRef);

  // Compute scaled image widths
  const s1ImageWidth = useImageWidth(HERO_IMAGE, s1Height);
  const s2ImageWidth = useImageWidth(SECTION2_IMAGE, s2Height);

  // Dynamic focal positioning based on screen size
  const s1Focal = isMobile ? 0.7 : 0.8;
  const s2Focal = isMobile ? 0.65 : 0.8;

  // Staggered Animations
  const s1Reveal = useStaggeredReveal(4, 0.1);
  const sServicesReveal = useStaggeredReveal(4, 0.1);
  const s2Reveal = useStaggeredReveal(4, 0.1);
  const s3Reveal = useStaggeredReveal(4, 0.1);

  // Handle body scroll locking when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <div className="bg-white min-h-screen text-black selection:bg-[#C5A059] selection:text-white">
      {/* 1. Conditional Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* 2. Fixed Navbar */}
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* ==========================================
          SECTION 1 - HERO (Bento Grid Mosaic Theme)
          ========================================== */}
      <section
        id="home"
        ref={(el) => {
          section1Ref.current = el;
          s1Reveal.containerRef.current = el;
        }}
        className="min-h-screen md:h-screen w-full flex flex-col pt-24 px-4 pb-4 gap-3 bg-white overflow-y-visible md:overflow-hidden"
      >
        {/* 12-Column Responsive Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-3 h-auto md:h-full flex-1">
          
          {/* Main Hero Mosaic Cell (col-span-8, row-span-6 on desktop) */}
          <MaskedCard
            bgImage={HERO_IMAGE}
            position={s1Positions[3]}
            imageWidth={s1ImageWidth}
            focalX={s1Focal}
            cardRef={(el) => {
              s1CardsRef.current[3] = el;
            }}
            style={s1Reveal.getAnimStyle(3)}
            className="col-span-1 md:col-span-8 md:row-span-6 rounded-3xl overflow-hidden relative border border-white/10 shadow-lg group min-h-[350px] md:min-h-0"
          >
            {/* Ambient luxury glass tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-500 group-hover:from-black/50" />

            {/* Top-left detailed text */}
            <div className="absolute top-8 left-8 select-none">
              <p className="text-white/80 text-sm font-medium tracking-wide max-w-[280px] leading-relaxed border-l-2 border-[#C5A059] pl-3">
                Where beauty meets science and self-care is elevated to an art form.
              </p>
            </div>

            {/* Bottom-left massive typographic display */}
            <div className="absolute bottom-8 left-8">
              <span className="block text-[#C5A059] text-xs font-bold uppercase tracking-[0.25em] mb-2 drop-shadow-sm select-none">
                The Aesthetic Junction
              </span>
              <h1 className="text-white text-[clamp(2.5rem,7vw,7.5rem)] font-black leading-[0.78] tracking-tighter uppercase drop-shadow-lg">
                SKIN<br />CARE
              </h1>
            </div>

            {/* Bottom-right dynamic patient pulse badge */}
            <div className="absolute bottom-8 right-8 text-white/95 text-xs font-bold flex items-center gap-2 bg-black/45 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 select-none shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></div>
              NOW ACCEPTING CLIENTS
            </div>
          </MaskedCard>

          {/* Right Bento Column: 3 Auxiliary Feature Cells (col-span-4 on desktop) */}
          <div className="col-span-1 md:col-span-4 md:row-span-6 flex flex-col gap-3">
            {featureBars.map((text, i) => (
              <MaskedCard
                key={i}
                bgImage={HERO_IMAGE}
                position={s1Positions[i]}
                imageWidth={s1ImageWidth}
                focalX={s1Focal}
                cardRef={(el) => {
                  s1CardsRef.current[i] = el;
                }}
                style={s1Reveal.getAnimStyle(i)}
                className="flex-1 rounded-3xl overflow-hidden relative flex flex-col justify-between p-6 border border-white/10 group shadow-md h-[120px] md:h-auto"
              >
                {/* Premium translucent filter inside the bento cells */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                
                {/* Micro branding header */}
                <div className="flex justify-between items-start relative z-10 w-full select-none">
                  <span className="text-[10px] font-bold bg-[#C5A059] text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                    0{i + 1}
                  </span>
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                    Aesthetic Standard
                  </span>
                </div>

                {/* Left aligned bento title */}
                <h3 className="text-white text-base md:text-lg lg:text-xl font-black uppercase leading-tight relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] max-w-[240px] mt-4 select-none">
                  {text}
                </h3>
              </MaskedCard>
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
          SECTION 2 - ADVANCED SKIN & LASER CLINIC (Bento Grid) (About)
          ========================================== */}
      <section
        id="about"
        ref={(el) => {
          s3Reveal.containerRef.current = el;
        }}
        className="min-h-screen md:h-screen w-full flex flex-col pt-4 px-4 pb-4 gap-3 bg-white overflow-y-visible md:overflow-hidden"
      >
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3 h-auto md:h-full">
          
          {/* LEFT BENTO COLUMN: SOLID LUXURY CARDS */}
          <div className="flex flex-col gap-3 h-auto md:h-full">
            
            {/* 1. Brand Statement Card */}
            <div
              style={s3Reveal.getAnimStyle(0)}
              className="rounded-3xl bg-[#FBFBFB] border border-neutral-100 p-8 flex flex-col justify-between flex-[1.2] min-h-[180px] md:min-h-0 hover:border-[#C5A059]/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex justify-between items-start w-full select-none">
                <div className="w-10 h-10 rounded-full border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] bg-[#C5A059]/5">
                  <span className="text-xl">✦</span>
                </div>
                <span className="text-[10px] font-bold bg-black text-white px-3 py-1 rounded-full uppercase tracking-wider">
                  PREMIUM
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.20em] block mb-1">
                  Aesthetics & Science
                </span>
                <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black uppercase leading-[0.85] text-black tracking-tighter">
                  Laser &<br />Skincare
                </h2>
              </div>
            </div>

            {/* 2. Portrait Product Gallery cells (Grid within Grid) */}
            <div
              style={s3Reveal.getAnimStyle(1)}
              className="flex gap-3 flex-1 min-h-[140px] md:min-h-0"
            >
              <div className="flex-1 rounded-3xl overflow-hidden shadow-sm border border-neutral-100 group relative">
                <img
                  src={SECTION3_IMG1}
                  alt="Aesthetic Hydrafacial Treatment"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent p-4 flex flex-col justify-end">
                  <p className="text-white text-[10px] font-black uppercase tracking-wider">SKIN THERAPY</p>
                </div>
              </div>
              <div className="flex-1 rounded-3xl overflow-hidden shadow-sm border border-neutral-100 group relative">
                <img
                  src={SECTION3_IMG2}
                  alt="Professional Skincare Facility"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent p-4 flex flex-col justify-end">
                  <p className="text-white text-[10px] font-black uppercase tracking-wider">CLINICAL LAB</p>
                </div>
              </div>
            </div>

            {/* 3. Aesthetic Consult Action Card */}
            <div
              style={s3Reveal.getAnimStyle(2)}
              className="rounded-3xl bg-neutral-900 text-white p-8 flex items-end justify-between flex-[0.8] min-h-[160px] md:min-h-0 relative overflow-hidden group shadow-lg border border-neutral-950"
            >
              {/* Gold gradient ambient light blur */}
              <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-[#C5A059]/10 blur-3xl group-hover:bg-[#C5A059]/20 transition-all duration-500" />
              
              <div className="relative z-10 select-none">
                <p className="text-[#C5A059] text-[10px] font-bold bg-white/10 w-max px-2.5 py-0.5 rounded-full uppercase tracking-widest mb-3">
                  Consultation
                </p>
                <h3 className="text-xl md:text-2xl font-black uppercase text-white leading-tight tracking-wide">
                  Advance Glow<br />Aesthetic<br />Treatments
                </h3>
              </div>

              <a
                href="https://www.instagram.com/the_aestheticjunction"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-wider shadow-md relative z-10 magnetic-btn cursor-pointer"
              >
                BOOK ONLINE
              </a>
            </div>

          </div>

          {/* RIGHT BENTO COLUMN: SINGLE TALL LUXURY IMAGE CELL */}
          <div
            style={s3Reveal.getAnimStyle(3)}
            className="rounded-3xl overflow-hidden relative min-h-[400px] md:min-h-0 group shadow-md border border-neutral-100 h-[400px] md:h-full"
          >
            <img
              src={SECTION3_BG}
              alt="Beautiful Glowing Skincare Client Profile"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Elegant high-end gradient shading */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

            {/* Double Floating Overlay bento blocks */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row gap-3 z-10">
              
              {/* Floating Overlay Cell 1 */}
              <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-6 flex flex-col justify-between h-28 sm:h-44 md:h-52 border border-neutral-100 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xs sm:text-base md:text-lg lg:text-xl font-black text-black leading-tight uppercase tracking-tight">
                  The Art<br />of Science &<br />Self-Care
                </h4>
                
                <a
                  href="#services"
                  className="self-end w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
                  aria-label="View services"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="rotate-[-45deg]"
                  >
                    <path
                      d="M1 7h12m0 0L8 2m5 5L8 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              {/* Floating Overlay Cell 2 */}
              <div className="flex-1 bg-black/45 backdrop-blur-md rounded-2xl p-4 sm:p-6 flex flex-col justify-between h-28 sm:h-44 md:h-52 border border-white/10 hover:bg-black/60 transition-all duration-300">
                <h4 className="text-xs sm:text-base md:text-lg lg:text-xl font-black text-white leading-tight uppercase tracking-tight">
                  Expert &<br />Nurturing<br />Skin Therapy
                </h4>

                <a
                  href="#contact"
                  className="self-end w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-[#C5A059] hover:border-[#C5A059] transition-all duration-300"
                  aria-label="Contact clinic"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="rotate-[-45deg]"
                  >
                    <path
                      d="M1 7h12m0 0L8 2m5 5L8 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          SECTION 3 - CORE SERVICES (Luxury Aesthetic Showcase) (Services)
          ========================================== */}
      <section
        id="services"
        ref={(el) => {
          sServicesReveal.containerRef.current = el;
        }}
        className="min-h-screen w-full bg-white py-24 px-6 md:px-12 border-b border-neutral-100 flex flex-col justify-center"
      >
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Header Block */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 select-none animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4.5 h-4.5 text-[#C5A059] animate-pulse" />
                <span className="text-[#C5A059] text-xs font-black uppercase tracking-[0.25em]">
                  Clinically Proven Treatments
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black leading-none">
                Our Core Services
              </h2>
              <p className="text-neutral-500 text-sm md:text-base font-medium max-w-xl mt-4 leading-relaxed">
                Discover our curated suite of state-of-the-art non-surgical procedures designed to enhance your natural contours and bring forth flawless, luminous skin.
              </p>
            </div>

            {/* Helpline Booking Callout */}
            <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5 flex items-center gap-4 hover:border-[#C5A059]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white shrink-0">
                <Phone className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Instant Consultations</p>
                <a href="tel:03111145510" className="text-lg font-black text-black hover:text-[#C5A059] transition-colors leading-none block mt-1">
                  0311 1145510
                </a>
              </div>
            </div>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 pb-2 border-b border-neutral-100 select-none">
            {['All', 'Injectables', 'Lasers', 'Facials & Skincare', 'Regenerative'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-md scale-[1.03]'
                    : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services Grid with Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_SERVICES.map((svc, i) => {
              const isVisible = selectedCategory === 'All' || svc.category === selectedCategory;
              return (
                <div
                  key={svc.id}
                  style={sServicesReveal.getAnimStyle(i)}
                  className={`group bg-white border border-neutral-100 rounded-3xl overflow-hidden transition-all duration-500 flex flex-col h-full card-glow-hover ${
                    isVisible ? 'flex' : 'hidden'
                  }`}
                >
                  {/* Image Wrap */}
                  <div className="h-56 w-full relative overflow-hidden bg-neutral-100 shrink-0">
                    <img
                      src={svc.image}
                      alt={svc.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-95" />
                    
                    {/* Floating Tags */}
                    <div className="absolute top-4 left-4">
                      <span className="text-[9px] font-bold bg-[#C5A059] text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {svc.category}
                      </span>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">
                        {svc.tag}
                      </p>
                      <h3 className="text-white text-xl font-black uppercase leading-tight tracking-tight">
                        {svc.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <p className="text-neutral-500 text-xs font-medium leading-relaxed mb-6">
                        {svc.desc}
                      </p>

                      {/* Features Badges */}
                      <div className="flex flex-col gap-2 mb-6">
                        {svc.subServices.slice(0, 3).map((sub, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-[11px] font-bold text-neutral-800 select-none">
                            <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                            <span>{sub}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="grid grid-cols-2 gap-2 mt-auto border-t border-neutral-100 pt-4 shrink-0">
                      <button
                        onClick={() => setActiveDetailService(svc)}
                        className="px-3 py-2.5 rounded-full border border-neutral-200 text-neutral-800 text-[10px] font-black uppercase tracking-wider transition-all text-center cursor-pointer select-none magnetic-btn"
                      >
                        Learn More
                      </button>
                      <button
                        onClick={() => openBooking(svc)}
                        className="px-3 py-2.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider transition-all text-center cursor-pointer select-none shadow-sm magnetic-btn"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==========================================
          SECTION 4 - SKIN & GLOW GALLERY (Bento Layout) (Gallery)
          ========================================== */}
      <section
        id="gallery"
        ref={(el) => {
          section2Ref.current = el;
          s2Reveal.containerRef.current = el;
        }}
        className="min-h-screen md:h-screen w-full flex flex-col pt-4 px-4 pb-4 gap-3 bg-white overflow-y-visible md:overflow-hidden"
      >
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-3 h-auto md:h-full">
          
          {/* Bento Cell 0: Bottom Left ("Skin Gallery" Banner) */}
          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[0]}
            imageWidth={s2ImageWidth}
            focalX={s2Focal}
            cardRef={(el) => {
              s2CardsRef.current[0] = el;
            }}
            style={s2Reveal.getAnimStyle(0)}
            className="col-span-1 md:col-span-8 md:row-span-2 rounded-3xl overflow-hidden relative min-h-[160px] md:min-h-0 border border-white/10 group shadow-md"
          >
            <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors duration-300" />
            <div className="absolute top-8 left-8 flex flex-col">
              <span className="text-[10px] font-bold bg-[#C5A059] text-white px-3 py-1 rounded-full uppercase tracking-wider w-max mb-3">
                GALLERY
              </span>
              <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter">
                Skin & Glow Gallery
              </h2>
            </div>
            <p className="absolute bottom-6 left-8 text-white/90 text-xs font-bold flex items-center gap-2 select-none">
              <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
              Clinical Treatment History
            </p>
          </MaskedCard>

          {/* Bento Cell 1: Right (Spans multiple vertical rows in desktop) */}
          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[1]}
            imageWidth={s2ImageWidth}
            focalX={s2Focal}
            cardRef={(el) => {
              s2CardsRef.current[1] = el;
            }}
            style={s2Reveal.getAnimStyle(1)}
            className="col-span-1 md:col-span-4 md:row-span-4 rounded-3xl overflow-hidden relative min-h-[260px] md:min-h-0 border border-white/10 shadow-md group"
          >
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors duration-300" />
            
            <div className="absolute top-8 left-8">
              <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white bg-black/20 backdrop-blur-sm shadow-inner">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="rotate-[-45deg]">
                  <path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Elegant callout statement */}
            <p className="absolute bottom-24 left-8 text-white text-base md:text-xl font-bold leading-relaxed max-w-[280px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none">
              Unlock flawless glowing skin. Contact us today to request your customized aesthetic plan.
            </p>
            
            {/* CTA action button */}
            <a
              href="tel:03111145510"
              className="absolute bottom-6 right-6 px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-wider z-10 shadow-lg magnetic-btn cursor-pointer"
            >
              CALL HELPLINE
            </a>
          </MaskedCard>

          {/* Bento Cell 2: Bottom Left ("Aesthetic Makeover") */}
          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[2]}
            imageWidth={s2ImageWidth}
            focalX={s2Focal}
            cardRef={(el) => {
              s2CardsRef.current[2] = el;
            }}
            style={s2Reveal.getAnimStyle(2)}
            className="col-span-1 md:col-span-8 md:row-span-2 rounded-3xl overflow-hidden relative min-h-[160px] md:min-h-0 border border-white/10 group shadow-md"
          >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
            <h3 className="absolute bottom-8 left-8 text-white text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-[0.8] tracking-tighter">
              Aesthetic<br />
              <span className="text-[#C5A059]">Makeovers</span>
            </h3>
          </MaskedCard>

          {/* Bento Cell 3: Bottom Full Width Services Drawer */}
          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[3]}
            imageWidth={s2ImageWidth}
            focalX={s2Focal}
            cardRef={(el) => {
              s2CardsRef.current[3] = el;
            }}
            style={s2Reveal.getAnimStyle(3)}
            className="col-span-1 md:col-span-12 md:row-span-2 rounded-3xl overflow-hidden relative min-h-[220px] md:min-h-0 border border-white/10 shadow-lg"
          >
            {/* Overlay backdrop */}
            <div className="absolute inset-0 bg-black/55" />

            {/* Inner dynamic grid representing the Bento Grid's columns */}
            <div className="relative md:absolute md:inset-0 z-10 flex flex-wrap md:flex-nowrap gap-3 p-3 h-auto md:h-full">
              {services.map((svc, i) => (
                <div
                  key={i}
                  className={`flex-1 min-w-[calc(50%-6px)] md:min-w-0 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] border min-h-[120px] md:min-h-0 ${
                    svc.active
                      ? 'bg-white text-black border-[#C5A059] shadow-md'
                      : 'bg-black/40 backdrop-blur-md border-white/10 hover:border-white/20 text-white'
                  }`}
                >
                  <span className={`text-3xl font-black ${svc.active ? 'text-[#C5A059]' : 'text-white/30'}`}>
                    {svc.num || '04'}
                  </span>
                  
                  <div className="mt-4 select-none">
                    <h4 className="text-xs md:text-base font-black uppercase leading-tight tracking-tight whitespace-pre-line">
                      {svc.name}
                    </h4>
                    <p className={`text-[9px] font-bold mt-1 uppercase tracking-widest ${svc.active ? 'text-neutral-500' : 'text-white/40'}`}>
                      {svc.num ? 'TREATMENT' : 'RECOMMENDED'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </MaskedCard>

        </div>
      </section>

      {/* ==========================================
          FOOTER / CONTACT SECTION (Branded aesthetic climax)
          ========================================== */}
      <footer
        id="contact"
        className="bg-[#0B0B0B] text-white py-16 px-6 md:px-12 border-t border-[#C5A059]/10 select-none"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 pb-12 border-b border-neutral-900">
          
          {/* Col 1: Brand Identifier */}
          <div className="flex flex-col gap-4">
            <div className="bg-white p-2 rounded-2xl w-max flex items-center justify-center shadow-lg">
              <img
                src="/logo.png"
                alt="Aesthetic Junction"
                className="h-16 md:h-20 object-contain mix-blend-multiply"
              />
            </div>
            <p className="text-neutral-400 text-xs font-medium leading-relaxed max-w-sm mt-2">
              Dedicated to world-class non-surgical skincare treatments, advanced laser medical systems, and premium facial contouring.
            </p>
          </div>

          {/* Col 2: Clinic Location & Hours */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#C5A059] text-xs font-black uppercase tracking-[0.2em] select-none">
              The Clinic Location
            </h4>
            <div className="flex items-start gap-3 mt-1">
              <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <p className="text-neutral-200 text-xs font-bold uppercase leading-tight">62 Gateway Mall</p>
                <p className="text-neutral-400 text-xs font-medium leading-relaxed mt-1">
                  Near KFC, Okara, Punjab, Pakistan, 56300.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 mt-1">
              <Clock className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <p className="text-neutral-200 text-xs font-bold uppercase leading-tight">Timings</p>
                <p className="text-neutral-400 text-xs font-medium leading-relaxed mt-1">
                  Mon – Sat: 11:00 AM – 8:00 PM <br />
                  Sunday: Closed (Prior Appointments Only)
                </p>
              </div>
            </div>
          </div>

          {/* Col 3: Consultation & Connect */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#C5A059] text-xs font-black uppercase tracking-[0.2em] select-none">
              Book Consultation
            </h4>
            <div className="flex flex-col gap-3 mt-1">
              <a
                href="tel:03111145510"
                className="flex items-center gap-3 group w-max"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#C5A059] group-hover:border-[#C5A059] flex items-center justify-center text-white transition-all duration-300">
                  <Phone className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider leading-none">CALL OR WHATSAPP</p>
                  <p className="text-lg font-black text-white group-hover:text-[#C5A059] transition-colors mt-1 leading-none">0311 1145510</p>
                </div>
              </a>

              <a
                href="https://www.instagram.com/the_aestheticjunction"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 group w-max mt-2"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#C5A059] group-hover:border-[#C5A059] flex items-center justify-center text-white transition-all duration-300">
                  <Instagram className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider leading-none">INSTAGRAM FEED</p>
                  <p className="text-sm font-black text-neutral-300 group-hover:text-white transition-colors mt-1 leading-none">@the_aestheticjunction ↗</p>
                </div>
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 font-medium">
          <p>© 2026 The Aesthetic Junction. Skin & Body Bliss.</p>
          <p className="mt-2 md:mt-0">Beauty Meets Science.</p>
        </div>
      </footer>

      {/* Service Detail Modal */}
      {activeDetailService && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Image banner */}
            <div className="h-64 md:h-72 w-full relative bg-neutral-100 shrink-0">
              <img
                src={activeDetailService.image}
                alt={activeDetailService.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
              
              {/* Close button */}
              <button
                onClick={() => setActiveDetailService(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/45 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[9px] font-bold bg-[#C5A059] text-white px-3 py-1 rounded-full uppercase tracking-wider w-max mb-2 block">
                  {activeDetailService.category}
                </span>
                <p className="text-white/80 text-xs font-bold uppercase tracking-widest leading-none mb-1">
                  {activeDetailService.tag}
                </p>
                <h3 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tight">
                  {activeDetailService.title}
                </h3>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              
              {/* Stat bar */}
              <div className="grid grid-cols-2 gap-4 bg-neutral-50 border border-neutral-100 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <div>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Treatment Duration</p>
                    <p className="text-xs font-black text-black mt-1 leading-none">{activeDetailService.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 border-l border-neutral-200 pl-4">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <div>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Expected Downtime</p>
                    <p className="text-xs font-black text-black mt-1 leading-none">{activeDetailService.downtime}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-neutral-600 text-sm font-medium leading-relaxed mb-6">
                {activeDetailService.desc}
              </p>

              {/* Sub-Treatments */}
              <div className="mb-6">
                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3 select-none">
                  Included Specializations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeDetailService.subServices.map((sub, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-bold text-neutral-800 bg-neutral-50 border border-neutral-100 rounded-full px-3.5 py-1.5 animate-in fade-in duration-300"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Benefits */}
              <div>
                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3 select-none">
                  Key Treatment Benefits
                </h4>
                <div className="flex flex-col gap-3">
                  {activeDetailService.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <p className="text-neutral-700 text-xs font-medium leading-relaxed">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="p-6 border-t border-neutral-100 flex gap-3 shrink-0 bg-white">
              <button
                onClick={() => setActiveDetailService(null)}
                className="flex-1 py-3 rounded-full border border-neutral-200 text-neutral-800 text-xs font-black uppercase tracking-wider hover:bg-neutral-50 hover:border-black transition-all text-center cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const svc = activeDetailService;
                  setActiveDetailService(null);
                  setTimeout(() => openBooking(svc), 150);
                }}
                className="flex-1 py-3 rounded-full bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-[#C5A059] transition-all text-center cursor-pointer select-none shadow-md"
              >
                Request Appointment
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Interactive Booking Modal */}
      {bookingService && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
          <div className="bg-white rounded-3xl overflow-hidden max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl relative border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Secure Appointment Request
                </span>
              </div>
              <button
                onClick={() => setBookingService(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-black cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable Form) */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {!bookingSuccess ? (
                <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#C5A059] bg-[#C5A059]/5 border border-[#C5A059]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Selected Treatment
                    </span>
                    <h3 className="text-xl font-black uppercase text-black tracking-tight mt-1">
                      {bookingService.title}
                    </h3>
                  </div>

                  {/* Input - Name */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="e.g. Maria Khan"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold text-black focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Input - Phone */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                      Phone Number / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="e.g. 0300 1234567"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold text-black focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Grid Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold text-black focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all text-center"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold text-black focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all text-center"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                      Skin Concerns / Custom Notes
                    </label>
                    <textarea
                      rows={3}
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Briefly tell us what you wish to achieve..."
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold text-black focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {/* Warning */}
                  <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-100 p-3 rounded-2xl text-neutral-500 text-[10px] font-semibold leading-relaxed">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>Your details are completely confidential. We will connect with you via Phone or WhatsApp shortly to confirm.</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 rounded-full bg-black hover:bg-[#C5A059] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md select-none cursor-pointer"
                  >
                    Send Booking Request
                  </button>
                </form>
              ) : (
                /* Success Screen */
                <div className="flex flex-col items-center justify-center text-center py-8 select-none animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-black uppercase tracking-tight">
                    Request Received!
                  </h3>
                  <p className="text-neutral-500 text-xs font-semibold mt-2 max-w-[280px] leading-relaxed">
                    Thank you, <span className="text-black font-bold">{bookingName}</span>. Your booking request for <span className="text-black font-bold">{bookingService.title}</span> has been logged!
                  </p>

                  <div className="w-full border-t border-neutral-100 my-6 pt-4 flex flex-col gap-3">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Instant WhatsApp Confirmation
                    </p>
                    
                    <a
                      href={`https://wa.me/923111145510?text=${encodeURIComponent(
                        `Hi The Aesthetic Junction, I've just sent a booking request via your website.\n\nName: ${bookingName}\nTreatment: ${bookingService.title}\nPreferred Date: ${bookingDate || 'Any'}\nPreferred Time: ${bookingTime || 'Any'}\nNotes: ${bookingNotes || 'None'}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 rounded-full bg-neutral-900 hover:bg-[#C5A059] text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Confirm On WhatsApp
                    </a>
                    
                    <button
                      onClick={() => setBookingService(null)}
                      className="w-full py-3 rounded-full border border-neutral-200 text-neutral-600 text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-50 transition-all cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
