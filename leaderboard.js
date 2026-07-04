const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwJssnwqL636-7t1P2LtspixCWvdm4ffMhQxmAYDB62f4Y2BwvgmxRryl-nbN3Qsu6P/exec";
const languageStorageKey = "apink_language_preference";
const refreshIntervalMs = 10 * 60 * 1000;
const cheerMarqueeIntervalMs = 5 * 1000;

const pageI18n = {
  zh: {
    htmlLang: "zh-Hant",
    title: "Apink 台北大巨蛋排行榜",
    description: "Apink 台北大巨蛋應援打擊小遊戲排行榜，每 10 分鐘自動更新。",
    languageLabel: "語言",
    languageAuto: "自動",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    startGame: "開始遊戲",
    backToGame: "回到遊戲",
    kicker: "Apink 台北大巨蛋應援",
    heading: "排行榜",
    intro: "排行榜每 10 分鐘自動更新一次，顯示目前最高分挑戰紀錄。",
    rank: "排名",
    account: "帳號",
    score: "得分",
    loading: "載入中...",
    empty: "目前尚無排行榜資料。",
    remoteLoaded: "已同步雲端資料",
    localLoaded: "顯示本機暫存資料",
    loadFailed: "暫時無法同步雲端資料",
    updatedAt: "最後更新：{time}",
    nextRefresh: "下次更新：{time}",
    cheerMarqueeTitle: "應援跑馬燈",
    cheerMarqueeEmpty: "目前尚無應援留言，挑戰完後留下第一句吧！",
    cheerMarqueeLine: "{handle}：{message}",
    anonymous: "匿名",
    disclaimer: "📌 本活動為粉絲自發性應援，不進行任何商業販售，並與官方主辦單位無關，若有侵犯權益請告知會立即下架關閉。",
  },
  en: {
    htmlLang: "en",
    title: "Apink Taipei Dome Leaderboard",
    description: "Leaderboard for the Apink Taipei Dome cheer batting game. Automatically refreshes every 10 minutes.",
    languageLabel: "Language",
    languageAuto: "Auto",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    startGame: "Start Game",
    backToGame: "Back to Game",
    kicker: "Apink Taipei Dome Cheer",
    heading: "Leaderboard",
    intro: "The leaderboard refreshes automatically every 10 minutes and shows the current top scores.",
    rank: "Rank",
    account: "Account",
    score: "Score",
    loading: "Loading...",
    empty: "No leaderboard data yet.",
    remoteLoaded: "Cloud data synced",
    localLoaded: "Showing local cached data",
    loadFailed: "Cloud sync is temporarily unavailable",
    updatedAt: "Last updated: {time}",
    nextRefresh: "Next update: {time}",
    cheerMarqueeTitle: "Cheer Ticker",
    cheerMarqueeEmpty: "No cheer messages yet. Leave the first one after your challenge!",
    cheerMarqueeLine: "{handle}: {message}",
    anonymous: "Anonymous",
    disclaimer: "📌 This event is a fan-initiated support project. It does not involve any commercial sales and is not affiliated with the official organizer. If any rights are infringed, please let us know and we will take the site down immediately.",
  },
  ja: {
    htmlLang: "ja",
    title: "Apink 台北ドーム ランキング",
    description: "Apink 台北ドーム応援バッティングゲームのランキングです。10分ごとに自動更新されます。",
    languageLabel: "言語",
    languageAuto: "自動",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    startGame: "ゲーム開始",
    backToGame: "ゲームへ戻る",
    kicker: "Apink 台北ドーム応援",
    heading: "ランキング",
    intro: "ランキングは10分ごとに自動更新され、現在の最高得点記録を表示します。",
    rank: "順位",
    account: "アカウント",
    score: "得点",
    loading: "読み込み中...",
    empty: "ランキングデータはまだありません。",
    remoteLoaded: "クラウドデータを同期しました",
    localLoaded: "ローカル保存データを表示中",
    loadFailed: "現在クラウド同期ができません",
    updatedAt: "最終更新：{time}",
    nextRefresh: "次回更新：{time}",
    cheerMarqueeTitle: "応援メッセージ",
    cheerMarqueeEmpty: "応援メッセージはまだありません。挑戦後に最初の一言を残しましょう！",
    cheerMarqueeLine: "{handle}：{message}",
    anonymous: "匿名",
    disclaimer: "📌 本企画はファンによる自主的な応援活動であり、商業販売は一切行っておらず、公式主催者とは関係ありません。権利侵害がございましたらご連絡ください。直ちに削除・閉鎖いたします。",
  },
  ko: {
    htmlLang: "ko",
    title: "Apink 타이베이 돔 랭킹",
    description: "Apink 타이베이 돔 응원 타격 게임 랭킹입니다. 10분마다 자동 업데이트됩니다.",
    languageLabel: "언어",
    languageAuto: "자동",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    startGame: "게임 시작",
    backToGame: "게임으로 돌아가기",
    kicker: "Apink 타이베이 돔 응원",
    heading: "랭킹",
    intro: "랭킹은 10분마다 자동 업데이트되며 현재 최고 점수 기록을 보여줍니다.",
    rank: "순위",
    account: "계정",
    score: "점수",
    loading: "로딩 중...",
    empty: "아직 랭킹 데이터가 없습니다.",
    remoteLoaded: "클라우드 데이터 동기화 완료",
    localLoaded: "로컬 임시 저장 데이터 표시 중",
    loadFailed: "현재 클라우드 동기화를 할 수 없습니다",
    updatedAt: "마지막 업데이트: {time}",
    nextRefresh: "다음 업데이트: {time}",
    cheerMarqueeTitle: "응원 메시지",
    cheerMarqueeEmpty: "아직 응원 메시지가 없습니다. 도전 후 첫 응원을 남겨 주세요!",
    cheerMarqueeLine: "{handle}: {message}",
    anonymous: "익명",
    disclaimer: "📌 본 이벤트는 팬들이 자발적으로 진행하는 응원 활동이며, 어떠한 상업적 판매도 하지 않고 공식 주최 측과 무관합니다. 권리 침해가 있을 경우 알려주시면 즉시 삭제 및 폐쇄하겠습니다.",
  },
};

