// This integration is read-only: it never changes, appends or replaces sheet columns.
const PERFORMANCE_API_URL = "https://script.google.com/macros/s/AKfycbzit_JpLpeDvvlZ-e7j_bT9oF7L_3sWcypPmj2_dhg1A1PCAYor5GeV34m9hpPTXV2gvA/exec";
const PERFORMANCE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1WlQd3STRJ_Wmg08KDBp_QTmZ7T0wA3XS0yk2MjMG8oA/edit?gid=0#gid=0";
const performanceLanguageStorageKey = "apink_language_preference";
const performancePageSize = 12;

const performanceCategories = [
  { key: "chorong", sheet: "初瓏" },
  { key: "bomi", sheet: "普美" },
  { key: "eunji", sheet: "恩地" },
  { key: "namjoo", sheet: "南珠" },
  { key: "hayoung", sheet: "夏榮" },
  { key: "group", sheet: "團體" },
  { key: "youtube", sheet: "YT翻拍影片" },
];

const performanceI18n = {
  zh: {
    htmlLang: "zh-Hant",
    title: "開球及賽後表演 | Apink 台北大巨蛋",
    description: "Apink 7/31 台北大巨蛋開球與賽後表演影片整理，依五位成員、團體及 YouTube 翻拍影片分類瀏覽。",
    languageLabel: "語言",
    languageAuto: "自動",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    skipLink: "跳至影片內容",
    home: "回到首頁",
    eyebrow: "FIRST PITCH · POSTGAME PERFORMANCE",
    heading: "開球及<br />賽後表演",
    intro: "從開球瞬間到賽後舞台，收藏五位成員與 Apink 團體的每一個粉色時刻。",
    kicker: "PANDA VIDEO ARCHIVE",
    libraryTitle: "成員與團體影片",
    tabsAria: "影片分類",
    loading: "正在同步 Google Sheet 影片…",
    total: "共 {count} 支影片",
    emptyTitle: "這個分頁還沒有影片",
    emptyCopy: "資料會跟著活動 Google Sheet 更新，稍後再回來看看吧。",
    untitled: "{category}活動紀錄",
    openVideo: "開啟影片",
    openPost: "開啟原始貼文 ↗",
    instagramLoading: "Instagram 貼文載入中…",
    threadsLoading: "Threads 貼文載入中…",
    more: "顯示更多影片",
    footer: "影片資料由活動 Google Sheet 同步整理。",
    sheetLink: "開啟資料表 ↗",
    permissionNotice: '影片資料暫時無法載入，請稍後重新整理。私人 Google Sheet 仍維持非公開。 <a href="{url}" target="_blank" rel="noopener noreferrer">開啟資料表 ↗</a>',
    partialNotice: "部分工作表暫時無法讀取，已先顯示成功同步的影片。",
    tabs: { chorong: "初瓏", bomi: "普美", eunji: "恩地", namjoo: "南珠", hayoung: "夏榮", group: "團體", youtube: "YT 翻拍影片" },
  },
  en: {
    htmlLang: "en",
    title: "First Pitch & Postgame Show | Apink Taipei Dome",
    description: "Videos from Apink's July 31 Taipei Dome first pitch and postgame performance, organized by member, group and YouTube fancams.",
    languageLabel: "Language",
    languageAuto: "Auto",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    skipLink: "Skip to videos",
    home: "Back to Home",
    eyebrow: "FIRST PITCH · POSTGAME PERFORMANCE",
    heading: "First Pitch &<br />Postgame Show",
    intro: "Relive every pink moment—from the ceremonial first pitch to Apink's postgame stage.",
    kicker: "PANDA VIDEO ARCHIVE",
    libraryTitle: "Members & Group Videos",
    tabsAria: "Video categories",
    loading: "Syncing videos from Google Sheets…",
    total: "{count} videos",
    emptyTitle: "No videos in this tab yet",
    emptyCopy: "This archive follows the event Google Sheet. Check back again soon.",
    untitled: "{category} event moment",
    openVideo: "Open video",
    openPost: "Open original post ↗",
    instagramLoading: "Loading Instagram post…",
    threadsLoading: "Loading Threads post…",
    more: "Show More Videos",
    footer: "Video entries are synced from the event Google Sheet.",
    sheetLink: "Open Sheet ↗",
    permissionNotice: 'Video data is temporarily unavailable. Please refresh later. The private Google Sheet remains unpublished. <a href="{url}" target="_blank" rel="noopener noreferrer">Open Sheet ↗</a>',
    partialNotice: "Some sheet tabs could not be read; available videos are shown below.",
    tabs: { chorong: "Chorong", bomi: "Bomi", eunji: "Eunji", namjoo: "Namjoo", hayoung: "Hayoung", group: "Group", youtube: "YT Fancams" },
  },
  ja: {
    htmlLang: "ja",
    title: "始球式＆試合後公演 | Apink 台北ドーム",
    description: "Apinkの7月31日台北ドーム始球式・試合後公演の動画を、メンバー、グループ、YouTubeファンカム別に紹介します。",
    languageLabel: "言語",
    languageAuto: "自動",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    skipLink: "動画一覧へ移動",
    home: "ホームへ戻る",
    eyebrow: "FIRST PITCH · POSTGAME PERFORMANCE",
    heading: "始球式＆<br />試合後公演",
    intro: "始球式の瞬間から試合後のステージまで、5人とApinkのピンク色の思い出を集めました。",
    kicker: "PANDA VIDEO ARCHIVE",
    libraryTitle: "メンバー＆グループ動画",
    tabsAria: "動画カテゴリー",
    loading: "Google スプレッドシートと同期中…",
    total: "動画 {count}本",
    emptyTitle: "このタブにはまだ動画がありません",
    emptyCopy: "イベント用Google スプレッドシートの更新に合わせて追加されます。",
    untitled: "{category} イベント記録",
    openVideo: "動画を開く",
    openPost: "元の投稿を開く ↗",
    instagramLoading: "Instagram投稿を読み込み中…",
    threadsLoading: "Threads投稿を読み込み中…",
    more: "動画をもっと見る",
    footer: "動画データはイベント用Google スプレッドシートから同期しています。",
    sheetLink: "データ表を開く ↗",
    permissionNotice: '動画データを一時的に読み込めません。後でもう一度更新してください。非公開のGoogle スプレッドシートはそのまま維持されます。 <a href="{url}" target="_blank" rel="noopener noreferrer">データ表を開く ↗</a>',
    partialNotice: "一部のシートを読み込めなかったため、同期できた動画を表示しています。",
    tabs: { chorong: "チョロン", bomi: "ボミ", eunji: "ウンジ", namjoo: "ナムジュ", hayoung: "ハヨン", group: "グループ", youtube: "YTファンカム" },
  },
  ko: {
    htmlLang: "ko",
    title: "시구 및 경기 후 공연 | Apink 타이베이 돔",
    description: "Apink의 7월 31일 타이베이 돔 시구와 경기 후 공연 영상을 멤버, 단체, YouTube 팬캠별로 모았습니다.",
    languageLabel: "언어",
    languageAuto: "자동",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    skipLink: "영상 목록으로 이동",
    home: "홈으로 돌아가기",
    eyebrow: "FIRST PITCH · POSTGAME PERFORMANCE",
    heading: "시구 및<br />경기 후 공연",
    intro: "시구의 순간부터 경기 후 무대까지, 다섯 멤버와 Apink의 모든 분홍빛 순간을 모았습니다.",
    kicker: "PANDA VIDEO ARCHIVE",
    libraryTitle: "멤버 및 단체 영상",
    tabsAria: "영상 분류",
    loading: "Google Sheet 영상을 동기화하고 있어요…",
    total: "영상 {count}개",
    emptyTitle: "이 탭에는 아직 영상이 없어요",
    emptyCopy: "이벤트 Google Sheet가 업데이트되면 이곳에도 함께 반영됩니다.",
    untitled: "{category} 이벤트 기록",
    openVideo: "영상 열기",
    openPost: "원본 게시물 열기 ↗",
    instagramLoading: "Instagram 게시물 불러오는 중…",
    threadsLoading: "Threads 게시물 불러오는 중…",
    more: "영상 더 보기",
    footer: "영상 자료는 이벤트 Google Sheet에서 동기화됩니다.",
    sheetLink: "자료표 열기 ↗",
    permissionNotice: '영상 데이터를 일시적으로 불러올 수 없어요. 잠시 후 새로고침해 주세요. 비공개 Google Sheet는 그대로 유지됩니다. <a href="{url}" target="_blank" rel="noopener noreferrer">자료표 열기 ↗</a>',
    partialNotice: "일부 시트를 불러오지 못해 동기화된 영상만 먼저 표시합니다.",
    tabs: { chorong: "초롱", bomi: "보미", eunji: "은지", namjoo: "남주", hayoung: "하영", group: "단체", youtube: "YT 팬캠" },
  },
};

