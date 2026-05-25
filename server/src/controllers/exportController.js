import * as exportService from '../services/exportService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const markdown = asyncHandler(async (req, res) => {
  const content = await exportService.exportMarkdown({ userId: req.user._id, projectId: req.params.projectId });
  res.setHeader('Content-Type', 'text/markdown');
  res.setHeader('Content-Disposition', `attachment; filename="test-cases-${req.params.projectId}.md"`);
  res.send(content);
});

export const json = asyncHandler(async (req, res) => {
  const content = await exportService.exportJson({ userId: req.user._id, projectId: req.params.projectId });
  res.json({ success: true, message: 'JSON export generated', data: content });
});

export const pdf = asyncHandler(async (req, res) => {
  const buffer = await exportService.exportPdfBuffer({ userId: req.user._id, projectId: req.params.projectId });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="test-cases-${req.params.projectId}.pdf"`);
  res.send(buffer);
});
