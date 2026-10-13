# 📚 图书管理系统

基于 **Node.js + Express + MySQL + jQuery** 的图书借阅系统后台管理。

## 功能

1. 查看所有图书（分页、隔行变色）
2. 按图书名称模糊查询（查询条件记忆）
3. 查看图书详情（只读）
4. 新增图书（必填校验、默认值）
5. 修改图书（入库人/入库时间只读）
6. 删除图书（确认弹窗）

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Node.js + Express |
| 前端 | HTML/CSS/JS + jQuery 1.8.3 |
| 数据库 | MySQL (mysql2 连接池) |
| 测试 | Mocha + Chai + chai-http |
| CI | GitHub Actions |

## 本地运行

### 1. 初始化数据库

```bash
mysql -u root -p < sql/book_db.sql
```

### 2. 修改数据库连接配置（可选）

编辑 `backend/config/db.js` 或设置环境变量：

| 环境变量 | 默认值 |
|----------|--------|
| `DB_HOST` | localhost |
| `DB_USER` | root |
| `DB_PASSWORD` | root |
| `DB_NAME` | book_db |

### 3. 安装依赖并启动

```bash
cd backend
npm install
npm start
```

访问 `http://localhost:3000`

### 4. 运行回归测试

```bash
cd backend
npm test
```

## GitHub 托管

- 仓库地址请自行推送至个人 GitHub
- CI 配置见 `.github/workflows/regression.yml`
  - push / PR 到 `main` 分支时自动触发
  - 自动启动 MySQL 容器 → 初始化数据库 → 运行接口回归测试

## 项目结构

```
book-management/
├── backend/
│   ├── server.js                # Express 入口
│   ├── config/db.js             # MySQL 连接池
│   ├── routes/books.js          # 图书路由
│   ├── routes/types.js          # 类型路由
│   ├── controllers/books.js     # 控制器
│   ├── services/books.js        # 业务层
│   ├── dao/booksDao.js          # 数据访问层
│   ├── tests/regression.test.js # 接口回归测试
│   └── package.json
├── frontend/public/
│   ├── index.html               # 列表页
│   ├── detail.html              # 详情页
│   ├── add.html                 # 新增页
│   ├── edit.html                # 修改页
│   ├── css/style.css            # 样式
│   └── js/*.js                  # 页面脚本
├── sql/book_db.sql              # 数据库初始化脚本
├── .github/workflows/regression.yml
├── .gitignore
└── README.md
```