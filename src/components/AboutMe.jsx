import React from 'react';
import {
  Database,
  BarChart3,
  Monitor,
  Award,
  Sparkles,
  TrendingUp,
  Code2,
  Palette,
  Mail,
  Phone
} from 'lucide-react';
import aboutAvatarImg from '../assets/avatar_v7.png';
import resumePdf from '../../image/Swastik Poddar - Social Media.pdf';

// Custom Figma SVG icon
const FigmaIcon = (props) => (
  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 4.5C3 3.25736 4.00736 2.25 5.25 2.25H7.5V6.75H5.25C4.00736 6.75 3 5.74264 3 4.5Z" fill="currentColor" />
    <path d="M3 10.5C3 9.25736 4.00736 8.25 5.25 8.25H7.5V12.75H5.25C4.00736 12.75 3 11.7426 3 10.5Z" fill="currentColor" />
    <path d="M7.5 13.5C6.25736 13.5 5.25 14.5074 5.25 15.75C5.25 16.9926 6.25736 18 7.5 18C8.74264 18 9.75 16.9926 9.75 15.75V13.5H7.5Z" fill="currentColor" />
    <path d="M7.5 0C8.74264 0 9.75 1.00736 9.75 2.25V4.5C9.75 5.74264 8.74264 6.75 7.5 6.75C6.25736 6.75 5.25 5.74264 5.25 4.5C5.25 3.25736 6.25736 0 7.5 0Z" fill="currentColor" />
    <path d="M9.75 8.25C10.9926 8.25 12 9.25736 12 10.5C12 11.7426 10.9926 12.75 9.75 12.75V8.25Z" fill="currentColor" />
  </svg>
);

// Custom Instagram SVG icon
const InstagramIcon = (props) => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Custom LinkedIn SVG icon
const LinkedinIcon = (props) => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const defaultSkills = [
  'Canva', 'Python', 'n8n', 'Agentic AI', 'SQL',
  'Power BI', 'UI/UX', 'Brand Identity', 'Visual Storytelling', 'Google Analytics'
];

