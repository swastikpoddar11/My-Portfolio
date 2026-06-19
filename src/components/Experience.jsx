import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Trophy, Calendar } from 'lucide-react';
import portfolioData from '../data/portfolio_data.json';

export const defaultExperiences = portfolioData.experiences || [
  {
    id: 1,
    role: 'Data & Insights Intern',
    company: 'Tapnex (NextGen Payments)',
    duration: 'Jul 2025 – Present',
    description: 'Analyzed transaction and customer data using Excel, SQL, and Python to identify business insights and trends. Built interactive dashboards and reports to support data-driven decision-making. Developed SQL queries for data extraction, transformation, and reporting workflows, while collaborating with cross-functional teams to improve campaign tracking and performance analysis.',
    tags: ['SQL', 'Python', 'Excel', 'Analytics'],
    category: 'Experience'
  },
  {
    id: 2,
    role: 'Graphic Designing Intern',
    company: 'Koios Studios',
    duration: 'Apr 2026 – Present',
    description: 'Designed branding assets, social media creatives, and promotional materials for campaigns and digital outreach. Collaborated with creative teams on visual storytelling and brand identity development. Assisted in campaign presentation design and audience engagement strategies, and contributed to content creation workflows for online marketing initiatives.',
    tags: ['Branding', 'Visuals', 'Digital Art'],
    category: 'Experience'
  },
  {
    id: 3,
    role: 'Graphic Design Intern',
    company: 'Praxto Designs',
    duration: 'Jun 2026 – Present',
    description: 'Designed social media creatives, branding assets, and promotional materials for clients across multiple domains. Collaborated with design teams to maintain visual consistency and brand identity. Created digital content for marketing campaigns, presentations, and online engagement initiatives, and worked closely with stakeholders to align deliverables.',
    tags: ['Graphic Design', 'Figma', 'Marketing'],
    category: 'Experience'
  },
  {
    id: 4,
    role: 'Design Lead',
    company: 'FOSS Club',
    duration: 'Dec 2024 – Present',
    description: 'Led branding and visual identity design for hackathons, workshops, and technical events. Designed posters, banners, reels, and social media creatives for digital campaigns. Coordinated promotional activities and content strategies to increase audience engagement, while managing collaboration between creative and organizing teams for smooth execution.',
    tags: ['Leadership', 'Branding', 'FOSS'],
    category: 'Activity'
  },
  {
    id: 5,
    role: 'Treasurer & Head of Operations',
    company: 'Tech Council – FET',
    duration: 'Jun 2026 – Present',
    description: 'Oversee operational planning and execution of technical events, workshops, and student initiatives. Manage budgeting, expense tracking, and financial coordination for council activities. Coordinate logistics to ensure smooth execution of programs, while leading collaboration between technical, creative, and organizing teams to improve workflow efficiency.',
    tags: ['Operations', 'Budgeting', 'Logistics'],
    category: 'Activity'
  },
  {
    id: 6,
    role: 'Tech Council Member & Designer',
    company: 'Tech Council – FET',
    duration: 'Jun 2024 – May 2026',
    description: 'Assisted in organizing technical events, student engagement activities, and departmental initiatives. Designed branding assets, posters, and digital creatives for council-led programs. Supported planning, communication, and execution of student-focused events, working closely with council leadership and volunteers.',
    tags: ['Design', 'FET', 'Event Planning'],
    category: 'Activity'
  },
  {
    id: 7,
    role: 'Member',
    company: 'Alumni Affairs & Outreach',
    duration: 'Aug 2024 – Present',
    description: 'Contributed to alumni engagement campaigns, outreach initiatives, and networking activities. Assisted in communication workflows, event coordination, and audience interaction. Supported branding and digital promotional activities for outreach programs, strengthening connections and relations across the graduate network.',
    tags: ['Outreach', 'Engagement', 'Branding'],
    category: 'Activity'
  },
  {
    id: 8,
    role: 'Organizing Core Team Member',
    company: 'Inceptrix 2025 Hackathon',
    duration: 'Jan 2025',
    description: 'Managed branding, participant engagement, and event coordination for a pan-India hackathon. Assisted in logistics, audience management, and promotional operations for over 100 participants. Coordinated closely with organizing teams and coordinators to ensure smooth execution of hackathon activities.',
    tags: ['Hackathon', 'Operations', 'Management'],
    category: 'Activity'
  },
  {
    id: 9,
    role: 'Organizing Team Member',
    company: 'Inceptrix 2026 Hackathon',
    duration: 'Jan 2026',
    description: 'Assisted in promotions, participant communication, and event management activities. Supported outreach campaigns, technical sessions, and audience engagement initiatives. Collaborated with organizing teams to streamline execution and enhance the overall participant experience.',
    tags: ['Hackathon', 'Outreach', 'Logistics'],
    category: 'Activity'
  },
  {
    id: 10,
    role: 'Designer',
    company: 'CRCE Cell',
    duration: 'Jul 2024 – Present',
    description: 'Created social media creatives, posters, and branding materials for technical and cultural events. Assisted in digital outreach campaigns and promotional strategy execution. Collaborated with coordinators to design high-impact visual communications that drove engagement.',
    tags: ['Design', 'CRCE', 'Promotions'],
    category: 'Activity'
  }
];