const state = {
  locale: "zh",
  languageMode: "auto",
  nextRefreshAt: Date.now() + refreshIntervalMs,
  cheers: [],
  lastCheerIndex: -1,
  refreshTimer: null,
  countdownTimer: null,
  cheerTimer: null,
};

const interpolate = (template, values = {}) =>
  String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

const t = (key, values = {}) => interpolate(pageI18n[state.locale]?.[key] ?? pageI18n.zh[key] ?? key, values);

function maskHandle(handle) {
  const value = String(handle || "").trim();
  if (!value) return "";

  const prefix = value.startsWith("@") ? "@" : "";
  const body = prefix ? value.slice(1) : value;
  const chars = Array.from(body);
  if (!chars.length) return `${prefix}*`;
  if (chars.length === 1) return `${prefix}${chars[0]}*`;

  const maskLength = Math.max(chars.length - 2, 1);
  return `${prefix}${chars[0]}${"*".repeat(maskLength)}${chars[chars.length - 1]}`;
}

function detectBrowserLocale() {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language || ""];
  for (const language of languages) {
    const normalized = language.toLowerCase();
    if (normalized.startsWith("ja")) return "ja";
    if (normalized.startsWith("ko")) return "ko";
    if (normalized.startsWith("en")) return "en";
    if (normalized.startsWith("zh")) return "zh";
  }
  return "zh";
}

function readLanguageMode() {
  let stored = "auto";
  try {
    stored = localStorage.getItem(languageStorageKey);
  } catch (e) { }
  return ["auto", "zh", "en", "ja", "ko"].includes(stored) ? stored : "auto";
}

function writeLanguageMode(mode) {
  state.languageMode = ["auto", "zh", "en", "ja", "ko"].includes(mode) ? mode : "auto";
  try {
    localStorage.setItem(languageStorageKey, state.languageMode);
  } catch (e) { }
}

