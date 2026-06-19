import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { X, Download, Edit3 } from 'lucide-react';

export const STORAGE_KEY = 'swastik_portfolio_projects';
export const CATEGORIES_KEY = 'swastik_portfolio_categories';
const DEFAULT_CATEGORIES = ['Graphic Design', 'Branding', 'Illustration', 'Web Design'];

const loadCategories = () => {
  try { const s = localStorage.getItem(CATEGORIES_KEY); return s ? JSON.parse(s) : DEFAULT_CATEGORIES; }
  catch { return DEFAULT_CATEGORIES; }
};

// Deterministic seeded random (0–1) for a given integer seed
const rnd = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

// ─── Blank/Placeholder Card Generator ─────────────────────────────────────────
const makeBlankCards = () => {
  const blanks = [];
  const categories = ['Graphic Design', 'Branding', 'Illustration', 'Web Design'];
  const quotes = [
    { text: "Simplicity is the ultimate sophistication.", author: "L. da Vinci" },
    { text: "Design is intelligence made visible.", author: "Alina Wheeler" },
    { text: "Form follows function.", author: "Louis Sullivan" },
    { text: "Less is more.", author: "Mies van der Rohe" },
    { text: "Make it simple, but significant.", author: "Don Draper" },
    { text: "Design is not just what it looks like.", author: "Steve Jobs" },
    { text: "Detail is not a detail. It is design.", author: "Charles Eames" },
    { text: "Good design is as little design as possible.", author: "Dieter Rams" },
    { text: "Art is anything you can get away with.", author: "Andy Warhol" },
    { text: "Creative expression is a human necessity.", author: "Anonymous" },
  ];
  const words = ["PROCESS", "AESTHETIC", "CONCEPT", "STRUCTURE", "FLUIDITY", "BALANCE", "DIMENSION", "MINIMAL", "VOLUME", "REDUCTION"];

  for (let i = 0; i < 20; i++) {
    const category = categories[i % categories.length];
    blanks.push({
      id: `blank-${i}`,
      isBlank: true,
      category,
      title: `Composition #${100 + i}`,
      description: `A minimalist aesthetic study exploring grid structures, negative space, and contemporary design principles.`,
      quote: quotes[i % quotes.length],
      word: words[i % words.length],
      styleType: i % 4, // 0: quote, 1: line art, 2: sacred geometry, 3: technical coordinate
    });
  }
  return blanks;
};

export const defaultProjects = [
  ...makeBlankCards()
];

