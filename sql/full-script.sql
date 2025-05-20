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

-- Insert data
INSERT INTO `User` VALUES ('02a40eac-403e-4a52-9d7d-86775c3f7971','admin@gmail.com','admin','$2b$10$hak4cRxKDrIv8D.w.VIEMOgfdgMcEFbZ4V9f37Axm1ravfNhxtSWO','https://cdn-icons-png.flaticon.com/512/9119/9119069.png','ADMIN', NOW(), NOW()),('452df947-aac1-4c31-a19e-91ee6b58c6dd','moderator@gmail.com','moderator','$2b$10$0.6i/kn1R0BpE7nPPLhDjO7ugiKyBRmWsZsoeN4dQOJRGHQY1T60i','https://static.vecteezy.com/system/resources/thumbnails/002/002/257/small_2x/beautiful-woman-avatar-character-icon-free-vector.jpg','MODERATOR', NOW(), NOW()),('ef3f160d-d825-4c21-91ae-5efc535a1b35','client@gmail.com','client','$2b$10$mtsm/igdEx.QIiZSRkRiTeztTT3TSpKYKYyOIHpXLCxcmOxxz/S.e','https://i.pinimg.com/236x/23/8b/94/238b94f1abcae25882f6cfbbcc1fe1d6.jpg','CLIENT', NOW(), NOW());

INSERT INTO `Quiz` VALUES ('35bc8482-e4a9-48d4-b397-a8bb4dd0f58a','Kubernetes','Bài trắc nghiệm kiểm tra hiểu biết chuyên sâu về Kubernetes và quản lý container','[\"Cloud Native\"]','https://res.cloudinary.com/tinhaws/image/upload/v1747492842/blog-list/kubernetes.jpg'),('73c9879d-d8bd-4f0d-9d28-4f2f27842e3a','Linux','Bài trắc nghiệm nhằm kiểm tra kiến thức cơ bản về hệ điều hành Linux','[\"Virtualization\",\"LPIC-1\"]','https://res.cloudinary.com/tinhaws/image/upload/v1747493367/blog-list/linux.jpg'),('d574e0e3-b9f2-454b-b25e-e3029bed883c','Docker','Bài trắc nghiệm kiểm tra kiến thức về Docker cho lập trình viên và DevOps','[\"DevOps\",\"Container\"]','https://res.cloudinary.com/tinhaws/image/upload/v1747493366/blog-list/docker.jpg');

