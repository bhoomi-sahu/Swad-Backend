export const getImageUrl = (path) => {
  if (!path) {
    return "https://placehold.co/600x400/f5a06a/ffffff?text=Food";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `http://localhost:5000/${path}`;
};