// ─── Blank/Placeholder Card Content Renderer ──────────────────────────────────
export const renderBlankCardContent = (project, isHovered, isDayMode) => {
  const type = project.styleType;
  const glowColor = isDayMode ? 'rgba(180,138,83,0.06)' : 'rgba(212,180,138,0.12)';
  const textColorMain = isDayMode ? 'rgba(30,20,10,0.85)' : 'rgba(245,240,230,0.95)';
  const textColorSub = isDayMode ? 'rgba(30,20,10,0.45)' : 'rgba(245,240,230,0.50)';
  const accentColor = isDayMode ? '#B48A53' : '#D4B48A';
  const borderColor = isDayMode ? 'rgba(180,138,83,0.20)' : 'rgba(212,180,138,0.30)';

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '16px 14px 14px',
      userSelect: 'none',
      pointerEvents: 'none',
    }}>
      {/* Night Background Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #101010 0%, #161210 50%, #1E1610 100%)',
        zIndex: -2,
        opacity: isDayMode ? 0 : 1,
        transition: 'opacity 1000ms ease-in-out',
        willChange: 'opacity',
      }} />

      {/* Day Background Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #FBFBF9 0%, #F5ECE0 60%, #EBDDCB 100%)',
        zIndex: -1,
        opacity: isDayMode ? 1 : 0,
        transition: 'opacity 1000ms ease-in-out',
        willChange: 'opacity',
      }} />

      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: glowColor,
        filter: 'blur(25px)',
        pointerEvents: 'none',
        transition: 'background 1000ms ease-in-out',
      }} />

      {type === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: accentColor, transition: 'background-color 1000ms ease-in-out' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
            <p style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '10.5px',
              fontStyle: 'italic',
              lineHeight: 1.45,
              textAlign: 'center',
              color: textColorMain,
              opacity: isHovered ? 1 : 0.85,
              transition: 'opacity 0.3s ease, color 1000ms ease-in-out',
            }}>
              "{project.quote.text}"
            </p>
          </div>
          <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '6.5px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textAlign: 'center',
            color: textColorSub,
            display: 'block',
            transition: 'color 1000ms ease-in-out',
          }}>
            — {project.quote.author}
          </span>
        </div>
      )}

      {type === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
          <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '6px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: textColorSub,
            transition: 'color 1000ms ease-in-out',
          }}>
            STUDIO EDITION
          </span>
          <div style={{ color: accentColor, opacity: isHovered ? 0.9 : 0.65, transition: 'opacity 0.3s ease, color 1000ms ease-in-out', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="44" height="44" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M20 80 L50 30 L80 80 Z" />
              <path d="M40 80 L55 55 L70 80" />
              <circle cx="75" cy="35" r="5" fill="none" />
            </svg>
          </div>
          <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '7.5px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontWeight: 500,
            color: textColorMain,
            transition: 'color 1000ms ease-in-out',
          }}>
            {project.word}
          </span>
        </div>
      )}

      {type === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
          <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '6px',
            letterSpacing: '0.15em',
            color: textColorSub,
            textAlign: 'center',
            transition: 'color 1000ms ease-in-out',
          }}>
            EST. 2026
          </span>
          <div style={{ color: textColorMain, opacity: isHovered ? 0.6 : 0.35, transition: 'opacity 0.3s ease, color 1000ms ease-in-out', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
              <circle cx="50" cy="50" r="30" />
              <circle cx="50" cy="50" r="20" />
              <circle cx="50" cy="50" r="10" />
              <line x1="50" y1="10" x2="50" y2="90" />
              <line x1="10" y1="50" x2="90" y2="50" />
              <line x1="21.7" y1="21.7" x2="78.3" y2="78.3" />
              <line x1="21.7" y1="78.3" x2="78.3" y2="21.7" />
            </svg>
          </div>
          <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '7.5px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontWeight: 500,
            color: accentColor,
            textAlign: 'center',
            transition: 'color 1000ms ease-in-out',
          }}>
            {project.word}
          </span>
        </div>
      )}

      {type === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
          <div style={{
            position: 'absolute',
            inset: '8px',
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            pointerEvents: 'none',
            transition: 'border-color 1000ms ease-in-out',
          }} />

          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            fontFamily: 'monospace',
            fontSize: '5.5px',
            color: textColorSub,
            transition: 'color 1000ms ease-in-out',
          }}>
            SYS.LOC // 4.01
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '8.5px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: textColorMain,
              transition: 'color 1000ms ease-in-out',
            }}>
              {project.word}
            </span>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '6px',
              letterSpacing: '0.05em',
              color: accentColor,
              transition: 'color 1000ms ease-in-out',
            }}>
              22.9784° N, 88.4382° E
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 12px', fontSize: '5.5px', fontFamily: 'monospace', color: textColorSub, transition: 'color 1000ms ease-in-out' }}>
            <span>SCALE 1:1</span>
            <span>GRID ACTIVE</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Dynamic strip generator ──────────────────────────────────────────────────
// STRIP_W scales with card count so more cards = denser coverage with no empty gaps.
const BASE_STRIP_W = 3200;
const CARD_SLOT_WIDTH = 300;   // px of extra strip per extra card

const makeStrip = (projects) => {
  if (!projects.length) return { strip: [], stripW: BASE_STRIP_W };

  const extraCards = projects.length;
  const stripW = BASE_STRIP_W + extraCards * CARD_SLOT_WIDTH;

  // ── Collision-aware grid with relaxation ──
  const ROWS = 4;
  const cellW = 240; // horizontal cell spacing
  const COLS = Math.ceil(stripW / cellW);

  // Vertical range covering screen height (just below selected work header to just above filter bar)
  const Y_MIN = -220;
  const Y_MAX = 260;
  const cellH = (Y_MAX - Y_MIN) / (ROWS - 1 || 1);

  const positions = [];
  let key = 0;

  // Generate initial positions in grid cells with seeded jitter
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const sX = key * 53 + row * 17 + 7;
      const sY = key * 79 + col * 31 + row * 11;
      const sZ = key * 67 + row * 23 + col * 13 + 3;
      const sSize = key * 29 + row * 13 + col * 7;

      // Card size variation
      const sizeVal = rnd(sSize);
      let aspect = 'portrait';
      let cardW = 124;
      let cardH = 176;
      if (sizeVal < 0.25) {
        aspect = 'square';
        cardW = 136;
        cardH = 136;
      } else if (sizeVal < 0.5) {
        aspect = 'large-portrait';
        cardW = 142;
        cardH = 202;
      } else if (sizeVal < 0.75) {
        aspect = 'medium-portrait';
        cardW = 130;
        cardH = 166;
      } else {
        aspect = 'wide';
        cardW = 156;
        cardH = 124;
      }

      // Initial center coordinates
      const centreX = (col + 0.5) * cellW;
      const centreY = Y_MIN + row * cellH;

      // Jitter within cell bounds
      const xJitter = (rnd(sX) - 0.5) * cellW * 0.7;
      const yJitter = (rnd(sY) - 0.5) * cellH * 0.6;

      const x = centreX + xJitter;
      const y = centreY + yJitter;

      // Z depth (-220 to +220)
      const zRaw = rnd(sZ);
      const z = Math.round((Math.sin(zRaw * Math.PI) * 0.6 + zRaw * 0.4) * 440 - 220);

      positions.push({
        x,
        y,
        z,
        cardW,
        cardH,
        aspect,
        key
      });
      key++;
    }
  }

  // Iterative 2D collision relaxation with horizontal wrapping
  const minGap = 26; // minimum spacing between cards in px
  const numIterations = 8;

  for (let iter = 0; iter < numIterations; iter++) {
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const p1 = positions[i];
        const p2 = positions[j];

        // Horizontal distance, considering wrapping
        let dx = p2.x - p1.x;
        dx = dx - Math.round(dx / stripW) * stripW; // wrap dx to [-stripW/2, stripW/2]

        const dy = p2.y - p1.y;

        // Target overlaps (half of widths/heights plus minGap)
        const targetXGap = (p1.cardW + p2.cardW) / 2 + minGap;
        const targetYGap = (p1.cardH + p2.cardH) / 2 + minGap;

        const overlapX = targetXGap - Math.abs(dx);
        const overlapY = targetYGap - Math.abs(dy);

        // If they overlap in both dimensions
        if (overlapX > 0 && overlapY > 0) {
          // Push apart along the axis of minimum overlap
          if (overlapX < overlapY) {
            const pushX = overlapX * 0.52 * Math.sign(dx || 1);
            p2.x += pushX;
            p1.x -= pushX;
          } else {
            const pushY = overlapY * 0.52 * Math.sign(dy || 1);
            p2.y = Math.max(Y_MIN, Math.min(Y_MAX, p2.y + pushY));
            p1.y = Math.max(Y_MIN, Math.min(Y_MAX, p1.y - pushY));
          }
        }
      }
    }
  }

  // Ensure all final X coordinates are wrapped nicely within [0, stripW]
  positions.forEach(pos => {
    pos.x = (pos.x % stripW + stripW) % stripW;
  });

  const strip = positions.map((pos) => ({
    ...pos,
    project: projects[pos.key % projects.length],
  }));

  return { strip, stripW };
};

/* ─── Projects Section ─────────────────────────────────────────────────────── */
const Projects = ({ isDayMode }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        const wasInitialized = localStorage.getItem('swastik_portfolio_blanks_initialized');
        if (!wasInitialized) {
          const blanks = makeBlankCards();
          const merged = [...parsed, ...blanks];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          localStorage.setItem('swastik_portfolio_blanks_initialized', 'true');
          return merged;
        }
        return parsed;
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
        localStorage.setItem('swastik_portfolio_blanks_initialized', 'true');
        return defaultProjects;
      }
    } catch {
      return defaultProjects;
    }
  });
  const [categories, setCategories] = useState(loadCategories);
  const [hoveredKey, setHoveredKey] = useState(null);

  useEffect(() => {
    const onStorage = () => {
      try {
        const sp = localStorage.getItem(STORAGE_KEY);
        if (sp) setProjects(JSON.parse(sp));
        const sc = localStorage.getItem(CATEGORIES_KEY);
        setCategories(sc ? JSON.parse(sc) : DEFAULT_CATEGORIES);
      } catch { }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  const filtered = activeCategory === 'All'
    ? projects
    : activeCategory === 'Graphic Design'
      ? projects.filter(p => ['Graphic Design', 'Invitation Cards', 'Posters', 'Instagram Story'].includes(p.category))
      : projects.filter(p => p.category === activeCategory);

  // Recompute strip whenever filtered projects change
  const { strip, stripW } = useMemo(() => makeStrip(filtered), [filtered]);

  // Design tokens
  const bg = isDayMode ? '#FAF8F5' : '#090909';
  const accent = isDayMode ? '#B48A53' : '#D4B48A';
  const labelColor = isDayMode ? 'text-zinc-950/60 font-semibold text-xs' : 'font-light text-xs text-[#D4B48A]/70';
  const dividerBg = isDayMode ? 'bg-[#B48A53]' : 'bg-[#D4B48A]/50';
  const dotColor = isDayMode ? '#B48A53' : '#D4B48A';

  // Animation refs
  const scrollContainerRef = useRef(null);
  const stripRef = useRef(null);
  const rafRef = useRef(null);
  const scrollXRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, cx: 0, cy: 0 });
  const breatheRef = useRef(0);
  // Track which uid is currently hovered so RAF can slow down
  const hoveredUidRef = useRef(null);
  const prefersReduced = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  // Keep a live reference to stripW for RAF (avoids stale closure)
  const stripWRef = useRef(stripW);
  useEffect(() => { stripWRef.current = stripW; }, [stripW]);

  useEffect(() => {
    const outer = scrollContainerRef.current;
    const inner = stripRef.current;
    if (!outer || !inner) return;

    const onMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const SPEED = 0.88; // px per frame (~53px/sec at 60fps)

    const tick = () => {
      const m = mouseRef.current;
      m.cx += (m.x - m.cx) * 0.055;
      m.cy += (m.y - m.cy) * 0.055;

      if (!prefersReduced.current) {
        const speed = hoveredUidRef.current ? SPEED * 0.15 : SPEED;
        scrollXRef.current += speed;
        if (scrollXRef.current >= stripWRef.current) {
          scrollXRef.current -= stripWRef.current;
        }
      }

      if (!prefersReduced.current) breatheRef.current += 0.0022;
      const dolly = Math.sin(breatheRef.current) * 50;
      const rotX = m.cy * -3.5;
      const rotY = m.cx * 3.5;
      const transX = m.cx * 24;
      const transY = m.cy * 16;

      outer.style.transform =
        `translate3d(${transX}px, ${transY}px, ${dolly}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      inner.style.transform = `translateX(${-scrollXRef.current}px)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // ── Card renderer for one tile of the infinite strip ─────────────────────────
  const renderStrip = (tileOffsetX = 0, keyPrefix = 'a') =>
    strip.map(({ x, y, z, cardW, cardH, project, key }) => {
      const uid = `${keyPrefix}-${key}`;
      const isHovered = hoveredKey === uid;

      // depth factor 0→1 (z ranges from -220 to +220)
      const depthFactor = (z + 220) / 440;

      // ALL cards are fully interactive regardless of depth.
      const baseZIndex = Math.round(100 + z);           // -120 → 320
      const effectiveZ = isHovered ? 999 : baseZIndex;

      const baseOpacity = 0.55 + depthFactor * 0.45;     // 0.55 → 1.0
      const shadowBlur = isHovered ? 45 : 16 + depthFactor * 24;
      const shadowAlpha = isHovered ? 0.65 : 0.20 + depthFactor * 0.20;
      const shadow = isHovered
        ? (isDayMode
          ? '0 15px 30px rgba(180,138,83,0.15), 0 0 30px rgba(180,138,83,0.25)'
          : '0 20px 45px rgba(0,0,0,0.65), 0 0 40px rgba(212,180,138,0.55)')
        : (isDayMode
          ? `${8}px ${12}px ${12 + depthFactor * 16}px rgba(180,138,83,${0.06 + depthFactor * 0.08})`
          : `${10}px ${14}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha})`);

      const driftIdx = key % 6;
      const driftDur = 4.5 + rnd(key * 7) * 3.5;
      const driftDelay = (rnd(key * 11) * -7).toFixed(2);

      return (
        <div
          key={uid}
          role="button"
          tabIndex={0}
          aria-label={`View project: ${project.title}`}
          onClick={() => setSelectedProject(project)}
          onMouseEnter={() => { setHoveredKey(uid); hoveredUidRef.current = uid; }}
          onMouseLeave={() => { setHoveredKey(null); hoveredUidRef.current = null; }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedProject(project); }}
          style={{
            position: 'absolute',
            left: tileOffsetX + x,
            top: '50%',
            marginTop: y,
            transform: `translate3d(0, -50%, ${z}px) ${isHovered ? 'scale(1.12) translateY(calc(-50% - 16px))' : 'scale(1) translateY(-50%)'}`,
            width: cardW,
            height: cardH,
            borderRadius: 13,
            overflow: 'hidden',
            cursor: 'pointer',
            pointerEvents: 'auto',
            zIndex: effectiveZ,
            willChange: 'transform, opacity, box-shadow',
            transition: isHovered
              ? 'transform 0.36s cubic-bezier(0.22,1,0.36,1), box-shadow 0.30s ease, border-color 0.25s ease, opacity 0.28s ease, background-color 1000ms ease-in-out'
              : 'transform 0.55s cubic-bezier(0.25,1,0.5,1), box-shadow 0.50s ease, border-color 1000ms ease-in-out, opacity 0.40s ease, background-color 1000ms ease-in-out',
            boxShadow: shadow,
            opacity: isHovered ? 1 : baseOpacity,
            borderWidth: isHovered ? 1.5 : 1,
            borderStyle: 'solid',
            borderColor: isHovered
              ? (isDayMode ? 'rgba(180,138,83,0.80)' : 'rgba(212,180,138,0.80)')
              : (isDayMode ? 'rgba(180,138,83,0.20)' : 'rgba(212,180,138,0.30)'),
            backgroundColor: isDayMode ? 'rgba(255,255,255,0.75)' : 'rgba(20,20,20,0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            animation: `wallDrift-${driftIdx} ${driftDur}s ease-in-out ${driftDelay}s infinite alternate`,
            outline: 'none',
          }}
        >
          {project.isBlank ? (
            renderBlankCardContent(project, isHovered, isDayMode)
          ) : (
            <>
              <img
                src={project.image}
                alt={project.title}
                draggable="false"
                loading="lazy"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                  transition: 'transform 0.55s ease',
                  transform: isHovered ? 'scale(1.07)' : 'scale(1)',
                  pointerEvents: 'none',
                }}
              />

              {/* Depth-aware gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: isHovered
                  ? (isDayMode
                    ? 'linear-gradient(to top, rgba(30,20,10,0.80) 0%, rgba(30,20,10,0.15) 55%, transparent 100%)'
                    : 'linear-gradient(to top, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)')
                  : (isDayMode
                    ? `linear-gradient(to top, rgba(30,20,10,${0.25 + (1 - depthFactor) * 0.15}) 0%, transparent 60%)`
                    : `linear-gradient(to top, rgba(0,0,0,${0.2 + (1 - depthFactor) * 0.15}) 0%, transparent 60%)`),
                transition: 'background 0.35s ease',
                pointerEvents: 'none',
              }} />

              {/* Hover label — slides up on enter */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '10px 10px 8px',
                transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                opacity: isHovered ? 1 : 0,
                transition: 'transform 0.33s ease, opacity 0.30s ease',
                pointerEvents: 'none',
              }}>
                <span style={{ fontSize: '7px', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, display: 'block', marginBottom: '3px' }}>
                  {project.category}
                </span>
                <span style={{ fontSize: '10px', fontFamily: 'Playfair Display, Georgia, serif', color: '#fff', fontWeight: 600, lineHeight: 1.25, display: 'block' }}>
                  {project.title}
                </span>
              </div>
            </>
          )}
        </div>
      );
    });

  return (
    <section
      id="projects"
      className="w-full min-h-screen relative overflow-hidden flex flex-col transition-colors duration-1000 ease-in-out"
      style={{ background: bg }}
    >
      {/* Ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none z-0" style={{
        background: isDayMode
          ? 'radial-gradient(circle, rgba(180,138,83,0.03) 0%, transparent 75%)'
          : 'radial-gradient(circle, rgba(212,180,138,0.06) 0%, transparent 75%)',
      }} />

      {/* Dot corner accents */}
      <div className="absolute left-0 bottom-24 w-40 h-40 opacity-[0.09] pointer-events-none z-0" style={{ color: dotColor }}>
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
          <pattern id="pd1" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" /></pattern>
          <rect width="100" height="100" fill="url(#pd1)" />
        </svg>
      </div>
      <div className="absolute right-0 top-20 w-32 h-32 opacity-[0.06] pointer-events-none z-0" style={{ color: dotColor }}>
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
          <pattern id="pd2" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" /></pattern>
          <rect width="100" height="100" fill="url(#pd2)" />
        </svg>
      </div>

      {/* ── Section label ── */}
      <div className="w-full max-w-6xl mx-auto relative z-30 px-6 sm:px-12 lg:px-20 pt-20 pb-4 pointer-events-none flex-shrink-0">
        <div className="w-full text-left">
          <span className={`font-montserrat text-xs tracking-[0.3em] uppercase block mb-2 transition-colors duration-1000 ${labelColor}`}>
            SELECTED WORK
          </span>
          <div className={`w-12 h-[1px] transition-colors duration-1000 ${dividerBg}`} />
        </div>
      </div>

      {/* ── 3D scene (full-bleed) ── */}
      <div
        className="relative flex-1 z-10"
        style={{
          perspective: '1100px',
          perspectiveOrigin: '50% 50%',
          minHeight: '580px',
          overflow: 'hidden',
        }}
      >
        {/* Camera node — receives mouse tilt + breathe dolly */}
        <div
          ref={scrollContainerRef}
          style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}
        >
          {/* Scroll strip — 2× stripW wide for seamless loop */}
          <div
            ref={stripRef}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: stripW * 2, height: '100%',
              transformStyle: 'preserve-3d',
            }}
          >
            {renderStrip(0, 'a')}
            {renderStrip(stripW, 'b')}
          </div>
        </div>

        {/* Edge fades — sit above cards, below modals */}
        {/* Day Edge Fades */}
        <div className="absolute inset-y-0 left-0 w-28 z-30 pointer-events-none transition-opacity duration-1000 ease-in-out" style={{
          background: 'linear-gradient(to right, #FAF8F5 0%, transparent 100%)',
          opacity: isDayMode ? 1 : 0,
          willChange: 'opacity',
        }} />
        <div className="absolute inset-y-0 right-0 w-28 z-30 pointer-events-none transition-opacity duration-1000 ease-in-out" style={{
          background: 'linear-gradient(to left, #FAF8F5 0%, transparent 100%)',
          opacity: isDayMode ? 1 : 0,
          willChange: 'opacity',
        }} />

        {/* Night Edge Fades */}
        <div className="absolute inset-y-0 left-0 w-28 z-30 pointer-events-none transition-opacity duration-1000 ease-in-out" style={{
          background: 'linear-gradient(to right, #090909 0%, transparent 100%)',
          opacity: isDayMode ? 0 : 1,
          willChange: 'opacity',
        }} />
        <div className="absolute inset-y-0 right-0 w-28 z-30 pointer-events-none transition-opacity duration-1000 ease-in-out" style={{
          background: 'linear-gradient(to left, #090909 0%, transparent 100%)',
          opacity: isDayMode ? 0 : 1,
          willChange: 'opacity',
        }} />

        {/* ── Floating glassmorphism filter pill bar — bottom-centre of scene ── */}
        <div
          className="absolute bottom-6 left-1/2 z-40"
          style={{ transform: 'translateX(-50%)', pointerEvents: 'auto' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 8px',
              borderRadius: '999px',
              background: isDayMode ? 'rgba(250,248,245,0.84)' : 'rgba(9,9,9,0.80)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: isDayMode ? '1px solid rgba(180,138,83,0.20)' : '1px solid rgba(212,180,138,0.15)',
              boxShadow: isDayMode
                ? '0 8px 32px rgba(0,0,0,0.10), 0 0 0 1px rgba(180,138,83,0.06)'
                : '0 8px 40px rgba(0,0,0,0.60), 0 0 0 1px rgba(212,180,138,0.05)',
              transition: 'background 0.8s ease, border-color 0.8s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {/* Divider label */}
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '7.5px',
              letterSpacing: '0.30em',
              textTransform: 'uppercase',
              color: isDayMode ? 'rgba(180,138,83,0.55)' : 'rgba(212,180,138,0.45)',
              paddingRight: '8px',
              borderRight: isDayMode ? '1px solid rgba(180,138,83,0.18)' : '1px solid rgba(212,180,138,0.12)',
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: isDayMode ? '#B48A53' : '#D4B48A', opacity: 0.7, display: 'inline-block' }} />
              Filter
            </span>

            {['All', ...categories].map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    position: 'relative',
                    padding: '5px 14px',
                    borderRadius: '999px',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    border: 'none',
                    outline: 'none',
                    transition: 'all 0.28s cubic-bezier(0.25,1,0.5,1)',
                    background: isActive
                      ? isDayMode ? '#B48A53' : '#D4B48A'
                      : 'transparent',
                    color: isActive
                      ? '#080808'
                      : isDayMode ? 'rgba(30,20,10,0.68)' : 'rgba(232,217,197,0.50)',
                    boxShadow: isActive
                      ? isDayMode ? '0 0 14px rgba(180,138,83,0.40)' : '0 0 14px rgba(212,180,138,0.32)'
                      : 'none',
                    transform: isActive ? 'scale(1.03)' : 'scale(1)',
                    userSelect: 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = isDayMode ? 'rgba(30,20,10,0.95)' : 'rgba(232,217,197,0.90)';
                      e.currentTarget.style.background = isDayMode ? 'rgba(180,138,83,0.08)' : 'rgba(212,180,138,0.10)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = isDayMode ? 'rgba(30,20,10,0.68)' : 'rgba(232,217,197,0.50)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal portal */}
      {selectedProject && ReactDOM.createPortal(
        <ProjectModal project={selectedProject} isDayMode={isDayMode} onClose={() => setSelectedProject(null)} />,
        document.body
      )}

      {/* CSS drift keyframes */}
      <style>{`
        @keyframes wallDrift-0 { from { translate: 0px 0px; } to { translate:  4px -5px; } }
        @keyframes wallDrift-1 { from { translate: 0px 0px; } to { translate: -5px  4px; } }
        @keyframes wallDrift-2 { from { translate: 0px 0px; } to { translate:  3px  6px; } }
        @keyframes wallDrift-3 { from { translate: 0px 0px; } to { translate: -4px -4px; } }
        @keyframes wallDrift-4 { from { translate: 0px 0px; } to { translate:  6px  2px; } }
        @keyframes wallDrift-5 { from { translate: 0px 0px; } to { translate: -3px  5px; } }
      `}</style>
    </section>
  );
};

