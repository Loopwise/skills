# Prompt：讓學員在 Loopwise Page 上評價課程

填入三個值後，把整段貼給你的 agent。
[English](course-reviews.md)

```text
請在我的 Loopwise 網站上做一個 Loopwise Page，讓已登入、已購買課程的學員可以在這個頁面替課程留下評價（星等＋文字）。

網站網域：<例如 academy.example.com>
頁面路徑：<例如 /reviews>
課程 slug：<例如 my-course>

## 1. 安裝 Loopwise 工具（只做一次）

- 你是 Claude Code：執行
    claude plugin marketplace add Loopwise/skills
    claude plugin install loopwise@loopwise
  然後請我重新啟動，在 /mcp 選 loopwise → Authenticate，由我在瀏覽器完成登入。
- 其他 agent（Cursor、Codex 等）：執行  npx skills add Loopwise/skills
  需要 MCP 時，連到 https://mcp.loopwise.com（根網址，不是 /mcp）。
- 部署用的 CLI：npm install -g loopwise@latest（0.3.0 或更新），
  loopwise auth login（由我登入），最後 loopwise doctor --json 確認。

裝好後請閱讀 loopwise-sdk（頁面程式碼）與 loopwise-cli（部署）兩個 skill，並以它們為準。無法安裝 skill 時，照下面的規則做。

## 2. 頁面程式碼的規則

- 使用 @loopwise/sdk 並鎖定 0.1.0-beta.5（或更新）。不加版本會裝到沒有學員功能的舊版。
  單一 HTML 檔：
    import { createClient, LoopwiseError } from 'https://cdn.jsdelivr.net/npm/@loopwise/sdk@0.1.0-beta.5/dist/index.mjs'
  有打包工具的專案：npm install @loopwise/sdk@0.1.0-beta.5
- createClient({}) 不帶參數。頁面必須部署在我網站網域下的路徑；
  *.loopwise.page 預覽網址沒有學員登入狀態，會回 AUTH_REQUIRED，不要用它驗收。
- 頁面 HTML 會被 CDN 快取：學員狀態只能在瀏覽器載入後用
  loopwise.courses.reviewState({ slug }) 取得，依 status 顯示：
  ratings_off（隱藏評價區）、signed_out（連到回傳的 loginUrl）、not_purchased（購買提示）、
  can_review（空白表單）、reviewed（預填原本的評價並提供刪除）。
- 送出用 loopwise.reviews.submit({ courseId, score, comment })：
  分數只能 0.5～5、間隔 0.5；comment 每次都要送（空字串＝清空）；
  只在使用者按下送出時呼叫，送出中停用按鈕（每次送出都會寄信給網站管理者）；
  送出或刪除（loopwise.reviews.delete({ courseId, reviewId: state.review.id })）後重新呼叫 reviewState。
- 錯誤一律是 LoopwiseError，依 e.code 處理：NOT_SIGNED_IN → 導向 loginUrl；
  NOT_PURCHASED → 購買提示；RATINGS_OFF → 隱藏評價區；INVALID_SCORE → 提示分數錯誤。
- 不要自己拼 GraphQL、不要讀寫 cookie 或 token、學員相關的呼叫不要傳 cache 選項。

## 3. 部署

loopwise pages create <slug> --page-type static_page --path-prefix <頁面路徑>
loopwise pages push <目錄> --page <slug>
每個會改動網站的指令都先加 --dry-run --json 給我看，等我確認再正式執行。

## 4. 在我的網站網域上逐項驗收並回報

1. 未登入開啟頁面：顯示登入連結，登入後回到本頁。
2. 以已購買課程的學員登入：送出評價後重新整理，仍顯示剛才的分數與文字。
3. 修改評價（例如清空文字）後內容正確更新；刪除後回到空白表單。
4. 若有未開放評價或未購買的課程，分別顯示對應的狀態。
```
