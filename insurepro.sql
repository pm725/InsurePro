-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 18, 2026 at 02:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `insurepro`
--

-- --------------------------------------------------------

--
-- Table structure for table `badges`
--

CREATE TABLE `badges` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `badge_name` varchar(50) NOT NULL,
  `badge_icon` varchar(50) DEFAULT NULL,
  `earned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `claims`
--

CREATE TABLE `claims` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `document_path` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `claims`
--

INSERT INTO `claims` (`id`, `user_id`, `description`, `document_path`, `status`, `created_at`, `updated_at`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Medical checkup claim', NULL, 'Pending', '2026-07-18 02:54:12', '2026-07-18 02:54:12', '2026-07-18 04:37:47', '2026-07-18 04:37:47'),
(2, 3, 'i had a accident with a car i was hit by another car', 'uploads\\claim-1784349881858-134514193.png', 'Pending', '2026-07-18 04:44:41', '2026-07-18 04:44:41', '2026-07-18 04:44:41', '2026-07-18 04:44:41'),
(3, 4, 'i am homelessman', 'uploads\\claim-1784367306087-391235095.png', 'Pending', '2026-07-18 09:35:06', '2026-07-18 09:35:06', '2026-07-18 09:35:06', '2026-07-18 09:35:06');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_results`
--

CREATE TABLE `quiz_results` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `health_score` int(11) DEFAULT 0,
  `answers` text DEFAULT NULL,
  `completed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_results`
--

INSERT INTO `quiz_results` (`id`, `user_id`, `health_score`, `answers`, `completed_at`) VALUES
(1, 3, 33, '[1,2,1,3,1,1,1,1,1,0]', '2026-07-18 09:40:14'),
(2, 3, 19, '[2,1,2,3,3,1,2,2,1,1]', '2026-07-18 10:57:27');

-- --------------------------------------------------------

--
-- Table structure for table `risk_profiles`
--

CREATE TABLE `risk_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `risk_score` int(11) DEFAULT 0,
  `premium` decimal(10,2) DEFAULT 50.00,
  `age` int(11) DEFAULT NULL,
  `bmi` decimal(5,2) DEFAULT NULL,
  `smoking` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `risk_profiles`
--

INSERT INTO `risk_profiles` (`id`, `user_id`, `risk_score`, `premium`, `age`, `bmi`, `smoking`, `created_at`, `createdAt`, `updatedAt`) VALUES
(1, 1, 25, 87.50, 25, 22.50, 0, '2026-07-18 02:54:12', '2026-07-18 04:37:47', '2026-07-18 04:37:47'),
(2, 2, 0, 50.00, NULL, NULL, 0, '2026-07-18 04:39:46', '2026-07-18 04:39:46', '2026-07-18 04:39:46'),
(3, 3, 0, 50.00, NULL, NULL, 0, '2026-07-18 04:41:54', '2026-07-18 04:41:54', '2026-07-18 04:41:54'),
(4, 3, 75, 162.50, 25, 25.00, 1, '2026-07-18 05:04:40', '2026-07-18 05:04:40', '2026-07-18 05:04:40'),
(5, 4, 0, 50.00, NULL, NULL, 0, '2026-07-18 09:32:29', '2026-07-18 09:32:29', '2026-07-18 09:32:29'),
(6, 4, 75, 162.50, 39, 45.00, 0, '2026-07-18 09:35:51', '2026-07-18 09:35:51', '2026-07-18 09:35:51'),
(7, 3, 100, 200.00, 25, 25.00, 1, '2026-07-18 09:40:14', '2026-07-18 09:40:14', '2026-07-18 09:40:14'),
(8, 5, 0, 50.00, NULL, NULL, 0, '2026-07-18 10:27:21', '2026-07-18 10:27:21', '2026-07-18 10:27:21'),
(9, 3, 100, 200.00, 25, 25.00, 1, '2026-07-18 10:57:27', '2026-07-18 10:57:27', '2026-07-18 10:57:27'),
(10, 3, 75, 162.50, 25, 26.30, 1, '2026-07-18 10:58:29', '2026-07-18 10:58:29', '2026-07-18 10:58:29'),
(11, 6, 0, 50.00, NULL, NULL, 0, '2026-07-18 11:08:20', '2026-07-18 11:08:20', '2026-07-18 11:08:20');

-- --------------------------------------------------------

--
-- Table structure for table `tips`
--

CREATE TABLE `tips` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `upvotes` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tips`
--