const performanceState = {
  locale: "zh",
  languageMode: "auto",
  activeCategory: "chorong",
  items: [],
  visibleCount: performancePageSize,
  failedRequests: 0,
  loaded: false,
};

const performanceAliases = {
  chorong: ["初瓏", "朴初瓏", "박초롱", "초롱", "chorong"],
  bomi: ["普美", "尹普美", "윤보미", "보미", "bomi"],
  eunji: ["恩地", "鄭恩地", "정은지", "은지", "eunji", "enji"],
  namjoo: ["南珠", "金南珠", "김남주", "남주", "namjoo", "najoo"],
  hayoung: ["夏榮", "吳夏榮", "오하영", "하영", "hayoung"],
  group: ["團體", "全體", "團體照", "에이핑크", "단체", "apink", "group"],
  youtube: ["yt翻拍影片", "yt 翻拍影片", "youtube", "翻拍", "飯拍", "饭拍", "팬캠", "fancam"],
};

const headerAliases = {
  category: ["分類", "类别", "類別", "成員", "成员", "分頁", "sheet", "tab", "category", "member"],
  url: ["影片連結", "影片链接", "影片網址", "網址", "連結", "链接", "url", "link", "video", "video url", "instagram", "threads", "youtube"],
  title: ["標題", "标题", "影片標題", "說明", "说明", "內容", "内容", "備註", "备注", "title", "label", "description", "caption"],
  credit: ["投稿者", "拍攝者", "拍摄者", "作者", "來源", "来源", "帳號", "账号", "credit", "author", "submitted by"],
  date: ["日期", "時間", "时间", "建立時間", "created at", "date", "time"],
};

