-- URAGAYA commerce foundation
-- Migration file for a dedicated Supabase PostgreSQL project.
-- Regional prices are market-specific, not FX conversions.
-- Seeded prices are intentionally omitted until commercial prices are approved.

create extension if not exists pgcrypto;

create table if not exists public.markets (
  code text primary key check (code ~ '^[A-Z]{2}$'),
  name text not null,
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  enabled boolean not null default false,
  shipping_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  subtitle text,
  description text,
  category text not null check (category in ('Vegetarian', 'Non-vegetarian')),
  pack_size_g integer check (pack_size_g is null or pack_size_g > 0),
  image_url text,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.market_prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  market_code text not null references public.markets(code) on delete restrict,
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  amount_minor_units bigint not null check (amount_minor_units >= 0),
  active boolean not null default false,
  effective_from timestamptz not null default now(),
  effective_until timestamptz,
  created_at timestamptz not null default now(),
  check (effective_until is null or effective_until > effective_from),
  unique (product_id, market_code, effective_from)
);

create index if not exists market_prices_lookup_idx
  on public.market_prices (market_code, product_id, active, effective_from desc);

create table if not exists public.inventory_batches (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  batch_code text not null unique,
  quantity_available integer not null default 0 check (quantity_available >= 0),
  quantity_reserved integer not null default 0 check (quantity_reserved >= 0),
  manufactured_at date,
  best_before date,
  status text not null default 'quarantined'
    check (status in ('quarantined', 'released', 'recalled', 'expired', 'depleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (quantity_reserved <= quantity_available),
  check (best_before is null or manufactured_at is null or best_before >= manufactured_at)
);

create index if not exists inventory_product_status_idx
  on public.inventory_batches (product_id, status, best_before);

create table if not exists public.shipping_rates (
  id uuid primary key default gen_random_uuid(),
  market_code text not null references public.markets(code) on delete restrict,
  service_code text not null,
  service_name text not null,
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  amount_minor_units bigint not null check (amount_minor_units >= 0),
  free_shipping_threshold_minor_units bigint check (
    free_shipping_threshold_minor_units is null or free_shipping_threshold_minor_units >= 0
  ),
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (market_code, service_code)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_email text not null,
  customer_name text not null,
  shipping_address jsonb not null,
  billing_address jsonb,
  market_code text not null references public.markets(code) on delete restrict,
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  subtotal_minor_units bigint not null check (subtotal_minor_units >= 0),
  shipping_minor_units bigint not null default 0 check (shipping_minor_units >= 0),
  tax_minor_units bigint not null default 0 check (tax_minor_units >= 0),
  discount_minor_units bigint not null default 0 check (discount_minor_units >= 0),
  total_minor_units bigint not null check (total_minor_units >= 0),
  status text not null default 'pending_payment'
    check (status in (
      'pending_payment', 'paid', 'processing', 'shipped', 'delivered',
      'cancelled', 'payment_failed', 'refunded', 'partially_refunded'
    )),
  payment_deadline timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status, created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  product_id uuid references public.products(id) on delete set null,
  product_slug_snapshot text not null,
  product_name_snapshot text not null,
  quantity integer not null check (quantity > 0),
  unit_price_minor_units bigint not null check (unit_price_minor_units >= 0),
  line_total_minor_units bigint not null check (line_total_minor_units >= 0),
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  created_at timestamptz not null default now(),
  check (line_total_minor_units = unit_price_minor_units * quantity)
);

create index if not exists order_items_order_idx on public.order_items (order_id);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null check (provider in ('cashfree', 'razorpay')),
  provider_order_id text,
  provider_payment_id text,
  amount_minor_units bigint not null check (amount_minor_units >= 0),
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'created'
    check (status in ('created', 'pending', 'authorized', 'paid', 'failed', 'cancelled', 'refunded')),
  idempotency_key text not null unique,
  provider_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_order_id),
  unique (provider, provider_payment_id)
);

create index if not exists payments_order_idx on public.payments (order_id, created_at desc);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('cashfree', 'razorpay')),
  provider_event_id text not null,
  event_type text not null,
  signature_verified boolean not null default false,
  processed_at timestamptz,
  processing_error text,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

-- RLS is enabled on every commerce table. Public storefront reads are limited
-- to explicitly active catalogue/market/price rows. No client-side writes to
-- orders, payments, inventory or webhook events are allowed by these policies.
alter table public.markets enable row level security;
alter table public.products enable row level security;
alter table public.market_prices enable row level security;
alter table public.inventory_batches enable row level security;
alter table public.shipping_rates enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;

drop policy if exists "Public can read enabled markets" on public.markets;
create policy "Public can read enabled markets"
  on public.markets for select to anon, authenticated
  using (enabled = true);

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
  on public.products for select to anon, authenticated
  using (active = true);

drop policy if exists "Public can read active market prices" on public.market_prices;
create policy "Public can read active market prices"
  on public.market_prices for select to anon, authenticated
  using (
    active = true
    and exists (
      select 1 from public.markets m
      where m.code = market_prices.market_code
        and m.enabled = true
        and m.currency = market_prices.currency
    )
    and (effective_until is null or effective_until > now())
    and effective_from <= now()
  );

drop policy if exists "Public can read enabled shipping rates" on public.shipping_rates;
create policy "Public can read enabled shipping rates"
  on public.shipping_rates for select to anon, authenticated
  using (
    enabled = true
    and exists (
      select 1 from public.markets m
      where m.code = shipping_rates.market_code
        and m.enabled = true
        and m.shipping_enabled = true
        and m.currency = shipping_rates.currency
    )
  );

-- No client-facing policies are defined for inventory, orders, order_items,
-- payments or payment_events. Access those through authenticated server-side
-- handlers using a secret server credential, never a browser-exposed key.

comment on table public.market_prices is
  'Market-specific selling prices; do not derive checkout prices from FX conversion.';
comment on table public.payment_events is
  'Deduplicated gateway webhook event log; only verified server-side events may be processed.';
