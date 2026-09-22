// Home.jsx
// The main "Discover" page of the Recipe Finder app.
//
// What this page does:
//   1. Shows a hero banner with the search bar
//   2. Lets the user filter results by category using FilterBar
//   3. Fetches recipes from TheMealDB API when the user searches
//   4. Displays results as RecipeCard components in a responsive grid
//   5. Handles loading, error, and empty states with helpful UI
//   6. "Load More" button to paginate through results
//   7. Opens a RecipeModal when the user clicks a card

import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

// How many recipes to show at a time before the "Load More" button
const PAGE_SIZE = 12;

// TheMealDB free API — no key required!
// Search by name: https://www.themealdb.com/api/json/v1/1/search.php?s=pasta
// Full details:   https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772
const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

// Props passed down from App.jsx:
//   isFavorite(mealId)     — check if a recipe is in favorites
//   onToggleFav(meal)      — add or remove a recipe from favorites
function Home({ isFavorite, onToggleFav }) {
  // All recipes fetched from the API for the current search query
  const [allResults, setAllResults] = useState([]);

  // The last query the user searched for (used to show "Results for…")
  const [searchedQuery, setSearchedQuery] = useState('');

  // The currently selected category filter chip ("All", "Beef", etc.)
  const [selectedCategory, setSelectedCategory] = useState('All');

  // How many results are currently visible (increases when "Load More" is clicked)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // The full detail data for the recipe the user clicked — shown in the modal
  const [selectedMeal, setSelectedMeal] = useState(null);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // true once first search runs

  // ────────────────────────────────────────────────
  // Fetch recipes from the API when the user searches
  // ────────────────────────────────────────────────
  async function handleSearch(query) {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchedQuery(query);
    setSelectedCategory('All');  // reset filter when a new search runs
    setVisibleCount(PAGE_SIZE);  // reset pagination

    try {
      const response = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }

      const data = await response.json();
      // TheMealDB returns { meals: [...] } or { meals: null } when nothing found
      setAllResults(data.meals || []);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setAllResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  // ──────────────────────────────────────────────────────
  // Fetch the FULL detail of a meal so the modal has all
  // ingredient + instruction data (search results are brief)
  // ──────────────────────────────────────────────────────
  async function handleSelectMeal(meal) {
    try {
      const response = await fetch(`${API_BASE}/lookup.php?i=${meal.idMeal}`);
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        setSelectedMeal(data.meals[0]);
      }
    } catch {
      // If the detail fetch fails, fall back to what we already have
      setSelectedMeal(meal);
    }
  }

  // ──────────────────────────────────────────────────────
  // Filter the results by the selected category.
  // "All" means no filter — return every result.
  // ──────────────────────────────────────────────────────
  const filteredResults =
    selectedCategory === 'All'
      ? allResults
      : allResults.filter(
          (meal) =>
            meal.strCategory?.toLowerCase() === selectedCategory.toLowerCase()
        );

  // Only show up to `visibleCount` recipes at a time
  const visibleResults = filteredResults.slice(0, visibleCount);

  // Whether there are more recipes to show after the current page
  const hasMore = visibleCount < filteredResults.length;

  function loadMore() {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }

  // When the filter changes, reset pagination so we start from the top
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory]);

  return (
    <main className="page">
      {/* ── Hero Banner ── */}
      <section className="home-hero container">
        <span className="home-hero__eyebrow">✨ Free Recipe Discovery</span>
        <h1 className="home-hero__title">
          Find your next <span>favourite dish</span>
        </h1>
        <p className="home-hero__subtitle">
          Search from thousands of recipes by name or ingredient.
          Save your favourites and never lose a great recipe again.
        </p>

        {/* Controlled search form */}
        <SearchBar onSearch={handleSearch} />
      </section>

      {/* ── Content area ── */}
      <section className="container">

        {/* ── Loading state ── */}
        {isLoading && <LoadingSpinner message="Searching recipes…" />}

        {/* ── Error state ── */}
        {!isLoading && error && (
          <div className="home-error">
            <span className="home-error__icon">⚠️</span>
            <h2 className="home-error__title">Oops! Something went wrong</h2>
            <p className="home-error__message">{error}</p>
          </div>
        )}

        {/* ── Results (only shown after a search, when not loading or erroring) ── */}
        {!isLoading && !error && hasSearched && (
          <>
            {/* Filter bar + results count row */}
            {allResults.length > 0 && (
              <div className="home-controls">
                <FilterBar
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
                <p className="home-results-count">
                  Showing <strong>{visibleResults.length}</strong> of{' '}
                  <strong>{filteredResults.length}</strong> results for &ldquo;
                  {searchedQuery}&rdquo;
                </p>
              </div>
            )}

            {/* No results / empty state */}
            {filteredResults.length === 0 && (
              <div className="home-empty">
                <span className="home-empty__icon">🍽️</span>
                <h2 className="home-empty__title">No recipes found</h2>
                <p className="home-empty__subtitle">
                  {allResults.length > 0
                    ? `No ${selectedCategory} recipes in these results. Try a different filter.`
                    : `We couldn't find anything for "${searchedQuery}". Try "pasta", "chicken", or "chocolate".`}
                </p>
              </div>
            )}

            {/* Recipe card grid */}
            {visibleResults.length > 0 && (
              <div className="recipe-grid">
                {visibleResults.map((meal) => (
                  <RecipeCard
                    key={meal.idMeal}      /* unique key required for lists */
                    meal={meal}
                    onSelect={handleSelectMeal}
                    isFavorite={isFavorite(meal.idMeal)}
                    onToggleFav={onToggleFav}
                  />
                ))}
              </div>
            )}

            {/* Load More button */}
            {hasMore && (
              <div className="home-load-more">
                <button className="home-load-more__btn" onClick={loadMore}>
                  Load More Recipes ↓
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Welcome state (before first search) ── */}
        {!isLoading && !error && !hasSearched && (
          <div className="home-empty">
            <span className="home-empty__icon">🔍</span>
            <h2 className="home-empty__title">What are you craving today?</h2>
            <p className="home-empty__subtitle">
              Type a dish name or ingredient above and hit Search to get started!
            </p>
          </div>
        )}
      </section>

      {/* ── Recipe detail modal (shown when a card is clicked) ── */}
      {selectedMeal && (
        <RecipeModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
          isFavorite={isFavorite(selectedMeal.idMeal)}
          onToggleFav={onToggleFav}
        />
      )}
    </main>
  );
}

export default Home;