function performanceInterpolate(template, values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function performanceT(key, values = {}) {
  const source = performanceI18n[performanceState.locale] ?? performanceI18n.zh;
  return performanceInterpolate(source[key] ?? performanceI18n.zh[key] ?? key, values);
}

function detectPerformanceLocale() {
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

function readPerformanceLanguageMode() {
  try {
    const stored = localStorage.getItem(performanceLanguageStorageKey) || "auto";
    return ["auto", "zh", "en", "ja", "ko"].includes(stored) ? stored : "auto";
  } catch (error) {
    return "auto";
  }
}

function writePerformanceLanguageMode(mode) {
  try {
    localStorage.setItem(performanceLanguageStorageKey, mode);
  } catch (error) {
    // Keep the current selection for this visit when storage is unavailable.
  }
}

function setPerformanceText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function applyPerformanceLocale(mode = readPerformanceLanguageMode()) {
  performanceState.languageMode = ["auto", "zh", "en", "ja", "ko"].includes(mode) ? mode : "auto";
  performanceState.locale = performanceState.languageMode === "auto" ? detectPerformanceLocale() : performanceState.languageMode;
  const copy = performanceI18n[performanceState.locale] ?? performanceI18n.zh;

  document.documentElement.lang = copy.htmlLang;
  document.title = copy.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", copy.description);
  setPerformanceText("#performanceSkipLink", copy.skipLink);
  setPerformanceText("#performanceHomeLink", copy.home);
  setPerformanceText("#performanceLanguageLabel", copy.languageLabel);
  setPerformanceText("#performanceEyebrow", copy.eyebrow);
  const title = document.querySelector("#performanceTitle");
  if (title) title.innerHTML = copy.heading;
  setPerformanceText("#performanceIntro", copy.intro);
  setPerformanceText("#performanceKicker", copy.kicker);
  setPerformanceText("#performanceLibraryTitle", copy.libraryTitle);
  document.querySelector("#performanceTabsWrap")?.setAttribute("aria-label", copy.tabsAria);
  setPerformanceText("#performanceLoadingText", copy.loading);
  setPerformanceText("#performanceMore", copy.more);
  setPerformanceText("#performanceFooterCopy", copy.footer);
  setPerformanceText("#performanceSheetLink", copy.sheetLink);

  const select = document.querySelector("#performanceLanguageSelect");
  if (select) {
    select.value = performanceState.languageMode;
    select.querySelector('[value="auto"]').textContent = copy.languageAuto;
    select.querySelector('[value="zh"]').textContent = copy.languageZh;
    select.querySelector('[value="en"]').textContent = copy.languageEn;
    select.querySelector('[value="ja"]').textContent = copy.languageJa;
    select.querySelector('[value="ko"]').textContent = copy.languageKo;
  }

  document.querySelectorAll("[data-tab-label]").forEach((label) => {
    label.textContent = copy.tabs[label.dataset.tabLabel] ?? label.dataset.tabLabel;
  });
  renderPerformance();
  renderPerformanceNotice();
}

function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_\-–—:：/／()（）\[\]【】.。]+/g, "");
}

