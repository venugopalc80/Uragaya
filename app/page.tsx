"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowRight, Check, ChevronDown, Globe2, Leaf, Menu,
  Minus, Plus, Search, ShieldCheck, ShoppingBag, Truck, X
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  tone: string;
  image: string;
  tag?: string;
  category: "Vegetarian" | "Non-vegetarian";
};

const products: Product[] = [
  {
    id: "avakaya", name: "Avakaya", subtitle: "Andhra raw mango pickle", category: "Vegetarian",
    description: "A bold Andhra classic with raw mango, chilli and mustard.",
    price: 6.99, tone: "rust",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
    tag: "Signature"
  },
  {
    id: "gongura", name: "Gongura", subtitle: "Sorrel leaf pickle", category: "Vegetarian",
    description: "Distinctive tang and deep savoury flavour inspired by Andhra kitchens.",
    price: 6.99, tone: "green",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "usirikaya", name: "Usirikaya", subtitle: "Indian gooseberry pickle", category: "Vegetarian",
    description: "A bright, punchy regional favourite with a satisfying tang.",
    price: 6.99, tone: "gold",
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f2?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "garlic", name: "Garlic", subtitle: "Garlic and spice pickle", category: "Vegetarian",
    description: "A warming, aromatic pickle for rice, flatbreads and savoury plates.",
    price: 6.99, tone: "cream",
    image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "chhundo", name: "Chhundo", subtitle: "Gujarati-style mango relish", category: "Vegetarian",
    description: "A sweet-tangy mango profile to balance spicy and savoury meals.",
    price: 6.99, tone: "gold",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
    tag: "Regional favourite"
  },
  {
    id: "ker-sangri", name: "Ker-Sangri", subtitle: "Rajasthani desert pickle", category: "Vegetarian",
    description: "A distinctive regional recipe celebrating India's desert pantry.",
    price: 7.49, tone: "green",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85"
  }
  ,{
    id: "chicken", name: "Chicken Pickle", subtitle: "Andhra-style chicken pickle",
    description: "A bold, savoury regional favourite with a chilli-forward character.",
    price: 8.99, tone: "rust", category: "Non-vegetarian",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85",
    tag: "Non-vegetarian"
  },
  {
    id: "mutton", name: "Mutton Pickle", subtitle: "Spiced mutton pickle",
    description: "A rich, savoury concept inspired by regional meat-pickle traditions.",
    price: 9.99, tone: "green", category: "Non-vegetarian",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
    tag: "Non-vegetarian"
  },
  {
    id: "prawn", name: "Prawn Pickle", subtitle: "Coastal-style prawn pickle",
    description: "A coastal-inspired concept with a bold seafood and spice profile.",
    price: 9.99, tone: "gold", category: "Non-vegetarian",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=85",
    tag: "Non-vegetarian"
  }
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(price);

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartLoaded, setCartLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | "Vegetarian" | "Non-vegetarian">("All");
  const [currency, setCurrency] = useState("GBP");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("uragaya-cart");
      if (saved) setCart(JSON.parse(saved) as Record<string, number>);
    } catch { window.localStorage.removeItem("uragaya-cart"); }
    setCartLoaded(true);
  }, []);

  useEffect(() => {
    if (cartLoaded) window.localStorage.setItem("uragaya-cart", JSON.stringify(cart));
  }, [cart, cartLoaded]);

  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const visibleProducts = useMemo(
    () => products.filter((product) =>
      (category === "All" || product.category === category) &&
      (product.name + " " + product.subtitle + " " + product.category).toLowerCase().includes(query.toLowerCase())
    ),
    [query, category]
  );

  function addToCart(product: Product) {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] || 0) + 1 }));
    setNotice(product.name + " added to your bag");
    window.setTimeout(() => setNotice(""), 2400);
  }

  return (
    <main>
      <div className="announcement">
        <span><Leaf size={14} /> Indian flavours, thoughtfully made</span>
        <span><span className="pin">⌖</span> Rooted in Andhra Pradesh</span>
        <span><Check size={14} /> Small-batch beginnings</span>
        <span><Truck size={15} /> International shipping, by destination</span>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#" aria-label="URAGAYA home">
          <span className="brand-symbol">❧</span>
          <span><strong>URAGAYA</strong><small>INDIAN PICKLES FOR THE WORLD</small></span>
        </a>
        <button className="mobile-menu icon-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          <a className="active" href="#">Home</a>
          <a href="#shop">Shop <ChevronDown size={13} /></a>
          <a href="#story">Our Story</a>
          <a href="#recipes">Recipes</a>
          <a href="#quality">Quality & Ingredients</a>
          <a href="#shipping">Shipping</a>
        </nav>
        <div className="header-actions">
          <label className="currency-select"><Globe2 size={15} />
            <select value={currency} onChange={(event) => setCurrency(event.target.value)} aria-label="Display currency">
              <option value="GBP">GBP (£)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </label>
          <button className="icon-button" aria-label="Search products" onClick={() => setSearchOpen(!searchOpen)}><Search size={19} /></button>
          <button className="bag-button" aria-label={`Shopping bag, ${cartCount} items`} onClick={() => document.querySelector<HTMLDialogElement>("#bag")?.showModal()}>
            <ShoppingBag size={19} /><span>{cartCount}</span>
          </button>
        </div>
      </header>

      {searchOpen && <div className="search-strip">
        <Search size={18} />
        <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pickles and flavours…" aria-label="Search pickles" />
        <button className="icon-button" onClick={() => { setSearchOpen(false); setQuery(""); }} aria-label="Close search"><X size={18} /></button>
      </div>}

      <section className="hero">
        <div className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow light">A HERITAGE OF FLAVOUR. MADE TO BE SHARED.</p>
          <h1>India in every jar.<br />A world of flavour.</h1>
          <p className="hero-description">Rooted in Andhra Pradesh and inspired by India’s regional kitchens. Discover bold, memorable pickles made for tables everywhere.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#shop">Shop the collection <ArrowRight size={17} /></a>
            <a className="button button-ghost" href="#story">Our heritage <ArrowDownRight size={17} /></a>
          </div>
        </div>
        <div className="hero-note"><span>01 / OUR ORIGIN</span><p>From our home in Andhra Pradesh<br />to tables around the world.</p></div>
        <div className="hero-bottom"><span>ROOTED IN INDIA. SHARED WITH THE WORLD.</span><span>SCROLL TO DISCOVER ↓</span></div>
      </section>

      <section className="promise-bar" id="quality">
        <div><span className="promise-icon"><Leaf /></span><p><strong>Regional recipes</strong><small>Rooted in food traditions</small></p></div>
        <div><span className="promise-icon"><Check /></span><p><strong>Made with care</strong><small>Quality at every stage</small></p></div>
        <div><span className="promise-icon"><ShieldCheck /></span><p><strong>Clear ingredients</strong><small>Know what is in your jar</small></p></div>
        <div><span className="promise-icon"><Globe2 /></span><p><strong>Global ambition</strong><small>Shipping varies by destination</small></p></div>
      </section>

      <section className="shop-section section-wrap" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow">THE URAGAYA PANTRY</p><h2>Tradition, sealed in every jar.</h2><p className="section-intro">Discover regional vegetarian and non-vegetarian pickles inspired by food traditions across India.</p></div>
          <a className="text-link" href="#shop">Explore all flavours <ArrowRight size={16} /></a>
        </div>
        <div className="category-filters" role="group" aria-label="Filter pickles by category">
          {(["All", "Vegetarian", "Non-vegetarian"] as const).map((option) => <button key={option} type="button" className={category === option ? "category-filter selected" : "category-filter"} aria-pressed={category === option} onClick={() => setCategory(option)}>{option === "All" ? "All pickles" : option}</button>)}
        </div>
        {query && <p className="results-count">{visibleProducts.length} result{visibleProducts.length === 1 ? "" : "s"} for “{query}”</p>}
        <div className="product-grid">
          {visibleProducts.map((product, index) => (
            <article className="product-card" key={product.id}>
              <div className={`product-image product-${product.tone}`}>
                <span className={product.category === "Vegetarian" ? "diet-badge veg-badge" : "diet-badge nonveg-badge"}>{product.category === "Vegetarian" ? "VEGETARIAN" : "NON-VEGETARIAN"}</span>
                {product.tag && <span className="product-tag">{product.tag}</span>}
                <img src={product.image} alt={product.name + " pickle product styling"} loading={index > 2 ? "lazy" : "eager"} />
                <button className="quick-add" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to bag`}><Plus size={19} /></button>
              </div>
              <div className="product-meta"><div><h3><a href={`/products/${product.id}`}>{product.name}</a></h3><p>{product.subtitle}</p></div><strong>{formatPrice(product.price)}</strong></div>
              <p className="product-description">{product.description}</p>
              <div className="product-card-actions"><a className="add-link" href={`/products/${product.id}`}>View details <ArrowRight size={15} /></a><button className="add-link" onClick={() => addToCart(product)}>Quick add <Plus size={15} /></button></div>
            </article>
          ))}
          {visibleProducts.length === 0 && <p className="empty-state">No flavours found. Try mango, garlic or gongura.</p>}
        </div>
        <p className="concept-note">Concept collection for design review. Product range, recipes, availability, pack sizes and prices are provisional. Meat and seafood products require validated food-safety controls, accurate ingredient/allergen labelling and suitable storage and shipping before launch.</p>
      </section>


      <section className="heritage-note">
        <div className="heritage-rule"><span>✳</span></div>
        <p className="eyebrow">A NOTE ON OUR ROOTS</p>
        <h2>Not just a side.<br /><em>A story worth sharing.</em></h2>
        <p>Across India, every region brings its own ingredients, methods and memories to the pickle jar. URAGAYA begins in Andhra Pradesh, with a respect for those traditions and a clear ambition to share them thoughtfully.</p>
        <a className="text-link" href="#story">Get to know URAGAYA <ArrowRight size={16} /></a>
      </section>
\n      <section className="story-band" id="story">
        <div className="story-image" role="img" aria-label="Traditional Indian ingredients arranged on a kitchen table" />
        <div className="story-copy"><p className="eyebrow light">OUR ROOTS, OUR PROMISE</p><h2>A taste of home.<br />Wherever you are.</h2><p>Every region has its own way with a pickle. URAGAYA begins in Andhra Pradesh, celebrating the bold flavours, patient craft and food traditions that bring people back to the table.</p><a className="button button-light" href="#quality">What matters to us <ArrowRight size={16} /></a></div>
      </section>

      <section className="origin-section section-wrap">
        <div className="origin-copy"><p className="eyebrow">OUR BEGINNING</p><h2>Rooted in Andhra.<br /><em>Made to travel.</em></h2><p>Our ambition starts with our own dedicated manufacturing facility in Andhra Pradesh and small pilot batches. Every product will earn its place through flavour, safety, consistency and care.</p><a className="text-link" href="#shipping">How we plan to ship <ArrowRight size={16} /></a></div>
        <div className="origin-image"><div className="origin-stamp">A TASTE<br />OF OUR<br /><strong>ROOTS</strong></div></div>
      </section>

      <section className="recipe-section" id="recipes">
        <div className="recipe-image" />
        <div className="recipe-copy"><p className="eyebrow">FROM THE URAGAYA TABLE</p><h2>A little pickle.<br />A whole new table.</h2><p>From a spoonful alongside curd rice to a bold companion for a weeknight meal, discover the many ways regional Indian pickles can travel across cuisines.</p><a className="text-link" href="#shop">Find your flavour <ArrowRight size={16} /></a></div>
      </section>

      <section className="shipping-section section-wrap" id="shipping">
        <div><span className="shipping-icon"><Truck /></span><p className="eyebrow">MADE FOR THE JOURNEY</p><h2>Good flavour travels<br />with thoughtful planning.</h2></div>
        <div className="shipping-detail"><p>We'll open shipping destinations only after checking local food-import rules, labelling requirements, carrier availability and delivery costs. Your checkout should always make the destination and delivery terms clear.</p><p className="shipping-small">Worldwide ambition. Destination-specific availability.</p></div>
      </section>

      <section className="newsletter">
        <div><p className="eyebrow light">A NOTE FROM OUR PANTRY</p><h2>New flavours, stories<br />and recipes. Occasionally.</h2></div>
        <form onSubmit={(event) => { event.preventDefault(); setNotice("Thanks for your interest. Newsletter sign-up will be connected at launch."); }}><label htmlFor="newsletter-email">Your email address</label><div className="newsletter-input"><input id="newsletter-email" type="email" required placeholder="you@example.com" /><button type="submit" aria-label="Subscribe"><ArrowRight /></button></div><small>By subscribing, you agree to receive brand updates. You can unsubscribe anytime.</small></form>
      </section>

      <footer className="footer">
        <div className="footer-brand"><a className="wordmark wordmark-footer" href="#"><span className="brand-symbol">❧</span><span><strong>URAGAYA</strong><small>INDIAN PICKLES FOR THE WORLD</small></span></a><p>Timeless flavours. Global tables.</p></div>
        <div><strong>Explore</strong><a href="#shop">Shop pickles</a><a href="#story">Our story</a><a href="#recipes">Recipes</a></div>
        <div><strong>Help</strong><a href="#shipping">Shipping information</a><a href="mailto:hello@uragaya.com">Contact</a><a href="#quality">Ingredients & quality</a></div>
        <div><strong>Follow the flavour</strong><p className="footer-small">Regional Indian flavours, thoughtfully brought to the table.</p><span className="footer-country"><Globe2 size={15} /> {currency} · English</span></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} URAGAYA. Brand concept in development.</span><span>Privacy · Terms · Accessibility</span></div>
      </footer>

      <dialog id="bag" className="bag-dialog">
        <div className="bag-head"><div><p className="eyebrow">YOUR SELECTION</p><h2>Your bag ({cartCount})</h2></div><button className="icon-button" onClick={() => document.querySelector<HTMLDialogElement>("#bag")?.close()} aria-label="Close bag"><X /></button></div>
        <div className="bag-items">
          {cartCount === 0 ? <p>Your bag is waiting for a little flavour.</p> : products.filter((product) => cart[product.id]).map((product) => <div className="bag-item" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><small>{formatPrice(product.price)} · concept price</small><div className="quantity-control"><button onClick={() => setCart((current) => { const next = { ...current }; if (next[product.id] <= 1) delete next[product.id]; else next[product.id]--; return next; })} aria-label={`Remove one ${product.name}`}><Minus size={14} /></button><span>{cart[product.id]}</span><button onClick={() => setCart((current) => ({ ...current, [product.id]: current[product.id] + 1 }))} aria-label={`Add one ${product.name}`}><Plus size={14} /></button></div></div><strong>{formatPrice(product.price * cart[product.id])}</strong></div>)}
        </div>
        <div className="bag-foot"><div><span>Subtotal</span><strong>{formatPrice(products.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0))}</strong></div><p>Shipping and taxes are calculated when destination-specific checkout is available.</p><button className="button button-primary full-width" onClick={() => setNotice("Checkout is not connected yet. This is a design-stage storefront.")}>Continue to checkout <ArrowRight size={16} /></button><button className="continue-shopping" onClick={() => document.querySelector<HTMLDialogElement>("#bag")?.close()}>Continue exploring</button></div>
      </dialog>

      {notice && <div className="toast" role="status"><Check size={17} />{notice}<button onClick={() => setNotice("")} aria-label="Dismiss notification"><X size={15} /></button></div>}
    </main>
  );
}