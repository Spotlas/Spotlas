-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Erstellungszeit: 17. Jun 2025 um 07:13
-- Server-Version: 11.7.2-MariaDB-ubu2404
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
(1, 'Restaurants', 'Orte zum Essen und Trinken', 1),
(2, 'Sehenswürdigkeiten', 'Touristische Attraktionen', 1),
(3, 'Natur', 'Nationalparks, Berge, Seen', 1),
(4, 'Museen', 'Kulturelle und historische Ausstellungen', 1),
(5, 'Hotels', 'Unterkünfte für Übernachtungen', 1);

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

--
-- Daten für Tabelle `Images`
--

INSERT INTO `Images` (`id`, `location_id`, `image_url`, `description`, `creation_date`, `status_id`) VALUES
(14, 14, 'uploads/684bd0dd16f86_cafe3.jpg', 'Main image', '2025-06-13 07:18:53', NULL),
(15, 14, 'uploads/684bd0dd1768d_cafe2.jpg', 'Additional image 1', '2025-06-13 07:18:53', NULL),
(16, 14, 'uploads/684bd0dd17b12_cafe1.jpg', 'Additional image 2', '2025-06-13 07:18:53', NULL),
(17, 15, 'uploads/684bd1785cb2d_prater2.jpg', 'Main image', '2025-06-13 07:21:28', NULL),
(18, 15, 'uploads/684bd1785d3ee_prater1.jpg', 'Additional image 1', '2025-06-13 07:21:28', NULL),
(19, 15, 'uploads/684bd1785d9f4_prater4.jpg', 'Additional image 2', '2025-06-13 07:21:28', NULL),
(20, 15, 'uploads/684bd1785df03_prater3.jpg', 'Additional image 3', '2025-06-13 07:21:28', NULL),
(21, 16, 'uploads/684bd2040f6b2_mirabell2.jpg', 'Main image', '2025-06-13 07:23:48', NULL),
(22, 17, 'uploads/684bd286288ce_kunsthaus3.jpg', 'Main image', '2025-06-13 07:25:58', NULL),
(23, 17, 'uploads/684bd28629196_kunsthaus2.jpg', 'Additional image 1', '2025-06-13 07:25:58', NULL),
(24, 17, 'uploads/684bd2862992e_kunsthaus1.jpg', 'Additional image 2', '2025-06-13 07:25:58', NULL),
(25, 18, 'uploads/684bd34dd2c17_seegrube1.jpg', 'Main image', '2025-06-13 07:29:17', NULL),
(26, 18, 'uploads/684bd34dd318b_seegrube3.jpg', 'Additional image 1', '2025-06-13 07:29:17', NULL),
(27, 18, 'uploads/684bd34dd35e2_seegrube2.jpg', 'Additional image 2', '2025-06-13 07:29:17', NULL),
(28, 19, 'uploads/684bd3cb3e168_hall2.jpg', 'Main image', '2025-06-13 07:31:23', NULL),
(29, 19, 'uploads/684bd3cb3e7dc_hall3.jpg', 'Additional image 1', '2025-06-13 07:31:23', NULL),
(30, 19, 'uploads/684bd3cb3eed8_hall1.jpg', 'Additional image 2', '2025-06-13 07:31:23', NULL),
(31, 20, 'uploads/684bd45ebc980_post1.jpg', 'Main image', '2025-06-13 07:33:50', NULL),
(32, 20, 'uploads/684bd45ebd178_post2.jpg', 'Additional image 1', '2025-06-13 07:33:50', NULL),
(33, 21, 'uploads/684bd59e29384_sacher2.webp', 'Main image', '2025-06-13 07:39:10', NULL),
(34, 21, 'uploads/684bd59e299b4_sacher3.webp', 'Additional image 1', '2025-06-13 07:39:10', NULL),
(35, 21, 'uploads/684bd59e29fce_sacher1.jpg', 'Additional image 2', '2025-06-13 07:39:10', NULL);

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

--
-- Daten für Tabelle `Locations`
--

