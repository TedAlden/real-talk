export const sampleWithoutReplacement = (arr, N) => {
  const m = arr.length;
  // Make a copy so we don’t mutate the original
  const a = arr.slice();

  // Fisher–Yates shuffle in-place
  for (let i = m - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  // Return the first N items (or all if N exceeds length)
  return a.slice(0, Math.min(N, m));
};

export const getTopN = (scoreObj, N) => {
  const scoreEntries = Object.entries(scoreObj);
  const sortedScoreEntries = scoreEntries.sort((a, b) => b[1] - a[1]);
  return sortedScoreEntries.slice(0, Math.min(N, sortedScoreEntries.length));
};
