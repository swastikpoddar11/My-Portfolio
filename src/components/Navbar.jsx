import React, { useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

const Navbar = ({ isWhiteScreen }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
  ];


  return (
    <>
      <nav className="fixed top-0 w-full z-40 pl-[84px] sm:pl-[112px] lg:pl-[152px] pr-6 sm:pr-10 lg:pr-16 py-4 lg:py-5 flex justify-between items-center pointer-events-none transition-all duration-1000 ease-in-out">
        {/* Left: Circular Logo Icon */}
        <a
          href="#"
          className={`flex items-center justify-center w-11 h-11 rounded-full border backdrop-blur-lg font-podium text-sm uppercase font-bold tracking-widest z-50 relative transition-all duration-1000 select-none cursor-pointer pointer-events-auto ${isWhiteScreen
              ? 'border-zinc-950/10 bg-white/60 text-zinc-950 hover:bg-white/80 hover:border-zinc-950/20 shadow-[0_8px_32px_rgba(180,138,83,0.04)]'
              : 'border-white/10 bg-black/50 text-white hover:bg-black/70 hover:border-white/20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            }`}
        >
          SP
        </a>

        {/* Center: Nav Links (hidden below md) */}
        <div className={`hidden md:flex items-center space-x-8 px-6 py-2.5 rounded-full border backdrop-blur-lg pointer-events-auto transition-colors duration-1000 ease-in-out ${isWhiteScreen
            ? 'bg-white/60 border-zinc-950/10 shadow-[0_8px_32px_rgba(180,138,83,0.04)]'
            : 'bg-black/50 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
          }`}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`font-inter text-sm tracking-widest uppercase transition-colors duration-300 ${isWhiteScreen
                  ? 'text-zinc-800 hover:text-zinc-950 font-semibold'
                  : 'text-white/80 hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
                }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right: CTA (hidden below md) */}
        <div className="hidden md:block pointer-events-auto">
          <a
            href="#contact"
            className={`flex items-center space-x-2 border px-6 py-2.5 rounded-full backdrop-blur-lg transition-colors duration-1000 ease-in-out ${isWhiteScreen
                ? 'border-zinc-950/10 bg-white/60 text-zinc-950 hover:border-zinc-950/20 hover:bg-white/80 font-semibold shadow-[0_8px_32px_rgba(180,138,83,0.04)]'
                : 'border-white/10 bg-black/50 text-white hover:border-white/20 hover:bg-black/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
              }`}
          >
            <span>Get in touch</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Right: Hamburger (visible below md) */}
        <div
          className={`md:hidden flex items-center justify-center w-11 h-11 rounded-full border backdrop-blur-md z-50 relative cursor-pointer pointer-events-auto transition-colors duration-1000 ease-in-out ${isWhiteScreen
              ? 'border-zinc-950/15 bg-white/50 text-zinc-950 hover:bg-white/70 shadow-sm'
              : 'border-white/10 bg-black/40 text-white hover:border-white/30 hover:bg-black/60 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
            }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X className={`w-5 h-5 ${isWhiteScreen ? 'text-zinc-950' : 'text-white'}`} />
          ) : (
            <div className="flex flex-col items-end space-y-1">
              <div className={`w-5 h-0.5 transition-all duration-300 ${isWhiteScreen ? 'bg-zinc-950' : 'bg-white'}`}></div>
              <div className={`w-5 h-0.5 transition-all duration-300 ${isWhiteScreen ? 'bg-zinc-950' : 'bg-white'}`}></div>
              <div className={`w-3 h-0.5 transition-all duration-300 ${isWhiteScreen ? 'bg-zinc-950' : 'bg-white'}`}></div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 backdrop-blur-sm transition-all duration-500 flex flex-col justify-center items-center ${isWhiteScreen ? 'bg-white/95 text-zinc-950' : 'bg-black/95 text-white'
          } ${menuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
          }`}
      >
        <div className="flex flex-col items-center space-y-8 w-full px-6">
          {navLinks.map((link, i) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`font-podium text-4xl sm:text-5xl uppercase transition-colors ${isWhiteScreen ? 'text-zinc-900 hover:text-black' : 'text-white hover:text-white'
                }`}
              style={{
                transitionDelay: `${i * 80 + 100}ms`,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                transitionProperty: 'opacity, transform',
                transitionDuration: '500ms',
              }}
            >
              {link.name}
            </a>
          ))}

          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className={`mt-8 flex items-center space-x-2 border px-6 py-4 text-sm tracking-widest uppercase transition-colors ${isWhiteScreen ? 'border-zinc-900/35 text-zinc-900 hover:bg-zinc-900/5 hover:border-zinc-900 font-semibold' : 'border-white/30 text-white hover:bg-white/10'
              }`}
            style={{
              transitionDelay: `${navLinks.length * 80 + 100}ms`,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              transitionProperty: 'opacity, transform',
              transitionDuration: '500ms',
            }}
          >
            <span>Get in touch</span>
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
