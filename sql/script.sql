-- 1. Tạo bảng User trước
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `picture` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `role` enum('ADMIN','MODERATOR','CLIENT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CLIENT',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Quiz
DROP TABLE IF EXISTS `Quiz`;
CREATE TABLE `Quiz` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `tags` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. QuizPlay
DROP TABLE IF EXISTS `QuizPlay`;
CREATE TABLE `QuizPlay` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quizId` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `playedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `correctQuestionsNumber` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `QuizPlay_userId_fkey` (`userId`),
  KEY `QuizPlay_quizId_fkey` (`quizId`),
  CONSTRAINT `QuizPlay_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz` (`id`) ON DELETE CASCADE,
  CONSTRAINT `QuizPlay_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. QuizQuestion
DROP TABLE IF EXISTS `QuizQuestion`;
CREATE TABLE `QuizQuestion` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `answerIndex` int NOT NULL,
  `quizId` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `QuizQuestion_quizId_fkey` (`quizId`),
  CONSTRAINT `QuizQuestion_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. RefreshToken
DROP TABLE IF EXISTS `RefreshToken`;
CREATE TABLE `RefreshToken` (
  `token` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`token`),
  KEY `RefreshToken_userId_fkey` (`userId`),
  CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `User` VALUES ('02a40eac-403e-4a52-9d7d-86775c3f7971','admin@gmail.com','admin','$2b$10$hak4cRxKDrIv8D.w.VIEMOgfdgMcEFbZ4V9f37Axm1ravfNhxtSWO','https://cdn-icons-png.flaticon.com/512/9119/9119069.png','ADMIN', NOW(), NOW()),('452df947-aac1-4c31-a19e-91ee6b58c6dd','moderator@gmail.com','moderator','$2b$10$0.6i/kn1R0BpE7nPPLhDjO7ugiKyBRmWsZsoeN4dQOJRGHQY1T60i','https://static.vecteezy.com/system/resources/thumbnails/002/002/257/small_2x/beautiful-woman-avatar-character-icon-free-vector.jpg','MODERATOR', NOW(), NOW()),('ef3f160d-d825-4c21-91ae-5efc535a1b35','client@gmail.com','client','$2b$10$mtsm/igdEx.QIiZSRkRiTeztTT3TSpKYKYyOIHpXLCxcmOxxz/S.e','https://i.pinimg.com/236x/23/8b/94/238b94f1abcae25882f6cfbbcc1fe1d6.jpg','CLIENT', NOW(), NOW());