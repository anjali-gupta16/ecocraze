-- ============================================================
-- Ecocraze: Seed Data
-- 3 Categories with 4 products each, bulk pricing tiers & specs
-- ============================================================

-- Clean up existing seed data if necessary
DELETE FROM public.bulk_pricing;
DELETE FROM public.products;

-- 1. DONA BOWLS CATEGORY
INSERT INTO public.products (id, name, description, category, size, image_url, price, stock, active)
VALUES
(
  '22222222-2222-2222-2222-222222220001',
  '6-Inch Deep Silver Curry & Chaat Dona Bowls',
  'Deep wall silver paper dona bowls (250ml capacity). Food grade, grease resistant for hot sambar, daal and chaat items.',
  'dona-bowls',
  '6 Inch / 250ml (Pack of 100)',
  '/products/colorful-dona-bowls.jpg',
  110.00,
  800,
  true
),
(
  '22222222-2222-2222-2222-222222220002',
  '4-Inch Golden Paper Dona Bowls',
  'Traditional golden kraft paper dona bowls. Heavy-duty, leak-resistant for chaat, sweets, snacks, prasad and food counters.',
  'dona-bowls',
  '4 Inch (Pack of 100)',
  '/products/golden-dona-bowls.jpg',
  30.00,
  650,
  true
),
(
  '22222222-2222-2222-2222-222222220003',
  '4-Inch Chutney, Dahi & Dessert Paper Dona',
  'Compact deep round cups for chutneys, sauces, gulab jamun, ice creams and condiments. High leak resistance.',
  'dona-bowls',
  '4 Inch / 100ml (Pack of 100)',
  'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
  65.00,
  950,
  true
),
(
  '22222222-2222-2222-2222-222222220004',
  'Silver Coated Paper Dona',
  'Premium silver laminated paper dona with fluted edges. Oil and water resistant, ideal for sweets, snacks, prasad and catering events.',
  'dona-bowls',
  'Pack of 20',
  '/products/silver-paper-dona.jpg',
  12.00,
  1200,
  true
);

-- 3. TISSUE PAPERS CATEGORY
INSERT INTO public.products (id, name, description, category, size, image_url, price, stock, active)
VALUES
(
  '33333333-3333-3333-3333-333333330001',
  'OJAS Soft Paper Napkins (27x30 cm)',
  'Soft, absorbent 27x30 cm paper table napkins with embossed border design. Food-grade virgin paper for restaurants, cafes, catering and events.',
  'tissue-papers',
  '27x30 cm (60g Pack)',
  '/products/ojas-paper-napkins.jpg',
  12.00,
  1200,
  true
),
(
  '33333333-3333-3333-3333-333333330002',
  '22x22 cm Fast Food Dispenser Napkins',
  'Standard single fold table dispenser napkins. Highly economical daily consumable for restaurants, tea stalls and food courts.',
  'tissue-papers',
  '22x22 cm (Pack of 200)',
  'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80',
  75.00,
  1200,
  true
),
(
  '33333333-3333-3333-3333-333333330003',
  'Pop-Up Interfold Tabletop Tissue Napkins',
  'Touchless one-at-a-time pull tissues. Hygienic dispenser compatible napkins that cut wastage by up to 35%.',
  'tissue-papers',
  'Interfold (Pack of 150)',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  90.00,
  450,
  true
),
(
  '33333333-3333-3333-3333-333333330004',
  'Heavy Duty Multi-Purpose Kitchen Paper Towel Rolls',
  'Perforated extra absorbent paper kitchen roll with rapid oil soak technology. Twin pack for commercial kitchen sanitization.',
  'tissue-papers',
  'Twin Roll Pack (120 Pulls)',
  'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
  135.00,
  310,
  true
);

-- ============================================================
-- BULK PRICING TIERS SEED
-- Tiers: 1-9 (Base), 10-49 (10-15% discount), 50+ (20-25% discount)
-- ============================================================


-- 6-inch Curry Dona (Base: 110)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('22222222-2222-2222-2222-222222220001', 1, 9, 110.00),
('22222222-2222-2222-2222-222222220001', 10, 49, 95.00),
('22222222-2222-2222-2222-222222220001', 50, NULL, 80.00);

-- 4-inch Golden Dona (Base: 30)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('22222222-2222-2222-2222-222222220002', 1, 9, 30.00),
('22222222-2222-2222-2222-222222220002', 10, 49, 26.00),
('22222222-2222-2222-2222-222222220002', 50, NULL, 22.00);

-- 4-inch Chutney Dona (Base: 65)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('22222222-2222-2222-2222-222222220003', 1, 9, 65.00),
('22222222-2222-2222-2222-222222220003', 10, 49, 54.00),
('22222222-2222-2222-2222-222222220003', 50, NULL, 45.00);

-- Silver Coated Paper Dona (Base: 12)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('22222222-2222-2222-2222-222222220004', 1, 9, 12.00),
('22222222-2222-2222-2222-222222220004', 10, 49, 10.00),
('22222222-2222-2222-2222-222222220004', 50, NULL, 9.00);

-- OJAS Soft Paper Napkins (Base: 12)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('33333333-3333-3333-3333-333333330001', 1, 9, 12.00),
('33333333-3333-3333-3333-333333330001', 10, 49, 10.00),
('33333333-3333-3333-3333-333333330001', 50, NULL, 9.00);

-- 22x22 cm Dispenser Napkins (Base: 75)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('33333333-3333-3333-3333-333333330002', 1, 9, 75.00),
('33333333-3333-3333-3333-333333330002', 10, 49, 62.00),
('33333333-3333-3333-3333-333333330002', 50, NULL, 52.00);

-- Pop-Up Interfold Napkins (Base: 90)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('33333333-3333-3333-3333-333333330003', 1, 9, 90.00),
('33333333-3333-3333-3333-333333330003', 10, 49, 78.00),
('33333333-3333-3333-3333-333333330003', 50, NULL, 65.00);

-- Kitchen Towel Rolls (Base: 135)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('33333333-3333-3333-3333-333333330004', 1, 9, 135.00),
('33333333-3333-3333-3333-333333330004', 10, 49, 115.00),
('33333333-3333-3333-3333-333333330004', 50, NULL, 99.00);
