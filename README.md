# Apink Taipei Dome 2026

Apink 前進臺北大巨蛋粉絲自發性應援網站。網站包含活動宣傳文宣、棒球打擊小遊戲、排行榜頁面與應援留言跑馬燈，設計給粉絲在 2026/07/31 新光亞洲音樂祭與味全龍主場活動前後互動使用。

## 專案內容

- 首頁活動宣傳文宣，包含售票連結與粉絲應援說明。
- Enji 藍色熊打者對戰 Bomi 熊投手的一局進攻打擊小遊戲。
- 遊戲結束後可提交 IG 或 Threads 帳號、分數與應援留言。
- 遊戲內排行榜彈窗與獨立排行榜頁面。
- 排行榜頁每 10 分鐘自動更新一次。
- 排行榜頁上方應援跑馬燈每 5 秒隨機顯示一則留言。
- 使用者帳號顯示會遮罩，只保留頭尾字元，中間以星號取代。
- 新增 Canvas「明太魚快手捕獲戰」，支援單指滑動捕魚、連擊與破網扣分。
- 支援繁體中文、英文、日文、韓文，並可依瀏覽器語言自動選取。
- 所有實際載入的角色逐格動畫與球場背景已轉為 WebP，減少下載量。

## 檔案結構

- `index.html`：首頁與遊戲主畫面。
- `leaderboard.html`：獨立排行榜頁面。
- `styles.css`：全站樣式、響應式版面與遊戲場景。
- `app.js`：遊戲邏輯、多語系、排行榜提交與應援留言提交。
- `leaderboard.js`：排行榜頁資料同步、跑馬燈與多語系。
- `fish-swipe.html` / `fish-swipe.js` / `fish-swipe.css`：快手明太魚遊戲頁、遊戲邏輯與樣式。
- `bg.webp`：球場背景。
- `assets/*_frames/*.webp`：投手、打者與應援角色逐格動畫素材。

## 本機預覽

這是純靜態網站，不需要建置流程。可在專案根目錄執行：

```bash
python3 -m http.server 5174
```

然後開啟：

```text
http://127.0.0.1:5174/index.html
```

## 資料同步

排行榜與應援留言會優先同步到 `app.js` 與 `leaderboard.js` 內設定的 Google Apps Script Web App；若雲端暫時無法連線，會使用瀏覽器 `localStorage` 作為本機暫存 fallback。

### 釣魚遊戲的獨立排行榜

釣魚遊戲與棒球遊戲共用同一個 Apps Script 端點，但資料完全分開；釣魚包含「初級版 `fish`」、「高級版 `fish_pro`」與「快手版 `fish_swipe`」三個獨立排行榜：

- 送出分數／祝福時，POST body 會帶 `game: "fish"`、`game: "fish_pro"` 或 `game: "fish_swipe"`（棒球請求維持相容）。
- 初級讀取使用 `fish_leaderboard` / `fish_cheers`，高級使用 `fish_pro_leaderboard` / `fish_pro_cheers`，快手版使用 `fish_swipe_leaderboard` / `fish_swipe_cheers`。

完整 Apps Script 程式位於 [`google-apps-script.gs`](./google-apps-script.gs)。將 Apps Script 專案中的程式完整替換後重新部署 Web App；程式會自動建立並分流到以下工作表：

- 棒球：`Leaderboard` / `Cheers`
- 釣魚初級：`FishScores` / `FishCheers`
- 釣魚高級：`FishProScores` / `FishProCheers`
- 快手明太魚：`FishSwipeScores` / `FishSwipeCheers`

釣魚 API 回應會帶對應的 `game` 回聲欄位，讓前端確認資料來源，避免採信舊版後端誤回的棒球資料。

快手版在送出前會先確認後端已支援 `fish_swipe`；尚未更新時會使用 `localStorage` fallback，不會把分數誤寫進棒球資料表。正式上線仍建議先更新 Apps Script。

## 素材最佳化

目前網站實際載入素材已改用 WebP：

- 原始 PNG 載入體積約 8.1 MB。
- WebP 載入體積約 3.1 MB。
- 角色逐格動畫仍以同樣檔名序列載入，只將副檔名改為 `.webp`。

## 聲明

本活動為粉絲自發性應援，不進行任何商業販售，並與官方主辦單位無關，若有侵犯權益請告知會立即下架關閉。
