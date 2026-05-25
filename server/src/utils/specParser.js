import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'module';
import mammoth from 'mammoth';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

/**
 * Extracts plain text from an uploaded specification file (.pdf, .docx, .md).
 */
export const parseSpecificationFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.md' || ext === '.markdown') {
    return await fs.readFile(filePath, 'utf8');
  }

  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  }

  if (ext === '.pdf') {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text || '';
  }

  throw new Error('Unsupported specification file type');
};