function findPerformanceField(record, aliases) {
  const accepted = new Set(aliases.map(normalizeHeader));
  const entry = Object.entries(record).find(([key]) => accepted.has(normalizeHeader(key)));
  return entry ? String(entry[1] ?? "").trim() : "";
}

function extractPerformanceUrls(record) {
  const explicit = findPerformanceField(record, headerAliases.url);
  const values = explicit ? [explicit, ...Object.values(record)] : Object.values(record);
  const urls = [];
  values.forEach((value) => {
    const matches = String(value ?? "").match(/https?:\/\/[^\s"'<>]+/gi) || [];
    matches.forEach((url) => urls.push(url.replace(/[),，。；;]+$/g, "")));
  });
  return [...new Set(urls)];
}

function getPerformanceCategory(value) {
  const normalized = normalizeHeader(value);
  if (!normalized) return "";
  for (const [category, aliases] of Object.entries(performanceAliases)) {
    if (aliases.some((alias) => normalized.includes(normalizeHeader(alias)))) return category;
  }
  return "";
}

function getPerformancePlatform(url) {
  const value = String(url).toLowerCase();
  if (value.includes("youtube.com") || value.includes("youtu.be")) return "youtube";
  if (value.includes("instagram.com")) return "instagram";
  if (value.includes("threads.net") || value.includes("threads.com")) return "threads";
  return "other";
}

function normalizePerformanceRows(records, sourceCategory = "") {
  const items = [];
  records.forEach((record, rowIndex) => {
    const urls = extractPerformanceUrls(record);
    if (!urls.length) return;
    const categoryValue = findPerformanceField(record, headerAliases.category);
    const title = findPerformanceField(record, headerAliases.title);
    const credit = findPerformanceField(record, headerAliases.credit);
    const date = findPerformanceField(record, headerAliases.date);

    urls.forEach((url, urlIndex) => {
      const platform = getPerformancePlatform(url);
      const category = getPerformanceCategory(categoryValue) || sourceCategory || (platform === "youtube" ? "youtube" : "group");
      items.push({
        id: `${category}-${rowIndex}-${urlIndex}-${url}`,
        category,
        url,
        platform,
        title,
        credit,
        date,
      });
    });
  });
  return items;
}

async function loadPerformanceData() {
  try {
    const response = await fetch(`${PERFORMANCE_API_URL}?ts=${Date.now()}`, {
      mode: "cors",
      cache: "no-store",
      redirect: "follow",
    });
    if (!response.ok) throw new Error(`Performance API request failed: ${response.status}`);
    const result = await response.json();
    if (!result?.ok || !Array.isArray(result.data)) throw new Error(result?.error || "Invalid performance API response");

    const uniqueByUrl = new Map();
    normalizePerformanceRows(result.data).forEach((item) => uniqueByUrl.set(item.url, item));
    performanceState.items = [...uniqueByUrl.values()];
    performanceState.failedRequests = 0;
  } catch (error) {
    console.error("載入表演影片失敗:", error);
    performanceState.items = [];
    performanceState.failedRequests = 1;
  } finally {
    performanceState.loaded = true;
    updatePerformanceCounts();
    renderPerformance();
    renderPerformanceNotice();
  }
}

function updatePerformanceCounts() {
  performanceCategories.forEach(({ key }) => {
    const count = performanceState.items.filter((item) => item.category === key).length;
    setPerformanceText(`[data-tab-count="${key}"]`, String(count));
  });
  setPerformanceText("#performanceTotal", performanceT("total", { count: performanceState.items.length }));
}

function extractYouTubeId(url) {
  const match = String(url).match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : "";
}

function performancePlatformLabel(platform) {
  if (platform === "youtube") return "YouTube";
  if (platform === "instagram") return "Instagram";
  if (platform === "threads") return "Threads";
  return "VIDEO LINK";
}

function cleanPerformanceUrl(url, platform = "") {
  try {
    const parsed = new URL(String(url).trim());
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    parsed.search = '';
    parsed.hash = '';
    if (platform === "threads") parsed.pathname = parsed.pathname.replace(/\/media\/?$/i, "");
    return parsed.toString();
  } catch (error) {
    return '';
  }
}

function createPerformanceMedia(item) {
  const media = document.createElement("div");
  media.className = "performance-card-media";
  media.dataset.platform = item.platform;
  const videoId = item.platform === "youtube" ? extractYouTubeId(item.url) : "";
  if (videoId) {
    const image = document.createElement("img");
    image.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    image.alt = "";
    image.loading = "lazy";
    media.append(image);
    const play = document.createElement("span");
    play.className = "performance-play";
    play.textContent = "▶";
    play.setAttribute("aria-hidden", "true");
    media.append(play);
  } else {
    const art = document.createElement("span");
    art.className = "performance-platform-art";
    art.textContent = item.platform === "instagram" ? "◎" : item.platform === "threads" ? "＠" : "↗";
    art.setAttribute("aria-hidden", "true");
    media.append(art);
  }
  return media;
}

function createPerformanceCardBody(item, categoryLabel, includeOpenLink = false) {
  const body = document.createElement("div");
  body.className = "performance-card-body";
  const meta = document.createElement("div");
  meta.className = "performance-card-meta";
  const platform = document.createElement("span");
  platform.className = "performance-card-platform";
  platform.textContent = performancePlatformLabel(item.platform);
  const date = document.createElement("span");
  date.textContent = item.date || "07 · 31";
  meta.append(platform, date);

  const title = document.createElement("h3");
  title.className = "performance-card-title";
  title.textContent = item.title || performanceT("untitled", { category: categoryLabel });
  body.append(meta, title);
  if (item.credit) {
    const credit = document.createElement("p");
    credit.className = "performance-card-credit";
    credit.textContent = item.credit.startsWith("@") ? item.credit : `@${item.credit}`;
    body.append(credit);
  }
  if (includeOpenLink) {
    const openLink = document.createElement("a");
    openLink.className = "performance-card-open";
    openLink.href = item.url;
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.textContent = performanceT("openPost");
    body.append(openLink);
  }
  return body;
}

function createPerformanceEmbed(item) {
  const cleanUrl = cleanPerformanceUrl(item.url, item.platform);
  if (!cleanUrl) return createPerformanceMedia(item);

  const shell = document.createElement("div");
  shell.className = `performance-embed-shell performance-embed-shell--${item.platform}`;
  shell.setAttribute("aria-busy", "true");

  const frame = document.createElement("iframe");
  frame.className = "performance-embed-frame";
  frame.src = `./embed_proxy.html?type=${encodeURIComponent(item.platform)}&url=${encodeURIComponent(cleanUrl)}`;
  frame.title = `${performancePlatformLabel(item.platform)}：${item.title || performanceT("openVideo")}`;
  frame.loading = "lazy";
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  frame.setAttribute("allow", "autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write");
  frame.setAttribute("allowfullscreen", "");
  frame.setAttribute("scrolling", item.platform === "threads" ? "auto" : "no");

  const placeholder = document.createElement("div");
  placeholder.className = "performance-embed-placeholder";
  placeholder.setAttribute("aria-hidden", "true");
  const spinner = document.createElement("span");
  spinner.className = "performance-embed-spinner";
  const label = document.createElement("span");
  label.textContent = performanceT(item.platform === "threads" ? "threadsLoading" : "instagramLoading");
  placeholder.append(spinner, label);

  shell.append(frame, placeholder);
  return shell;
}

function isPerformanceSocialEmbed(item) {
  return item.platform === "instagram" || item.platform === "threads";
}

function createPerformanceCard(item) {
  const categoryLabel = performanceI18n[performanceState.locale].tabs[item.category] ?? performanceI18n.zh.tabs[item.category];
  const card = document.createElement("article");
  card.className = "performance-card";

  if (isPerformanceSocialEmbed(item)) {
    card.classList.add("performance-card--embed");
    card.append(createPerformanceEmbed(item), createPerformanceCardBody(item, categoryLabel, true));
    return card;
  }

  const link = document.createElement("a");
  link.className = "performance-card-link";
  link.href = item.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `${performanceT("openVideo")}：${item.title || categoryLabel}`);
  link.append(createPerformanceMedia(item));

  link.append(createPerformanceCardBody(item, categoryLabel));
  card.append(link);
  return card;
}

