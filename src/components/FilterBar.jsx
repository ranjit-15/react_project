// FilterBar.jsx
// A row of clickable chip/pill buttons for filtering recipes by category.
// When the user clicks a chip, the Home page re-filters the displayed results.

import './FilterBar.css';

// The categories we allow filtering by.
// "All" means no filter is applied — show every result.
const CATEGORIES = [
  'All',
  'Beef',
  'Chicken',
  'Seafood',
  'Vegetarian',
  'Pasta',
  'Dessert',
  'Breakfast',
  'Side',
  'Starter',
];

// Props:
//   selectedCategory   — the currently active category (string)
//   onCategoryChange   — callback that receives the new category when clicked
function FilterBar({ selectedCategory, onCategoryChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter recipes by category">
      <span className="filter-bar__label">Filter:</span>

      {/* Render one chip button for each category */}
      {CATEGORIES.map((category) => (
        <button
          key={category}
          className={`filter-bar__chip ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryChange(category)}
          aria-pressed={selectedCategory === category}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
