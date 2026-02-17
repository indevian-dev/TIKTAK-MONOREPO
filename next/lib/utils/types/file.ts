/**
 * File Helper Types
 * Types for file upload and processing helpers
 */

// ═══════════════════════════════════════════════════════════════
// FILE UPLOAD
// ═══════════════════════════════════════════════════════════════

export interface FileUploadConfig {
  maxSize?: number; // in bytes
  maxFiles?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
  convertToWebP?: boolean;
  resize?: ImageResizeConfig;
  compress?: boolean;
  compressionQuality?: number;
}

export interface ImageResizeConfig {
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

// ═══════════════════════════════════════════════════════════════
// FILE UPLOAD RESULT
// ═══════════════════════════════════════════════════════════════

export interface FileUploadResult {
  success: boolean;
  url?: string;
  key?: string;
  filename?: string;
  size?: number;
  mimetype?: string;
  width?: number;
  height?: number;
  error?: string;
}

export interface MultiFileUploadResult {
  success: boolean;
  files: FileUploadResult[];
  totalUploaded: number;
  totalFailed: number;
  errors?: string[];
}

// ═══════════════════════════════════════════════════════════════
// FILE METADATA
// ═══════════════════════════════════════════════════════════════

export interface FileMetadata {
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  extension: string;
  encoding?: string;
  uploadedAt: Date;
  uploadedBy?: string;
  url: string;
  key: string;
}

export interface ImageMetadata extends FileMetadata {
  width: number;
  height: number;
  format: string;
  hasAlpha: boolean;
  isAnimated?: boolean;
}

export interface VideoMetadata extends FileMetadata {
  duration: number;
  width: number;
  height: number;
  codec: string;
  bitrate?: number;
  fps?: number;
}

// ═══════════════════════════════════════════════════════════════
// FILE VALIDATION
// ═══════════════════════════════════════════════════════════════

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface FileValidationRules {
  maxSize?: number;
  minSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
  requireDimensions?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
  };
}

// ═══════════════════════════════════════════════════════════════
// FILE PROCESSING
// ═══════════════════════════════════════════════════════════════

export interface FileProcessingOptions {
  convert?: {
    format: 'webp' | 'jpeg' | 'png';
    quality?: number;
  };
  resize?: ImageResizeConfig;
  optimize?: boolean;
  watermark?: {
    text?: string;
    image?: string;
    position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    opacity?: number;
  };
}

export interface FileProcessingResult {
  success: boolean;
  processedUrl?: string;
  originalUrl: string;
  operations: string[];
  metadata?: Partial<ImageMetadata>;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════
// STORAGE PROVIDER
// ═══════════════════════════════════════════════════════════════

export interface StorageProvider {
  name: 'aws-s3' | 'tebi' | 'local' | 'cloudinary';
  upload: (file: File | Buffer, config: FileUploadConfig) => Promise<FileUploadResult>;
  delete: (key: string) => Promise<boolean>;
  getUrl: (key: string) => string;
}

