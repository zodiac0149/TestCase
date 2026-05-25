import multer from 'multer';
import path from 'path';
import { ApiError } from '../utils/ApiError.js';

const storage = multer.diskStorage({
  destination: 'server/uploads',
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/[^a-z0-9._-]/gi, '_')}`);
  },
});

export const uploadZip = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isZip = path.extname(file.originalname).toLowerCase() === '.zip';
    cb(isZip ? null : new ApiError(400, 'Only ZIP repository uploads are supported'), isZip);
  },
});

export const uploadSpec = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isValid = ['.pdf', '.docx', '.md', '.markdown'].includes(ext);
    cb(isValid ? null : new ApiError(400, 'Only PDF, DOCX, and Markdown specifications are supported'), isValid);
  },
});
