export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  category: ToolCategory;
  acceptedFormats: string[];
  outputFormat: string;
  color: string;        // Tailwind gradient class
  badge?: string;       // e.g. "Popular", "New"
}

export type ToolCategory = 'pdf' | 'image' | 'document' | 'archive';

export const TOOLS: Tool[] = [
  {
    id: 'image-to-pdf',
    title: 'Image to PDF',
    description: 'Convert JPG, PNG, or WebP images into a single PDF document.',
    icon: '🖼️',
    route: '/image-to-pdf',
    category: 'pdf',
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.bmp'],
    outputFormat: 'PDF',
    color: 'from-blue-500 to-cyan-500',
    badge: 'Popular',
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Extract content from a PDF and save it as an editable .docx file.',
    icon: '📄',
    route: '/pdf-to-word',
    category: 'document',
    acceptedFormats: ['.pdf'],
    outputFormat: 'DOCX',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Convert your .docx Word documents into a professional PDF.',
    icon: '📝',
    route: '/word-to-pdf',
    category: 'pdf',
    acceptedFormats: ['.doc', '.docx'],
    outputFormat: 'PDF',
    color: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'pdf-editor',
    title: 'PDF Editor',
    description: 'Merge, split, compress and reorder pages inside PDFs.',
    icon: '🔧',
    route: '/pdf-editor',
    category: 'pdf',
    acceptedFormats: ['.pdf'],
    outputFormat: 'PDF',
    color: 'from-orange-500 to-red-500',
    badge: 'New',
  },
  {
    id: 'image-editor',
    title: 'Image Editor',
    description: 'Resize, crop, compress, or convert your images.',
    icon: '🎨',
    route: '/image-editor',
    category: 'image',
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    outputFormat: 'JPG / PNG / WebP',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'compress',
    title: 'File Compressor',
    description: 'Compress images and bundle multiple files into a ZIP archive.',
    icon: '🗜️',
    route: '/compress',
    category: 'archive',
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf'],
    outputFormat: 'ZIP / Compressed',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'text-to-pdf',
    title: 'Text to PDF',
    description: 'Turn plain text or notes into a clean, formatted PDF.',
    icon: '📃',
    route: '/text-to-pdf',
    category: 'pdf',
    acceptedFormats: ['.txt'],
    outputFormat: 'PDF',
    color: 'from-amber-400 to-orange-500',
  },
];
