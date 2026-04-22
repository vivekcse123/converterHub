import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // ── Home ────────────────────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'ApnaConverter — Free Online File Converter',
    data: { description: 'Free online file converter with 37+ tools. Convert PDF, images, Word, Excel, and more — fast, secure, no sign-up required.' },
  },

  // ── Auth ────────────────────────────────────────────────────────────────────
  { path: 'login',    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),         title: 'Login — ApnaConverter',    data: { description: 'Log in to your ApnaConverter account to access conversion history and premium features.' } },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent), title: 'Register — ApnaConverter', data: { description: 'Create a free ApnaConverter account and track your file conversions.' } },

  // ── Protected ───────────────────────────────────────────────────────────────
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard], title: 'Dashboard — ApnaConverter', data: { description: 'View your conversion history and manage your ApnaConverter account.' } },

  // ── Admin (lazy) ────────────────────────────────────────────────────────────
  { path: 'admin', loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes), canActivate: [adminGuard] },

  // ── Original tools ──────────────────────────────────────────────────────────
  { path: 'image-to-pdf', loadComponent: () => import('./features/image-to-pdf/image-to-pdf.component').then(m => m.ImageToPdfComponent), title: 'Image to PDF — ApnaConverter', data: { description: 'Convert JPG, PNG, GIF or HEIC images to a PDF file instantly. Free, no sign-up needed.' } },
  { path: 'pdf-to-word',  loadComponent: () => import('./features/pdf-to-word/pdf-to-word.component').then(m => m.PdfToWordComponent),    title: 'PDF to Word — ApnaConverter',  data: { description: 'Convert PDF files to editable Word (.docx) documents for free. Fast and easy.' } },
  { path: 'word-to-pdf',  loadComponent: () => import('./features/word-to-pdf/word-to-pdf.component').then(m => m.WordToPdfComponent),    title: 'Word to PDF — ApnaConverter',  data: { description: 'Convert Word (.doc, .docx) files to PDF online for free. Preserves formatting.' } },
  { path: 'pdf-editor',   loadComponent: () => import('./features/pdf-editor/pdf-editor.component').then(m => m.PdfEditorComponent),      title: 'PDF Editor — ApnaConverter',   data: { description: 'Merge, split, compress, and organise PDF files with our free online PDF editor.' } },
  { path: 'image-editor', loadComponent: () => import('./features/image-editor/image-editor.component').then(m => m.ImageEditorComponent), title: 'Image Editor — ApnaConverter', data: { description: 'Resize, compress and convert images online for free. Supports JPG, PNG, WebP and more.' } },
  { path: 'compress',     loadComponent: () => import('./features/compress/compress.component').then(m => m.CompressComponent),            title: 'Compress Files — ApnaConverter', data: { description: 'Compress PDF and image files online. Reduce file size without losing quality.' } },
  { path: 'text-to-pdf',  loadComponent: () => import('./features/text-to-pdf/text-to-pdf.component').then(m => m.TextToPdfComponent),    title: 'Text to PDF — ApnaConverter',  data: { description: 'Convert plain text to a formatted PDF document instantly. Free online tool.' } },

  // ── Advanced PDF tools ───────────────────────────────────────────────────────
  { path: 'pdf-to-jpg',      loadComponent: () => import('./features/pdf-to-jpg/pdf-to-jpg.component').then(m => m.PdfToJpgComponent),           title: 'PDF to JPG — ApnaConverter',          data: { description: 'Convert PDF pages to high-quality JPG images. Free, fast, no software needed.' } },
  { path: 'watermark-pdf',   loadComponent: () => import('./features/watermark-pdf/watermark-pdf.component').then(m => m.WatermarkPdfComponent), title: 'Watermark PDF — ApnaConverter',        data: { description: 'Add a custom text watermark to every page of your PDF. Free online watermark tool.' } },
  { path: 'sign-pdf',        loadComponent: () => import('./features/sign-pdf/sign-pdf.component').then(m => m.SignPdfComponent),                title: 'Sign PDF — ApnaConverter',             data: { description: 'Add a digital signature to your PDF document online. Free and secure.' } },
  { path: 'redact-pdf',      loadComponent: () => import('./features/redact-pdf/redact-pdf.component').then(m => m.RedactPdfComponent),          title: 'Redact PDF — ApnaConverter',           data: { description: 'Permanently redact sensitive information from your PDF files. Free online tool.' } },
  { path: 'page-numbers',    loadComponent: () => import('./features/page-numbers/page-numbers.component').then(m => m.PageNumbersComponent),    title: 'Add Page Numbers — ApnaConverter',     data: { description: 'Add page numbers to a PDF with custom position and format. Free online.' } },
  { path: 'pdf-to-pdfa',     loadComponent: () => import('./features/pdf-to-pdfa/pdf-to-pdfa.component').then(m => m.PdfToPdfaComponent),        title: 'PDF to PDF/A — ApnaConverter',         data: { description: 'Convert PDF to archival PDF/A format for long-term document storage.' } },
  { path: 'compare-pdfs',    loadComponent: () => import('./features/compare-pdfs/compare-pdfs.component').then(m => m.ComparePdfsComponent),    title: 'Compare PDFs — ApnaConverter',         data: { description: 'Compare two PDF files side by side and highlight differences. Free tool.' } },
  { path: 'ocr',             loadComponent: () => import('./features/ocr/ocr.component').then(m => m.OcrComponent),                              title: 'OCR PDF — ApnaConverter',              data: { description: 'Extract text from scanned PDFs and images using OCR. Free online OCR tool.' } },

  // ── Extended converters ──────────────────────────────────────────────────────
  { path: 'pdf-to-txt',      loadComponent: () => import('./features/pdf-to-txt/pdf-to-txt.component').then(m => m.PdfToTxtComponent),               title: 'PDF to TXT — ApnaConverter',       data: { description: 'Extract plain text from any PDF file. Free online PDF to text converter.' } },
  { path: 'pdf-to-markdown', loadComponent: () => import('./features/pdf-to-markdown/pdf-to-markdown.component').then(m => m.PdfToMarkdownComponent), title: 'PDF to Markdown — ApnaConverter',  data: { description: 'Convert PDF content to Markdown (.md) format. Free online tool.' } },
  { path: 'pdf-to-json',     loadComponent: () => import('./features/pdf-to-json/pdf-to-json.component').then(m => m.PdfToJsonComponent),             title: 'PDF to JSON — ApnaConverter',      data: { description: 'Extract structured JSON data from PDF files. Free online converter.' } },
  { path: 'pdf-to-xml',      loadComponent: () => import('./features/pdf-to-xml/pdf-to-xml.component').then(m => m.PdfToXmlComponent),               title: 'PDF to XML — ApnaConverter',       data: { description: 'Convert PDF content to XML format. Free online PDF to XML converter.' } },
  { path: 'pdf-to-csv',      loadComponent: () => import('./features/pdf-to-csv/pdf-to-csv.component').then(m => m.PdfToCsvComponent),               title: 'PDF to CSV — ApnaConverter',       data: { description: 'Extract tabular data from PDF to CSV spreadsheet format. Free tool.' } },
  { path: 'pdf-to-epub',     loadComponent: () => import('./features/pdf-to-epub/pdf-to-epub.component').then(m => m.PdfToEpubComponent),             title: 'PDF to EPUB — ApnaConverter',      data: { description: 'Convert PDF documents to EPUB e-book format. Free online converter.' } },
  { path: 'pdf-to-pptx',     loadComponent: () => import('./features/pdf-to-pptx/pdf-to-pptx.component').then(m => m.PdfToPptxComponent),             title: 'PDF to PowerPoint — ApnaConverter', data: { description: 'Convert PDF to PowerPoint (.pptx) presentation slides. Free online.' } },
  { path: 'pdf-to-excel',    loadComponent: () => import('./features/pdf-to-excel/pdf-to-excel.component').then(m => m.PdfToExcelComponent),           title: 'PDF to Excel — ApnaConverter',     data: { description: 'Convert PDF tables to Excel (.xlsx) spreadsheet. Free online PDF to Excel.' } },
  { path: 'heic-to-jpg',     loadComponent: () => import('./features/heic-to-jpg/heic-to-jpg.component').then(m => m.HeicToJpgComponent),             title: 'HEIC to JPG — ApnaConverter',      data: { description: 'Convert Apple HEIC photos to JPG format online. Free and instant.' } },
  { path: 'gif-to-pdf',      loadComponent: () => import('./features/gif-to-pdf/gif-to-pdf.component').then(m => m.GifToPdfComponent),               title: 'GIF to PDF — ApnaConverter',       data: { description: 'Convert animated or static GIF files to PDF online. Free tool.' } },
  { path: 'markdown-to-pdf', loadComponent: () => import('./features/markdown-to-pdf/markdown-to-pdf.component').then(m => m.MarkdownToPdfComponent), title: 'Markdown to PDF — ApnaConverter',  data: { description: 'Convert Markdown (.md) files to beautifully formatted PDF. Free online.' } },
  { path: 'csv-to-pdf',      loadComponent: () => import('./features/csv-to-pdf/csv-to-pdf.component').then(m => m.CsvToPdfComponent),               title: 'CSV to PDF — ApnaConverter',       data: { description: 'Convert CSV spreadsheet data to a formatted PDF document. Free online.' } },
  { path: 'html-to-pdf',     loadComponent: () => import('./features/html-to-pdf/html-to-pdf.component').then(m => m.HtmlToPdfComponent),             title: 'HTML to PDF — ApnaConverter',      data: { description: 'Convert HTML files or web pages to PDF. Free online HTML to PDF converter.' } },
  { path: 'svg-to-pdf',      loadComponent: () => import('./features/svg-to-pdf/svg-to-pdf.component').then(m => m.SvgToPdfComponent),               title: 'SVG to PDF — ApnaConverter',       data: { description: 'Convert SVG vector graphics to PDF format. Free online SVG to PDF tool.' } },

  // ── New PDF Security / Organisation tools ───────────────────────────────────
  { path: 'unlock-pdf',   loadComponent: () => import('./features/unlock-pdf/unlock-pdf.component').then(m => m.UnlockPdfComponent),      title: 'Unlock PDF — ApnaConverter',   data: { description: 'Remove password protection from a PDF file instantly. Free online PDF unlocker.' } },
  { path: 'protect-pdf',  loadComponent: () => import('./features/protect-pdf/protect-pdf.component').then(m => m.ProtectPdfComponent),    title: 'Protect PDF — ApnaConverter',  data: { description: 'Add password protection and encryption to a PDF file. Free online PDF security tool.' } },
  { path: 'organize-pdf', loadComponent: () => import('./features/organize-pdf/organize-pdf.component').then(m => m.OrganizePdfComponent), title: 'Organize PDF — ApnaConverter', data: { description: 'Reorder or delete pages in a PDF document online. Free PDF page organizer.' } },

  // ── 404 ──────────────────────────────────────────────────────────────────────
  { path: '**', loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent), title: 'Page Not Found — ApnaConverter' },
];
