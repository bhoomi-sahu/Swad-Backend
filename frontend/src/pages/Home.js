import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

// ── Category list ────────────────────────────────────────
const CATEGORIES = [
  { label: "All",    emoji: "🍽️" },
  { label: "Tiffin", emoji: "🥘" },
  { label: "Cake",   emoji: "🎂" },
  { label: "Snacks", emoji: "🥟" },
  { label: "Sweets", emoji: "🍮" },
  { label: "Drinks", emoji: "🥤" },
  { label: "Thali",  emoji: "🍱" },
  { label: "Other",  emoji: "✨" },
];

// ── Global styles injected once ──────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:   #FDF6EE;
    --brown-d: #2E1A0E;
    --brown-m: #5C3A1E;
    --brown-l: #A0673A;
    --orange:  #E8621A;
    --orange-l:#F5A06A;
    --orange-xl:#FDEADB;
    --green:   #4caf50;
    --shadow:  0 4px 24px rgba(46,26,14,0.10);
    --shadow-h:0 16px 40px rgba(46,26,14,0.18);
    --radius:  18px;
    --ff-serif: 'Playfair Display', Georgia, serif;
    --ff-sans:  'DM Sans', sans-serif;
  }

  body { background: var(--cream); font-family: var(--ff-sans); }

  .hfm-page {
    min-height: 100vh;
    background: var(--cream);
    font-family: var(--ff-sans);
  }

  /* ── HERO ── */
  .hfm-hero {
    position: relative;
    height: 520px;
    overflow: hidden;
  }
  .hfm-hero video {
    width: 100%; height: 100%;
    object-fit: cover;
    filter: brightness(0.55) saturate(1.2);
  }
  .hfm-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, rgba(46,26,14,0.72) 0%, rgba(92,58,30,0.50) 60%, transparent 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 24px;
  }
  .hfm-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(232,98,26,0.92);
    color: #fff;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 5px 16px;
    border-radius: 30px;
    margin-bottom: 18px;
    font-weight: 600;
    font-family: var(--ff-sans);
    backdrop-filter: blur(8px);
  }
  .hfm-hero-title {
    font-family: var(--ff-serif);
    font-size: clamp(32px, 6vw, 58px);
    color: #fff;
    line-height: 1.15;
    margin-bottom: 10px;
    text-shadow: 0 2px 20px rgba(0,0,0,0.3);
  }
  .hfm-hero-title em {
    font-style: italic;
    color: var(--orange-l);
  }
  .hfm-hero-sub {
    color: rgba(255,255,255,0.60);
    font-size: 14px;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 300;
    margin-bottom: 28px;
  }
  .hfm-search-wrap {
    position: relative;
    width: min(440px, 92vw);
  }
  .hfm-search-icon {
    position: absolute;
    left: 18px; top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    pointer-events: none;
  }
  .hfm-search {
    width: 100%;
    padding: 14px 18px 14px 48px;
    border-radius: 40px;
    border: 1.5px solid rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(14px);
    color: #fff;
    font-size: 15px;
    font-family: var(--ff-sans);
    outline: none;
    transition: border 0.2s, background 0.2s;
  }
  .hfm-search::placeholder { color: rgba(255,255,255,0.55); }
  .hfm-search:focus {
    border-color: var(--orange-l);
    background: rgba(255,255,255,0.22);
  }
  /* ── Hero stat pills ── */
  .hfm-hero-stats {
    display: flex;
    gap: 14px;
    margin-top: 22px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .hfm-stat-pill {
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.18);
    backdrop-filter: blur(8px);
    color: #fff;
    font-size: 12px;
    padding: 5px 14px;
    border-radius: 20px;
    font-weight: 500;
  }

  /* ── FILTER BAR ── */
  .hfm-filterbar {
    display: flex;
    gap: 10px;
    padding: 1.25rem 1.75rem;
    overflow-x: auto;
    background: #fff;
    border-bottom: 1px solid rgba(46,26,14,0.07);
    scrollbar-width: none;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 12px rgba(46,26,14,0.05);
  }
  .hfm-filterbar::-webkit-scrollbar { display: none; }

  .hfm-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
    padding: 7px 18px;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
    font-family: var(--ff-sans);
    border: 1.5px solid transparent;
  }
  .hfm-chip--off {
    background: var(--cream);
    color: var(--brown-m);
    border-color: rgba(92,58,30,0.15);
  }
  .hfm-chip--off:hover {
    border-color: var(--orange);
    color: var(--orange);
    background: var(--orange-xl);
  }
  .hfm-chip--on {
    background: var(--brown-d);
    color: #fff;
    border-color: var(--brown-d);
    box-shadow: 0 4px 14px rgba(46,26,14,0.25);
  }

  /* ── SECTION HEADER ── */
  .hfm-section-head {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 2rem 2rem 0.5rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  .hfm-section-head h2 {
    font-family: var(--ff-serif);
    font-size: 24px;
    color: var(--brown-d);
    font-weight: 700;
  }
  .hfm-section-head span {
    font-size: 13px;
    color: #aaa;
    font-weight: 400;
  }

  /* ── GRID ── */
  .hfm-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 1rem 2rem 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hfm-empty {
    grid-column: 1/-1;
    text-align: center;
    padding: 5rem 1rem;
    color: #bbb;
    font-size: 15px;
    font-family: var(--ff-sans);
  }
  .hfm-empty-icon { font-size: 48px; margin-bottom: 12px; }

  /* ── SKELETON ── */
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  .hfm-skeleton {
    border-radius: var(--radius);
    overflow: hidden;
    background: #fff;
    border: 0.5px solid rgba(0,0,0,0.06);
  }
  .hfm-skeleton-img {
    height: 200px;
    background: linear-gradient(90deg, #f0e8df 25%, #fdeadb 50%, #f0e8df 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite linear;
  }
  .hfm-skeleton-body { padding: 16px; }
  .hfm-skeleton-line {
    height: 14px;
    border-radius: 6px;
    background: linear-gradient(90deg, #f0e8df 25%, #fdeadb 50%, #f0e8df 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite linear;
    margin-bottom: 10px;
  }

  /* ── CARD ── */
  .hfm-card {
    background: #fff;
    border-radius: var(--radius);
    overflow: hidden;
    border: 0.5px solid rgba(0,0,0,0.06);
    transition: transform 0.22s ease, box-shadow 0.22s ease;
    cursor: default;
  }
  .hfm-card:hover {
    transform: translateY(-7px);
    box-shadow: var(--shadow-h);
  }

  /* card image */
  .hfm-card-img-wrap {
    position: relative;
    height: 200px;
    overflow: hidden;
    cursor: pointer;
  }
  .hfm-card-img-wrap img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.42s ease;
  }
  .hfm-card:hover .hfm-card-img-wrap img {
    transform: scale(1.08);
  }
  .hfm-card-cat {
    position: absolute;
    top: 10px; left: 10px;
    background: rgba(46,26,14,0.75);
    color: #fff;
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 12px;
    font-weight: 600;
    backdrop-filter: blur(4px);
  }
  .hfm-card-fav {
    position: absolute;
    top: 10px; right: 10px;
    width: 34px; height: 34px;
    border: none;
    border-radius: 50%;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(4px);
    cursor: pointer;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  }
  .hfm-card-fav:hover { transform: scale(1.15); }

  /* card body */
  .hfm-card-body { padding: 14px 16px 16px; }
  .hfm-card-title {
    font-family: var(--ff-serif);
    font-size: 17px;
    font-weight: 700;
    color: var(--brown-d);
    margin-bottom: 4px;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .hfm-card-desc {
    font-size: 13px;
    color: #999;
    line-height: 1.55;
    margin-bottom: 12px;
    height: 40px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .hfm-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .hfm-card-price {
    font-size: 22px;
    font-weight: 700;
    color: var(--orange);
    font-family: var(--ff-sans);
    letter-spacing: -0.5px;
  }
  .hfm-card-seller {
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .hfm-card-seller span {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* card buttons */
  .hfm-card-btns {
    display: flex;
    gap: 8px;
  }
  .hfm-btn {
    flex: 1;
    border: none;
    border-radius: 12px;
    padding: 11px 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--ff-sans);
    transition: all 0.18s;
    letter-spacing: 0.2px;
  }
  .hfm-btn-view {
    background: var(--brown-d);
    color: #fff;
  }
  .hfm-btn-view:hover { background: var(--brown-m); }
  .hfm-btn-cart {
    background: var(--orange);
    color: #fff;
  }
  .hfm-btn-cart:hover { background: #d45510; }
  .hfm-btn-added {
    background: var(--green) !important;
    pointer-events: none;
  }

  /* ── FOOTER STRIP ── */
  .hfm-footer-strip {
    background: var(--brown-d);
    color: rgba(255,255,255,0.45);
    text-align: center;
    font-size: 12px;
    padding: 18px;
    letter-spacing: 0.5px;
  }

  @media (max-width: 600px) {
    .hfm-grid { padding: 0.75rem 1rem 2rem; gap: 1rem; }
    .hfm-hero { height: 430px; }
    .hfm-hero-title { font-size: 28px; }
  }
`;

// ── Inject CSS once ──────────────────────────────────────
function useGlobalStyles() {
  useEffect(() => {
    const id = "hfm-global-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = GLOBAL_CSS;
      document.head.appendChild(el);
    }
  }, []);
}

// ── Skeleton Card ────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="hfm-skeleton">
      <div className="hfm-skeleton-img" />
      <div className="hfm-skeleton-body">
        <div className="hfm-skeleton-line" style={{ width: "70%" }} />
        <div className="hfm-skeleton-line" style={{ width: "90%" }} />
        <div className="hfm-skeleton-line" style={{ width: "40%" }} />
      </div>
    </div>
  );
}

// ── Food Card ────────────────────────────────────────────
function FoodCard({ food, user, onAddToCart }) {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [faved, setFaved] = useState(false);

  const imageUrl = food.image
    ? `http://localhost:5000/${food.image}`
    : "https://placehold.co/600x400/f5a06a/ffffff?text=Food";

  const handleAdd = async () => {
    if (adding) return;
    setAdding(true);
    await onAddToCart(food._id);
    setTimeout(() => setAdding(false), 1800);
  };

  return (
    <div className="hfm-card">
      {/* Image */}
      <div className="hfm-card-img-wrap" onClick={() => navigate(`/food/${food._id}`)}>
        <img src={imageUrl} alt={food.title} />
        <span className="hfm-card-cat">{food.category}</span>
        <button
          className="hfm-card-fav"
          onClick={(e) => { e.stopPropagation(); setFaved(!faved); }}
          aria-label="Toggle favourite"
        >
          {faved ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Body */}
      <div className="hfm-card-body">
        <h2 className="hfm-card-title">{food.title}</h2>
        <p className="hfm-card-desc">{food.description}</p>

        <div className="hfm-card-meta">
          <span className="hfm-card-price">₹{food.price}</span>
          <span className="hfm-card-seller">
            👩‍🍳 <span>{food.sellerId?.name}</span>
          </span>
        </div>

        <div className="hfm-card-btns">
          <button
            className="hfm-btn hfm-btn-view"
            onClick={() => navigate(`/food/${food._id}`)}
          >
            View Details
          </button>

          {user?.role === "user" && (
            <button
              className={`hfm-btn hfm-btn-cart ${adding ? "hfm-btn-added" : ""}`}
              onClick={handleAdd}
            >
              {adding ? "✓ Added!" : "🛒 Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Filter Chip ──────────────────────────────────────────
function FilterChip({ label, emoji, active, onClick }) {
  return (
    <button
      className={`hfm-chip ${active ? "hfm-chip--on" : "hfm-chip--off"}`}
      onClick={onClick}
    >
      <span>{emoji}</span>
      {label}
    </button>
  );
}

// ── MAIN HOME ────────────────────────────────────────────
export default function Home() {
  useGlobalStyles();

  const [foods, setFoods]               = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery]   = useState("");
  const [loading, setLoading]           = useState(true);
  const { user }                        = useContext(AuthContext);

  // Fetch
  useEffect(() => { fetchFoods(); }, []);

  const fetchFoods = async () => {
    try {
      const { data } = await API.get("/foods");
      setFoods(data);
      setFiltered(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter
  useEffect(() => {
    let result = foods;
    if (activeCategory !== "All") {
      result = result.filter(
        (f) => f.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    if (searchQuery.trim()) {
      result = result.filter((f) =>
        f.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFiltered(result);
  }, [foods, activeCategory, searchQuery]);

  // Add to cart
  const handleAddToCart = async (foodId) => {
    try {
      await API.post(
        "/cart/add",
        { foodId, quantity: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Added to cart!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="hfm-page">
      <Navbar />

      {/* ── HERO ── */}
      <section className="hfm-hero">
        <video autoPlay muted loop playsInline>
          <source src="/videos/food.mp4" type="video/mp4" />
        </video>

        <div className="hfm-hero-overlay">
          <span className="hfm-badge">🏠 Ghar Ka Khana</span>

          <h1 className="hfm-hero-title">
            Apni Mummy ka&nbsp;
            <em>homemade</em>
            <br />khana ab doorstep pe
          </h1>

          <p className="hfm-hero-sub">Tiffin · Cake · Sweets · Thali</p>

          <div className="hfm-search-wrap">
            <span className="hfm-search-icon">🔍</span>
            <input
              type="text"
              className="hfm-search"
              placeholder="Search for food…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="hfm-hero-stats">
            <span className="hfm-stat-pill">🏅 Trusted Sellers</span>
            <span className="hfm-stat-pill">⚡ Same-Day Delivery</span>
            <span className="hfm-stat-pill">🌿 No Preservatives</span>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <nav className="hfm-filterbar" aria-label="Category filters">
        {CATEGORIES.map((cat) => (
          <FilterChip
            key={cat.label}
            label={cat.label}
            emoji={cat.emoji}
            active={activeCategory === cat.label}
            onClick={() => setActiveCategory(cat.label)}
          />
        ))}
      </nav>

      {/* ── SECTION HEADER ── */}
      {!loading && (
        <div className="hfm-section-head">
          <h2>
            {activeCategory === "All" ? "All Dishes" : activeCategory}
          </h2>
          <span>{filtered.length} item{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      )}

      {/* ── GRID ── */}
      <main className="hfm-grid">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length > 0 ? (
          filtered.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              user={user}
              onAddToCart={handleAddToCart}
            />
          ))
        ) : (
          <div className="hfm-empty">
            <div className="hfm-empty-icon">🍽️</div>
            <p>No food found for <strong>"{searchQuery || activeCategory}"</strong></p>
            <p style={{ marginTop: 8, fontSize: 13 }}>
              Try a different category or search term
            </p>
          </div>
        )}
      </main>

      {/* ── FOOTER STRIP ── */}
      <footer className="hfm-footer-strip">
        © {new Date().getFullYear()} Homemade Food Marketplace · Made with ❤️ for ghar ka khana
      </footer>
    </div>
  );
}