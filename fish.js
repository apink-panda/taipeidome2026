const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwJssnwqL636-7t1P2LtspixCWvdm4ffMhQxmAYDB62f4Y2BwvgmxRryl-nbN3Qsu6P/exec";
const languageStorageKey = "apink_language_preference";
const GAME_DURATION_S = 60;
const BITE_WINDOW_MS = 900;
// 高級版拉扯戰：掙脫倒數隨機（有時很快就掙脫），連點推滿進度條，
// 魚掙扎會讓進度隨時間流失；神速完成有速度加分。
const STRUGGLE_WINDOW_MIN_MS = 2500;
const STRUGGLE_WINDOW_MAX_MS = 5000;
const STRUGGLE_TAPS_PER_S_MIN = 3.0;
const STRUGGLE_TAPS_PER_S_MAX = 4.2;
const STRUGGLE_DECAY_PER_S = 1.2;
const SPEED_BONUS_RATIO = 0.55; // 在時限 55% 內完成 → 加分
const DOUBLE_CATCH_CHANCE = 0.25; // 一竿雙魚機率（可重複成員）
// 跳魚彩蛋：魚不定時躍出水面，在空中點中牠直接 +5 分
const JUMP_INTERVAL_MIN_MS = 7000;
const JUMP_INTERVAL_MAX_MS = 13000;
const JUMP_VISIBLE_MS = 1500;
const JUMP_CATCH_POINTS = 5;
const FISH_MEMBERS = ["rong", "bomi", "enji", "najoo", "hayoung"];
const fishImage = (member) => `./assets/fish/${member}_fish.webp`;
const anglerImage = (member) => `./assets/fish/${member}_boat.webp`;
const MATCHING_COLOR_BONUS = 10;

