-- ============================================================
-- TOKDAK — Seed Data
-- Team: CODEDUO | Seng Mengseang | Sun David
-- Run schema.sql first before this file
-- ============================================================

USE tokdak;

-- ============================================================
-- Clear existing data (reverse FK order)
-- ============================================================
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE backups;
TRUNCATE TABLE shop_schedules;
TRUNCATE TABLE shop_settings;
TRUNCATE TABLE alerts;
TRUNCATE TABLE stock_transactions;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE shops;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. USERS  (15 total — 5 original + 10 new)
-- ============================================================
INSERT INTO users (name, email, password, role, DOB, gender) VALUES
-- Original 5
('Seng Mengseang', 'admin@tokdak.com',  '$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'admin',  '1998-05-12', 'male'),
('Dara Chan',      'dara@gmail.com',    '$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'client', '1990-03-22', 'male'),
('Sokha Lim',      'sokha@gmail.com',   '$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'client', '1985-07-15', 'female'),
('Mony Pich',      'mony@gmail.com',    '$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'client', '1993-11-08', 'female'),
('Virak Noun',     'virak@gmail.com',   '$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'client', '1988-01-30', 'male'),
-- New 10 clients
('Sopheak Meas',   'sopheak@gmail.com',  '$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'client', '1992-09-14', 'male'),
('Ratanak Phal',   'ratanak@gmail.com',  '$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'client', '1987-04-18', 'male'),
('Chantrea Nguon', 'chantrea@gmail.com', '$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'client', '1995-12-02', 'female'),
('Sreynich Kheng', 'sreynich@gmail.com', '$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'client', '1991-06-25', 'female'),
('Visal Soeung',   'visal@gmail.com',    '$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'client', '1983-10-11', 'male'),
('Bopha Prak',     'bopha@gmail.com',    '$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'client', '1994-08-07', 'female'),
('Vicheka Lun',    'vicheka@gmail.com',  '$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'client', '1989-02-19', 'male'),
('Sokunthea Neang','sokunthea@gmail.com','$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'client', '1996-11-30', 'female'),
('Dara Sok',       'darasok@gmail.com',  '$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'client', '1986-05-04', 'male'),
('Sokhom Try',     'sokhom@gmail.com',   '$2b$10$VVg3tGqkt/umpRd/zpv2budZnypqNILTYA/F.SHvNgFmpVSeTbeJW', 'client', '1990-12-20', 'male');

-- ============================================================
-- 2. SHOPS  (14 total — 4 original + 10 new)
-- ============================================================
INSERT INTO shops (user_id, shop_name, address, phone) VALUES
-- Original 4
(2, 'Dara Mini Mart',      'Street 271, Phnom Penh',    '012345678'),
(3, 'Sokha Grocery',       'Street 109, Phnom Penh',    '097654321'),
(4, 'Mony Daily Shop',     'Street 63, Siem Reap',      '096111222'),
(5, 'Virak Corner Store',  'Street 7, Battambang',      '078333444'),
-- New 10
(6, 'Sopheak Beverage Hub','Street 130, Phnom Penh',    '011223344'),
(7, 'Ratanak Bakery',      'Street 08, Siem Reap',      '092556677'),
(8, 'Chantrea Fresh Mart', 'Street 2, Battambang',      '069889900'),
(9, 'Sreynich Meat Shop',  'Street 23, Kampot',         '097112233'),
(10,'Visal Groceries',     'Street 56, Takeo',          '078445566'),
(11,'Bopha Baby Care',     'Street 68, Sihanoukville',  '016778899'),
(12,'Vicheka Office Mart', 'Street 12, Kampong Cham',   '090990011'),
(13,'Sokunthea Pharmacy',  'Street 32, Pursat',         '015223344'),
(14,'Dara Candy Store',    'Street 71, Kampong Speu',   '098556677'),
(15,'Sokhom Spice House',  'Street 5, Prey Veng',       '069889900');

-- ============================================================
-- 3. CATEGORIES  (33 total — 11 original + 22 new)
-- ============================================================
INSERT INTO categories (shop_id, name) VALUES
-- Original (shop 1-4)
(1, 'Grocery'),
(1, 'Drinks'),
(1, 'Snacks'),
(1, 'Household'),
(2, 'Grocery'),
(2, 'Drinks'),
(2, 'Personal Care'),
(3, 'Grocery'),
(3, 'Snacks'),
(4, 'Grocery'),
(4, 'Drinks'),
-- New — Shop 5 (Sopheak Beverage Hub)
(5, 'Beverages'),
(5, 'Frozen Food'),
(5, 'Cleaning Supplies'),
-- Shop 6 (Ratanak Bakery)
(6, 'Bakery'),
(6, 'Dairy'),
-- Shop 7 (Chantrea Fresh Mart)
(7, 'Fruits'),
(7, 'Vegetables'),
-- Shop 8 (Sreynich Meat Shop)
(8, 'Meat'),
(8, 'Seafood'),
-- Shop 9 (Visal Groceries)
(9, 'Condiments'),
(9, 'Pasta & Rice'),
-- Shop 10 (Bopha Baby Care)
(10, 'Baby Care'),
(10, 'Pet Supplies'),
-- Shop 11 (Vicheka Office Mart)
(11, 'Office Supplies'),
(11, 'Stationery'),
-- Shop 12 (Sokunthea Pharmacy)
(12, 'Health & Beauty'),
(12, 'Vitamins'),
-- Shop 13 (Dara Candy Store)
(13, 'Candy & Chocolate'),
(13, 'Chips & Snacks'),
-- Shop 14 (Sokhom Spice House)
(14, 'Spices'),
(14, 'Sauces & Oils');

-- ============================================================
-- 4. PRODUCTS  (62 total — 19 original + 43 new)
-- ============================================================
INSERT INTO products (shop_id, category_id, name, description, price, current_quantity, min_quantity, unit) VALUES
-- Original products (shop 1-4)
(1, 1, 'Rice 5kg',           'Premium jasmine rice',        12.50,  4,  10, 'bag'),
(1, 1, 'Cooking Oil 1L',     'Vegetable cooking oil',        2.00,  2,   8, 'bottle'),
(1, 1, 'Sugar 1kg',          'White refined sugar',          1.20,  3,   5, 'bag'),
(1, 2, 'Coca Cola 330ml',    'Soft drink can',               0.75, 24,  12, 'can'),
(1, 2, 'Water 500ml',        'Mineral water bottle',         0.30, 48,  20, 'bottle'),
(1, 3, 'Instant Noodles',    'Mama instant noodles',         0.25, 60,  20, 'pack'),
(1, 3, 'Chips 50g',          'Potato chips snack',           0.50, 30,  15, 'pack'),
(1, 4, 'Dish Soap 500ml',    'Liquid dish washing soap',     1.50,  5,   5, 'bottle'),
(1, 4, 'Laundry Powder 1kg', 'Washing powder',               3.00,  1,   5, 'box'),
(2, 5, 'Rice 10kg',          'Long grain white rice',       20.00,  8,  10, 'bag'),
(2, 5, 'Salt 500g',          'Iodized table salt',           0.50, 15,   5, 'pack'),
(2, 6, 'Orange Juice 1L',    'Fresh squeezed juice',         2.50,  3,   8, 'bottle'),
(2, 7, 'Shampoo 200ml',      'Hair care shampoo',            2.00,  6,   5, 'bottle'),
(3, 8, 'Condensed Milk',     'Sweet condensed milk can',     1.00, 12,   8, 'can'),
(3, 8, 'Fish Sauce 700ml',   'Premium fish sauce',           1.80,  4,   5, 'bottle'),
(3, 9, 'Biscuits 150g',      'Cream filled biscuits',        0.75, 20,  10, 'pack'),
(4, 10, 'Eggs tray 30',      'Fresh chicken eggs',           4.50,  2,   5, 'tray'),
(4, 10, 'Bread Loaf',        'White sandwich bread',         1.50,  3,   5, 'loaf'),
(4, 11, 'Energy Drink',      'Energy boost drink can',       1.00, 18,  10, 'can'),
-- Shop 5 — Beverages (cat 12), Frozen Food (13), Cleaning (14)
(5, 12, 'Iced Coffee Can',    'Ready-to-drink iced coffee',   1.50, 30,  10, 'can'),
(5, 12, 'Green Tea Bottle',   'Bottled jasmine green tea',    1.00, 25,  10, 'bottle'),
(5, 12, 'Coconut Water',     'Fresh coconut water 500ml',     1.25, 20,   8, 'bottle'),
(5, 13, 'Frozen Dumplings',  'Pork & vegetable dumplings',    3.50, 15,   5, 'pack'),
(5, 13, 'Ice Cream Tub',     'Vanilla ice cream 1L',          4.00, 12,   5, 'tub'),
(5, 14, 'Liquid Bleach',     'Laundry bleach 1L',             1.20, 18,   8, 'bottle'),
-- Shop 6 — Bakery (cat 15), Dairy (16)
(6, 15, 'Butter Croissant',   'Flaky butter croissant',        1.80, 20,   8, 'pcs'),
(6, 15, 'Whole Wheat Bread',  'Fresh whole wheat loaf',        2.00, 10,   5, 'loaf'),
(6, 15, 'Chocolate Cake',     'Chocolate layer cake slice',    2.50,  8,   4, 'slice'),
(6, 16, 'Fresh Milk 1L',     'Pasteurized fresh milk',         1.60, 25,  10, 'bottle'),
-- Shop 7 — Fruits (cat 17), Vegetables (18)
(7, 17, 'Apple 1kg',         'Red juicy apples',               3.00, 20,  10, 'kg'),
(7, 17, 'Banana Bunch',      'Ripe Cavendish bananas',         1.50, 30,  15, 'bunch'),
(7, 17, 'Orange 1kg',        'Sweet navel oranges',            2.50, 18,  10, 'kg'),
(7, 18, 'Cabbage Head',      'Fresh green cabbage',            1.00, 15,   8, 'pcs'),
(7, 18, 'Carrot 1kg',        'Organic carrots',                1.80, 22,  10, 'kg'),
-- Shop 8 — Meat (cat 19), Seafood (20)
(8, 19, 'Chicken Breast 1kg','Skinless boneless chicken',      4.50, 15,   8, 'kg'),
(8, 19, 'Pork Belly 1kg',    'Fresh pork belly slab',          3.80, 10,   5, 'kg'),
(8, 19, 'Beef 500g',         'Lean beef cuts',                 5.00,  8,   5, 'pack'),
(8, 20, 'Fresh Shrimp 1kg',  'Peeled jumbo shrimp',            8.00,  6,   4, 'kg'),
-- Shop 9 — Condiments (cat 21), Pasta & Rice (22)
(9, 21, 'Soy Sauce 500ml',   'Light soy sauce',                1.50, 20,  10, 'bottle'),
(9, 21, 'Tomato Ketchup',    'Tomato ketchup 500ml',           1.80, 15,   8, 'bottle'),
(9, 21, 'Mayonnaise',        'Creamy mayonnaise 400ml',         2.00, 12,   6, 'bottle'),
(9, 22, 'Spaghetti 500g',    'Italian durum wheat pasta',       1.20, 25,  10, 'pack'),
-- Shop 10 — Baby Care (cat 23), Pet Supplies (24)
(10, 23, 'Baby Diapers M',   'Medium size diaper pack 30ct',   12.00, 10,   5, 'pack'),
(10, 23, 'Baby Wipes',       'Alcohol-free baby wipes 80ct',    3.50, 20,   8, 'pack'),
(10, 23, 'Baby Powder',      'Talc-free baby powder 200g',      2.50, 15,   5, 'bottle'),
(10, 24, 'Dog Food 2kg',     'Dry kibble adult dog food',       8.00, 12,   5, 'bag'),
(10, 24, 'Cat Litter',       'Clumping cat litter 5L',          4.00, 18,   8, 'bag'),
-- Shop 11 — Office Supplies (cat 25), Stationery (26)
(11, 25, 'A4 Paper Ream',    '80gsm white copy paper',          5.00, 20,  10, 'ream'),
(11, 25, 'Ballpoint Pens',   'Blue ink pens box of 12',         2.00, 15,   8, 'box'),
(11, 26, 'A5 Notebook',      'Lined ruled notebook 80pg',       1.50, 30,  12, 'pcs'),
-- Shop 12 — Health & Beauty (cat 27), Vitamins (28)
(12, 27, 'Hand Sanitizer',   'Alcohol gel 500ml',               3.00, 25,  10, 'bottle'),
(12, 27, 'Face Mask Box',    'Surgical face masks 50ct',        5.00, 10,   5, 'box'),
(12, 27, 'First Aid Kit',    'Basic first aid supplies',        8.50,  5,   3, 'kit'),
(12, 28, 'Vitamin C 100mg',  'Orange flavored 100 tablets',     4.00, 15,   8, 'bottle'),
-- Shop 13 — Candy & Chocolate (cat 29), Chips & Snacks (30)
(13, 29, 'Gummy Bears',      'Fruit flavored gummy candy 200g', 2.00, 30,  12, 'pack'),
(13, 29, 'Chocolate Bar',    'Milk chocolate 100g',             1.50, 40,  15, 'bar'),
(13, 29, 'Lollipops',        'Assorted fruit lollipops 20ct',   2.50, 25,  10, 'pack'),
(13, 30, 'Potato Chips',     'Salted potato chips 150g',        1.80, 35,  15, 'pack'),
(13, 30, 'Tortilla Chips',   'Corn tortilla chips 200g',        2.20, 20,  10, 'pack'),
-- Shop 14 — Spices (cat 31), Sauces & Oils (32)
(14, 31, 'Black Pepper',     'Ground black pepper 100g',        1.50, 20,  10, 'bottle'),
(14, 31, 'Curry Powder',     'Madras curry powder 100g',        1.80, 15,   8, 'bottle'),
(14, 31, 'Paprika',          'Sweet paprika spice 100g',        1.60, 12,   6, 'bottle'),
(14, 32, 'Chili Sauce',      'Sriracha chili sauce 300ml',      2.00, 25,  10, 'bottle'),
(14, 32, 'Oyster Sauce',     'Premium oyster sauce 500ml',      2.50, 18,   8, 'bottle');

-- ============================================================
-- 5. STOCK TRANSACTIONS
-- ============================================================
INSERT INTO stock_transactions (product_id, user_id, type, quantity_changed, quantity_before, quantity_after, note) VALUES
-- Original
(1,  2, 'restock',  20,  0, 20, 'Initial stock from supplier A'),
(2,  2, 'restock',  10,  0, 10, 'Initial stock'),
(3,  2, 'restock',   8,  0,  8, 'Initial stock'),
(1,  2, 'sale',     -5, 20, 15, 'Daily sales'),
(1,  2, 'sale',    -11, 15,  4, 'Weekend sales'),
(2,  2, 'sale',     -8, 10,  2, 'Daily sales'),
(3,  2, 'sale',     -5,  8,  3, 'Daily sales'),
(10, 3, 'restock',  10,  0, 10, 'Opening stock'),
(12, 3, 'sale',     -5,  8,  3, 'Daily sales'),
(15, 4, 'restock',  10,  0, 10, 'Initial stock'),
(15, 4, 'sale',     -6, 10,  4, 'Sales this week'),
(17, 5, 'restock',  10,  0, 10, 'Opening stock'),
(17, 5, 'sale',     -8, 10,  2, 'Daily sales'),
-- Shop 5 — Beverage Hub (user 6)
(20, 6, 'restock',  30,  0, 30, 'Initial stock from distributor'),
(21, 6, 'restock',  25,  0, 25, 'Initial stock'),
(22, 6, 'restock',  20,  0, 20, 'Initial stock'),
(23, 6, 'restock',  15,  0, 15, 'Initial stock'),
(20, 6, 'sale',     -8, 30, 22, 'First week sales'),
(21, 6, 'sale',     -5, 25, 20, 'First week sales'),
-- Shop 6 — Bakery (user 7)
(26, 7, 'restock',  20,  0, 20, 'Opening stock'),
(27, 7, 'restock',  10,  0, 10, 'Opening stock'),
(29, 7, 'restock',  25,  0, 25, 'Dairy delivery'),
(26, 7, 'sale',    -12, 20,  8, 'Morning sales'),
(27, 7, 'sale',     -5, 10,  5, 'Morning sales'),
-- Shop 7 — Fresh Mart (user 8)
(31, 8, 'restock',  20,  0, 20, 'Fruit delivery morning'),
(32, 8, 'restock',  30,  0, 30, 'Banana shipment'),
(34, 8, 'restock',  15,  0, 15, 'Vegetable delivery'),
(31, 8, 'sale',     -9, 20, 11, 'Day sales'),
-- Shop 8 — Meat Shop (user 9)
(35, 9, 'restock',  15,  0, 15, 'Meat delivery AM'),
(36, 9, 'restock',  10,  0, 10, 'Pork shipment'),
(38, 9, 'restock',   6,  0,  6, 'Seafood fresh catch'),
(35, 9, 'sale',     -7, 15,  8, 'Daily sales'),
-- Shop 9 — Visal Groceries (user 10)
(39,10, 'restock',  20,  0, 20, 'Condiments stock'),
(40,10, 'restock',  15,  0, 15, 'Ketchup delivery'),
(42,10, 'restock',  25,  0, 25, 'Pasta shipment'),
(40,10, 'sale',     -5, 15, 10, 'Weekly sales'),
-- Shop 10 — Baby Care (user 11)
(43,11, 'restock',  10,  0, 10, 'Diapers order'),
(44,11, 'restock',  20,  0, 20, 'Wipes bulk'),
(46,11, 'restock',  12,  0, 12, 'Dog food shipment'),
(43,11, 'sale',     -3, 10,  7, 'Customer purchases'),
-- Shop 11 — Office Mart (user 12)
(48,12, 'restock',  20,  0, 20, 'Paper ream stock'),
(49,12, 'restock',  15,  0, 15, 'Pen boxes'),
(50,12, 'restock',  30,  0, 30, 'Notebook supply'),
(48,12, 'sale',     -8, 20, 12, 'Office customer'),
-- Shop 12 — Pharmacy (user 13)
(51,13, 'restock',  25,  0, 25, 'Sanitizer bulk'),
(52,13, 'restock',  10,  0, 10, 'Mask shipment'),
(54,13, 'restock',  15,  0, 15, 'Vitamin C order'),
(51,13, 'sale',    -10, 25, 15, 'Customer demand'),
-- Shop 13 — Candy Store (user 14)
(55,14, 'restock',  30,  0, 30, 'Candy delivery'),
(56,14, 'restock',  40,  0, 40, 'Chocolate box'),
(58,14, 'restock',  35,  0, 35, 'Chips supply'),
(55,14, 'sale',    -18, 30, 12, 'Kids purchases'),
-- Shop 14 — Spice House (user 15)
(60,15, 'restock',  20,  0, 20, 'Spices order'),
(61,15, 'restock',  15,  0, 15, 'Curry powder'),
(63,15, 'restock',  25,  0, 25, 'Chili sauce stock'),
(60,15, 'sale',     -7, 20, 13, 'Restaurant order');

-- ============================================================
-- 6. ALERTS
-- ============================================================
INSERT INTO alerts (product_id, shop_id, type, is_resolved) VALUES
-- Original
(1,  1, 'low_stock',    FALSE),
(2,  1, 'out_of_stock', FALSE),
(3,  1, 'low_stock',    FALSE),
(9,  1, 'low_stock',    FALSE),
(12, 2, 'low_stock',    FALSE),
(15, 3, 'low_stock',    FALSE),
(17, 4, 'low_stock',    FALSE),
-- New — low stock alerts
(24, 5, 'low_stock',    FALSE),
(27, 6, 'low_stock',    FALSE),
(37, 8, 'low_stock',    FALSE),
(57, 13, 'low_stock',   FALSE),
(62, 14, 'low_stock',   FALSE);

-- ============================================================
-- 7. SHOP SETTINGS
-- ============================================================
INSERT INTO shop_settings (shop_id, language, currency, low_stock_threshold, notification_email, notification_app) VALUES
-- Original
(1, 'km', 'USD',  5, TRUE,  TRUE),
(2, 'km', 'USD',  5, TRUE,  TRUE),
(3, 'km', 'USD',  5, FALSE, TRUE),
(4, 'en', 'USD', 10, TRUE,  TRUE),
-- New
(5, 'km', 'USD',  5, TRUE,  TRUE),
(6, 'km', 'USD',  5, TRUE,  TRUE),
(7, 'km', 'USD',  8, TRUE,  TRUE),
(8, 'km', 'USD',  5, FALSE, TRUE),
(9, 'km', 'USD',  5, TRUE,  FALSE),
(10,'en', 'USD',  5, TRUE,  TRUE),
(11,'km', 'USD',  5, TRUE,  TRUE),
(12,'km', 'USD',  5, TRUE,  TRUE),
(13,'en', 'USD', 10, FALSE, TRUE),
(14,'km', 'USD',  5, TRUE,  TRUE);

-- ============================================================
-- 8. SHOP SCHEDULES
-- ============================================================
INSERT INTO shop_schedules (shop_id, task_name, task_type, frequency, next_run_at, is_active) VALUES
-- Original
(1, 'Daily Backup',          'backup', 'daily',   '2026-06-14 00:00:00', TRUE),
(1, 'Weekly Stock Report',   'report', 'weekly',  '2026-06-16 08:00:00', TRUE),
(1, 'Low Stock Alert Check', 'alert',  'daily',   '2026-06-14 08:00:00', TRUE),
(2, 'Daily Backup',          'backup', 'daily',   '2026-06-14 00:00:00', TRUE),
(3, 'Weekly Report',         'report', 'weekly',  '2026-06-16 08:00:00', TRUE),
(4, 'Monthly Backup',        'backup', 'monthly', '2026-07-01 00:00:00', TRUE),
-- New
(5, 'Daily Backup',          'backup', 'daily',   '2026-06-14 00:00:00', TRUE),
(5, 'Stock Reorder Check',   'report', 'weekly',  '2026-06-16 08:00:00', TRUE),
(6, 'Daily Backup',          'backup', 'daily',   '2026-06-14 00:00:00', TRUE),
(6, 'Expiry Check',          'alert',  'daily',   '2026-06-14 06:00:00', TRUE),
(7, 'Fresh Stock Alert',     'alert',  'daily',   '2026-06-14 05:00:00', TRUE),
(8, 'Weekly Report',         'report', 'weekly',  '2026-06-17 08:00:00', TRUE),
(9, 'Daily Backup',          'backup', 'daily',   '2026-06-14 00:00:00', TRUE),
(10,'Monthly Stock Check',   'report', 'monthly', '2026-07-01 08:00:00', TRUE),
(11,'Daily Backup',          'backup', 'daily',   '2026-06-14 00:00:00', TRUE),
(12,'Expiry Alert Check',    'alert',  'daily',   '2026-06-14 07:00:00', TRUE),
(13,'Daily Backup',          'backup', 'daily',   '2026-06-14 00:00:00', TRUE),
(14,'Weekly Report',         'report', 'weekly',  '2026-06-18 08:00:00', TRUE);

-- ============================================================
-- 9. BACKUPS
-- ============================================================
INSERT INTO backups (shop_id, user_id, file_name, file_size, status, note) VALUES
-- Original
(1, 2, 'tokdak_shop1_20260601.sql', 204800, 'success', 'Scheduled daily backup'),
(1, 2, 'tokdak_shop1_20260608.sql', 215040, 'success', 'Scheduled daily backup'),
(2, 3, 'tokdak_shop2_20260601.sql', 102400, 'success', 'Manual backup before update'),
(3, 4, 'tokdak_shop3_20260601.sql',  51200, 'failed',  'Backup failed due to disk space'),
(4, 5, 'tokdak_shop4_20260601.sql',  76800, 'success', 'Scheduled monthly backup'),
-- New
(5, 6, 'tokdak_shop5_20260601.sql', 128000, 'success', 'Initial backup after setup'),
(6, 7, 'tokdak_shop6_20260601.sql',  96000, 'success', 'Scheduled daily backup'),
(7, 8, 'tokdak_shop7_20260601.sql', 112000, 'success', 'Weekly backup'),
(8, 9, 'tokdak_shop8_20260601.sql',  64000, 'failed',  'Backup interrupted'),
(9, 10,'tokdak_shop9_20260601.sql',  88000, 'success', 'Scheduled backup'),
(10,11,'tokdak_shop10_20260601.sql', 72000, 'success', 'Monthly backup'),
(11,12,'tokdak_shop11_20260601.sql', 56000, 'success', 'End of day backup'),
(12,13,'tokdak_shop12_20260601.sql', 104000,'success', 'Weekly backup'),
(13,14,'tokdak_shop13_20260601.sql', 48000, 'success', 'Daily backup'),
(14,15,'tokdak_shop14_20260601.sql', 84000, 'success', 'Backup before restock');

