-- ============================================================
-- Ecocraze: Seed Data
-- 3 Categories with 4 products each, bulk pricing tiers & specs
-- ============================================================

-- Clean up existing seed data if necessary
DELETE FROM public.bulk_pricing;
DELETE FROM public.products;

-- 1. PAPER PLATES CATEGORY
INSERT INTO public.products (id, name, description, category, size, image_url, price, stock, active)
VALUES
(
  '11111111-1111-1111-1111-111111110001',
  '12-Inch Heavy Duty Silver Laminated Paper Plates',
  'Extra strong 250 GSM silver coated plates, oil and water leak-proof. Ideal for catering, parties, wedding feasts and outdoor dining.',
  'paper-plates',
  '12 Inch (Pack of 50)',
  'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
  180.00,
  450,
  true
),
(
  '11111111-1111-1111-1111-111111110002',
  '10-Inch Premium White Bagasse Eco Round Plates',
  'Compostable sugarcane pulp (bagasse) biodegradable dinner plates. Microwave safe, sturdy and 100% tree-free.',
  'paper-plates',
  '10 Inch (Pack of 50)',
  'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
  210.00,
  380,
  true
),
(
  '11111111-1111-1111-1111-111111110003',
  '7-Inch Bio Snack & Breakfast Paper Plates',
  'Lightweight yet rigid 150 GSM kraft base paper snack plates. Perfect for samosas, chaat, sandwiches and sweets.',
  'paper-plates',
  '7 Inch (Pack of 100)',
  'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=600&q=80',
  120.00,
  600,
  true
),
(
  '11111111-1111-1111-1111-111111110004',
  '11-Inch 3-Compartment Thali Paper Plates',
  'Heavy duty divided meal thali plate with 3 food sections. Keeps curries, rice and breads segregated without sogginess.',
  'paper-plates',
  '11 Inch (Pack of 50)',
  'https://images.unsplash.com/photo-1615719413546-198b25453f85?auto=format&fit=crop&w=600&q=80',
  240.00,
  250,
  true
);

-- 2. DONA BOWLS CATEGORY
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
  '5-Inch Natural Brown Kraft Paper Dona Bowls',
  'Eco-chic rustic brown kraft bowls. Modern aesthetic for street food vendors, cafes and corporate canteen food counters.',
  'dona-bowls',
  '5 Inch / 180ml (Pack of 100)',
  'https://images.unsplash.com/photo-1514944298352-7800c8f5832a?auto=format&fit=crop&w=600&q=80',
  95.00,
  520,
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
  '7-Inch Jumbo Feast Gravy & Biryani Dona Bowl',
  'Large 450ml heavy paper bowl capable of holding steaming hot biryani, noodles or soupy dishes with zero leakage.',
  'dona-bowls',
  '7 Inch / 450ml (Pack of 50)',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
  140.00,
  340,
  true
);

-- 3. TISSUE PAPERS CATEGORY
INSERT INTO public.products (id, name, description, category, size, image_url, price, stock, active)
VALUES
(
  '33333333-3333-3333-3333-333333330001',
  '30x30 cm 2-Ply Ultra Soft White Table Napkins',
  'Premium virgin pulp 2-ply dinner napkins with embossed borders. Highly absorbent, lint-free and soft on sensitive skin.',
  'tissue-papers',
  '30x30 cm (Pack of 100)',
  'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
  85.00,
  700,
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

-- 12-inch Silver Plates (Base: 180)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('11111111-1111-1111-1111-111111110001', 1, 9, 180.00),
('11111111-1111-1111-1111-111111110001', 10, 49, 155.00),
('11111111-1111-1111-1111-111111110001', 50, NULL, 135.00);

-- 10-inch White Bagasse (Base: 210)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('11111111-1111-1111-1111-111111110002', 1, 9, 210.00),
('11111111-1111-1111-1111-111111110002', 10, 49, 185.00),
('11111111-1111-1111-1111-111111110002', 50, NULL, 160.00);

-- 7-inch Snack Plates (Base: 120)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('11111111-1111-1111-1111-111111110003', 1, 9, 120.00),
('11111111-1111-1111-1111-111111110003', 10, 49, 102.00),
('11111111-1111-1111-1111-111111110003', 50, NULL, 88.00);

-- 11-inch 3-Compartment Thali (Base: 240)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('11111111-1111-1111-1111-111111110004', 1, 9, 240.00),
('11111111-1111-1111-1111-111111110004', 10, 49, 205.00),
('11111111-1111-1111-1111-111111110004', 50, NULL, 180.00);

-- 6-inch Curry Dona (Base: 110)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('22222222-2222-2222-2222-222222220001', 1, 9, 110.00),
('22222222-2222-2222-2222-222222220001', 10, 49, 95.00),
('22222222-2222-2222-2222-222222220001', 50, NULL, 80.00);

-- 5-inch Kraft Dona (Base: 95)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('22222222-2222-2222-2222-222222220002', 1, 9, 95.00),
('22222222-2222-2222-2222-222222220002', 10, 49, 82.00),
('22222222-2222-2222-2222-222222220002', 50, NULL, 69.00);

-- 4-inch Chutney Dona (Base: 65)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('22222222-2222-2222-2222-222222220003', 1, 9, 65.00),
('22222222-2222-2222-2222-222222220003', 10, 49, 54.00),
('22222222-2222-2222-2222-222222220003', 50, NULL, 45.00);

-- 7-inch Jumbo Feast Dona (Base: 140)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('22222222-2222-2222-2222-222222220004', 1, 9, 140.00),
('22222222-2222-2222-2222-222222220004', 10, 49, 120.00),
('22222222-2222-2222-2222-222222220004', 50, NULL, 105.00);

-- 30x30 cm Soft Table Napkins (Base: 85)
INSERT INTO public.bulk_pricing (product_id, min_qty, max_qty, unit_price) VALUES
('33333333-3333-3333-3333-333333330001', 1, 9, 85.00),
('33333333-3333-3333-3333-333333330001', 10, 49, 72.00),
('33333333-3333-3333-3333-333333330001', 50, NULL, 60.00);

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
