const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwJssnwqL636-7t1P2LtspixCWvdm4ffMhQxmAYDB62f4Y2BwvgmxRryl-nbN3Qsu6P/exec";
const LANGUAGE_STORAGE_KEY = "apink_language_preference";
const ANGLER_ROTATION_STORAGE_KEY = "apink_fish_swipe_angler_rotation_v1";
const GAME_KEY = "fish_swipe";
const GAME_DURATION_S = 45;
const SAME_COLOR_BONUS = 3;
const HAZARD_PENALTY = 10;
const COMBO_THREE_BONUS = 3;
const COMBO_FIVE_BONUS = 8;
const FIVE_COLOR_COMBO_BONUS = 100;
const FISH_MEMBERS = ["rong", "bomi", "enji", "najoo", "hayoung"];
const MEMBER_COLORS = {
  rong: "#ef6d96",
  bomi: "#a986d9",
  enji: "#699ee8",
  najoo: "#e6a3d8",
  hayoung: "#f5a45d",
};
const fishImage = (member) => `./assets/fish/${member}_fish.webp`;
const anglerImage = (member) => `./assets/fish/${member}_boat.webp?v=20260718-2`;

const swipeI18n = {
  zh: {
    htmlLang: "zh-Hant",
    title: "明太魚快手捕獲戰",
    description: "揮動手刀捕獲五色幸運明太魚，小心不要劃到扣分物品！",
    languageLabel: "語言",
    languageAuto: "自動",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    backToFishing: "回到釣魚遊戲",
    leaderboardLink: "排行榜",
    navLabel: "遊戲導覽",
    kicker: "Apink 15 週年應援",
    heading: "明太魚快手捕獲戰",
    intro: "用手刀劃過飛起來的五色明太魚，把滿滿幸運送給 Panda！",
    timerLabel: "剩餘時間",
    caughtLabel: "捕獲",
    scoreLabel: "分數",
    comboLabel: "最佳一刀",
    canvasLabel: "滑動捕獲明太魚的遊戲區",
    startTitle: "明太魚快手捕獲戰",
    startBadge: "45 秒快手挑戰",
    rule1: "按住並滑動畫面，用手刀軌跡捕獲飛起來的明太魚。只接受單指操作。",
    rule2: "一般魚 +1、幸運同色魚額外 +3；同一刀捕獲五種不同顏色的魚，五色連擊直接 +100！",
    rule3: "小心深色的破網！劃到會扣 10 分並中斷連擊。",
    loading: "載入中...",
    startButton: "開始捕魚",
    anglerBadge: "本局幸運色：{name} +3",
    anglerAlt: "{name} Ping Doongs 為本局幸運色代表",
    go: "GO!",
    sameColorPop: "幸運同色 +3！",
    comboPop: "一刀 {count} 隻！連擊 +{bonus}",
    fiveColorComboPop: "🌈 五色全捕獲！+100",
    penaltyPop: "劃到破網！-10",
    endTitle: "時間到！",
    endScore: "總分 {score} 分",
    endCaughtLabel: "捕獲數",
    endComboLabel: "最佳一刀",
    handlePlaceholder: "輸入 IG 或 Threads 帳號",
    submitScore: "結算成績",
    playAgain: "再玩一次",
    leaderboardTitle: "快手明太魚 排行榜",
    myRank: "我的排名：{rank}",
    myScore: "我的分數",
    scoreUnit: "{score} 分",
    cheerTemplatesLabel: "快速祝福語",
    cheerPlaceholder: "留下 15 週年祝福...",
    cheerSubmit: "送出祝福",
    sending: "傳送中...",
    noticeHandleRequired: "請輸入 IG 或 Threads 帳號！",
    noticeScoreSubmitted: "成績已送出！",
    noticeCheerRequired: "請輸入祝福的話！",
    noticeCheerSubmitted: "祝福送出成功！謝謝你的應援！",
    anonymous: "匿名",
    member_rong: "Chorong",
    member_bomi: "Bomi",
    member_enji: "Eunji",
    member_najoo: "Namjoo",
    member_hayoung: "Hayoung",
    cheerTemplates: [
      "Apink 15 週年快樂，永遠一起走下去！💖",
      "快手抓住五色明太魚，把幸運送給 Panda！🐟",
      "願 Apink 和 Panda 每天都有滿滿好運！🍀",
      "五色明太魚守護 Apink 閃閃發光！✨",
      "Panda 永遠支持 Apink，15 週年粗卡！🐼",
      "願每位成員健康平安、天天開心！🌸",
      "Apink 的歌聲是 Panda 最幸福的禮物！🎶",
      "一起迎接更多個充滿愛的週年吧！🎉",
      "幸運明太魚把所有好事都送給 Apink！🐟",
      "Apink 與 Panda 的故事永遠不會結束！♾️",
    ],
    disclaimer: "📌 本活動為粉絲自發性應援，不進行任何商業販售，並與官方主辦單位無關，若有侵犯權益請告知會立即下架關閉。",
  },
  en: {
    htmlLang: "en",
    title: "Lucky Myeongtae Swipe Catch",
    description: "Swipe to catch five colorful lucky myeongtae, but avoid the broken nets!",
    languageLabel: "Language",
    languageAuto: "Auto",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    backToFishing: "Back to Fishing",
    leaderboardLink: "Leaderboard",
    navLabel: "Game navigation",
    kicker: "Apink 15th Anniversary Cheer",
    heading: "Lucky Myeongtae Swipe Catch",
    intro: "Swipe across the five colorful flying myeongtae and send a net full of luck to Pandas!",
    timerLabel: "Time Left",
    caughtLabel: "Caught",
    scoreLabel: "Score",
    comboLabel: "Best Swipe",
    canvasLabel: "Swipe game area for catching flying myeongtae",
    startTitle: "Lucky Myeongtae Swipe Catch",
    startBadge: "45-second challenge",
    rule1: "Press and swipe across the screen to catch flying myeongtae. Only one finger counts.",
    rule2: "Regular fish +1, lucky same-color fish +3 extra. Catch all five different colors in one swipe for a +100 rainbow combo!",
    rule3: "Avoid the dark broken nets! Hitting one costs 10 points and cancels the combo.",
    loading: "Loading...",
    startButton: "Start Catching",
    anglerBadge: "Lucky color: {name} +3",
    anglerAlt: "{name} Ping Doongs represents this round's lucky color",
    go: "GO!",
    sameColorPop: "Lucky color +3!",
    comboPop: "{count} in one swipe! Combo +{bonus}",
    fiveColorComboPop: "🌈 All five colors! +100",
    penaltyPop: "Broken net! -10",
    endTitle: "Time's Up!",
    endScore: "Total score: {score}",
    endCaughtLabel: "Caught",
    endComboLabel: "Best Swipe",
    handlePlaceholder: "Enter IG or Threads handle",
    submitScore: "Submit Score",
    playAgain: "Play Again",
    leaderboardTitle: "Swipe Myeongtae Leaderboard",
    myRank: "My rank: {rank}",
    myScore: "My score",
    scoreUnit: "{score} pts",
    cheerTemplatesLabel: "Quick blessing messages",
    cheerPlaceholder: "Leave a 15th-anniversary blessing...",
    cheerSubmit: "Send Blessing",
    sending: "Sending...",
    noticeHandleRequired: "Please enter an IG or Threads handle!",
    noticeScoreSubmitted: "Score submitted!",
    noticeCheerRequired: "Please write a blessing!",
    noticeCheerSubmitted: "Blessing sent — thank you!",
    anonymous: "Anonymous",
    member_rong: "Chorong",
    member_bomi: "Bomi",
    member_enji: "Eunji",
    member_najoo: "Namjoo",
    member_hayoung: "Hayoung",
    cheerTemplates: [
      "Happy 15th anniversary, Apink—let's stay together forever! 💖",
      "Catch all five colors and send Pandas lots of luck! 🐟",
      "May Apink and Pandas have good luck every day! 🍀",
      "Five lucky myeongtae will keep Apink shining bright! ✨",
      "Pandas will always support Apink. Happy 15th! 🐼",
      "Wishing every member health, peace, and happiness! 🌸",
      "Apink's voices are the happiest gift for Pandas! 🎶",
      "Let's celebrate many more loving anniversaries together! 🎉",
      "May the lucky myeongtae bring every good thing to Apink! 🐟",
      "The story of Apink and Pandas will never end! ♾️",
    ],
    disclaimer: "📌 This event is a fan-initiated support project. It does not involve commercial sales and is not affiliated with the official organizer. Please let us know about any rights concerns and we will take it down immediately.",
  },
  ja: {
    htmlLang: "ja",
    title: "ミョンテ早取りチャレンジ",
    description: "5色の幸運ミョンテをスワイプで捕まえよう。壊れた網には要注意！",
    languageLabel: "言語",
    languageAuto: "自動",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    backToFishing: "釣りゲームへ戻る",
    leaderboardLink: "ランキング",
    navLabel: "ゲームナビゲーション",
    kicker: "Apink 15周年応援",
    heading: "ミョンテ早取りチャレンジ",
    intro: "飛び出す5色のミョンテを手刀で捕まえて、Panda に幸運を届けよう！",
    timerLabel: "残り時間",
    caughtLabel: "捕獲",
    scoreLabel: "スコア",
    comboLabel: "ベスト一振り",
    canvasLabel: "スワイプで飛ぶミョンテを捕まえるゲームエリア",
    startTitle: "ミョンテ早取りチャレンジ",
    startBadge: "45秒チャレンジ",
    rule1: "画面を押したままスワイプして、飛び出すミョンテを捕まえよう。1本指だけが有効です。",
    rule2: "通常魚は+1、幸運の同色魚はさらに+3。1回で5色すべてを捕まえるとレインボーコンボ +100！",
    rule3: "暗い壊れた網に注意！触れると10点減点され、コンボも途切れます。",
    loading: "読み込み中...",
    startButton: "ゲーム開始",
    anglerBadge: "今回の幸運色：{name} +3",
    anglerAlt: "今回の幸運色を担当する {name} Ping Doongs",
    go: "スタート！",
    sameColorPop: "幸運の同色 +3！",
    comboPop: "一振りで{count}匹！コンボ +{bonus}",
    fiveColorComboPop: "🌈 5色コンプリート！+100",
    penaltyPop: "壊れた網！-10",
    endTitle: "タイムアップ！",
    endScore: "合計スコア：{score}点",
    endCaughtLabel: "捕獲数",
    endComboLabel: "ベスト一振り",
    handlePlaceholder: "IG または Threads のアカウントを入力",
    submitScore: "スコア送信",
    playAgain: "もう一度遊ぶ",
    leaderboardTitle: "早取りミョンテ ランキング",
    myRank: "自分の順位：{rank}",
    myScore: "自分の得点",
    scoreUnit: "{score}点",
    cheerTemplatesLabel: "かんたんお祝いメッセージ",
    cheerPlaceholder: "15周年のお祝いメッセージを...",
    cheerSubmit: "メッセージ送信",
    sending: "送信中...",
    noticeHandleRequired: "IG または Threads のアカウントを入力してください！",
    noticeScoreSubmitted: "スコアを送信しました！",
    noticeCheerRequired: "お祝いメッセージを入力してください！",
    noticeCheerSubmitted: "メッセージを送信しました。ありがとう！",
    anonymous: "匿名",
    member_rong: "チョロン",
    member_bomi: "ボミ",
    member_enji: "ウンジ",
    member_najoo: "ナムジュ",
    member_hayoung: "ハヨン",
    cheerTemplates: [
      "Apink 15周年おめでとう、これからもずっと一緒！💖",
      "5色のミョンテを捕まえて Panda に幸運を届けよう！🐟",
      "Apink と Panda に毎日たくさんの幸運がありますように！🍀",
      "5匹の幸運ミョンテが輝く Apink を守ります！✨",
      "Panda は永遠に Apink を応援！15周年おめでとう！🐼",
      "メンバーみんなが健康で、毎日笑顔で過ごせますように！🌸",
      "Apink の歌声は Panda にとって最高に幸せな贈り物！🎶",
      "愛いっぱいの周年をこれからも一緒に迎えよう！🎉",
      "幸運ミョンテがすべての幸せを Apink に届けますように！🐟",
      "Apink と Panda の物語は永遠に終わらない！♾️",
    ],
    disclaimer: "📌 本企画はファンによる自主的な応援活動であり、商業販売は行わず、公式主催者とは関係ありません。権利に関する問題がございましたら、直ちに削除・閉鎖いたします。",
  },
  ko: {
    htmlLang: "ko",
    title: "명태 빠른 손 캐치",
    description: "다섯 색 행운 명태를 스와이프로 잡고 망가진 그물은 피하세요!",
    languageLabel: "언어",
    languageAuto: "자동",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    backToFishing: "낚시 게임으로 돌아가기",
    leaderboardLink: "랭킹",
    navLabel: "게임 탐색",
    kicker: "Apink 15주년 응원",
    heading: "명태 빠른 손 캐치",
    intro: "날아오르는 다섯 색 명태를 손날로 잡아 Panda에게 행운을 보내요!",
    timerLabel: "남은 시간",
    caughtLabel: "잡은 수",
    scoreLabel: "점수",
    comboLabel: "최고 한 번",
    canvasLabel: "스와이프로 날아오르는 명태를 잡는 게임 영역",
    startTitle: "명태 빠른 손 캐치",
    startBadge: "45초 빠른 손 도전",
    rule1: "화면을 누른 채 움직여 날아오르는 명태를 잡으세요. 한 손가락만 인정돼요.",
    rule2: "일반 명태 +1, 행운의 같은 색 명태는 추가 +3. 한 번에 서로 다른 다섯 색을 모두 잡으면 레인보우 콤보 +100!",
    rule3: "어두운 망가진 그물을 조심하세요! 닿으면 10점이 깎이고 콤보가 끊겨요.",
    loading: "로딩 중...",
    startButton: "게임 시작",
    anglerBadge: "이번 행운 색: {name} +3",
    anglerAlt: "이번 행운 색을 대표하는 {name} Ping Doongs",
    go: "시작!",
    sameColorPop: "행운의 같은 색 +3!",
    comboPop: "한 번에 {count}마리! 콤보 +{bonus}",
    fiveColorComboPop: "🌈 다섯 색 모두 잡기! +100",
    penaltyPop: "망가진 그물! -10",
    endTitle: "시간 종료!",
    endScore: "총점: {score}점",
    endCaughtLabel: "잡은 수",
    endComboLabel: "최고 한 번",
    handlePlaceholder: "IG 또는 Threads 계정 입력",
    submitScore: "점수 제출",
    playAgain: "다시 하기",
    leaderboardTitle: "빠른 손 명태 랭킹",
    myRank: "내 순위: {rank}",
    myScore: "내 점수",
    scoreUnit: "{score}점",
    cheerTemplatesLabel: "빠른 축하 메시지",
    cheerPlaceholder: "15주년 축하 메시지를 남겨 주세요...",
    cheerSubmit: "축하 보내기",
    sending: "전송 중...",
    noticeHandleRequired: "IG 또는 Threads 계정을 입력해 주세요!",
    noticeScoreSubmitted: "점수를 제출했어요!",
    noticeCheerRequired: "축하 메시지를 입력해 주세요!",
    noticeCheerSubmitted: "축하 메시지를 보냈어요. 고마워요!",
    anonymous: "익명",
    member_rong: "초롱",
    member_bomi: "보미",
    member_enji: "은지",
    member_najoo: "남주",
    member_hayoung: "하영",
    cheerTemplates: [
      "Apink 15주년 축하해요, 앞으로도 영원히 함께해요! 💖",
      "다섯 색 명태를 잡아 Panda에게 행운을 보내요! 🐟",
      "Apink와 Panda에게 매일 행운이 가득하길! 🍀",
      "다섯 마리 행운 명태가 빛나는 Apink를 지켜 줄게요! ✨",
      "Panda는 영원히 Apink를 응원해요. 15주년 축하해요! 🐼",
      "모든 멤버가 건강하고 매일 행복하길 바라요! 🌸",
      "Apink의 노래는 Panda에게 가장 행복한 선물이에요! 🎶",
      "사랑 가득한 기념일을 앞으로도 함께 맞이해요! 🎉",
      "행운 명태가 모든 좋은 일을 Apink에게 전해 주길! 🐟",
      "Apink와 Panda의 이야기는 영원히 끝나지 않아요! ♾️",
    ],
    disclaimer: "📌 본 이벤트는 팬들의 자발적인 응원 활동이며 상업 판매를 하지 않고 공식 주최 측과 무관합니다. 권리 문제가 있을 경우 즉시 삭제 및 폐쇄하겠습니다.",
  },
};

