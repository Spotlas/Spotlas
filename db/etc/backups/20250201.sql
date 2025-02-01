-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Erstellungszeit: 01. Feb 2025 um 20:13
-- Server-Version: 11.6.2-MariaDB-ubu2404
-- PHP-Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `spotlas`
--
CREATE DATABASE IF NOT EXISTS `spotlas` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci;
USE `spotlas`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Categories`
--

CREATE TABLE `Categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Comments`
--

CREATE TABLE `Comments` (
  `id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment_text` text DEFAULT NULL,
  `version` int(11) DEFAULT 1,
  `creation_date` timestamp NULL DEFAULT current_timestamp(),
  `last_modified` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Favorites`
--

CREATE TABLE `Favorites` (
  `id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `creation_date` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Images`
--

CREATE TABLE `Images` (
  `id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `image_url` varchar(512) NOT NULL,
  `description` text DEFAULT NULL,
  `creation_date` timestamp NULL DEFAULT current_timestamp(),
  `status_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `LocationCategories`
--

CREATE TABLE `LocationCategories` (
  `location_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Locations`
--

CREATE TABLE `Locations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `creation_date` timestamp NULL DEFAULT current_timestamp(),
  `last_modified` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status_id` int(11) DEFAULT NULL,
  `price_range` varchar(255) DEFAULT NULL,
  `opening_hours` varchar(255) DEFAULT NULL,
  `season` varchar(255) DEFAULT NULL,
  `accessibility` tinyint(1) DEFAULT 0,
  `view_count` int(11) DEFAULT 0,
  `favorite_count` int(11) DEFAULT 0,
  `website_url` varchar(255) DEFAULT NULL,
  `special_features` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Ratings`
--

CREATE TABLE `Ratings` (
  `id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `creation_date` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Statuses`
--

CREATE TABLE `Statuses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `creation_date` timestamp NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  `last_active` timestamp NULL DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `profile_picture_url` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `last_password_change` timestamp NULL DEFAULT NULL,
  `role` enum('user','admin','moderator') DEFAULT 'user',
  `is_verified` tinyint(1) DEFAULT 0,
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences`)),
  `is_blocked` tinyint(1) DEFAULT 0,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `Categories`
--
ALTER TABLE `Categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `status_id` (`status_id`);

--
-- Indizes für die Tabelle `Comments`
--
ALTER TABLE `Comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indizes für die Tabelle `Favorites`
--
ALTER TABLE `Favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `location_id` (`location_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indizes für die Tabelle `Images`
--
ALTER TABLE `Images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indizes für die Tabelle `LocationCategories`
--
ALTER TABLE `LocationCategories`
  ADD PRIMARY KEY (`location_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indizes für die Tabelle `Locations`
--
ALTER TABLE `Locations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `status_id` (`status_id`);

--
-- Indizes für die Tabelle `Ratings`
--
ALTER TABLE `Ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `location_id` (`location_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indizes für die Tabelle `Statuses`
--
ALTER TABLE `Statuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indizes für die Tabelle `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `status_id` (`status_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `Categories`
--
ALTER TABLE `Categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `Comments`
--
ALTER TABLE `Comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `Favorites`
--
ALTER TABLE `Favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `Images`
--
ALTER TABLE `Images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `Locations`
--
ALTER TABLE `Locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `Ratings`
--
ALTER TABLE `Ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `Statuses`
--
ALTER TABLE `Statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `Categories`
--
ALTER TABLE `Categories`
  ADD CONSTRAINT `Categories_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `Statuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints der Tabelle `Comments`
--
ALTER TABLE `Comments`
  ADD CONSTRAINT `Comments_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `Locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Comments_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `Statuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints der Tabelle `Favorites`
--
ALTER TABLE `Favorites`
  ADD CONSTRAINT `Favorites_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `Locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Favorites_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `Images`
--
ALTER TABLE `Images`
  ADD CONSTRAINT `Images_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `Locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Images_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `Statuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints der Tabelle `LocationCategories`
--
ALTER TABLE `LocationCategories`
  ADD CONSTRAINT `LocationCategories_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `Locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `LocationCategories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `Locations`
--
ALTER TABLE `Locations`
  ADD CONSTRAINT `Locations_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Locations_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Locations_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `Statuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints der Tabelle `Ratings`
--
ALTER TABLE `Ratings`
  ADD CONSTRAINT `Ratings_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `Locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `Users`
--
ALTER TABLE `Users`
  ADD CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `Statuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