const Experience = ({ isDayMode }) => {
  const [experiences, setExperiences] = useState(() => {
    try {
      const s = localStorage.getItem('swastik_portfolio_experiences');
      if (s) {
        return JSON.parse(s);
      } else {
        localStorage.setItem('swastik_portfolio_experiences', JSON.stringify(defaultExperiences));
        return defaultExperiences;
      }
    } catch {
      return defaultExperiences;
    }
  });

  useEffect(() => {
    const onStorage = () => {
      try {
        const se = localStorage.getItem('swastik_portfolio_experiences');
        if (se) setExperiences(JSON.parse(se));
      } catch { }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const [animationStatus, setAnimationStatus] = useState('stacked'); // 'stacked' | 'fanning' | 'scrolling'
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  // IntersectionObserver to auto-trigger fanning when fully entered, and stack back when leaving
  useEffect(() => {
    const thresholdVal = 0.5;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= thresholdVal) {
          setAnimationStatus(prev => {
            if (prev === 'stacked') return 'fanning';
            return prev;
          });
        } else if (entry.intersectionRatio < thresholdVal) {
          setAnimationStatus('stacked');
        }
      },
      {
        threshold: [0.05, thresholdVal]
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [windowWidth]);

  // Handle fanning -> scrolling state transition
  useEffect(() => {
    if (animationStatus === 'fanning') {
      const timer = setTimeout(() => {
        setAnimationStatus('scrolling');
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [animationStatus]);

  // requestAnimationFrame scrolling loop
  useEffect(() => {
    if (animationStatus !== 'scrolling' || !trackRef.current) {
      return;
    }

    const track = trackRef.current;
    const originalWidth = track.scrollWidth / 2;

    let pos = 0;
    let animationId = null;
    let isPaused = false;

    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };

    track.addEventListener('mouseenter', handleMouseEnter);
    track.addEventListener('mouseleave', handleMouseLeave);

    const tick = () => {
      if (!isPaused) {
        pos -= 1.2; // Speed from prompt
        if (Math.abs(pos) >= originalWidth) {
          pos = 0;
        }
        track.style.transform = `rotate(4deg) translate3d(${pos}px, 0, 0)`;
      }
      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      track.removeEventListener('mouseenter', handleMouseEnter);
      track.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [animationStatus]);

  // Handle window resizing dynamically
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dimensions & fanning parameters
  let cardWidth = 410;
  let cardHeight = 540;
  let dx = 330;       // Horizontal spacing (wider to prevent identical duplicate cards on screen at once)
  let gapSize = 80;   // Expansion gap around selected card

  if (windowWidth < 640) {
    // Mobile
    cardWidth = 270;
    cardHeight = 350;
    dx = 175;
    gapSize = 40;
  } else if (windowWidth < 1024) {
    // Tablet
    cardWidth = 340;
    cardHeight = 440;
    dx = 250;
    gapSize = 60;
  }

  const N = experiences.length || 1;
  // Double data to create a seamless infinite loop marquee
  const doubleFolderData = [...experiences, ...experiences];

  const containerWidth = Math.min(windowWidth, 1152);
  const centerTranslateX = (containerWidth - cardWidth) / 2;

  // Track Dimensions
  const deckHeight = cardHeight + 60; // Extra room for vertical bouncy transforms
  const trackWidth = 2 * N * dx + cardWidth + gapSize * 2;

  // Day/Night style tokens matching AboutMe
  const labelColor = isDayMode ? 'text-zinc-950/60 font-semibold text-xs' : 'font-light text-xs text-[#D4B48A]/70';
  const dividerBg = isDayMode ? 'bg-[#B48A53]' : 'bg-[#D4B48A]/50';
  const accentColor = isDayMode ? '#B48A53' : '#D4B48A';
  const glowColor = isDayMode
    ? 'radial-gradient(circle, rgba(180,138,83,0.03) 0%, rgba(0,0,0,0) 75%)'
    : 'radial-gradient(circle, rgba(212,180,138,0.06) 0%, rgba(0,0,0,0) 75%)';
  const dotColor = isDayMode ? '#B48A53' : '#D4B48A';

  return (
    <section
      ref={sectionRef}
      id="experience"
      className={`w-full min-h-screen lg:h-screen lg:min-h-0 relative overflow-hidden flex flex-col px-6 sm:px-12 lg:px-20 transition-colors duration-1000 ease-in-out ${isDayMode ? 'bg-[#FAF8F5]' : 'bg-[#090909]'
        }`}
    >
      {/* Ambient spotlights */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none z-0 transition-opacity duration-1000"
        style={{ background: glowColor }}
      />

      <div
        className="absolute right-6 top-16 w-32 h-32 opacity-[0.05] pointer-events-none z-0 transition-colors duration-1000"
        style={{ color: dotColor }}
      >
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
          <pattern id="exp-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#exp-dots)" />
        </svg>
      </div>

      {/* Main Content Layout */}
      <div className="w-full max-w-6xl mx-auto flex flex-col justify-between h-full z-10 relative">

        {/* Title */}
        <div className="w-full text-left pt-20 flex-shrink-0 relative">
          <span className={`font-montserrat text-xs tracking-[0.3em] uppercase block mb-2 transition-colors duration-1000 ${labelColor}`}>
            EXPERIENCE & ACTIVITIES
          </span>
          <div className={`w-12 h-[1px] transition-colors duration-1000 ${dividerBg}`} />

          {/* Handwritten Note and Arrow */}
          <div className={`absolute right-4 top-16 font-handwritten text-2xl select-none pointer-events-none hidden md:flex flex-col items-center rotate-[-6deg] z-20 transition-colors duration-1000 ${isDayMode ? 'text-[#B48A53] font-semibold' : 'text-[#D4B48A]'
            }`}>
            <span className="tracking-wide drop-shadow-md">Hover cards to align!</span>
            <svg className="w-12 h-10 -mt-1 drop-shadow-md" viewBox="0 0 50 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12,5 C18,14 24,22 40,29" />
              <path d="M34,30 L40,29 L38,22" />
            </svg>
          </div>
        </div>

        {/* Diagonal Scrolling Marquee Track Container */}
        <div
          className="flex-1 flex items-center justify-center overflow-visible py-4 min-h-0"
          style={{ transform: 'translateY(40px)' }}
        >
          <div
            className="w-full overflow-visible px-4 -mx-4 sm:-mx-8 sm:px-8 md:mx-0 md:px-0 flex justify-start lg:justify-start items-center"
            style={{ perspective: '1200px' }}
          >
            <div
              ref={trackRef}
              style={{
                position: 'relative',
                display: 'flex',
                width: `${trackWidth}px`,
                height: `${deckHeight}px`,
                // Smooth return to base translation on reset (when leaving scrolling mode)
                transition: animationStatus !== 'scrolling' ? 'transform 1.0s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                // Remove inline transform when scrolling to let JS requestAnimationFrame ticker control it
                transform: animationStatus === 'scrolling' ? undefined : 'rotate(4deg) translate3d(0, 0, 0)',
                transformStyle: 'preserve-3d',
              }}
            >
              {doubleFolderData.map((item, i) => {
                const relativeIndex = i % N;
                const isSecondSet = i >= N;

                // Stacked location: Set 1 cards stack in Set 1 center, Set 2 cards in Set 2 center
                const stackedTranslateX = centerTranslateX + (isSecondSet ? N * dx : 0);

                // Fanned base coordinates along the rotated X-axis
                const fannedTranslateX = i * dx;

                const isStacked = animationStatus === 'stacked';
                let targetX = isStacked ? stackedTranslateX : fannedTranslateX;
                let targetY = 0; // Handled by rotation
                let zIndex = 10 + i; // Monotonically increasing z-index so cards on the right overlap cards on the left
                let scale = 1;

                // Interactive shifts during fanned / scrolling modes
                if (!isStacked) {
                  // Hover gets highest depth & scale
                  if (relativeIndex === hoveredIndex) {
                    targetY -= 12;
                    zIndex = 110;
                    scale = 1.05;
                  }
                }

                // Card styling
                const isHovered = relativeIndex === hoveredIndex;

                // Straight card when hovered, else slanted
                const isStraight = !isStacked && isHovered;
                const cardRotation = isStraight ? -4 : -10;
                const rotY = isStraight ? 0 : 35; // 35deg 3D tilt facing right when not hovered

                // Background: clean white in day mode, dark black in night mode (glassmorphic)
                const cardBg = isDayMode ? 'bg-[#FFFFFF]/75 backdrop-blur-md' : 'bg-[#141414]/75 backdrop-blur-md';

                // Subtle outlines
                let borderCol = isDayMode ? 'border-[#B48A53]/15' : 'border-[#D4B48A]/15';
                let glowStyle = {
                  boxShadow: isDayMode
                    ? '0 8px 32px rgba(180,138,83,0.05)'
                    : '0 8px 32px rgba(0,0,0,0.37)'
                };

                // Hovered card becomes popped out with full border and intense gold/bronze glow
                if (isHovered) {
                  borderCol = isDayMode ? 'border-[#B48A53]/80' : 'border-[#D4B48A]/80';
                  glowStyle = {
                    backgroundColor: isDayMode ? 'rgba(255, 255, 255, 0.90)' : 'rgba(20, 20, 20, 0.90)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: isDayMode
                      ? '0 20px 50px rgba(180,138,83,0.25)'
                      : '0 20px 50px rgba(212,180,138,0.35)'
                  };
                }

                // Text colors
                const textColor = isDayMode ? 'text-zinc-900' : 'text-zinc-100';
                const textOpacity = isHovered ? 'opacity-100' : 'opacity-85';

                return (
                  <div
                    key={`${item.id}-${i}`}
                    onMouseEnter={() => setHoveredIndex(relativeIndex)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`absolute rounded-2xl border p-6 sm:p-8 flex flex-col justify-between select-none cursor-pointer transition-all duration-300 ${cardBg} ${borderCol} ${textColor}`}
                    style={{
                      left: 0,
                      top: 0,
                      width: `${cardWidth}px`,
                      height: `${cardHeight}px`,
                      zIndex: zIndex,
                      // Dynamic translation, rotated straight when active/hovered else slanted, and bouncy scale
                      transform: `translate3d(${targetX}px, ${targetY}px, 0) rotate(${cardRotation}deg) rotateY(${rotY}deg) scale(${scale})`,
                      // Spring-like transition on click/hover for beautiful responsive selection animation
                      transition: 'transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s, border-color 0.4s, background-color 0.4s',
                      willChange: 'transform',
                      ...glowStyle
                    }}
                  >
                    {/* Card Content Body */}
                    <div className="flex flex-col justify-between h-full w-full gap-4">
                      {/* Header: Category & Duration & Index */}
                      <div className="flex items-center justify-between pb-1">
                        <div className="flex items-center gap-2">
                          {item.category === 'Experience' ? (
                            <Briefcase className="w-4 h-4 opacity-70" style={{ color: accentColor }} />
                          ) : (
                            <Trophy className="w-4 h-4 opacity-70" style={{ color: accentColor }} />
                          )}
                          <span className="font-montserrat font-medium text-[9px] sm:text-[11px] tracking-[0.15em] uppercase opacity-80">
                            {item.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 opacity-60 font-montserrat font-light text-[9px] sm:text-[11px] tracking-wide">
                            <span>{item.duration}</span>
                          </div>
                          <span className="font-mono text-[10px] sm:text-[12px] opacity-45 font-bold tracking-wider">
                            {`0${relativeIndex + 1}`}
                          </span>
                        </div>
                      </div>

                      {/* Role & Company */}
                      <div className="text-left">
                        <h4 className={`font-serif-about text-base sm:text-lg md:text-xl font-bold leading-snug line-clamp-2 transition-colors duration-1000 ${isDayMode ? 'text-zinc-950' : 'text-white'}`}>
                          {item.role}
                        </h4>
                        <p className={`font-montserrat font-medium text-[10px] sm:text-xs tracking-wider uppercase opacity-65 mt-1.5 transition-colors duration-1000 ${isDayMode ? 'text-zinc-800' : 'text-zinc-300'}`}>
                          {item.company}
                        </p>
                      </div>

                      {/* Details border line & Tech tags */}
                      <div
                        className="text-left border-t pt-4 flex flex-col justify-between flex-grow gap-3"
                        style={{ 
                          borderColor: isDayMode ? 'rgba(180,138,83,0.2)' : 'rgba(255,255,255,0.08)',
                          transition: 'border-color 1000ms ease-in-out'
                        }}
                      >
                        <p
                          className={`font-montserrat ${isDayMode ? 'font-normal' : 'font-light'} text-xs sm:text-[13px] md:text-[14px] leading-relaxed line-clamp-12 ${textOpacity}`}
                          style={{ 
                            color: isDayMode ? '#27272a' : '#b8b8b8',
                            transition: 'color 1000ms ease-in-out'
                          }}
                        >
                          {item.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-[9px] sm:text-[10px] md:text-[11px] font-montserrat font-medium px-2.5 py-0.5 rounded-full border transition-all duration-300 select-none ${isDayMode
                                ? 'border-[#B48A53]/20 bg-[#B48A53]/5 text-[#B48A53] hover:bg-[#B48A53]/10 hover:text-zinc-950 shadow-[0_0_8px_rgba(180,138,83,0.06)] hover:shadow-[0_0_12px_rgba(180,138,83,0.15)]'
                                : 'border-[#D4B48A]/20 bg-[#D4B48A]/5 text-[#D4B48A]/90 hover:bg-[#D4B48A]/10 hover:text-white shadow-[0_0_8px_rgba(212,180,138,0.10)] hover:shadow-[0_0_12px_rgba(212,180,138,0.25)]'
                                }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Empty bottom space to align height beautifully */}
        <div className="h-10 flex-shrink-0" />

      </div>
    </section>
  );
};

export default Experience;
