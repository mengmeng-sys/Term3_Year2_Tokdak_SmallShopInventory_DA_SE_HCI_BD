-- ============================================================
-- TOKDAK — Seed Data
-- Team: CODEDUO | Seng Mengseang | Sun David
-- Run schema.sql first before this file
-- ============================================================

USE tokdak;

-- ============================================================
-- 1. USERS
-- ============================================================
INSERT INTO users (name, email, password, role, DOB, gender) VALUES
('Seng Mengseang', 'admin@tokdak.com',  '$2b$10$hashedpassword1', 'admin',  '1998-05-12', 'male'),
('Dara Chan',      'dara@gmail.com',    '$2b$10$hashedpassword2', 'client', '1990-03-22', 'male'),
('Sokha Lim',      'sokha@gmail.com',   '$2b$10$hashedpassword3', 'client', '1985-07-15', 'female'),
('Mony Pich',      'mony@gmail.com',    '$2b$10$hashedpassword4', 'client', '1993-11-08', 'female'),
('Virak Noun',     'virak@gmail.com',   '$2b$10$hashedpassword5', 'client', '1988-01-30', 'male');

-- ============================================================
-- 2. SHOPS
-- ============================================================
INSERT INTO shops (user_id, shop_name, address, phone) VALUES
(2, 'Dara Mini Mart',     'Street 271, Phnom Penh',  '012345678'),
(3, 'Sokha Grocery',      'Street 109, Phnom Penh',  '097654321'),
(4, 'Mony Daily Shop',    'Street 63, Siem Reap',    '096111222'),
(5, 'Virak Corner Store', 'Street 7, Battambang',    '078333444');

-- ============================================================
-- 3. CATEGORIES
-- ============================================================
INSERT INTO categories (shop_id, name) VALUES
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
(4, 'Drinks');

-- ============================================================
-- 4. PRODUCTS
-- ============================================================
INSERT INTO products (shop_id, category_id, name, description, price, current_quantity, min_quantity, unit) VALUES
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
(4, 11, 'Energy Drink',      'Energy boost drink can',       1.00, 18,  10, 'can');

-- ============================================================
-- 5. STOCK TRANSACTIONS
-- ============================================================
INSERT INTO stock_transactions (product_id, user_id, type, quantity_changed, quantity_before, quantity_after, note) VALUES
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
(17, 5, 'sale',     -8, 10,  2, 'Daily sales');

-- ============================================================
-- 6. ALERTS
-- ============================================================
INSERT INTO alerts (product_id, shop_id, type, is_resolved) VALUES
(1,  1, 'low_stock',    FALSE),
(2,  1, 'out_of_stock', FALSE),
(3,  1, 'low_stock',    FALSE),
(9,  1, 'low_stock',    FALSE),
(12, 2, 'low_stock',    FALSE),
(15, 3, 'low_stock',    FALSE),
(17, 4, 'low_stock',    FALSE);

-- ============================================================
-- 7. SHOP SETTINGS
-- ============================================================
INSERT INTO shop_settings (shop_id, language, currency, low_stock_threshold, notification_email, notification_app) VALUES
(1, 'km', 'USD',  5, TRUE,  TRUE),
(2, 'km', 'USD',  5, TRUE,  TRUE),
(3, 'km', 'USD',  5, FALSE, TRUE),
(4, 'en', 'USD', 10, TRUE,  TRUE);

-- ============================================================
-- 8. SHOP SCHEDULES
-- ============================================================
INSERT INTO shop_schedules (shop_id, task_name, task_type, frequency, next_run_at, is_active) VALUES
(1, 'Daily Backup',          'backup', 'daily',   '2026-06-14 00:00:00', TRUE),
(1, 'Weekly Stock Report',   'report', 'weekly',  '2026-06-16 08:00:00', TRUE),
(1, 'Low Stock Alert Check', 'alert',  'daily',   '2026-06-14 08:00:00', TRUE),
(2, 'Daily Backup',          'backup', 'daily',   '2026-06-14 00:00:00', TRUE),
(3, 'Weekly Report',         'report', 'weekly',  '2026-06-16 08:00:00', TRUE),
(4, 'Monthly Backup',        'backup', 'monthly', '2026-07-01 00:00:00', TRUE);

-- ============================================================
-- 9. BACKUPS
-- ============================================================
INSERT INTO backups (shop_id, user_id, file_name, file_size, status, note) VALUES
(1, 2, 'tokdak_shop1_20260601.sql', 204800, 'success', 'Scheduled daily backup'),
(1, 2, 'tokdak_shop1_20260608.sql', 215040, 'success', 'Scheduled daily backup'),
(2, 3, 'tokdak_shop2_20260601.sql', 102400, 'success', 'Manual backup before update'),
(3, 4, 'tokdak_shop3_20260601.sql',  51200, 'failed',  'Backup failed due to disk space'),
(4, 5, 'tokdak_shop4_20260601.sql',  76800, 'success', 'Scheduled monthly backup');