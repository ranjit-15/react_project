// RecipeModal.jsx
// A full-screen overlay that shows the complete details of a selected recipe —
// including the hero photo, all ingredients with measurements, step-by-step
// instructions, and a link to the YouTube video (if available).
// Clicking the backdrop or the X button closes the modal.

import { useEffect } from 'react';
import './RecipeModal.css';

// TheMealDB stores up to 20 ingredients and measures as numbered properties:
// strIngredient1, strIngredient2, … strIngredient20
// strMeasure1,    strMeasure2,    … strMeasure20
// This helper collects all non-empty ingredient + measure pairs.
function getIngredients(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const name    = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    // The API sometimes returns empty strings or whitespace — skip those
    if (name && name.trim()) {
      ingredients.push({
        name: name.trim(),
        measure: measure ? measure.trim() : '',
      });
    }
  }

  return ingredients;
}

// Props:
//   meal           — the full recipe data object (from TheMealDB detail endpoint)
//   onClose()      — called when the user wants to close the modal
//   isFavorite     — boolean: is this recipe currently a favorite?
//   onToggleFav(meal) — called when the user clicks the heart button
function RecipeModal({ meal, onClose, isFavorite, onToggleFav }) {
  const ingredients = getIngredients(meal);

  // Close the modal when the user presses the Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);

    // Prevent the page from scrolling while the modal is open
    document.body.style.overflow = 'hidden';

    // Cleanup: restore scroll and remove the listener when the modal closes
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Close the modal only if the user clicks the dark backdrop itself (not the card)
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Recipe details for ${meal.strMeal}`}
    >
      <div className="modal">
        {/* ── Hero image with title overlaid at the bottom ── */}
        <div className="modal__hero">
          <img src={meal.strMealThumb} alt={meal.strMeal} />
          <div className="modal__hero-overlay" />

          {/* Buttons: Favorite + Close */}
          <div className="modal__actions">
            <button
              className={`modal__btn modal__btn--fav ${isFavorite ? 'is-favorite' : ''}`}
              onClick={() => onToggleFav(meal)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
            <button className="modal__btn" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>

          {/* Title, category, and area tags */}
          <div className="modal__hero-content">
            <h2 className="modal__title">{meal.strMeal}</h2>
            <div className="modal__meta">
              {meal.strCategory && (
                <span className="modal__tag">📂 {meal.strCategory}</span>
              )}
              {meal.strArea && (
                <span className="modal__tag">🌍 {meal.strArea}</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Main body: ingredients column + instructions column ── */}
        <div className="modal__body">
          {/* Left column: Ingredients */}
          <section aria-label="Ingredients">
            <h3 className="modal__section-title">Ingredients</h3>
            <ul className="modal__ingredients">
              {ingredients.map((ing, index) => (
                <li key={index} className="modal__ingredient">
                  <span className="modal__ingredient-dot" />
                  <span>
                    {ing.measure && <strong>{ing.measure} </strong>}
                    {ing.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Right column: Instructions */}
          <section aria-label="Instructions">
            <h3 className="modal__section-title">Instructions</h3>
            <p className="modal__instructions">
              {meal.strInstructions || 'Instructions not available.'}
            </p>

            {/* YouTube tutorial link (only shown if the API provides one) */}
            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="modal__youtube-link"
              >
                ▶ Watch on YouTube
              </a>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default RecipeModal;
