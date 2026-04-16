export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  category: ToolCategory;
  acceptedFormats: string[];
  outputFormat: string;
  color: string;
  badge?: string;
}

export type ToolCategory = 'pdf' | 'image' | 'document' | 'archive';

export const TOOLS: Tool[] = [
  // ── Original PDF tools ───────────────────────────────────────────────────────
  { id: 'image-to-pdf',     title: 'Image to PDF',       description: 'Convert JPG, PNG, or WebP images into a single PDF document.',               icon: '🖼️',  route: '/image-to-pdf',     category: 'pdf',      acceptedFormats: ['.jpg','.png','.webp'],   outputFormat: 'PDF',    color: 'from-blue-500 to-cyan-500',       badge: 'Popular' },
  { id: 'pdf-to-word',      title: 'PDF to Word',        description: 'Extract content from a PDF and save it as an editable .docx file.',          icon: '📄',  route: '/pdf-to-word',      category: 'document', acceptedFormats: ['.pdf'],                  outputFormat: 'DOCX',   color: 'from-violet-500 to-purple-600' },
  { id: 'word-to-pdf',      title: 'Word to PDF',        description: 'Convert your .docx Word documents into a professional PDF.',                 icon: '📝',  route: '/word-to-pdf',      category: 'pdf',      acceptedFormats: ['.doc','.docx'],          outputFormat: 'PDF',    color: 'from-indigo-500 to-blue-600' },
  { id: 'pdf-editor',       title: 'PDF Editor',         description: 'Merge, split, compress and reorder pages inside PDFs.',                      icon: '🔧',  route: '/pdf-editor',       category: 'pdf',      acceptedFormats: ['.pdf'],                  outputFormat: 'PDF',    color: 'from-orange-500 to-red-500' },
  { id: 'image-editor',     title: 'Image Editor',       description: 'Resize, crop, compress, or convert your images.',                            icon: '🎨',  route: '/image-editor',     category: 'image',    acceptedFormats: ['.jpg','.png','.webp'],   outputFormat: 'JPG/PNG', color: 'from-pink-500 to-rose-500' },
  { id: 'compress',         title: 'File Compressor',    description: 'Compress images and bundle multiple files into a ZIP archive.',              icon: '🗜️',  route: '/compress',         category: 'archive',  acceptedFormats: ['.jpg','.png','.pdf'],    outputFormat: 'ZIP',    color: 'from-emerald-500 to-teal-500' },
  { id: 'text-to-pdf',      title: 'Text to PDF',        description: 'Turn plain text or notes into a clean, formatted PDF.',                      icon: '📃',  route: '/text-to-pdf',      category: 'pdf',      acceptedFormats: ['.txt'],                  outputFormat: 'PDF',    color: 'from-amber-400 to-orange-500' },

  // ── Advanced PDF tools ────────────────────────────────────────────────────────
  { id: 'pdf-to-jpg',       title: 'PDF to JPG',         description: 'Export every PDF page as a high-resolution JPG, PNG, or WebP image.',        icon: '🖼️',  route: '/pdf-to-jpg',       category: 'pdf',      acceptedFormats: ['.pdf'],                  outputFormat: 'JPG',    color: 'from-sky-500 to-blue-600',        badge: 'New' },
  { id: 'watermark-pdf',    title: 'Watermark PDF',      description: 'Add a diagonal text watermark to every page of your PDF.',                   icon: '🔒',  route: '/watermark-pdf',    category: 'pdf',      acceptedFormats: ['.pdf'],                  outputFormat: 'PDF',    color: 'from-rose-500 to-pink-600',       badge: 'New' },
  { id: 'sign-pdf',         title: 'Sign PDF',           description: 'Place a signature image on any page of your PDF document.',                  icon: '✍️',  route: '/sign-pdf',         category: 'pdf',      acceptedFormats: ['.pdf'],                  outputFormat: 'PDF',    color: 'from-violet-500 to-indigo-600',   badge: 'New' },
  { id: 'redact-pdf',       title: 'Redact PDF',         description: 'Permanently black-out sensitive content regions in your PDF.',               icon: '⬛',  route: '/redact-pdf',       category: 'pdf',      acceptedFormats: ['.pdf'],                  outputFormat: 'PDF',    color: 'from-slate-600 to-slate-800',     badge: 'New' },
  { id: 'page-numbers',     title: 'Add Page Numbers',   description: 'Automatically insert page numbers on every page of a PDF.',                  icon: '🔢',  route: '/page-numbers',     category: 'pdf',      acceptedFormats: ['.pdf'],                  outputFormat: 'PDF',    color: 'from-teal-500 to-cyan-600' },
  { id: 'pdf-to-pdfa',      title: 'PDF to PDF/A',       description: 'Convert a PDF to the archival PDF/A standard for long-term storage.',        icon: '🗄️',  route: '/pdf-to-pdfa',      category: 'pdf',      acceptedFormats: ['.pdf'],                  outputFormat: 'PDF/A',  color: 'from-amber-500 to-orange-600' },
  { id: 'compare-pdfs',     title: 'Compare PDFs',       description: 'Get a word-level diff report between two PDF documents.',                    icon: '🔍',  route: '/compare-pdfs',     category: 'pdf',      acceptedFormats: ['.pdf'],                  outputFormat: 'HTML',   color: 'from-lime-500 to-green-600',      badge: 'New' },
  { id: 'ocr',              title: 'OCR',                description: 'Extract text from scanned PDFs and images using optical character recognition.',icon: '📷', route: '/ocr',              category: 'pdf',      acceptedFormats: ['.pdf','image/*'],        outputFormat: 'TXT',    color: 'from-cyan-500 to-blue-500',       badge: 'New' },

  // ── Extended converters───────────────────────────────────────────────────────
  { id: 'pdf-to-txt',       title: 'PDF to TXT',         description: 'Extract plain text content from any PDF file.',                              icon: '📑',  route: '/pdf-to-txt',       category: 'document', acceptedFormats: ['.pdf'],                  outputFormat: 'TXT',    color: 'from-slate-400 to-slate-600' },
  { id: 'pdf-to-markdown',  title: 'PDF to Markdown',    description: 'Convert PDF content into clean Markdown (.md) format.',                     icon: '📋',  route: '/pdf-to-markdown',  category: 'document', acceptedFormats: ['.pdf'],                  outputFormat: 'MD',     color: 'from-indigo-400 to-purple-500' },
  { id: 'pdf-to-json',      title: 'PDF to JSON',        description: 'Parse PDF structure and text into a structured JSON document.',              icon: '📦',  route: '/pdf-to-json',      category: 'document', acceptedFormats: ['.pdf'],                  outputFormat: 'JSON',   color: 'from-yellow-400 to-amber-500' },
  { id: 'pdf-to-csv',       title: 'PDF to CSV',         description: 'Extract tabular data from PDFs and save as a CSV spreadsheet.',             icon: '📊',  route: '/pdf-to-csv',       category: 'document', acceptedFormats: ['.pdf'],                  outputFormat: 'CSV',    color: 'from-green-400 to-emerald-500' },
  { id: 'pdf-to-epub',      title: 'PDF to EPUB',        description: 'Convert a PDF into an eBook (EPUB) for Kindle and e-readers.',              icon: '📚',  route: '/pdf-to-epub',      category: 'document', acceptedFormats: ['.pdf'],                  outputFormat: 'EPUB',   color: 'from-purple-400 to-violet-500', badge: 'New' },
  { id: 'pdf-to-pptx',      title: 'PDF to PowerPoint',  description: 'Convert PDF pages into editable PowerPoint slides.',                        icon: '📊',  route: '/pdf-to-pptx',      category: 'document', acceptedFormats: ['.pdf'],                  outputFormat: 'PPTX',   color: 'from-orange-400 to-red-500',    badge: 'New' },
  { id: 'pdf-to-excel',     title: 'PDF to Excel',       description: 'Extract tables from PDF documents and export to Excel (.xlsx).',            icon: '📈',  route: '/pdf-to-excel',     category: 'document', acceptedFormats: ['.pdf'],                  outputFormat: 'XLSX',   color: 'from-green-500 to-teal-600',    badge: 'New' },
  { id: 'heic-to-jpg',      title: 'HEIC to JPG',        description: 'Convert Apple HEIC/HEIF photos to universally compatible JPG.',             icon: '📷',  route: '/heic-to-jpg',      category: 'image',    acceptedFormats: ['.heic','.heif'],         outputFormat: 'JPG',    color: 'from-sky-400 to-blue-500',       badge: 'New' },
  { id: 'gif-to-pdf',       title: 'GIF to PDF',         description: 'Convert animated or static GIF frames into a multi-page PDF.',              icon: '🎞️',  route: '/gif-to-pdf',       category: 'pdf',      acceptedFormats: ['.gif'],                  outputFormat: 'PDF',    color: 'from-fuchsia-400 to-pink-500' },
  { id: 'markdown-to-pdf',  title: 'Markdown to PDF',    description: 'Render a Markdown (.md) file as a nicely formatted PDF.',                   icon: '⬇️',  route: '/markdown-to-pdf',  category: 'document', acceptedFormats: ['.md','.markdown','.txt'], outputFormat: 'PDF',   color: 'from-indigo-400 to-blue-500' },
  { id: 'csv-to-pdf',       title: 'CSV to PDF',         description: 'Convert a CSV spreadsheet into a formatted PDF table.',                     icon: '📋',  route: '/csv-to-pdf',       category: 'document', acceptedFormats: ['.csv'],                  outputFormat: 'PDF',    color: 'from-emerald-400 to-green-500' },
  { id: 'html-to-pdf',      title: 'HTML to PDF',        description: 'Convert an HTML file into a pixel-perfect PDF document.',                   icon: '🌐',  route: '/html-to-pdf',      category: 'document', acceptedFormats: ['.html','.htm'],          outputFormat: 'PDF',    color: 'from-orange-400 to-amber-500' },
  { id: 'svg-to-pdf',       title: 'SVG to PDF',         description: 'Convert scalable vector graphics to a high-quality print-ready PDF.',       icon: '🎨',  route: '/svg-to-pdf',       category: 'document', acceptedFormats: ['.svg'],                  outputFormat: 'PDF',    color: 'from-teal-400 to-cyan-500' },

];

