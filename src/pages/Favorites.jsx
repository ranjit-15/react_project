// Favorites.jsx
// The "My Favorites" page, accessible via the /favorites route.
// Displays all recipes the user has saved with the heart button.
// If nothing is saved yet, shows a friendly empty state with a link back to search.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import './Favorites.css';
// The recipe grid styles are already defined in Home.css, which App.jsx imports globally

// Props:
//   favorites          — array of saved meal objects (from useFavorites hook)
//   isFavorite(id)     — function that checks if a meal is favorited
//   onToggleFav(meal)  — adds or removes a recipe from favorites
function Favorites({ favorites, isFavorite, onToggleFav }) {
  // The meal whose details are currently shown in the modal (null = modal closed)
  const [selectedMeal, setSelectedMeal] = useState(null);

  // ── Empty state: user hasn't saved any recipes yet ──
  if (favorites.length === 0) {
    return (
      <main className="page container">
        <div className="favorites-empty">
          <span className="favorites-empty__icon">🤍</span>
          <h1 className="favorites-empty__title">No favorites yet</h1>
          <p className="favorites-empty__subtitle">
            You haven't saved any recipes. Go explore and tap the ❤️ on any recipe to save it here!
          </p>
          {/* Link back to the Discover page */}
          <Link to="/" className="favorites-empty__cta">
            🔍 Discover Recipes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page container">
      {/* ── Page header ── */}
      <div className="favorites-header-row">
        <div className="favorites-header">
          <h1 className="favorites-header__title">
            My <span>Favorites</span>
          </h1>
          <p className="favorites-header__subtitle">
            {favorites.length} recipe{favorites.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {/* ── Grid of saved recipe cards ── */}
      {/* We reuse the same recipe-grid class from Home.css for consistency */}
      <div className="recipe-grid">
        {favorites.map((meal) => (
          <RecipeCard
            key={meal.idMeal}              /* unique key for list rendering */
            meal={meal}
            onSelect={setSelectedMeal}     /* click to open full details */
            isFavorite={isFavorite(meal.idMeal)}
            onToggleFav={onToggleFav}
          />
        ))}
      </div>

      {/* ── Full recipe detail modal ── */}
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

export default Favorites;
