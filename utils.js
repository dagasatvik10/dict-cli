/**
 *
 * @param {string} text
 * @returns
 */
exports.removeHtmlTags = (text) => {
  if (text) {
    return text.replace(/<[^>]+>/g, '');
  }
  return '';
};
