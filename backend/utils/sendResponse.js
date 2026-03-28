/**
 * sendResponse utility
 * Standardises success/error JSON responses across every controller.
 *
 * Usage:
 *   sendResponse(res, 200, true, 'Data fetched', { ... });
 */
const sendResponse = (res, statusCode, success, message, data = {}) => {
  return res.status(statusCode).json({ success, message, data });
};

module.exports = { sendResponse };