const interpolate = (template, values = {}) =>
  String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

function maskHandle(handle) {
  const value = String(handle || "").trim();
  if (!value) return "";
  const prefix = value.startsWith("@") ? "@" : "";
  const body = prefix ? value.slice(1) : value;
  const chars = Array.from(body);
  if (!chars.length) return `${prefix}*`;
  if (chars.length === 1) return `${prefix}${chars[0]}*`;
  return `${prefix}${chars[0]}${"*".repeat(Math.max(chars.length - 2, 1))}${chars.at(-1)}`;
}

class SwipeFishGame {
  constructor() {
    this.canvas = document.querySelector("#swipeCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.arena = document.querySelector("#swipeArena");
    this.startOverlay = document.querySelector("#swipeStartOverlay");
    this.endOverlay = document.querySelector("#swipeEndOverlay");
    this.leaderboardOverlay = document.querySelector("#swipeLeaderboardOverlay");
    this.startButton = document.querySelector("#swipeStartButton");
    this.anglerNode = document.querySelector("#swipeAngler");
    this.anglerImageNode = document.querySelector("#swipeAnglerImage");
    this.anglerBadgeNode = document.querySelector("#swipeAnglerBadge");
    this.countdownNode = document.querySelector("#swipeCountdown");
    this.popNode = document.querySelector("#swipePop");
    this.timerNode = document.querySelector("#swipeTimer");
    this.caughtNode = document.querySelector("#swipeCaught");
    this.scoreNode = document.querySelector("#swipeScore");
    this.comboNode = document.querySelector("#swipeCombo");
    this.noticeToast = document.querySelector("#swipeNoticeToast");
    this.noticeToastText = document.querySelector("#swipeNoticeToastText");

    this.phase = "ready";
    this.locale = "zh";
    this.languageMode = "auto";
    this.assetsReady = false;
    this.images = {};
    this.width = 1;
    this.height = 1;
    this.dpr = 1;
    this.score = 0;
    this.caught = 0;
    this.bestCombo = 0;
    this.entities = [];
    this.particles = [];
    this.floaters = [];
    this.trail = [];
    this.activePointerId = null;
    this.strokeFishHits = 0;
    this.strokeHitHazard = false;
    this.strokeMembers = new Set();
    this.anglerMember = FISH_MEMBERS[0];
    this.anglerOrder = [];
    this.nextAnglerIndex = 0;
    this.restoreAnglerRotation();
    this.countdownEndAt = 0;
    this.gameStartAt = 0;
    this.nextSpawnAt = 0;
    this.lastFrameAt = 0;
    this.lastCountdownNumber = null;
    this.lastDisplayedSecond = GAME_DURATION_S;
    this.hiddenAt = null;
    this.frameId = null;
    this.popTimeoutId = null;
    this.noticeTimeoutId = null;
    this.lastCatchToneAt = 0;
    this.scoreSubmitted = false;
    this.lastSubmittedHandle = "";
    this.backendSupport = null;
    this.audioContext = null;
    this.audioUnlocked = false;
    this.audioSessionEl = null;
  }

  t(key, values = {}) {
    const value = swipeI18n[this.locale]?.[key] ?? swipeI18n.zh[key] ?? key;
    if (Array.isArray(value)) return value;
    return interpolate(value, values);
  }

  detectBrowserLocale() {
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

  readLanguageMode() {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (["auto", "zh", "en", "ja", "ko"].includes(stored)) return stored;
    } catch (e) { }
    return "auto";
  }

  setText(selector, key, values = {}) {
    const node = document.querySelector(selector);
    if (node) node.textContent = this.t(key, values);
  }

  applyLocale(mode = this.readLanguageMode()) {
    this.languageMode = ["auto", "zh", "en", "ja", "ko"].includes(mode) ? mode : "auto";
    this.locale = this.languageMode === "auto" ? this.detectBrowserLocale() : this.languageMode;
    document.documentElement.lang = swipeI18n[this.locale]?.htmlLang || "zh-Hant";
    document.title = this.t("title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", this.t("description"));

    const select = document.querySelector("#swipeLanguageSelect");
    if (select) {
      select.value = this.languageMode;
      select.querySelector('option[value="auto"]').textContent = this.t("languageAuto");
      select.querySelector('option[value="zh"]').textContent = this.t("languageZh");
      select.querySelector('option[value="en"]').textContent = this.t("languageEn");
      select.querySelector('option[value="ja"]').textContent = this.t("languageJa");
      select.querySelector('option[value="ko"]').textContent = this.t("languageKo");
    }

    [
      ["#swipeLanguageLabel", "languageLabel"],
      ["#swipeBackToFishing", "backToFishing"],
      ["#swipeLeaderboardLink", "leaderboardLink"],
      ["#swipeKicker", "kicker"],
      ["#swipeTitle", "heading"],
      ["#swipeIntro", "intro"],
      ["#swipeTimerLabel", "timerLabel"],
      ["#swipeCaughtLabel", "caughtLabel"],
      ["#swipeScoreLabel", "scoreLabel"],
      ["#swipeComboLabel", "comboLabel"],
      ["#swipeStartTitle", "startTitle"],
      ["#swipeStartBadge", "startBadge"],
      ["#swipeRule1", "rule1"],
      ["#swipeRule2", "rule2"],
      ["#swipeRule3", "rule3"],
      ["#swipeEndTitle", "endTitle"],
      ["#swipeEndCaughtLabel", "endCaughtLabel"],
      ["#swipeEndComboLabel", "endComboLabel"],
      ["#swipeSubmitScoreButton", "submitScore"],
      ["#swipePlayAgainButton", "playAgain"],
      ["#swipeLeaderboardTitle", "leaderboardTitle"],
      ["#swipeCheerSubmitButton", "cheerSubmit"],
      ["#swipeDisclaimer", "disclaimer"],
    ].forEach(([selector, key]) => this.setText(selector, key));

    this.startButton.textContent = this.assetsReady ? this.t("startButton") : this.t("loading");
    this.canvas.setAttribute("aria-label", this.t("canvasLabel"));
    document.querySelector(".swipe-nav")?.setAttribute("aria-label", this.t("navLabel"));
    document.querySelector("#swipeHandleInput")?.setAttribute("placeholder", this.t("handlePlaceholder"));
    document.querySelector("#swipeCheerInput")?.setAttribute("placeholder", this.t("cheerPlaceholder"));
    document.querySelector("#swipeCheerTemplates")?.setAttribute("aria-label", this.t("cheerTemplatesLabel"));
    this.updateAngler();
    this.renderCheerTemplates();
    if (this.phase === "ended") this.renderEndStats();
  }

  renderCheerTemplates() {
    const container = document.querySelector("#swipeCheerTemplates");
    const templates = this.t("cheerTemplates");
    if (!container || !Array.isArray(templates)) return;
    const shuffled = [...templates];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    container.replaceChildren();
    shuffled.slice(0, 4).forEach((text) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cheer-template-chip";
      button.textContent = text;
      container.appendChild(button);
    });
  }

