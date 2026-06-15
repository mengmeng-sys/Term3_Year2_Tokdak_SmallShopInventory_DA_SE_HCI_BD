-- ============================================================
-- TOKDAK — Small Shop Stock Inventory System
-- Database Schema — MySQL
-- Team: CODEDUO | Seng Mengseang | Sun David
-- Class: Y2T3 | CADT
-- ============================================================

CREATE DATABASE IF NOT EXISTS tokdak;
USE tokdak;


-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE users (
    user_id     INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100)        NOT NULL,
    email       VARCHAR(150)        NOT NULL UNIQUE,
    password    VARCHAR(255)        NOT NULL,
    role        ENUM('admin','client') NOT NULL DEFAULT 'client',
    DOB         DATE,
    gender      ENUM('male','female','other'),
    created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. SHOPS
-- ============================================================
CREATE TABLE shops (
    shop_id     INT PRIMARY KEY AUTO_INCREMENT,
    user_id     INT                 NOT NULL UNIQUE,
    shop_name   VARCHAR(150)        NOT NULL,
    address     VARCHAR(255),
    phone       VARCHAR(20),
    logo_url    VARCHAR(255),
    created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_shops_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 3. CATEGORIES
-- ============================================================
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    shop_id     INT                 NOT NULL,
    name        VARCHAR(100)        NOT NULL,
    created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_categories_shop
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 4. PRODUCTS
-- ============================================================
CREATE TABLE products (
    product_id          INT PRIMARY KEY AUTO_INCREMENT,
    shop_id             INT             NOT NULL,
    category_id         INT             NOT NULL,
    name                VARCHAR(150)    NOT NULL,
    description         TEXT,
    price               DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    current_quantity    INT             NOT NULL DEFAULT 0,
    min_quantity        INT             NOT NULL DEFAULT 5,
    unit                VARCHAR(50)     DEFAULT 'pcs',
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_shop
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT chk_price
        CHECK (price >= 0),

    CONSTRAINT chk_quantity
        CHECK (current_quantity >= 0),

    CONSTRAINT chk_min_quantity
        CHECK (min_quantity >= 0)
);

-- ============================================================
-- 5. STOCK TRANSACTIONS
-- ============================================================
CREATE TABLE stock_transactions (
    transaction_id      INT PRIMARY KEY AUTO_INCREMENT,
    product_id          INT             NOT NULL,
    user_id             INT             NOT NULL,
    type                ENUM('restock','adjustment','sale') NOT NULL DEFAULT 'restock',
    quantity_changed    INT             NOT NULL,
    quantity_before     INT             NOT NULL,
    quantity_after      INT             NOT NULL,
    note                TEXT,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transactions_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_transactions_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================================
-- 6. ALERTS
-- ============================================================
CREATE TABLE alerts (
    alert_id    INT PRIMARY KEY AUTO_INCREMENT,
    product_id  INT                         NOT NULL,
    shop_id     INT                         NOT NULL,
    type        ENUM('low_stock','out_of_stock') NOT NULL,
    is_resolved BOOLEAN                     NOT NULL DEFAULT FALSE,
    resolved_at TIMESTAMP                   NULL,
    created_at  TIMESTAMP                   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_alerts_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_alerts_shop
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 7. SHOP SETTINGS
-- ============================================================
CREATE TABLE shop_settings (
    setting_id          INT PRIMARY KEY AUTO_INCREMENT,
    shop_id             INT             NOT NULL UNIQUE,
    language            VARCHAR(20)     NOT NULL DEFAULT 'en',
    currency            VARCHAR(10)     NOT NULL DEFAULT 'USD',
    low_stock_threshold INT             NOT NULL DEFAULT 5,
    notification_email  BOOLEAN         NOT NULL DEFAULT TRUE,
    notification_app    BOOLEAN         NOT NULL DEFAULT TRUE,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_settings_shop
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 8. SHOP SCHEDULES
-- ============================================================
CREATE TABLE shop_schedules (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    shop_id     INT                             NOT NULL,
    task_name   VARCHAR(150)                    NOT NULL,
    task_type   ENUM('backup','report','alert') NOT NULL,
    frequency   ENUM('daily','weekly','monthly') NOT NULL DEFAULT 'daily',
    next_run_at TIMESTAMP                       NOT NULL,
    is_active   BOOLEAN                         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP                       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_schedules_shop
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 9. BACKUPS
-- ============================================================
CREATE TABLE backups (
    backup_id   INT PRIMARY KEY AUTO_INCREMENT,
    shop_id     INT                             NOT NULL,
    user_id     INT                             NOT NULL,
    file_name   VARCHAR(255)                    NOT NULL,
    file_size   BIGINT                          NOT NULL DEFAULT 0,
    status      ENUM('success','failed')        NOT NULL DEFAULT 'success',
    note        TEXT,
    created_at  TIMESTAMP                       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_backups_shop
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_backups_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================================
-- INDEXES
-- ============================================================

-- users
CREATE INDEX idx_users_email   ON users(email);
CREATE INDEX idx_users_role    ON users(role);

-- shops
CREATE INDEX idx_shops_user    ON shops(user_id);

-- categories
CREATE INDEX idx_categories_shop ON categories(shop_id);

-- products
CREATE INDEX idx_products_shop     ON products(shop_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_qty      ON products(current_quantity);

-- stock_transactions
CREATE INDEX idx_transactions_product ON stock_transactions(product_id);
CREATE INDEX idx_transactions_user    ON stock_transactions(user_id);
CREATE INDEX idx_transactions_date    ON stock_transactions(created_at);

-- alerts
CREATE INDEX idx_alerts_product    ON alerts(product_id);
CREATE INDEX idx_alerts_shop       ON alerts(shop_id);
CREATE INDEX idx_alerts_resolved   ON alerts(is_resolved);

-- shop_schedules
CREATE INDEX idx_schedules_shop    ON shop_schedules(shop_id);
CREATE INDEX idx_schedules_active  ON shop_schedules(is_active);

-- backups
CREATE INDEX idx_backups_shop      ON backups(shop_id);
CREATE INDEX idx_backups_date      ON backups(created_at);

show tables;
desc users;