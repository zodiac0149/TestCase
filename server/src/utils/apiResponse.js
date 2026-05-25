export const sendSuccess = (res, data, message = 'OK', statusCode = 200) => {
  res.status(statusCode).json({ success: true, message, data });
};
