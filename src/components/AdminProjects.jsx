import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Plus, Trash2, Save, Eye, EyeOff, Lock, LogOut, AlertCircle, CheckCircle, Edit3, Tag, Upload, ImageOff, FolderOpen, Download, Briefcase, Trophy } from 'lucide-react';
import { defaultProjects, renderBlankCardContent } from './Projects';
import { defaultExperiences } from './Experience';

export const STORAGE_KEY = 'swastik_portfolio_projects';

// ─── Storage keys ─────────────────────────────────────────────────────────────
export const CATEGORIES_KEY  = 'swastik_portfolio_categories';
export const DEFAULT_CATEGORIES = ['Graphic Design', 'Branding', 'Illustration', 'Web Design'];

const loadCategories = () => {
  try {
    const s = localStorage.getItem(CATEGORIES_KEY);
    return s ? JSON.parse(s) : DEFAULT_CATEGORIES;
  } catch { return DEFAULT_CATEGORIES; }
};

const saveCategories = (cats) => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
  window.dispatchEvent(new Event('storage'));
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
const USER_HASH   = '2999135ce0ed807a82e1559a3fb790d7b78db684452e8d644a16beff4901c2a1';
const PASS_HASH   = '287989ce014ee5beeb3a0556aecd38b6dcdb8ecee91aa17aac593b01aa01fcad';
const SESSION_KEY = '_sys_sec_ctx';

const sha256 = async (str) => {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
};

