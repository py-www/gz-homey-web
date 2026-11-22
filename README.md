# GZ HOMEY Web

GZ HOMEY 氛圍居家選物電商 — 前端（六角學院 前後端整合主題電商專題）

- 線上網站：https://gz-homey-web.vercel.app
- 後端 API：https://gz-homey-api.onrender.com/api （Repo：`gz-homey-api`）
- API 文件：https://gz-homey-api.onrender.com/api-docs

> 後端在 Render 免費方案，閒置後第一次開啟可能需要 30–60 秒喚醒，畫面會顯示載入中。

## 主題
給 25–35 歲、租屋或剛成家的人：一間已經挑好的小型居家選物店（香氛蠟燭、燈具、織品、擺飾），用小預算佈置有質感的房間。

## 使用技術
- Vite + Vue 3（Composition API，`<script setup>`）
- Vue Router、axios
- Bootstrap 5（RWD、Offcanvas 購物車）
- 部署：Vercel

## 功能
- 首頁：Hero、分類入口、精選系列、店長推薦、新品、會員區（商品與分類資料來自後端）
- 商品列表：分類篩選、關鍵字搜尋、分頁；載入中 / 查無結果 / API 錯誤提示
- 商品詳情：加入購物車（未登入會提示並導向登入，登入後回原頁）
- 會員：註冊、登入、重新整理保持登入（token 存 localStorage + `/auth/me`）、登出
- 購物車（Offcanvas）：增減數量、移除，全部與後端同步，加入時有 Toast 提示
- 主題：預設暖色系；網址加 `?theme=default` 可切回黑白版

## 測試帳號
| 身分 | Email | 密碼 |
|---|---|---|
| 一般會員 | `user@gzhomey.test` | `User1234` |
| 管理員（只有 API，用 Swagger 測） | `admin@gzhomey.test` | `Admin1234` |

## 本機啟動
```bash
npm install
cp .env.example .env   # 設定 VITE_API_BASE
npm run dev            # http://localhost:5173
```
後端需同時啟動（見 `gz-homey-api` README）。

## 環境變數
| 名稱 | 說明 | 範例 |
|---|---|---|
| `VITE_API_BASE` | 後端 API 網址（結尾 `/api`） | `http://localhost:3000/api` |

## 圖片來源
商品照、首頁與登入頁情境照來自 [Unsplash](https://unsplash.com)（Unsplash License，可免費商用）；首頁部分情境照經由 picsum.photos 取用 Unsplash 照片。本站為專題作品，照片僅作示意，不代表實際商品。