INSERT INTO `Locations` (`id`, `name`, `description`, `category_id`, `latitude`, `longitude`, `address`, `creation_date`, `last_modified`, `status_id`, `price_range`, `opening_hours`, `season`, `accessibility`, `view_count`, `favorite_count`, `website_url`, `special_features`, `created_by`) VALUES
(14, 'Café Central', 'Historisches Wiener Kaffeehaus mit Marmorsäulen und Torten.', 1, 48.206167, 16.359164, 'Herrengasse 14, 1010 Wien', '2025-06-13 07:18:53', '2025-06-13 07:18:53', NULL, '10', '07:30 – 22:00', 'Ganzjährig', 1, 0, 0, 'https://www.cafecentral.wien', 'Historisches Ambiente', 13),
(15, 'Prater', 'Großer Stadtpark mit dem berühmten Riesenrad und Biergärten.', 2, 48.216110, 16.395555, 'Prater, 1020 Wien', '2025-06-13 07:21:28', '2025-06-13 07:21:28', NULL, '0', '06:00 – 23:00', 'Frühling–Herbst', 1, 0, 0, 'https://praterwien.com', 'Riesenrad', 13),
(16, 'Schloss Mirabell', 'Barockschloss mit prächtigem Garten und Marmortreppenhaus.', 2, 47.803331, 13.038500, 'Mirabellplatz 4, 5020 Salzburg', '2025-06-13 07:23:48', '2025-06-13 07:23:48', NULL, '0', '06:00 – 21:00', 'Frühling–Sommer', 1, 0, 0, 'https://www.salzburg.info/de/sehenswuerdigkeiten/schloesser/schloss-mirabell', 'Barockgarten', 13),
(17, 'Kunsthaus Graz', 'Futuristisches Museum für zeitgenössische Kunst am Murufer.', 4, 47.071400, 15.434100, 'Lendkai 1, 8020 Graz', '2025-06-13 07:25:58', '2025-06-13 07:25:58', NULL, '12', '10:00 – 18:00', 'Ganzjährig', 1, 0, 0, 'https://www.museum-joanneum.at/kunsthaus-graz', '„Blaue Blase“-Architektur', 13),
(18, 'Restaurant Seegrube', 'Bergrestaurant auf 1 905 m mit Panoramablick über Innsbruck.', 1, 47.306667, 11.380278, 'Seegrube 510, 6020 Innsbruck', '2025-06-13 07:29:17', '2025-06-13 07:29:17', NULL, '15', '09:00 – 17:00', 'Sommer–Winter', 1, 0, 0, 'https://www.nordkette.com', 'Panoramablick', 13),
(19, 'Hallstatt Skywalk', 'Aussichtsplattform über dem Welterbe-Dorf Hallstatt.', 3, 47.562233, 13.649262, 'Salzbergstraße 21, 4830 Hallstatt', '2025-06-13 07:31:23', '2025-06-13 07:31:23', NULL, '2', '09:00 – 16:30', 'Ganzjährig', 1, 0, 0, 'https://www.hallstatt.net/de/skywalk', 'Glasplattform', 13),
(20, 'Pöstlingberg-Schlössl', 'Traditionslokal mit Donaublick und großer Terrasse.', 1, 48.344000, 14.262200, 'Am Pöstlingberg 14, 4040 Linz', '2025-06-13 07:33:50', '2025-06-13 07:33:50', NULL, '20', '10:00 – 23:00', 'Ganzjährig', 1, 0, 0, 'https://www.poestlingbergschloessl.at', 'Donaublick', 13),
(21, 'Hotel Sacher Wien', 'Legendäres 5-Sterne-Hotel, Original Sachertorte & Blick auf die Staatsoper.', 5, 48.202333, 16.368331, 'Philharmonikerstraße 4, 1010 Wien', '2025-06-13 07:39:10', '2025-06-13 07:39:10', NULL, '300', '24/7', 'Ganzjährig', 1, 0, 0, 'https://www.sacher.com/hotel-sacher-wien', 'Sachertorte, Luxus-Spa', 13);

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
(1, 'Max Mustermann', 'max_mustermann', 'max.mustermann@example.com', 'hashed_password_1', '2025-02-13 20:00:47', NULL, NULL, 1, '1985-05-15', '1', '+43123456789', NULL, 'user', 1, NULL, 0, 'Ich bin ein begeisterter Reisender.'),
(2, 'Anna Musterfrau', 'anna_musterfrau', 'anna.musterfrau@example.com', 'hashed_password_2', '2025-02-13 20:00:47', NULL, NULL, 1, '1990-08-22', '2', '+43678901234', NULL, 'admin', 1, NULL, 0, 'Admin der Plattform.'),
(3, 'Thomas Schmidt', 'thomas_schmidt', 'thomas.schmidt@example.com', 'hashed_password_3', '2025-02-13 20:00:47', NULL, NULL, 1, '1978-11-30', '3', '+43789012345', NULL, 'moderator', 1, NULL, 0, 'Moderator für Benutzerinhalte.'),
(4, 'Lisa Huber', 'lisa_huber', 'lisa.huber@example.com', 'hashed_password_4', '2025-02-13 20:00:47', NULL, NULL, 1, '1992-03-10', '4', '+43612345678', NULL, 'user', 1, NULL, 0, 'Ich liebe es, neue Orte zu entdecken.'),
(5, 'Michael Gruber', 'michael_gruber', 'michael.gruber@example.com', 'hashed_password_5', '2025-02-13 20:00:47', NULL, NULL, 1, '1980-07-25', '5', '+43765432109', NULL, 'user', 1, NULL, 0, 'Hobby-Fotograf und Naturliebhaber.'),
(6, 'Sarah Wagner', 'sarah_wagner', 'sarah.wagner@example.com', 'hashed_password_6', '2025-02-13 20:00:47', NULL, NULL, 1, '1995-12-05', '6', '+43876543210', NULL, 'moderator', 1, NULL, 0, 'Moderatorin für kulturelle Veranstaltungen.'),
(7, 'David Bauer', 'david_bauer', 'david.bauer@example.com', 'hashed_password_7', '2025-02-13 20:00:47', NULL, NULL, 1, '1988-09-14', '7', '+43987654321', NULL, 'admin', 1, NULL, 0, 'Systemadministrator der Plattform.'),
(8, 'Julia Fischer', 'julia_fischer', 'julia.fischer@example.com', 'hashed_password_8', '2025-02-13 20:00:47', NULL, NULL, 1, '1991-04-18', '8', '+43109876543', NULL, 'user', 1, NULL, 0, 'Reisebloggerin aus Wien.'),
(9, 'New User', 'erikii_9562', 'erikii@gmail.com', '$2y$10$OyHoKidkrekhvIZa9EUj7eTqQYWNUnqjIAzHuS7Yx6XNlZ7FORcfq', '2025-04-08 19:20:41', NULL, NULL, NULL, NULL, 'default.jpg', NULL, NULL, 'user', 0, NULL, 0, ''),
(13, 'erik bergi', 'erikbergi', 'erikbergi@gmail.com', '$2y$10$s0zCuFz6TXzxbWUjcvu6euwPyM2QaQzGN/LYvUsp46gLmXfxn.Swy', '2025-05-17 09:23:32', '2025-06-13 07:06:00', NULL, NULL, NULL, 'default.jpg', '+43 686678976', NULL, 'user', 0, NULL, 0, ''),
(14, 'bergi bergi', 'bergi', 'bergi@gmail.com', '$2y$10$74a0n/9fStjpp0ooGyKgS.M42anbDYNCP2v9xYLNGaCnWPVbfL.me', '2025-05-17 09:50:20', '2025-05-17 10:00:04', NULL, NULL, NULL, 'default.jpg', '+5678867', NULL, 'user', 0, NULL, 0, ''),
(15, 'test acc', 'testacc', 'testacc@gmail.com', '$2y$10$EDc7x7l808ltmO5hildof.xrMWTLQl8byTIgTVvmvjsDw9BVfeZKy', '2025-06-12 17:49:38', NULL, NULL, NULL, NULL, 'default.jpg', '+436434', NULL, 'user', 0, NULL, 0, '');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT für Tabelle `Favorites`
--
ALTER TABLE `Favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT für Tabelle `Images`
--
ALTER TABLE `Images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT für Tabelle `Locations`
--
ALTER TABLE `Locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT für Tabelle `Ratings`
--
ALTER TABLE `Ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT für Tabelle `Statuses`
--
ALTER TABLE `Statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

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