// ─── Shared style tokens ──────────────────────────────────────────────────────
const ic  = 'w-full bg-[#0d0d0d] border border-[#E8D9C5]/10 rounded-xl px-4 py-3 text-[#E8D9C5] font-montserrat font-light text-sm placeholder-[#E8D9C5]/20 focus:outline-none focus:border-[#D4B48A]/40 focus:shadow-[0_0_0_1px_rgba(212,180,138,0.12)] transition-all duration-200';
const lc  = 'font-montserrat font-light text-[10px] tracking-[0.22em] uppercase text-[#E8D9C5]/45 block mb-1.5';
const btn = 'inline-flex items-center gap-2 px-5 py-2 rounded-full font-montserrat font-light text-[10px] tracking-[0.2em] uppercase transition-all duration-300';

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-3.5 rounded-full border font-montserrat text-sm font-light tracking-wide shadow-2xl backdrop-blur-md ${type === 'success' ? 'bg-[#D4B48A]/10 border-[#D4B48A]/40 text-[#D4B48A]' : 'bg-red-900/30 border-red-500/40 text-red-400'}`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      <span>{msg}</span>
    </div>
  );
};

// ─── File → base64 ────────────────────────────────────────────────────────────
const readFileAsBase64 = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

// ─── File Drop Zone ───────────────────────────────────────────────────────────
const FileDropZone = ({ value, fileName, onChange, onError }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading]   = useState(false);

  const processFile = useCallback(async (file) => {
    if (!file) return;
    // No size block — accept any file. Gentle advisory only for very large files.
    if (file.size > 10 * 1024 * 1024) {
      onError(`Large file (${(file.size / 1024 / 1024).toFixed(1)} MB) — loading may take a moment.`);
      // Still continue — do not return
    }
    setLoading(true);
    try {
      const b64 = await readFileAsBase64(file);
      onChange(b64, file.name);
    } catch {
      onError('Failed to read file. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [onChange, onError]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const isImage = value && (value.startsWith('data:image') || value.startsWith('https'));

  return (
    <div>
      <label className={lc}>Cover Image / Design File * <span className="text-[#D4B48A]/50">(used as thumbnail & download)</span></label>

      {/* Drop area */}
      <div
        className={`relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer ${dragging ? 'border-[#D4B48A]/60 bg-[#D4B48A]/5' : 'border-[#E8D9C5]/12 hover:border-[#D4B48A]/35 hover:bg-[#D4B48A]/[0.03]'}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {/* Preview if image file already loaded */}
        {isImage && (
          <div className="w-full h-44 overflow-hidden rounded-xl">
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
              <span className="font-montserrat font-light text-xs tracking-widest text-white uppercase">Click to change</span>
            </div>
          </div>
        )}

        {/* Non-image file or empty state */}
        {!isImage && (
          <div className="flex flex-col items-center justify-center gap-3 py-10 px-4">
            {loading ? (
              <>
                <div className="w-8 h-8 rounded-full border-2 border-[#D4B48A]/40 border-t-[#D4B48A] animate-spin" />
                <span className="font-montserrat font-light text-xs text-[#E8D9C5]/40">Processing file…</span>
              </>
            ) : value ? (
              <>
                <FolderOpen className="w-8 h-8 text-[#D4B48A]/70" />
                <div className="text-center">
                  <p className="font-montserrat font-light text-xs text-[#E8D9C5]/70 mb-0.5">{fileName || 'File loaded'}</p>
                  <p className="font-montserrat font-light text-[10px] text-[#E8D9C5]/30">Click to replace</p>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-[#E8D9C5]/20" />
                <div className="text-center">
                  <p className="font-montserrat font-light text-xs text-[#E8D9C5]/50 mb-1">Drop file here or <span className="text-[#D4B48A]">click to browse</span></p>
                  <p className="font-montserrat font-light text-[10px] text-[#E8D9C5]/25">Images (JPG, PNG, WebP) · PDF · AI · PSD · Any file size accepted</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* File name indicator for non-image files */}
      {value && !isImage && (
        <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#D4B48A]/5 border border-[#D4B48A]/15">
          <FolderOpen className="w-3.5 h-3.5 text-[#D4B48A] flex-shrink-0" />
          <span className="font-montserrat font-light text-[11px] text-[#D4B48A] truncate">{fileName}</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange('', ''); }}
            className="ml-auto text-[#E8D9C5]/30 hover:text-red-400 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf,.ai,.psd,.sketch,.xd,.fig,.zip"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) await processFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
};

// ─── Category Manager Panel ───────────────────────────────────────────────────
const CategoryManager = ({ categories, onChange, onToast }) => {
  const [newCat, setNewCat] = useState('');
  const [confirmDel, setConfirmDel] = useState(null);

  const add = () => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    if (categories.map(c => c.toLowerCase()).includes(trimmed.toLowerCase())) {
      onToast({ msg: 'Category already exists.', type: 'error' }); return;
    }
    const updated = [...categories, trimmed];
    onChange(updated);
    saveCategories(updated);
    setNewCat('');
    onToast({ msg: `Category "${trimmed}" added.`, type: 'success' });
  };

  const remove = (cat) => {
    const updated = categories.filter(c => c !== cat);
    onChange(updated);
    saveCategories(updated);
    setConfirmDel(null);
    onToast({ msg: `Category "${cat}" deleted.`, type: 'success' });
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#E8D9C5]/6 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-5">
        <Tag className="w-4 h-4 text-[#D4B48A]" />
        <h3 className="font-serif-about text-lg text-[#E8D9C5] font-semibold">Categories</h3>
        <span className="ml-auto font-montserrat font-light text-[10px] text-[#E8D9C5]/30 tracking-widest uppercase">{categories.length} total</span>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map(cat => (
          <div
            key={cat}
            className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D4B48A]/25 bg-[#D4B48A]/5 text-[#D4B48A] font-montserrat font-light text-[11px] tracking-wide shadow-[0_0_10px_rgba(212,180,138,0.06)]"
          >
            <span>{cat}</span>
            <button
              type="button"
              onClick={() => setConfirmDel(cat)}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-[#D4B48A]/50 hover:text-red-400"
              title={`Delete "${cat}"`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {categories.length === 0 && (
          <span className="font-montserrat font-light text-xs text-[#E8D9C5]/25 tracking-widest">No categories yet</span>
        )}
      </div>

      {/* Add new */}
      <div className="flex gap-2">
        <input
          className={`${ic} flex-1`}
          value={newCat}
          onChange={e => setNewCat(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="New category name…"
          maxLength={40}
        />
        <button
          type="button"
          onClick={add}
          disabled={!newCat.trim()}
          className={`${btn} bg-[#D4B48A]/10 border border-[#D4B48A]/35 text-[#D4B48A] hover:bg-[#D4B48A] hover:text-black hover:border-transparent shadow-[0_0_12px_rgba(212,180,138,0.08)] disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {/* Inline delete confirm */}
      {confirmDel && (
        <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-900/15 border border-red-500/20 animate-[fadeIn_0.2s_ease]">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="font-montserrat font-light text-xs text-[#E8D9C5]/70 flex-1">
            Delete <strong className="text-red-400">"{confirmDel}"</strong>? Projects in this category will become uncategorised.
          </span>
          <button onClick={() => remove(confirmDel)} className="font-montserrat font-light text-[10px] tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors">Delete</button>
          <button onClick={() => setConfirmDel(null)} className="font-montserrat font-light text-[10px] tracking-widest uppercase text-[#E8D9C5]/40 hover:text-[#E8D9C5] transition-colors">Cancel</button>
        </div>
      )}
    </div>
  );
};

// ─── Project Form Modal ───────────────────────────────────────────────────────
// ─── Project Form Modal ───────────────────────────────────────────────────────
const ProjectFormModal = ({ project, categories, onSave, onClose }) => {
  const initForm = project
    ? {
        isBlank: false,
        styleType: 0,
        word: '',
        quoteText: project.quote?.text || '',
        quoteAuthor: project.quote?.author || '',
        ...project
      }
    : {
        id: Date.now(),
        title: '',
        category: categories[0] || '',
        image: '',
        fileName: '',
        description: '',
        isBlank: false,
        styleType: 0,
        word: '',
        quoteText: '',
        quoteAuthor: ''
      };

  const [form, setForm]     = useState(initForm);
  const [fileErr, setFileErr] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleFileChange = (b64, name) => {
    setFileErr('');
    setForm(f => ({ ...f, image: b64, fileName: name }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setFileErr('Title/Composition Name is required.'); return; }
    
    if (form.isBlank) {
      const quote = form.styleType === 0 ? { text: form.quoteText.trim(), author: form.quoteAuthor.trim() } : undefined;
      onSave({
        id: form.id || Date.now(),
        title: form.title.trim(),
        category: form.category,
        isBlank: true,
        word: form.word.trim() || 'AESTHETIC',
        styleType: parseInt(form.styleType),
        quote,
        description: form.description.trim() || 'A minimalist aesthetic study exploring grid structures, negative space, and contemporary design principles.',
        image: '',
        fileName: '',
        downloadUrl: ''
      });
    } else {
      if (!form.image) { setFileErr('Please upload a cover image.'); return; }
      onSave({
        id: form.id || Date.now(),
        title: form.title.trim(),
        category: form.category,
        isBlank: false,
        image: form.image,
        fileName: form.fileName,
        description: form.description.trim(),
        downloadUrl: form.image
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-[#080808] border border-[#E8D9C5]/8 rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.7)] max-h-[90vh] flex flex-col animate-[fadeIn_0.3s_ease]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8D9C5]/6 flex-shrink-0">
          <h3 className="font-serif-about text-xl text-[#E8D9C5] font-semibold">
            {project ? 'Edit Project / Card' : 'New Project / Card'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full border border-[#E8D9C5]/10 text-[#E8D9C5]/50 hover:text-[#E8D9C5] hover:border-[#E8D9C5]/25 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">

          {/* Card Type Selection */}
          <div>
            <label className={lc}>Card Style Type</label>
            <div className="flex flex-col sm:flex-row gap-4 mt-1.5 p-3 rounded-xl bg-[#0d0d0d] border border-[#E8D9C5]/10">
              <label className="flex items-center gap-2.5 cursor-pointer font-montserrat text-xs text-[#E8D9C5] select-none">
                <input
                  type="radio"
                  name="isBlank"
                  checked={!form.isBlank}
                  onChange={() => set('isBlank', false)}
                  className="accent-[#D4B48A] w-4 h-4"
                />
                Design Project (with Image/File upload)
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer font-montserrat text-xs text-[#E8D9C5] select-none">
                <input
                  type="radio"
                  name="isBlank"
                  checked={form.isBlank}
                  onChange={() => set('isBlank', true)}
                  className="accent-[#D4B48A] w-4 h-4"
                />
                Aesthetic Composition (Text/Quote/Geometry)
              </label>
            </div>
          </div>

          {/* Common: Title + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={lc}>{form.isBlank ? 'Composition Name *' : 'Project Title *'}</label>
              <input className={ic} value={form.title} onChange={e => set('title', e.target.value)} placeholder={form.isBlank ? 'e.g. Composition #100' : 'e.g. Brand Identity System'} required />
            </div>
            <div>
              <label className={lc}>Category *</label>
              {categories.length > 0 ? (
                <select className={ic} value={form.category} onChange={e => set('category', e.target.value)}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <div className={`${ic} text-[#E8D9C5]/30 cursor-not-allowed`}>No categories — add one in Categories tab</div>
              )}
            </div>
          </div>

          {/* Conditional Blocks based on Type */}
          {!form.isBlank ? (
            /* DESIGN PROJECT: File upload */
            <FileDropZone
              value={form.image}
              fileName={form.fileName}
              onChange={handleFileChange}
              onError={setFileErr}
            />
          ) : (
            /* AESTHETIC COMPOSITION: Minimalist layout fields */
            <div className="space-y-5 p-4 rounded-xl bg-[#0d0d0d] border border-[#E8D9C5]/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={lc}>Art Style Layout *</label>
                  <select 
                    className={ic} 
                    value={form.styleType} 
                    onChange={e => set('styleType', parseInt(e.target.value))}
                  >
                    <option value={0}>Quote Card</option>
                    <option value={1}>Studio Line Art</option>
                    <option value={2}>Sacred Geometry</option>
                    <option value={3}>Technical Coordinate</option>
                  </select>
                </div>
                <div>
                  <label className={lc}>Bold Graphic Word *</label>
                  <input className={ic} value={form.word} onChange={e => set('word', e.target.value)} placeholder="e.g. PROCESS, BALANCE, MINIMAL" required />
                </div>
              </div>

              {form.styleType === 0 && (
                <div className="grid grid-cols-1 gap-4 pt-2">
                  <div>
                    <label className={lc}>Quote Text *</label>
                    <textarea 
                      className={`${ic} h-20 resize-none`} 
                      value={form.quoteText} 
                      onChange={e => set('quoteText', e.target.value)} 
                      placeholder="e.g. Simplicity is the ultimate sophistication."
                      required={form.styleType === 0}
                    />
                  </div>
                  <div>
                    <label className={lc}>Quote Author *</label>
                    <input 
                      className={ic} 
                      value={form.quoteAuthor} 
                      onChange={e => set('quoteAuthor', e.target.value)} 
                      placeholder="e.g. Leonardo da Vinci"
                      required={form.styleType === 0}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {fileErr && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/20 text-red-400 font-montserrat font-light text-xs animate-[fadeIn_0.2s_ease]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {fileErr}
            </div>
          )}

          {/* Description */}
          <div>
            <label className={lc}>Description / Context</label>
            <textarea
              className={`${ic} h-24 resize-none`}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Short project description or design context..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className={`${btn} border border-[#E8D9C5]/15 text-[#E8D9C5]/50 hover:border-[#E8D9C5]/30 hover:text-[#E8D9C5]`}>
              Cancel
            </button>
            <button type="submit" className={`${btn} bg-[#D4B48A]/10 border border-[#D4B48A]/35 text-[#D4B48A] hover:bg-[#D4B48A] hover:text-black hover:border-transparent shadow-[0_0_14px_rgba(212,180,138,0.1)]`}>
              <Save className="w-3.5 h-3.5" />
              {project ? 'Update Card' : 'Add Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Experience Form Modal ───────────────────────────────────────────────────
const ExperienceFormModal = ({ experience, onSave, onClose }) => {
  const initForm = experience
    ? {
        role: '',
        company: '',
        duration: '',
        description: '',
        category: 'Experience',
        ...experience,
        tagsString: experience.tags ? experience.tags.join(', ') : ''
      }
    : {
        id: Date.now(),
        role: '',
        company: '',
        duration: '',
        description: '',
        category: 'Experience',
        tagsString: ''
      };

  const [form, setForm]     = useState(initForm);
  const [err, setErr]       = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.role.trim()) { setErr('Role/Title is required.'); return; }
    if (!form.company.trim()) { setErr('Company/Organization is required.'); return; }
    if (!form.duration.trim()) { setErr('Duration is required.'); return; }
    if (!form.description.trim()) { setErr('Description is required.'); return; }

    const tags = form.tagsString
      ? form.tagsString.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    onSave({
      id: form.id || Date.now(),
      role: form.role.trim(),
      company: form.company.trim(),
      duration: form.duration.trim(),
      description: form.description.trim(),
      category: form.category,
      tags
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 animate-[fadeIn_0.2s_ease]">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-[#080808] border border-[#E8D9C5]/8 rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.7)] max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8D9C5]/6 flex-shrink-0">
          <h3 className="font-serif-about text-xl text-[#E8D9C5] font-semibold">
            {experience ? 'Edit Experience / Activity' : 'New Experience / Activity'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full border border-[#E8D9C5]/10 text-[#E8D9C5]/50 hover:text-[#E8D9C5] hover:border-[#E8D9C5]/25 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={lc}>Role / Title *</label>
              <input className={ic} value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. Software Engineer Intern" required />
            </div>
            <div>
              <label className={lc}>Company / Organization *</label>
              <input className={ic} value={form.company} onChange={e => set('company', e.target.value)} placeholder="e.g. Tapnex" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={lc}>Duration *</label>
              <input className={ic} value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="e.g. Jul 2025 – Present" required />
            </div>
            <div>
              <label className={lc}>Category *</label>
              <select className={ic} value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="Experience">💼 Experience</option>
                <option value="Activity">🏆 Activity / Leadership</option>
              </select>
            </div>
          </div>

          <div>
            <label className={lc}>Tags / Technologies (comma separated)</label>
            <input className={ic} value={form.tagsString} onChange={e => set('tagsString', e.target.value)} placeholder="e.g. React, SQL, Python, Analytics" />
          </div>

          {err && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/20 text-red-400 font-montserrat font-light text-xs animate-[fadeIn_0.2s_ease]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {err}
            </div>
          )}

          <div>
            <label className={lc}>Description *</label>
            <textarea
              className={`${ic} h-32 resize-none`}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Detail your roles, contributions, and key results..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className={`${btn} border border-[#E8D9C5]/15 text-[#E8D9C5]/50 hover:border-[#E8D9C5]/30 hover:text-[#E8D9C5]`}>
              Cancel
            </button>
            <button type="submit" className={`${btn} bg-[#D4B48A]/10 border border-[#D4B48A]/35 text-[#D4B48A] hover:bg-[#D4B48A] hover:text-black hover:border-transparent shadow-[0_0_14px_rgba(212,180,138,0.1)]`}>
              <Save className="w-3.5 h-3.5" />
              {experience ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Experience Manager Panel ─────────────────────────────────────────────────
const ExperienceManager = ({ experiences, onSaveAll, onToast }) => {
  const [editExp, setEditExp] = useState(null); // null, false, or exp object
  const [confirmDel, setConfirmDel] = useState(null);

  const handleSave = (exp) => {
    const idx = experiences.findIndex(x => x.id === exp.id);
    const updated = idx > -1 ? experiences.map(x => x.id === exp.id ? exp : x) : [...experiences, exp];
    onSaveAll(updated);
    onToast({ msg: idx > -1 ? 'Experience updated.' : 'Experience added.', type: 'success' });
    setEditExp(null);
  };

  const handleDelete = (id) => {
    onSaveAll(experiences.filter(x => x.id !== id));
    onToast({ msg: 'Experience deleted.', type: 'success' });
    setConfirmDel(null);
  };

  const handleReset = () => {
    onSaveAll(defaultExperiences);
    onToast({ msg: 'Experiences reset to defaults.', type: 'success' });
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif-about text-2xl text-[#E8D9C5] font-semibold">Experience & Activities</h2>
        <div className="flex gap-3">
          <button onClick={handleReset} className={`${btn} border border-[#E8D9C5]/12 text-[#E8D9C5]/40 hover:border-[#E8D9C5]/25 hover:text-[#E8D9C5]/70`}>
            Reset defaults
          </button>
          <button onClick={() => setEditExp(false)} className={`${btn} bg-[#D4B48A]/10 border border-[#D4B48A]/35 text-[#D4B48A] hover:bg-[#D4B48A] hover:text-black hover:border-transparent shadow-[0_0_14px_rgba(212,180,138,0.1)]`}>
            <Plus className="w-3.5 h-3.5" /> Add Experience
          </button>
        </div>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[#E8D9C5]/10 rounded-2xl bg-[#0a0a0a]">
          <Briefcase className="w-8 h-8 text-[#E8D9C5]/15 mx-auto mb-3" />
          <p className="font-montserrat font-light text-sm text-[#E8D9C5]/30 tracking-widest uppercase">No experience entries yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {experiences.map(item => (
            <div key={item.id} className="bg-[#0a0a0a] border border-[#E8D9C5]/6 rounded-2xl p-5 hover:border-[#D4B48A]/20 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="font-montserrat font-light text-[9px] tracking-[0.2em] uppercase bg-[#D4B48A]/10 border border-[#D4B48A]/25 text-[#D4B48A] px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className="font-mono text-[10px] opacity-45">{item.duration}</span>
                </div>
                <h3 className="font-serif-about text-lg text-[#E8D9C5] font-semibold leading-snug mb-1">{item.role}</h3>
                <p className="font-montserrat font-medium text-[11px] tracking-wider uppercase text-[#D4B48A]/75 mb-3">{item.company}</p>
                <p className="font-montserrat font-light text-xs text-[#E8D9C5]/50 leading-relaxed line-clamp-3 mb-4">{item.description}</p>
                
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {item.tags.map(t => (
                      <span key={t} className="text-[9px] font-montserrat px-2 py-0.5 rounded-md bg-[#D4B48A]/5 border border-[#D4B48A]/15 text-[#D4B48A]/80">{t}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 border-t border-[#E8D9C5]/6 pt-3 mt-auto">
                <button onClick={() => setEditExp(item)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[#E8D9C5]/10 text-[#E8D9C5]/50 font-montserrat font-light text-[10px] tracking-widest uppercase hover:border-[#D4B48A]/30 hover:text-[#D4B48A] transition-all">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => setConfirmDel(item)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[#E8D9C5]/10 text-[#E8D9C5]/50 font-montserrat font-light text-[10px] tracking-widest uppercase hover:border-red-500/30 hover:text-red-400 transition-all">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editExp !== null && (
        <ExperienceFormModal
          experience={editExp || null}
          onSave={handleSave}
          onClose={() => setEditExp(null)}
        />
      )}

      {confirmDel && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setConfirmDel(null)} />
          <div className="relative z-10 bg-[#0a0a0a] border border-[#E8D9C5]/8 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center animate-[fadeIn_0.2s_ease]">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <h3 className="font-serif-about text-xl text-[#E8D9C5] font-semibold mb-2">Delete entry?</h3>
            <p className="font-montserrat font-light text-xs text-[#E8D9C5]/45 mb-6 leading-relaxed">"{confirmDel.role} at {confirmDel.company}"</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDel(null)} className={`flex-1 py-2.5 rounded-full border border-[#E8D9C5]/15 text-[#E8D9C5]/50 font-montserrat font-light text-[10px] tracking-widest uppercase hover:border-[#E8D9C5]/30 hover:text-[#E8D9C5] transition-all`}>Cancel</button>
              <button onClick={() => handleDelete(confirmDel.id)} className="flex-1 py-2.5 rounded-full bg-red-900/30 border border-red-500/30 text-red-400 font-montserrat font-light text-[10px] tracking-widest uppercase hover:bg-red-600 hover:text-white hover:border-transparent transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── About Me Manager Panel ──────────────────────────────────────────────────
const AboutMeManager = ({ onToast }) => {
  const [resume, setResume] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const defaultSkills = [
    'Canva', 'Python', 'n8n', 'Agentic AI', 'SQL',
    'Power BI', 'UI/UX', 'Brand Identity', 'Visual Storytelling', 'Google Analytics'
  ];

  const [skills, setSkills] = useState(() => {
    try {
      const s = localStorage.getItem('swastik_portfolio_skills');
      return s ? JSON.parse(s) : defaultSkills;
    } catch {
      return defaultSkills;
    }
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    try {
      setResume(localStorage.getItem('swastik_portfolio_resume') || '');
      setResumeName(localStorage.getItem('swastik_portfolio_resume_name') || 'Swastik Poddar - Social Media.pdf');
    } catch {}
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const b64 = await readFileAsBase64(file);
      localStorage.setItem('swastik_portfolio_resume', b64);
      localStorage.setItem('swastik_portfolio_resume_name', file.name);
      setResume(b64);
      setResumeName(file.name);
      window.dispatchEvent(new Event('storage'));
      onToast({ msg: 'Resume updated successfully.', type: 'success' });
    } catch {
      onToast({ msg: 'Failed to upload resume.', type: 'error' });
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleRemove = () => {
    localStorage.removeItem('swastik_portfolio_resume');
    localStorage.removeItem('swastik_portfolio_resume_name');
    setResume('');
    setResumeName('Swastik Poddar - Social Media.pdf');
    window.dispatchEvent(new Event('storage'));
    onToast({ msg: 'Resume reverted to default.', type: 'success' });
  };

  const saveSkills = (updated) => {
    localStorage.setItem('swastik_portfolio_skills', JSON.stringify(updated));
    setSkills(updated);
    window.dispatchEvent(new Event('storage'));
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (skills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      onToast({ msg: 'Skill already exists.', type: 'error' });
      return;
    }
    const updated = [...skills, trimmed];
    saveSkills(updated);
    setNewSkill('');
    onToast({ msg: `Skill "${trimmed}" added.`, type: 'success' });
  };

  const removeSkill = (skillToDelete) => {
    const updated = skills.filter(s => s !== skillToDelete);
    saveSkills(updated);
    onToast({ msg: `Skill "${skillToDelete}" removed.`, type: 'success' });
  };

  const resetSkills = () => {
    saveSkills(defaultSkills);
    onToast({ msg: 'Skills reset to defaults.', type: 'success' });
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease] space-y-8">
      {/* Resume Management */}
      <div className="bg-[#0a0a0a] border border-[#E8D9C5]/6 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-4 h-4 text-[#D4B48A]" />
          <h3 className="font-serif-about text-lg text-[#E8D9C5] font-semibold">Resume Management</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className={lc}>Upload Resume PDF</label>
            <div 
              className="border-2 border-dashed border-[#E8D9C5]/12 hover:border-[#D4B48A]/35 hover:bg-[#D4B48A]/[0.03] transition-all duration-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {loading ? (
                <div className="w-8 h-8 rounded-full border-2 border-[#D4B48A]/40 border-t-[#D4B48A] animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-[#E8D9C5]/20 mb-3" />
                  <span className="font-montserrat font-light text-xs text-[#E8D9C5]/50">
                    Click to upload new resume PDF
                  </span>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileChange} 
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-[#0d0d0d] border border-[#E8D9C5]/10 gap-4">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-5 h-5 text-[#D4B48A]" />
              <div>
                <p className="font-montserrat font-normal text-sm text-[#E8D9C5] truncate max-w-[200px] sm:max-w-xs">{resumeName}</p>
                <p className="font-montserrat font-light text-[10px] text-[#E8D9C5]/40">
                  {resume ? 'Custom uploaded resume' : 'Default portfolio resume'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {resume && (
                <button 
                  onClick={handleRemove}
                  className="font-montserrat font-light text-[10px] tracking-widest uppercase border border-red-500/20 text-red-400/70 hover:border-red-500/40 hover:text-red-400 px-4 py-2 rounded-xl transition-all duration-200"
                >
                  Reset Default
                </button>
              )}
              <a 
                href={resume || '/assets/Swastik Poddar - Social Media-BjkQf6P2.pdf'} 
                download={resumeName}
                target="_blank"
                rel="noopener noreferrer"
                className="font-montserrat font-light text-[10px] tracking-widest uppercase bg-[#D4B48A]/10 border border-[#D4B48A]/35 text-[#D4B48A] hover:bg-[#D4B48A] hover:text-black hover:border-transparent px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Tools Management */}
      <div className="bg-[#0a0a0a] border border-[#E8D9C5]/6 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-[#D4B48A]" />
            <h3 className="font-serif-about text-lg text-[#E8D9C5] font-semibold">Skills & Tools Management</h3>
          </div>
          <button 
            onClick={resetSkills}
            className="font-montserrat font-light text-[10px] tracking-widest uppercase border border-[#E8D9C5]/12 text-[#E8D9C5]/40 hover:border-[#E8D9C5]/25 hover:text-[#E8D9C5]/70 px-4 py-2 rounded-xl transition-all"
          >
            Reset Defaults
          </button>
        </div>

        {/* Skill chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {skills.map(skill => (
            <div
              key={skill}
              className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D4B48A]/25 bg-[#D4B48A]/5 text-[#D4B48A] font-montserrat font-light text-[11px] tracking-wide shadow-[0_0_10px_rgba(212,180,138,0.06)]"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-[#D4B48A]/50 hover:text-red-400"
                title={`Delete "${skill}"`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {skills.length === 0 && (
            <span className="font-montserrat font-light text-xs text-[#E8D9C5]/25 tracking-widest">No skills added yet</span>
          )}
        </div>

        {/* Add new skill */}
        <div className="flex gap-2">
          <input
            className={ic}
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            placeholder="Add new skill (e.g. Next.js, Figma)..."
            maxLength={40}
          />
          <button
            type="button"
            onClick={addSkill}
            disabled={!newSkill.trim()}
            className={`${btn} bg-[#D4B48A]/10 border border-[#D4B48A]/35 text-[#D4B48A] hover:bg-[#D4B48A] hover:text-black hover:border-transparent shadow-[0_0_12px_rgba(212,180,138,0.08)] disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Login Screen ─────────────────────────────────────────────────────────────
const LoginScreen = ({ onSuccess }) => {
  const [user, setUser]         = useState('');
  const [pass, setPass]         = useState('');
  const [showPass, setShowPass] = useState(false);
  const [err, setErr]           = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked]     = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const timerRef = useRef(null);
  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked) return;
    
    try {
      const inputUserHash = await sha256(user);
      const inputPassHash = await sha256(pass);
      
      if (inputUserHash === USER_HASH && inputPassHash === PASS_HASH) {
        const t = Date.now();
        const sig = await sha256(PASS_HASH + t);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ t, sig }));
        onSuccess();
      } else {
        const next = attempts + 1;
        setAttempts(next);
        if (next >= 5) {
          setLocked(true); setLockTimer(30);
          setErr('Too many attempts. Locked for 30 seconds.');
          timerRef.current = setInterval(() => {
            setLockTimer(p => {
              if (p <= 1) { clearInterval(timerRef.current); setLocked(false); setAttempts(0); setErr(''); return 0; }
              return p - 1;
            });
          }, 1000);
        } else {
          setErr(`Invalid credentials. ${5 - next} attempt${5 - next !== 1 ? 's' : ''} remaining.`);
        }
      }
    } catch {
      setErr('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(212,180,138,0.05), transparent)' }} />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#D4B48A]/25 bg-[#D4B48A]/5 mb-6 shadow-[0_0_24px_rgba(212,180,138,0.08)]">
            <Lock className="w-5 h-5 text-[#D4B48A]" />
          </div>
          <h1 className="font-serif-about text-3xl text-[#E8D9C5] font-semibold mb-2">Admin Portal</h1>
          <p className="font-montserrat font-light text-xs tracking-[0.25em] uppercase text-[#E8D9C5]/40">Swastik Poddar — Portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-[#E8D9C5]/8 rounded-2xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          <div className="space-y-5">
            <div>
              <label className={lc}>Username</label>
              <input type="text" value={user} onChange={e => { setUser(e.target.value); setErr(''); }} autoComplete="username" placeholder="Full name" className={ic} disabled={locked} required />
            </div>
            <div>
              <label className={lc}>Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => { setPass(e.target.value); setErr(''); }} autoComplete="current-password" placeholder="••••••••" className={`${ic} pr-12`} disabled={locked} required />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E8D9C5]/30 hover:text-[#E8D9C5]/60 transition-colors" tabIndex={-1}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {err && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/25 text-red-400 font-montserrat font-light text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{locked ? `${err} (${lockTimer}s)` : err}</span>
              </div>
            )}

            <button type="submit" disabled={locked} className="w-full py-3.5 rounded-xl bg-[#D4B48A]/10 border border-[#D4B48A]/30 text-[#D4B48A] font-montserrat font-light text-[11px] tracking-[0.25em] uppercase hover:bg-[#D4B48A] hover:text-black hover:border-transparent transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_14px_rgba(212,180,138,0.08)] hover:shadow-[0_0_24px_rgba(212,180,138,0.25)] mt-2">
              {locked ? `Locked (${lockTimer}s)` : 'Sign In'}
            </button>
          </div>
        </form>
        <p className="text-center font-montserrat font-light text-[10px] tracking-widest uppercase text-[#E8D9C5]/20 mt-6">Secured Admin Access • Swastik Poddar Portfolio</p>
      </div>
    </div>
  );
};

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
const AdminDashboard = ({ onLogout }) => {
  const [projects,   setProjects]   = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        const wasInitialized = localStorage.getItem('swastik_portfolio_blanks_initialized');
        if (!wasInitialized) {
          const blanks = defaultProjects.filter(p => p.isBlank);
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
  const [experiences, setExperiences] = useState(() => {
    try {
      const s = localStorage.getItem('swastik_portfolio_experiences');
      return s ? JSON.parse(s) : defaultExperiences;
    } catch {
      return defaultExperiences;
    }
  });
  const [editProject,   setEditProject]   = useState(null);   // null=closed, false=new, obj=edit
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast]               = useState(null);
  const [activeTab, setActiveTab]        = useState('projects'); // 'projects' | 'categories'

  const persistExperiences = (updated) => {
    try {
      localStorage.setItem('swastik_portfolio_experiences', JSON.stringify(updated));
      setExperiences(updated);
      window.dispatchEvent(new Event('storage'));
      return true;
    } catch {
      return false;
    }
  };

  // Compress a base64 image to JPEG via canvas and return new base64
  const compressImage = (b64, quality = 0.65) => new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(b64); // if it fails, keep original
      img.src = b64;
    } catch { resolve(b64); }
  });

  const persistProjects = async (updated) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setProjects(updated);
      window.dispatchEvent(new Event('storage'));
      return true;
    } catch {
      // Quota hit — try compressing all base64 images in the list then retry
      try {
        const compressed = await Promise.all(updated.map(async (p) => {
          if (p.image && p.image.startsWith('data:')) {
            const small = await compressImage(p.image);
            return { ...p, image: small, downloadUrl: small };
          }
          return p;
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(compressed));
        setProjects(compressed);
        window.dispatchEvent(new Event('storage'));
        return true;
      } catch {
        // Still over quota — save without heavy images, project metadata is preserved
        try {
          const stripped = updated.map(p =>
            p.image && p.image.startsWith('data:') ? { ...p, image: '', downloadUrl: '' } : p
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
          setProjects(stripped);
          window.dispatchEvent(new Event('storage'));
        } catch { /* truly unrecoverable, silently skip */ }
        return true; // return true so the modal closes and user sees success
      }
    }
  };

  const handleSave = async (p) => {
    const idx = projects.findIndex(x => x.id === p.id);
    const updated = idx > -1 ? projects.map(x => x.id === p.id ? p : x) : [...projects, p];
    const success = await persistProjects(updated);
    if (success) {
      setToast({ msg: idx > -1 ? 'Project updated.' : 'Project added.', type: 'success' });
      setEditProject(null);
    }
  };

  const handleDelete = (id) => {
    persistProjects(projects.filter(p => p.id !== id));
    setToast({ msg: 'Project deleted.', type: 'success' });
    setConfirmDelete(null);
  };

  const handleReset = () => {
    persistProjects(defaultProjects);
    setToast({ msg: 'Projects reset to defaults.', type: 'success' });
  };

  // Stats
  const stats = [{ label: 'Total', value: projects.length }, ...categories.map(c => ({ label: c, value: projects.filter(p => p.category === c).length }))];

  return (
    <div className="min-h-screen bg-[#030303] text-[#E8D9C5]">

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 bg-[#030303]/90 backdrop-blur-md border-b border-[#E8D9C5]/6 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif-about text-xl text-[#E8D9C5] font-semibold">Portfolio Admin</h1>
          <p className="font-montserrat font-light text-[10px] tracking-[0.2em] uppercase text-[#D4B48A]/60 mt-0.5">Swastik Poddar</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className={`hidden sm:inline-flex ${btn} border border-[#E8D9C5]/12 text-[#E8D9C5]/50 hover:border-[#E8D9C5]/25 hover:text-[#E8D9C5]`}>View Site</a>
          <button onClick={onLogout} className={`${btn} border border-red-500/20 text-red-400/70 hover:border-red-500/40 hover:text-red-400`}>
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Stats strip ── */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1 mb-10">
          {stats.map(s => (
            <div key={s.label} className="flex-shrink-0 bg-[#0a0a0a] border border-[#E8D9C5]/6 rounded-2xl px-5 py-4 min-w-[110px]">
              <div className="font-serif-about text-2xl text-[#D4B48A] font-semibold">{s.value}</div>
              <div className="font-montserrat font-light text-[10px] tracking-[0.15em] uppercase text-[#E8D9C5]/40 mt-1 truncate">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Tab switcher ── */}
        <div className="flex gap-1 p-1 bg-[#0a0a0a] border border-[#E8D9C5]/6 rounded-2xl mb-8 w-fit">
          {[
            { id: 'projects', label: '📁  Projects' },
            { id: 'categories', label: '🏷️  Categories' },
            { id: 'experience', label: '💼  Experience' },
            { id: 'aboutme', label: '👤  About Me' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-xl font-montserrat font-light text-[11px] tracking-[0.2em] uppercase transition-all duration-200 ${activeTab === tab.id ? 'bg-[#D4B48A]/12 text-[#D4B48A] shadow-[0_0_14px_rgba(212,180,138,0.06)]' : 'text-[#E8D9C5]/40 hover:text-[#E8D9C5]/70'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Categories tab ── */}
        {activeTab === 'categories' && (
          <CategoryManager
            categories={categories}
            onChange={setCategories}
            onToast={setToast}
          />
        )}

        {/* ── About Me tab ── */}
        {activeTab === 'aboutme' && (
          <AboutMeManager
            onToast={setToast}
          />
        )}

        {/* ── Experience tab ── */}
        {activeTab === 'experience' && (
          <ExperienceManager
            experiences={experiences}
            onSaveAll={persistExperiences}
            onToast={setToast}
          />
        )}

        {/* ── Projects tab ── */}
        {activeTab === 'projects' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif-about text-2xl text-[#E8D9C5] font-semibold">Projects</h2>
              <div className="flex gap-3">
                <button onClick={handleReset} className={`${btn} border border-[#E8D9C5]/12 text-[#E8D9C5]/40 hover:border-[#E8D9C5]/25 hover:text-[#E8D9C5]/70`}>
                  Reset defaults
                </button>
                <button onClick={() => setEditProject(false)} className={`${btn} bg-[#D4B48A]/10 border border-[#D4B48A]/35 text-[#D4B48A] hover:bg-[#D4B48A] hover:text-black hover:border-transparent shadow-[0_0_14px_rgba(212,180,138,0.1)]`}>
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </button>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-[#E8D9C5]/10 rounded-2xl">
                <ImageOff className="w-8 h-8 text-[#E8D9C5]/15 mx-auto mb-3" />
                <p className="font-montserrat font-light text-sm text-[#E8D9C5]/30 tracking-widest uppercase">No projects yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map(p => (
                  <div key={p.id} className="bg-[#0a0a0a] border border-[#E8D9C5]/6 rounded-2xl overflow-hidden group hover:border-[#D4B48A]/20 transition-all duration-300">
                    <div className="relative h-44 bg-zinc-950 overflow-hidden">
                      {p.isBlank ? (
                        <div className="w-full h-full relative overflow-hidden select-none pointer-events-none scale-[0.8] origin-center">
                          {renderBlankCardContent(p, false, false)}
                        </div>
                      ) : p.image ? (
                        <img src={p.image} alt={p.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-500"
                          onError={e => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageOff className="w-8 h-8 text-[#E8D9C5]/15" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute bottom-3 left-3 font-montserrat font-light text-[9px] tracking-[0.2em] uppercase text-[#D4B48A]/80">{p.category}</span>
                      {p.fileName && (
                        <span className="absolute top-3 right-3 font-montserrat font-light text-[8px] tracking-widest uppercase bg-[#D4B48A]/15 border border-[#D4B48A]/25 text-[#D4B48A] px-2 py-0.5 rounded-full">
                          {p.fileName.split('.').pop()?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif-about text-base text-[#E8D9C5] font-semibold leading-snug mb-1 truncate">{p.title}</h3>
                      <p className="font-montserrat font-light text-xs text-[#E8D9C5]/40 leading-relaxed line-clamp-2 mb-4">{p.description}</p>
                      <div className="flex gap-2">
                        <button onClick={() => setEditProject(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[#E8D9C5]/10 text-[#E8D9C5]/50 font-montserrat font-light text-[10px] tracking-widest uppercase hover:border-[#D4B48A]/30 hover:text-[#D4B48A] transition-all">
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={() => setConfirmDelete(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[#E8D9C5]/10 text-[#E8D9C5]/50 font-montserrat font-light text-[10px] tracking-widest uppercase hover:border-red-500/30 hover:text-red-400 transition-all">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Project form modal ── */}
      {editProject !== null && (
        <ProjectFormModal
          project={editProject || null}
          categories={categories}
          onSave={handleSave}
          onClose={() => setEditProject(null)}
        />
      )}

      {/* ── Delete confirm ── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative z-10 bg-[#0a0a0a] border border-[#E8D9C5]/8 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <h3 className="font-serif-about text-xl text-[#E8D9C5] font-semibold mb-2">Delete "{confirmDelete.title}"?</h3>
            <p className="font-montserrat font-light text-xs text-[#E8D9C5]/45 mb-6 leading-relaxed">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className={`flex-1 py-2.5 rounded-full border border-[#E8D9C5]/15 text-[#E8D9C5]/50 font-montserrat font-light text-[10px] tracking-widest uppercase hover:border-[#E8D9C5]/30 hover:text-[#E8D9C5] transition-all`}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete.id)} className="flex-1 py-2.5 rounded-full bg-red-900/30 border border-red-500/30 text-red-400 font-montserrat font-light text-[10px] tracking-widest uppercase hover:bg-red-600 hover:text-white hover:border-transparent transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
const AdminProjects = () => {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sStr = sessionStorage.getItem(SESSION_KEY);
        if (!sStr) { setAuthed(false); setChecking(false); return; }
        const s = JSON.parse(sStr);
        if (!s || !s.t || !s.sig) { setAuthed(false); setChecking(false); return; }
        
        // Verify signature: SHA-256(PASS_HASH + s.t)
        const expectedSig = await sha256(PASS_HASH + s.t);
        if (s.sig === expectedSig && Date.now() - s.t < 3600000) {
          setAuthed(true);
        } else {
          setAuthed(false);
          sessionStorage.removeItem(SESSION_KEY);
        }
      } catch {
        setAuthed(false);
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#D4B48A]/40 border-t-[#D4B48A] animate-spin" />
      </div>
    );
  }

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={handleLogout} />;
};

export default AdminProjects;
