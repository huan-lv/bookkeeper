-- 先创建 User 表
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 插入一个默认用户（给现有 Transaction 数据用）
INSERT INTO `User` (`username`, `password`) VALUES ('default_user', 'change_me_123');

-- 先添加可为空的 userId 列
ALTER TABLE `Transaction` ADD COLUMN `userId` INTEGER NULL;

-- 给现有数据设置 userId = 1
UPDATE `Transaction` SET `userId` = 1 WHERE `userId` IS NULL;

-- 改为 NOT NULL
ALTER TABLE `Transaction` MODIFY COLUMN `userId` INTEGER NOT NULL;

-- 添加外键
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;