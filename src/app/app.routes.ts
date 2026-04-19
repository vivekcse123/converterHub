import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // ── Home ────────────────────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Universal ApnaConverter — Free Online File Converter',
  },

  // ── Auth ────────────────────────────────────────────────────────────────────
  { path: 'login',    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),       title: 'Login — ApnaConverter' },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent), title: 'Register — ApnaConverter' },

  // ── Protected ───────────────────────────────────────────────────────────────
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard], title: 'Dashboard — ApnaConverter' },

  // ── Admin (lazy) ────────────────────────────────────────────────────────────
  { path: 'admin', loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes), canActivate: [adminGuard] },

  // ── Original tools ──────────────────────────────────────────────────────────
  { path: 'image-to-pdf', loadComponent: () => import('./features/image-to-pdf/image-to-pdf.component').then(m => m.ImageToPdfComponent), title: 'Image to PDF — ApnaConverter' },
  { path: 'pdf-to-word',  loadComponent: () => import('./features/pdf-to-word/pdf-to-word.component').then(m => m.PdfToWordComponent),   title: 'PDF to Word — ApnaConverter' },
  { path: 'word-to-pdf',  loadComponent: () => import('./features/word-to-pdf/word-to-pdf.component').then(m => m.WordToPdfComponent),   title: 'Word to PDF — ApnaConverter' },
  { path: 'pdf-editor',   loadComponent: () => import('./features/pdf-editor/pdf-editor.component').then(m => m.PdfEditorComponent),     title: 'PDF Editor — ApnaConverter' },
  { path: 'image-editor', loadComponent: () => import('./features/image-editor/image-editor.component').then(m => m.ImageEditorComponent), title: 'Image Editor — ApnaConverter' },
  { path: 'compress',     loadComponent: () => import('./features/compress/compress.component').then(m => m.CompressComponent),           title: 'Compress — ApnaConverter' },
  { path: 'text-to-pdf',  loadComponent: () => import('./features/text-to-pdf/text-to-pdf.component').then(m => m.TextToPdfComponent),   title: 'Text to PDF — ApnaConverter' },

  // ── Advanced PDF tools ───────────────────────────────────────────────────────
  { path: 'pdf-to-jpg',      loadComponent: () => import('./features/pdf-to-jpg/pdf-to-jpg.component').then(m => m.PdfToJpgComponent),           title: 'PDF to JPG — ApnaConverter' },
  { path: 'watermark-pdf',   loadComponent: () => import('./features/watermark-pdf/watermark-pdf.component').then(m => m.WatermarkPdfComponent), title: 'Watermark PDF — ApnaConverter' },
  { path: 'sign-pdf',        loadComponent: () => import('./features/sign-pdf/sign-pdf.component').then(m => m.SignPdfComponent),                 title: 'Sign PDF — ApnaConverter' },
  { path: 'redact-pdf',      loadComponent: () => import('./features/redact-pdf/redact-pdf.component').then(m => m.RedactPdfComponent),           title: 'Redact PDF — ApnaConverter' },
  { path: 'page-numbers',    loadComponent: () => import('./features/page-numbers/page-numbers.component').then(m => m.PageNumbersComponent),     title: 'Add Page Numbers — ApnaConverter' },
  { path: 'pdf-to-pdfa',     loadComponent: () => import('./features/pdf-to-pdfa/pdf-to-pdfa.component').then(m => m.PdfToPdfaComponent),         title: 'PDF to PDF/A — ApnaConverter' },
  { path: 'compare-pdfs',    loadComponent: () => import('./features/compare-pdfs/compare-pdfs.component').then(m => m.ComparePdfsComponent),     title: 'Compare PDFs — ApnaConverter' },
  { path: 'ocr',             loadComponent: () => import('./features/ocr/ocr.component').then(m => m.OcrComponent),                               title: 'OCR — ApnaConverter' },

  // ── Extended converters ──────────────────────────────────────────────────────
  { path: 'pdf-to-txt',      loadComponent: () => import('./features/pdf-to-txt/pdf-to-txt.component').then(m => m.PdfToTxtComponent),             title: 'PDF to TXT — ApnaConverter' },
  { path: 'pdf-to-markdown', loadComponent: () => import('./features/pdf-to-markdown/pdf-to-markdown.component').then(m => m.PdfToMarkdownComponent), title: 'PDF to Markdown — ApnaConverter' },
  { path: 'pdf-to-json',     loadComponent: () => import('./features/pdf-to-json/pdf-to-json.component').then(m => m.PdfToJsonComponent),           title: 'PDF to JSON — ApnaConverter' },
  { path: 'pdf-to-xml',      loadComponent: () => import('./features/pdf-to-xml/pdf-to-xml.component').then(m => m.PdfToXmlComponent),             title: 'PDF to XML — ApnaConverter' },
  { path: 'pdf-to-csv',      loadComponent: () => import('./features/pdf-to-csv/pdf-to-csv.component').then(m => m.PdfToCsvComponent),             title: 'PDF to CSV — ApnaConverter' },
  { path: 'pdf-to-epub',     loadComponent: () => import('./features/pdf-to-epub/pdf-to-epub.component').then(m => m.PdfToEpubComponent),           title: 'PDF to EPUB — ApnaConverter' },
  { path: 'pdf-to-pptx',     loadComponent: () => import('./features/pdf-to-pptx/pdf-to-pptx.component').then(m => m.PdfToPptxComponent),           title: 'PDF to PowerPoint — ApnaConverter' },
  { path: 'pdf-to-excel',    loadComponent: () => import('./features/pdf-to-excel/pdf-to-excel.component').then(m => m.PdfToExcelComponent),         title: 'PDF to Excel — ApnaConverter' },
  { path: 'heic-to-jpg',     loadComponent: () => import('./features/heic-to-jpg/heic-to-jpg.component').then(m => m.HeicToJpgComponent),           title: 'HEIC to JPG — ApnaConverter' },
  { path: 'gif-to-pdf',      loadComponent: () => import('./features/gif-to-pdf/gif-to-pdf.component').then(m => m.GifToPdfComponent),             title: 'GIF to PDF — ApnaConverter' },
  { path: 'markdown-to-pdf', loadComponent: () => import('./features/markdown-to-pdf/markdown-to-pdf.component').then(m => m.MarkdownToPdfComponent), title: 'Markdown to PDF — ApnaConverter' },
  { path: 'csv-to-pdf',      loadComponent: () => import('./features/csv-to-pdf/csv-to-pdf.component').then(m => m.CsvToPdfComponent),             title: 'CSV to PDF — ApnaConverter' },
  { path: 'html-to-pdf',     loadComponent: () => import('./features/html-to-pdf/html-to-pdf.component').then(m => m.HtmlToPdfComponent),           title: 'HTML to PDF — ApnaConverter' },
  { path: 'svg-to-pdf',      loadComponent: () => import('./features/svg-to-pdf/svg-to-pdf.component').then(m => m.SvgToPdfComponent),             title: 'SVG to PDF — ApnaConverter' },

  // ── New PDF Security / Organisation tools ───────────────────────────────────
  { path: 'unlock-pdf',   loadComponent: () => import('./features/unlock-pdf/unlock-pdf.component').then(m => m.UnlockPdfComponent),     title: 'Unlock PDF — ApnaConverter' },
  { path: 'protect-pdf',  loadComponent: () => import('./features/protect-pdf/protect-pdf.component').then(m => m.ProtectPdfComponent),   title: 'Protect PDF — ApnaConverter' },
  { path: 'organize-pdf', loadComponent: () => import('./features/organize-pdf/organize-pdf.component').then(m => m.OrganizePdfComponent), title: 'Organize PDF — ApnaConverter' },

  // ── 404 ──────────────────────────────────────────────────────────────────────
  { path: '**', loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent), title: 'Page Not Found — ApnaConverter' },
];
