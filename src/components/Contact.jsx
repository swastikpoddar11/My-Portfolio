import React, { useState, useEffect, useRef } from 'react';
import contactDay from '../assets/contact_day.svg';
import contactNight from '../assets/contact_night.svg';

const Contact = ({ isDayMode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: 'schedule a meeting on / have query on' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [submissionFailed, setSubmissionFailed] = useState(false);

  const accentColor = isDayMode ? '#B48A53' : '#D4B48A';
  const labelClass = isDayMode ? 'text-zinc-950/60 font-semibold text-xs' : 'font-light text-xs text-[#D4B48A]/70';
  const dividerBg = isDayMode ? 'bg-[#B48A53]' : 'bg-[#D4B48A]/50';
  const textMain = isDayMode ? '#18181b' : '#fafafa';
  const subText = isDayMode ? 'rgba(39,39,42,0.55)' : 'rgba(255,255,255,0.40)';
  const inputBg = isDayMode ? 'rgba(255,255,255,0.80)' : 'rgba(10,10,10,0.80)';
  const inputBorder = isDayMode ? 'rgba(180,138,83,0.20)' : 'rgba(255,255,255,0.09)';
  const placeholderCol = isDayMode ? '#a1a1aa' : '#52525b';
  const cardBg = 'transparent';
  const cardBorder = isDayMode ? 'rgba(180,138,83,0.15)' : 'rgba(255,255,255,0.07)';
  const glowColor = isDayMode
    ? 'radial-gradient(circle,rgba(180,138,83,0.03) 0%,rgba(0,0,0,0) 75%)'
    : 'radial-gradient(circle,rgba(212,180,138,0.06) 0%,rgba(0,0,0,0) 75%)';



  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required.';
    if (!formData.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email.';
    if (formData.phone.trim() && !/^\+?[0-9\s-]{7,15}$/.test(formData.phone)) e.phone = 'Enter a valid phone number.';
    if (!formData.subject.trim()) e.subject = 'Subject is required.';
    if (!formData.message.trim()) e.message = 'Message is required.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name] || errors.submit) {
      setErrors(p => ({ ...p, [name]: undefined, submit: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      v.submit = 'Please fill out all required fields correctly.';
      setErrors(v);
      return;
    }
    setSubmitting(true);

    const generatedSessionId = Date.now() + Math.floor(Math.random() * 1000);

    try {
      const response = await fetch(`http://localhost:5678/webhook/portfolio-contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: generatedSessionId,
          ...formData
        }),
      });

      console.log('Form Submit Response Status:', response.status);

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        let botText = '';
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log('Form Submit Response JSON:', data);
          botText = data.reply;
          if (!botText) {
            const findText = (obj) => {
              if (!obj) return '';
              if (typeof obj === 'string') return obj;
              if (Array.isArray(obj)) {
                for (let item of obj) {
                  const res = findText(item);
                  if (res) return res;
                }
              } else if (typeof obj === 'object') {
                const priorityKeys = ['reply', 'output', 'text', 'response', 'message', 'content', 'data'];
                for (let key of priorityKeys) {
                  if (obj[key] && typeof obj[key] === 'string') return obj[key];
                  if (obj[key] && typeof obj[key] === 'object') {
                    const res = findText(obj[key]);
                    if (res) return res;
                  }
                }
                for (let key in obj) {
                  if (obj[key] && typeof obj[key] === 'string') return obj[key];
                  if (obj[key] && typeof obj[key] === 'object') {
                    const res = findText(obj[key]);
                    if (res) return res;
                  }
                }
              }
              return '';
            };
            botText = findText(data);
          }
          if (!botText) {
            botText = JSON.stringify(data);
          }
        } else {
          botText = await response.text();
          console.log('Form Submit Response Text:', botText);
        }

        setFormData({ name: '', email: '', phone: '', subject: '', message: 'schedule a meeting on / have query on' });
        setSessionId(generatedSessionId);
        setSubmitted(true);
      } else {
        const errorText = await response.text();
        console.error('Form Submit Response Error Text:', errorText);
        setErrors({ submit: `Failed to send message (Status ${response.status}). Please try again.` });
        setSubmissionFailed(true);
      }
    } catch (err) {
      console.error('Form Submit Fetch Error:', err);
      setErrors({ submit: 'Connection error. Please try again.' });
      setSubmissionFailed(true);
    } finally {
      setSubmitting(false);
    }
  };



  const baseInput = {
    width: '100%',
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    borderRadius: '7px',
    padding: '10px 14px',
    color: textMain,
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '13px',
    fontWeight: 300,
    outline: 'none',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
  };
  const focusDelta = {
    borderColor: accentColor,
    boxShadow: `0 0 0 2px ${isDayMode ? 'rgba(180,138,83,0.12)' : 'rgba(212,180,138,0.10)'}`,
  };
  const fieldStyle = (f, hasErr) => ({
    ...baseInput,
    ...(focused === f ? focusDelta : {}),
    ...(hasErr ? { borderColor: '#ef4444' } : {}),
  });

  const contactImg = isDayMode ? contactDay : contactNight;

  return (
    <section
      id="contact"
      className={`w-full h-screen relative overflow-hidden flex flex-col justify-center py-20 px-6 sm:px-12 lg:px-20 transition-colors duration-1000 ease-in-out ${isDayMode ? 'bg-[#FAF8F5]' : 'bg-[#060504]'
        }`}
    >
      {/* Content Wrapper */}
      <div className="w-full max-w-6xl mx-auto flex flex-col justify-between min-h-[75vh] z-10 relative h-full">

        {/* Top: Section Header */}
        <div className="w-full self-start mb-6 sm:mb-8 md:mb-12 flex-shrink-0">
          <span className={`font-montserrat text-xs tracking-[0.3em] uppercase block mb-2 transition-colors duration-1000 ${labelClass}`}>
            GET IN TOUCH
          </span>
          <div className={`w-12 h-[1px] transition-colors duration-1000 ${dividerBg}`} />
        </div>

        {/* ── Split — both columns stretch to fill remaining height ── */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 flex-1 min-h-0 items-stretch justify-center w-full pb-4">

          {/* LEFT — image, borderless, rounded corners, fills full height */}
          <div className="relative w-full md:w-[50%] flex-shrink-0 overflow-hidden rounded-2xl flex items-stretch min-h-[300px] md:min-h-0">
            {/* Night Image */}
            <img
              src={contactNight}
              alt="Cozy home-office desk scene Night"
              className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl transition-opacity duration-1000 ease-in-out"
              style={{
                display: 'block',
                opacity: isDayMode ? 0 : 1,
                zIndex: 1,
                willChange: 'opacity',
              }}
            />
            {/* Day Image */}
            <img
              src={contactDay}
              alt="Cozy home-office desk scene Day"
              className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl transition-opacity duration-1000 ease-in-out"
              style={{
                display: 'block',
                opacity: isDayMode ? 1 : 0,
                zIndex: 2,
                willChange: 'opacity',
              }}
            />
            {/* Blend edges into background */}
            {/* Day Blend Overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl z-10 transition-opacity duration-1000 ease-in-out"
              style={{
                background: 'linear-gradient(to top, #FAF8F5 0%, transparent 10%, transparent 90%, #FAF8F5 100%)',
                opacity: isDayMode ? 1 : 0,
                willChange: 'opacity',
              }}
            />
            {/* Night Blend Overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl z-10 transition-opacity duration-1000 ease-in-out"
              style={{
                background: 'linear-gradient(to top, #060504 0%, transparent 10%, transparent 90%, #060504 100%)',
                opacity: isDayMode ? 0 : 1,
                willChange: 'opacity',
              }}
            />
          </div>

          {/* RIGHT — form card matching the size of the left image */}
          <div className="w-full md:w-[50%] flex flex-col min-h-0">
            <div
              className="flex flex-col flex-1 justify-between rounded-2xl"
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '20px 24px',
                boxShadow: isDayMode ? '0 10px 30px rgba(180,138,83,0.08)' : '0 10px 30px rgba(0,0,0,0.3)',
              }}
            >
              {submissionFailed ? (
                <div className="flex flex-col flex-1 justify-center items-center text-center h-full min-h-[300px] py-4">
                  <div className="w-12 h-12 rounded-full border flex items-center justify-center mb-6"
                    style={{
                      borderColor: '#ef4444',
                      background: 'rgba(239, 68, 68, 0.08)',
                      color: '#ef4444'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <h3 className="font-serif-about text-xl font-bold mb-2" style={{ color: textMain }}>
                    Sorry for the inconvenience
                  </h3>
                  <p className="font-montserrat text-xs opacity-75 mb-6 max-w-sm" style={{ color: subText }}>
                    We encountered an issue submitting your message. You can contact me directly on:
                  </p>
                  
                  {/* Social/Contact Grid */}
                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-8">
                    <a
                      href="https://instagram.com/swastikpoddar11"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-montserrat text-[11px] font-medium tracking-wider transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        borderColor: isDayMode ? 'rgba(180,138,83,0.25)' : 'rgba(255,255,255,0.10)',
                        background: isDayMode ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.02)',
                        color: textMain
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = accentColor;
                        e.currentTarget.style.background = isDayMode ? 'rgba(180,138,83,0.08)' : 'rgba(255,255,255,0.06)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = isDayMode ? 'rgba(180,138,83,0.25)' : 'rgba(255,255,255,0.10)';
                        e.currentTarget.style.background = isDayMode ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.02)';
                      }}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      Instagram
                    </a>
                    
                    <a
                      href="https://linkedin.com/in/swastikpoddar11"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-montserrat text-[11px] font-medium tracking-wider transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        borderColor: isDayMode ? 'rgba(180,138,83,0.25)' : 'rgba(255,255,255,0.10)',
                        background: isDayMode ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.02)',
                        color: textMain
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = accentColor;
                        e.currentTarget.style.background = isDayMode ? 'rgba(180,138,83,0.08)' : 'rgba(255,255,255,0.06)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = isDayMode ? 'rgba(180,138,83,0.25)' : 'rgba(255,255,255,0.10)';
                        e.currentTarget.style.background = isDayMode ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.02)';
                      }}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      LinkedIn
                    </a>
                    
                    <a
                      href="mailto:poddarswastik11@gmail.com"
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-montserrat text-[11px] font-medium tracking-wider transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        borderColor: isDayMode ? 'rgba(180,138,83,0.25)' : 'rgba(255,255,255,0.10)',
                        background: isDayMode ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.02)',
                        color: textMain
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = accentColor;
                        e.currentTarget.style.background = isDayMode ? 'rgba(180,138,83,0.08)' : 'rgba(255,255,255,0.06)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = isDayMode ? 'rgba(180,138,83,0.25)' : 'rgba(255,255,255,0.10)';
                        e.currentTarget.style.background = isDayMode ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.02)';
                      }}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      Mail
                    </a>
                    
                    <a
                      href="tel:+919661140100"
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-montserrat text-[11px] font-medium tracking-wider transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        borderColor: isDayMode ? 'rgba(180,138,83,0.25)' : 'rgba(255,255,255,0.10)',
                        background: isDayMode ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.02)',
                        color: textMain
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = accentColor;
                        e.currentTarget.style.background = isDayMode ? 'rgba(180,138,83,0.08)' : 'rgba(255,255,255,0.06)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = isDayMode ? 'rgba(180,138,83,0.25)' : 'rgba(255,255,255,0.10)';
                        e.currentTarget.style.background = isDayMode ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.02)';
                      }}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      Phone
                    </a>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSubmissionFailed(false);
                      setErrors({});
                    }}
                    className="font-montserrat text-[10px] tracking-widest uppercase hover:underline py-2.5 px-6 rounded-full border transition-all duration-300"
                    style={{
                      borderColor: isDayMode ? 'rgba(180,138,83,0.45)' : 'rgba(255,255,255,0.20)',
                      background: isDayMode ? 'rgba(180,138,83,0.07)' : 'rgba(255,255,255,0.05)',
                      color: textMain
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = isDayMode ? 'rgba(180,138,83,0.16)' : 'rgba(255,255,255,0.09)';
                      e.currentTarget.style.borderColor = accentColor;
                      e.currentTarget.style.color = accentColor;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = isDayMode ? 'rgba(180,138,83,0.07)' : 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = isDayMode ? 'rgba(180,138,83,0.45)' : 'rgba(255,255,255,0.20)';
                      e.currentTarget.style.color = textMain;
                    }}
                  >
                    Try Again
                  </button>
                </div>
              ) : submitted ? (
                <div className="flex flex-col flex-1 justify-center items-center text-center h-full min-h-[300px]">
                  <div className="w-12 h-12 rounded-full border flex items-center justify-center mb-6"
                    style={{
                      borderColor: accentColor,
                      background: isDayMode ? 'rgba(180,138,83,0.07)' : 'rgba(255,255,255,0.05)',
                      color: accentColor
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3 className="font-serif-about text-2xl font-bold mb-3" style={{ color: textMain }}>
                    Thank You!
                  </h3>
                  <p className="font-montserrat text-xs tracking-wider uppercase opacity-75 mb-8" style={{ color: subText }}>
                    We will get back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="font-montserrat text-[10px] tracking-widest uppercase hover:underline py-2.5 px-6 rounded-full border transition-all duration-300"
                    style={{
                      borderColor: isDayMode ? 'rgba(180,138,83,0.45)' : 'rgba(255,255,255,0.20)',
                      background: isDayMode ? 'rgba(180,138,83,0.07)' : 'rgba(255,255,255,0.05)',
                      color: textMain
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = isDayMode ? 'rgba(180,138,83,0.16)' : 'rgba(255,255,255,0.09)';
                      e.currentTarget.style.borderColor = accentColor;
                      e.currentTarget.style.color = accentColor;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = isDayMode ? 'rgba(180,138,83,0.07)' : 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = isDayMode ? 'rgba(180,138,83,0.45)' : 'rgba(255,255,255,0.20)';
                      e.currentTarget.style.color = textMain;
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-3">

                    {/* Name */}
                    <div>
                      <label htmlFor="ct-name"
                        className="font-montserrat text-[10px] tracking-[0.2em] uppercase block mb-1 font-medium transition-colors duration-1000"
                        style={{ color: subText }}>Name</label>
                      <input id="ct-name" name="name" type="text" autoComplete="name"
                        placeholder="Your Name..." value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                        style={fieldStyle('name', !!errors.name)} />
                      {errors.name && <p className="mt-0.5 text-[10px] font-montserrat" style={{ color: '#ef4444' }}>{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="ct-email"
                        className="font-montserrat text-[10px] tracking-[0.2em] uppercase block mb-1 font-medium transition-colors duration-1000"
                        style={{ color: subText }}>Email</label>
                      <input id="ct-email" name="email" type="email" autoComplete="email"
                        placeholder="example@youremail.com" value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                        style={fieldStyle('email', !!errors.email)} />
                      {errors.email && <p className="mt-0.5 text-[10px] font-montserrat" style={{ color: '#ef4444' }}>{errors.email}</p>}
                    </div>

                    {/* Phone (Optional) */}
                    <div>
                      <label htmlFor="ct-phone"
                        className="font-montserrat text-[10px] tracking-[0.2em] uppercase block mb-1 font-medium transition-colors duration-1000"
                        style={{ color: subText }}>Phone (Optional)</label>
                      <input id="ct-phone" name="phone" type="tel" autoComplete="tel"
                        placeholder="Your Phone Number..." value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                        style={fieldStyle('phone', !!errors.phone)} />
                      {errors.phone && <p className="mt-0.5 text-[10px] font-montserrat" style={{ color: '#ef4444' }}>{errors.phone}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="ct-subject"
                        className="font-montserrat text-[10px] tracking-[0.2em] uppercase block mb-1 font-medium transition-colors duration-1000"
                        style={{ color: subText }}>Subject</label>
                      <input id="ct-subject" name="subject" type="text"
                        placeholder="Title..." value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setFocused('subject')} onBlur={() => setFocused('')}
                        style={fieldStyle('subject', !!errors.subject)} />
                      {errors.subject && <p className="mt-0.5 text-[10px] font-montserrat" style={{ color: '#ef4444' }}>{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div className="flex-1 flex flex-col">
                      <label htmlFor="ct-message"
                        className="font-montserrat text-[10px] tracking-[0.2em] uppercase block mb-1 font-medium transition-colors duration-1000"
                        style={{ color: subText }}>Message</label>
                      <textarea id="ct-message" name="message"
                        placeholder="Type Here..." value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                        className="flex-1"
                        style={{
                          ...fieldStyle('message', !!errors.message),
                          minHeight: '80px', resize: 'none', lineHeight: 1.6,
                        }} />
                      {errors.message && <p className="mt-0.5 text-[10px] font-montserrat" style={{ color: '#ef4444' }}>{errors.message}</p>}
                    </div>

                    {/* Submission Error Message */}
                    {errors.submit && (
                      <div className="mt-2 text-[11px] font-montserrat text-center text-red-500 bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{errors.submit}</span>
                      </div>
                    )}

                    {/* Send button */}
                    <button type="submit" disabled={submitting}
                      className="w-full font-montserrat font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-50 mt-2 flex-shrink-0"
                      style={{
                        padding: '13px 24px', borderRadius: '9999px',
                        border: `1.5px solid ${isDayMode ? 'rgba(180,138,83,0.45)' : 'rgba(255,255,255,0.20)'}`,
                        background: isDayMode ? 'rgba(180,138,83,0.07)' : 'rgba(255,255,255,0.05)',
                        color: textMain, cursor: submitting ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={e => {
                        if (submitting) return;
                        e.currentTarget.style.background = isDayMode ? 'rgba(180,138,83,0.16)' : 'rgba(255,255,255,0.09)';
                        e.currentTarget.style.borderColor = accentColor;
                        e.currentTarget.style.color = accentColor;
                        e.currentTarget.style.boxShadow = `0 0 16px ${isDayMode ? 'rgba(180,138,83,0.18)' : 'rgba(212,180,138,0.16)'}`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = isDayMode ? 'rgba(180,138,83,0.07)' : 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.borderColor = isDayMode ? 'rgba(180,138,83,0.45)' : 'rgba(255,255,255,0.20)';
                        e.currentTarget.style.color = textMain;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {submitting ? 'Sending...' : 'Send Now'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        #ct-name::placeholder,#ct-email::placeholder,
        #ct-phone::placeholder,#ct-subject::placeholder,#ct-message::placeholder {
          color: ${placeholderCol}; font-weight: 300;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Contact;