  restoreAnglerRotation() {
    try {
      const saved = JSON.parse(localStorage.getItem(ANGLER_ROTATION_STORAGE_KEY) || "null");
      const orderIsValid = Array.isArray(saved?.order)
        && saved.order.length === FISH_MEMBERS.length
        && saved.order.every((member) => FISH_MEMBERS.includes(member))
        && new Set(saved.order).size === FISH_MEMBERS.length;
      const indexIsValid = Number.isInteger(saved?.nextIndex)
        && saved.nextIndex >= 0
        && saved.nextIndex < FISH_MEMBERS.length;
      if (!orderIsValid || !indexIsValid) return;
      this.anglerOrder = [...saved.order];
      this.nextAnglerIndex = saved.nextIndex;
    } catch (e) { }
  }

  initializeAnglerRotation() {
    this.anglerOrder = [...FISH_MEMBERS];
    for (let index = this.anglerOrder.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [this.anglerOrder[index], this.anglerOrder[swapIndex]] = [this.anglerOrder[swapIndex], this.anglerOrder[index]];
    }
    this.nextAnglerIndex = 0;
  }

  prepareNextAngler() {
    if (this.anglerOrder.length !== FISH_MEMBERS.length) this.initializeAnglerRotation();
    this.anglerMember = this.anglerOrder[this.nextAnglerIndex];
    this.nextAnglerIndex = (this.nextAnglerIndex + 1) % this.anglerOrder.length;
    try {
      localStorage.setItem(ANGLER_ROTATION_STORAGE_KEY, JSON.stringify({
        order: this.anglerOrder,
        nextIndex: this.nextAnglerIndex,
      }));
    } catch (e) { }
    this.updateAngler();
  }

