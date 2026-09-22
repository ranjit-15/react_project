// RecipeCard.jsx
// Displays a single recipe as a card in the grid.
// Each card shows the recipe photo, name, country of origin, and category.
// The user can click anywhere on the card to open the full details,
// or click the heart button to save/remove the recipe from favorites.

import './RecipeCard.css';

// Props:
//   meal          — the recipe data object from TheMealDB API
//   onSelect(meal) — called when the user clicks the card (to open the detail modal)
//   isFavorite    — boolean: is this recipe already saved to favorites?
//   onToggleFav(meal) — called when the user clicks the heart button
function RecipeCard({ meal, onSelect, isFavorite, onToggleFav }) {
  // Stop the heart-button click from also triggering the card's onClick
  function handleFavClick(event) {
    event.stopPropagation();
    onToggleFav(meal);
  }

  return (
    <article
      className="recipe-card"
      onClick={() => onSelect(meal)}
      // Keyboard accessibility: treat the card as a button
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(meal)}
      aria-label={`View recipe: ${meal.strMeal}`}
    >
      {/* ── Recipe photo ── */}
      <div className="recipe-card__image-wrapper">
        <img
          src={meal.strMealThumb}
          alt={`Photo of ${meal.strMeal}`}
          className="recipe-card__image"
          loading="lazy"          // only load images when they scroll into view
        />

        {/* Category badge (e.g. "Pasta", "Chicken") */}
        {meal.strCategory && (
          <span className="recipe-card__category-badge">
            {meal.strCategory}
          </span>
        )}

        {/* Heart / favorite button */}
        <button
          className={`recipe-card__fav-button ${isFavorite ? 'is-favorite' : ''}`}
          onClick={handleFavClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* ── Card text ── */}
      <div className="recipe-card__body">
        <h2 className="recipe-card__title">{meal.strMeal}</h2>

        {meal.strArea && (
          <p className="recipe-card__area">🌍 {meal.strArea} cuisine</p>
        )}

        <div className="recipe-card__cta">
          <span>View recipe</span>
          <span>→</span>
        </div>
      </div>
    </article>
  );
}

export default RecipeCard;
