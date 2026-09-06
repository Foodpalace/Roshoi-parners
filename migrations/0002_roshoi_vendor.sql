-- Roshoi Window 2 — restaurant / vendor operating system
-- Integer paise for all money. TEXT ids. Compatible with future shared core.

create table if not exists platform_settings (
  key text primary key,
  value_json text not null,
  updated_at timestamptz not null default now()
);

create table if not exists restaurants (
  id text primary key,
  owner_user_id text not null,
  name text not null,
  display_name text not null,
  owner_name text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  landmark text not null default '',
  lat double precision,
  lng double precision,
  service_area text not null default '',
  cuisine text not null default '',
  diet text not null default 'NONVEG',
  description text not null default '',
  logo_url text,
  cover_url text,
  prep_minutes integer not null default 20,
  peak_prep_minutes integer not null default 30,
  min_order_paise integer not null default 0,
  packing_paise integer not null default 0,
  delivery_available boolean not null default true,
  gstin text not null default '',
  fssai_number text not null default '',
  pan text not null default '',
  bank_account text not null default '',
  bank_ifsc text not null default '',
  bank_name text not null default '',
  commission_bps integer not null default 1000,
  verification_status text not null default 'DRAFT',
  verification_note text not null default '',
  data_label text not null default 'REAL',
  emergency_closed boolean not null default false,
  vacation_mode boolean not null default false,
  admin_hours_override boolean not null default false,
  weekly_holidays text not null default '',
  contact_persons text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists restaurants_owner_idx on restaurants (owner_user_id);
create index if not exists restaurants_label_idx on restaurants (data_label, verification_status);

create table if not exists outlets (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  name text not null,
  address text not null default '',
  lat double precision,
  lng double precision,
  is_primary boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists outlets_restaurant_idx on outlets (restaurant_id);

create table if not exists restaurant_staff (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  outlet_id text references outlets(id) on delete set null,
  user_id text not null,
  role text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (restaurant_id, user_id)
);
create index if not exists restaurant_staff_user_idx on restaurant_staff (user_id);

create table if not exists restaurant_documents (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  kind text not null,
  file_name text not null,
  content_type text not null,
  byte_size integer not null,
  storage_backend text not null default 'local_preview',
  storage_key text not null,
  data_url text,
  status text not null default 'uploaded',
  verification_status text not null default 'PENDING',
  created_at timestamptz not null default now()
);
create index if not exists restaurant_documents_rest_idx on restaurant_documents (restaurant_id);

create table if not exists restaurant_hours (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  outlet_id text references outlets(id) on delete cascade,
  weekday integer not null,
  open_minutes integer not null,
  close_minutes integer not null
);
create index if not exists restaurant_hours_rest_idx on restaurant_hours (restaurant_id);

create table if not exists restaurant_closures (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  kind text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text not null default ''
);

create table if not exists categories (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);
create index if not exists categories_rest_idx on categories (restaurant_id, sort_order);

create table if not exists items (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  category_id text not null references categories(id) on delete cascade,
  name text not null,
  description text not null default '',
  image_url text,
  diet text not null default 'NONVEG',
  tags text not null default '',
  recommended boolean not null default false,
  best_seller boolean not null default false,
  prep_minutes integer,
  tax_bps integer not null default 0,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists items_rest_idx on items (restaurant_id, category_id, sort_order);

create table if not exists variants (
  id text primary key,
  item_id text not null references items(id) on delete cascade,
  restaurant_id text not null,
  name text not null,
  price_paise integer not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);
create index if not exists variants_item_idx on variants (item_id);

create table if not exists addons (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  name text not null,
  price_paise integer not null,
  is_active boolean not null default true
);

create table if not exists item_addons (
  item_id text not null references items(id) on delete cascade,
  addon_id text not null references addons(id) on delete cascade,
  primary key (item_id, addon_id)
);

create table if not exists item_availability (
  item_id text primary key references items(id) on delete cascade,
  restaurant_id text not null,
  status text not null default 'available',
  next_available_at timestamptz,
  note text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists promotions (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  name text not null,
  funder text not null,
  kind text not null,
  percent_off integer,
  amount_paise integer,
  item_id text,
  min_order_paise integer not null default 0,
  max_discount_paise integer,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default false,
  assumed_orders_per_day integer not null default 10,
  created_at timestamptz not null default now()
);
create index if not exists promotions_rest_idx on promotions (restaurant_id);

create sequence if not exists order_number_seq start 1001;

create table if not exists orders (
  id text primary key,
  order_number text not null unique,
  restaurant_id text not null references restaurants(id) on delete restrict,
  outlet_id text not null references outlets(id) on delete restrict,
  state text not null,
  placed_at timestamptz not null default now(),
  customer_area text,
  customer_ref text,
  payment_method text not null default 'COD',
  is_cod boolean not null default true,
  special_instructions text,
  prep_minutes integer not null default 20,
  food_value_paise integer not null,
  packing_paise integer not null default 0,
  restaurant_discount_paise integer not null default 0,
  platform_funded_discount_paise integer not null default 0,
  tax_paise integer not null default 0,
  platform_fee_paise integer not null default 0,
  commission_bps integer not null,
  commission_paise integer not null,
  other_deductions_paise integer not null default 0,
  other_deductions_code text,
  refund_adjustment_paise integer not null default 0,
  restaurant_payable_paise integer not null,
  customer_total_paise integer not null,
  data_label text not null default 'REAL',
  accepted_at timestamptz,
  ready_at timestamptz,
  delivered_at timestamptz,
  reject_reason text,
  created_at timestamptz not null default now()
);
create index if not exists orders_rest_state_idx on orders (restaurant_id, state, placed_at desc);
create index if not exists orders_rest_placed_idx on orders (restaurant_id, placed_at desc);

create table if not exists order_items (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  restaurant_id text not null,
  item_id text,
  item_name text not null,
  variant_id text,
  variant_name text,
  quantity integer not null,
  unit_price_paise integer not null,
  line_total_paise integer not null,
  special_instructions text
);
create index if not exists order_items_order_idx on order_items (order_id);

create table if not exists order_item_addons (
  id text primary key,
  order_item_id text not null references order_items(id) on delete cascade,
  addon_id text,
  name text not null,
  price_paise integer not null
);

create table if not exists order_events (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  restaurant_id text not null,
  previous_state text,
  new_state text not null,
  actor text not null,
  actor_user_id text,
  reason text,
  at timestamptz not null default now()
);
create index if not exists order_events_order_idx on order_events (order_id, at);

create table if not exists rider_dispatch_queue (
  order_id text primary key references orders(id) on delete cascade,
  restaurant_id text not null,
  order_number text not null,
  order_code text not null,
  pickup_lat double precision,
  pickup_lng double precision,
  pickup_address text not null default '',
  pickup_instructions text,
  ready_at timestamptz not null,
  status text not null default 'queued',
  data_label text not null,
  queued_at timestamptz not null default now()
);

create table if not exists settlement_batches (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete restrict,
  status text not null,
  period_start timestamptz not null,
  period_end timestamptz not null,
  scheduled_for date,
  settled_at timestamptz,
  total_payable_paise integer not null default 0,
  data_label text not null default 'REAL',
  created_at timestamptz not null default now()
);
create index if not exists settlement_batches_rest_idx on settlement_batches (restaurant_id, created_at desc);

create table if not exists settlement_lines (
  id text primary key,
  batch_id text not null references settlement_batches(id) on delete cascade,
  restaurant_id text not null,
  order_id text not null references orders(id) on delete restrict,
  food_value_paise integer not null,
  packing_paise integer not null,
  restaurant_discount_paise integer not null,
  platform_funded_discount_paise integer not null,
  commission_paise integer not null,
  other_deductions_paise integer not null default 0,
  other_deductions_code text,
  refund_adjustment_paise integer not null default 0,
  restaurant_payable_paise integer not null
);
create index if not exists settlement_lines_batch_idx on settlement_lines (batch_id);
create unique index if not exists settlement_lines_order_idx on settlement_lines (order_id);

create table if not exists ledger_entries (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete restrict,
  order_id text,
  batch_id text,
  code text not null,
  amount_paise integer not null,
  note text not null default '',
  at timestamptz not null default now(),
  data_label text not null default 'REAL'
);
create index if not exists ledger_entries_rest_idx on ledger_entries (restaurant_id, at desc);

create table if not exists reviews (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  order_id text,
  rating integer not null,
  body text not null default '',
  created_at timestamptz not null default now(),
  data_label text not null default 'REAL'
);
create index if not exists reviews_rest_idx on reviews (restaurant_id, created_at desc);

create table if not exists review_responses (
  id text primary key,
  review_id text not null unique references reviews(id) on delete cascade,
  restaurant_id text not null,
  author_user_id text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  user_id text,
  type text not null,
  title text not null,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_rest_idx on notifications (restaurant_id, created_at desc);

create table if not exists audit_logs (
  id text primary key,
  restaurant_id text,
  actor_user_id text,
  action text not null,
  entity_type text not null,
  entity_id text,
  detail text not null default '',
  at timestamptz not null default now()
);
create index if not exists audit_logs_rest_idx on audit_logs (restaurant_id, at desc);

create table if not exists idempotency_keys (
  key text not null,
  restaurant_id text not null,
  action text not null,
  request_hash text not null default '',
  response_json text not null,
  created_at timestamptz not null default now(),
  primary key (restaurant_id, action, key)
);

create table if not exists assistant_messages (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  user_id text not null,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);
