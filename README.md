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
- 支援繁體中文、英文、日文、韓文，並可依瀏覽器語言自動選取。
- 所有實際載入的角色逐格動畫與球場背景已轉為 WebP，減少下載量。

## 檔案結構

- `index.html`：首頁與遊戲主畫面。
- `leaderboard.html`：獨立排行榜頁面。
- `styles.css`：全站樣式、響應式版面與遊戲場景。
- `app.js`：遊戲邏輯、多語系、排行榜提交與應援留言提交。
- `leaderboard.js`：排行榜頁資料同步、跑馬燈與多語系。
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

### 釣魚遊戲(fish.html)的獨立排行榜

釣魚遊戲與棒球遊戲共用同一個 Apps Script 端點,但資料完全分開;釣魚又分「初級版 `fish`」與「高級版 `fish_pro`」兩個獨立排行榜:

- 送出分數/祝福時 POST body 多帶 `game: "fish"` 或 `game: "fish_pro"` 欄位(棒球的請求沒有此欄位,維持相容)。
- 讀取時使用 `?action=fish_leaderboard` / `?action=fish_cheers`(初級)與 `?action=fish_pro_leaderboard` / `?action=fish_pro_cheers`(高級)。

**Apps Script 需要對應更新**(在現有 doGet/doPost 中加入,fish 資料建議寫到獨立的 `FishScores` / `FishCheers` 工作表):

**重要:回應必須帶 `game: "fish"` 回聲欄位**。因為舊版後端會忽略未知的 action 直接回棒球資料,前端只有在回應含 `game: "fish"` 時才會採信釣魚資料,否則自動 fallback 到 localStorage,避免兩個遊戲的資料互相污染。

```js
// doPost 內,解析 body 之後:
const data = JSON.parse(e.postData.contents);
const sheetsByGame = {
  fish: { scores: "FishScores", cheers: "FishCheers" },
  fish_pro: { scores: "FishProScores", cheers: "FishProCheers" },
};
const gameSheets = sheetsByGame[data.game]; // 沒有 game 欄位 = 棒球,照舊
const scoreSheet = ss.getSheetByName(gameSheets ? gameSheets.scores : "Scores");
const cheerSheet = ss.getSheetByName(gameSheets ? gameSheets.cheers : "Cheers");
// 之後照原本邏輯:有 message 寫 cheerSheet,否則寫 scoreSheet。
// 回傳時 fish/fish_pro 的回應要帶 game 欄位:
// return jsonOutput({ game: data.game, leaderboard: readScores(scoreSheet) });

// doGet 內,新增四個 action(注意都要帶對應的 game 欄位):
if (e.parameter.action === "fish_leaderboard") {
  return jsonOutput({ game: "fish", leaderboard: readScores(ss.getSheetByName("FishScores")) });
}
if (e.parameter.action === "fish_cheers") {
  return jsonOutput({ game: "fish", cheers: readCheers(ss.getSheetByName("FishCheers")) });
}
if (e.parameter.action === "fish_pro_leaderboard") {
  return jsonOutput({ game: "fish_pro", leaderboard: readScores(ss.getSheetByName("FishProScores")) });
}
if (e.parameter.action === "fish_pro_cheers") {
  return jsonOutput({ game: "fish_pro", cheers: readCheers(ss.getSheetByName("FishProCheers")) });
}
```

後端尚未更新前:讀取會自動 fallback 到 `localStorage`(`apink_fish_leaderboard` / `apink_fish_cheers`),頁面不會壞;但**送出的釣魚分數會被舊後端寫進棒球的分數表**,所以建議「先更新 Apps Script、再上線釣魚頁」。

## 素材最佳化

目前網站實際載入素材已改用 WebP：

- 原始 PNG 載入體積約 8.1 MB。
- WebP 載入體積約 3.1 MB。
- 角色逐格動畫仍以同樣檔名序列載入，只將副檔名改為 `.webp`。

## 聲明

本活動為粉絲自發性應援，不進行任何商業販售，並與官方主辦單位無關，若有侵犯權益請告知會立即下架關閉。