// export const TOOLS: Tool[] = [
//   {
//     id: 'image-to-pdf',
//     title: 'Image to PDF',
//     description: 'Convert JPG, PNG, or WebP images into a single PDF document.',
//     icon: '🖼️',
//     route: '/image-to-pdf',
//     category: 'pdf',
//     acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.bmp'],
//     outputFormat: 'PDF',
//     color: 'from-blue-500 to-cyan-500',
//     badge: 'Popular',
//   },
//   {
//     id: 'pdf-to-word',
//     title: 'PDF to Word',
//     description: 'Extract content from a PDF and save it as an editable .docx file.',
//     icon: '📄',
//     route: '/pdf-to-word',
//     category: 'document',
//     acceptedFormats: ['.pdf'],
//     outputFormat: 'DOCX',
//     color: 'from-violet-500 to-purple-600',
//   },
//   {
//     id: 'word-to-pdf',
//     title: 'Word to PDF',
//     description: 'Convert your .docx Word documents into a professional PDF.',
//     icon: '📝',
//     route: '/word-to-pdf',
//     category: 'pdf',
//     acceptedFormats: ['.doc', '.docx'],
//     outputFormat: 'PDF',
//     color: 'from-indigo-500 to-blue-600',
//   },
//   {
//     id: 'pdf-editor',
//     title: 'PDF Editor',
//     description: 'Merge, split, compress and reorder pages inside PDFs.',
//     icon: '🔧',
//     route: '/pdf-editor',
//     category: 'pdf',
//     acceptedFormats: ['.pdf'],
//     outputFormat: 'PDF',
//     color: 'from-orange-500 to-red-500',
//     badge: 'New',
//   },
//   {
//     id: 'image-editor',
//     title: 'Image Editor',
//     description: 'Resize, crop, compress, or convert your images.',
//     icon: '🎨',
//     route: '/image-editor',
//     category: 'image',
//     acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
//     outputFormat: 'JPG / PNG / WebP',
//     color: 'from-pink-500 to-rose-500',
//   },
//   {
//     id: 'compress',
//     title: 'File Compressor',
//     description: 'Compress images and bundle multiple files into a ZIP archive.',
//     icon: '🗜️',
//     route: '/compress',
//     category: 'archive',
//     acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf'],
//     outputFormat: 'ZIP / Compressed',
//     color: 'from-emerald-500 to-teal-500',
//   },
//   {
//     id: 'text-to-pdf',
//     title: 'Text to PDF',
//     description: 'Turn plain text or notes into a clean, formatted PDF.',
//     icon: '📃',
//     route: '/text-to-pdf',
//     category: 'pdf',
//     acceptedFormats: ['.txt'],
//     outputFormat: 'PDF',
//     color: 'from-amber-400 to-orange-500',
//   },
// ];
