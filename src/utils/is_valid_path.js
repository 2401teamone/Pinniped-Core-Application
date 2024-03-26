export default function isValidPath(filePath) {
  // Check for illegal characters or patterns
  // const illegalChars = /[\0<>:"/\\|?*\x00-\x1F]/;
  // const isIllegal = illegalChars.test(filePath);

  // Check for directory traversal patterns
  const isTraversal = /(\.\.\/|\.\.\\)/.test(filePath);

  return !isTraversal;
}