const fishI18n = {
  zh: {
    htmlLang: "zh-Hant",
    title: "釣出你的幸運明太魚",
    description: "Apink 15 週年應援！幫 Apink 釣起幸福幸運明太魚，做成可愛的明太魚送給 Panda！",
    languageLabel: "語言",
    languageAuto: "自動",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    backToGame: "回到棒球遊戲",
    kicker: "Apink 15 週年應援",
    heading: "釣出你的幸運明太魚",
    intro: "Ping Doongs 想送給 Panda 幸運的明太魚！幫忙把明太魚釣起來，發送給親愛的 Panda們 吧！",
    timerLabel: "剩餘時間",
    countLabel: "釣獲",
    startTitle: "釣出你的幸運明太魚",
    startBadge: "Apink 15 週年應援",
    startRule1: "釣竿會<strong>自動拋出</strong>，等浮標下沉出現「<strong>！</strong>」時趕快點擊海面<strong>拉竿</strong>，就能釣起一隻成員明太魚；太早點魚會被嚇跑、太晚魚會溜走喔！",
    startRule2: "每局會隨機選一隻 Ping Doongs 當釣手；釣到和牠<strong>同色</strong>的明太魚，該魚會<strong>加 10 分</strong>！限時 60 秒，盡量多釣！",
    anglerBadge: "本局釣手：{name} Ping Doongs · 同色魚 +10",
    anglerAlt: "{name} Ping Doongs 正在船上釣魚",
    startButton: "開始釣魚",
    statusCast: "拋竿中...",
    statusWaiting: "耐心等待魚上鉤...",
    statusPull: "快拉竿！",
    statusStruggle: "魚在掙扎！快速連點拉上來！",
    popEarly: "太早了！魚被嚇跑",
    popMiss: "魚跑掉了...",
    popEscape: "魚掙脫了...",
    popCatch: "釣到了！",
    popDoubleCatch: "雙喜臨門！一次兩隻！",
    popColorBonus: "同色明太魚加成 +10！",
    popSpeedBonus: "⚡ 神速加分 +1",
    popJumpCatch: "空中攔截 {name}！+{points} 分",
    popJumpColorCatch: "同色空中攔截 {name}！加成 +10，共 {points} 分",
    scoreLabel: "分數",
    endScore: "總分 {score} 分",
    modeLabel: "選擇難度",
    modeEasy: "初級版",
    modeEasyDesc: "「！」出現時單擊拉竿",
    modePro: "高級版",
    modeProDesc: "掙脫倒數隨機，快速連點拉魚，神速再加分",
    endTitle: "時間到！",
    endCount: "共釣起 {count} 隻幸運明太魚！",
    endCountZero: "這次魚兒太害羞了，再試一次吧！",
    luckyTitle: "你的幸運明太魚",
    endBonus: "🎉 集滿五隻成員明太魚！Apink 15 週年快樂，Panda 永遠與 Apink 同行！",
    member_rong: "Chorong",
    member_bomi: "Bomi",
    member_enji: "Eunji",
    member_najoo: "Namjoo",
    member_hayoung: "Hayoung",
    blessing_rong: "初瓏的幸運：你許下的願望，會像四葉草一樣悄悄實現 🍀",
    blessing_bomi: "普美的幸運：笑容滿分！今天的好運全部由你打包帶走 😆",
    blessing_enji: "恩地的幸運：像她的嗓音一樣溫暖的一天，勇氣滿滿直球對決 🔥",
    blessing_najoo: "南珠的幸運：閃閃發光的你，接下來的日子會越來越亮 ✨",
    blessing_hayoung: "夏榮的幸運：活力充電完成！15 週年也一起跑下去吧 💖",
    handlePlaceholder: "輸入 IG 或 Threads 帳號",
    submitScore: "結算成績",
    cheerPlaceholder: "留下 15 週年祝福...",
    cheerSubmit: "送出祝福",
    playAgain: "再玩一次",
    leaderboardLink: "排行榜",
    noticeHandleRequired: "請輸入 IG 或 Threads 帳號！",
    noticeCheerRequired: "請輸入祝福的話！",
    noticeScoreSubmitted: "成績已送出！",
    noticeCheerSubmitted: "祝福送出成功！謝謝你的應援！",
    sending: "傳送中...",
    anonymous: "匿名",
    disclaimer: "📌 本活動為粉絲自發性應援，不進行任何商業販售，並與官方主辦單位無關，若有侵犯權益請告知會立即下架關閉。",
  },
  en: {
    htmlLang: "en",
    title: "Catch Your Lucky Myeongtae",
    description: "Apink 15th anniversary! Help Apink reel up lucky myeongtae fish and turn them into cute gifts for Pandas!",
    languageLabel: "Language",
    languageAuto: "Auto",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    backToGame: "Back to Baseball Game",
    kicker: "Apink 15th Anniversary Cheer",
    heading: "Catch Your Lucky Myeongtae",
    intro: "Apink wants to send Pandas Korea's lucky myeongtae fish! Help Apink reel them up and turn them into cute gifts for Pandas!",
    timerLabel: "Time Left",
    countLabel: "Caught",
    startTitle: "Catch Your Lucky Myeongtae",
    startBadge: "Apink 15th Anniversary",
    startRule1: "The line <strong>casts automatically</strong>. When the bobber dips and \"<strong>!</strong>\" appears, tap the sea fast to <strong>reel</strong> in a member myeongtae. Tap too early and you scare it off — too late and it slips away!",
    startRule2: "Each game randomly chooses one Ping Doongs angler. Catch a myeongtae of the <strong>same color</strong> for <strong>10 bonus points</strong>! You have 60 seconds — catch as many as you can.",
    anglerBadge: "This game: {name} Ping Doongs · Same color +10",
    anglerAlt: "{name} Ping Doongs fishing from a boat",
    startButton: "Start Fishing",
    statusCast: "Casting...",
    statusWaiting: "Waiting for a bite...",
    statusPull: "Reel it in!",
    statusStruggle: "It's fighting! Tap fast to reel it in!",
    popEarly: "Too early! It got scared",
    popMiss: "It got away...",
    popEscape: "It broke free...",
    popCatch: "Caught!",
    popDoubleCatch: "Double catch! Two at once!",
    popColorBonus: "Same-color bonus +10!",
    popSpeedBonus: "⚡ Speed bonus +1",
    popJumpCatch: "Mid-air catch: {name}! +{points}",
    popJumpColorCatch: "Same-color mid-air catch: {name}! +10 bonus, {points} total",
    scoreLabel: "Score",
    endScore: "Total score: {score}",
    modeLabel: "Choose Difficulty",
    modeEasy: "Easy",
    modeEasyDesc: "Tap once when \"!\" appears",
    modePro: "Pro",
    modeProDesc: "Random escape timer — tap fast, extra point for speed",
    endTitle: "Time's Up!",
    endCount: "You caught {count} lucky myeongtae!",
    endCountZero: "The fish were shy this time — try again!",
    luckyTitle: "Your Lucky Myeongtae",
    endBonus: "🎉 You collected all five members! Happy 15th anniversary, Apink — Pandas forever!",
    member_rong: "Chorong",
    member_bomi: "Bomi",
    member_enji: "Eunji",
    member_najoo: "Namjoo",
    member_hayoung: "Hayoung",
    blessing_rong: "Chorong's luck: your wish will quietly come true like a four-leaf clover 🍀",
    blessing_bomi: "Bomi's luck: full-score smiles! Today's good fortune is all yours 😆",
    blessing_enji: "Eunji's luck: a day as warm as her voice — face everything head-on 🔥",
    blessing_najoo: "Namjoo's luck: you shine, and your days will only get brighter ✨",
    blessing_hayoung: "Hayoung's luck: energy fully charged! Let's keep running past 15 years 💖",
    handlePlaceholder: "Enter IG or Threads handle",
    submitScore: "Submit Score",
    cheerPlaceholder: "Leave a 15th-anniversary blessing...",
    cheerSubmit: "Send Blessing",
    playAgain: "Play Again",
    leaderboardLink: "Leaderboard",
    noticeHandleRequired: "Please enter an IG or Threads handle!",
    noticeCheerRequired: "Please write a blessing!",
    noticeScoreSubmitted: "Score submitted!",
    noticeCheerSubmitted: "Blessing sent — thank you!",
    sending: "Sending...",
    anonymous: "Anonymous",
    disclaimer: "📌 This event is a fan-initiated support project. It does not involve any commercial sales and is not affiliated with the official organizer. If any rights are infringed, please let us know and we will take the site down immediately.",
  },
  ja: {
    htmlLang: "ja",
    title: "幸運のミョンテを釣り上げよう",
    description: "Apink 15周年！Apink と一緒に幸運のミョンテを釣り上げて、かわいいミョンテを Panda に届けよう！",
    languageLabel: "言語",
    languageAuto: "自動",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    backToGame: "野球ゲームへ戻る",
    kicker: "Apink 15周年応援",
    heading: "幸運のミョンテを釣り上げよう",
    intro: "Apink が Panda に韓国の幸せミョンテを贈りたいそうです！一緒に釣り上げて、かわいいミョンテを Panda に届けましょう！",
    timerLabel: "残り時間",
    countLabel: "釣果",
    startTitle: "幸運のミョンテを釣り上げよう",
    startBadge: "Apink 15周年応援",
    startRule1: "釣り竿は<strong>自動でキャスト</strong>されます。ウキが沈んで「<strong>！</strong>」が出たら、すばやく海をタップして<strong>釣り上げ</strong>！早すぎると魚が驚いて逃げ、遅すぎても逃げてしまいます。",
    startRule2: "ゲームごとに Ping Doongs の釣り手がランダムで1匹選ばれます。釣り手と<strong>同じ色</strong>のミョンテは<strong>10点ボーナス</strong>！制限時間60秒でたくさん釣ろう！",
    anglerBadge: "今回の釣り手：{name} Ping Doongs · 同色 +10",
    anglerAlt: "船で釣りをする {name} Ping Doongs",
    startButton: "釣りスタート",
    statusCast: "キャスト中...",
    statusWaiting: "アタリを待っています...",
    statusPull: "今だ！引き上げて！",
    statusStruggle: "魚が暴れてる！連打で釣り上げろ！",
    popEarly: "早すぎ！逃げられた",
    popMiss: "逃げられた...",
    popEscape: "振りほどかれた...",
    popCatch: "釣れた！",
    popDoubleCatch: "ダブルヒット！2匹同時！",
    popColorBonus: "同色ミョンテボーナス +10！",
    popSpeedBonus: "⚡ スピードボーナス +1",
    popJumpCatch: "空中キャッチ {name}！+{points}点",
    popJumpColorCatch: "同色の {name} を空中キャッチ！+10、合計 {points}点",
    scoreLabel: "スコア",
    endScore: "合計スコア：{score} 点",
    modeLabel: "難易度をえらぶ",
    modeEasy: "初級",
    modeEasyDesc: "「！」が出たら1タップ",
    modePro: "上級",
    modeProDesc: "逃げるまでの時間はランダム、連打で釣り上げ、速いとボーナス",
    endTitle: "タイムアップ！",
    endCount: "幸運のミョンテを {count} 匹釣り上げました！",
    endCountZero: "今回は魚が恥ずかしがり屋さん。もう一度挑戦しよう！",
    luckyTitle: "あなたの幸運のミョンテ",
    endBonus: "🎉 メンバー全員のミョンテをコンプリート！Apink 15周年おめでとう、Panda はずっと一緒！",
    member_rong: "チョロン",
    member_bomi: "ボミ",
    member_enji: "ウンジ",
    member_najoo: "ナムジュ",
    member_hayoung: "ハヨン",
    blessing_rong: "チョロンの幸運：あなたの願いは四つ葉のクローバーのようにそっと叶います 🍀",
    blessing_bomi: "ボミの幸運：笑顔満点！今日の幸運はぜんぶあなたのもの 😆",
    blessing_enji: "ウンジの幸運：彼女の歌声のように温かい一日、勇気いっぱいで直球勝負 🔥",
    blessing_najoo: "ナムジュの幸運：輝くあなたの毎日は、これからもっと明るくなる ✨",
    blessing_hayoung: "ハヨンの幸運：元気フル充電！15周年もいっしょに走ろう 💖",
    handlePlaceholder: "IG または Threads のアカウントを入力",
    submitScore: "スコア送信",
    cheerPlaceholder: "15周年のお祝いメッセージを...",
    cheerSubmit: "メッセージ送信",
    playAgain: "もう一度遊ぶ",
    leaderboardLink: "ランキング",
    noticeHandleRequired: "IG または Threads のアカウントを入力してください！",
    noticeCheerRequired: "お祝いメッセージを入力してください！",
    noticeScoreSubmitted: "スコアを送信しました！",
    noticeCheerSubmitted: "メッセージを送信しました。ありがとう！",
    sending: "送信中...",
    anonymous: "匿名",
    disclaimer: "📌 本企画はファンによる自主的な応援活動であり、商業販売は一切行っておらず、公式主催者とは関係ありません。権利侵害がございましたらご連絡ください。直ちに削除・閉鎖いたします。",
  },
  ko: {
    htmlLang: "ko",
    title: "행운의 명태를 낚아 올려요",
    description: "Apink 15주년! Apink와 함께 행운의 명태를 낚아 올려 귀여운 명태를 Panda에게 전해요!",
    languageLabel: "언어",
    languageAuto: "자동",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    backToGame: "야구 게임으로 돌아가기",
    kicker: "Apink 15주년 응원",
    heading: "행운의 명태를 낚아 올려요",
    intro: "Apink가 Panda에게 한국의 행복 행운 명태를 선물하고 싶대요! 함께 명태를 낚아 올려 귀여운 명태를 Panda에게 전해요!",
    timerLabel: "남은 시간",
    countLabel: "낚은 수",
    startTitle: "행운의 명태를 낚아 올려요",
    startBadge: "Apink 15주년 응원",
    startRule1: "낚싯대는 <strong>자동으로 던져져요</strong>. 찌가 가라앉으며 \"<strong>!</strong>\"가 뜨면 재빨리 바다를 탭해 <strong>낚아 올리세요</strong>! 너무 빠르면 놀라서 도망가고, 늦어도 도망가요.",
    startRule2: "게임마다 Ping Doongs 낚시꾼 한 명이 무작위로 선택돼요. 낚시꾼과<strong>같은 색</strong>의 명태를 잡으면 <strong>10점 보너스</strong>! 60초 동안 최대한 많이 낚아 보세요.",
    anglerBadge: "이번 낚시꾼: {name} Ping Doongs · 같은 색 +10",
    anglerAlt: "배에서 낚시하는 {name} Ping Doongs",
    startButton: "낚시 시작",
    statusCast: "던지는 중...",
    statusWaiting: "입질을 기다리는 중...",
    statusPull: "지금이야! 당겨요!",
    statusStruggle: "물고기가 버텨요! 빠르게 연타해서 끌어올려요!",
    popEarly: "너무 빨라요! 놀라서 도망갔어요",
    popMiss: "도망갔어요...",
    popEscape: "빠져나갔어요...",
    popCatch: "잡았다!",
    popDoubleCatch: "더블! 한 번에 두 마리!",
    popColorBonus: "같은 색 명태 보너스 +10!",
    popSpeedBonus: "⚡ 스피드 보너스 +1",
    popJumpCatch: "공중 캐치 {name}! +{points}점",
    popJumpColorCatch: "같은 색 {name} 공중 캐치! +10, 총 {points}점",
    scoreLabel: "점수",
    endScore: "총점: {score}점",
    modeLabel: "난이도 선택",
    modeEasy: "초급",
    modeEasyDesc: "\"!\"가 뜨면 한 번 탭",
    modePro: "고급",
    modeProDesc: "탈출 시간 랜덤, 연타로 낚고 빠르면 보너스",
    endTitle: "타임 업!",
    endCount: "행운의 명태를 {count}마리 낚았어요!",
    endCountZero: "이번엔 물고기가 수줍었나 봐요. 다시 도전!",
    luckyTitle: "당신의 행운 명태",
    endBonus: "🎉 다섯 멤버 명태 컬렉션 완성! Apink 15주년 축하해요, Panda는 영원히 함께!",
    member_rong: "초롱",
    member_bomi: "보미",
    member_enji: "은지",
    member_najoo: "남주",
    member_hayoung: "하영",
    blessing_rong: "초롱의 행운: 당신의 소원은 네잎클로버처럼 조용히 이루어져요 🍀",
    blessing_bomi: "보미의 행운: 미소 만점! 오늘의 행운은 전부 당신 거예요 😆",
    blessing_enji: "은지의 행운: 그녀의 목소리처럼 따뜻한 하루, 용기 가득 정면 승부 🔥",
    blessing_najoo: "남주의 행운: 반짝이는 당신, 앞으로의 날들은 더 빛날 거예요 ✨",
    blessing_hayoung: "하영의 행운: 에너지 풀충전! 15주년에도 같이 달려요 💖",
    handlePlaceholder: "IG 또는 Threads 계정을 입력",
    submitScore: "점수 제출",
    cheerPlaceholder: "15주년 축하 메시지를 남겨 주세요...",
    cheerSubmit: "축하 보내기",
    playAgain: "다시 하기",
    leaderboardLink: "랭킹",
    noticeHandleRequired: "IG 또는 Threads 계정을 입력해 주세요!",
    noticeCheerRequired: "축하 메시지를 입력해 주세요!",
    noticeScoreSubmitted: "점수를 제출했어요!",
    noticeCheerSubmitted: "축하 메시지를 보냈어요. 고마워요!",
    sending: "전송 중...",
    anonymous: "익명",
    disclaimer: "📌 본 이벤트는 팬들이 자발적으로 진행하는 응원 활동이며, 어떠한 상업적 판매도 하지 않고 공식 주최 측과 무관합니다. 권리 침해가 있을 경우 알려주시면 즉시 삭제 및 폐쇄하겠습니다.",
  },
};