INSERT INTO `tips` (`id`, `user_id`, `title`, `content`, `upvotes`, `created_at`, `updated_at`) VALUES
(1, 3, 'why messsi the is the goat', 'goatttt is messi come on he is the best what u talikng about', 0, '2026-07-18 09:38:02', '2026-07-18 09:38:02'),
(2, 3, ',mnknnnnnnnnnnnnnnnnnnn', 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', 0, '2026-07-18 09:38:27', '2026-07-18 09:38:27'),
(3, 3, 'ssssssssssssssssssssss', 'sssssssssssssssssssssssssssssssssssssssss', 0, '2026-07-18 09:46:35', '2026-07-18 09:46:35');

-- --------------------------------------------------------

--
-- Table structure for table `tip_comments`
--

CREATE TABLE `tip_comments` (
  `id` int(11) NOT NULL,
  `tip_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tip_upvotes`
--

CREATE TABLE `tip_upvotes` (
  `id` int(11) NOT NULL,
  `tip_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `bmi` decimal(5,2) DEFAULT NULL,
  `smoking` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `age`, `bmi`, `smoking`, `created_at`, `updated_at`, `createdAt`, `updatedAt`) VALUES
(1, 'testuser', 'test@example.com', 'password123', 25, 22.50, 0, '2026-07-18 02:54:12', '2026-07-18 02:54:12', '2026-07-18 04:37:47', '2026-07-18 04:37:47'),
(2, 'main', 'main@gmm.com', '$2b$10$8mkq1xDN9Sb/..GrlbLDWecLfIMZZlQgJP0ggV/83Fob2nwfKnDeq', NULL, NULL, 0, '2026-07-18 04:39:46', '2026-07-18 04:39:46', '2026-07-18 04:39:46', '2026-07-18 04:39:46'),
(3, 'pppp', 'admin@insurepro.com', '$2b$10$hLgRzq.KyEEoSJSDLmFf3ulahbReazyAhvFgR3UTqCOVWUphDzvKK', 25, 26.30, 1, '2026-07-18 04:41:54', '2026-07-18 10:58:29', '2026-07-18 04:41:54', '2026-07-18 10:58:29'),
(4, 'messi', 'messsi@gmail.com', '$2b$10$RQaQ88p0f43214RW3T5YJOY24avQjjVU0uPwgM0ijGQBYt8GZ2stK', 39, 45.00, 0, '2026-07-18 09:32:29', '2026-07-18 09:35:51', '2026-07-18 09:32:29', '2026-07-18 09:35:51'),
(5, 'yamal', 'gggggggg@gmail.com', '$2b$10$vYQKuLVALOawp.k6eFsxtOHgSHhItNSU7DalO79CJNVbDBya7NhGS', NULL, NULL, 0, '2026-07-18 10:27:21', '2026-07-18 10:27:21', '2026-07-18 10:27:21', '2026-07-18 10:27:21'),
(6, 'pmm', 'pm@gmail.com', '$2b$10$yg6L5Q6vaoQ6ywzjfvNLCO./.0Ct/ap6xEDQkKLSwnlsFfy1DMTrC', NULL, NULL, 0, '2026-07-18 11:08:20', '2026-07-18 11:08:20', '2026-07-18 11:08:19', '2026-07-18 11:08:19');

-- --------------------------------------------------------

--
-- Table structure for table `user_activities`
--

CREATE TABLE `user_activities` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `activity_type` varchar(50) DEFAULT NULL,
  `page` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `badges`
--
ALTER TABLE `badges`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `claims`
--
ALTER TABLE `claims`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `quiz_results`
--
ALTER TABLE `quiz_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `risk_profiles`
--
ALTER TABLE `risk_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tips`
--
ALTER TABLE `tips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tip_comments`
--
ALTER TABLE `tip_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tip_id` (`tip_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tip_upvotes`
--
ALTER TABLE `tip_upvotes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_upvote` (`tip_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_activities`
--
ALTER TABLE `user_activities`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `badges`
--
ALTER TABLE `badges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `claims`
--
ALTER TABLE `claims`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `quiz_results`
--
ALTER TABLE `quiz_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `risk_profiles`
--
ALTER TABLE `risk_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tips`
--
ALTER TABLE `tips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tip_comments`
--
ALTER TABLE `tip_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tip_upvotes`
--
ALTER TABLE `tip_upvotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_activities`
--
ALTER TABLE `user_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `badges`
--
ALTER TABLE `badges`
  ADD CONSTRAINT `badges_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `claims`
--
ALTER TABLE `claims`
  ADD CONSTRAINT `claims_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_results`
--
ALTER TABLE `quiz_results`
  ADD CONSTRAINT `quiz_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `risk_profiles`
--
ALTER TABLE `risk_profiles`
  ADD CONSTRAINT `risk_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tips`
--
ALTER TABLE `tips`
  ADD CONSTRAINT `tips_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tip_comments`
--
ALTER TABLE `tip_comments`
  ADD CONSTRAINT `tip_comments_ibfk_1` FOREIGN KEY (`tip_id`) REFERENCES `tips` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tip_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tip_upvotes`
--
ALTER TABLE `tip_upvotes`
  ADD CONSTRAINT `tip_upvotes_ibfk_1` FOREIGN KEY (`tip_id`) REFERENCES `tips` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tip_upvotes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
