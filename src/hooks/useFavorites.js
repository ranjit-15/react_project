// useFavorites.js
// A custom React hook that manages the user's favorite recipes.
// It reads from and writes to localStorage automatically,
// so favorites are still there even after a page refresh.

import { useState, useEffect } from 'react';

// The key we use to store favorites in the browser's localStorage
const STORAGE_KEY = 'recipeFinder_favorites';

function useFavorites() {
  // Load saved favorites from localStorage when the app first opens.
  // If nothing was saved yet, we start with an empty array.
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      // If reading localStorage fails for any reason, just start fresh
      return [];
    }
  });

  // Whenever the favorites list changes, save the updated list to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Check whether a specific recipe (by its ID) is in the favorites list
  function isFavorite(mealId) {
    return favorites.some((meal) => meal.idMeal === mealId);
  }

  // Add a recipe to favorites (if it's not already there)
  function addFavorite(meal) {
    setFavorites((prev) => {
      if (prev.some((m) => m.idMeal === meal.idMeal)) return prev;
      return [...prev, meal];
    });
  }

  // Remove a recipe from favorites by its ID
  function removeFavorite(mealId) {
    setFavorites((prev) => prev.filter((m) => m.idMeal !== mealId));
  }

  // Toggle: if it's a favorite → remove it; if it's not → add it
  function toggleFavorite(meal) {
    if (isFavorite(meal.idMeal)) {
      removeFavorite(meal.idMeal);
    } else {
      addFavorite(meal);
    }
  }

  return { favorites, isFavorite, toggleFavorite };
}

export default useFavorites;
