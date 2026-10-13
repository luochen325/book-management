-- ============================================
-- 图书管理系统 - 数据库初始化脚本
-- 库名: book_db
-- ============================================

CREATE DATABASE IF NOT EXISTS book_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE book_db;

-- ============================================
-- 1. 图书类型表
-- ============================================
DROP TABLE IF EXISTS book_info;
DROP TABLE IF EXISTS book_type;

CREATE TABLE book_type (
  id INT PRIMARY KEY AUTO_INCREMENT,
  typeName VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 初始数据：8 条类型
INSERT INTO book_type (typeName) VALUES
  ('小说'),
  ('文学'),
  ('传记'),
  ('艺术'),
  ('少儿'),
  ('经济'),
  ('管理'),
  ('科技');

-- ============================================
-- 2. 图书信息表
-- ============================================
CREATE TABLE book_info (
  bookId INT PRIMARY KEY AUTO_INCREMENT,
  bookCde VARCHAR(50) NOT NULL,
  bookName VARCHAR(100) NOT NULL,
  bookType INT NOT NULL,
  bookAuthor VARCHAR(100),
  publishPress VARCHAR(100),
  publishDate DATE,
  borrowed TINYINT DEFAULT 0,
  createdBy VARCHAR(50) DEFAULT 'admin',
  creationTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  lastUpdatetime DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bookType) REFERENCES book_type(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 初始测试数据：5 条图书
INSERT INTO book_info (bookCde, bookName, bookType, bookAuthor, publishPress, publishDate, borrowed, createdBy, creationTime, lastUpdatetime) VALUES
  ('ISBN-001', '红楼梦',              2, '曹雪芹',   '人民文学出版社', '1996-12-01', 0, 'admin', NOW(), NOW()),
  ('ISBN-002', '活着',                 1, '余华',     '作家出版社',     '2012-08-01', 1, 'admin', NOW(), NOW()),
  ('ISBN-003', '史蒂夫·乔布斯传',       3, '艾萨克森', '中信出版社',     '2011-10-24', 0, 'admin', NOW(), NOW()),
  ('ISBN-004', '小王子',               5, '圣埃克苏佩里', '人民文学出版社', '2003-08-01', 0, 'admin', NOW(), NOW()),
  ('ISBN-005', '经济学原理',            6, '曼昆',     '北京大学出版社', '2015-01-01', 1, 'admin', NOW(), NOW());