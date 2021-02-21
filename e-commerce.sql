CREATE DATABASE  IF NOT EXISTS `e-commerce` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `e-commerce`;
-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: localhost    Database: e-commerce
-- ------------------------------------------------------
-- Server version	8.0.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `state` varchar(45) NOT NULL DEFAULT 'open',
  `notes` longtext,
  PRIMARY KEY (`cart_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (55,43,'open',NULL),(56,48,'approved','null'),(57,49,'approved','null');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_products`
--

DROP TABLE IF EXISTS `cart_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `cart_products` (
  `cart_products_id` int(11) NOT NULL AUTO_INCREMENT,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price_per_product` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `total` float NOT NULL,
  PRIMARY KEY (`cart_products_id`),
  KEY `fk_cart_products_1_idx` (`product_id`),
  KEY `fk_cart_products_2_idx` (`cart_id`),
  CONSTRAINT `fk_cart_products_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`products_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_products_2` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_products`
--

LOCK TABLES `cart_products` WRITE;
/*!40000 ALTER TABLE `cart_products` DISABLE KEYS */;
INSERT INTO `cart_products` VALUES (66,56,93,1,25,NULL,25),(68,56,93,1,25,NULL,25),(69,57,97,1,27,NULL,27),(71,57,95,1,14,NULL,14);
/*!40000 ALTER TABLE `cart_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `comment` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `products_id` int(11) NOT NULL,
  `comment` longtext,
  PRIMARY KEY (`comment_id`,`products_id`),
  KEY `product_id_idx` (`products_id`),
  CONSTRAINT `product_id` FOREIGN KEY (`products_id`) REFERENCES `products` (`products_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `images` (
  `images_id` int(11) NOT NULL AUTO_INCREMENT,
  `products_id` int(11) NOT NULL,
  `image_url` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`images_id`,`products_id`),
  KEY `fk_images_1_idx` (`products_id`),
  CONSTRAINT `products_id` FOREIGN KEY (`products_id`) REFERENCES `products` (`products_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (50,90,'userPhoto-1613942092178item22.jpg'),(51,90,'userPhoto-1613942092181item23.jpg'),(54,92,'userPhoto-1613942436907item32.jpg'),(55,92,'userPhoto-1613942436912item33.jpg'),(56,93,'userPhoto-1613942486828item52.jpg'),(57,94,'userPhoto-1613942548666item192.jpg'),(58,94,'userPhoto-1613942548714item193.jpg'),(59,95,'userPhoto-1613942606241item172.jpg'),(60,95,'userPhoto-1613942606242item173.jpg'),(61,96,'userPhoto-1613942675441item152.jpg'),(62,96,'userPhoto-1613942675450item153.jpg'),(63,97,'userPhoto-1613942733287item142.jpg'),(64,97,'userPhoto-1613942733304item143.jpg'),(65,98,'userPhoto-1613942809077item132.jpg'),(66,98,'userPhoto-1613942809091item133.jpg'),(67,99,'userPhoto-1613944086731item202.jpg'),(68,99,'userPhoto-1613944086743item203.jpg');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_products`
--

DROP TABLE IF EXISTS `order_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `order_products` (
  `order_products_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `address` longtext,
  `notes` longtext,
  PRIMARY KEY (`order_products_id`),
  KEY `order_id_idx` (`order_id`),
  KEY `product_id_idx` (`product_id`),
  CONSTRAINT `o_p/order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`orders_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `o_p/product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`products_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_products`
--

LOCK TABLES `order_products` WRITE;
/*!40000 ALTER TABLE `order_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `orders` (
  `orders_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `notes` longtext,
  `payment_method` varchar(45) DEFAULT 'cash',
  PRIMARY KEY (`orders_id`),
  KEY `order_id_idx` (`user_id`),
  CONSTRAINT `order_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `products` (
  `products_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `state` varchar(45) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `date` varchar(100) NOT NULL,
  `primary_image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`products_id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (90,'Shirt','Active',30,3,'new Style','22.Feb.2021','userPhoto-1613942092174item21.jpg'),(92,'shoes','Active',50,7,'summer style','22.Feb.2021','userPhoto-1613942436905item31.jpg'),(93,'watch','Active',25,11,'awesome watch','22.Feb.2021','userPhoto-1613942486827item51.jpg'),(94,'Cardigan Set','Active',27,33,'for little boy','22.Feb.2021','userPhoto-1613942548649item191.jpg'),(95,'Sweatshirt','Active',14,5,'young boy','22.Feb.2021','userPhoto-1613942606232item171.jpg'),(96,'women watch','Active',30,15,'for your style','22.Feb.2021','userPhoto-1613942675437item151.jpg'),(97,'Sports shirt','Active',27,3,'for sports','23.Feb.2021','userPhoto-1613942733284item141.jpg'),(98,'Wallet','Active',16,20,'nice wallet','22.Feb.2021','userPhoto-1613942809076item131.jpg'),(99,'lady','Active',35,6,'home style','23.Feb.2021','userPhoto-1613944086724item201.jpg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(75) NOT NULL,
  `address` varchar(250) DEFAULT NULL,
  `password` longtext NOT NULL,
  `isAdmin` int(11) DEFAULT NULL,
  `imgBase64` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_UNIQUE` (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (43,'karim','ahmed','karimahmedarafa@gmail.com','alagamy','202cb962ac59075b964b07152d234b70',1,'karimahmedarafa@gmail.com.png'),(44,'youssef','shaban','youssef.shaban.atta@gmail.com','elmandara','202cb962ac59075b964b07152d234b70',1,'youssef.shaban.atta@gmail.com.png'),(45,'ahmed','atef','ahmed.atef@gmail.com','moharab bik','e10adc3949ba59abbe56e057f20f883e',NULL,'ahmed.atef@gmail.com.png'),(46,'walid','elsayed','walid.elsayed@gmail.com','loran','202cb962ac59075b964b07152d234b70',NULL,'walid.elsayed@gmail.com.png'),(47,'mohamed','mokhtar','mohamed.mokhtar@gmail.com','cairo','202cb962ac59075b964b07152d234b70',NULL,'mohamed.mokhtar@gmail.com.png'),(48,'muhammed','abdelhay','muhammed.Abdelhay@gmail.com','Iti','202cb962ac59075b964b07152d234b70',NULL,'muhammed.Abdelhay@gmail.com.png'),(49,'mohamed','mohamed','mohamed.mohamed@gmail.com','karmouz','202cb962ac59075b964b07152d234b70',1,'mohamed.mohamed@gmail.com.png');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-22  0:43:42
