// Home.jsx
// The main "Discover" page of the Recipe Finder app.
//
// What this page does:
//   1. AUTO-LOADS popular recipes on first visit (useEffect on mount)
//   2. Shows a hero banner with the search bar
//   3. Lets the user filter results by category using FilterBar
//   4. Fetches recipes from TheMealDB API when the user searches
//   5. Displays results as RecipeCard components in a responsive grid
//   6. Handles loading, error, and empty states with helpful UI
//   7. "Load More" button to paginate through results
//   8. Opens a RecipeModal when the user clicks a card

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
// Search by name:    https://www.themealdb.com/api/json/v1/1/search.php?s=pasta
// By category:      https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken
// Full details:     https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772
const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

// Popular search terms we use to load recipes on the home page automatically.
// We fetch a few different categories so users see variety right away.
const POPULAR_TERMS = ['chicken', 'pasta', 'beef', 'seafood', 'dessert', 'vegetarian'];

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

  // true when showing auto-loaded popular recipes (vs. a user search)
  const [isShowingPopular, setIsShowingPopular] = useState(false);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ──────────────────────────────────────────────────────────────────
  // AUTO-LOAD POPULAR RECIPES ON MOUNT
  // useEffect with an empty [] runs exactly once when the page loads.
  // We fetch recipes from multiple popular categories and combine them
  // so the home page always has content — no searching required!
  // ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadPopularRecipes() {
      setIsLoading(true);
      setError(null);
      setIsShowingPopular(true);

      try {
        // Fetch 3 popular categories in parallel using Promise.all
        // (runs all fetches at the same time instead of one by one)
        const fetches = POPULAR_TERMS.slice(0, 4).map((term) =>
          fetch(`${API_BASE}/search.php?s=${term}`).then((r) => r.json())
        );

        const results = await Promise.all(fetches);

        // Combine all the meal arrays from each response
        const combined = results.flatMap((data) => data.meals || []);

        // Remove duplicate recipes (same idMeal can come from multiple searches)
        const seen = new Set();
        const unique = combined.filter((meal) => {
          if (seen.has(meal.idMeal)) return false;
          seen.add(meal.idMeal);
          return true;
        });

        // Shuffle the results so each visit shows a fresh mix of recipes
        const shuffled = unique.sort(() => Math.random() - 0.5);

        setAllResults(shuffled);
        setSearchedQuery('Popular Recipes');
      } catch (err) {
        setError('Could not load recipes. Please check your internet connection.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPopularRecipes();
  }, []); // empty array = run only once when component mounts

  // ────────────────────────────────────────────────
  // Fetch recipes from the API when the user searches
  // ────────────────────────────────────────────────
  async function handleSearch(query) {
    setIsLoading(true);
    setError(null);
    setIsShowingPopular(false);
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

  // Decide what label to show above the results grid
  const resultsLabel = isShowingPopular
    ? `Showing ${visibleResults.length} of ${filteredResults.length} popular recipes`
    : `Showing ${visibleResults.length} of ${filteredResults.length} results for "${searchedQuery}"`;

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

        {/* Quick-search pill buttons so users can try popular terms */}
        <div className="home-quick-searches">
          <span className="home-quick-searches__label">Try:</span>
          {['Chicken', 'Pasta', 'Sushi', 'Chocolate', 'Soup', 'Tacos'].map((term) => (
            <button
              key={term}
              className="home-quick-searches__pill"
              onClick={() => handleSearch(term)}
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      {/* ── Content area ── */}
      <section className="container">

        {/* ── Loading state ── */}
        {isLoading && <LoadingSpinner message={isShowingPopular ? 'Loading popular recipes…' : 'Searching recipes…'} />}

        {/* ── Error state ── */}
        {!isLoading && error && (
          <div className="home-error">
            <span className="home-error__icon">⚠️</span>
            <h2 className="home-error__title">Oops! Something went wrong</h2>
            <p className="home-error__message">{error}</p>
            <button className="home-retry-btn" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}

        {/* ── Results grid ── */}
        {!isLoading && !error && allResults.length > 0 && (
          <>
            {/* Section heading */}
            <div className="home-section-header">
              <h2 className="home-section-title">
                {isShowingPopular ? '🔥 Popular Recipes' : `🔍 Results for "${searchedQuery}"`}
              </h2>
            </div>

            {/* Filter bar + results count row */}
            <div className="home-controls">
              <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              <p className="home-results-count">{resultsLabel}</p>
            </div>

            {/* No results after filtering */}
            {filteredResults.length === 0 && (
              <div className="home-empty">
                <span className="home-empty__icon">🍽️</span>
                <h2 className="home-empty__title">No recipes found</h2>
                <p className="home-empty__subtitle">
                  No {selectedCategory} recipes found. Try a different filter or search.
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

        {/* ── No search results state ── */}
        {!isLoading && !error && !isShowingPopular && allResults.length === 0 && (
          <div className="home-empty">
            <span className="home-empty__icon">🍽️</span>
            <h2 className="home-empty__title">No recipes found</h2>
            <p className="home-empty__subtitle">
              We couldn&apos;t find anything for &ldquo;{searchedQuery}&rdquo;. Try &ldquo;pasta&rdquo;, &ldquo;chicken&rdquo;, or &ldquo;chocolate&rdquo;.
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