INSERT INTO `QuizQuestion` VALUES ('01747f16-c489-4623-a168-e81628bd42df','Lệnh `man` dùng để làm gì?','[\"Chạy chương trình\",\"Hiển thị tài liệu hướng dẫn\",\"Quản lý người dùng\",\"Cập nhật hệ thống\"]',1,'73c9879d-d8bd-4f0d-9d28-4f2f27842e3a'),('0d8eac7d-e319-401a-880d-4fb90fd407f1','Điều gì xảy ra nếu bạn xóa một container nhưng không xóa volume được gắn kèm?','[\"Volume bị xóa cùng container\",\"Volume vẫn còn trên hệ thống\",\"Docker xóa tự động sau 24h\",\"Volume sẽ bị lỗi\"]',1,'d574e0e3-b9f2-454b-b25e-e3029bed883c'),('104cbe2e-26d5-40b3-9a67-4b96c70be948','Controller nào trong Kubernetes chịu trách nhiệm duy trì số lượng bản sao của pod?','[\"Deployment\",\"ReplicaSet\",\"StatefulSet\",\"DaemonSet\"]',1,'35bc8482-e4a9-48d4-b397-a8bb4dd0f58a'),('14c6c330-3cae-4127-a6e0-a9482a621517','Khi nào nên dùng StatefulSet thay vì Deployment?','[\"Khi pod không yêu cầu lưu trữ\",\"Khi pod yêu cầu danh tính ổn định và lưu trữ ổn định\",\"Khi triển khai cron job\",\"Khi dùng volume ephemeral\"]',1,'35bc8482-e4a9-48d4-b397-a8bb4dd0f58a'),('15c123a5-25af-4b52-b10b-acecfda60c0e','Lệnh nào dùng để liệt kê các tệp và thư mục trong Linux?','[\"ls\",\"cd\",\"pwd\",\"rm\"]',0,'73c9879d-d8bd-4f0d-9d28-4f2f27842e3a'),('2496ef12-22ce-4bb7-8861-ce367118d137','Kubernetes sử dụng công cụ nào để thực hiện network policy theo mặc định?','[\"Calico\",\"Weave\",\"Flannel\",\"Không có sẵn – phụ thuộc vào CNI plugin\"]',3,'35bc8482-e4a9-48d4-b397-a8bb4dd0f58a'),('2e4a7be6-48ef-4f85-b44a-bbc5e330de5e','Lệnh nào được dùng để hiển thị nội dung của một tệp?','[\"cat\",\"touch\",\"mkdir\",\"grep\"]',0,'73c9879d-d8bd-4f0d-9d28-4f2f27842e3a'),('306765b1-5f68-4d61-af35-7c7452490112','Docker sử dụng công nghệ nào để cô lập container?','[\"Virtual Machines\",\"Hyper-V\",\"Namespaces và Cgroups\",\"Kernel Modules\"]',2,'d574e0e3-b9f2-454b-b25e-e3029bed883c'),('44d99eb2-b919-41e5-8751-632e1e821d69','Lệnh `docker network create` dùng để?','[\"Tạo một ổ đĩa ảo\",\"Tạo một vùng bộ nhớ cache\",\"Tạo mạng tùy chỉnh cho container\",\"Tạo file cấu hình mạng\"]',2,'d574e0e3-b9f2-454b-b25e-e3029bed883c'),('46a3f358-0e06-475e-af69-cc219db42f1a','Tệp cấu hình của người dùng thường nằm trong thư mục nào?','[\"/etc\",\"/home\",\"/usr\",\"/bin\"]',1,'73c9879d-d8bd-4f0d-9d28-4f2f27842e3a'),('52a9a8da-e967-475d-b7f2-0dc6881b50e1','Tệp `docker-compose.yml` được dùng để làm gì?','[\"Tự động deploy image lên Docker Hub\",\"Định nghĩa và quản lý nhiều container cùng lúc\",\"Ghi log container\",\"Chạy các command shell bên trong container\"]',1,'d574e0e3-b9f2-454b-b25e-e3029bed883c'),('5b7fedc9-56bf-478b-a3bb-47cf789a7d7d','Lệnh nào dùng để gán tên (tag) cho một image đã tạo?','[\"docker tag\",\"docker name\",\"docker label\",\"docker assign\"]',0,'d574e0e3-b9f2-454b-b25e-e3029bed883c'),('6a59c501-11b3-401c-9b10-ea3a3cd88230','Lệnh nào dùng để thay đổi quyền truy cập tệp trong Linux?','[\"chmod\",\"chown\",\"passwd\",\"ls\"]',0,'73c9879d-d8bd-4f0d-9d28-4f2f27842e3a'),('80973fcf-f416-4002-961b-76dac4445d4f','Lệnh nào được dùng để xây dựng một Docker image từ Dockerfile?','[\"docker run\",\"docker create\",\"docker build\",\"docker start\"]',2,'d574e0e3-b9f2-454b-b25e-e3029bed883c'),('87b90a00-fe5b-466a-a442-c5a35fb3c08b','PersistentVolume (PV) và PersistentVolumeClaim (PVC) dùng để làm gì?','[\"Tạo tài nguyên CPU\",\"Quản lý bản ghi log\",\"Quản lý lưu trữ lâu dài\",\"Tạo dịch vụ mạng nội bộ\"]',2,'35bc8482-e4a9-48d4-b397-a8bb4dd0f58a'),('9095230e-457f-4954-b48f-be6b401fc3dc','Lệnh nào dùng để kiểm tra trạng thái của các resource trong cụm Kubernetes?','[\"kubectl get\",\"kubectl status\",\"kubectl inspect\",\"kubectl view\"]',0,'35bc8482-e4a9-48d4-b397-a8bb4dd0f58a'),('9b51b3ad-03de-485b-b89c-675474e72d36','Đâu là tên của một trình quản lý gói phổ biến trên Ubuntu?','[\"yum\",\"pacman\",\"apt\",\"rpm\"]',2,'73c9879d-d8bd-4f0d-9d28-4f2f27842e3a'),('a8d4bca0-0160-4d57-867a-2f5c3f817cb4','Lệnh `pwd` có chức năng gì?','[\"Xoá thư mục\",\"Hiển thị đường dẫn hiện tại\",\"Đổi thư mục\",\"Hiển thị dung lượng đĩa\"]',1,'73c9879d-d8bd-4f0d-9d28-4f2f27842e3a'),('aa8c2a71-e682-4683-b3e0-a29f45c1d85f','Đâu là mục đích của livenessProbe trong Pod definition?','[\"Kiểm tra trạng thái mạng\",\"Khởi tạo pod\",\"Xác định pod còn hoạt động hay không\",\"Giới hạn tài nguyên CPU\"]',2,'35bc8482-e4a9-48d4-b397-a8bb4dd0f58a'),('afdf7621-c0e8-47a1-9f86-bf2962f4869c','Lệnh `grep` dùng để làm gì?','[\"Sao chép tệp\",\"Tìm kiếm chuỗi văn bản\",\"Chuyển thư mục\",\"Hiển thị tiến trình\"]',1,'73c9879d-d8bd-4f0d-9d28-4f2f27842e3a'),('b21f78ca-1b93-4aeb-a86c-4537a779025e','Làm thế nào để triển khai một pod chỉ trên một node cụ thể?','[\"Dùng labelSelector\",\"Dùng taints và tolerations\",\"Dùng resource limits\",\"Dùng NetworkPolicy\"]',1,'35bc8482-e4a9-48d4-b397-a8bb4dd0f58a'),('b4f172b2-683c-4a75-98a0-08568ac8e4af','Namespace trong Kubernetes dùng để làm gì?','[\"Quản lý log\",\"Tạo mạng nội bộ\",\"Cô lập tài nguyên và phân vùng theo nhóm người dùng\",\"Tăng tốc độ scale container\"]',2,'35bc8482-e4a9-48d4-b397-a8bb4dd0f58a'),('b8db9ec6-eb1b-4490-9358-5a9851cb0ec6','Lệnh `docker exec` có chức năng gì?','[\"Tạo container mới\",\"Chạy lệnh bên trong container đang chạy\",\"Khởi động container\",\"Tạo image từ container\"]',1,'d574e0e3-b9f2-454b-b25e-e3029bed883c'),('bad54ea6-d321-442f-8ce8-a289e2fd68f1','Lệnh `rm -rf /` trong Linux có tác dụng gì?','[\"Khởi động lại máy\",\"Xoá mọi thứ trên hệ thống\",\"Sao lưu hệ thống\",\"Không có tác dụng gì\"]',1,'73c9879d-d8bd-4f0d-9d28-4f2f27842e3a'),('cd3aebe2-0c1b-463c-8038-b610888b0f2f','Để cập nhật một container đang chạy, bạn cần thực hiện thao tác nào sau đây?','[\"Chạy lại container với image mới\",\"Dùng lệnh docker update live\",\"Chỉnh sửa trực tiếp container\",\"Sửa image và chạy lệnh docker edit\"]',0,'d574e0e3-b9f2-454b-b25e-e3029bed883c'),('d3d7b023-ef70-4488-8260-3bb5c51327a7','Trong Linux, người dùng `root` có quyền gì?','[\"Giới hạn\",\"Tương tự người dùng bình thường\",\"Toàn quyền\",\"Không có quyền gì đặc biệt\"]',2,'73c9879d-d8bd-4f0d-9d28-4f2f27842e3a'),('d40ae4ed-232b-4a5c-9d30-4abfb3b0d2a3','Tài nguyên nào dùng để xác định chính sách truy cập vào pod qua HTTP(S)?','[\"Service\",\"Ingress\",\"Endpoint\",\"NetworkPolicy\"]',1,'35bc8482-e4a9-48d4-b397-a8bb4dd0f58a'),('d477cb10-eb5d-41f7-ba37-9adc432f310e','Khi một pod bị crash liên tục, đâu là lựa chọn cấu hình phù hợp để tự động khởi động lại pod?','[\"lifecycle\",\"restartPolicy\",\"initContainer\",\"readinessProbe\"]',1,'35bc8482-e4a9-48d4-b397-a8bb4dd0f58a'),('d734752a-cc29-4c87-906d-421c1ff619d8','Tệp nào được Docker sử dụng để định nghĩa cách tạo ra image?','[\"Dockerfile\",\"docker-compose.yml\",\"build.yaml\",\"image.json\"]',0,'d574e0e3-b9f2-454b-b25e-e3029bed883c'),('f50ae87a-4893-4fff-90d7-79ccebfb7c04','Lệnh `docker volume` dùng để làm gì?','[\"Tạo mạng giữa các container\",\"Tạo ổ đĩa lưu trữ ngoài\",\"Gắn kết cổng mạng\",\"Theo dõi log container\"]',1,'d574e0e3-b9f2-454b-b25e-e3029bed883c');