"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Leaf, Minus, Plus, ShieldCheck, Truck } from "lucide-react";

const catalogue = [
  { id: "avakaya", name: "Avakaya", subtitle: "Andhra raw mango pickle", category: "Vegetarian", price: 6.99, tone: "rust", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90", description: "A bold Andhra-inspired mango pickle concept, built around the region's love of punchy, chilli-forward flavours.", notes: ["Bold and tangy concept profile", "Inspired by Andhra regional food traditions", "Designed to accompany rice and everyday meals"] },
  { id: "gongura", name: "Gongura", subtitle: "Sorrel leaf pickle", category: "Vegetarian", price: 6.99, tone: "green", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=90", description: "A distinctive sorrel-leaf pickle concept inspired by the tangy, savoury character of Andhra cooking.", notes: ["Distinctive tangy concept profile", "Inspired by Andhra regional food traditions", "Pairs conceptually with rice and lentil dishes"] },
  { id: "usirikaya", name: "Usirikaya", subtitle: "Indian gooseberry pickle", category: "Vegetarian", price: 6.99, tone: "gold", image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f2?auto=format&fit=crop&w=1200&q=90", description: "A regional pickle concept centred on Indian gooseberry and its naturally sharp, tangy character.", notes: ["Bright, tangy concept profile", "Inspired by regional Indian pickle traditions", "A savoury accompaniment concept"] },
  { id: "garlic", name: "Garlic Pickle", subtitle: "Garlic and spice pickle", category: "Vegetarian", price: 6.99, tone: "cream", image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=1200&q=90", description: "An aromatic garlic pickle concept for customers who like a warming, savoury accompaniment.", notes: ["Garlic-forward concept profile", "Inspired by Indian spice traditions", "Designed for small servings alongside meals"] },
  { id: "chhundo", name: "Chhundo", subtitle: "Gujarati-style mango relish", category: "Vegetarian", price: 6.99, tone: "gold", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=90", description: "A Gujarati-style mango relish concept bringing a sweet-tangy contrast to savoury plates.", notes: ["Sweet-tangy concept profile", "Inspired by Gujarati regional food traditions", "A contrast to spicy and savoury dishes"] },
  { id: "ker-sangri", name: "Ker-Sangri", subtitle: "Rajasthani desert pickle", category: "Vegetarian", price: 7.49, tone: "green", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=90", description: "A regional concept celebrating the distinctive desert ingredients associated with Rajasthan.", notes: ["Distinctive regional concept", "Inspired by Rajasthan's desert pantry", "A savoury accompaniment concept"] },
  { id: "chicken", name: "Chicken Pickle", subtitle: "Andhra-style chicken pickle", category: "Non-vegetarian", price: 8.99, tone: "rust", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=90", description: "A bold, savoury chicken pickle concept inspired by Andhra-style meat-pickle traditions.", notes: ["Savoury, chilli-forward concept profile", "Inspired by Andhra regional food traditions", "Requires validated processing and storage controls before sale"] },
  { id: "mutton", name: "Mutton Pickle", subtitle: "Spiced mutton pickle", category: "Non-vegetarian", price: 9.99, tone: "green", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=90", description: "A rich, savoury concept inspired by regional Indian mutton-pickle traditions.", notes: ["Rich savoury concept profile", "Inspired by regional meat-pickle traditions", "Requires validated processing and storage controls before sale"] },
  { id: "prawn", name: "Prawn Pickle", subtitle: "Coastal-style prawn pickle", category: "Non-vegetarian", price: 9.99, tone: "gold", image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=90", description: "A coastal-inspired prawn pickle concept with a bold seafood and spice profile.", notes: ["Coastal-inspired concept profile", "Seafood product requiring clear crustacean allergen information", "Requires validated processing and storage controls before sale"] }
];

const formatPrice = (price: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(price);

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = catalogue.find((item) => item.id === params.slug);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  if (!product) {
    return <main className="product-detail-page"><Link className="text-link" href="/#shop"><ArrowLeft size={16} /> Back to the collection</Link><h1>We couldn't find that pickle.</h1><p>Explore the current concept collection instead.</p><Link className="button button-primary" href="/#shop">Browse pickles <ArrowRight size={16} /></Link></main>;
  }

  return (
    <main className="product-detail-page">
      <div className="product-detail-top"><Link className="text-link" href="/#shop"><ArrowLeft size={16} /> Back to all pickles</Link><span>URAGAYA · PRODUCT CONCEPT</span></div>
      <section className="product-detail-layout">
        <div className={`product-detail-photo product-${product.tone}`}>
          <img src={product.image} alt={`${product.name} concept photography`} />
          <span className={product.category === "Vegetarian" ? "diet-badge veg-badge" : "diet-badge nonveg-badge"}>{product.category.toUpperCase()}</span>
        </div>
        <div className="product-detail-copy">
          <p className="eyebrow">THE URAGAYA PANTRY</p>
          <h1>{product.name}</h1>
          <p className="product-detail-subtitle">{product.subtitle}</p>
          <p className="product-detail-price">{formatPrice(product.price)} <span>indicative concept price</span></p>
          <p className="product-detail-description">{product.description}</p>
          <div className="product-detail-quantity"><span>Quantity</span><div><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={15} /></button><strong>{quantity}</strong><button onClick={() => setQuantity((value) => Math.min(10, value + 1))} aria-label="Increase quantity"><Plus size={15} /></button></div></div>
          <button className="button button-primary product-detail-add" onClick={() => setMessage("This product is still a concept. Checkout and ordering will be enabled after the product details and fulfilment are confirmed.")}>Add to bag <ArrowRight size={16} /></button>
          {message && <p className="product-detail-notice" role="status">{message}</p>}
          <p className="product-detail-disclaimer">This is a design-stage product page. The button does not place an order.</p>
          <div className="product-detail-benefits"><div><Leaf size={18} /><span>Regional inspiration</span></div><div><ShieldCheck size={18} /><span>Ingredients to be confirmed</span></div><div><Truck size={18} /><span>Shipping eligibility to be confirmed</span></div></div>
        </div>
      </section>
      <section className="product-detail-information">
        <div><p className="eyebrow">FLAVOUR & ORIGIN</p><h2>A regional story in every recipe.</h2><p>{product.description} The final recipe, ingredients and flavour description will be published once the product has been developed and approved.</p><ul>{product.notes.map((note) => <li key={note}><Check size={16} />{note}</li>)}</ul></div>
        <aside><p className="eyebrow">BEFORE LAUNCH</p><h3>Clear information comes first.</h3><p>Pack size, full ingredients, allergen declarations, nutrition information, storage instructions, shelf life and final price will be added after validation. No unverified dietary, preservation or shelf-life claims are being made here.</p></aside>
      </section>
      <section className="product-detail-bottom"><h2>Discover more of the pantry.</h2><p>One brand, two ranges, regional flavours from across India.</p><Link className="button button-primary" href="/#shop">Explore all pickles <ArrowRight size={16} /></Link></section>
    </main>
  );
}