/* ─── Detail Modal ─────────────────────────────────────────────────────────── */
const ProjectModal = ({ project, isDayMode, onClose }) => {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const cardBg = isDayMode ? '#FFFFFF' : '#090909';
  const infoBg = isDayMode ? '#FAF8F5' : '#0d0d0d';
  const txtMain = isDayMode ? '#1a1a1a' : '#FFFFFF';
  const txtSub = isDayMode ? '#555' : '#B8B8B8';
  const cat = isDayMode ? '#B48A53' : '#D4B48A';
  const bdr = isDayMode ? 'rgba(180,138,83,0.2)' : 'rgba(212,180,138,0.18)';
  const btnBdr = isDayMode ? 'rgba(180,138,83,0.5)' : '#D4B48A';
  const btnBg = isDayMode ? 'rgba(180,138,83,0.08)' : 'rgba(212,180,138,0.08)';
  const btnTxt = isDayMode ? '#B48A53' : '#D4B48A';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ animation: 'fadeInBackdrop 0.3s ease forwards' }}>
      <div
        className={`absolute inset-0 backdrop-blur-md ${isDayMode ? 'bg-[#FAF8F5]/75' : 'bg-[#090909]/88'}`}
        onClick={onClose}
      />
      <div
        className="relative z-10 flex flex-col md:flex-row rounded-2xl overflow-hidden"
        style={{
          width: 'min(92vw, 880px)', maxHeight: '88vh',
          border: `1px solid ${bdr}`, background: cardBg,
          boxShadow: isDayMode
            ? '0 40px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(180,138,83,0.08)'
            : '0 40px 80px rgba(0,0,0,0.7), 0 0 35px rgba(212,180,138,0.06)',
          animation: 'popupOpen 0.52s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full transition-all duration-300"
          style={{ border: `1px solid ${bdr}`, background: isDayMode ? 'rgba(255,255,255,0.8)' : 'rgba(9,9,9,0.7)', color: txtMain }}
          aria-label="Close"
          onMouseEnter={e => { e.currentTarget.style.background = isDayMode ? '#B48A53' : '#D4B48A'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = 'transparent'; }}
          onMouseLeave={e => { e.currentTarget.style.background = isDayMode ? 'rgba(255,255,255,0.8)' : 'rgba(9,9,9,0.7)'; e.currentTarget.style.color = txtMain; e.currentTarget.style.borderColor = bdr; }}
        >
          <X className="w-4 h-4" />
        </button>
        {project.isBlank ? (
          <div className="modal-img-panel" style={{ minHeight: '300px' }}>
            {renderBlankCardContent(project, true, isDayMode)}
          </div>
        ) : (
          <div className="modal-img-panel" style={{ background: isDayMode ? '#FAF8F5' : '#0d0d0d' }}>
            <img src={project.image} alt={project.title} />
          </div>
        )}
        <div className="modal-info-panel" style={{ background: infoBg }}>
          <span className="font-montserrat text-xs tracking-[0.3em] uppercase mb-3 block font-medium" style={{ color: cat }}>{project.category}</span>
          <h3 className="font-serif-about text-3xl sm:text-4xl font-semibold tracking-wide mb-4 leading-tight" style={{ color: txtMain }}>{project.title}</h3>
          <div className="w-12 h-[1px] mb-6" style={{ background: isDayMode ? 'rgba(180,138,83,0.5)' : 'rgba(212,180,138,0.4)' }} />
          <p className="font-montserrat font-light text-sm sm:text-base leading-relaxed mb-8 max-w-[360px]" style={{ color: txtSub }}>{project.description}</p>
          {project.isBlank ? (
            <a
              href={`mailto:swastikpoddar11@gmail.com?subject=Inquiry about ${project.title}`}
              className="inline-flex items-center gap-2.5 rounded-full font-montserrat font-medium text-xs sm:text-sm tracking-widest uppercase transition-all duration-300"
              style={{ padding: '0.85rem 2rem', border: `1px solid ${btnBdr}`, background: btnBg, color: btnTxt, boxShadow: `0 0 15px ${isDayMode ? 'rgba(180,138,83,0.12)' : 'rgba(212,180,138,0.12)'}`, alignSelf: 'flex-start' }}
              onMouseEnter={e => { e.currentTarget.style.background = isDayMode ? '#B48A53' : '#D4B48A'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = `0 0 20px ${isDayMode ? 'rgba(180,138,83,0.35)' : 'rgba(212,180,138,0.35)'}`; }}
              onMouseLeave={e => { e.currentTarget.style.background = btnBg; e.currentTarget.style.color = btnTxt; e.currentTarget.style.borderColor = btnBdr; e.currentTarget.style.boxShadow = `0 0 15px ${isDayMode ? 'rgba(180,138,83,0.12)' : 'rgba(212,180,138,0.12)'}`; }}
            >
              <Edit3 className="w-4 h-4" />
              <span>Inquire about style</span>
            </a>
          ) : (
            <a
              href={project.downloadUrl || '#'} download
              className="inline-flex items-center gap-2.5 rounded-full font-montserrat font-medium text-xs sm:text-sm tracking-widest uppercase transition-all duration-300"
              style={{ padding: '0.85rem 2rem', border: `1px solid ${btnBdr}`, background: btnBg, color: btnTxt, boxShadow: `0 0 15px ${isDayMode ? 'rgba(180,138,83,0.12)' : 'rgba(212,180,138,0.12)'}`, alignSelf: 'flex-start' }}
              onMouseEnter={e => { e.currentTarget.style.background = isDayMode ? '#B48A53' : '#D4B48A'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = `0 0 20px ${isDayMode ? 'rgba(180,138,83,0.35)' : 'rgba(212,180,138,0.35)'}`; }}
              onMouseLeave={e => { e.currentTarget.style.background = btnBg; e.currentTarget.style.color = btnTxt; e.currentTarget.style.borderColor = btnBdr; e.currentTarget.style.boxShadow = `0 0 15px ${isDayMode ? 'rgba(180,138,83,0.12)' : 'rgba(212,180,138,0.12)'}`; }}
            >
              <Download className="w-4 h-4" />
              <span>Download this design</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
