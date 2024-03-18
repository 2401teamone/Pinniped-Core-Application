import catchError from "../../utils/catch_error.js";

export default function setHeaders() {
  return catchError(async (req, res, next) => {
    // SECURITY HEADERS
    // Set X-XSS-Protection header to enable XSS protection in modern browsers
    res.setHeader("X-XSS-Protection", "1; mode=block");

    // Set X-Content-Type-Options header to prevent content sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Set Referrer-Policy header to control referrer information
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Set X-Frame-Options header to prevent clickjacking attacks
    res.setHeader("X-Frame-Options", "DENY");

    next();
  });
}
