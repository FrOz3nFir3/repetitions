export function getTextFromHtml(html) {
  var divContainer = document.createElement("div");
  divContainer.innerHTML = html;
  return divContainer.textContent || divContainer.innerText || "";
}

// Language favorites management
const FAVORITES_KEY = "richTextEditor_favoriteLanguages";
const MAX_FAVORITES = 5;

export function getFavoriteLanguages() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    // console.warn("Failed to load favorite languages from localStorage:", error);
    return [];
  }
}

export function addToFavoriteLanguages(languageValue) {
  try {
    const favorites = getFavoriteLanguages();

    // Don't add if already in favorites
    if (favorites.includes(languageValue)) {
      return favorites;
    }

    // Add to beginning of array
    const newFavorites = [languageValue, ...favorites];

    // Keep only max favorites
    const trimmedFavorites = newFavorites.slice(0, MAX_FAVORITES);

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(trimmedFavorites));
    return trimmedFavorites;
  } catch (error) {
    // console.warn("Failed to save favorite language to localStorage:", error);
    return getFavoriteLanguages();
  }
}

export function removeFromFavoriteLanguages(languageValue) {
  try {
    const favorites = getFavoriteLanguages();
    const newFavorites = favorites.filter((lang) => lang !== languageValue);

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    return newFavorites;
  } catch (error) {
    // console.warn(
    //   "Failed to remove favorite language from localStorage:",
    //   error
    // );
    return getFavoriteLanguages();
  }
}

export function isLanguageFavorite(languageValue) {
  const favorites = getFavoriteLanguages();
  return favorites.includes(languageValue);
}
