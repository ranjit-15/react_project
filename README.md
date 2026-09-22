# 🍽️ RecipeFinder

A recipe discovery app built with React where you can search for dishes by name or ingredient, save your favourites, and explore step-by-step cooking instructions — all for free, no API key required.

> Built as a React project assignment — covers all required concepts: hooks, props, controlled forms, API fetching, React Router, localStorage, responsive design, and more.

---

## ✨ Features

- **🔍 Search recipes** by dish name or ingredient using the free [TheMealDB API](https://www.themealdb.com/api.php)
- **📋 Detailed recipe view** — a modal pops up with the full ingredient list (with measurements) and step-by-step instructions
- **▶️ YouTube links** — if a recipe has a video tutorial, a "Watch on YouTube" button appears
- **❤️ Favourites** — heart any recipe to save it; your list is remembered even after you close the browser (localStorage)
- **🏷️ Category filters** — quickly narrow results by Beef, Chicken, Pasta, Dessert, etc.
- **📄 Pagination** — "Load More" button reveals additional results instead of loading everything at once
- **📱 Fully responsive** — looks great on desktop, tablet, and mobile
- **⌨️ Keyboard-accessible** — press `Escape` to close the modal; all interactive elements are focusable
- **Loading, error, and empty states** — the app always shows something useful, never a blank screen

---

## 🛠️ Technologies Used

| Technology | Why |
|---|---|
| **React 18** | UI library — functional components only |
| **Vite** | Fast dev server and build tool |
| **React Router v6** | Client-side routing between Home and Favorites pages |
| **TheMealDB API** | Free public recipe API — no key required |
| **localStorage** | Persists your favourites between page refreshes |
| **Vanilla CSS** | Custom dark design system with CSS variables |
| **Google Fonts (Inter)** | Clean, modern typography |

---

## 📁 Project Structure

```
react_project/
├── public/                   # Static assets
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Top navigation bar (with mobile hamburger menu)
│   │   ├── SearchBar.jsx     # Controlled search form
│   │   ├── RecipeCard.jsx    # Single recipe card shown in the grid
│   │   ├── RecipeModal.jsx   # Full recipe detail overlay/popup
│   │   ├── FilterBar.jsx     # Category filter chip buttons
│   │   └── LoadingSpinner.jsx# Animated loading indicator
│   ├── hooks/
│   │   └── useFavorites.js   # Custom hook — manages favourites in localStorage
│   ├── pages/
│   │   ├── Home.jsx          # Main search & discovery page
│   │   └── Favorites.jsx     # Saved favourites page
│   ├── App.jsx               # Root component — routing + shared state
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles & CSS design tokens
├── index.html
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

Make sure you have **Node.js 18+** and **npm** installed.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/react_project.git
cd react_project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Then open your browser and go to **http://localhost:5173**

That's it — no API key or environment variables needed. The app works straight away.

### 4. Build for production (optional)

```bash
npm run build
```

The optimised output will be in the `dist/` folder. You can deploy it to Vercel, Netlify, or GitHub Pages.

---

## 🧠 React Concepts Demonstrated

This project was intentionally designed to show every core React concept from the course:

| Concept | Where to find it |
|---|---|
| Functional components | Every `.jsx` file |
| `useState` | Search query, results, selected meal, loading/error flags in `Home.jsx` |
| `useEffect` | API fetch side-effects in `Home.jsx`; keyboard/scroll listeners in `RecipeModal.jsx`; localStorage sync in `useFavorites.js` |
| Custom hook | `src/hooks/useFavorites.js` |
| Props (parent → child) | `App.jsx` → Navbar, Home, Favorites; Home → RecipeCard, RecipeModal |
| Callback props | `onToggleFav`, `onSearch`, `onCategoryChange`, `onClose` |
| Controlled form input | `SearchBar.jsx` — input `value` is bound to state via `onChange` |
| `.map()` + unique keys | Recipe grid in `Home.jsx` and `Favorites.jsx` (key = `meal.idMeal`) |
| Conditional rendering | Loading spinner, error message, empty/welcome state, modal visibility |
| React Router v6 | Two routes (`/` and `/favorites`) wired up in `App.jsx` |
| localStorage | `useFavorites.js` — reads on mount, writes whenever favourites change |

---

## ⚙️ How the API Works

This app uses the [TheMealDB free API](https://www.themealdb.com/api.php) — completely free, no sign-up required.

- **Search by name:** `https://www.themealdb.com/api/json/v1/1/search.php?s=pasta`
- **Get full details by ID:** `https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772`

When you search, the app fetches brief results for the grid. It only fetches the full detail for a meal when you click a card — this keeps the initial load fast.

---

## ⚠️ Known Limitations

- **Search-only browsing**: TheMealDB's free tier doesn't support fetching all meals at once, so you need to search for something to see results.
- **No user accounts**: Favourites are stored only in your own browser's localStorage — they won't sync across devices or browsers.
- **Image speed**: Recipe photos are served directly from TheMealDB's CDN, so if their servers are slow, images may take a moment.

---

## 📄 License

MIT — feel free to use this for learning or portfolio purposes.

---

*Built with ❤️ as part of a React course project assignment.*
