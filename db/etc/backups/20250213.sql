-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Erstellungszeit: 13. Feb 2025 um 20:03
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

DROP TABLE IF EXISTS `Categories`;
CREATE TABLE `Categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- TRUNCATE Tabelle vor dem Einfügen `Categories`
--

TRUNCATE TABLE `Categories`;
--
-- Daten für Tabelle `Categories`
--

INSERT INTO `Categories` (`id`, `name`, `description`, `status_id`) VALUES
(1, 'Restaurants', 'Orte zum Essen und Trinken', 1),
(2, 'Sehenswürdigkeiten', 'Touristische Attraktionen', 1),
(3, 'Natur', 'Nationalparks, Berge, Seen', 1),
(4, 'Museen', 'Kulturelle und historische Ausstellungen', 1),
(5, 'Hotels', 'Unterkünfte für Übernachtungen', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Comments`
--

DROP TABLE IF EXISTS `Comments`;
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

--
-- TRUNCATE Tabelle vor dem Einfügen `Comments`
--

TRUNCATE TABLE `Comments`;
--
-- Daten für Tabelle `Comments`
--

INSERT INTO `Comments` (`id`, `location_id`, `user_id`, `comment_text`, `version`, `creation_date`, `last_modified`, `status_id`) VALUES
(1, 1, 1, 'Ein wunderschönes Schloss mit einer reichen Geschichte!', 1, '2025-02-13 20:01:17', '2025-02-13 20:01:17', 1),
(2, 2, 2, 'Perfekt für einen Spaziergang an einem sonnigen Tag.', 1, '2025-02-13 20:01:17', '2025-02-13 20:01:17', 1),
(3, 3, 3, 'Das Café Central ist ein Muss für jeden Wien-Besucher.', 1, '2025-02-13 20:01:17', '2025-02-13 20:01:17', 1),
(4, 4, 4, 'Das Riesenrad ist ein absolutes Highlight!', 1, '2025-02-13 20:01:17', '2025-02-13 20:01:17', 1),
(5, 5, 5, 'Hallstatt ist wie aus einem Märchen.', 1, '2025-02-13 20:01:17', '2025-02-13 20:01:17', 1),
(6, 6, 6, 'Die Festung bietet einen atemberaubenden Blick über Salzburg.', 1, '2025-02-13 20:01:17', '2025-02-13 20:01:17', 1),
(7, 7, 7, 'Die Wasserfälle sind ein Muss für Naturliebhaber.', 1, '2025-02-13 20:01:17', '2025-02-13 20:01:17', 1),
(8, 8, 8, 'Die Klimt-Gemälde im Belvedere sind unglaublich.', 1, '2025-02-13 20:01:17', '2025-02-13 20:01:17', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Favorites`
--

DROP TABLE IF EXISTS `Favorites`;
CREATE TABLE `Favorites` (
  `id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `creation_date` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- TRUNCATE Tabelle vor dem Einfügen `Favorites`
--

TRUNCATE TABLE `Favorites`;
--
-- Daten für Tabelle `Favorites`
--

INSERT INTO `Favorites` (`id`, `location_id`, `user_id`, `creation_date`) VALUES
(1, 1, 1, '2025-02-13 20:01:29'),
(2, 2, 2, '2025-02-13 20:01:29'),
(3, 3, 3, '2025-02-13 20:01:29'),
(4, 4, 4, '2025-02-13 20:01:29'),
(5, 5, 5, '2025-02-13 20:01:29'),
(6, 6, 6, '2025-02-13 20:01:29'),
(7, 7, 7, '2025-02-13 20:01:29'),
(8, 8, 8, '2025-02-13 20:01:29');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Images`
--

DROP TABLE IF EXISTS `Images`;
CREATE TABLE `Images` (
  `id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `image_url` varchar(512) NOT NULL,
  `description` text DEFAULT NULL,
  `creation_date` timestamp NULL DEFAULT current_timestamp(),
  `status_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- TRUNCATE Tabelle vor dem Einfügen `Images`
--

TRUNCATE TABLE `Images`;
--
-- Daten für Tabelle `Images`
--

INSERT INTO `Images` (`id`, `location_id`, `image_url`, `description`, `creation_date`, `status_id`) VALUES
(1, 1, '1', 'Schloss Schönbrunn Haupteingang', '2025-02-13 20:01:11', 1),
(2, 2, '2', 'Stadtpark Wien im Frühling', '2025-02-13 20:01:11', 1),
(3, 3, '3', 'Café Central Innenraum', '2025-02-13 20:01:11', 1),
(4, 4, '4', 'Wiener Prater Riesenrad', '2025-02-13 20:01:11', 1),
(5, 5, '5', 'Hallstatt Dorfansicht', '2025-02-13 20:01:11', 1),
(6, 6, '6', 'Festung Hohensalzburg von oben', '2025-02-13 20:01:11', 1),
(7, 7, '7', 'Krimmler Wasserfälle im Sommer', '2025-02-13 20:01:11', 1),
(8, 8, '8', 'Belvedere Museum Garten', '2025-02-13 20:01:11', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `LocationCategories`
--

DROP TABLE IF EXISTS `LocationCategories`;
CREATE TABLE `LocationCategories` (
  `location_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- TRUNCATE Tabelle vor dem Einfügen `LocationCategories`
--

TRUNCATE TABLE `LocationCategories`;
--
-- Daten für Tabelle `LocationCategories`
--

INSERT INTO `LocationCategories` (`location_id`, `category_id`) VALUES
(3, 1),
(1, 2),
(4, 2),
(6, 2),
(2, 3),
(5, 3),
(7, 3),
(8, 4);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Locations`
--

DROP TABLE IF EXISTS `Locations`;
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

--
-- TRUNCATE Tabelle vor dem Einfügen `Locations`
--

TRUNCATE TABLE `Locations`;
--
-- Daten für Tabelle `Locations`
--

INSERT INTO `Locations` (`id`, `name`, `description`, `category_id`, `latitude`, `longitude`, `address`, `creation_date`, `last_modified`, `status_id`, `price_range`, `opening_hours`, `season`, `accessibility`, `view_count`, `favorite_count`, `website_url`, `special_features`, `created_by`) VALUES
(1, 'Schloss Schönbrunn', 'Ein barockes Schloss in Wien', 2, 48.185847, 16.312753, 'Schönbrunner Schloßstraße 47, 1130 Wien', '2025-02-13 20:00:54', '2025-02-13 20:00:54', 1, '€€', '09:00 - 17:00', 'Ganzjährig', 1, 0, 0, 'https://www.schoenbrunn.at', 'Gärten, Tiergarten, Brunnen', 1),
(2, 'Stadtpark Wien', 'Ein öffentlicher Park im Zentrum von Wien', 3, 48.202161, 16.379919, 'Parkring, 1010 Wien', '2025-02-13 20:00:54', '2025-02-13 20:00:54', 1, 'Kostenlos', '06:00 - 22:00', 'Ganzjährig', 1, 0, 0, 'https://www.wien.info', 'Denkmäler, Teiche, Spazierwege', 2),
(3, 'Café Central', 'Historisches Kaffeehaus in Wien', 1, 48.210193, 16.365315, 'Herrengasse 14, 1010 Wien', '2025-02-13 20:00:54', '2025-02-13 20:00:54', 1, '€€€', '08:00 - 22:00', 'Ganzjährig', 1, 0, 0, 'https://www.cafecentral.wien', 'Wiener Kaffeehauskultur, Live-Musik', 3),
(4, 'Wiener Prater', 'Berühmter Vergnügungspark in Wien', 2, 48.216667, 16.395833, 'Prater 9, 1020 Wien', '2025-02-13 20:00:54', '2025-02-13 20:00:54', 1, '€€', '10:00 - 23:00', 'Ganzjährig', 1, 0, 0, 'https://www.prater.at', 'Riesenrad, Achterbahnen, Spielhallen', 4),
(5, 'Hallstatt', 'Pittoreskes Dorf am Hallstätter See', 3, 47.562234, 13.649262, 'Hallstatt, 4830 Oberösterreich', '2025-02-13 20:00:54', '2025-02-13 20:00:54', 1, 'Kostenlos', 'Ganzjährig', 'Ganzjährig', 1, 0, 0, 'https://www.hallstatt.net', 'See, Berge, Salzbergwerk', 5),
(6, 'Festung Hohensalzburg', 'Mittelalterliche Burg in Salzburg', 2, 47.794444, 13.046667, 'Mönchsberg 34, 5020 Salzburg', '2025-02-13 20:00:54', '2025-02-13 20:00:54', 1, '€€', '09:30 - 17:00', 'Ganzjährig', 1, 0, 0, 'https://www.salzburg-burgen.at', 'Panoramablick, Museen, Konzerte', 6),
(7, 'Krimmler Wasserfälle', 'Höchste Wasserfälle Österreichs', 3, 47.195833, 12.172222, 'Krimml, 5743 Salzburg', '2025-02-13 20:00:54', '2025-02-13 20:00:54', 1, '€', '08:00 - 18:00', 'Mai bis Oktober', 1, 0, 0, 'https://www.wasserfaelle-krimml.at', 'Wanderwege, Naturerlebnis', 7),
(8, 'Belvedere Museum', 'Kunstmuseum in Wien', 4, 48.191389, 16.380833, 'Prinz-Eugen-Straße 27, 1030 Wien', '2025-02-13 20:00:54', '2025-02-13 20:00:54', 1, '€€€', '10:00 - 18:00', 'Ganzjährig', 1, 0, 0, 'https://www.belvedere.at', 'Klimt-Gemälde, barocke Architektur', 8);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Ratings`
--

DROP TABLE IF EXISTS `Ratings`;
CREATE TABLE `Ratings` (
  `id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `creation_date` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- TRUNCATE Tabelle vor dem Einfügen `Ratings`
--

TRUNCATE TABLE `Ratings`;
--
-- Daten für Tabelle `Ratings`
--

INSERT INTO `Ratings` (`id`, `location_id`, `user_id`, `rating`, `creation_date`) VALUES
(1, 1, 1, 5, '2025-02-13 20:01:23'),
(2, 2, 2, 4, '2025-02-13 20:01:23'),
(3, 3, 3, 5, '2025-02-13 20:01:23'),
(4, 4, 4, 5, '2025-02-13 20:01:23'),
(5, 5, 5, 5, '2025-02-13 20:01:23'),
(6, 6, 6, 4, '2025-02-13 20:01:23'),
(7, 7, 7, 5, '2025-02-13 20:01:23'),
(8, 8, 8, 5, '2025-02-13 20:01:23');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Statuses`
--

DROP TABLE IF EXISTS `Statuses`;
CREATE TABLE `Statuses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- TRUNCATE Tabelle vor dem Einfügen `Statuses`
--

TRUNCATE TABLE `Statuses`;
--
-- Daten für Tabelle `Statuses`
--

INSERT INTO `Statuses` (`id`, `name`) VALUES
(1, 'active'),
(4, 'deleted'),
(2, 'inactive'),
(3, 'pending');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Users`
--

DROP TABLE IF EXISTS `Users`;
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
-- TRUNCATE Tabelle vor dem Einfügen `Users`
--

TRUNCATE TABLE `Users`;
--
-- Daten für Tabelle `Users`
--

INSERT INTO `Users` (`id`, `full_name`, `username`, `email`, `password_hash`, `creation_date`, `last_login`, `last_active`, `status_id`, `birth_date`, `profile_picture_url`, `phone_number`, `last_password_change`, `role`, `is_verified`, `preferences`, `is_blocked`, `description`) VALUES
(1, 'Max Mustermann', 'max_mustermann', 'max.mustermann@example.com', 'hashed_password_1', '2025-02-13 20:00:47', NULL, NULL, 1, '1985-05-15', '1', '+43123456789', NULL, 'user', 1, NULL, 0, 'Ich bin ein begeisterter Reisender.'),
(2, 'Anna Musterfrau', 'anna_musterfrau', 'anna.musterfrau@example.com', 'hashed_password_2', '2025-02-13 20:00:47', NULL, NULL, 1, '1990-08-22', '2', '+43678901234', NULL, 'admin', 1, NULL, 0, 'Admin der Plattform.'),
(3, 'Thomas Schmidt', 'thomas_schmidt', 'thomas.schmidt@example.com', 'hashed_password_3', '2025-02-13 20:00:47', NULL, NULL, 1, '1978-11-30', '3', '+43789012345', NULL, 'moderator', 1, NULL, 0, 'Moderator für Benutzerinhalte.'),
(4, 'Lisa Huber', 'lisa_huber', 'lisa.huber@example.com', 'hashed_password_4', '2025-02-13 20:00:47', NULL, NULL, 1, '1992-03-10', '4', '+43612345678', NULL, 'user', 1, NULL, 0, 'Ich liebe es, neue Orte zu entdecken.'),
(5, 'Michael Gruber', 'michael_gruber', 'michael.gruber@example.com', 'hashed_password_5', '2025-02-13 20:00:47', NULL, NULL, 1, '1980-07-25', '5', '+43765432109', NULL, 'user', 1, NULL, 0, 'Hobby-Fotograf und Naturliebhaber.'),
(6, 'Sarah Wagner', 'sarah_wagner', 'sarah.wagner@example.com', 'hashed_password_6', '2025-02-13 20:00:47', NULL, NULL, 1, '1995-12-05', '6', '+43876543210', NULL, 'moderator', 1, NULL, 0, 'Moderatorin für kulturelle Veranstaltungen.'),
(7, 'David Bauer', 'david_bauer', 'david.bauer@example.com', 'hashed_password_7', '2025-02-13 20:00:47', NULL, NULL, 1, '1988-09-14', '7', '+43987654321', NULL, 'admin', 1, NULL, 0, 'Systemadministrator der Plattform.'),
(8, 'Julia Fischer', 'julia_fischer', 'julia.fischer@example.com', 'hashed_password_8', '2025-02-13 20:00:47', NULL, NULL, 1, '1991-04-18', '8', '+43109876543', NULL, 'user', 1, NULL, 0, 'Reisebloggerin aus Wien.');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT für Tabelle `Comments`
--
ALTER TABLE `Comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT für Tabelle `Favorites`
--
ALTER TABLE `Favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT für Tabelle `Images`
--
ALTER TABLE `Images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT für Tabelle `Locations`
--
ALTER TABLE `Locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT für Tabelle `Ratings`
--
ALTER TABLE `Ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT für Tabelle `Statuses`
--
ALTER TABLE `Statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
