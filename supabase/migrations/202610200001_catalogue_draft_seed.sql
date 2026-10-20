-- URAGAYA catalogue draft seed
-- Safe by default: all markets and products remain disabled until compliance,
-- recipes, pack sizes, pricing, and fulfilment are approved.
-- No selling prices or shipping destinations are activated by this seed.

insert into public.markets (code, name, currency, enabled, shipping_enabled)
values
  ('GB', 'United Kingdom', 'GBP', false, false),
  ('IN', 'India', 'INR', false, false),
  ('US', 'United States', 'USD', false, false),
  ('EU', 'Eurozone', 'EUR', false, false),
  ('AU', 'Australia', 'AUD', false, false)
on conflict (code) do update
set name = excluded.name,
    currency = excluded.currency,
    enabled = false,
    shipping_enabled = false,
    updated_at = now();

insert into public.products
  (slug, name, subtitle, description, category, pack_size_g, image_url, active)
values
  ('avakaya', 'Avakaya', 'Andhra raw mango pickle', 'Draft catalogue entry; final recipe and product details pending validation.', 'Vegetarian', null, '/images/products/avakaya.webp', false),
  ('gongura', 'Gongura', 'Sorrel leaf pickle', 'Draft catalogue entry; final recipe and product details pending validation.', 'Vegetarian', null, '/images/products/gongura.webp', false),
  ('usirikaya', 'Usirikaya', 'Indian gooseberry pickle', 'Draft catalogue entry; final recipe and product details pending validation.', 'Vegetarian', null, '/images/products/usirikaya.webp', false),
  ('garlic', 'Garlic Pickle', 'Garlic and spice pickle', 'Draft catalogue entry; final recipe and product details pending validation.', 'Vegetarian', null, '/images/products/garlic.webp', false),
  ('chhundo', 'Chhundo', 'Gujarati-style mango relish', 'Draft catalogue entry; final recipe and product details pending validation.', 'Vegetarian', null, '/images/products/chhundo.webp', false),
  ('ker-sangri', 'Ker-Sangri', 'Rajasthani desert pickle', 'Draft catalogue entry; final recipe and product details pending validation.', 'Vegetarian', null, '/images/products/ker-sangri.webp', false),
  ('chicken', 'Chicken Pickle', 'Andhra-style chicken pickle', 'Draft catalogue entry; requires validated processing and storage controls before sale.', 'Non-vegetarian', null, '/images/products/chicken.webp', false),
  ('mutton', 'Mutton Pickle', 'Spiced mutton pickle', 'Draft catalogue entry; requires validated processing and storage controls before sale.', 'Non-vegetarian', null, '/images/products/mutton.webp', false),
  ('prawn', 'Prawn Pickle', 'Coastal-style prawn pickle', 'Draft catalogue entry; requires validated processing, storage controls, and crustacean allergen review before sale.', 'Non-vegetarian', null, '/images/products/prawn.webp', false)
on conflict (slug) do update
set name = excluded.name,
    subtitle = excluded.subtitle,
    description = excluded.description,
    category = excluded.category,
    image_url = excluded.image_url,
    active = false,
    updated_at = now();
