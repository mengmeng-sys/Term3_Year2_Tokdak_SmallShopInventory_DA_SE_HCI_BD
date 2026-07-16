-- Tokdak Backup for Dara Mini Mart
-- Shop ID: 1
-- Date: 07-15-26
-- ========================================================

-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: mysql-1716ce50-na634997-4f35.e.aivencloud.com    Database: tokdak
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `shops`
--

DROP TABLE IF EXISTS `shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shops` (
  `shop_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `shop_name` varchar(150) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`shop_id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `idx_shops_user` (`user_id`),
  CONSTRAINT `fk_shops_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shops`
--
-- WHERE:  shop_id=1

/*!40000 ALTER TABLE `shops` DISABLE KEYS */;
INSERT INTO `shops` (`shop_id`, `user_id`, `shop_name`, `address`, `phone`, `logo_url`, `created_at`, `updated_at`) VALUES (1,2,'Dara Mini Mart','Street 271, Phnom Penh','012345678',NULL,'2026-06-16 03:48:29','2026-06-16 03:48:29');
/*!40000 ALTER TABLE `shops` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-15 13:48:50
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: mysql-1716ce50-na634997-4f35.e.aivencloud.com    Database: tokdak
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `shop_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
  KEY `idx_categories_shop` (`shop_id`),
  CONSTRAINT `fk_categories_shop` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`shop_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--
-- WHERE:  shop_id=1

/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`category_id`, `shop_id`, `name`, `created_at`) VALUES (1,1,'Grocery','2026-06-16 03:48:29'),(2,1,'Drinks','2026-06-16 03:48:29'),(3,1,'Snacks','2026-06-16 03:48:29'),(4,1,'Household','2026-06-16 03:48:29');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-15 13:48:52
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: mysql-1716ce50-na634997-4f35.e.aivencloud.com    Database: tokdak
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `shop_id` int NOT NULL,
  `category_id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `current_quantity` int NOT NULL DEFAULT '0',
  `min_quantity` int NOT NULL DEFAULT '5',
  `unit` varchar(50) DEFAULT 'pcs',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  KEY `idx_products_shop` (`shop_id`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_qty` (`current_quantity`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_products_shop` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`shop_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_min_quantity` CHECK ((`min_quantity` >= 0)),
  CONSTRAINT `chk_price` CHECK ((`price` >= 0)),
  CONSTRAINT `chk_quantity` CHECK ((`current_quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--
-- WHERE:  shop_id=1

/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` (`product_id`, `shop_id`, `category_id`, `name`, `description`, `price`, `current_quantity`, `min_quantity`, `unit`, `created_at`, `updated_at`) VALUES (1,1,1,'Rice 5kg','Premium jasmine rice',12.50,20,10,'bag','2026-06-16 03:48:29','2026-06-20 09:16:08'),(2,1,1,'Cooking Oil 1L','Vegetable cooking oil',2.00,12,8,'bottle','2026-06-16 03:48:29','2026-06-20 09:18:20'),(3,1,1,'Sugar 1kg','White refined sugar',1.20,3,5,'bag','2026-06-16 03:48:29','2026-06-16 03:48:29'),(4,1,2,'Coca Cola 330ml','Soft drink can',0.75,24,12,'can','2026-06-16 03:48:29','2026-06-16 03:48:29'),(5,1,2,'Water 500ml','Mineral water bottle',0.30,48,20,'bottle','2026-06-16 03:48:29','2026-06-16 03:48:29'),(6,1,3,'Instant Noodles','Mama instant noodles',0.25,60,20,'pack','2026-06-16 03:48:29','2026-06-16 03:48:29'),(7,1,3,'Chips 50g','Potato chips snack',0.50,30,15,'pack','2026-06-16 03:48:29','2026-06-16 03:48:29'),(8,1,4,'Dish Soap 500ml','Liquid dish washing soap',1.50,5,5,'bottle','2026-06-16 03:48:29','2026-06-16 03:48:29'),(9,1,4,'Laundry Powder 1kg','Washing powder',3.00,1,5,'box','2026-06-16 03:48:29','2026-06-16 03:48:29');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-15 13:48:54
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: mysql-1716ce50-na634997-4f35.e.aivencloud.com    Database: tokdak
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `stock_transactions`
--

DROP TABLE IF EXISTS `stock_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` enum('restock','adjustment','sale') NOT NULL DEFAULT 'restock',
  `quantity_changed` int NOT NULL,
  `quantity_before` int NOT NULL,
  `quantity_after` int NOT NULL,
  `note` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  KEY `idx_transactions_product` (`product_id`),
  KEY `idx_transactions_user` (`user_id`),
  KEY `idx_transactions_date` (`created_at`),
  CONSTRAINT `fk_transactions_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_transactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_transactions`
--
-- WHERE:  product_id IN (SELECT product_id FROM products WHERE shop_id=1)

/*!40000 ALTER TABLE `stock_transactions` DISABLE KEYS */;
INSERT INTO `stock_transactions` (`transaction_id`, `product_id`, `user_id`, `type`, `quantity_changed`, `quantity_before`, `quantity_after`, `note`, `created_at`) VALUES (1,1,2,'restock',20,0,20,'Initial stock from supplier A','2026-06-16 03:48:29'),(4,1,2,'sale',-5,20,15,'Daily sales','2026-06-16 03:48:29'),(5,1,2,'sale',-11,15,4,'Weekend sales','2026-06-16 03:48:29'),(14,1,2,'restock',20,4,24,'Restocked from supplier A','2026-06-20 08:38:49'),(15,1,2,'sale',-3,24,21,'sold to customer','2026-06-20 08:42:17'),(16,1,2,'sale',-21,21,0,'sold to customer','2026-06-20 08:47:57'),(17,1,2,'restock',10,0,10,'Restocked from supplier A','2026-06-20 09:10:43'),(18,1,2,'restock',10,10,20,'Restocked from supplier A','2026-06-20 09:16:08'),(2,2,2,'restock',10,0,10,'Initial stock','2026-06-16 03:48:29'),(6,2,2,'sale',-8,10,2,'Daily sales','2026-06-16 03:48:29'),(19,2,2,'restock',10,2,12,'Restocked from supplier A','2026-06-20 09:18:20'),(3,3,2,'restock',8,0,8,'Initial stock','2026-06-16 03:48:29'),(7,3,2,'sale',-5,8,3,'Daily sales','2026-06-16 03:48:29');
/*!40000 ALTER TABLE `stock_transactions` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-15 13:48:57
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: mysql-1716ce50-na634997-4f35.e.aivencloud.com    Database: tokdak
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `shop_schedules`
--

DROP TABLE IF EXISTS `shop_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_schedules` (
  `schedule_id` int NOT NULL AUTO_INCREMENT,
  `shop_id` int NOT NULL,
  `task_name` varchar(150) NOT NULL,
  `task_type` enum('backup','report','alert') NOT NULL,
  `frequency` enum('daily','weekly','monthly') NOT NULL DEFAULT 'daily',
  `next_run_at` timestamp NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`schedule_id`),
  KEY `idx_schedules_shop` (`shop_id`),
  KEY `idx_schedules_active` (`is_active`),
  CONSTRAINT `fk_schedules_shop` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`shop_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_schedules`
--
-- WHERE:  shop_id=1

/*!40000 ALTER TABLE `shop_schedules` DISABLE KEYS */;
INSERT INTO `shop_schedules` (`schedule_id`, `shop_id`, `task_name`, `task_type`, `frequency`, `next_run_at`, `is_active`, `created_at`) VALUES (1,1,'Daily Backup','backup','daily','2026-07-15 07:00:07',1,'2026-06-16 03:48:30'),(2,1,'Weekly Stock Report','report','weekly','2026-06-16 08:00:00',1,'2026-06-16 03:48:30'),(3,1,'Low Stock Alert Check','alert','daily','2026-06-14 08:00:00',1,'2026-06-16 03:48:30');
/*!40000 ALTER TABLE `shop_schedules` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-15 13:48:58
