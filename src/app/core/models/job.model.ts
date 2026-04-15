export interface Job {
  _id:         string;
  user?:       string;
  sessionId?:  string;
  tool:        string;
  status:      'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  priority:    number;
  progress:    number;
  inputFiles:  JobFile[];
  outputFiles: JobOutputFile[];
  options:     Record<string, unknown>;
  bullJobId?:  string;
  queuedAt:    string;
  startedAt?:  string;
  completedAt?: string;
  processingTimeMs?: number;
  errorMessage?:     string;
  retryCount:  number;
  createdAt:   string;
}

export interface JobFile {
  originalName: string;
  storedName:   string;
  path:         string;
  size:         number;
  mimeType:     string;
}

export interface JobOutputFile {
  fileName: string;
  path:     string;
  url:      string;
  size:     number;
}

export interface JobProgress {
  jobId:    string;
  progress: number;
  message?: string;
}