function initPerformanceEmbedResizeListener() {
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    const data = event.data;
    if (data?.type !== "performance-embed-resize") return;
    const requestedHeight = Number(data.height);
    if (!Number.isFinite(requestedHeight) || requestedHeight <= 0) return;

    document.querySelectorAll(".performance-embed-frame").forEach((frame) => {
      if (frame.contentWindow !== event.source) return;
      const height = Math.min(Math.max(Math.ceil(requestedHeight), 180), 1600);
      frame.style.height = `${height}px`;
      if (!data.ready) return;
      frame.classList.add("is-ready");
      const shell = frame.closest(".performance-embed-shell");
      shell?.setAttribute("aria-busy", "false");
      shell?.querySelector(".performance-embed-placeholder")?.remove();
    });
  });
}

function renderPerformance() {
  const grid = document.querySelector("#performanceGrid");
  if (!grid) return;
  grid.replaceChildren();
  if (!performanceState.loaded) {
    const loading = document.createElement("div");
    loading.className = "performance-loading";
    const spinner = document.createElement("span");
    spinner.className = "performance-spinner";
    spinner.setAttribute("aria-hidden", "true");
    const copy = document.createElement("p");
    copy.textContent = performanceT("loading");
    loading.append(spinner, copy);
    grid.append(loading);
    return;
  }
  const items = performanceState.items.filter((item) => item.category === performanceState.activeCategory);
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "performance-empty";
    const icon = document.createElement("span");
    icon.className = "performance-platform-art";
    icon.textContent = "✦";
    icon.setAttribute("aria-hidden", "true");
    const title = document.createElement("strong");
    title.textContent = performanceT("emptyTitle");
    const copy = document.createElement("p");
    copy.textContent = performanceT("emptyCopy");
    empty.append(icon, title, copy);
    grid.append(empty);
  } else {
    items.slice(0, performanceState.visibleCount).forEach((item) => grid.append(createPerformanceCard(item)));
  }
  const more = document.querySelector("#performanceMore");
  if (more) more.hidden = performanceState.visibleCount >= items.length;
}

