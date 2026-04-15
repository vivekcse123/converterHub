export interface ConversionResult {
  fileName:    string;
  downloadUrl: string;
  size:        number;
  originalSize?: number;
  newSize?:      number;
  pageCount?:    number;
}

export interface ConversionHistory {
  _id:             string;
  tool:            string;
  status:          'pending' | 'processing' | 'completed' | 'failed';
  inputFiles:      InputFileMeta[];
  outputFile?:     OutputFileMeta;
  errorMessage?:   string;
  processingTimeMs?: number;
  createdAt:       string;
}

export interface InputFileMeta {
  originalName: string;
  size:         number;
  mimeType:     string;
}

export interface OutputFileMeta {
  fileName: string;
  size:     number;
  url:      string;
}

export interface PaginatedResponse<T> {
  success:    boolean;
  message:    string;
  data:       T[];
  pagination: { total: number; page: number; limit: number; pages: number };
}
