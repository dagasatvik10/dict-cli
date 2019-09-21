exports.parseRelatedWordsResponse = data => {
  if (data && data.length) {
    const result = data.reduce((acc, v) => {
      acc[v.relationshipType] = v.words;
      return acc;
    }, {});
    return result;
  }
  return {};
};