function setText(selector, key, values = {}) {
  const element = document.querySelector(selector);
  if (element) element.textContent = t(key, values);
}

function applyLocale(mode = readLanguageMode()) {
  state.languageMode = ["auto", "zh", "en", "ja", "ko"].includes(mode) ? mode : "auto";
  state.locale = state.languageMode === "auto" ? detectBrowserLocale() : state.languageMode;
  const copy = pageI18n[state.locale] ?? pageI18n.zh;

  document.documentElement.lang = copy.htmlLang;
  document.title = t("title");
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("description"));

  const select = document.querySelector("#leaderboardLanguageSelect");
  if (select) {
    select.value = state.languageMode;
    select.querySelector('option[value="auto"]').textContent = t("languageAuto");
    select.querySelector('option[value="zh"]').textContent = t("languageZh");
    select.querySelector('option[value="en"]').textContent = t("languageEn");
    select.querySelector('option[value="ja"]').textContent = t("languageJa");
    select.querySelector('option[value="ko"]').textContent = t("languageKo");
  }

  setText("#leaderboardLanguageLabel", "languageLabel");
  setText("#leaderboardStartGameButton", "startGame");
  setText("#backToGameLink", "backToGame");
  setText("#leaderboardPageKicker", "kicker");
  setText("#leaderboardPageTitle", "heading");
  setText("#leaderboardPageIntro", "intro");
  setText("#leaderboardPageRankHeader", "rank");
  setText("#leaderboardPageAccountHeader", "account");
  setText("#leaderboardPageScoreHeader", "score");
  setText("#cheerMarqueeTitle", "cheerMarqueeTitle");
  setText("#leaderboardDisclaimer", "disclaimer");
  if (!state.cheers.length) setText("#cheerMarqueeText", "cheerMarqueeEmpty");
  updateCountdown();
}

function readLocalLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem("apink_leaderboard") || "[]");
  } catch (e) {
    return [];
  }
}

async function fetchRemoteLeaderboard() {
  if (!GOOGLE_SCRIPT_URL) return null;
  const url = `${GOOGLE_SCRIPT_URL}?action=leaderboard&ts=${Date.now()}`;
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-store",
  });
  const data = await response.json();
  return Array.isArray(data?.leaderboard) ? data.leaderboard : null;
}

function readLocalCheers() {
  try {
    return JSON.parse(localStorage.getItem("apink_cheers") || "[]");
  } catch (e) {
    return [];
  }
}

async function fetchRemoteCheers() {
  if (!GOOGLE_SCRIPT_URL) return null;
  const url = `${GOOGLE_SCRIPT_URL}?action=cheers&ts=${Date.now()}`;
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-store",
  });
  const data = await response.json();
  return Array.isArray(data?.cheers) ? data.cheers : null;
}

function normalizeCheers(list) {
  return list
    .filter((item) => item && String(item.message || "").trim())
    .map((item) => ({
      handle: String(item.handle || t("anonymous")).trim() || t("anonymous"),
      message: String(item.message).trim(),
      time: item.time || "",
    }));
}

function renderRandomCheer() {
  const node = document.querySelector("#cheerMarqueeText");
  if (!node) return;

  if (!state.cheers.length) {
    node.textContent = t("cheerMarqueeEmpty");
    return;
  }

  let nextIndex = Math.floor(Math.random() * state.cheers.length);
  if (state.cheers.length > 1 && nextIndex === state.lastCheerIndex) {
    nextIndex = (nextIndex + 1) % state.cheers.length;
  }

  state.lastCheerIndex = nextIndex;
  const cheer = state.cheers[nextIndex];
  node.textContent = t("cheerMarqueeLine", {
    handle: maskHandle(cheer.handle),
    message: cheer.message,
  });
  node.style.animation = "none";
  node.offsetHeight;
  node.style.animation = "";
}