  updateAngler() {
    const name = this.t(`member_${this.anglerMember}`);
    if (this.anglerImageNode) {
      this.anglerImageNode.src = anglerImage(this.anglerMember);
      this.anglerImageNode.alt = this.t("anglerAlt", { name });
    }
    if (this.anglerBadgeNode) this.anglerBadgeNode.textContent = this.t("anglerBadge", { name });
  }

  setAnglerVisible(visible) {
    if (!this.anglerNode) return;
    this.anglerNode.hidden = !visible;
    this.anglerNode.setAttribute("aria-hidden", visible ? "false" : "true");
    this.arena.classList.toggle("is-ready", !visible);
  }

  loadImage(src) {
    return new Promise((resolve) => {
      const image = new Image();
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        resolve(image);
      };
      image.onload = done;
      image.onerror = done;
      image.src = src;
      if (image.complete) done();
    });
  }

  async preloadAssets() {
    const loaded = await Promise.all(FISH_MEMBERS.map(async (member) => [member, await this.loadImage(fishImage(member))]));
    loaded.forEach(([member, image]) => { this.images[member] = image; });
    this.assetsReady = true;
    this.startButton.disabled = false;
    this.startButton.textContent = this.t("startButton");
  }

  setupCanvas() {
    this.resizeCanvas();
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
      this.resizeObserver.observe(this.arena);
    } else {
      window.addEventListener("resize", () => this.resizeCanvas());
    }

    this.canvas.addEventListener("pointerdown", (event) => this.pointerDown(event));
    this.canvas.addEventListener("pointermove", (event) => this.pointerMove(event));
    this.canvas.addEventListener("pointerup", (event) => this.pointerUp(event));
    this.canvas.addEventListener("pointercancel", (event) => this.pointerUp(event));
    this.canvas.addEventListener("contextmenu", (event) => event.preventDefault());
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.round(rect.width));
    const nextHeight = Math.max(1, Math.round(rect.height));
    const scaleX = this.width > 1 ? nextWidth / this.width : 1;
    const scaleY = this.height > 1 ? nextHeight / this.height : 1;
    this.width = nextWidth;
    this.height = nextHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.entities.forEach((entity) => {
      entity.x *= scaleX;
      entity.y *= scaleY;
      entity.vx *= scaleX;
      entity.vy *= scaleY;
    });
  }

  bind() {
    this.startButton.addEventListener("click", () => this.startCountdown());
    document.querySelector("#swipeLanguageSelect")?.addEventListener("change", (event) => {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, event.target.value);
      } catch (e) { }
      this.applyLocale(event.target.value);
    });
    document.querySelector("#swipePlayAgainButton")?.addEventListener("click", () => this.showStartScreen());
    document.querySelector("#swipeSubmitScoreButton")?.addEventListener("click", () => this.submitScore());
    document.querySelector("#swipeCheerSubmitButton")?.addEventListener("click", () => this.submitCheer());
    document.querySelector("#swipeCheerTemplates")?.addEventListener("click", (event) => {
      const chip = event.target.closest(".cheer-template-chip");
      const input = document.querySelector("#swipeCheerInput");
      if (chip && input) {
        input.value = chip.textContent;
        input.focus();
      }
    });
    document.addEventListener("visibilitychange", () => this.handleVisibilityChange());
  }

  handleVisibilityChange() {
    const now = performance.now();
    if (document.hidden) {
      this.hiddenAt = now;
      return;
    }
    if (this.hiddenAt === null) return;
    const hiddenDuration = now - this.hiddenAt;
    if (this.phase === "countdown") this.countdownEndAt += hiddenDuration;
    if (this.phase === "playing") {
      this.gameStartAt += hiddenDuration;
      this.nextSpawnAt += hiddenDuration;
    }
    this.hiddenAt = null;
    this.lastFrameAt = now;
  }

  pointerPoint(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (this.width / rect.width),
      y: (event.clientY - rect.top) * (this.height / rect.height),
      time: performance.now(),
    };
  }

  pointerDown(event) {
    if (this.phase !== "playing" || this.activePointerId !== null) return;
    if (event.pointerType === "touch" && event.isPrimary === false) return;
    event.preventDefault();
    this.getAudioContext();
    this.activePointerId = event.pointerId;
    this.strokeFishHits = 0;
    this.strokeHitHazard = false;
    this.strokeMembers = new Set();
    const point = this.pointerPoint(event);
    this.trail = [point];
    try {
      this.canvas.setPointerCapture(event.pointerId);
    } catch (e) { }
  }

  pointerMove(event) {
    if (this.phase !== "playing" || event.pointerId !== this.activePointerId) return;
    event.preventDefault();
    const samples = event.getCoalescedEvents?.() || [event];
    samples.forEach((sample) => this.extendStroke(this.pointerPoint(sample)));
  }

  pointerUp(event) {
    if (event.pointerId !== this.activePointerId) return;
    event.preventDefault();
    if (this.phase === "playing") this.extendStroke(this.pointerPoint(event));
    try {
      this.canvas.releasePointerCapture(event.pointerId);
    } catch (e) { }
    this.activePointerId = null;
    this.finishStroke();
  }

  extendStroke(point) {
    const previous = this.trail.at(-1);
    this.trail.push(point);
    if (this.trail.length > 28) this.trail.shift();
    if (previous) this.hitTestSegment(previous, point);
  }

  distanceToSegment(px, py, start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (dx === 0 && dy === 0) return Math.hypot(px - start.x, py - start.y);
    const ratio = Math.max(0, Math.min(1, ((px - start.x) * dx + (py - start.y) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(px - (start.x + ratio * dx), py - (start.y + ratio * dy));
  }

  hitTestSegment(start, end) {
    this.entities.forEach((entity) => {
      if (entity.dead || this.distanceToSegment(entity.x, entity.y, start, end) > entity.radius) return;
      entity.dead = true;
      if (entity.type === "fish") this.catchFishEntity(entity);
      else this.hitHazard(entity);
    });
  }

  catchFishEntity(entity) {
    const sameColor = entity.member === this.anglerMember;
    const gained = 1 + (sameColor ? SAME_COLOR_BONUS : 0);
    this.score += gained;
    this.caught += 1;
    this.strokeFishHits += 1;
    this.strokeMembers.add(entity.member);
    this.createBurst(entity.x, entity.y, MEMBER_COLORS[entity.member], 12);
    this.addFloater(`+${gained}`, entity.x, entity.y, sameColor ? "#ffe56b" : "#fff");
    if (sameColor) this.showPop(this.t("sameColorPop"));
    const now = performance.now();
    if (now - this.lastCatchToneAt > 38) {
      const index = FISH_MEMBERS.indexOf(entity.member);
      this.playTone(540 + index * 85, 80, { type: "triangle", gain: 0.07 });
      this.lastCatchToneAt = now;
    }
    try {
      navigator.vibrate?.(12);
    } catch (e) { }
    this.updateHud();
  }

  hitHazard(entity) {
    this.score = Math.max(0, this.score - HAZARD_PENALTY);
    this.strokeHitHazard = true;
    this.createBurst(entity.x, entity.y, "#5b304f", 18);
    this.addFloater(`-${HAZARD_PENALTY}`, entity.x, entity.y, "#ff668a");
    this.showPop(this.t("penaltyPop"), true);
    this.arena.classList.remove("is-penalty");
    this.arena.offsetHeight;
    this.arena.classList.add("is-penalty");
    this.playHazardSound();
    try {
      navigator.vibrate?.([55, 35, 80]);
    } catch (e) { }
    this.updateHud();
  }

  finishStroke() {
    if (this.strokeHitHazard) {
      this.strokeFishHits = 0;
      this.strokeMembers.clear();
      return;
    }
    this.bestCombo = Math.max(this.bestCombo, this.strokeFishHits);
    let bonus = 0;
    const isFiveColorCombo = this.strokeFishHits === FISH_MEMBERS.length
      && this.strokeMembers.size === FISH_MEMBERS.length;
    if (isFiveColorCombo) bonus = FIVE_COLOR_COMBO_BONUS;
    else if (this.strokeFishHits >= 5) bonus = COMBO_FIVE_BONUS;
    else if (this.strokeFishHits >= 3) bonus = COMBO_THREE_BONUS;
    if (bonus > 0) {
      this.score += bonus;
      const message = isFiveColorCombo
        ? this.t("fiveColorComboPop")
        : this.t("comboPop", { count: this.strokeFishHits, bonus });
      this.showPop(message);
      this.playComboSound();
    }
    this.updateHud();
    this.strokeFishHits = 0;
    this.strokeMembers.clear();
  }

  resetGameState() {
    this.score = 0;
    this.caught = 0;
    this.bestCombo = 0;
    this.entities = [];
    this.particles = [];
    this.floaters = [];
    this.trail = [];
    this.activePointerId = null;
    this.strokeFishHits = 0;
    this.strokeHitHazard = false;
    this.strokeMembers = new Set();
    this.scoreSubmitted = false;
    this.lastSubmittedHandle = "";
    this.lastDisplayedSecond = GAME_DURATION_S;
    this.updateHud();
  }

  startCountdown() {
    if (!this.assetsReady || this.phase !== "ready") return;
    this.getAudioContext();
    this.resetGameState();
    this.phase = "countdown";
    this.startOverlay.classList.remove("is-visible");
    this.startOverlay.setAttribute("aria-hidden", "true");
    this.endOverlay.classList.remove("is-visible");
    this.leaderboardOverlay.classList.remove("is-visible");
    this.setAnglerVisible(false);
    this.countdownNode.setAttribute("aria-hidden", "false");
    this.countdownEndAt = performance.now() + 3000;
    this.lastCountdownNumber = null;
  }

  beginPlaying(now) {
    this.phase = "playing";
    this.gameStartAt = now;
    this.nextSpawnAt = now + 160;
    this.countdownNode.textContent = this.t("go");
    window.setTimeout(() => {
      if (this.phase === "playing") {
        this.countdownNode.textContent = "";
        this.countdownNode.setAttribute("aria-hidden", "true");
      }
    }, 420);
    this.setAnglerVisible(true);
    this.playStartSound();
  }

  updateCountdown(now) {
    const remaining = this.countdownEndAt - now;
    if (remaining <= 0) {
      this.beginPlaying(now);
      return;
    }
    const number = Math.ceil(remaining / 1000);
    this.countdownNode.textContent = String(number);
    if (number !== this.lastCountdownNumber) {
      this.playTone(520 + (3 - number) * 110, 100, { type: "triangle", gain: 0.08 });
      this.lastCountdownNumber = number;
    }
  }

  waveConfig(elapsed) {
    if (elapsed < 10) return { min: 1, max: 2, interval: 1300, hazardChance: elapsed >= 5 ? 0.16 : 0 };
    if (elapsed < 25) return { min: 2, max: 4, interval: 1080, hazardChance: 0.30 };
    if (elapsed < 35) return { min: 3, max: 5, interval: 900, hazardChance: 0.40 };
    return { min: 5, max: 8, interval: 760, hazardChance: 0.50 };
  }

  spawnWave(elapsed) {
    const config = this.waveConfig(elapsed);
    const available = Math.max(0, 18 - this.entities.filter((entity) => !entity.dead).length);
    const requested = config.min + Math.floor(Math.random() * (config.max - config.min + 1));
    const count = Math.min(requested, available);
    const sectionWidth = this.width / (count + 1 || 1);
    const fishXs = [];
    for (let index = 0; index < count; index++) {
      const x = Math.max(42, Math.min(this.width - 42, sectionWidth * (index + 1) + (Math.random() - 0.5) * sectionWidth * 0.6));
      fishXs.push(x);
      this.spawnFish(x);
    }
    if (Math.random() < config.hazardChance && !this.entities.some((entity) => entity.type === "hazard" && !entity.dead)) {
      this.spawnHazard(fishXs);
    }
  }

  launchVelocity(x) {
    const gravity = Math.max(900, this.height * 1.75);
    const vertical = -Math.sqrt(2 * gravity * this.height * (0.64 + Math.random() * 0.2));
    let horizontal = (Math.random() - 0.5) * Math.min(280, this.width * 0.45);
    if (x < this.width * 0.22) horizontal = Math.abs(horizontal);
    if (x > this.width * 0.78) horizontal = -Math.abs(horizontal);
    return { vx: horizontal, vy: vertical, gravity };
  }

  spawnFish(x) {
    const member = FISH_MEMBERS[Math.floor(Math.random() * FISH_MEMBERS.length)];
    const velocity = this.launchVelocity(x);
    this.entities.push({
      type: "fish",
      member,
      x,
      y: this.height + 50,
      vx: velocity.vx,
      vy: velocity.vy,
      gravity: velocity.gravity,
      radius: Math.max(34, Math.min(54, this.width * 0.068)),
      rotation: (Math.random() - 0.5) * 0.35,
      spin: (Math.random() - 0.5) * 2.6,
      dead: false,
    });
  }

  spawnHazard(fishXs) {
    let x = this.width * (0.18 + Math.random() * 0.64);
    for (let attempt = 0; attempt < 5 && fishXs.some((fishX) => Math.abs(fishX - x) < 76); attempt++) {
      x = this.width * (0.18 + Math.random() * 0.64);
    }
    const velocity = this.launchVelocity(x);
    this.entities.push({
      type: "hazard",
      x,
      y: this.height + 52,
      vx: velocity.vx * 0.72,
      vy: velocity.vy * 0.92,
      gravity: velocity.gravity,
      radius: Math.max(30, Math.min(44, this.width * 0.058)),
      rotation: 0,
      spin: (Math.random() - 0.5) * 2.1,
      dead: false,
    });
  }

  updateGame(now, deltaS) {
    const elapsed = (now - this.gameStartAt) / 1000;
    if (elapsed >= GAME_DURATION_S) {
      this.endGame();
      return;
    }
    const seconds = Math.max(0, Math.ceil(GAME_DURATION_S - elapsed));
    if (seconds !== this.lastDisplayedSecond) {
      this.lastDisplayedSecond = seconds;
      this.timerNode.textContent = String(seconds);
    }
    if (now >= this.nextSpawnAt) {
      const config = this.waveConfig(elapsed);
      this.spawnWave(elapsed);
      this.nextSpawnAt = now + config.interval * (0.9 + Math.random() * 0.2);
    }

    this.entities.forEach((entity) => {
      entity.vy += entity.gravity * deltaS;
      entity.x += entity.vx * deltaS;
      entity.y += entity.vy * deltaS;
      entity.rotation += entity.spin * deltaS;
    });
    this.entities = this.entities.filter((entity) => !entity.dead && !(entity.vy > 0 && entity.y - entity.radius > this.height + 80));
  }

  createBurst(x, y, color, count) {
    for (let index = 0; index < count; index++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 65 + Math.random() * 170;
      const life = 0.35 + Math.random() * 0.35;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 35,
        color,
        size: 2 + Math.random() * 5,
        life,
        maxLife: life,
      });
    }
  }

  addFloater(text, x, y, color) {
    this.floaters.push({ text, x, y, color, life: 0.75, maxLife: 0.75 });
  }

  updateEffects(deltaS, now) {
    this.particles.forEach((particle) => {
      particle.life -= deltaS;
      particle.vy += 210 * deltaS;
      particle.x += particle.vx * deltaS;
      particle.y += particle.vy * deltaS;
    });
    this.particles = this.particles.filter((particle) => particle.life > 0).slice(-260);
    this.floaters.forEach((floater) => {
      floater.life -= deltaS;
      floater.y -= 34 * deltaS;
    });
    this.floaters = this.floaters.filter((floater) => floater.life > 0).slice(-30);
    this.trail = this.trail.filter((point) => now - point.time < 190);
  }

  drawFish(entity) {
    const image = this.images[entity.member];
    const drawWidth = entity.radius * 2.35;
    const ratio = image?.naturalWidth ? image.naturalHeight / image.naturalWidth : 0.65;
    const drawHeight = drawWidth * ratio;
    this.ctx.save();
    this.ctx.translate(entity.x, entity.y);
    this.ctx.rotate(entity.rotation);
    if (entity.vx < 0) this.ctx.scale(-1, 1);
    if (entity.member === this.anglerMember) {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, entity.radius * 1.18, 0, Math.PI * 2);
      this.ctx.strokeStyle = "rgba(255, 232, 102, 0.95)";
      this.ctx.lineWidth = 5;
      this.ctx.shadowColor = "#ffe86b";
      this.ctx.shadowBlur = 16;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
    }
    if (image?.complete && image.naturalWidth) {
      this.ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    } else {
      this.ctx.fillStyle = MEMBER_COLORS[entity.member];
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, entity.radius, entity.radius * 0.58, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  drawHazard(entity) {
    const radius = entity.radius;
    this.ctx.save();
    this.ctx.translate(entity.x, entity.y);
    this.ctx.rotate(entity.rotation + Math.PI / 4);
    this.ctx.shadowColor = "rgba(45, 18, 48, 0.55)";
    this.ctx.shadowBlur = 13;
    this.ctx.fillStyle = "rgba(56, 35, 63, 0.94)";
    this.ctx.strokeStyle = "#d39ab4";
    this.ctx.lineWidth = 6;
    this.ctx.beginPath();
    this.ctx.moveTo(-radius * 0.82, -radius * 0.82);
    this.ctx.lineTo(radius * 0.82, -radius * 0.82);
    this.ctx.lineTo(radius * 0.82, radius * 0.18);
    this.ctx.lineTo(radius * 0.56, radius * 0.04);
    this.ctx.lineTo(radius * 0.34, radius * 0.34);
    this.ctx.lineTo(radius * 0.08, radius * 0.18);
    this.ctx.lineTo(-radius * 0.12, radius * 0.82);
    this.ctx.lineTo(-radius * 0.82, radius * 0.82);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    this.ctx.strokeStyle = "rgba(255,255,255,0.38)";
    this.ctx.lineWidth = 2;
    for (let offset = -radius * 0.5; offset <= radius * 0.5; offset += radius * 0.25) {
      this.ctx.beginPath();
      this.ctx.moveTo(-radius * 0.68, offset);
      this.ctx.lineTo(radius * 0.68, offset);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(offset, -radius * 0.68);
      this.ctx.lineTo(offset, radius * 0.68);
      this.ctx.stroke();
    }
    this.ctx.rotate(-Math.PI / 4);
    this.ctx.fillStyle = "#ff5c82";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius * 0.38, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = "#ffe86b";
    this.ctx.font = `900 ${Math.round(radius * 0.62)}px Outfit, sans-serif`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("!", 0, 1);
    this.ctx.restore();
  }

  drawTrail(now) {
    if (this.trail.length < 2) return;
    this.ctx.save();
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.shadowColor = "#ff65ad";
    this.ctx.shadowBlur = 14;
    for (let index = 1; index < this.trail.length; index++) {
      const start = this.trail[index - 1];
      const end = this.trail[index];
      const alpha = Math.max(0, 1 - (now - end.time) / 190);
      this.ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.92})`;
      this.ctx.lineWidth = 4 + alpha * 8;
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  render(now) {
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.entities.forEach((entity) => {
      if (entity.type === "fish") this.drawFish(entity);
      else this.drawHazard(entity);
    });
    this.particles.forEach((particle) => {
      this.ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1;
    this.floaters.forEach((floater) => {
      this.ctx.globalAlpha = Math.max(0, floater.life / floater.maxLife);
      this.ctx.fillStyle = floater.color;
      this.ctx.font = "900 20px Outfit, sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.strokeStyle = "rgba(53, 27, 76, 0.45)";
      this.ctx.lineWidth = 4;
      this.ctx.strokeText(floater.text, floater.x, floater.y);
      this.ctx.fillText(floater.text, floater.x, floater.y);
    });
    this.ctx.globalAlpha = 1;
    this.drawTrail(now);
  }

  frame(now) {
    const deltaS = this.lastFrameAt ? Math.min(0.034, (now - this.lastFrameAt) / 1000) : 0;
    this.lastFrameAt = now;
    if (!document.hidden) {
      if (this.phase === "countdown") this.updateCountdown(now);
      else if (this.phase === "playing") this.updateGame(now, deltaS);
      this.updateEffects(deltaS, now);
      this.render(now);
    }
    this.frameId = requestAnimationFrame((time) => this.frame(time));
  }

  updateHud() {
    this.timerNode.textContent = String(this.lastDisplayedSecond);
    this.caughtNode.textContent = String(this.caught);
    this.scoreNode.textContent = String(this.score);
    this.comboNode.textContent = String(this.bestCombo);
  }

  endGame() {
    if (this.phase !== "playing") return;
    this.finishStroke();
    this.phase = "ended";
    this.activePointerId = null;
    this.entities = [];
    this.trail = [];
    this.lastDisplayedSecond = 0;
    this.updateHud();
    this.setAnglerVisible(false);
    this.renderEndStats();
    this.endOverlay.classList.add("is-visible");
    this.endOverlay.setAttribute("aria-hidden", "false");
    const input = document.querySelector("#swipeHandleInput");
    try {
      const saved = localStorage.getItem("apink_my_handle");
      if (saved && input && !input.value) input.value = saved;
    } catch (e) { }
    this.playEndSound();
  }

  renderEndStats() {
    this.setText("#swipeEndScore", "endScore", { score: this.score });
    document.querySelector("#swipeEndCaught").textContent = String(this.caught);
    document.querySelector("#swipeEndCombo").textContent = String(this.bestCombo);
  }

  showStartScreen() {
    this.phase = "ready";
    this.resetGameState();
    this.setAnglerVisible(false);
    this.endOverlay.classList.remove("is-visible");
    this.endOverlay.setAttribute("aria-hidden", "true");
    this.leaderboardOverlay.classList.remove("is-visible");
    this.leaderboardOverlay.setAttribute("aria-hidden", "true");
    this.startOverlay.classList.add("is-visible");
    this.startOverlay.setAttribute("aria-hidden", "false");
    this.prepareNextAngler();
    this.renderCheerTemplates();
  }

  showPop(message, isPenalty = false) {
    if (!this.popNode) return;
    window.clearTimeout(this.popTimeoutId);
    this.popNode.textContent = message;
    this.popNode.classList.toggle("is-penalty", isPenalty);
    this.popNode.classList.remove("is-visible");
    this.popNode.offsetHeight;
    this.popNode.classList.add("is-visible");
    this.popNode.setAttribute("aria-hidden", "false");
    this.popTimeoutId = window.setTimeout(() => {
      this.popNode.classList.remove("is-visible");
      this.popNode.setAttribute("aria-hidden", "true");
    }, 850);
  }

  showNotice(message) {
    if (!this.noticeToast || !this.noticeToastText) return;
    window.clearTimeout(this.noticeTimeoutId);
    this.noticeToastText.textContent = message;
    this.noticeToast.classList.add("is-visible");
    this.noticeToast.setAttribute("aria-hidden", "false");
    this.noticeTimeoutId = window.setTimeout(() => {
      this.noticeToast.classList.remove("is-visible");
      this.noticeToast.setAttribute("aria-hidden", "true");
    }, 2400);
  }

  cacheKey(kind) {
    return `apink_fish_swipe_${kind}`;
  }

  async checkBackendSupport() {
    if (this.backendSupport !== null) return this.backendSupport;
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=fish_swipe_leaderboard&ts=${Date.now()}`, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
      });
      const data = await response.json();
      this.backendSupport = data?.game === GAME_KEY;
    } catch (e) {
      this.backendSupport = false;
    }
    return this.backendSupport;
  }

  async submitScore() {
    const input = document.querySelector("#swipeHandleInput");
    const button = document.querySelector("#swipeSubmitScoreButton");
    const handle = String(input?.value || "").trim();
    if (!handle) {
      this.showNotice(this.t("noticeHandleRequired"));
      input?.focus();
      return;
    }
    if (this.scoreSubmitted) {
      this.showNotice(this.t("noticeScoreSubmitted"));
      return;
    }
    try {
      localStorage.setItem("apink_my_handle", handle);
    } catch (e) { }
    this.lastSubmittedHandle = handle;

    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(this.cacheKey("leaderboard")) || "[]");
      if (!Array.isArray(list)) list = [];
      const existing = list.find((item) => item.handle === handle);
      if (existing) existing.score = Math.max(Number(existing.score) || 0, this.score);
      else list.push({ handle, score: this.score });
      localStorage.setItem(this.cacheKey("leaderboard"), JSON.stringify(list));
    } catch (e) { }

    if (button) {
      button.disabled = true;
      button.textContent = this.t("sending");
    }
    if (await this.checkBackendSupport()) {
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ handle, score: this.score, game: GAME_KEY }),
        });
        const data = await response.json();
        if (data?.game === GAME_KEY && Array.isArray(data.leaderboard)) {
          list = data.leaderboard;
          try {
            localStorage.setItem(this.cacheKey("leaderboard"), JSON.stringify(list));
          } catch (e) { }
        }
      } catch (e) {
        console.warn("Swipe fish score sync failed, using local fallback:", e);
      }
    }
    if (button) {
      button.disabled = false;
      button.textContent = this.t("submitScore");
    }
    this.scoreSubmitted = true;
    this.showLeaderboard(list, handle);
  }

  showLeaderboard(list, myHandle) {
    const ranked = (Array.isArray(list) ? list : [])
      .map((item) => ({ handle: String(item?.handle || ""), score: Number(item?.score) || 0 }))
      .filter((item) => item.handle)
      .sort((a, b) => b.score - a.score)
      .map((item, index, sorted) => ({
        ...item,
        rank: sorted.findIndex((candidate) => candidate.score === item.score) + 1,
      }));
    const mine = ranked.find((item) => item.handle === myHandle);
    const node = document.querySelector("#swipeLeaderboardMyRank");
    node.replaceChildren();
    const values = mine
      ? [this.t("myRank", { rank: mine.rank }), maskHandle(mine.handle), this.t("scoreUnit", { score: mine.score })]
      : [this.t("myScore"), maskHandle(myHandle), this.t("scoreUnit", { score: this.score })];
    values.forEach((value) => {
      const span = document.createElement("span");
      span.textContent = value;
      node.appendChild(span);
    });
    this.endOverlay.classList.remove("is-visible");
    this.endOverlay.setAttribute("aria-hidden", "true");
    this.leaderboardOverlay.classList.add("is-visible");
    this.leaderboardOverlay.setAttribute("aria-hidden", "false");
    this.renderCheerTemplates();
  }

  async submitCheer() {
    const input = document.querySelector("#swipeCheerInput");
    const button = document.querySelector("#swipeCheerSubmitButton");
    const message = String(input?.value || "").trim();
    if (!message) {
      this.showNotice(this.t("noticeCheerRequired"));
      input?.focus();
      return;
    }
    const handle = this.lastSubmittedHandle || this.t("anonymous");
    if (button) {
      button.disabled = true;
      button.textContent = this.t("sending");
    }
    try {
      const cached = JSON.parse(localStorage.getItem(this.cacheKey("cheers")) || "[]");
      cached.push({ handle, message, time: new Date().toISOString() });
      localStorage.setItem(this.cacheKey("cheers"), JSON.stringify(cached));
    } catch (e) { }
    if (await this.checkBackendSupport()) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ handle, score: this.score, message, game: GAME_KEY }),
        });
      } catch (e) {
        console.warn("Swipe fish cheer sync failed, using local fallback:", e);
      }
    }
    if (input) input.value = "";
    if (button) {
      button.disabled = false;
      button.textContent = this.t("cheerSubmit");
    }
    this.showNotice(this.t("noticeCheerSubmitted"));
    this.showStartScreen();
  }

  getAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!this.audioContext) this.audioContext = new AudioContext();
    if (this.audioContext.state === "suspended") {
      const promise = this.audioContext.resume();
      if (promise?.catch) promise.catch(() => { });
    }
    if (!this.audioUnlocked) {
      try {
        const buffer = this.audioContext.createBuffer(1, 1, 22050);
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);
        this.audioUnlocked = true;
      } catch (e) { }
      this.startAudioSession();
    }
    return this.audioContext;
  }

  startAudioSession() {
    if (this.audioSessionEl) return;
    try {
      const sampleRate = 8000;
      const sampleCount = sampleRate / 2;
      const buffer = new ArrayBuffer(44 + sampleCount);
      const view = new DataView(buffer);
      const writeString = (offset, value) => {
        for (let index = 0; index < value.length; index++) view.setUint8(offset + index, value.charCodeAt(index));
      };
      writeString(0, "RIFF");
      view.setUint32(4, 36 + sampleCount, true);
      writeString(8, "WAVE");
      writeString(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate, true);
      view.setUint16(32, 1, true);
      view.setUint16(34, 8, true);
      writeString(36, "data");
      view.setUint32(40, sampleCount, true);
      for (let index = 0; index < sampleCount; index++) view.setUint8(44 + index, 128);
      const audio = document.createElement("audio");
      audio.setAttribute("playsinline", "");
      audio.setAttribute("webkit-playsinline", "");
      audio.loop = true;
      audio.src = URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
      const promise = audio.play();
      if (promise?.catch) promise.catch(() => { });
      this.audioSessionEl = audio;
    } catch (e) { }
  }

  playTone(frequency, durationMs, { type = "sine", gain = 0.08, delayMs = 0 } = {}) {
    const context = this.getAudioContext();
    if (!context) return;
    const start = context.currentTime + delayMs / 1000;
    const oscillator = context.createOscillator();
    const amplifier = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    amplifier.gain.setValueAtTime(gain, start);
    amplifier.gain.exponentialRampToValueAtTime(0.0001, start + durationMs / 1000);
    oscillator.connect(amplifier).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + durationMs / 1000 + 0.04);
  }

  playStartSound() {
    [523, 659, 784].forEach((frequency, index) => this.playTone(frequency, 120, { type: "triangle", delayMs: index * 80 }));
  }

  playComboSound() {
    [784, 988, 1175].forEach((frequency, index) => this.playTone(frequency, 100, { type: "triangle", gain: 0.09, delayMs: index * 55 }));
  }

  playHazardSound() {
    this.playTone(180, 220, { type: "sawtooth", gain: 0.07 });
    this.playTone(120, 260, { type: "square", gain: 0.04, delayMs: 90 });
  }

  playEndSound() {
    [784, 659, 523, 659, 784].forEach((frequency, index) => this.playTone(frequency, 140, { type: "triangle", delayMs: index * 100 }));
  }

  start() {
    this.applyLocale();
    this.setAnglerVisible(false);
    this.prepareNextAngler();
    this.setupCanvas();
    this.bind();
    this.updateHud();
    this.preloadAssets();
    this.frameId = requestAnimationFrame((time) => this.frame(time));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.swipeFishGame = new SwipeFishGame();
  window.swipeFishGame.start();
});