const interpolate = (template, values = {}) =>
  String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

class FishGame {
  constructor() {
    this.sea = document.querySelector("#fishSea");
    this.rod = document.querySelector("#fishAngler");
    this.anglerBadge = document.querySelector("#fishAnglerBadge");
    this.bobber = document.querySelector("#fishBobber");
    this.line = document.querySelector("#fishLine");
    this.exclaim = document.querySelector("#fishExclaim");
    this.catchFly = document.querySelector("#fishCatchFly");
    this.popNode = document.querySelector("#fishPop");
    this.statusNode = document.querySelector("#fishStatus");
    this.timerNode = document.querySelector("#fishTimer");
    this.countNode = document.querySelector("#fishCount");
    this.startOverlay = document.querySelector("#fishStartOverlay");
    this.startButton = document.querySelector("#fishStartButton");
    this.endOverlay = document.querySelector("#fishEndOverlay");
    this.catchCard = document.querySelector("#fishCatchCard");
    this.noticeToast = document.querySelector("#fishNoticeToast");
    this.noticeToastText = document.querySelector("#fishNoticeToastText");

    this.phase = "ready"; // ready | idle | waiting | bite | struggle | resolving | ended
    this.mode = "easy"; // easy | pro
    this.timeLeft = GAME_DURATION_S;
    this.caught = []; // every catch, in order (member keys)
    this.score = 0; // 每隻 1 分；與本局釣手同色時該魚再加 10 分，另計速度分
    this.anglerMember = FISH_MEMBERS[0];
    this.struggleRequired = 0;
    this.struggleProgress = 0;
    this.struggleWindowMs = STRUGGLE_WINDOW_MAX_MS;
    this.struggleStartAt = 0;
    this.struggleDeadline = 0;
    this.struggleIntervalId = null;
    this.struggleNode = document.querySelector("#fishStruggle");
    this.struggleFill = document.querySelector("#fishStruggleFill");
    this.struggleTimerFill = document.querySelector("#fishStruggleTimerFill");
    this.jumpFish = document.querySelector("#fishJump");
    this.jumpActive = false;
    this.jumpMember = null;
    this.jumpTimeoutId = null;
    this.jumpHideTimeoutId = null;
    this.timerId = null;
    this.biteTimeoutId = null;
    this.missTimeoutId = null;
    this.resolveTimeoutId = null;
    this.noticeTimeoutId = null;
    this.popTimeoutId = null;
    this.audioContext = null;
    this.locale = "zh";
    this.languageMode = "auto";
    this.currentStatusKey = "statusCast";
    this.scoreSubmitted = false;
  }