function renderPerformanceNotice() {
  const notice = document.querySelector("#performanceNotice");
  if (!notice) return;
  if (!performanceState.items.length && performanceState.failedRequests) {
    notice.hidden = false;
    notice.innerHTML = performanceT("permissionNotice", { url: PERFORMANCE_SHEET_URL });
  } else if (performanceState.items.length && performanceState.failedRequests) {
    notice.hidden = false;
    notice.textContent = performanceT("partialNotice");
  } else {
    notice.hidden = true;
    notice.replaceChildren();
  }
}

function selectPerformanceCategory(category) {
  if (!performanceCategories.some((item) => item.key === category)) return;
  performanceState.activeCategory = category;
  performanceState.visibleCount = performancePageSize;
  document.querySelectorAll(".performance-tab").forEach((tab) => {
    const active = tab.dataset.category === category;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    if (active) tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  });
  renderPerformance();
  document.querySelector("#performanceGrid")?.focus({ preventScroll: true });
}

document.addEventListener("DOMContentLoaded", () => {
  initPerformanceEmbedResizeListener();
  applyPerformanceLocale();
  document.querySelector("#performanceLanguageSelect")?.addEventListener("change", (event) => {
    writePerformanceLanguageMode(event.target.value);
    applyPerformanceLocale(event.target.value);
    updatePerformanceCounts();
  });
  document.querySelector("#performanceTabs")?.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-category]");
    if (tab) selectPerformanceCategory(tab.dataset.category);
  });
  document.querySelector("#performanceMore")?.addEventListener("click", () => {
    performanceState.visibleCount += performancePageSize;
    renderPerformance();
  });
  loadPerformanceData();
});
