export interface ToolStep  { icon: string; title: string; desc: string; }
export interface ToolFaq   { q: string; a: string; }
export interface ToolContent {
  intro: string;
  steps: ToolStep[];
  benefits: string[];
  faqs: ToolFaq[];
}

export const TOOL_CONTENT: Record<string, ToolContent> = {

  'image-to-pdf': {
    intro: 'Need to share multiple images as a single, professional document? Our Image to PDF converter lets you upload JPG, PNG, WebP, or GIF files and instantly bundle them into one neatly formatted PDF. No messy email attachments, just a clean, portable file that opens perfectly on any device.',
    steps: [
      { icon: '📁', title: 'Upload Images',  desc: 'Select one or more JPG, PNG, WebP, or GIF files from your device or drag them in.' },
      { icon: '⚙️', title: 'Set Options',   desc: 'Choose page size, orientation, and margin to suit your layout.' },
      { icon: '⬇️', title: 'Download PDF',  desc: 'Click Convert and instantly download your polished PDF.' },
    ],
    benefits: [
      'Combine multiple images into a single PDF document',
      'No watermarks - completely free to use',
      'Files are auto-deleted within 2 hours for your privacy',
      'Supports JPG, PNG, WebP, GIF, and BMP formats',
      'Custom page sizes: A4, Letter, Legal, and more',
      'Works on any device - phone, tablet, or desktop',
    ],
    faqs: [
      { q: 'What image formats can I convert to PDF?', a: 'ApnaConverter supports JPG, JPEG, PNG, WebP, GIF, and BMP. You can upload multiple images at once - they will all be combined into a single PDF in the order you upload them.' },
      { q: 'Is there a file size limit?', a: 'The maximum upload size is 50 MB per session. For best results keep individual images under 20 MB.' },
      { q: 'Will the image quality be preserved?', a: 'Yes. Images are embedded at their original resolution. No quality loss occurs during conversion.' },
      { q: 'Can I choose the page order?', a: 'Images appear in the PDF in the order they are uploaded. Arrange them in the correct order before clicking Convert.' },
      { q: 'Is my data safe?', a: 'All uploaded files are processed on our secure server and automatically deleted within 2 hours. We never store or share your files.' },
    ],
  },

  'pdf-to-word': {
    intro: 'Converting a PDF back to an editable Word document is one of the most common document tasks. Our PDF to Word tool extracts text, tables, and formatting from any PDF and outputs a clean, editable .docx file, compatible with Microsoft Word, LibreOffice, and Google Docs, in seconds.',
    steps: [
      { icon: '📄', title: 'Upload PDF',        desc: 'Drop your PDF onto the upload area or click to browse.' },
      { icon: '⚡', title: 'Convert',            desc: 'Our engine extracts the text, tables, and layout from your PDF.' },
      { icon: '⬇️', title: 'Download .docx',   desc: 'Download the editable Word document, ready for Microsoft Word or Google Docs.' },
    ],
    benefits: [
      'Editable .docx output compatible with Microsoft Word and Google Docs',
      'Preserves text formatting, headings, and lists',
      'Tables and multi-column layouts extracted accurately',
      'No software installation needed - runs in your browser',
      'Completely free with no watermarks',
      'Files are deleted automatically after 2 hours',
    ],
    faqs: [
      { q: 'Will the formatting be preserved after conversion?', a: 'Yes, our converter retains headings, bold, italic, lists, and basic table structures. Complex PDF layouts may need minor adjustments in Word.' },
      { q: 'Can I edit the Word document after converting?', a: 'Absolutely. The .docx file is fully editable in Microsoft Word, LibreOffice, or Google Docs.' },
      { q: 'Does it work with scanned PDFs?', a: 'Scanned PDFs are image-based and require OCR to extract text. Use our OCR tool first, then convert to Word.' },
      { q: 'What is the maximum file size?', a: 'You can convert PDFs up to 50 MB in size.' },
      { q: 'Is it free to convert PDF to Word?', a: 'Yes, the PDF to Word converter is completely free. No account or payment is required.' },
    ],
  },

  'word-to-pdf': {
    intro: 'Word documents look different on every device and operating system. Converting to PDF locks in your fonts, images, and layout so recipients see exactly what you designed. Our Word to PDF converter handles both .doc and .docx formats and delivers a universally readable file in seconds.',
    steps: [
      { icon: '📝', title: 'Upload Word File', desc: 'Select a .doc or .docx file from your computer.' },
      { icon: '⚡', title: 'Convert',           desc: 'Your document is rendered to PDF preserving all fonts and formatting.' },
      { icon: '⬇️', title: 'Download PDF',     desc: 'Save the ready PDF - perfect for sharing and printing.' },
    ],
    benefits: [
      'Preserves fonts, images, tables, and page layout',
      'Works with .doc (Word 97-2003) and .docx (Word 2007+) formats',
      'PDF output is universally viewable on any device',
      'Great for sharing documents that should not be edited',
      'Free - no watermarks, no account needed',
      'Secure: files are auto-deleted after 2 hours',
    ],
    faqs: [
      { q: 'What Word formats are supported?', a: 'Both .doc (older Word 97-2003 format) and .docx (modern Word 2007+ format) are supported.' },
      { q: 'Will my fonts and images be preserved?', a: 'Yes. Our conversion engine embeds all fonts and images, producing a PDF that looks identical to your Word document.' },
      { q: 'Can I convert password-protected Word files?', a: 'Password-protected Word files cannot be converted directly. Remove the password in Word first, then upload the file.' },
      { q: 'How large can the Word file be?', a: 'Files up to 50 MB can be uploaded and converted.' },
      { q: 'Is the converter free?', a: 'Yes, Word to PDF conversion is completely free on ApnaConverter.' },
    ],
  },

  'pdf-editor': {
    intro: 'Managing PDFs should not require expensive desktop software. Our PDF Editor brings the three most-needed operations (merge, split, and compress) into a single browser-based tool. Combine reports into one file, extract specific pages, or shrink a large PDF down to an email-friendly size without installing anything.',
    steps: [
      { icon: '📄', title: 'Upload PDF(s)',  desc: 'Upload one PDF to split or compress, or multiple PDFs to merge.' },
      { icon: '⚙️', title: 'Choose Action', desc: 'Select Merge, Split, or Compress from the action tabs.' },
      { icon: '⬇️', title: 'Download',      desc: 'Process and download your modified PDF instantly.' },
    ],
    benefits: [
      'Merge multiple PDFs into a single document',
      'Split a large PDF into individual pages or sections',
      'Compress PDF size for easier sharing and emailing',
      'No software installation needed',
      'All three actions available in one tool',
      'Files auto-deleted after 2 hours for privacy',
    ],
    faqs: [
      { q: 'How many PDFs can I merge at once?', a: 'You can merge as many PDFs as needed, up to a total combined size of 50 MB.' },
      { q: 'Can I split a PDF into specific page ranges?', a: 'Yes, you can specify page ranges when splitting, or split into individual single-page PDFs.' },
      { q: 'How much does compression reduce file size?', a: 'Compression typically reduces PDF size by 20-80% depending on the original content. PDFs with many high-resolution images see the greatest reduction.' },
      { q: 'Will the PDF quality be affected after compression?', a: 'The tool applies intelligent compression that maintains readability. For very aggressive compression, image quality may be slightly reduced.' },
      { q: 'Is the PDF Editor free?', a: 'Yes, all three actions - merge, split, and compress - are completely free on ApnaConverter.' },
    ],
  },

  'image-editor': {
    intro: 'Quick image editing tasks should not require Photoshop or Lightroom. Our Image Editor handles the everyday jobs: resizing a photo to exact pixel dimensions, compressing an image for web or email, and converting between JPG, PNG, and WebP formats, all in your browser with no installation needed.',
    steps: [
      { icon: '🎨', title: 'Upload Image', desc: 'Select a JPG, PNG, or WebP image from your device.' },
      { icon: '⚙️', title: 'Edit',         desc: 'Resize, compress, or convert your image using the action tabs.' },
      { icon: '⬇️', title: 'Download',    desc: 'Download your edited image ready to use.' },
    ],
    benefits: [
      'Resize images to exact pixel dimensions',
      'Compress images to reduce file size for web and email',
      'Convert between JPG, PNG, and WebP formats',
      'No software installation - works in any browser',
      'Supports JPG, PNG, WebP, GIF, and BMP input',
      'Files are auto-deleted after 2 hours',
    ],
    faqs: [
      { q: 'What operations can I perform on images?', a: 'You can resize (change dimensions), compress (reduce file size), and convert between JPG, PNG, and WebP formats.' },
      { q: 'Will resizing reduce image quality?', a: 'Downscaling an image (making it smaller) does not reduce visual quality. Upscaling (making it larger) may result in some softness.' },
      { q: 'What is the best format for web images?', a: 'WebP offers the best compression for web use. JPG is best for photographs, and PNG is best for graphics with transparency.' },
      { q: 'Is there a file size limit?', a: 'Images up to 50 MB are supported.' },
      { q: 'Is the Image Editor free?', a: 'Yes, all image editing features are completely free on ApnaConverter.' },
    ],
  },

  'bg-remover': {
    intro: 'Cutting a subject out of a photo used to mean Photoshop and a lot of patience with the lasso tool. Our Background Remover uses an in-browser AI model to detect the subject and erase the background automatically, then lets you drop in a new one: solid color, gradient, or any image of your own, so you get a polished result in seconds, not minutes.',
    steps: [
      { icon: '📷', title: 'Upload a Photo',     desc: 'Drop in any JPG, PNG, WebP, or GIF - a portrait, product shot, or logo.' },
      { icon: '✂️', title: 'Remove Background', desc: 'Our AI detects the subject and cuts it out automatically, right in your browser.' },
      { icon: '🎨', title: 'Replace & Download', desc: 'Keep it transparent or add a color, gradient, or custom background, then download the PNG.' },
    ],
    benefits: [
      'AI background removal runs entirely on your device - your photo is never uploaded',
      'Works on portraits, products, logos, and graphics alike',
      'Replace the background with a solid color, gradient, or your own image',
      'Download a high-resolution transparent PNG or fully composited image',
      'No software installation, no account, and no watermark',
      'Free to use with no limit on the number of photos',
    ],
    faqs: [
      { q: 'Is my photo uploaded to a server?', a: 'No. Background removal runs fully in your browser using an in-browser AI model. Your photo never leaves your device, so there is nothing to upload or store.' },
      { q: 'What image formats are supported?', a: 'You can upload JPG, PNG, WebP, or GIF files. The result always downloads as a transparent or composited PNG so edges stay crisp.' },
      { q: 'Can I change the background instead of just removing it?', a: 'Yes. After the background is removed, choose a solid color, one of the built-in gradients, or upload your own photo to use as the new background.' },
      { q: 'Why does the first removal take longer?', a: 'The first time you use the tool, your browser downloads the AI model (roughly 40-80 MB) and caches it. Every removal after that is much faster.' },
      { q: 'Is the Background Remover free?', a: 'Yes, background removal and replacement are completely free on ApnaConverter, with no watermark and no sign-up required.' },
    ],
  },

  'compress': {
    intro: 'Sending multiple files to a colleague or client as individual attachments is messy and slow. Our File Compressor bundles all your PDFs, images, and documents into a single ZIP archive that is easier to attach to emails and faster to download. No software installation needed, works in any browser on any device.',
    steps: [
      { icon: '📁', title: 'Upload Files', desc: 'Select multiple files - PDFs, images, or documents.' },
      { icon: '🗜️', title: 'Bundle',       desc: 'Files are packaged into a compressed ZIP archive.' },
      { icon: '⬇️', title: 'Download ZIP', desc: 'Download one ZIP file containing all your files.' },
    ],
    benefits: [
      'Bundle multiple files into a single download',
      'Significantly reduces total file size for sharing via email',
      'Supports PDFs, images, and text files',
      'Ideal for sharing multiple attachments as one file',
      'No software needed - works in any browser',
      'Files are automatically deleted after 2 hours',
    ],
    faqs: [
      { q: 'What file types can I add to the ZIP?', a: 'You can add PDFs, images (JPG, PNG, WebP), and text files. Any combination of these formats is accepted.' },
      { q: 'How much does compression reduce file size?', a: 'ZIP compression works best on text files and uncompressed formats. Already-compressed files like JPGs and PDFs see modest reductions.' },
      { q: 'Is there a limit on the number of files?', a: 'You can add as many files as needed, up to a total upload size of 50 MB.' },
      { q: 'Can I compress a single file?', a: 'Yes, though the main benefit of this tool is bundling multiple files together for sharing.' },
      { q: 'How do I open the ZIP file?', a: 'ZIP files can be opened on any OS - Windows (File Explorer), macOS (double-click), and Linux (Archive Manager or unzip command).' },
    ],
  },

  'text-to-pdf': {
    intro: 'Have meeting notes, a script, a log output, or plain text content that needs to become a shareable document? Our Text to PDF tool wraps any plain text in a clean, professional PDF with neat formatting, no Microsoft Word needed. Just paste your text or upload a .txt file and download the result instantly.',
    steps: [
      { icon: '📄', title: 'Upload or Paste', desc: 'Upload a .txt file or paste your text directly into the editor.' },
      { icon: '⚡', title: 'Convert',          desc: 'Text is formatted and rendered into a clean PDF document.' },
      { icon: '⬇️', title: 'Download PDF',    desc: 'Download your professional-looking PDF instantly.' },
    ],
    benefits: [
      'Instantly turn plain text into a shareable PDF',
      'Clean, professional formatting applied automatically',
      'Perfect for converting notes, logs, or scripts to PDF',
      'No need for Word or any office software',
      'Completely free to use',
      'Files auto-deleted after 2 hours for privacy',
    ],
    faqs: [
      { q: 'What text formats are accepted?', a: 'You can upload .txt files or type/paste text directly. Rich text formats like .docx are not supported - use our Word to PDF converter instead.' },
      { q: 'Can I control the font or page size?', a: 'The converter applies a clean default font and A4 page size. For full styling control, use our Word to PDF converter with a formatted document.' },
      { q: 'Is there a character limit?', a: 'There is no hard character limit, but very long texts may span many pages. Files up to 50 MB are accepted.' },
      { q: 'Will my line breaks be preserved?', a: 'Yes, paragraph breaks and line breaks from your text file are preserved in the PDF output.' },
      { q: 'Is this tool free?', a: 'Yes, Text to PDF conversion is completely free on ApnaConverter.' },
    ],
  },

  'pdf-to-jpg': {
    intro: 'PDF pages are far easier to share on social media, embed in websites, or view in image galleries as JPGs. Our PDF to JPG converter extracts every page of your PDF as a crisp, high-quality image file at the DPI you choose, perfect for creating presentation thumbnails, social media previews, or printable page images.',
    steps: [
      { icon: '📄', title: 'Upload PDF',      desc: 'Select or drag-and-drop your PDF file.' },
      { icon: '⚙️', title: 'Choose Quality', desc: 'Pick DPI (72-600) and output format (JPG, PNG, or WebP).' },
      { icon: '⬇️', title: 'Download Images', desc: 'Get high-quality images for every page of your PDF.' },
    ],
    benefits: [
      'Converts every PDF page to a separate image file',
      'Choose output resolution from 72 DPI (web) to 600 DPI (print)',
      'Output in JPG, PNG, or WebP format',
      'No software installation needed',
      'Ideal for presentations, thumbnails, and web use',
      'Files auto-deleted within 2 hours for privacy',
    ],
    faqs: [
      { q: 'What resolution should I choose?', a: '72-150 DPI is good for web and screen use. 300 DPI is ideal for standard print. 600 DPI is for high-quality professional printing.' },
      { q: 'Will all pages be converted?', a: 'Yes, every page of the PDF is converted to a separate image. You can download all images at once as a ZIP file.' },
      { q: 'What output formats are available?', a: 'JPG (best for photos and general use), PNG (best for diagrams and text), and WebP (smallest file size for web).' },
      { q: 'Is there a page limit?', a: 'PDFs up to 50 MB can be converted. Very long documents will produce a large number of images.' },
      { q: 'Is this tool free?', a: 'Yes, PDF to JPG conversion is completely free on ApnaConverter.' },
    ],
  },

  'watermark-pdf': {
    intro: 'Protect your intellectual property and mark document status with a custom text watermark. Add "DRAFT", "CONFIDENTIAL", "SAMPLE", or any custom text to every page of your PDF in seconds. Control the position, font size, and opacity so the watermark complements your document without obscuring the content.',
    steps: [
      { icon: '📄', title: 'Upload PDF',       desc: 'Select the PDF you want to watermark.' },
      { icon: '✏️', title: 'Set Watermark',    desc: 'Enter your watermark text and choose position, size, and opacity.' },
      { icon: '⬇️', title: 'Download',         desc: 'Download the watermarked PDF ready to share.' },
    ],
    benefits: [
      'Add custom text watermarks to every page automatically',
      'Control position: diagonal, center, top, or bottom',
      'Adjust font size and transparency to your preference',
      'Protect your documents from unauthorised use',
      'Ideal for "DRAFT", "CONFIDENTIAL", or copyright notices',
      'Free - no account required',
    ],
    faqs: [
      { q: 'Can I remove a watermark after adding it?', a: 'Watermarks added by this tool are embedded into the PDF content. They cannot be removed without a PDF editing tool.' },
      { q: 'Can I add an image watermark?', a: 'Currently the tool supports text watermarks. For image watermarks, use our PDF Editor.' },
      { q: 'Will the watermark appear on every page?', a: 'Yes, the watermark is applied to every page of the PDF automatically.' },
      { q: 'What font and size options are available?', a: 'You can set the font size and opacity of the watermark text. A standard system font is used for maximum compatibility.' },
      { q: 'Is my PDF stored after watermarking?', a: 'No. Files are automatically deleted from our servers within 2 hours of processing.' },
    ],
  },

  'sign-pdf': {
    intro: 'Printing a document just to sign it and scan it back is a thing of the past. Our PDF Signer lets you draw a freehand signature with your mouse or touchscreen, type your name in a handwriting style, or upload an existing signature image, then place it precisely anywhere on any page of your document.',
    steps: [
      { icon: '📄', title: 'Upload PDF',            desc: 'Upload the PDF document you need to sign.' },
      { icon: '✍️', title: 'Add Signature',         desc: 'Draw, type, or upload your signature and place it on the page.' },
      { icon: '⬇️', title: 'Download Signed PDF',  desc: 'Download your signed PDF, ready to send.' },
    ],
    benefits: [
      'Sign PDFs online without printing and scanning',
      'Draw your signature with a mouse or touchscreen',
      'Type your name in a handwriting-style font',
      'Upload an existing signature image',
      'Place your signature precisely anywhere on the page',
      'Free and private - files deleted after 2 hours',
    ],
    faqs: [
      { q: 'Is a drawn signature legally valid?', a: 'Electronic signatures are legally valid in many jurisdictions under laws like the eSign Act (USA) and eIDAS (EU). Check your local regulations for specific requirements.' },
      { q: 'Can I add my signature to multiple pages?', a: 'Yes, you can place your signature on any page and position it exactly where needed.' },
      { q: 'Can I upload my handwritten signature?', a: 'Yes, you can upload an image (PNG with transparent background recommended) of your handwritten signature.' },
      { q: 'Is the signature tamper-evident?', a: 'The signature is embedded visually into the PDF. For cryptographic signing with certificates, a dedicated e-signature service is recommended.' },
      { q: 'Is my document kept confidential?', a: 'Yes, files are processed securely and automatically deleted within 2 hours.' },
    ],
  },

  'redact-pdf': {
    intro: 'Sharing a document that contains sensitive information? Our PDF Redaction tool permanently removes selected regions so the underlying text is completely unrecoverable, not just visually hidden. Ideal for legal, HR, healthcare, and compliance teams handling NDA-sensitive, GDPR, or HIPAA-protected content.',
    steps: [
      { icon: '📄', title: 'Upload PDF',             desc: 'Upload the PDF containing sensitive information.' },
      { icon: '🔲', title: 'Mark Areas',             desc: 'Draw over the text or regions you want to permanently remove.' },
      { icon: '⬇️', title: 'Download Redacted PDF', desc: 'Download the PDF with selected areas permanently blacked out.' },
    ],
    benefits: [
      'Permanently remove sensitive text and data from PDFs',
      'Black-out regions are completely unrecoverable',
      'Helps comply with GDPR, HIPAA, and other privacy regulations',
      'Ideal for legal documents, medical records, and contracts',
      'No installation needed - works in any browser',
      'Files auto-deleted from servers after 2 hours',
    ],
    faqs: [
      { q: 'Is redaction permanent?', a: 'Yes, redaction using this tool permanently removes the underlying content from the PDF. The blacked-out areas cannot be undone or reversed.' },
      { q: 'Can the redacted text be recovered?', a: 'No. Unlike simply drawing a black box over text in some editors, our redaction permanently removes the content from the PDF structure.' },
      { q: 'Can I redact images and photos in a PDF?', a: 'Yes, you can draw redaction boxes over any content including images, diagrams, and tables.' },
      { q: 'What colour are redacted areas?', a: 'Redacted areas appear as solid black boxes, which is the standard practice for official document redaction.' },
      { q: 'Is my sensitive document safe?', a: 'Yes, all files are encrypted in transit and automatically deleted from our servers within 2 hours.' },
    ],
  },

  'page-numbers': {
    intro: 'Professional documents need page numbers. Our Page Number tool adds them to any PDF in the position and format you choose: top or bottom, left, center, or right, in Arabic numerals or Roman numerals. You can also set a custom starting number for documents with front matter or appendices.',
    steps: [
      { icon: '📄', title: 'Upload PDF',  desc: 'Select the PDF where you want to add page numbers.' },
      { icon: '⚙️', title: 'Configure',  desc: 'Choose position (header/footer), starting number, and format.' },
      { icon: '⬇️', title: 'Download',   desc: 'Download the PDF with page numbers on every page.' },
    ],
    benefits: [
      'Add page numbers to any PDF in seconds',
      'Choose position: top-left, top-center, top-right, or bottom',
      'Set a custom starting page number',
      'Multiple number formats: 1, I, i, A',
      'Ideal for reports, theses, contracts, and manuals',
      'Free - no watermarks added',
    ],
    faqs: [
      { q: 'Can I start numbering from a page other than 1?', a: 'Yes, you can set a custom starting number. For example, start from page 3 to account for a cover and table of contents.' },
      { q: 'What number formats are available?', a: 'Arabic numerals (1, 2, 3), uppercase Roman (I, II, III), lowercase Roman (i, ii, iii), or letters (A, B, C).' },
      { q: 'Where will the page number appear?', a: 'You can place page numbers in the header or footer, aligned to the left, center, or right of the page.' },
      { q: 'Will page numbers be added to every page?', a: 'Yes, page numbers are added to all pages of the PDF by default.' },
      { q: 'Is this tool free?', a: 'Yes, adding page numbers to a PDF is completely free on ApnaConverter.' },
    ],
  },

  'pdf-to-pdfa': {
    intro: 'PDF/A is the ISO-standardized archival format required by government agencies, courts, and regulated industries for long-term document preservation. Our PDF to PDF/A converter embeds all fonts and color profiles so the document renders identically decades from now, meeting strict archival compliance standards.',
    steps: [
      { icon: '📄', title: 'Upload PDF',      desc: 'Upload the standard PDF you want to archive.' },
      { icon: '⚡', title: 'Convert',          desc: 'The PDF is converted to the PDF/A archival standard.' },
      { icon: '⬇️', title: 'Download PDF/A', desc: 'Download your compliant PDF/A file for long-term storage.' },
    ],
    benefits: [
      'PDF/A is the ISO standard for long-term document archiving',
      'Required by many government and legal institutions',
      'Embeds all fonts and colour profiles for future-proof display',
      'Ensures the document renders identically for decades',
      'Free to convert - no registration required',
      'Files are deleted from our servers within 2 hours',
    ],
    faqs: [
      { q: 'What is PDF/A?', a: 'PDF/A is an ISO-standardised version of PDF designed for long-term archiving. It ensures a document renders exactly the same way in the future by embedding all fonts, colours, and other dependencies.' },
      { q: 'Who needs PDF/A?', a: 'PDF/A is commonly required by government agencies, courts, archives, and organisations that store documents for years or decades with guaranteed reproducibility.' },
      { q: 'What PDF/A version does this tool produce?', a: 'This tool produces PDF/A-1b, the most widely accepted conformance level for archival purposes.' },
      { q: 'Can I use a PDF/A file like a normal PDF?', a: 'Yes, PDF/A files can be opened, viewed, and printed just like any standard PDF. Interactive features like JavaScript are disabled per the standard.' },
      { q: 'Is the conversion free?', a: 'Yes, PDF to PDF/A conversion is completely free on ApnaConverter.' },
    ],
  },

  'compare-pdfs': {
    intro: 'Spotting the differences between two versions of a contract, legal brief, or report by reading them side-by-side is slow and error-prone. Our PDF comparison tool highlights every change (added text, removed text, and modifications) so you can review revisions in seconds rather than spending hours on manual checks.',
    steps: [
      { icon: '📄', title: 'Upload Two PDFs', desc: 'Upload the original and the revised PDF for comparison.' },
      { icon: '🔍', title: 'Compare',          desc: 'Differences in text and layout are detected and highlighted.' },
      { icon: '📊', title: 'Review Changes',  desc: 'See a clear view with all changes marked for easy review.' },
    ],
    benefits: [
      'Instantly spot differences between two PDF versions',
      'Highlights added, removed, and changed text',
      'Ideal for reviewing contracts, legal documents, and reports',
      'Saves hours of manual line-by-line comparison',
      'No software installation needed',
      'Files are deleted automatically after 2 hours',
    ],
    faqs: [
      { q: 'What types of differences are detected?', a: 'The tool detects added text, deleted text, and moved content between the two PDF versions.' },
      { q: 'Does it work with scanned PDFs?', a: 'Scanned PDFs are image-based and require OCR for accurate text comparison. Use our OCR tool on scanned documents first.' },
      { q: 'Can I compare PDFs with different page counts?', a: 'Yes, the tool compares pages where they overlap and notes any pages that exist in only one document.' },
      { q: 'Is this useful for legal and compliance review?', a: 'Absolutely. The compare tool is ideal for reviewing contract changes, policy updates, and regulatory filings.' },
      { q: 'Is my data confidential?', a: 'Yes, all files are processed securely and automatically deleted within 2 hours of upload.' },
    ],
  },

  'ocr': {
    intro: 'Scanned documents and image-based PDFs contain text that you cannot search, copy, or index. Our OCR tool uses optical character recognition to extract the full text layer, making scanned content fully searchable and copyable. Supports multiple languages and outputs a searchable PDF or a plain text file.',
    steps: [
      { icon: '📄', title: 'Upload Scanned PDF', desc: 'Upload a scanned PDF or image-based document.' },
      { icon: '🔍', title: 'OCR Processing',     desc: 'Optical Character Recognition extracts all text from the images.' },
      { icon: '⬇️', title: 'Download Text PDF',  desc: 'Get a searchable, copy-able PDF with all text extracted.' },
    ],
    benefits: [
      'Extract text from scanned PDFs and images',
      'Makes scanned documents searchable and copy-able',
      'Supports multiple languages for text recognition',
      'Ideal for digitising printed documents and archives',
      'Convert paper records to editable digital text',
      'Files are auto-deleted after 2 hours',
    ],
    faqs: [
      { q: 'What is OCR?', a: 'OCR (Optical Character Recognition) reads text from images or scanned pages and converts it into machine-readable text that can be selected, copied, and searched.' },
      { q: 'Does OCR work on photos of documents taken with a phone?', a: 'Yes, OCR works on phone photos as well as scanned documents. Better photo quality (good lighting, minimal blur) produces more accurate results.' },
      { q: 'What languages are supported?', a: 'Our OCR engine supports English, Hindi, Spanish, French, German, Chinese, Arabic, and many more languages.' },
      { q: 'How accurate is the OCR?', a: 'Accuracy depends on the quality of the original scan. Clean, high-resolution scans typically achieve 95%+ accuracy. Handwritten text is not currently supported.' },
      { q: 'Is the OCR tool free?', a: 'Yes, OCR processing is completely free on ApnaConverter.' },
    ],
  },

  'pdf-to-txt': {
    intro: 'When you need the raw text from a PDF, for data analysis, feeding into an AI tool, pasting into another application, or programmatic processing, our PDF to TXT extractor does the job instantly. It outputs clean, readable plain text from any PDF, including multi-column layouts and long multi-page documents.',
    steps: [
      { icon: '📄', title: 'Upload PDF',    desc: 'Select the PDF you want to extract text from.' },
      { icon: '⚡', title: 'Extract',        desc: 'All text content is extracted from the PDF pages.' },
      { icon: '⬇️', title: 'Download TXT', desc: 'Download a plain .txt file with all the extracted text.' },
    ],
    benefits: [
      'Extract all text from any PDF in seconds',
      'Plain .txt output works with any text editor',
      'Useful for data processing, analysis, and migration',
      'Faster than copy-pasting text manually page by page',
      'Works on multi-page PDFs of any length',
      'Completely free - no account needed',
    ],
    faqs: [
      { q: 'Does it work with scanned PDFs?', a: 'Scanned PDFs are image-based and contain no text layer. Use our OCR tool first to make the content readable, then convert to TXT.' },
      { q: 'Will formatting be preserved in the TXT file?', a: 'Plain text format does not support formatting like bold, tables, or columns. Text is extracted sequentially as it appears in the PDF.' },
      { q: 'What is the maximum PDF size?', a: 'PDFs up to 50 MB can be processed.' },
      { q: 'Can I extract text from a specific page only?', a: 'Currently the tool extracts text from all pages. Use our PDF Editor to split out a specific page first, then extract text from it.' },
      { q: 'Is this useful for developers?', a: 'Yes. PDF to TXT is popular for data pipelines, content analysis, NLP training data, and document migration tasks.' },
    ],
  },

  'pdf-to-markdown': {
    intro: 'Markdown is the language of modern technical documentation, wikis, and notes. Our PDF to Markdown converter extracts text and maps headings, lists, bold, italic, and basic formatting to standard Markdown syntax, making PDF content immediately ready to import into Notion, Obsidian, GitHub wikis, or any static site generator.',
    steps: [
      { icon: '📄', title: 'Upload PDF',       desc: 'Upload the PDF you want to convert to Markdown.' },
      { icon: '⚡', title: 'Convert',           desc: 'Text, headings, and lists are mapped to Markdown syntax.' },
      { icon: '⬇️', title: 'Download .md',    desc: 'Download a ready-to-use Markdown file.' },
    ],
    benefits: [
      'Convert PDF content to Markdown for blogs and documentation',
      'Headings, lists, and emphasis correctly mapped',
      'Compatible with GitHub, GitLab, Notion, Obsidian, and more',
      'Ideal for developers and technical writers',
      'Much faster than manual copy-and-format',
      'Completely free to use',
    ],
    faqs: [
      { q: 'What PDF content gets converted to Markdown?', a: 'Text, headings (detected from font size), paragraphs, bullet lists, and numbered lists are converted to their Markdown equivalents.' },
      { q: 'Are tables and images supported?', a: 'Basic tables are converted to Markdown table syntax. Images embedded in the PDF are not included in the Markdown output.' },
      { q: 'What tools can open a .md file?', a: 'Markdown files can be opened in any text editor and rendered in GitHub, GitLab, VS Code, Notion, Obsidian, and many more.' },
      { q: 'Does it work with scanned PDFs?', a: 'No, scanned PDFs are image-based. Use our OCR tool first to create a text-based PDF, then convert to Markdown.' },
      { q: 'Is the converter free?', a: 'Yes, PDF to Markdown conversion is completely free on ApnaConverter.' },
    ],
  },

  'pdf-to-json': {
    intro: 'Developers and data engineers often need to extract structured content from PDFs for APIs, databases, or data pipelines. Our PDF to JSON converter outputs page text, document metadata, and content structure as clean, machine-readable JSON, compatible with any programming language or data processing tool, no manual parsing required.',
    steps: [
      { icon: '📄', title: 'Upload PDF',      desc: 'Upload the PDF you want to extract structured data from.' },
      { icon: '⚡', title: 'Extract',          desc: 'Text, metadata, and structure are parsed into JSON format.' },
      { icon: '⬇️', title: 'Download JSON',  desc: 'Download the structured JSON file for your application.' },
    ],
    benefits: [
      'Extract structured data from PDFs for developers and APIs',
      'Includes page text, metadata, and document structure',
      'Ideal for building data pipelines and integrations',
      'Machine-readable format compatible with all languages',
      'Much faster than manual parsing',
      'Completely free to use',
    ],
    faqs: [
      { q: 'What data is included in the JSON output?', a: 'The JSON includes page-by-page text content, document metadata (title, author, creation date), and structural information like headings and paragraphs.' },
      { q: 'Is this useful for developers?', a: 'Yes, this is primarily a developer tool. The JSON output can be consumed by APIs, stored in databases, or fed into data processing pipelines.' },
      { q: 'Does it extract tables as structured data?', a: 'Basic table detection is included. Complex or nested tables may not be perfectly structured in the JSON output.' },
      { q: 'What is the maximum file size?', a: 'PDFs up to 50 MB can be processed.' },
      { q: 'Is this tool free?', a: 'Yes, PDF to JSON extraction is completely free on ApnaConverter.' },
    ],
  },

  'pdf-to-xml': {
    intro: 'XML is the backbone of enterprise document management systems, content workflows, and regulated data exchange standards. Our PDF to XML converter extracts your document text and structure into well-formed XML, making it immediately compatible with any XML-based enterprise system, CMS, or data migration pipeline.',
    steps: [
      { icon: '📄', title: 'Upload PDF',     desc: 'Upload the PDF to convert to XML format.' },
      { icon: '⚡', title: 'Convert',         desc: 'Document structure and text are mapped to XML tags.' },
      { icon: '⬇️', title: 'Download XML',  desc: 'Download the XML file for use in your system.' },
    ],
    benefits: [
      'Convert PDF content to structured XML format',
      'Useful for enterprise systems and document workflows',
      'XML output compatible with all major XML parsers',
      'Preserves document hierarchy and structure',
      'Ideal for data migration and content management systems',
      'Free to use - no account required',
    ],
    faqs: [
      { q: 'What is XML used for?', a: 'XML (Extensible Markup Language) is used for structured data interchange between systems. It is common in enterprise software, publishing workflows, and document management.' },
      { q: 'What PDF content is included in the XML?', a: 'All text content, document metadata, and structural elements like paragraphs, headings, and lists, organised as XML nodes.' },
      { q: 'Is the XML output valid?', a: 'Yes, the XML output is well-formed and can be parsed by any standard XML library or editor.' },
      { q: 'Does it work with scanned PDFs?', a: 'No, scanned PDFs require OCR first. Use our OCR tool to make the PDF text-based before converting to XML.' },
      { q: 'Is the converter free?', a: 'Yes, PDF to XML conversion is completely free on ApnaConverter.' },
    ],
  },

  'pdf-to-csv': {
    intro: 'Tables trapped inside PDF reports are frustrating; you can see the data but you cannot work with it. Our PDF to CSV tool extracts tabular content and outputs it in comma-separated format that opens directly in Excel, Google Sheets, or any data analysis tool. No more tedious manual re-entry of numbers and figures.',
    steps: [
      { icon: '📄', title: 'Upload PDF',    desc: 'Upload a PDF containing tables or tabular data.' },
      { icon: '⚡', title: 'Extract Tables', desc: 'Our engine detects and extracts tables from your PDF.' },
      { icon: '⬇️', title: 'Download CSV', desc: 'Download a .csv file ready for Excel, Google Sheets, or databases.' },
    ],
    benefits: [
      'Extract table data from PDF into spreadsheet format',
      'CSV files open directly in Excel, Google Sheets, and more',
      'Ideal for invoices, financial reports, and data tables',
      'Saves hours of manual data entry',
      'Works on multi-page PDFs with multiple tables',
      'Completely free to use',
    ],
    faqs: [
      { q: 'Does it work on PDFs with multiple tables?', a: 'Yes, all tables detected in the PDF are extracted and included in the CSV output.' },
      { q: 'Can I open the CSV in Excel?', a: 'Yes, CSV is natively supported by Microsoft Excel, Google Sheets, Apple Numbers, and LibreOffice Calc.' },
      { q: 'Does it work with scanned PDF invoices?', a: 'Scanned PDFs require OCR to read the text first. Use our OCR tool on the PDF before converting to CSV.' },
      { q: 'What if my PDF has no tables?', a: 'If no tables are detected, the CSV contains the raw text content extracted from the PDF line by line.' },
      { q: 'Is the PDF to CSV tool free?', a: 'Yes, completely free on ApnaConverter.' },
    ],
  },

  'pdf-to-epub': {
    intro: 'Long PDFs are hard to read on phones and e-readers because the text does not reflow to fit the screen. Converting to EPUB creates a flexible format where text adapts to any screen size, font size, or orientation, ideal for reading research papers, manuals, and long-form content on Kindle, Kobo, or Apple Books.',
    steps: [
      { icon: '📄', title: 'Upload PDF',      desc: 'Upload the PDF book or document you want to convert.' },
      { icon: '⚡', title: 'Convert',          desc: 'PDF content is reformatted into reflowable EPUB chapters.' },
      { icon: '⬇️', title: 'Download EPUB', desc: 'Download the e-book ready for your Kindle, Kobo, or reading app.' },
    ],
    benefits: [
      'Read PDFs comfortably on e-readers and tablets',
      'EPUB text reflows to fit any screen size',
      'Smaller file size than PDF for mobile reading',
      'Compatible with Kobo, Apple Books, and Google Play Books',
      'Ideal for converting research papers, books, and manuals',
      'Free to convert - no account required',
    ],
    faqs: [
      { q: 'What devices can open EPUB files?', a: 'EPUB is supported by Kobo e-readers, Apple Books (iPhone, iPad, Mac), Google Play Books, and apps like Moon+ Reader. For Kindle, convert EPUB to MOBI using Calibre.' },
      { q: 'Will the formatting be preserved?', a: 'EPUB is a reflowable format, so content reflows to fit the screen. Fixed layouts like columns and precise PDF positioning will be linearised.' },
      { q: 'Does it work with image-heavy PDFs?', a: 'The tool extracts text content primarily. Heavily image-based PDFs may not convert well. It works best on text-based PDFs like books and reports.' },
      { q: 'Is there a file size limit?', a: 'PDFs up to 50 MB can be converted.' },
      { q: 'Is PDF to EPUB conversion free?', a: 'Yes, it is completely free on ApnaConverter.' },
    ],
  },

  'pdf-to-pptx': {
    intro: 'Repurposing a PDF report or research paper as a PowerPoint presentation used to mean starting from scratch. Our PDF to PowerPoint converter turns each PDF page into a separate editable slide in .pptx format, giving you a working starting point you can customize directly in Microsoft PowerPoint or Google Slides.',
    steps: [
      { icon: '📄', title: 'Upload PDF',          desc: 'Upload the PDF presentation or document.' },
      { icon: '⚡', title: 'Convert',              desc: 'PDF pages are converted to individual PowerPoint slides.' },
      { icon: '⬇️', title: 'Download .pptx',    desc: 'Download the editable PowerPoint file.' },
    ],
    benefits: [
      'Convert PDF pages to editable PowerPoint slides',
      'Each PDF page becomes a separate slide',
      'Edit content, add animations, and customise in PowerPoint',
      'Compatible with Microsoft PowerPoint and Google Slides',
      'Ideal for repurposing reports and documents as presentations',
      'Free - no account or software needed',
    ],
    faqs: [
      { q: 'Will each PDF page become a slide?', a: 'Yes, each page of the PDF is converted to a corresponding slide in the PowerPoint file.' },
      { q: 'Can I edit the slides after conversion?', a: 'Yes, the .pptx output is editable in Microsoft PowerPoint, Google Slides, and LibreOffice Impress.' },
      { q: 'Will images and charts from the PDF appear on the slides?', a: 'Images and graphics from the PDF are included in the slide content. Complex layouts may need minor adjustments after conversion.' },
      { q: 'What is the maximum PDF size?', a: 'PDFs up to 50 MB can be converted.' },
      { q: 'Is this converter free?', a: 'Yes, PDF to PowerPoint conversion is completely free on ApnaConverter.' },
    ],
  },

  'pdf-to-excel': {
    intro: 'Financial reports, invoices, and data summaries exported as PDF are frustrating to analyze. Our PDF to Excel converter extracts tabular data and produces an editable .xlsx spreadsheet file, eliminating manual re-entry and letting you immediately sort, filter, chart, and analyze your numbers in Excel or Google Sheets.',
    steps: [
      { icon: '📄', title: 'Upload PDF',        desc: 'Upload a PDF containing tables, data, or financial information.' },
      { icon: '⚡', title: 'Extract Data',      desc: 'Tables and structured data are extracted from the PDF.' },
      { icon: '⬇️', title: 'Download .xlsx',  desc: 'Download the editable Excel spreadsheet.' },
    ],
    benefits: [
      'Extract tables from PDFs directly into Excel format',
      'Editable .xlsx output works in Excel, Google Sheets, and more',
      'Ideal for invoices, financial statements, and data reports',
      'Eliminates manual data re-entry',
      'Works with multi-page PDFs',
      'Completely free to use',
    ],
    faqs: [
      { q: 'What types of PDFs work best?', a: 'Text-based PDFs with clear table structures work best. Scanned PDFs require OCR processing first.' },
      { q: 'Can I open the .xlsx file in Google Sheets?', a: 'Yes, upload the .xlsx file directly to Google Drive and it will open in Google Sheets.' },
      { q: 'What if the PDF has multiple tables?', a: 'Multiple tables are extracted to separate sheets within the Excel workbook.' },
      { q: 'Is it accurate for financial documents?', a: 'For clearly structured financial PDFs, accuracy is very high. Always verify important figures after conversion.' },
      { q: 'Is the PDF to Excel tool free?', a: 'Yes, completely free on ApnaConverter.' },
    ],
  },

  'heic-to-jpg': {
    intro: 'Apple devices save photos in HEIC format for superior compression, but HEIC files do not open on Windows, most Android devices, or standard web platforms. Our HEIC to JPG converter instantly batch-converts your iPhone and iPad photos to universally compatible JPG files you can share with anyone, anywhere.',
    steps: [
      { icon: '📷', title: 'Upload HEIC',   desc: 'Select HEIC photos from your iPhone or iPad.' },
      { icon: '⚡', title: 'Convert',        desc: 'HEIC files are converted to universally compatible JPG.' },
      { icon: '⬇️', title: 'Download JPG', desc: 'Download JPGs ready to share on any platform.' },
    ],
    benefits: [
      'Convert Apple HEIC photos to widely-compatible JPG',
      'JPG files open on Windows, Android, and all web platforms',
      'Share iPhone photos with anyone regardless of their device',
      'Batch convert multiple HEIC files at once',
      'No quality loss - high-resolution output',
      'Free - no software installation needed',
    ],
    faqs: [
      { q: 'What is a HEIC file?', a: 'HEIC (High Efficiency Image Container) is the default photo format used by iPhones and iPads since iOS 11. While it offers better compression than JPG, many non-Apple platforms cannot open HEIC files.' },
      { q: 'Why convert HEIC to JPG?', a: 'JPG is universally compatible with all devices, operating systems, websites, and apps. Converting HEIC to JPG ensures your photos can be viewed and shared anywhere.' },
      { q: 'Will there be quality loss?', a: 'The conversion is performed at high quality. JPG uses lossy compression, but the output quality is visually identical to the original for typical viewing.' },
      { q: 'Can I convert multiple HEIC files at once?', a: 'Yes, you can upload and convert multiple HEIC files in a single batch.' },
      { q: 'Is HEIC to JPG conversion free?', a: 'Yes, it is completely free on ApnaConverter.' },
    ],
  },

  'gif-to-pdf': {
    intro: 'Archiving animated sequences, design mockups, or GIF-based tutorials in a more universally accessible format is easy with our GIF to PDF tool. Each frame of an animated GIF becomes a separate PDF page, or a static GIF is embedded as a single-page document, printable and viewable on any device without special software.',
    steps: [
      { icon: '🎞️', title: 'Upload GIF',    desc: 'Upload a static or animated GIF image.' },
      { icon: '⚡', title: 'Convert',         desc: 'GIF frames are rendered and embedded into a PDF.' },
      { icon: '⬇️', title: 'Download PDF',  desc: 'Download a PDF containing your GIF content.' },
    ],
    benefits: [
      'Convert GIF images to PDF for sharing or archiving',
      'Each frame of an animated GIF becomes a separate PDF page',
      'Static GIFs are embedded as a single-page PDF',
      'Useful for documenting animated sequences',
      'PDF format is universal and printable',
      'Free to use - no account needed',
    ],
    faqs: [
      { q: 'What happens to animated GIFs?', a: 'Each frame of an animated GIF becomes a separate page in the PDF, letting you review or print individual frames.' },
      { q: 'What page size is used?', a: 'The PDF is sized to fit the GIF dimensions. Large GIFs are placed on A4-equivalent pages.' },
      { q: 'Can I convert multiple GIFs at once?', a: 'Yes, multiple GIF files are combined into a single PDF document.' },
      { q: 'Is the image quality preserved?', a: 'Yes, the GIF is embedded at its original resolution without additional quality loss.' },
      { q: 'Is GIF to PDF conversion free?', a: 'Yes, completely free on ApnaConverter.' },
    ],
  },

  'markdown-to-pdf': {
    intro: 'Markdown is great for writing, but PDF is the standard for sharing. Our Markdown to PDF converter processes your .md file and renders all syntax (headings, bold, italic, code blocks, tables, and lists) into a clean, professional PDF. Perfect for README files, technical documentation, and written reports.',
    steps: [
      { icon: '📝', title: 'Upload Markdown', desc: 'Upload a .md or .markdown file.' },
      { icon: '⚡', title: 'Render',           desc: 'Markdown is rendered to a beautifully formatted PDF.' },
      { icon: '⬇️', title: 'Download PDF',   desc: 'Download a professional PDF from your Markdown document.' },
    ],
    benefits: [
      'Convert .md files to shareable, printable PDFs',
      'All Markdown syntax rendered: headings, bold, lists, code blocks',
      'Great for sharing README files and technical documentation',
      'Ideal for developers, technical writers, and students',
      'Clean, professional output without any setup',
      'Completely free to use',
    ],
    faqs: [
      { q: 'What Markdown syntax is supported?', a: 'Full CommonMark Markdown: headings (#-######), bold, italic, lists, ordered lists, code blocks, inline code, blockquotes, tables, and links.' },
      { q: 'Are code blocks rendered with syntax highlighting?', a: 'Yes, fenced code blocks with language hints (e.g. ```python) are rendered with basic syntax highlighting.' },
      { q: 'Can I convert GitHub README files?', a: 'Yes, GitHub-Flavored Markdown (GFM) is supported, including tables and task lists.' },
      { q: 'What styling does the PDF have?', a: 'A clean, readable typographic style with appropriate font sizes, spacing, and margins for professional output.' },
      { q: 'Is Markdown to PDF conversion free?', a: 'Yes, completely free on ApnaConverter.' },
    ],
  },

  'csv-to-pdf': {
    intro: 'Need to share spreadsheet data with someone who does not use Excel or Google Sheets? Our CSV to PDF converter formats your comma-separated data into a neatly structured table in a PDF document that anyone can open, print, and read, no spreadsheet software needed on the recipient end.',
    steps: [
      { icon: '📊', title: 'Upload CSV',    desc: 'Upload a .csv spreadsheet file.' },
      { icon: '⚡', title: 'Convert',        desc: 'CSV data is formatted into a clean PDF table.' },
      { icon: '⬇️', title: 'Download PDF', desc: 'Download a professional PDF report from your data.' },
    ],
    benefits: [
      'Turn spreadsheet data into a professional PDF report',
      'CSV data is rendered in a clean, readable table format',
      'Useful for sharing data with non-Excel users',
      'Perfect for invoices, summaries, and reports',
      'Works with any CSV file from Excel or Google Sheets',
      'Free - no account required',
    ],
    faqs: [
      { q: 'What CSV format does this tool accept?', a: 'Standard comma-separated values (.csv) files are supported. Files exported from Excel, Google Sheets, or any standard CSV generator will work.' },
      { q: 'How many rows and columns can the CSV have?', a: 'There is no hard limit, but very wide tables may be scaled to fit the page. Files up to 50 MB are accepted.' },
      { q: 'Can I control the table styling?', a: 'A clean default table style is applied with alternating row colours for readability. Custom styling is not available in this tool.' },
      { q: 'What if my CSV uses a semicolon as delimiter?', a: 'If your file uses semicolons instead of commas, convert it to comma-separated format first in Excel or Google Sheets.' },
      { q: 'Is CSV to PDF conversion free?', a: 'Yes, completely free on ApnaConverter.' },
    ],
  },

  'html-to-pdf': {
    intro: 'Archiving web pages, generating invoices from HTML templates, and converting browser-rendered reports to PDF is easy with our HTML to PDF tool. Upload an HTML file and get back a pixel-accurate PDF that preserves your layout, styles, and images, ready for sharing, printing, or long-term archiving.',
    steps: [
      { icon: '🌐', title: 'Upload HTML',   desc: 'Upload an .html file or paste a URL.' },
      { icon: '⚡', title: 'Render',         desc: 'The HTML is rendered and converted to a PDF document.' },
      { icon: '⬇️', title: 'Download PDF', desc: 'Download a PDF that looks like the web page.' },
    ],
    benefits: [
      'Convert web pages and HTML files to PDF',
      'Preserves layout, styles, and images from the HTML',
      'Great for archiving web content or printing web pages',
      'Useful for invoices and reports generated in HTML',
      'No browser print dialog needed',
      'Free to use - no account required',
    ],
    faqs: [
      { q: 'Can I convert a web page URL to PDF?', a: 'Yes, you can provide a URL and the tool will fetch and render the page to PDF.' },
      { q: 'Are external stylesheets and images included?', a: 'Inline styles and images are included. External stylesheets must be properly linked in the HTML file.' },
      { q: 'Does it render JavaScript content?', a: 'Basic JavaScript rendering is supported. Complex single-page applications may not render completely.' },
      { q: 'Can I use this to print web receipts or invoices?', a: 'Yes, HTML to PDF is widely used for generating invoices, order confirmations, and receipts from web templates.' },
      { q: 'Is HTML to PDF conversion free?', a: 'Yes, completely free on ApnaConverter.' },
    ],
  },

  'svg-to-pdf': {
    intro: 'SVG vector graphics are perfect for design but impractical for printing or embedding in shared documents. Our SVG to PDF converter produces a crisp, resolution-independent PDF where your artwork stays sharp at any print size, ideal for logos, icons, technical diagrams, and print-ready design assets.',
    steps: [
      { icon: '🎨', title: 'Upload SVG',    desc: 'Select your .svg vector file.' },
      { icon: '⚡', title: 'Convert',        desc: 'The SVG is rendered at full resolution into a PDF.' },
      { icon: '⬇️', title: 'Download PDF', desc: 'Download a crisp, scalable PDF from your vector graphic.' },
    ],
    benefits: [
      'Convert SVG vector graphics to print-ready PDF',
      'Perfect quality at any size - vectors stay sharp',
      'Ideal for logos, icons, illustrations, and diagrams',
      'PDF output can be printed, shared, or embedded',
      'Compatible with all professional print workflows',
      'Completely free to use',
    ],
    faqs: [
      { q: 'Will the SVG remain crisp at any size?', a: 'Yes, SVGs are vector-based and scale to any size without quality loss. The resulting PDF retains this crispness at all print sizes.' },
      { q: 'Are embedded images in SVG supported?', a: 'Embedded raster images (base64 or linked) inside the SVG are included in the PDF if they are accessible.' },
      { q: 'Can I convert SVG icons for a print design?', a: 'Yes, SVG to PDF is commonly used to prepare vector logos and icons for print production workflows.' },
      { q: 'What SVG features are supported?', a: 'Standard SVG 1.1 features including paths, shapes, text, gradients, and transforms. SVG animations are not included in the static PDF output.' },
      { q: 'Is SVG to PDF conversion free?', a: 'Yes, completely free on ApnaConverter.' },
    ],
  },

  'unlock-pdf': {
    intro: 'Forgotten the password on your own PDF? Or need to remove printing and copying restrictions from a document you are authorized to use? Our PDF Unlocker removes standard owner password protection and usage restrictions, restoring full access so you can view, print, and copy your document without barriers.',
    steps: [
      { icon: '🔒', title: 'Upload PDF',              desc: 'Upload the password-protected PDF you want to unlock.' },
      { icon: '🔑', title: 'Enter Password',          desc: 'Enter the document password to authorise removal.' },
      { icon: '⬇️', title: 'Download Unlocked PDF', desc: 'Download the PDF without password restrictions.' },
    ],
    benefits: [
      'Remove password protection from PDFs you own',
      'Unlocked PDF can be opened without entering a password',
      'Useful when you forget the password you set yourself',
      'Also removes printing and copying restrictions',
      'Works on PDFs encrypted with standard 128/256-bit security',
      'Files are auto-deleted within 2 hours',
    ],
    faqs: [
      { q: 'Do I need to know the password to unlock the PDF?', a: 'Yes, you must enter the correct password. This tool is designed for document owners who want to remove protection from their own files.' },
      { q: 'Can this tool crack unknown passwords?', a: 'No, this tool cannot crack or bypass unknown passwords. You must know the correct password to unlock the file.' },
      { q: 'What types of PDF restrictions can be removed?', a: 'Open password (required to view the file), print restrictions, and copy restrictions can all be removed after you enter the correct password.' },
      { q: 'Is unlocking a PDF I own legal?', a: 'Yes, removing protection from a PDF that you own or have legal access to is permitted. Bypassing protection on documents you do not own may violate copyright or terms of service.' },
      { q: 'Is the PDF unlock tool free?', a: 'Yes, completely free on ApnaConverter.' },
    ],
  },

  'protect-pdf': {
    intro: 'Sensitive contracts, financial reports, and personal documents deserve an extra layer of security before you share them. Our PDF Protector adds AES-256 password encryption to your file, preventing unauthorized viewing, printing, and copying, while remaining fully compatible with all PDF viewers on any device.',
    steps: [
      { icon: '📄', title: 'Upload PDF',                desc: 'Upload the PDF you want to password-protect.' },
      { icon: '🔑', title: 'Set Password',              desc: 'Enter the password you want to use for protection.' },
      { icon: '⬇️', title: 'Download Protected PDF', desc: 'Download the encrypted PDF that requires your password to open.' },
    ],
    benefits: [
      'Add AES-256 encryption to your PDF files',
      'Prevent unauthorised viewing, printing, and copying',
      'Protect sensitive contracts, reports, and personal data',
      'Password-protected PDFs open in any standard PDF viewer',
      'Set permissions to restrict what recipients can do',
      'Files are auto-deleted from servers within 2 hours',
    ],
    faqs: [
      { q: 'What type of encryption is applied?', a: 'AES-256 encryption, the same standard used by banks and governments, is applied to protect your PDF.' },
      { q: 'What happens if someone tries to open the PDF without the password?', a: 'PDF viewers will prompt for a password. Without the correct password, the file cannot be opened.' },
      { q: 'Can I also restrict printing and copying?', a: 'Yes, you can set permissions to restrict printing, copying text, and editing the document in addition to requiring a password.' },
      { q: 'What if I forget the password?', a: 'Keep your password safe - there is no recovery option. If the password is lost, the PDF cannot be unlocked without it.' },
      { q: 'Is protecting a PDF free?', a: 'Yes, PDF password protection is completely free on ApnaConverter.' },
    ],
  },

  'organize-pdf': {
    intro: 'Scanned documents often come out in the wrong order, with rotated pages, or with blank pages scattered throughout. Our PDF Organizer gives you a visual drag-and-drop interface to reorder pages, delete unwanted ones, and correct page rotations, then download a clean, properly organized PDF in seconds.',
    steps: [
      { icon: '📄', title: 'Upload PDF',              desc: 'Upload the multi-page PDF you want to reorganise.' },
      { icon: '↕️', title: 'Reorder Pages',           desc: 'Drag and drop pages into the order you want, or delete unwanted pages.' },
      { icon: '⬇️', title: 'Download Organised PDF', desc: 'Download your restructured PDF instantly.' },
    ],
    benefits: [
      'Reorder PDF pages by simple drag-and-drop',
      'Delete unwanted or blank pages easily',
      'Rotate individual pages 90° or 180°',
      'Perfect for fixing incorrectly ordered scan batches',
      'Ideal for removing cover pages or blank separators',
      'Free - no account required',
    ],
    faqs: [
      { q: 'How do I reorder pages?', a: 'After uploading, thumbnails of all pages are shown. Drag and drop thumbnails to rearrange the order, then download the reorganised PDF.' },
      { q: 'Can I delete multiple pages at once?', a: 'Yes, you can select and delete multiple pages simultaneously.' },
      { q: 'Can I rotate pages?', a: 'Yes, individual pages can be rotated 90° clockwise, 90° counter-clockwise, or 180°.' },
      { q: 'Is there a page limit?', a: 'You can reorganise PDFs of any length, up to 50 MB in file size.' },
      { q: 'Is PDF organisation free?', a: 'Yes, completely free on ApnaConverter.' },
    ],
  },

  'resume-builder': {
    intro: 'Your resume needs to pass an ATS scanner before a human ever reads it. ApnaConverter\'s Resume Builder combines professional visual templates with a real-time ATS score so you can see exactly how recruiters\' systems rank your resume and optimize every section as you write. Build, score, and download your resume free.',
    steps: [
      { icon: '🎨', title: 'Choose a Template',  desc: 'Pick from ATS-friendly resume templates designed to pass applicant tracking systems.' },
      { icon: '✍️', title: 'Fill in Your Details', desc: 'Add your experience, education, skills, and projects with live ATS score feedback.' },
      { icon: '⬇️', title: 'Download Your PDF',  desc: 'Export a polished, ATS-readable PDF resume - completely free, no sign-up required.' },
    ],
    benefits: [
      'Build a professional resume in minutes with live preview',
      'ATS-friendly templates designed to pass applicant tracking systems',
      'Real-time ATS score with suggestions to improve your resume',
      'Drag-and-drop section reordering and custom sections',
      'Save multiple resumes locally and edit anytime',
      'Completely free - no account or sign-up required',
    ],
    faqs: [
      { q: 'Is the resume builder really free?', a: 'Yes, completely free with no sign-up, watermarks, or hidden limits on downloads.' },
      { q: 'What does "ATS-friendly" mean?', a: 'Applicant Tracking Systems (ATS) scan resumes for keywords and structure before a human sees them. Our templates use single-column layouts, standard fonts, and clear section headings so your resume is parsed correctly.' },
      { q: 'Is the ATS score accurate?', a: 'The score checks common ATS best practices - contact details, summary length, quantified achievements, skills, and overall resume length - to help you identify quick improvements.' },
      { q: 'Where is my resume data stored?', a: 'Your resume data is saved locally in your browser. Nothing is uploaded to a server, so your information stays private.' },
      { q: 'Can I create more than one resume?', a: 'Yes, you can create, duplicate, and switch between multiple resumes from the toolbar.' },
      { q: 'What format is the downloaded resume?', a: 'A multi-page, print-ready A4 PDF with selectable text - ready to upload to job portals or email to recruiters.' },
    ],
  },


  'biodata-maker': {
    intro: 'Marriage biodata and professional biodata both need to look polished and cover the right information for their audience. Our Biodata Maker provides purpose-built templates that guide you through every section (personal details, family background, education, career, and preferences) so you present yourself confidently and professionally.',
    steps: [
      { icon: '🎨', title: 'Choose a Template', desc: 'Pick from Classic Marriage, Professional, or Modern Card templates to match your style.' },
      { icon: '✍️', title: 'Fill in Your Details', desc: 'Enter personal info, education, professional details, family info, and upload your photo.' },
      { icon: '⬇️', title: 'Download Your PDF', desc: 'Download a print-ready, beautifully formatted A4 biodata PDF - completely free.' },
    ],
    benefits: [
      'Marriage biodata with family details, partner preferences, and photo',
      'Professional biodata format for job applications and general use',
      'Photo upload stored securely in your browser - never uploaded to any server',
      'Three distinct templates: Classic, Professional, and Modern Card',
      'Toggle sections on/off to customise what appears in the PDF',
      'Completely free - no account or sign-up required',
    ],
    faqs: [
      { q: 'Is the biodata maker free?', a: 'Yes, 100% free with no sign-up, no watermarks, and no hidden charges. Download as many PDFs as you like.' },
      { q: 'What is the difference between marriage biodata and professional biodata?', a: 'Marriage biodata includes personal details like religion, caste, height, complexion, family information, and partner expectations. Professional biodata focuses on work experience, education, and skills - suitable for job applications or general introductions.' },
      { q: 'Is my photo and personal data safe?', a: 'Yes. Your entire biodata, including your photo, is saved only in your browser\'s local storage. Nothing is ever sent to our servers. Your data is completely private.' },
      { q: 'Can I create multiple biodatas?', a: 'Yes, you can create, duplicate, rename, and switch between multiple biodatas using the toolbar.' },
      { q: 'Can I hide certain sections from the PDF?', a: 'Yes - each section has a visibility toggle (eye icon). Hidden sections are still saved in the editor but won\'t appear in the downloaded PDF.' },
      { q: 'What format is the downloaded biodata?', a: 'A print-ready A4 PDF. You can print it directly or share it digitally via email or WhatsApp.' },
    ],
  },

};
