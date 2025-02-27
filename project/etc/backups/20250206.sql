-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Erstellungszeit: 06. Feb 2025 um 07:45
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

--
-- Daten für Tabelle `Categories`
--

INSERT INTO `Categories` (`id`, `name`, `description`, `status_id`) VALUES
(1, 'Park', 'Schöne grüne Parks', 1),
(2, 'Restaurant', 'Tolle Restaurants', 1),
(3, 'Berg', 'Beeindruckende Berge', 1),
(4, 'See', 'Wunderschöne Seen', 1);

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

--
-- Daten für Tabelle `Comments`
--

INSERT INTO `Comments` (`id`, `location_id`, `user_id`, `comment_text`, `version`, `creation_date`, `last_modified`, `status_id`) VALUES
(1, 1, 1, 'Ein wunderschöner Park, perfekt für Spaziergänge.', 1, '2025-02-06 07:37:12', '2025-02-06 07:37:12', 1),
(2, 2, 2, 'Der Dom ist einfach beeindruckend!', 1, '2025-02-06 07:37:12', '2025-02-06 07:37:12', 1),
(3, 3, 3, 'Traumhafte Kulisse, absolut empfehlenswert.', 1, '2025-02-06 07:37:12', '2025-02-06 07:37:12', 1),
(4, 4, 4, 'Tolle Aussicht, aber etwas teuer.', 1, '2025-02-06 07:37:12', '2025-02-06 07:37:12', 1);

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

--
-- Daten für Tabelle `Favorites`
--

INSERT INTO `Favorites` (`id`, `location_id`, `user_id`, `creation_date`) VALUES
(1, 1, 1, '2025-02-06 07:37:12'),
(2, 2, 2, '2025-02-06 07:37:12'),
(3, 3, 3, '2025-02-06 07:37:12'),
(4, 4, 4, '2025-02-06 07:37:12');

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

--
-- Daten für Tabelle `Images`
--

INSERT INTO `Images` (`id`, `location_id`, `image_url`, `description`, `creation_date`, `status_id`) VALUES
(1, 1, 'https://example.com/schoenbrunn.jpg', 'Bild vom Schlosspark Schönbrunn', '2025-02-06 07:37:12', 1),
(2, 2, 'https://example.com/stephansdom.jpg', 'Bild vom Stephansdom', '2025-02-06 07:37:12', 1),
(3, 3, 'https://example.com/hallstaettersee.jpg', 'Bild vom Hallstätter See', '2025-02-06 07:37:12', 1),
(4, 4, 'https://example.com/zugspitze.jpg', 'Bild von der Zugspitze', '2025-02-06 07:37:12', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `LocationCategories`
--

CREATE TABLE `LocationCategories` (
  `location_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Daten für Tabelle `LocationCategories`
--

INSERT INTO `LocationCategories` (`location_id`, `category_id`) VALUES
(1, 1),
(2, 2),
(4, 3),
(3, 4);

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

--
-- Daten für Tabelle `Locations`
--

INSERT INTO `Locations` (`id`, `name`, `description`, `category_id`, `latitude`, `longitude`, `address`, `creation_date`, `last_modified`, `status_id`, `price_range`, `opening_hours`, `season`, `accessibility`, `view_count`, `favorite_count`, `website_url`, `special_features`, `created_by`) VALUES
(1, 'Schlosspark Schönbrunn', 'Historischer Park mit beeindruckender Gartenanlage.', 1, 48.184800, 16.312200, 'Wien, Österreich', '2025-02-06 07:37:12', '2025-02-06 07:37:12', 1, 'Gratis', '06:30-21:00', 'Ganzjährig', 1, 500, 50, 'https://schoenbrunn.at', 'UNESCO-Weltkulturerbe', 1),
(2, 'Stephansdom', 'Berühmte Kathedrale im Herzen Wiens.', 2, 48.208300, 16.373100, 'Wien, Österreich', '2025-02-06 07:37:12', '2025-02-06 07:37:12', 1, 'Gratis', '06:00-22:00', 'Ganzjährig', 1, 300, 30, 'https://stephansdom.at', 'Wahrzeichen von Wien', 2),
(3, 'Hallstätter See', 'Malerischer Alpensee in Oberösterreich.', 4, 47.561500, 13.648100, 'Hallstatt, Österreich', '2025-02-06 07:37:12', '2025-02-06 07:37:12', 1, 'Gratis', '24/7', 'Frühling bis Herbst', 1, 250, 20, 'https://hallstatt.net', 'Kristallklares Wasser', 3),
(4, 'Zugspitze', 'Höchster Berg Deutschlands mit Blick auf Österreich.', 3, 47.421100, 10.985400, 'Tirol, Österreich', '2025-02-06 07:37:12', '2025-02-06 07:37:12', 1, '€€€', '08:00-16:00', 'Winter und Sommer', 1, 150, 15, 'https://zugspitze.at', 'Skigebiet und Aussichtspunkt', 4);

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

--
-- Daten für Tabelle `Ratings`
--

INSERT INTO `Ratings` (`id`, `location_id`, `user_id`, `rating`, `creation_date`) VALUES
(1, 1, 1, 5, '2025-02-06 07:37:12'),
(2, 2, 2, 5, '2025-02-06 07:37:12'),
(3, 3, 3, 4, '2025-02-06 07:37:12'),
(4, 4, 4, 4, '2025-02-06 07:37:12');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Statuses`
--

CREATE TABLE `Statuses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Daten für Tabelle `Statuses`
--

INSERT INTO `Statuses` (`id`, `name`) VALUES
(1, 'active'),
(2, 'inactive'),
(3, 'pending');

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
-- Daten für Tabelle `Users`
--

INSERT INTO `Users` (`id`, `full_name`, `username`, `email`, `password_hash`, `creation_date`, `last_login`, `last_active`, `status_id`, `birth_date`, `profile_picture_url`, `phone_number`, `last_password_change`, `role`, `is_verified`, `preferences`, `is_blocked`, `description`) VALUES
(1, 'Max Mustermann', 'maxm', 'max@example.com', 'hashed_password_1', '2025-02-06 07:37:12', NULL, NULL, 1, '2000-05-15', NULL, NULL, NULL, 'user', 1, NULL, 0, NULL),
(2, 'Admin User', 'admin1', 'admin@example.com', 'hashed_password_2', '2025-02-06 07:37:12', NULL, NULL, 1, '1995-10-20', NULL, NULL, NULL, 'admin', 1, NULL, 0, NULL),
(3, 'Lisa Huber', 'lisah', 'lisa@example.com', 'hashed_password_3', '2025-02-06 07:37:12', NULL, NULL, 1, '1998-07-12', NULL, NULL, NULL, 'user', 1, NULL, 0, NULL),
(4, 'Thomas Gruber', 'thomasg', 'thomas@example.com', 'hashed_password_4', '2025-02-06 07:37:12', NULL, NULL, 1, '1992-11-30', NULL, NULL, NULL, 'moderator', 1, NULL, 0, NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `Comments`
--
ALTER TABLE `Comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `Favorites`
--
ALTER TABLE `Favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `Images`
--
ALTER TABLE `Images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `Locations`
--
ALTER TABLE `Locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `Ratings`
--
ALTER TABLE `Ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `Statuses`
--
ALTER TABLE `Statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
