// App.jsx
// The root component of the Recipe Finder application.
// Its two main jobs:
//   1. Set up React Router so the app has multiple pages (Home and Favorites)
//   2. Hold the shared state that both pages need — the favorites list
//
// By keeping favorites state here (at the top level), we can pass it down
// to both the Home page and the Favorites page without them needing to
// talk to each other directly. This is the standard React "lifting state up" pattern.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import useFavorites from './hooks/useFavorites';

function App() {
  // useFavorites is our custom hook — it handles reading/writing favorites
  // to localStorage and provides helper functions we pass down as props.
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  return (
    // BrowserRouter enables client-side routing (URL changes without full page reloads)
    <BrowserRouter>
      {/* Navbar is outside the Routes so it appears on every page */}
      <Navbar favoritesCount={favorites.length} />

      {/* Routes decides which page to render based on the current URL */}
      <Routes>
        {/* / → Home (Discover) page */}
        <Route
          path="/"
          element={
            <Home
              isFavorite={isFavorite}
              onToggleFav={toggleFavorite}
            />
          }
        />

        {/* /favorites → Saved Favorites page */}
        <Route
          path="/favorites"
          element={
            <Favorites
              favorites={favorites}
              isFavorite={isFavorite}
              onToggleFav={toggleFavorite}
            />
          }
        />

        {/* Catch-all: redirect unknown URLs back to Home */}
        <Route path="*" element={<Home isFavorite={isFavorite} onToggleFav={toggleFavorite} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
