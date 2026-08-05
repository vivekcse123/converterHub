/** Visual tokens the canvas blocks use so editing a section actually looks
 *  like the active theme, not one generic style tinted by accent color.
 *  Each theme has a fixed light/dark character (independent of the builder
 *  app's own light/dark toggle) — e.g. Noir is always dark, Aurora always
 *  light — matching what the published page will actually look like. */
export interface ThemePreset {
  fontClass: string;
  pageBg: string;       // canvas backdrop
  pageText: string;     // base text color on that backdrop
  card: string;         // block/item container
  heading: string;      // small section eyebrow ("About", "Projects"...)
  title: string;        // primary title text (hero headline, item title)
  body: string;         // body/paragraph text
  chip: string;         // pill/tag style
  imageRadius: string;
  ctaClass: string;     // primary button
}

const PRESETS: Record<string, ThemePreset> = {
  aurora: {
    fontClass: 'font-sans',
    pageBg: 'bg-white',
    pageText: 'text-slate-800',
    card: 'rounded-2xl border border-slate-200 bg-white',
    heading: 'text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400',
    title: 'font-bold text-slate-900 tracking-tight',
    body: 'text-slate-600 leading-relaxed',
    chip: 'rounded-full bg-slate-100 text-slate-600',
    imageRadius: 'rounded-xl',
    ctaClass: 'rounded-full text-white font-semibold',
  },
  noir: {
    fontClass: 'font-sans',
    pageBg: 'bg-slate-950',
    pageText: 'text-slate-100',
    card: 'rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-xl',
    heading: 'text-[11px] font-bold uppercase tracking-[0.15em] text-primary-300',
    title: 'font-extrabold text-white tracking-tight',
    body: 'text-slate-300 leading-relaxed',
    chip: 'rounded-full bg-white/10 border border-white/10 text-slate-200',
    imageRadius: 'rounded-2xl',
    ctaClass: 'rounded-full text-white font-bold shadow-lg',
  },
  terminal: {
    fontClass: 'font-mono',
    pageBg: 'bg-[#0b0f14]',
    pageText: 'text-slate-300',
    card: 'rounded-xl border border-white/10 bg-[#11161d]',
    heading: 'text-[11px] text-slate-500',
    title: 'font-bold text-white',
    body: 'text-slate-300 leading-relaxed',
    chip: 'rounded bg-white/5 text-emerald-400 border border-white/10',
    imageRadius: 'rounded-lg',
    ctaClass: 'rounded-md font-bold border-2',
  },
  studio: {
    fontClass: 'font-sans',
    pageBg: 'bg-[#fdfaf6]',
    pageText: 'text-slate-900',
    card: 'rounded-[24px] border-2 border-slate-900 bg-white',
    heading: 'text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg inline-block bg-slate-900 text-white',
    title: 'font-black tracking-tight text-slate-900',
    body: 'text-slate-600 leading-relaxed font-medium',
    chip: 'rounded-xl bg-slate-900 text-white font-bold',
    imageRadius: 'rounded-[20px]',
    ctaClass: 'rounded-2xl text-white font-bold',
  },
  classic: {
    fontClass: 'font-sans',
    pageBg: 'bg-white',
    pageText: 'text-slate-800',
    card: 'rounded-md border border-slate-200 bg-white',
    heading: 'text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400',
    title: 'font-bold text-slate-900',
    body: 'text-slate-600 leading-relaxed',
    chip: 'rounded border border-slate-200 text-slate-500',
    imageRadius: 'rounded-md',
    ctaClass: 'rounded-none text-white font-semibold underline underline-offset-4',
  },
};

export function getThemePreset(templateId: string | undefined): ThemePreset {
  return PRESETS[templateId ?? 'aurora'] ?? PRESETS['aurora'];
}