async function loadCheers() {
  let cheers = readLocalCheers();

  try {
    const remote = await fetchRemoteCheers();
    if (remote) {
      cheers = remote;
      try {
        localStorage.setItem("apink_cheers", JSON.stringify(remote));
      } catch (e) { }
    }
  } catch (e) {
    console.warn("Cheer sync failed, using local fallback:", e);
  }

  state.cheers = normalizeCheers(cheers);
  state.lastCheerIndex = -1;
  renderRandomCheer();
}

function rankRows(list) {
  const normalized = list
    .filter((item) => item && item.handle && Number.isFinite(Number(item.score)))
    .map((item) => ({ handle: String(item.handle), score: Number(item.score) }))
    .sort((a, b) => b.score - a.score);

  let currentRank = 1;
  let tieCount = 0;
  let lastScore = null;

  return normalized.map((item) => {
    if (lastScore !== null && item.score < lastScore) {
      currentRank += tieCount;
      tieCount = 1;
    } else {
      tieCount++;
    }
    lastScore = item.score;
    return { ...item, rank: currentRank };
  });
}

function renderLeaderboard(list) {
  const body = document.querySelector("#leaderboardPageBody");
  if (!body) return;

  const rows = rankRows(list);
  body.innerHTML = "";

  if (!rows.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3;
    td.textContent = t("empty");
    tr.appendChild(td);
    body.appendChild(tr);
    return;
  }

  rows.slice(0, 50).forEach((item) => {
    const tr = document.createElement("tr");
    let rankText = String(item.rank);
    if (item.rank === 1) {
      tr.classList.add("top-rank-1");
      rankText = "🥇";
    } else if (item.rank === 2) {
      tr.classList.add("top-rank-2");
      rankText = "🥈";
    } else if (item.rank === 3) {
      tr.classList.add("top-rank-3");
      rankText = "🥉";
    }

    [rankText, maskHandle(item.handle), item.score].forEach((value) => {
      const td = document.createElement("td");
      td.textContent = String(value);
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
}

function formatTime(date) {
  return new Intl.DateTimeFormat(state.locale === "zh" ? "zh-Hant" : state.locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function updateCountdown() {
  const remainingMs = Math.max(0, state.nextRefreshAt - Date.now());
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  setText("#leaderboardNextRefresh", "nextRefresh", { time: `${minutes}:${seconds}` });
}

async function loadLeaderboard() {
  const statusNode = document.querySelector("#leaderboardSourceStatus");
  if (statusNode) statusNode.textContent = t("loading");

  let list = readLocalLeaderboard();
  let sourceKey = list.length ? "localLoaded" : "loadFailed";

  try {
    const remote = await fetchRemoteLeaderboard();
    if (remote) {
      list = remote;
      sourceKey = "remoteLoaded";
      try {
        localStorage.setItem("apink_leaderboard", JSON.stringify(remote));
      } catch (e) { }
    }
  } catch (e) {
    console.warn("Leaderboard sync failed, using local fallback:", e);
  }

  renderLeaderboard(list);
  setText("#leaderboardSourceStatus", sourceKey);
  setText("#leaderboardUpdatedAt", "updatedAt", { time: formatTime(new Date()) });
  state.nextRefreshAt = Date.now() + refreshIntervalMs;
  updateCountdown();
}

async function loadPageData() {
  await Promise.all([loadLeaderboard(), loadCheers()]);
}

function scheduleRefresh() {
  window.clearInterval(state.refreshTimer);
  window.clearInterval(state.countdownTimer);
  window.clearInterval(state.cheerTimer);
  state.refreshTimer = window.setInterval(loadPageData, refreshIntervalMs);
  state.countdownTimer = window.setInterval(updateCountdown, 1000);
  state.cheerTimer = window.setInterval(renderRandomCheer, cheerMarqueeIntervalMs);
}

document.addEventListener("DOMContentLoaded", () => {
  applyLocale();
  document.querySelector("#leaderboardLanguageSelect")?.addEventListener("change", (event) => {
    writeLanguageMode(event.target.value);
    applyLocale(state.languageMode);
    renderRandomCheer();
    loadPageData();
  });
  loadPageData();
  scheduleRefresh();
});