  t(key, values = {}) {
    return interpolate(fishI18n[this.locale]?.[key] ?? fishI18n.zh[key] ?? key, values);
  }

  // ---------- locale ----------
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
    let stored = "auto";
    try {
      stored = localStorage.getItem(languageStorageKey);
    } catch (e) { }
    return ["auto", "zh", "en", "ja", "ko"].includes(stored) ? stored : "auto";
  }

  setText(selector, key, values = {}) {
    const element = document.querySelector(selector);
    if (element) element.textContent = this.t(key, values);
  }

  setHtml(selector, key) {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = this.t(key);
  }

  applyLocale(mode = this.readLanguageMode()) {
    this.languageMode = ["auto", "zh", "en", "ja", "ko"].includes(mode) ? mode : "auto";
    this.locale = this.languageMode === "auto" ? this.detectBrowserLocale() : this.languageMode;
    const copy = fishI18n[this.locale] ?? fishI18n.zh;

    document.documentElement.lang = copy.htmlLang;
    document.title = this.t("title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", this.t("description"));

    const select = document.querySelector("#fishLanguageSelect");
    if (select) {
      select.value = this.languageMode;
      select.querySelector('option[value="auto"]').textContent = this.t("languageAuto");
      select.querySelector('option[value="zh"]').textContent = this.t("languageZh");
      select.querySelector('option[value="en"]').textContent = this.t("languageEn");
      select.querySelector('option[value="ja"]').textContent = this.t("languageJa");
      select.querySelector('option[value="ko"]').textContent = this.t("languageKo");
    }

    this.setText("#fishLanguageLabel", "languageLabel");
    this.setText("#fishBackToGameLink", "backToGame");
    this.setText("#fishKicker", "kicker");
    this.setText("#fishTitle", "heading");
    this.setText("#fishIntro", "intro");
    this.setText("#fishTimerLabel", "timerLabel");
    this.setText("#fishCountLabel", "countLabel");
    this.setText("#fishScoreLabel", "scoreLabel");
    this.setText("#fishStartTitle", "startTitle");
    this.setText("#fishStartBadge", "startBadge");
    this.setHtml("#fishStartRule1", "startRule1");
    this.setHtml("#fishStartRule2", "startRule2");
    this.setText("#fishModeLabel", "modeLabel");
    this.setText("#fishModeEasyName", "modeEasy");
    this.setText("#fishModeEasyDesc", "modeEasyDesc");
    this.setText("#fishModeProName", "modePro");
    this.setText("#fishModeProDesc", "modeProDesc");
    this.setText("#fishStruggleLabel", "statusStruggle");
    this.setText("#fishStartButton", "startButton");
    this.setText("#fishEndTitle", "endTitle");
    this.setText("#fishLuckyTitle", "luckyTitle");
    this.setText("#fishSubmitScoreButton", "submitScore");
    this.setText("#fishCheerSubmitButton", "cheerSubmit");
    this.setText("#fishPlayAgainButton", "playAgain");
    this.setText("#fishDisclaimer", "disclaimer");
    document.querySelector("#fishHandleInput")?.setAttribute("placeholder", this.t("handlePlaceholder"));
    document.querySelector("#fishCheerInput")?.setAttribute("placeholder", this.t("cheerPlaceholder"));
    document.querySelectorAll(".fish-dex-slot").forEach((img) => {
      img.alt = this.t(`member_${img.dataset.member}`);
    });
    this.updateAngler();
    if (this.currentStatusKey) this.setText("#fishStatus", this.currentStatusKey);
  }

  updateAngler() {
    const name = this.t(`member_${this.anglerMember}`);
    if (this.rod) {
      this.rod.src = anglerImage(this.anglerMember);
      this.rod.alt = this.t("anglerAlt", { name });
    }
    if (this.anglerBadge) {
      this.anglerBadge.textContent = this.t("anglerBadge", { name });
    }
  }

  chooseAngler() {
    this.anglerMember = FISH_MEMBERS[Math.floor(Math.random() * FISH_MEMBERS.length)];
    this.updateAngler();
  }

  pointsForFish(member, basePoints = 1) {
    return basePoints + (member === this.anglerMember ? MATCHING_COLOR_BONUS : 0);
  }

  setStatus(key) {
    this.currentStatusKey = key;
    this.statusNode.textContent = this.t(key);
  }

  // ---------- audio ----------
  getAudioContext() {
    if (!this.audioContext) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) this.audioContext = new Ctx();
    }
    if (this.audioContext?.state === "suspended") this.audioContext.resume();
    return this.audioContext;
  }

  playTone(freq, durationMs, { type = "sine", gain = 0.12, delayMs = 0 } = {}) {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const start = ctx.currentTime + delayMs / 1000;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    amp.gain.setValueAtTime(gain, start);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + durationMs / 1000);
    osc.connect(amp).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + durationMs / 1000 + 0.05);
  }

  playSplash() {
    this.playTone(320, 120, { type: "triangle", gain: 0.08 });
    this.playTone(180, 180, { type: "sine", gain: 0.07, delayMs: 60 });
  }

  playBite() {
    this.playTone(880, 90, { type: "square", gain: 0.09 });
    this.playTone(1180, 120, { type: "square", gain: 0.09, delayMs: 90 });
  }

  playCatch() {
    [523, 659, 784, 1047].forEach((freq, index) => {
      this.playTone(freq, 140, { type: "triangle", gain: 0.1, delayMs: index * 80 });
    });
  }

  playMiss() {
    this.playTone(300, 160, { type: "sawtooth", gain: 0.06 });
    this.playTone(220, 220, { type: "sawtooth", gain: 0.06, delayMs: 120 });
  }

  playEnd() {
    [784, 659, 523, 659, 784, 1047].forEach((freq, index) => {
      this.playTone(freq, 150, { type: "triangle", gain: 0.09, delayMs: index * 110 });
    });
  }

  // ---------- game flow ----------
  bind() {
    this.startButton.addEventListener("click", () => this.startGame());
    this.sea.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button, a, input, .start-overlay, .fish-end-overlay")) return;
      // 先判定是否點中躍出水面的跳魚
      if (this.jumpActive && event.target.closest("#fishJump")) {
        this.catchJumpFish();
        return;
      }
      this.handleTap();
    });
    this.jumpFish?.addEventListener("pointerdown", (event) => {
      if (!this.jumpActive) return;
      event.stopPropagation();
      this.catchJumpFish();
    });
    window.addEventListener("keydown", (event) => {
      const activeEl = document.activeElement;
      if (activeEl && ["INPUT", "TEXTAREA", "BUTTON"].includes(activeEl.tagName)) return;
      if (event.code !== "Space" && event.code !== "Enter") return;
      event.preventDefault();
      if (this.phase === "ready" || this.phase === "ended") {
        if (this.startOverlay.classList.contains("is-visible")) this.startGame();
        return;
      }
      this.handleTap();
    });

    document.querySelector("#fishLanguageSelect")?.addEventListener("change", (event) => {
      try {
        localStorage.setItem(languageStorageKey, event.target.value);
      } catch (e) { }
      this.applyLocale(event.target.value);
    });
    document.querySelectorAll(".fish-mode-option").forEach((button) => {
      button.addEventListener("pointerdown", (event) => event.stopPropagation());
      button.addEventListener("click", () => this.selectMode(button.dataset.mode));
    });
    document.querySelector("#fishSubmitScoreButton")?.addEventListener("click", () => this.submitScore());
    document.querySelector("#fishCheerSubmitButton")?.addEventListener("click", () => this.submitCheer());
    document.querySelector("#fishPlayAgainButton")?.addEventListener("click", () => this.showStartScreen());
  }

  showStartScreen() {
    // 「再玩一次」回到難度選擇畫面，讓玩家重選難度再開始
    this.clearTimers();
    this.phase = "ready";
    this.timeLeft = GAME_DURATION_S;
    this.caught = [];
    this.score = 0;
    this.scoreSubmitted = false;
    this.jumpActive = false;
    this.updateHud();
    document.querySelectorAll(".fish-dex-slot").forEach((img) => img.classList.remove("is-caught"));
    this.resetSeaVisuals();
    this.catchCard.classList.remove("is-visible");
    this.endOverlay.classList.remove("is-visible");
    this.endOverlay.setAttribute("aria-hidden", "true");
    this.startOverlay.classList.add("is-visible");
    this.startOverlay.setAttribute("aria-hidden", "false");
    this.setStatus("statusCast");
  }

  startGame() {
    this.getAudioContext();
    this.clearTimers();
    this.chooseAngler();
    this.phase = "idle";
    this.timeLeft = GAME_DURATION_S;
    this.caught = [];
    this.score = 0;
    this.scoreSubmitted = false;
    this.updateHud();
    document.querySelectorAll(".fish-dex-slot").forEach((img) => img.classList.remove("is-caught"));
    this.startOverlay.classList.remove("is-visible");
    this.startOverlay.setAttribute("aria-hidden", "true");
    this.endOverlay.classList.remove("is-visible");
    this.endOverlay.setAttribute("aria-hidden", "true");
    this.catchCard.classList.remove("is-visible");
    this.resetSeaVisuals();
    this.setStatus("statusCast");
    this.jumpActive = false;
    this.jumpFish?.classList.remove("is-jumping");
    this.timerId = window.setInterval(() => this.tick(), 1000);
    // 自動拋竿：玩家只需要在「!」出現時拉竿
    this.resolveTimeoutId = window.setTimeout(() => this.cast(), 600);
    this.scheduleJump();
  }

  tick() {
    this.timeLeft -= 1;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.updateHud();
      this.endGame();
      return;
    }
    this.updateHud();
  }

  updateHud() {
    this.timerNode.textContent = String(this.timeLeft);
    this.countNode.textContent = String(this.caught.length);
    const scoreNode = document.querySelector("#fishScore");
    if (scoreNode) scoreNode.textContent = String(this.score);
    this.timerNode.parentElement.classList.toggle("is-urgent", this.timeLeft <= 10 && this.phase !== "ended");
  }

  resetSeaVisuals() {
    this.bobber.classList.remove("is-cast", "is-bite");
    this.line.classList.remove("is-cast");
    this.exclaim.classList.remove("is-visible");
    this.catchFly.classList.remove("is-flying");
    this.struggleNode?.classList.remove("is-visible");
    this.jumpActive = false;
    this.jumpFish?.classList.remove("is-jumping");
    this.setRodState(null);
  }

  setRodState(state) {
    if (!this.rod) return;
    this.rod.classList.remove("is-casting", "is-bite", "is-catch");
    if (!state) return;
    this.rod.offsetHeight; // restart animation when re-applying the same state
    this.rod.classList.add(state);
  }

  handleTap() {
    if (this.phase === "waiting") {
      this.scare();
    } else if (this.phase === "bite") {
      if (this.mode === "pro") {
        this.startStruggle();
      } else {
        this.catchFish();
      }
    } else if (this.phase === "struggle") {
      this.struggleTap();
    }
  }

  selectMode(mode) {
    if (!["easy", "pro"].includes(mode)) return;
    if (this.phase !== "ready" && this.phase !== "ended") return;
    this.mode = mode;
    document.querySelectorAll(".fish-mode-option").forEach((button) => {
      const selected = button.dataset.mode === mode;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", selected ? "true" : "false");
    });
  }

  gameKey() {
    return this.mode === "pro" ? "fish_pro" : "fish";
  }

  cacheKey(kind) {
    return this.mode === "pro"
      ? `apink_fish_pro_${kind}`
      : `apink_fish_${kind}`;
  }

  startStruggle() {
    window.clearTimeout(this.missTimeoutId);
    this.phase = "struggle";
    // 掙脫倒數隨機：時間短的回合需要的下數較少，但每秒要點更快
    this.struggleWindowMs =
      STRUGGLE_WINDOW_MIN_MS + Math.random() * (STRUGGLE_WINDOW_MAX_MS - STRUGGLE_WINDOW_MIN_MS);
    const tapsPerSecond =
      STRUGGLE_TAPS_PER_S_MIN + Math.random() * (STRUGGLE_TAPS_PER_S_MAX - STRUGGLE_TAPS_PER_S_MIN);
    this.struggleRequired = Math.max(6, Math.round((this.struggleWindowMs / 1000) * tapsPerSecond));
    this.struggleProgress = 1; // 第一下(上鉤那一點)也算
    this.struggleStartAt = performance.now();
    this.struggleDeadline = this.struggleStartAt + this.struggleWindowMs;
    this.exclaim.classList.remove("is-visible");
    this.struggleNode.classList.add("is-visible");
    this.setStatus("statusStruggle");
    this.playBite();
    this.updateStruggleUI();
    window.clearInterval(this.struggleIntervalId);
    this.struggleIntervalId = window.setInterval(() => {
      if (this.phase !== "struggle") return;
      // 魚掙扎：進度隨時間流失
      this.struggleProgress = Math.max(0, this.struggleProgress - STRUGGLE_DECAY_PER_S / 10);
      this.updateStruggleUI();
      if (performance.now() >= this.struggleDeadline) {
        this.struggleEscape();
      }
    }, 100);
  }

  struggleTap() {
    this.struggleProgress += 1;
    this.playTone(520 + this.struggleProgress * 24, 60, { type: "square", gain: 0.06 });
    try {
      navigator.vibrate?.(18);
    } catch (e) { }
    this.updateStruggleUI();
    if (this.struggleProgress >= this.struggleRequired) {
      const elapsed = performance.now() - this.struggleStartAt;
      const bonus = elapsed <= this.struggleWindowMs * SPEED_BONUS_RATIO ? 1 : 0;
      this.endStruggle();
      this.catchFish(bonus);
    }
  }

  updateStruggleUI() {
    if (!this.struggleFill) return;
    const ratio = Math.min(1, this.struggleProgress / this.struggleRequired);
    this.struggleFill.style.width = `${Math.round(ratio * 100)}%`;
    if (this.struggleTimerFill) {
      const remain = Math.max(0, this.struggleDeadline - performance.now());
      this.struggleTimerFill.style.width = `${Math.round((remain / this.struggleWindowMs) * 100)}%`;
    }
  }

  endStruggle() {
    window.clearInterval(this.struggleIntervalId);
    this.struggleIntervalId = null;
    this.struggleNode.classList.remove("is-visible");
  }

  struggleEscape() {
    this.endStruggle();
    this.resolve("popEscape");
  }

  cast() {
    if (this.phase !== "idle" || this.timeLeft <= 0) return;
    this.phase = "waiting";
    this.setRodState("is-casting");
    window.setTimeout(() => {
      if (this.phase === "waiting") this.setRodState(null); // 甩竿完回到待機輕晃
    }, 520);
    this.bobber.classList.add("is-cast");
    this.line.classList.add("is-cast");
    this.playSplash();
    this.setStatus("statusWaiting");
    const waitMs = 1500 + Math.random() * 2500;
    this.biteTimeoutId = window.setTimeout(() => this.bite(), waitMs);
  }

  bite() {
    if (this.phase !== "waiting") return;
    // 時機錯開：若這時剛好有魚在空中，先等牠落回再上鉤，別讓兩件事撞在一起
    if (this.jumpActive) {
      this.biteTimeoutId = window.setTimeout(() => this.bite(), 400);
      return;
    }
    this.phase = "bite";
    this.setRodState("is-bite");
    this.bobber.classList.add("is-bite");
    this.exclaim.classList.add("is-visible");
    this.playBite();
    try {
      navigator.vibrate?.(90);
    } catch (e) { }
    this.setStatus("statusPull");
    this.missTimeoutId = window.setTimeout(() => this.miss(), BITE_WINDOW_MS);
  }

  scare() {
    window.clearTimeout(this.biteTimeoutId);
    this.resolve("popEarly");
  }

  miss() {
    if (this.phase !== "bite") return;
    this.resolve("popMiss");
  }

  resolve(popKey) {
    this.phase = "resolving";
    this.playMiss();
    this.pop(this.t(popKey));
    this.resetSeaVisuals();
    this.resolveTimeoutId = window.setTimeout(() => {
      if (this.phase !== "resolving") return;
      this.phase = "idle";
      this.setStatus("statusCast");
      this.cast();
    }, 650);
  }

  catchFish(bonus = 0) {
    window.clearTimeout(this.missTimeoutId);
    this.phase = "resolving";
    // 幸運時一竿雙魚（成員可重複）
    const members = [FISH_MEMBERS[Math.floor(Math.random() * FISH_MEMBERS.length)]];
    if (Math.random() < DOUBLE_CATCH_CHANCE) {
      members.push(FISH_MEMBERS[Math.floor(Math.random() * FISH_MEMBERS.length)]);
    }
    members.forEach((member) => this.caught.push(member));
    const matchingCount = members.filter((member) => member === this.anglerMember).length;
    const gained = members.reduce((points, member) => points + this.pointsForFish(member), 0) + bonus;
    this.score += gained;
    this.updateHud();
    this.playCatch();
    this.pop(members.length > 1 ? this.t("popDoubleCatch") : this.t("popCatch"));
    let nextPopDelay = 500;
    if (matchingCount > 0) {
      window.setTimeout(() => this.pop(this.t("popColorBonus")), nextPopDelay);
      nextPopDelay += 500;
    }
    if (bonus > 0) window.setTimeout(() => this.pop(this.t("popSpeedBonus")), nextPopDelay);

    members.forEach((member) => {
      document.querySelector(`.fish-dex-slot[data-member="${member}"]`)?.classList.add("is-caught");
    });

    this.exclaim.classList.remove("is-visible");
    this.bobber.classList.remove("is-cast", "is-bite");
    this.line.classList.remove("is-cast");
    this.setRodState("is-catch");
    this.catchFly.src = fishImage(members[0]);
    this.catchFly.classList.remove("is-flying");
    this.catchFly.offsetHeight;
    this.catchFly.classList.add("is-flying");

    const cardImg = document.querySelector("#fishCatchCardImg");
    cardImg.src = fishImage(members[0]);
    cardImg.alt = this.t(`member_${members[0]}`);
    const cardImg2 = document.querySelector("#fishCatchCardImg2");
    if (cardImg2) {
      if (members[1]) {
        cardImg2.src = fishImage(members[1]);
        cardImg2.alt = this.t(`member_${members[1]}`);
        cardImg2.hidden = false;
      } else {
        cardImg2.hidden = true;
      }
    }
    document.querySelector("#fishCatchCardName").textContent = members
      .map((member) => `${this.t(`member_${member}`)}${member === this.anglerMember ? " +10" : ""}`)
      .join(" & ");
    const cardPlus = document.querySelector("#fishCatchCardPlus");
    if (cardPlus) cardPlus.textContent = `+${gained}`;
    this.catchCard.classList.add("is-visible");

    this.resolveTimeoutId = window.setTimeout(() => {
      if (this.phase !== "resolving") return;
      this.catchCard.classList.remove("is-visible");
      this.catchFly.classList.remove("is-flying");
      this.phase = "idle";
      this.setStatus("statusCast");
      this.cast();
    }, 1400);
  }

  pop(text) {
    window.clearTimeout(this.popTimeoutId);
    this.popNode.textContent = text;
    this.popNode.classList.remove("is-visible");
    this.popNode.offsetHeight;
    this.popNode.classList.add("is-visible");
    this.popTimeoutId = window.setTimeout(() => this.popNode.classList.remove("is-visible"), 900);
  }

  clearTimers() {
    window.clearInterval(this.timerId);
    window.clearInterval(this.struggleIntervalId);
    window.clearTimeout(this.biteTimeoutId);
    window.clearTimeout(this.missTimeoutId);
    window.clearTimeout(this.resolveTimeoutId);
    window.clearTimeout(this.jumpTimeoutId);
    window.clearTimeout(this.jumpHideTimeoutId);
    window.clearTimeout(this.popTimeoutId);
  }

  scheduleJump() {
    window.clearTimeout(this.jumpTimeoutId);
    this.jumpTimeoutId = window.setTimeout(
      () => this.jumpFishNow(),
      JUMP_INTERVAL_MIN_MS + Math.random() * (JUMP_INTERVAL_MAX_MS - JUMP_INTERVAL_MIN_MS),
    );
  }

  jumpFishNow() {
    if (this.phase === "ended" || this.timeLeft <= 0 || !this.jumpFish) return;
    // 時機錯開：玩家正在上鉤/拉扯/收線時不讓魚跳出來，稍後再試，避免同時要兩件事
    if (this.phase === "bite" || this.phase === "struggle" || this.phase === "resolving") {
      this.jumpTimeoutId = window.setTimeout(() => this.jumpFishNow(), 900);
      return;
    }
    this.jumpMember = FISH_MEMBERS[Math.floor(Math.random() * FISH_MEMBERS.length)];
    this.jumpFish.src = fishImage(this.jumpMember);
    // 只在左右邊帶躍出，讓魚身避開中央釣魚區（浮標約 46%~54%），兩者互不干擾。
    // 依實際魚寬換算，窄螢幕上魚較寬時也不會壓到中間。
    const seaW = this.sea.offsetWidth || 1;
    const fishWpct = ((this.jumpFish.offsetWidth || 92) / seaW) * 100;
    let leftPct;
    if (Math.random() < 0.5) {
      const maxLeft = Math.max(2, 42 - fishWpct); // 左側：右緣不越過 42%
      leftPct = 2 + Math.random() * (maxLeft - 2);
    } else {
      const minLeft = 58;                          // 右側：左緣不低於 58%
      const maxLeft = Math.max(minLeft, 100 - fishWpct);
      leftPct = minLeft + Math.random() * (maxLeft - minLeft);
    }
    this.jumpFish.style.left = `${leftPct}%`;
    this.jumpActive = true;
    this.jumpFish.classList.remove("is-jumping");
    this.jumpFish.offsetHeight;
    this.jumpFish.classList.add("is-jumping");
    this.playSplash();
    this.jumpHideTimeoutId = window.setTimeout(() => {
      this.jumpActive = false;
      this.jumpFish.classList.remove("is-jumping");
      this.scheduleJump();
    }, JUMP_VISIBLE_MS);
  }

  catchJumpFish() {
    if (!this.jumpActive || this.phase === "ended") return;
    this.jumpActive = false;
    window.clearTimeout(this.jumpHideTimeoutId);
    const member = this.jumpMember;
    this.jumpFish.classList.remove("is-jumping");
    this.caught.push(member);
    const gained = this.pointsForFish(member, JUMP_CATCH_POINTS);
    this.score += gained;
    this.updateHud();
    document.querySelector(`.fish-dex-slot[data-member="${member}"]`)?.classList.add("is-caught");
    this.playCatch();
    try {
      navigator.vibrate?.(40);
    } catch (e) { }
    const popKey = member === this.anglerMember ? "popJumpColorCatch" : "popJumpCatch";
    this.pop(this.t(popKey, { name: this.t(`member_${member}`), points: gained }));
    this.scheduleJump();
  }

  endGame() {
    this.clearTimers();
    this.phase = "ended";
    this.resetSeaVisuals();
    this.catchCard.classList.remove("is-visible");
    this.playEnd();

    const count = this.caught.length;
    document.querySelector("#fishEndCount").textContent =
      count > 0 ? this.t("endCount", { count }) : this.t("endCountZero");
    const endScore = document.querySelector("#fishEndScore");
    if (endScore) {
      endScore.textContent = count > 0 ? this.t("endScore", { score: this.score }) : "";
      endScore.hidden = count === 0;
    }

    const endDex = document.querySelector("#fishEndDex");
    endDex.innerHTML = "";
    const caughtSet = new Set(this.caught);
    FISH_MEMBERS.forEach((member) => {
      const img = document.createElement("img");
      img.src = fishImage(member);
      img.alt = this.t(`member_${member}`);
      img.className = "fish-dex-slot";
      if (caughtSet.has(member)) img.classList.add("is-caught");
      endDex.appendChild(img);
    });

    const lucky = document.querySelector("#fishLucky");
    if (count > 0) {
      const luckyMember = this.caught[Math.floor(Math.random() * this.caught.length)];
      document.querySelector("#fishLuckyImg").src = fishImage(luckyMember);
      document.querySelector("#fishLuckyImg").alt = this.t(`member_${luckyMember}`);
      document.querySelector("#fishLuckyName").textContent = this.t(`member_${luckyMember}`);
      document.querySelector("#fishLuckyBlessing").textContent = this.t(`blessing_${luckyMember}`);
      lucky.hidden = false;
    } else {
      lucky.hidden = true;
    }

    const bonus = document.querySelector("#fishEndBonus");
    if (caughtSet.size === FISH_MEMBERS.length) {
      bonus.textContent = this.t("endBonus");
      bonus.hidden = false;
    } else {
      bonus.hidden = true;
    }

    const handleInput = document.querySelector("#fishHandleInput");
    try {
      const saved = localStorage.getItem("apink_my_handle");
      if (saved && handleInput && !handleInput.value) handleInput.value = saved;
    } catch (e) { }

    this.endOverlay.classList.add("is-visible");
    this.endOverlay.setAttribute("aria-hidden", "false");
  }

  // ---------- notices ----------
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

  // ---------- leaderboard (fish 專用，與棒球分開) ----------
  async submitScore() {
    const input = document.querySelector("#fishHandleInput");
    const button = document.querySelector("#fishSubmitScoreButton");
    const handle = String(input?.value || "").trim();
    if (!handle) {
      this.showNotice(this.t("noticeHandleRequired"));
      return;
    }
    if (this.scoreSubmitted) {
      this.showNotice(this.t("noticeScoreSubmitted"));
      return;
    }

    try {
      localStorage.setItem("apink_my_handle", handle);
    } catch (e) { }

    // local fallback cache (初級/高級各自獨立，也與棒球的 apink_leaderboard 分開)
    try {
      const cached = JSON.parse(localStorage.getItem(this.cacheKey("leaderboard")) || "[]");
      const existing = cached.find((item) => item.handle === handle);
      if (existing) {
        existing.score = Math.max(Number(existing.score) || 0, this.score);
      } else {
        cached.push({ handle, score: this.score });
      }
      localStorage.setItem(this.cacheKey("leaderboard"), JSON.stringify(cached));
    } catch (e) { }

    if (button) {
      button.disabled = true;
      button.textContent = this.t("sending");
    }
    try {
      const game = this.gameKey();
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ handle, score: this.score, game }),
      });
      const resData = await response.json();
      // 只有在後端明確回聲對應的 game 時才採信（舊版後端會誤回棒球資料）
      if (resData?.game === game && resData?.leaderboard) {
        try {
          localStorage.setItem(this.cacheKey("leaderboard"), JSON.stringify(resData.leaderboard));
        } catch (e) { }
      }
    } catch (e) {
      console.warn("Fish score submit failed, kept local fallback:", e);
    }
    if (button) {
      button.disabled = false;
      button.textContent = this.t("submitScore");
    }
    this.scoreSubmitted = true;
    this.showNotice(this.t("noticeScoreSubmitted"));
  }

  async submitCheer() {
    const input = document.querySelector("#fishCheerInput");
    const message = String(input?.value || "").trim();
    if (!message) {
      this.showNotice(this.t("noticeCheerRequired"));
      return;
    }
    const handle =
      String(document.querySelector("#fishHandleInput")?.value || "").trim() || this.t("anonymous");

    try {
      const cached = JSON.parse(localStorage.getItem(this.cacheKey("cheers")) || "[]");
      cached.push({ handle, message, time: new Date().toISOString() });
      localStorage.setItem(this.cacheKey("cheers"), JSON.stringify(cached));
    } catch (e) { }

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ handle, score: this.score, message, game: this.gameKey() }),
      });
    } catch (e) {
      console.warn("Fish cheer submit failed, kept local fallback:", e);
    }
    if (input) input.value = "";
    this.showNotice(this.t("noticeCheerSubmitted"));
  }

  start() {
    this.applyLocale();
    this.bind();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.fishGame = new FishGame();
  window.fishGame.start();
});