const AboutMe = ({ isDayMode }) => {
  const [resumeUrl, setResumeUrl] = React.useState(resumePdf);
  const [skills, setSkills] = React.useState(() => {
    try {
      const s = localStorage.getItem('swastik_portfolio_skills');
      return s ? JSON.parse(s) : defaultSkills;
    } catch {
      return defaultSkills;
    }
  });

  React.useEffect(() => {
    try {
      const custom = localStorage.getItem('swastik_portfolio_resume');
      if (custom) setResumeUrl(custom);

      const customSkills = localStorage.getItem('swastik_portfolio_skills');
      if (customSkills) setSkills(JSON.parse(customSkills));
    } catch {}

    const handleStorage = () => {
      try {
        const custom = localStorage.getItem('swastik_portfolio_resume');
        setResumeUrl(custom || resumePdf);

        const customSkills = localStorage.getItem('swastik_portfolio_skills');
        setSkills(customSkills ? JSON.parse(customSkills) : defaultSkills);
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const connectLinks = [
    { name: 'Instagram', href: 'https://instagram.com/swastikpoddar11', Icon: InstagramIcon },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/swastikpoddar11', Icon: LinkedinIcon },
    { name: 'Email', href: 'mailto:poddarswastik11@gmail.com', Icon: Mail },
    { name: 'Phone', href: 'tel:+919661140100', Icon: Phone },
  ];

  return (
    <section 
      id="about" 
      className={`w-full min-h-screen relative overflow-hidden flex flex-col justify-center py-20 px-6 sm:px-12 lg:px-20 transition-colors duration-1000 ease-in-out ${
        isDayMode 
          ? 'bg-[#FAF8F5] text-zinc-900' 
          : 'bg-[#090909] text-white'
      }`}
    >
      {/* Soft Amber Ambient Glow spotlight */}
      <div className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none z-0 transition-opacity duration-1000 ${
        isDayMode 
          ? 'bg-[radial-gradient(circle,rgba(180,138,83,0.03)_0%,rgba(0,0,0,0)_75%)] opacity-80' 
          : 'bg-[radial-gradient(circle,rgba(212,180,138,0.06)_0%,rgba(0,0,0,0)_75%)]'
      }`} />
      
      {/* Content Wrapper */}
      <div className="w-full max-w-6xl mx-auto flex flex-col justify-between min-h-[75vh] z-10 relative">
        
        {/* Top: Section Header */}
        <div className="w-full self-start mb-6 sm:mb-8 md:mb-12">
          <span className={`font-montserrat text-xs tracking-[0.3em] uppercase block mb-2 transition-colors duration-1000 ${
            isDayMode ? 'text-zinc-950/60 font-semibold' : 'text-[#D4B48A]/70'
          }`}>
            ABOUT ME
          </span>
          <div className={`w-12 h-[1px] transition-colors duration-1000 ${
            isDayMode ? 'bg-[#B48A53]' : 'bg-[#D4B48A]/50'
          }`} />
        </div>

        {/* Middle: Split Layout (Avatar & Intro) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center w-full my-auto py-8">
          
          {/* Left Column: Circular Avatar Frame + Connect Pills */}
          <div className="w-full md:col-span-5 flex flex-col items-center md:items-start relative">
            <div className="relative flex-shrink-0">
              
              {/* Decorative dot grid behind avatar (bottom-left) */}
              <div className={`absolute -left-6 -bottom-6 w-32 h-32 opacity-25 pointer-events-none z-0 transition-colors duration-1000 ${
                isDayMode ? 'text-[#B48A53]' : 'text-[#D4B48A]'
              }`}>
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
                  <pattern id="avatar-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                    <circle cx="1.5" cy="1.5" r="1.5" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#avatar-dots)" />
                </svg>
              </div>

              {/* Glowing border around avatar */}
              <div className={`w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-[350px] lg:h-[350px] rounded-full border p-1.5 relative overflow-visible transition-all duration-1000 hover:scale-[1.02] z-10 ${
                isDayMode 
                  ? 'border-zinc-900/10 bg-white shadow-sm' 
                  : 'border-[#D4B48A]/25 bg-[#090909] shadow-[0_0_35px_rgba(212,180,138,0.12)]'
              }`}>
                <div className={`w-full h-full rounded-full overflow-hidden transition-colors duration-1000 ${
                  isDayMode ? 'bg-[#FAF8F5]' : 'bg-[#090909]'
                }`}>
                  <img 
                    src={aboutAvatarImg} 
                    alt="Swastik Poddar Portrait" 
                    className="w-full h-full object-cover scale-[1.1] origin-center"
                  />
                </div>
              </div>
              
              {/* Handwritten Note and Arrow */}
              <div className={`absolute -top-14 right-2 font-handwritten text-2xl select-none pointer-events-none flex flex-col items-center rotate-[8deg] z-20 transition-colors duration-1000 ${
                isDayMode ? 'text-[#B48A53] font-semibold' : 'text-[#D4B48A]'
              }`}>
                <span className="tracking-wide drop-shadow-md">That's me!</span>
                <svg className="w-12 h-10 -mt-1 drop-shadow-md" viewBox="0 0 50 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M38,5 C32,14 26,22 10,29" />
                  <path d="M16,30 L10,29 L12,22" />
                </svg>
              </div>
            </div>

            {/* Embedded Connect Pills to Balance Left Height */}
            <div className="mt-16 md:mt-24 flex flex-col items-center md:items-start gap-3 w-full z-20">
              <span className={`font-montserrat font-extralight text-[10px] tracking-[0.3em] uppercase transition-colors duration-1000 ${
                isDayMode ? 'text-zinc-950/50 font-semibold' : 'text-[#D4B48A]/60'
              }`}>
                CONNECT
              </span>
              <div className="flex flex-wrap gap-2.5 justify-center md:justify-start w-full">
                {connectLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 font-montserrat font-light text-xs ${
                      isDayMode 
                        ? 'border-zinc-900/10 bg-white text-zinc-950 hover:border-[#B48A53]/45 hover:bg-zinc-50 shadow-sm font-normal' 
                        : 'border-[#D4B48A]/10 bg-[#D4B48A]/[0.02] backdrop-blur-md text-[#D4B48A] hover:text-white hover:border-[#D4B48A]/30'
                    }`}
                  >
                    <link.Icon className={`w-3.5 h-3.5 transition-colors duration-1000 ${
                      isDayMode ? 'text-[#B48A53]' : 'text-[#D4B48A]'
                    }`} />
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Copy & CTAs & Skills */}
          <div className="w-full md:col-span-7 flex flex-col text-left justify-center">
            
            {/* Greeting: Handwritten gold script */}
            <span className={`font-handwritten text-5xl lg:text-6xl block mb-2 select-none transition-colors duration-1000 ${
              isDayMode ? 'text-[#B48A53] font-semibold' : 'text-[#D4B48A]'
            }`}>
              Hi!
            </span>
            
            {/* Name */}
            <h2 className={`font-serif-about text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[72px] font-semibold leading-[1.1] mb-6 tracking-wide transition-colors duration-1000 sm:whitespace-nowrap whitespace-normal ${
              isDayMode ? 'text-zinc-950' : 'text-white'
            }`}>
              I'm Swastik Poddar.
            </h2>
            
            {/* Stacked Role Title with vertical accent border on left */}
            <div className={`border-l-2 pl-4 py-0.5 mb-6 transition-colors duration-1000 ${
              isDayMode ? 'border-[#B48A53]/40' : 'border-[#D4B48A]/40'
            }`}>
              <span className={`font-montserrat text-base md:text-lg tracking-wide block transition-colors duration-1000 ${
                isDayMode ? 'text-zinc-900 font-semibold' : 'text-[#B8B8B8] font-light'
              }`}>
                Software Engineering Student
              </span>
              <span className={`font-montserrat text-base md:text-lg tracking-wide block mt-1 transition-colors duration-1000 ${
                isDayMode ? 'text-[#B48A53] font-semibold' : 'text-[#D4B48A]/90 font-light'
              }`}>
                Creative Designer
              </span>
            </div>
            
            {/* Description Copy */}
            <p className={`font-montserrat text-base sm:text-lg lg:text-[18px] leading-relaxed max-w-[620px] mb-8 transition-colors duration-1000 ${
              isDayMode ? 'text-zinc-800 font-normal' : 'text-[#B8B8B8] font-light'
            }`}>
              Creative and results-driven Software Engineering student passionate about graphic design, branding, digital experiences, and storytelling.
              <br /><br />
              I enjoy combining creativity and technology to build meaningful digital experiences that leave a lasting impact.
            </p>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <a 
                href="#projects" 
                className={`px-8 py-3.5 rounded-full text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 font-montserrat font-medium ${
                  isDayMode 
                    ? 'bg-zinc-950 text-white hover:bg-zinc-800 border border-transparent shadow-sm' 
                    : 'bg-[#D4B48A] text-black hover:bg-transparent hover:text-[#D4B48A] border border-[#D4B48A] hover:shadow-[0_0_15px_rgba(212,180,138,0.35)] font-semibold'
                }`}
              >
                View Projects
              </a>
              <a 
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-8 py-3.5 rounded-full text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 font-montserrat font-medium border ${
                  isDayMode 
                    ? 'border-zinc-900/20 text-zinc-900 hover:bg-zinc-900/5' 
                    : 'border-white/10 text-white hover:border-[#D4B48A]/40 hover:text-[#D4B48A] hover:shadow-[0_0_15px_rgba(212,180,138,0.15)]'
                }`}
              >
                Download Resume
              </a>
            </div>

            {/* Integrated Skills Section */}
            <div>
              <span className={`font-montserrat text-xs sm:text-[13px] tracking-[0.25em] uppercase block mb-3.5 transition-colors duration-1000 ${
                isDayMode ? 'text-zinc-900/60 font-semibold' : 'text-[#D4B48A]/70'
              }`}>
                Skills & Tools
              </span>
              <div className="flex flex-wrap gap-2.5 max-w-[620px]">
                {skills.map((skill) => (
                  <div 
                    key={skill}
                    className={`flex items-center px-3.5 py-1.5 rounded-full border transition-all duration-300 text-xs sm:text-[13px] font-montserrat select-none ${
                      isDayMode 
                        ? 'border-[#B48A53] bg-white text-zinc-950 font-semibold shadow-[0_0_8px_rgba(180,138,83,0.15)] hover:bg-zinc-50/80'
                        : 'border-[#D4B48A] bg-[#D4B48A]/5 text-white font-medium hover:bg-[#D4B48A]/10 shadow-[0_0_12px_rgba(212,180,138,0.25)]'
                    }`}
                  >
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
