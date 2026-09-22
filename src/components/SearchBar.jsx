// SearchBar.jsx
// A controlled form component for typing and submitting a recipe search.
// "Controlled" means React is in charge of the input's value — we track
// every keystroke with useState so the component always knows what the user typed.

import { useState } from 'react';
import './SearchBar.css';

// Props:
//   onSearch(query) — callback called when the user submits the form
//   initialQuery    — optional starting text (e.g. "pasta") for the input
function SearchBar({ onSearch, initialQuery = '' }) {
  // query holds whatever the user has typed into the input field
  const [query, setQuery] = useState(initialQuery);

  // Called every time the user types a character — keeps our state in sync
  function handleChange(event) {
    setQuery(event.target.value);
  }

  // Called when the form is submitted (user clicks Search or presses Enter)
  function handleSubmit(event) {
    // Prevent the browser's default form submission (which would reload the page)
    event.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return; // Don't search if the input is empty

    onSearch(trimmed);
  }

  return (
    <form
      className="search-bar"
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search for recipes"
    >
      <input
        id="recipe-search-input"
        type="text"
        className="search-bar__input"
        placeholder="Search by dish name or ingredient… e.g. Pasta, Chicken"
        value={query}          /* controlled input — value always matches our state */
        onChange={handleChange}
        aria-label="Recipe search query"
        autoComplete="off"
      />

      <button
        type="submit"
        className="search-bar__button"
        aria-label="Submit search"
      >
        🔍 Search
      </button>
    </form>
  );
}

export default SearchBar;
