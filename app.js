const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwJssnwqL636-7t1P2LtspixCWvdm4ffMhQxmAYDB62f4Y2BwvgmxRryl-nbN3Qsu6P/exec"; // Provide your Google Apps Script Web App URL here
const spriteAssetVersion = "webp-assets-7";
const framePath = (folder, name, index) =>
  `./assets/${folder}/${name}_${String(index).padStart(2, "0")}.webp?v=${spriteAssetVersion}`;
const frameList = (folder, name, count) =>
  Array.from({ length: count }, (_, index) => framePath(folder, name, index + 1));

const bomiFrames = frameList("bomi_throw_frames", "bomi_throw", 10);

// batterScale 以 chorong 熊貓的角色高度(324px)為基準:324 / 該成員角色高度
const MEMBERS = {
  rong: {
    swing: frameList("chorong_swing_frames", "chorong_swing", 10),
    cheer: frameList("chorong_support_frames", "chorong_support", 10),
    swingSequence: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    activeSwingFrames: [3, 4, 5, 6],
    batterScale: 1,
  },
  enji: {
    swing: frameList("enji_swing_frames", "enji_swing", 8),
    cheer: frameList("enji_support_happy_frames", "enji_support_happy", 10),
    swingSequence: [0, 1, 2, 3, 4, 5, 6, 7],
    activeSwingFrames: [2, 3, 4, 5],
    batterScale: 1.1,
  },
  najoo: {
    swing: frameList("najoo_swing_frames", "najoo_swing", 10),
    cheer: frameList("najoo_support_frames", "najoo_support", 10),
    swingSequence: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    activeSwingFrames: [3, 4, 5, 6],
    // najoo 揮棒幀已重組為 chorong 尺寸基準，不需再縮放
    batterScale: 1,
  },
  hayoung: {
    swing: frameList("hayoung_swing_frames", "hayoung_swing", 10),
    cheer: frameList("hayoung_support_frames", "hayoung_support", 10),
    swingSequence: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    activeSwingFrames: [3, 4, 5, 6],
    batterScale: 1.25,
  },
};
const MEMBER_KEYS = Object.keys(MEMBERS);

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (from, to, t) => from + (to - from) * t;
const languageStorageKey = "apink_language_preference";

const i18n = {
  zh: {
    htmlLang: "zh-Hant",
    title: "Apink 台北大巨蛋應援打擊小遊戲",
    metaDescription: "韓流傳奇女團 Apink 登陸臺北大巨蛋！7月31日新光亞洲音樂祭首發演出，參與趣味棒球打擊應援小遊戲，為你的偶像送上最熱烈的加油應援與祝福！",
    languageLabel: "語言",
    languageAuto: "自動",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    promoAria: "活動宣傳資訊",
    promoBadge: "⭐️ 新光亞洲音樂祭首發卡司 ⭐️",
    promoTitle: "韓流傳奇女團<br><span class=\"highlight-pink\">Apink</span> 確定登場！",
    promoDate: "7/31(五) 臺北大巨蛋 · 味全龍主場",
    promoDesc: "韓國人氣二代女團 <strong>Apink</strong> 將擔任味全龍年度主題日<strong>「新光亞洲音樂祭」</strong>首發卡司，於 <strong>7月31日（五）</strong>登上臺北大巨蛋，帶來精彩的賽後演出！",
    promoSongsTitle: "🎵 現場經典神曲應援預熱中：",
    promoCallout: "這是一場為 Apink 大巨蛋登場所設計的<strong>棒球打擊應援小遊戲</strong>！立即揮棒打擊、挑戰排行榜，為你的 Idol 送出熱烈應援吧！",
    promoTicket: "尚未購票的朋友，也可以透過<a href=\"https://tix.wdragons.com/UTK0201_?PRODUCT_ID=P16MXT0T&amp;STARTDATE=2026/07/31\" target=\"_blank\" rel=\"noopener noreferrer\">售票網頁</a>購票，7/31 當日進場一起觀看精彩球賽與 Apink 表演！",
    leaderboardPageLink: "排行榜頁面",
    fishPageLink: "🎣 釣出幸運明太魚",
    fishSwipePageLink: "⚡ 明太魚快手捕獲戰",
    promoFooter: "* 點擊右側棒球場任意區域即可揮棒 *",
    gameAria: "Apink 棒球小遊戲",
    fieldAria: "遊戲球場",
    bsopAria: "好壞球與出局數",
    basesAria: "壘包跑者狀態",
    scoreLabel: "得分",
    statusReady: "準備",
    loading: "載入中",
    loadingEllipsis: "載入中...",
    startTitle: "遊戲規格",
    startChallenge: "一局進攻挑戰",
    startRule1: "系統會隨機派一隻熊貓上場打擊，在一局進攻局數裡挑戰 <strong>Bomi 投手</strong>，盡可能拿下最高分；每次出局、擊出安打或保送後，會隨機換一位還沒上場的熊貓接棒。",
    member_rong: "Chorong",
    member_enji: "Eunji",
    member_najoo: "Namjoo",
    member_hayoung: "Hayoung",
    popNextBatter: "{name} 上場!",
    statusNextBatter: "換 {name} 上場打擊",
    startRule2: "最高分即可記錄在排行榜裡，不限挑戰次數；挑戰完也可以寫應援的話留給大家。",
    startButton: "開始遊戲",
    gameOverTitle: "遊戲結束",
    finalScoreLabel: "總得分:",
    restart: "重新開始",
    leaderboardHandlePlaceholder: "輸入 IG 或 Threads 帳號",
    submitScore: "結算成績",
    leaderboardTitle: "台北大巨蛋 排行榜",
    myRank: "我的排名: {rank}",
    myScore: "我的分數",
    scoreUnit: "{score} 分",
    cheerTemplates: ["Apink 💖 台北大巨蛋衝呀！", "永遠支持 Apink！🐼🌸", "普美投球超帥，恩地全壘打！", "大巨蛋滿座！Apink 萬歲！"],
    cheerPlaceholder: "留下應援的話...（限200字，支援空白）",
    cheerSubmit: "送出應援",
    continueChallenge: "繼續挑戰",
    sending: "傳送中...",
    noticeHandleRequired: "請輸入 IG 或 Threads 帳號！",
    noticeCheerRequired: "請輸入應援的話！",
    noticeCheerSuccess: "應援送出成功！謝謝你的應援！",
    cheerSentMessage: "💖 已收到你的應援，謝謝你！",
    anonymous: "匿名",
    disclaimer: "📌 本活動為粉絲自發性應援，不進行任何商業販售，並與官方主辦單位無關，若有侵犯權益請告知會立即下架關閉。",
    pitchSlow: "慢速球",
    pitchFast: "快速球",
    pitchChangeup: "變速球",
    pitchDrop: "下墜球",
    pitchSinker: "伸卡球",
    pitchSlider: "滑球",
    pitchKnuckle: "蝴蝶球",
    pitchStatus: "{type} {speed} km/h",
    popFoul: "界外球",
    statusFoul: "界外球記一好球",
    popFlyout: "接殺出局",
    statusFlyout: "打擊接殺",
    hitSingle: "一壘安打",
    hitDouble: "二壘安打",
    hitTriple: "三壘安打",
    hitHr: "全壘打!",
    runsScored: "得{runs}分!",
    statusBadSwing: "壞球揮棒",
    statusGoodTake: "選球成功",
    statusSwingMiss: "揮空",
    statusNoSwing: "未揮棒",
    popOops: "啊喔",
    popNice: "Nice",
    popOut: "Out!",
    popWalk: "Walk!",
    popGameOver: "Game Over!",
    statusStrikeout: "三振出局",
    statusWalk: "四壞保送{suffix}",
    statusThreeOuts: "三人出局！",
    statusGameEnded: "遊戲結束",
  },
  en: {
    htmlLang: "en",
    title: "Apink Taipei Dome Cheer Batting Game",
    metaDescription: "K-pop legends Apink are coming to Taipei Dome on July 31 for the first Shin Kong Asia Music Festival performance. Play the baseball cheer game and send your support!",
    languageLabel: "Language",
    languageAuto: "Auto",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    promoAria: "Event information",
    promoBadge: "⭐️ Shin Kong Asia Music Festival first lineup ⭐️",
    promoTitle: "K-pop Legends<br><span class=\"highlight-pink\">Apink</span> Are Coming!",
    promoDate: "Fri 7/31 · Taipei Dome · Wei Chuan Dragons home game",
    promoDesc: "Korean second-generation girl group <strong>Apink</strong> will appear as the first lineup for the Wei Chuan Dragons theme day <strong>Shin Kong Asia Music Festival</strong>, taking the stage at <strong>Taipei Dome on July 31</strong> for a special post-game performance!",
    promoSongsTitle: "🎵 Classic fan chants warming up:",
    promoCallout: "This <strong>baseball batting cheer game</strong> is made for Apink's Taipei Dome appearance. Swing now, climb the leaderboard, and send your loudest support!",
    promoTicket: "Still need a ticket? Visit the <a href=\"https://tix.wdragons.com/UTK0201_?PRODUCT_ID=P16MXT0T&amp;STARTDATE=2026/07/31\" target=\"_blank\" rel=\"noopener noreferrer\">ticketing page</a> and join the game and Apink performance on 7/31!",
    leaderboardPageLink: "Leaderboard Page",
    fishPageLink: "🎣 Catch Your Lucky Myeongtae",
    fishSwipePageLink: "⚡ Myeongtae Swipe Catch",
    promoFooter: "* Tap anywhere on the field to swing *",
    gameAria: "Apink baseball game",
    fieldAria: "Play field",
    bsopAria: "Balls, strikes, and outs board",
    basesAria: "Base runner status",
    scoreLabel: "Score",
    statusReady: "Ready",
    loading: "Loading",
    loadingEllipsis: "Loading...",
    startTitle: "Game Rules",
    startChallenge: "One-Inning Challenge",
    startRule1: "A random panda steps up to bat. Face <strong>Bomi Pitcher</strong> in one offensive inning and score as many runs as you can. After each out, base hit, or walk, a random panda who hasn't batted yet takes over.",
    member_rong: "Chorong",
    member_enji: "Eunji",
    member_najoo: "Namjoo",
    member_hayoung: "Hayoung",
    popNextBatter: "{name} up!",
    statusNextBatter: "{name} steps up to bat",
    startRule2: "Your best score can be saved to the leaderboard. Try as many times as you like, and leave a cheer message after your challenge.",
    startButton: "Start Game",
    gameOverTitle: "Game Over",
    finalScoreLabel: "Final score:",
    restart: "Restart",
    leaderboardHandlePlaceholder: "Enter IG or Threads handle",
    submitScore: "Submit Score",
    leaderboardTitle: "Taipei Dome Leaderboard",
    myRank: "My rank: {rank}",
    myScore: "My score",
    scoreUnit: "{score} pts",
    cheerTemplates: ["Apink 💖 Let's go, Taipei Dome!", "Always supporting Apink! 🐼🌸", "Bomi pitches, Eunji homers!", "Fill the Dome! Apink forever!"],
    cheerPlaceholder: "Leave a cheer message... (200 characters max)",
    cheerSubmit: "Send Cheer",
    continueChallenge: "Try Again",
    sending: "Sending...",
    noticeHandleRequired: "Please enter your IG or Threads handle.",
    noticeCheerRequired: "Please enter a cheer message.",
    noticeCheerSuccess: "Cheer sent. Thank you!",
    cheerSentMessage: "💖 Your cheer has been received. Thank you!",
    anonymous: "Anonymous",
    disclaimer: "📌 This event is a fan-initiated support project. It does not involve any commercial sales and is not affiliated with the official organizer. If any rights are infringed, please let us know and we will take the site down immediately.",
    pitchSlow: "Slow Ball",
    pitchFast: "Fastball",
    pitchChangeup: "Changeup",
    pitchDrop: "Drop Ball",
    pitchSinker: "Sinker",
    pitchSlider: "Slider",
    pitchKnuckle: "Knuckleball",
    pitchStatus: "{type} {speed} km/h",
    popFoul: "Foul",
    statusFoul: "Foul, one strike",
    popFlyout: "Flyout",
    statusFlyout: "Flyout",
    hitSingle: "Single",
    hitDouble: "Double",
    hitTriple: "Triple",
    hitHr: "Home Run!",
    runsScored: "{runs} run(s) scored!",
    statusBadSwing: "Swung at a ball",
    statusGoodTake: "Good eye",
    statusSwingMiss: "Swing and miss",
    statusNoSwing: "No swing",
    popOops: "Oops",
    popNice: "Nice",
    popOut: "Out!",
    popWalk: "Walk!",
    popGameOver: "Game Over!",
    statusStrikeout: "Strikeout",
    statusWalk: "Walk{suffix}",
    statusThreeOuts: "Three outs!",
    statusGameEnded: "Game over",
  },
  ja: {
    htmlLang: "ja",
    title: "Apink 台北ドーム応援バッティングゲーム",
    metaDescription: "韓流レジェンドガールズグループ Apink が台北ドームに登場！7月31日の新光アジア音楽祭初回ステージに向けて、応援バッティングゲームで熱いエールを送ろう！",
    languageLabel: "言語",
    languageAuto: "自動",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    promoAria: "イベント情報",
    promoBadge: "⭐️ 新光アジア音楽祭 初回ラインナップ ⭐️",
    promoTitle: "韓流レジェンド<br><span class=\"highlight-pink\">Apink</span> 登場決定！",
    promoDate: "7/31(金) 台北ドーム · 味全ドラゴンズ主催試合",
    promoDesc: "韓国の人気第2世代ガールズグループ <strong>Apink</strong> が、味全ドラゴンズのテーマデー<strong>「新光アジア音楽祭」</strong>初回ラインナップとして、<strong>7月31日（金）</strong>に台北ドームへ登場。試合後に特別ステージを披露します！",
    promoSongsTitle: "🎵 名曲応援をウォームアップ中：",
    promoCallout: "Apink の台北ドーム登場を盛り上げる<strong>野球バッティング応援ゲーム</strong>です。今すぐスイングしてランキングに挑戦し、熱いエールを届けましょう！",
    promoTicket: "まだチケットをお持ちでない方は、<a href=\"https://tix.wdragons.com/UTK0201_?PRODUCT_ID=P16MXT0T&amp;STARTDATE=2026/07/31\" target=\"_blank\" rel=\"noopener noreferrer\">チケット販売ページ</a>から購入して、7/31 当日に試合と Apink のステージを一緒に楽しみましょう！",
    leaderboardPageLink: "ランキングページ",
    fishPageLink: "🎣 幸運ミョンテを釣ろう",
    fishSwipePageLink: "⚡ ミョンテ早取りチャレンジ",
    promoFooter: "* 右側の球場エリアをタップするとスイングできます *",
    gameAria: "Apink 野球ゲーム",
    fieldAria: "プレイフィールド",
    bsopAria: "ボール・ストライク・アウト表示",
    basesAria: "ランナー状況",
    scoreLabel: "得点",
    statusReady: "準備",
    loading: "読み込み中",
    loadingEllipsis: "読み込み中...",
    startTitle: "ゲーム説明",
    startChallenge: "1イニングチャレンジ",
    startRule1: "ランダムに選ばれたパンダ打者が、1イニングの攻撃で <strong>Bomi 投手</strong> に挑み、できるだけ多く得点しましょう。アウト・ヒット・フォアボールのたびに、まだ打っていないパンダがランダムに交代します。",
    member_rong: "チョロン",
    member_enji: "ウンジ",
    member_najoo: "ナムジュ",
    member_hayoung: "ハヨン",
    popNextBatter: "{name} 登場!",
    statusNextBatter: "{name} が打席に入ります",
    startRule2: "最高得点はランキングに記録できます。挑戦回数は無制限。挑戦後にはみんなへ応援メッセージも残せます。",
    startButton: "ゲーム開始",
    gameOverTitle: "ゲーム終了",
    finalScoreLabel: "合計得点:",
    restart: "もう一度",
    leaderboardHandlePlaceholder: "IG または Threads アカウント",
    submitScore: "成績を送信",
    leaderboardTitle: "台北ドーム ランキング",
    myRank: "自分の順位: {rank}",
    myScore: "自分の得点",
    scoreUnit: "{score} 点",
    cheerTemplates: ["Apink 💖 台北ドームへGO！", "ずっと Apink を応援！🐼🌸", "ボミの投球最高、ウンジはホームラン！", "台北ドーム満員！Apink 最高！"],
    cheerPlaceholder: "応援メッセージを残す...（200字以内）",
    cheerSubmit: "応援を送る",
    continueChallenge: "続けて挑戦",
    sending: "送信中...",
    noticeHandleRequired: "IG または Threads アカウントを入力してください。",
    noticeCheerRequired: "応援メッセージを入力してください。",
    noticeCheerSuccess: "応援を送信しました。ありがとうございます！",
    cheerSentMessage: "💖 応援を受け取りました。ありがとうございます！",
    anonymous: "匿名",
    disclaimer: "📌 本企画はファンによる自主的な応援活動であり、商業販売は一切行っておらず、公式主催者とは関係ありません。権利侵害がございましたらご連絡ください。直ちに削除・閉鎖いたします。",
    pitchSlow: "スローボール",
    pitchFast: "速球",
    pitchChangeup: "チェンジアップ",
    pitchDrop: "ドロップ",
    pitchSinker: "シンカー",
    pitchSlider: "スライダー",
    pitchKnuckle: "ナックル",
    pitchStatus: "{type} {speed} km/h",
    popFoul: "ファウル",
    statusFoul: "ファウルで1ストライク",
    popFlyout: "フライアウト",
    statusFlyout: "フライアウト",
    hitSingle: "シングルヒット",
    hitDouble: "ツーベース",
    hitTriple: "スリーベース",
    hitHr: "ホームラン!",
    runsScored: "{runs}点獲得!",
    statusBadSwing: "ボール球をスイング",
    statusGoodTake: "見極め成功",
    statusSwingMiss: "空振り",
    statusNoSwing: "見逃し",
    popOops: "あっ",
    popNice: "Nice",
    popOut: "Out!",
    popWalk: "Walk!",
    popGameOver: "Game Over!",
    statusStrikeout: "三振アウト",
    statusWalk: "フォアボール{suffix}",
    statusThreeOuts: "スリーアウト！",
    statusGameEnded: "ゲーム終了",
  },
  ko: {
    htmlLang: "ko",
    title: "Apink 타이베이 돔 응원 타격 게임",
    metaDescription: "K-pop 레전드 걸그룹 Apink가 타이베이 돔에 옵니다! 7월 31일 신광 아시아 뮤직 페스티벌 첫 무대를 앞두고 야구 응원 타격 게임으로 뜨겁게 응원해 주세요!",
    languageLabel: "언어",
    languageAuto: "자동",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    promoAria: "행사 정보",
    promoBadge: "⭐️ 신광 아시아 뮤직 페스티벌 첫 라인업 ⭐️",
    promoTitle: "K-pop 레전드 걸그룹<br><span class=\"highlight-pink\">Apink</span> 출격 확정!",
    promoDate: "7/31(금) 타이베이 돔 · 웨이취안 드래곤스 홈경기",
    promoDesc: "한국 인기 2세대 걸그룹 <strong>Apink</strong>가 웨이취안 드래곤스 테마데이 <strong>「신광 아시아 뮤직 페스티벌」</strong> 첫 라인업으로 <strong>7월 31일(금)</strong> 타이베이 돔 무대에 올라 경기 후 특별 공연을 선보입니다!",
    promoSongsTitle: "🎵 현장 명곡 응원 예열 중:",
    promoCallout: "Apink의 타이베이 돔 등장을 위해 만든 <strong>야구 타격 응원 게임</strong>입니다. 지금 스윙하고 랭킹에 도전하며 뜨거운 응원을 보내 주세요!",
    promoTicket: "아직 티켓이 없다면 <a href=\"https://tix.wdragons.com/UTK0201_?PRODUCT_ID=P16MXT0T&amp;STARTDATE=2026/07/31\" target=\"_blank\" rel=\"noopener noreferrer\">티켓 예매 페이지</a>에서 예매하고, 7/31 당일 멋진 경기와 Apink 공연을 함께 즐겨 주세요!",
    leaderboardPageLink: "랭킹 페이지",
    fishPageLink: "🎣 행운 명태를 낚아요",
    fishSwipePageLink: "⚡ 명태 빠른 손 캐치",
    promoFooter: "* 오른쪽 야구장 아무 곳이나 누르면 스윙합니다 *",
    gameAria: "Apink 야구 게임",
    fieldAria: "게임 필드",
    bsopAria: "볼, 스트라이크, 아웃 보드",
    basesAria: "주자 상황",
    scoreLabel: "점수",
    statusReady: "준비",
    loading: "로딩 중",
    loadingEllipsis: "로딩 중...",
    startTitle: "게임 규칙",
    startChallenge: "1이닝 공격 챌린지",
    startRule1: "랜덤으로 선택된 판다 타자가 1이닝 공격 동안 <strong>Bomi 투수</strong>를 상대로 최대한 많은 점수를 내세요. 아웃, 안타, 볼넷 때마다 아직 타석에 서지 않은 판다가 랜덤으로 교체됩니다.",
    member_rong: "초롱",
    member_enji: "은지",
    member_najoo: "남주",
    member_hayoung: "하영",
    popNextBatter: "{name} 등장!",
    statusNextBatter: "{name} 타석에 들어섭니다",
    startRule2: "최고 점수는 랭킹에 기록할 수 있으며 도전 횟수는 제한이 없습니다. 도전 후 모두에게 응원 메시지도 남길 수 있습니다.",
    startButton: "게임 시작",
    gameOverTitle: "게임 종료",
    finalScoreLabel: "총점:",
    restart: "다시 시작",
    leaderboardHandlePlaceholder: "IG 또는 Threads 계정 입력",
    submitScore: "점수 등록",
    leaderboardTitle: "타이베이 돔 랭킹",
    myRank: "내 순위: {rank}",
    myScore: "내 점수",
    scoreUnit: "{score}점",
    cheerTemplates: ["Apink 💖 타이베이 돔 가자!", "언제나 Apink를 응원해! 🐼🌸", "보미 투구 최고, 은지 홈런!", "타이베이 돔 만석! Apink 만세!"],
    cheerPlaceholder: "응원 메시지를 남겨 주세요... (200자 이내)",
    cheerSubmit: "응원 보내기",
    continueChallenge: "계속 도전",
    sending: "전송 중...",
    noticeHandleRequired: "IG 또는 Threads 계정을 입력해 주세요.",
    noticeCheerRequired: "응원 메시지를 입력해 주세요.",
    noticeCheerSuccess: "응원이 전송되었습니다. 감사합니다!",
    cheerSentMessage: "💖 응원이 잘 전달되었습니다. 감사합니다!",
    anonymous: "익명",
    disclaimer: "📌 본 이벤트는 팬들이 자발적으로 진행하는 응원 활동이며, 어떠한 상업적 판매도 하지 않고 공식 주최 측과 무관합니다. 권리 침해가 있을 경우 알려주시면 즉시 삭제 및 폐쇄하겠습니다.",
    pitchSlow: "느린 공",
    pitchFast: "빠른 공",
    pitchChangeup: "체인지업",
    pitchDrop: "드롭볼",
    pitchSinker: "싱커",
    pitchSlider: "슬라이더",
    pitchKnuckle: "너클볼",
    pitchStatus: "{type} {speed} km/h",
    popFoul: "파울",
    statusFoul: "파울, 스트라이크 1개",
    popFlyout: "플라이 아웃",
    statusFlyout: "타구 플라이 아웃",
    hitSingle: "1루타",
    hitDouble: "2루타",
    hitTriple: "3루타",
    hitHr: "홈런!",
    runsScored: "{runs}점 획득!",
    statusBadSwing: "볼에 스윙",
    statusGoodTake: "선구 성공",
    statusSwingMiss: "헛스윙",
    statusNoSwing: "스윙 안 함",
    popOops: "아차",
    popNice: "Nice",
    popOut: "Out!",
    popWalk: "Walk!",
    popGameOver: "Game Over!",
    statusStrikeout: "삼진 아웃",
    statusWalk: "볼넷{suffix}",
    statusThreeOuts: "스리 아웃!",
    statusGameEnded: "게임 종료",
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

  const maskLength = Math.max(chars.length - 2, 1);
  return `${prefix}${chars[0]}${"*".repeat(maskLength)}${chars[chars.length - 1]}`;
}

class SpriteAnimator {
  constructor(image, frames) {
    this.image = image;
    this.frames = frames;
    this.timer = 0;
    this.currentFrame = 0;
    this.playing = false;
  }

  setFrame(frameIndex) {
    this.currentFrame = frameIndex;
    this.image.src = this.frames[frameIndex];
  }

  stop(frameIndex = this.currentFrame) {
    window.clearTimeout(this.timer);
    this.playing = false;
    this.setFrame(frameIndex);
  }

  play(sequence, frameMs, options = {}) {
    window.clearTimeout(this.timer);
    this.playing = true;
    let step = 0;

    const tick = () => {
      if (!this.playing) return;

      const frameIndex = sequence[step];
      this.setFrame(frameIndex);
      options.onFrame?.(frameIndex, step);
      step += 1;

      if (step >= sequence.length) {
        this.playing = false;
        options.onDone?.();
        return;
      }

      this.timer = window.setTimeout(tick, frameMs);
    };

    tick();
  }
}

class BallComponent {
  constructor(element) {
    this.element = element;
    this.x = -100;
    this.y = -100;
    this.rotation = 0;
    this.visible = false;
  }

  show() {
    this.visible = true;
    this.element.classList.add("is-visible");
  }

  hide() {
    this.visible = false;
    this.element.classList.remove("is-visible");
    this.setPosition(-100, -100, 0);
  }

  size() {
    return this.element.getBoundingClientRect().width || 32;
  }

  setPosition(x, y, rotation = this.rotation) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;
  }

  center() {
    const size = this.size();
    return {
      x: this.x + size / 2,
      y: this.y + size / 2,
      radius: size / 2,
    };
  }
}

class BaseballGame {
  constructor() {
    this.field = document.querySelector("#field");
    this.batterElement = document.querySelector('[data-component="batter"]');
    this.pitcher = new SpriteAnimator(document.querySelector("#pitcherFrame"), bomiFrames);
    this.batter = new SpriteAnimator(document.querySelector("#batterFrame"), MEMBERS.rong.swing);
    this.cheerleader = new SpriteAnimator(document.querySelector("#cheerFrame"), MEMBERS.enji.cheer);
    this.cheerleader2 = new SpriteAnimator(document.querySelector("#cheerFrameHayoung"), MEMBERS.hayoung.cheer);
    this.cheerleader3 = new SpriteAnimator(document.querySelector("#cheerFrameNajoo"), MEMBERS.najoo.cheer);
    this.cheerAnimators = [this.cheerleader, this.cheerleader2, this.cheerleader3];
    this.ball = new BallComponent(document.querySelector("#ball"));
    this.strikeZone = document.querySelector("#strikeZone");
    this.resultPop = document.querySelector("#resultPop");
    this.scoreNode = document.querySelector("#score");
    this.statusNode = document.querySelector("#status");
    this.gameOverOverlay = document.querySelector("#gameOverOverlay");
    this.finalScore = document.querySelector("#finalScore");
    this.restartButton = document.querySelector("#restartButton");
    this.startOverlay = document.querySelector("#startOverlay");
    this.startButton = document.querySelector("#startButton");
    this.startCountdown = document.querySelector("#startCountdown");
    this.noticeToast = document.querySelector("#noticeToast");
    this.noticeToastText = document.querySelector("#noticeToastText");
    this.siteDisclaimer = document.querySelector("#siteDisclaimer");
    this.languageSelect = document.querySelector("#languageSelect");
    this.promoStartGameButton = document.querySelector("#promoStartGameButton");

    this.lastSubmittedHandle = "";
    this.currentLeaderboard = null;
    this.submitScoreButton = document.querySelector("#submitScoreButton");
    this.leaderboardCloseButton = document.querySelector("#leaderboardCloseButton");
    this.cheerSubmitBtn = document.querySelector("#cheerSubmitBtn");
    this.cheerPanel = document.querySelector("#cheerPanel");
    this.leaderboardOverlay = document.querySelector("#leaderboardOverlay");

    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.balls = 0;
    this.strikes = 0;
    this.outs = 0;
    this.base1 = false;
    this.base2 = false;
    this.base3 = false;
    this.pitchId = 0;
    this.pitchFrame = 0;
    this.batterFrame = 0;
    this.swinging = false;
    this.swingActive = false;
    this.pitching = false;
    this.resolving = false;
    this.pitchTimeoutId = null;
    this.countdownTimeoutId = null;
    this.noticeTimeoutId = null;
    this.batterSwitchTimeoutId = null;
    this.gameStarted = false;
    this.countingDown = false;
    this.languageMode = "auto";
    this.locale = "zh";
    this.currentStatusKey = "statusReady";
    this.currentStatusVars = {};

    this.pitchSequence = [0, 1, 2, 3, 4, 7, 8, 9];
    this.currentBatter = "rong";
    this.usedBatters = new Set();
    this.swingSequence = MEMBERS.rong.swingSequence;
    this.activeSwingFrames = new Set(MEMBERS.rong.activeSwingFrames);

    this.handleSwing = this.handleSwing.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.beginGame = this.beginGame.bind(this);
  }

  async start() {
    this.applyLocale();
    this.showStartOverlay(this.t("loading"), true);
    this.setStatusKey("loading");
    const memberFrames = MEMBER_KEYS.flatMap((key) => [...MEMBERS[key].swing, ...MEMBERS[key].cheer]);
    await this.preload([...bomiFrames, ...new Set(memberFrames)]);
    this.setBatter(this.randomMemberKey());
    this.bind();
    this.resetGameState();
    this.startCheering();
    this.showStartOverlay(this.t("startChallenge"));
    this.scrollToGameFromHash();
  }

  t(key, values = {}) {
    const value = i18n[this.locale]?.[key] ?? i18n.zh[key] ?? key;
    if (Array.isArray(value)) return value;
    if (typeof value !== "string") return value;
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
    let stored = "auto";
    try {
      stored = localStorage.getItem(languageStorageKey);
    } catch (e) { }
    return ["auto", "zh", "en", "ja", "ko"].includes(stored) ? stored : "auto";
  }

  writeLanguageMode(mode) {
    this.languageMode = ["auto", "zh", "en", "ja", "ko"].includes(mode) ? mode : "auto";
    try {
      localStorage.setItem(languageStorageKey, this.languageMode);
    } catch (e) { }
  }

  applyLocale(mode = this.readLanguageMode()) {
    this.languageMode = ["auto", "zh", "en", "ja", "ko"].includes(mode) ? mode : "auto";
    this.locale = this.languageMode === "auto" ? this.detectBrowserLocale() : this.languageMode;
    const copy = i18n[this.locale] ?? i18n.zh;

    document.documentElement.lang = copy.htmlLang;
    document.title = this.t("title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", this.t("metaDescription"));

    if (this.languageSelect) {
      this.languageSelect.value = this.languageMode;
      this.languageSelect.querySelector('option[value="auto"]').textContent = this.t("languageAuto");
      this.languageSelect.querySelector('option[value="zh"]').textContent = this.t("languageZh");
      this.languageSelect.querySelector('option[value="en"]').textContent = this.t("languageEn");
      this.languageSelect.querySelector('option[value="ja"]').textContent = this.t("languageJa");
      this.languageSelect.querySelector('option[value="ko"]').textContent = this.t("languageKo");
    }

    this.setText("#languageLabel", "languageLabel");
    this.setText(".promo-badge", "promoBadge");
    this.setHtml(".promo-title", "promoTitle");
    this.setText(".promo-date", "promoDate");
    this.setHtml(".promo-desc", "promoDesc");
    this.setText(".promo-songs-title", "promoSongsTitle");
    this.setHtml(".promo-callout", "promoCallout");
    this.setHtml(".promo-ticket", "promoTicket");
    this.setText("#promoStartGameButton", "startButton");
    this.setText("#leaderboardPageLink", "leaderboardPageLink");
    this.setText("#fishPageLink", "fishPageLink");
    this.setText("#fishSwipePageLink", "fishSwipePageLink");
    this.setText(".promo-footer span", "promoFooter");
    this.setText("#scoreLabel", "scoreLabel");
    this.setText("#startTitle", "startTitle");
    this.setText("#startCountdown", "startChallenge");
    this.setHtml("#startRule1", "startRule1");
    this.setHtml("#startRule2", "startRule2");
    this.setText("#startButton", "startButton");
    this.setText("#gameOverTitle", "gameOverTitle");
    this.setText("#finalScoreLabel", "finalScoreLabel");
    this.setText("#restartButton", "restart");
    this.setText("#submitScoreButton", "submitScore");
    this.setText("#leaderboardTitle", "leaderboardTitle");
    this.setText("#cheerSubmitBtn", "cheerSubmit");
    this.setText("#cheerSentMessage", "cheerSentMessage");
    this.setText("#leaderboardCloseButton", "continueChallenge");
    this.setText("#siteDisclaimer", "disclaimer");
    this.setAttr(".promo-hero", "aria-label", "promoAria");
    this.setAttr(".game", "aria-label", "gameAria");
    this.setAttr("#field", "aria-label", "fieldAria");
    this.setAttr("#bsopBoard", "aria-label", "bsopAria");
    this.setAttr("#basesBoard", "aria-label", "basesAria");
    this.setAttr("#leaderboardHandle", "placeholder", "leaderboardHandlePlaceholder");
    this.setAttr("#cheerInput", "placeholder", "cheerPlaceholder");

    const cheerChips = document.querySelectorAll(".cheer-template-chip");
    this.t("cheerTemplates").forEach((text, index) => {
      if (cheerChips[index]) cheerChips[index].textContent = text;
    });

    if (this.siteDisclaimer) this.siteDisclaimer.lang = copy.htmlLang;
    if (this.currentStatusKey) this.setStatusKey(this.currentStatusKey, this.currentStatusVars);
    if (this.currentLeaderboard && this.leaderboardOverlay?.classList.contains("is-visible")) {
      const list = this.currentLeaderboard.list.map((item) => ({ ...item }));
      this.showLeaderboard(list, this.currentLeaderboard.myHandle);
    }
  }

  setText(selector, key) {
    const element = document.querySelector(selector);
    if (element) element.textContent = this.t(key);
  }

  setHtml(selector, key) {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = this.t(key);
  }

  setAttr(selector, attr, key) {
    const element = document.querySelector(selector);
    if (element) element.setAttribute(attr, this.t(key));
  }

  scrollToGameFromHash() {
    if (window.location.hash !== "#game") return;

    this.scrollGameToTop();
  }

  scrollGameToTop() {
    const game = document.querySelector("#game");
    if (!game) return;

    window.requestAnimationFrame(() => {
      game.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }

  showStartOverlay(message = this.t("startChallenge"), disabled = false) {
    if (!this.startOverlay || !this.startButton || !this.startCountdown) return;

    this.startOverlay.classList.add("is-visible");
    this.startOverlay.classList.remove("is-counting");
    this.startOverlay.setAttribute("aria-hidden", "false");
    this.startCountdown.textContent = message;
    this.startButton.disabled = disabled;
    this.startButton.textContent = disabled ? this.t("loadingEllipsis") : this.t("startButton");
  }

  hideStartOverlay() {
    if (!this.startOverlay) return;

    this.startOverlay.classList.remove("is-visible", "is-counting");
    this.startOverlay.setAttribute("aria-hidden", "true");
  }

  beginGame() {
    this.getAudioContext();
    if (this.gameStarted) return;

    if (this.countdownTimeoutId) {
      window.clearTimeout(this.countdownTimeoutId);
      this.countdownTimeoutId = null;
    }

    this.countingDown = false;
    this.gameStarted = true;
    const firstBatter = this.randomMemberKey();
    this.setBatter(firstBatter);
    this.usedBatters = new Set([firstBatter]);
    this.pitchId += 1;
    this.ball.hide();
    this.hideStartOverlay();
    this.setStatusKey("statusReady");
    this.queuePitch(0);
  }

  resetGameState() {
    if (this.pitchTimeoutId) {
      window.clearTimeout(this.pitchTimeoutId);
      this.pitchTimeoutId = null;
    }
    if (this.countdownTimeoutId) {
      window.clearTimeout(this.countdownTimeoutId);
      this.countdownTimeoutId = null;
    }
    if (this.batterSwitchTimeoutId) {
      window.clearTimeout(this.batterSwitchTimeoutId);
      this.batterSwitchTimeoutId = null;
    }

    this.usedBatters = new Set();
    this.pitchId += 1;
    this.gameStarted = false;
    this.countingDown = false;
    this.pitching = false;
    this.resolving = false;
    this.swinging = false;
    this.swingActive = false;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.balls = 0;
    this.strikes = 0;
    this.outs = 0;
    this.base1 = false;
    this.base2 = false;
    this.base3 = false;

    this.pitcher.stop(0);
    this.batter.stop(0);
    this.ball.hide();
    this.strikeZone?.classList.remove("is-visible");
    this.resultPop.classList.remove("is-visible");
    this.updateScore();
    this.updateBsop();
    this.updateBasesDisplay();
    this.setStatusKey("statusReady");
    this.randomizeCheerleaderPositions();
  }

  setBatter(memberKey) {
    const member = MEMBERS[memberKey];
    if (!member) return;

    this.currentBatter = memberKey;
    this.swingSequence = member.swingSequence;
    this.activeSwingFrames = new Set(member.activeSwingFrames);
    this.batter.frames = member.swing;
    if (!this.swinging) this.batter.setFrame(0);
    this.batter.image.alt = `${this.t(`member_${memberKey}`)} batter`;
    this.batter.image.style.transformOrigin = "bottom center";
    this.batter.image.style.transform = member.batterScale === 1 ? "" : `scale(${member.batterScale})`;

    const supporters = MEMBER_KEYS.filter((key) => key !== memberKey);
    this.cheerAnimators.forEach((animator, index) => {
      const supporter = supporters[index];
      animator.frames = MEMBERS[supporter].cheer;
      animator.setFrame(animator.currentFrame % animator.frames.length);
      animator.image.alt = `${this.t(`member_${supporter}`)} cheerleader`;
    });
  }

  randomMemberKey() {
    return MEMBER_KEYS[Math.floor(Math.random() * MEMBER_KEYS.length)];
  }

  switchToNextBatter() {
    let remaining = MEMBER_KEYS.filter((key) => !this.usedBatters.has(key));
    if (!remaining.length) {
      // 四位都輪過了，開新一輪，但避免同一位連續上場
      this.usedBatters = new Set([this.currentBatter]);
      remaining = MEMBER_KEYS.filter((key) => key !== this.currentBatter);
    }

    const next = remaining[Math.floor(Math.random() * remaining.length)];
    this.usedBatters.add(next);

    const applySwitch = () => {
      if (this.swinging) {
        this.batterSwitchTimeoutId = window.setTimeout(applySwitch, 200);
        return;
      }
      this.batterSwitchTimeoutId = null;
      if (!this.gameStarted) return;
      this.setBatter(next);
      this.pop(this.t("popNextBatter", { name: this.t(`member_${next}`) }));
      this.setStatusKey("statusNextBatter", { name: this.t(`member_${next}`) });
    };

    if (this.batterSwitchTimeoutId) window.clearTimeout(this.batterSwitchTimeoutId);
    this.batterSwitchTimeoutId = window.setTimeout(applySwitch, 700);
  }

  randomizeCheerleaderPositions() {
    const positions = ["cheerleader-pos--left", "cheerleader-pos--middle", "cheerleader-pos--right"];
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    const cheerleaders = [
      document.querySelector('[data-component="cheerleader"]'),
      document.querySelector('[data-component="cheerleader-hayoung"]'),
      document.querySelector('[data-component="cheerleader-najoo"]')
    ];

    cheerleaders.forEach((el, idx) => {
      if (el) {
        el.classList.remove("cheerleader-pos--left", "cheerleader-pos--middle", "cheerleader-pos--right");
        el.classList.add(positions[idx]);
      }
    });
  }



  startCheering() {
    const sequence = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const frameMs = 100;
    const playNext = () => {
      this.cheerleader.play(sequence, frameMs);
      this.cheerleader2.play(sequence, frameMs);
      this.cheerleader3.play(sequence, frameMs, {
        // let the last frame stay on screen for a full step before looping
        onDone: () => window.setTimeout(playNext, frameMs),
      });
    };
    playNext();
  }

  preload(paths) {
    return Promise.all(
      paths.map(
        (path) =>
          new Promise((resolve) => {
            const image = new Image();
            image.onload = resolve;
            image.onerror = resolve;
            image.src = path;
          }),
      ),
    );
  }

  bind() {
    this.field.addEventListener("pointerdown", this.handleSwing);
    window.addEventListener("keydown", (e) => this.handleKey(e));
    window.addEventListener("hashchange", () => this.scrollToGameFromHash());
    this.languageSelect?.addEventListener("change", (event) => {
      this.writeLanguageMode(event.target.value);
      this.applyLocale(this.languageMode);
    });
    this.promoStartGameButton?.addEventListener("click", (event) => {
      event.preventDefault();
      this.scrollGameToTop();
      if (window.location.hash !== "#game") {
        history.pushState(null, "", "#game");
      }
    });
    this.startButton.addEventListener("pointerdown", (event) => event.stopPropagation());
    this.startButton.addEventListener("click", this.beginGame);
    this.restartButton.addEventListener("click", () => this.restartGame());

    if (this.submitScoreButton) {
      this.submitScoreButton.addEventListener("click", () => this.submitScore());
    }
    if (this.leaderboardCloseButton) {
      this.leaderboardCloseButton.addEventListener("click", () => this.closeLeaderboard());
    }
    if (this.cheerSubmitBtn) {
      this.cheerSubmitBtn.addEventListener("click", () => this.submitCheer());
    }

    // Attach click listeners to quick cheerleader template chips
    const chips = document.querySelectorAll(".cheer-template-chip");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const input = document.getElementById("cheerInput");
        if (input) input.value = chip.textContent;
      });
    });
  }

  handleKey(event) {
    // If focus is inside a form control, let the browser handle key down normally.
    const activeEl = document.activeElement;
    if (activeEl && ["INPUT", "TEXTAREA", "BUTTON"].includes(activeEl.tagName)) {
      return;
    }

    if (event.code !== "Space" && event.code !== "Enter") return;
    event.preventDefault();

    if (!this.gameStarted) {
      if (this.startOverlay?.classList.contains("is-visible")) {
        this.beginGame();
      }
      return;
    }

    this.handleSwing();
  }

  handleSwing() {
    this.getAudioContext();
    if (!this.gameStarted || this.countingDown) return;
    if (this.swinging) return;
    this.swungThisPitch = true; // Track swing for ball/strike check

    this.swinging = true;
    this.swingActive = false;
    this.batter.play(this.swingSequence, 58, {
      onFrame: (frameIndex) => {
        this.batterFrame = frameIndex;
        this.swingActive = this.activeSwingFrames.has(frameIndex);
        this.checkCollision();
      },
      onDone: () => {
        this.swinging = false;
        this.swingActive = false;
        this.batterFrame = 0;
        this.batter.setFrame(0);
      },
    });
  }

  queuePitch(delay = 850) {
    if (!this.gameStarted || this.countingDown) return;
    if (this.pitchTimeoutId) clearTimeout(this.pitchTimeoutId);
    this.pitchTimeoutId = window.setTimeout(() => this.pitch(), delay);
  }

  pitch() {
    if (!this.gameStarted || this.countingDown) return;
    if (this.pitching || this.resolving) return;

    this.pitchId += 1;
    const localPitch = this.pitchId;
    const fieldRect = this.field.getBoundingClientRect();
    const batterRect = this.batterElement.getBoundingClientRect();
    const batterTop = batterRect.top - fieldRect.top;
    const batterHeight = batterRect.height;
    const ballSize = this.ball.size();

    // Base pitchBand coordinates without offsets
    const basePitchBand = {
      top: batterTop + batterHeight * 0.42,
      bottom: batterTop + batterHeight * 0.62,
    };
    const basePitchMid = lerp(basePitchBand.top, basePitchBand.bottom, 0.5);

    // Scaling factors based on batterHeight (scales with screen width)
    const strikeOffset = batterHeight * 0.25;
    const pitchOffset = batterHeight * 0.30;
    const strikeTolerance = batterHeight * 0.025;

    // 1. Shifted Strike Zone (好球帶 Y + 100 on desktop)
    const pitchBand = {
      top: basePitchBand.top + strikeOffset,
      bottom: basePitchBand.bottom + strikeOffset,
    };

    // Strike Zone bounds
    const strikeZoneTop = pitchBand.top - strikeTolerance;
    const strikeZoneBottom = pitchBand.bottom + strikeTolerance;

    const batterLeft = batterRect.left - fieldRect.left;

    // Strike-zone indicator is intentionally hidden now that pitches are
    // easier to hit; the zone coordinates below still drive pitch targeting.

    // 2. Shifted Trajectory (投球路徑 Y + 120 on desktop)
    const start = {
      x: fieldRect.width - clamp(fieldRect.width * 0.25, 128, fieldRect.width - 220),
      y: basePitchMid - ballSize * 0.35 + pitchOffset,
    };

    // 1. Select pitch type and speed level
    const pitchTypes = ["slow", "fast", "changeup", "drop", "sinker", "slider", "knuckle"];
    const type = pitchTypes[Math.floor(Math.random() * pitchTypes.length)];
    const speedLevel = Math.floor(Math.random() * 5) + 1; // 1 to 5

    // Explicitly roll strike vs ball so bad pitches always fly clearly
    // outside the zone (at least one ball-width past the edge) instead of
    // hugging the border where players cannot judge them.
    const throwStrike = Math.random() < 0.65;
    const zoneHeight = strikeZoneBottom - strikeZoneTop;
    const badPitchMin = ballSize;
    const badPitchMax = ballSize + batterHeight * 0.12;

    let targetY;
    if (throwStrike) {
      const inset = Math.min(ballSize * 0.25, zoneHeight * 0.25);
      targetY = lerp(strikeZoneTop + inset, strikeZoneBottom - inset, Math.random());
    } else {
      const offset = lerp(badPitchMin, badPitchMax, Math.random());
      targetY = Math.random() < 0.5 ? strikeZoneTop - offset : strikeZoneBottom + offset;
    }
    this.isBadPitch = !throwStrike;
    this.swungThisPitch = false;

    // Flight-path clamp bounds, wide enough for the farthest bad pitch
    const pitchTop = strikeZoneTop - badPitchMax;
    const pitchBottom = strikeZoneBottom + badPitchMax;

    // Aim the trajectory so the ball's centre passes through targetY exactly
    // where it crosses the strike-zone box (not at the off-screen endpoint),
    // so the position players see at the plate always matches the
    // ball/strike call. Curve offsets are evaluated at the plate-crossing
    // progress and compensated in the endpoint.
    const plateX = batterLeft + batterRect.width * 0.64; // centre of zone box
    const endX = -ballSize;
    const plateProgress = clamp((start.x - plateX) / (start.x - endX), 0.05, 0.98);
    let curveYAtPlate = 0;
    switch (type) {
      case "slow": curveYAtPlate = Math.sin(plateProgress * Math.PI) * -85; break;
      case "drop": curveYAtPlate = plateProgress > 0.6 ? Math.pow((plateProgress - 0.6) / 0.4, 2.2) * 80 : 0; break;
      case "sinker": curveYAtPlate = plateProgress > 0.55 ? Math.pow((plateProgress - 0.55) / 0.45, 2) * 50 : 0; break;
      case "slider": curveYAtPlate = Math.sin(plateProgress * Math.PI) * -35; break;
      case "knuckle": curveYAtPlate = Math.sin(plateProgress * Math.PI * 4.5) * 12; break;
    }
    const end = {
      x: endX,
      y: start.y + (targetY - curveYAtPlate - start.y) / plateProgress,
    };

    // 2. Calculate simulated speed in km/h
    let speedKmh = 0;
    switch (type) {
      case "fast": speedKmh = lerp(130, 160, (speedLevel - 1) / 4); break;
      case "slow": speedKmh = lerp(70, 90, (speedLevel - 1) / 4); break;
      case "changeup": speedKmh = lerp(105, 120, (speedLevel - 1) / 4); break;
      case "drop": speedKmh = lerp(110, 130, (speedLevel - 1) / 4); break;
      case "sinker": speedKmh = lerp(115, 135, (speedLevel - 1) / 4); break;
      case "slider": speedKmh = lerp(110, 130, (speedLevel - 1) / 4); break;
      case "knuckle": speedKmh = lerp(75, 95, (speedLevel - 1) / 4); break;
    }
    speedKmh = Math.round(speedKmh);

    // 3. Calculate animation duration based on type and speed level
    let baseDuration = 1600;
    switch (type) {
      case "fast": baseDuration = 1100; break;
      case "slow": baseDuration = 2200; break;
      case "changeup": baseDuration = 1700; break;
      case "drop": baseDuration = 1600; break;
      case "sinker": baseDuration = 1600; break;
      case "slider": baseDuration = 1600; break;
      case "knuckle": baseDuration = 1800; break;
    }
    const speedMultipliers = { 1: 1.35, 2: 1.15, 3: 1.0, 4: 0.85, 5: 0.70 };
    const duration = baseDuration * speedMultipliers[speedLevel];

    this.pitching = true;
    this.resolving = false;
    this.swingActive = false;
    this.setStatus(this.t("pitchStatus", { type: this.t(`pitch${type[0].toUpperCase()}${type.slice(1)}`), speed: speedKmh }));
    this.ball.hide();

    this.pitcher.play(this.pitchSequence, 74, {
      onFrame: (_frameIndex, step) => {
        this.pitchFrame = step;
      },
      onDone: () => {
        this.pitcher.setFrame(0);
      },
    });

    window.setTimeout(() => {
      if (localPitch !== this.pitchId || !this.pitching) return;
      this.ball.show();
      this.ball.setPosition(start.x - ballSize / 2, start.y - ballSize / 2, 0);
      this.animatePitch(localPitch, start, end, pitchBand, type, duration, pitchTop, pitchBottom);
    }, 350);
  }

  animatePitch(localPitch, start, end, pitchBand, type, duration, pitchTop, pitchBottom) {
    const startedAt = performance.now();
    // Loose safety bounds only: trajectories are precisely aimed at the
    // plate, but arcs peak above the band mid-flight and drop/sinker dive
    // below it after passing the batter.
    const clampTop = pitchTop - 100;
    const clampBottom = pitchBottom + 60;

    const step = (now) => {
      if (localPitch !== this.pitchId || !this.pitching || this.resolving) return;

      const t = clamp((now - startedAt) / duration, 0, 1);

      let x = 0;
      let y = 0;

      switch (type) {
        case "fast": {
          const eased = t;
          x = lerp(start.x, end.x, eased);
          y = lerp(start.y, end.y, eased);
          break;
        }
        case "slow": {
          const eased = t;
          x = lerp(start.x, end.x, eased);
          const arc = Math.sin(t * Math.PI) * -85;
          y = lerp(start.y, end.y, eased) + arc;
          break;
        }
        case "changeup": {
          const eased = 1 - Math.pow(1 - t, 2.5);
          x = lerp(start.x, end.x, eased);
          y = lerp(start.y, end.y, eased);
          break;
        }
        case "drop": {
          const eased = t;
          x = lerp(start.x, end.x, eased);
          const drop = t > 0.6 ? Math.pow((t - 0.6) / 0.4, 2.2) * 80 : 0;
          y = lerp(start.y, end.y, eased) + drop;
          break;
        }
        case "sinker": {
          const eased = t;
          const breakStart = 0.55;
          const breakWeight = t > breakStart ? Math.pow((t - breakStart) / (1 - breakStart), 2) : 0;
          const breakX = breakWeight * -35;
          const breakY = breakWeight * 50;
          x = lerp(start.x, end.x, eased) + breakX;
          y = lerp(start.y, end.y, eased) + breakY;
          break;
        }
        case "slider": {
          const eased = t;
          x = lerp(start.x, end.x, eased);
          const sweepY = Math.sin(t * Math.PI) * -35;
          y = lerp(start.y, end.y, eased) + sweepY;
          break;
        }
        case "knuckle": {
          const eased = t;
          const wobbleY = Math.sin(t * Math.PI * 4.5) * 12;
          const wobbleX = Math.cos(t * Math.PI * 4.5) * 8;
          x = lerp(start.x, end.x, eased) + wobbleX;
          y = lerp(start.y, end.y, eased) + wobbleY;
          break;
        }
        default: {
          const eased = t * t * (3 - 2 * t);
          x = lerp(start.x, end.x, eased);
          y = lerp(start.y, end.y, eased);
        }
      }

      y = clamp(y, clampTop, clampBottom);

      const rotationSpeed = type === "knuckle" ? t * 40 : t * 760;
      this.ball.setPosition(x - this.ball.size() / 2, y - this.ball.size() / 2, rotationSpeed);
      this.checkCollision();

      const fieldRect = this.field.getBoundingClientRect();
      const batterRect = this.batterElement.getBoundingClientRect();
      const batterLeft = batterRect.left - fieldRect.left;

      if (this.ball.center().x < batterLeft || t >= 1) {
        this.miss(localPitch);
        return;
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  checkCollision() {
    if (!this.pitching || this.resolving || !this.swingActive || !this.ball.visible) return;

    const fieldRect = this.field.getBoundingClientRect();
    const batZone = this.getBatZone();
    if (!batZone) return;

    const ball = this.ball.center();
    const closestX = clamp(ball.x, batZone.left, batZone.right);
    const closestY = clamp(ball.y, batZone.top, batZone.bottom);
    const dx = ball.x - closestX;
    const dy = ball.y - closestY;

    if (dx * dx + dy * dy <= ball.radius * ball.radius) {
      this.hit();
    }
  }

  getBatZone() {
    const fieldRect = this.field.getBoundingClientRect();
    const batterRect = this.batterElement.getBoundingClientRect();
    const left = batterRect.left - fieldRect.left;
    const top = batterRect.top - fieldRect.top;
    const width = batterRect.width;
    const height = batterRect.height;
    const zones = {
      2: { left: 0.50, right: 1.02, top: 0.45, bottom: 0.65 },
      3: { left: 0.50, right: 1.02, top: 0.45, bottom: 0.65 },
      4: { left: 0.06, right: 0.66, top: 0.58, bottom: 0.77 },
      5: { left: 0.02, right: 0.60, top: 0.42, bottom: 0.63 },
    };
    const zone = zones[this.batterFrame];
    if (!zone) return null;

    return {
      left: left + width * zone.left - 22,
      right: left + width * zone.right + 22,
      top: top + height * zone.top - 22,
      bottom: top + height * zone.bottom + 22,
    };
  }

  hit() {
    if (this.resolving) return;

    this.playHitSound();

    this.resolving = true;
    this.pitching = false;

    // Determine hit outcome. Contact on a bad pitch is weak: mostly fouls
    // and flyouts, never a home run. In-zone contact is rewarding: flyouts
    // are rare so most swings that connect turn into base hits.
    const thresholds = this.isBadPitch
      ? { foul: 0.35, flyout: 0.70, single: 0.90, double: 0.97, triple: 1.0 }
      : { foul: 0.20, flyout: 0.30, single: 0.70, double: 0.85, triple: 0.95 };
    const rand = Math.random();
    let outcome = '';
    if (rand < thresholds.foul) {
      outcome = 'Foul';
    } else if (rand < thresholds.flyout) {
      outcome = 'Flyout';
    } else if (rand < thresholds.single) {
      outcome = 'Single';
    } else if (rand < thresholds.double) {
      outcome = 'Double';
    } else if (rand < thresholds.triple) {
      outcome = 'Triple';
    } else {
      outcome = 'HR';
    }

    const fieldRect = this.field.getBoundingClientRect();
    const from = { x: this.ball.x, y: this.ball.y };
    let to = { x: 0, y: 0 };
    let popText = '';
    let statusText = '';
    let liftVal = -64;

    if (outcome === 'Foul') {
      const leftFoul = Math.random() < 0.5;
      to = {
        x: leftFoul ? -60 : fieldRect.width + 60,
        y: clamp(fieldRect.height * 0.05, 10, 40),
      };
      popText = this.t("popFoul");
      statusText = this.t("statusFoul");
      liftVal = -100;

      this.pop(popText);
      this.setStatus(statusText);
      this.recordStrike(true); // Record strike as foul
    } else if (outcome === 'Flyout') {
      to = {
        x: fieldRect.width * 0.52,
        y: clamp(fieldRect.height * 0.35, 100, 180),
      };
      popText = this.t("popFlyout");
      statusText = this.t("statusFlyout");
      liftVal = -130;

      this.pop(popText);
      this.setStatus(statusText);
      this.balls = 0;
      this.strikes = 0;
      this.updateBsop();

      this.animateHit(from, to, liftVal, () => {
        window.setTimeout(() => {
          this.recordOut();
          window.setTimeout(() => {
            this.finishRound();
          }, 800);
        }, 500);
      });
      return;
    } else {
      to = {
        x: clamp(fieldRect.width * 0.72, 280, fieldRect.width - 180),
        y: clamp(fieldRect.height * 0.13, 48, 110),
      };

      this.playCheerSound(); // Play crowd cheer on all hits!

      let basesToAdvance = 1;
      if (outcome === 'Single') {
        popText = this.t("hitSingle");
        statusText = this.t("hitSingle");
        basesToAdvance = 1;
      } else if (outcome === 'Double') {
        popText = this.t("hitDouble");
        statusText = this.t("hitDouble");
        basesToAdvance = 2;
      } else if (outcome === 'Triple') {
        popText = this.t("hitTriple");
        statusText = this.t("hitTriple");
        basesToAdvance = 3;
      } else if (outcome === 'HR') {
        popText = this.t("hitHr");
        statusText = this.t("hitHr");
        basesToAdvance = 4;
      }

      const runs = this.advanceRunners(basesToAdvance);
      if (runs > 0) {
        this.score += runs;
        statusText += ` ${this.t("runsScored", { runs })}`;
        popText += ` +${runs}`;
      }

      this.streak += 1;
      this.updateScore();
      this.updateBasesDisplay();

      // Clear strikes and balls on hit
      this.balls = 0;
      this.strikes = 0;
      this.updateBsop();

      this.pop(popText);
      this.setStatus(statusText);
      this.switchToNextBatter();
    }

    this.animateHit(from, to, liftVal);
  }

  animateHit(from, to, liftVal = -64, onComplete = null) {
    const duration = 760;
    const startedAt = performance.now();

    const step = (now) => {
      const t = clamp((now - startedAt) / duration, 0, 1);
      const lift = Math.sin(t * Math.PI) * liftVal;
      this.ball.setPosition(
        lerp(from.x, to.x, t),
        lerp(from.y, to.y, t) + lift,
        760 + t * 980,
      );

      if (t < 1) {
        requestAnimationFrame(step);
        return;
      }

      if (onComplete) {
        onComplete();
      } else {
        this.finishRound();
      }
    };

    requestAnimationFrame(step);
  }

  miss(localPitch) {
    if (localPitch !== this.pitchId || this.resolving) return;

    this.resolving = true;
    this.pitching = false;

    if (this.isBadPitch) {
      if (this.swungThisPitch) {
        this.setStatusKey("statusBadSwing");
        this.pop(this.t("popOops"));
        this.playAhOhSound();
        this.recordStrike(false);
      } else {
        this.setStatusKey("statusGoodTake");
        this.pop(this.t("popNice"));
        this.recordBall();
      }
    } else {
      if (this.swungThisPitch) {
        this.setStatusKey("statusSwingMiss");
      } else {
        this.setStatusKey("statusNoSwing");
      }
      this.pop(this.t("popOops"));
      this.playAhOhSound();
      this.recordStrike(false);
    }

    window.setTimeout(() => this.finishRound(), 520);
  }

  finishRound() {
    this.ball.hide();
    this.strikeZone?.classList.remove("is-visible");
    this.resolving = false;
    this.swingActive = false;
    this.pitcher.setFrame(0);
    if (!this.swinging) this.batter.setFrame(0);

    if (!this.gameStarted || this.outs >= 3) {
      return;
    }

    this.setStatusKey("statusReady");
    this.queuePitch(780);
  }

  updateScore() {
    this.scoreNode.textContent = String(this.score);
  }

  setStatus(text) {
    this.currentStatusKey = null;
    this.currentStatusVars = {};
    this.statusNode.textContent = text;
  }

  setStatusKey(key, vars = {}) {
    this.currentStatusKey = key;
    this.currentStatusVars = vars;
    this.statusNode.textContent = this.t(key, vars);
  }

  pop(text) {
    this.resultPop.textContent = text;
    this.resultPop.classList.add("is-visible");
    window.setTimeout(() => this.resultPop.classList.remove("is-visible"), 430);
  }

  showNotice(message, type = "info") {
    if (!this.noticeToast || !this.noticeToastText) return;

    if (this.noticeTimeoutId) {
      window.clearTimeout(this.noticeTimeoutId);
      this.noticeTimeoutId = null;
    }

    this.noticeToastText.textContent = message;
    this.noticeToast.classList.remove("notice-toast--success", "notice-toast--error");
    if (type === "success") this.noticeToast.classList.add("notice-toast--success");
    if (type === "error") this.noticeToast.classList.add("notice-toast--error");
    this.noticeToast.classList.add("is-visible");
    this.noticeToast.setAttribute("aria-hidden", "false");

    this.noticeTimeoutId = window.setTimeout(() => {
      this.noticeToast.classList.remove("is-visible");
      this.noticeToast.setAttribute("aria-hidden", "true");
      this.noticeTimeoutId = null;
    }, 2400);
  }

  recordStrike(isFoul = false) {
    if (isFoul && this.strikes === 2) {
      this.updateBsop();
      return;
    }
    this.strikes += 1;
    if (this.strikes >= 3) {
      this.strikes = 0;
      this.balls = 0;
      this.pop(this.t("popOut"));
      this.setStatusKey("statusStrikeout");
      this.recordOut();
    }
    this.updateBsop();
  }

  recordBall() {
    this.balls += 1;
    if (this.balls >= 4) {
      this.balls = 0;
      this.strikes = 0;

      // Walk forced advancement rules
      let runScored = false;
      if (!this.base1) {
        this.base1 = true;
      } else if (!this.base2) {
        this.base2 = true;
      } else if (!this.base3) {
        this.base3 = true;
      } else {
        runScored = true;
      }

      if (runScored) {
        this.score += 1;
      }
      this.streak += 1;
      this.updateScore();
      this.updateBasesDisplay();

      this.pop(this.t("popWalk"));
      this.setStatus(this.t("statusWalk", { suffix: runScored ? ` ${this.t("runsScored", { runs: 1 })}` : "" }));
      this.switchToNextBatter();
    }
    this.updateBsop();
  }

  recordOut() {
    this.outs += 1;
    this.streak = 0;
    this.updateScore();
    this.updateBsop();

    if (this.outs >= 3) {
      if (this.pitchTimeoutId) {
        window.clearTimeout(this.pitchTimeoutId);
        this.pitchTimeoutId = null;
      }
      this.gameStarted = false;
      this.pitching = false;
      this.pop(this.t("popGameOver"));
      this.playGameOverSound();
      this.setStatusKey("statusThreeOuts");
      window.setTimeout(() => {
        this.endGame();
      }, 3000);
    } else {
      this.pop(this.t("popOut"));
      this.playOutSound();
      this.switchToNextBatter();
    }
  }

  endGame() {
    if (this.pitchTimeoutId) {
      window.clearTimeout(this.pitchTimeoutId);
      this.pitchTimeoutId = null;
    }
    if (this.countdownTimeoutId) {
      window.clearTimeout(this.countdownTimeoutId);
      this.countdownTimeoutId = null;
    }
    this.gameStarted = false;
    this.countingDown = false;
    this.pitching = false;
    this.strikeZone?.classList.remove("is-visible");
    this.hideStartOverlay();
    this.gameOverOverlay.classList.add("is-visible");
    this.finalScore.textContent = this.score;
    this.setStatusKey("statusGameEnded");
  }

  restartGame() {
    this.gameOverOverlay.classList.remove("is-visible");
    this.currentLeaderboard = null;
    this.resetGameState();
    this.beginGame();
  }

  advanceRunners(basesToAdvance) {
    let runs = 0;
    const initialRunners = [this.base1, this.base2, this.base3];

    this.base1 = false;
    this.base2 = false;
    this.base3 = false;

    for (let baseNum = 1; baseNum <= 3; baseNum++) {
      if (initialRunners[baseNum - 1]) {
        const newBase = baseNum + basesToAdvance;
        if (newBase > 3) {
          runs += 1;
        } else {
          if (newBase === 1) this.base1 = true;
          if (newBase === 2) this.base2 = true;
          if (newBase === 3) this.base3 = true;
        }
      }
    }

    if (basesToAdvance === 1) this.base1 = true;
    else if (basesToAdvance === 2) this.base2 = true;
    else if (basesToAdvance === 3) this.base3 = true;
    else if (basesToAdvance === 4) runs += 1;

    return runs;
  }

  updateBasesDisplay() {
    document.getElementById("base1").classList.toggle("occupied", this.base1);
    document.getElementById("base2").classList.toggle("occupied", this.base2);
    document.getElementById("base3").classList.toggle("occupied", this.base3);
  }

  updateBsop() {
    const ballDots = document.querySelectorAll(".bsop__dot--ball");
    ballDots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx < this.balls);
    });

    const strikeDots = document.querySelectorAll(".bsop__dot--strike");
    strikeDots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx < this.strikes);
    });

    const outDots = document.querySelectorAll(".bsop__dot--out");
    outDots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx < this.outs);
    });
  }

  getAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    // iOS unlock: Safari keeps audio muted until a real sound source is started
    // inside a user gesture. Play one silent buffer the first time so every
    // later sound is audible. Must run synchronously within the tap/click.
    if (!this.audioUnlocked) {
      try {
        const buffer = this.audioCtx.createBuffer(1, 1, 22050);
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioCtx.destination);
        source.start(0);
        this.audioUnlocked = true;
      } catch (e) { }
      // Switch iOS to the "playback" audio session by looping a silent
      // <audio> element, so Web Audio can be heard even when the ring/silent
      // switch is off. Best effort — harmless where unsupported.
      this.startAudioSession();
    }
    return this.audioCtx;
  }

  startAudioSession() {
    if (this.audioSessionEl) return;
    try {
      const sampleRate = 8000;
      const seconds = 0.5;
      const numSamples = Math.floor(sampleRate * seconds);
      const dataSize = numSamples; // 8-bit mono
      const buffer = new ArrayBuffer(44 + dataSize);
      const view = new DataView(buffer);
      const writeStr = (offset, str) => {
        for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
      };
      writeStr(0, "RIFF");
      view.setUint32(4, 36 + dataSize, true);
      writeStr(8, "WAVE");
      writeStr(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);            // PCM
      view.setUint16(22, 1, true);            // mono
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate, true);   // byte rate
      view.setUint16(32, 1, true);            // block align
      view.setUint16(34, 8, true);            // bits per sample
      writeStr(36, "data");
      view.setUint32(40, dataSize, true);
      for (let i = 0; i < numSamples; i++) view.setUint8(44 + i, 128); // 8-bit silence

      const blob = new Blob([buffer], { type: "audio/wav" });
      const el = document.createElement("audio");
      el.setAttribute("playsinline", "");
      el.setAttribute("webkit-playsinline", "");
      el.loop = true;
      el.src = URL.createObjectURL(blob);
      const promise = el.play();
      if (promise && promise.catch) promise.catch(() => { });
      this.audioSessionEl = el;
    } catch (e) { }
  }

  playHitSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainOsc = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.12);

      gainOsc.gain.setValueAtTime(0.8, ctx.currentTime);
      gainOsc.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(gainOsc);
      gainOsc.connect(ctx.destination);

      const click = ctx.createOscillator();
      const gainClick = ctx.createGain();
      click.type = "triangle";
      click.frequency.setValueAtTime(2200, ctx.currentTime);
      click.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.03);

      gainClick.gain.setValueAtTime(0.6, ctx.currentTime);
      gainClick.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

      click.connect(gainClick);
      gainClick.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
      click.start(ctx.currentTime);
      click.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("Web Audio API error:", e);
    }
  }

  playCheerSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 2.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(350, ctx.currentTime);
      filter.Q.setValueAtTime(1.0, ctx.currentTime);

      filter.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.6);
      filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 2.0);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.65, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.65, ctx.currentTime + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + 2.5);
    } catch (e) {
      console.warn("Web Audio API error:", e);
    }
  }

  playAhOhSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(380, ctx.currentTime);
      gain1.gain.setValueAtTime(0.01, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain1.gain.setValueAtTime(0.2, ctx.currentTime + 0.12);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.16);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(260, ctx.currentTime + 0.13);
      osc2.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.35);

      gain2.gain.setValueAtTime(0.01, ctx.currentTime + 0.13);
      gain2.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.2);

      osc2.start(ctx.currentTime + 0.13);
      osc2.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn("Web Audio API error:", e);
    }
  }

  playOutSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.15);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(700, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "highpass";
      noiseFilter.frequency.setValueAtTime(4000, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, ctx.currentTime + 0.18);
      noiseGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.2);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.26);
      noise.start(ctx.currentTime + 0.18);
      noise.stop(ctx.currentTime + 0.26);
    } catch (e) {
      console.warn("Web Audio API error:", e);
    }
  }

  playGameOverSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [261.63, 196.00, 164.81, 130.81];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);

        gain.gain.setValueAtTime(0.01, ctx.currentTime + idx * 0.18);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.18 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.18 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.18);
        osc.stop(ctx.currentTime + idx * 0.18 + 0.25);
      });
    } catch (e) {
      console.warn("Web Audio API error:", e);
    }
  }

  async submitScore() {
    const handleInput = document.getElementById("leaderboardHandle");
    const handle = handleInput.value.trim();
    if (!handle) {
      this.showNotice(this.t("noticeHandleRequired"), "error");
      handleInput.focus();
      return;
    }

    this.lastSubmittedHandle = handle;
    try {
      localStorage.setItem("apink_my_handle", handle);
    } catch (e) { }
    this.submitScoreButton.disabled = true;
    this.submitScoreButton.textContent = this.t("sending");

    let list = [];

    // 1. Local Storage Fallback
    try {
      list = JSON.parse(localStorage.getItem("apink_leaderboard") || "[]");
    } catch (e) { }

    let found = false;
    for (let i = 0; i < list.length; i++) {
      if (list[i].handle === handle) {
        found = true;
        if (this.score > list[i].score) {
          list[i].score = this.score;
        }
        break;
      }
    }
    if (!found) {
      list.push({ handle: handle, score: this.score });
    }
    try {
      localStorage.setItem("apink_leaderboard", JSON.stringify(list));
    } catch (e) { }

    // 2. Google Sheets API Sync if URL configured
    if (GOOGLE_SCRIPT_URL) {
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "text/plain"
          },
          body: JSON.stringify({ handle: handle, score: this.score })
        });
        const resData = await response.json();
        if (resData && resData.leaderboard) {
          list = resData.leaderboard;
        }
      } catch (e) {
        console.error("Google Sheets Sync failed, using local fallback:", e);
      }
    }

    this.showLeaderboard(list, handle);
  }

  showLeaderboard(list, myHandle) {
    this.currentLeaderboard = {
      list: list.map((item) => ({ ...item })),
      myHandle,
    };
    this.gameOverOverlay.classList.remove("is-visible");
    this.leaderboardOverlay.classList.add("is-visible");

    // Sort list descending
    list.sort((a, b) => b.score - a.score);

    // Calculate tie rankings (e.g. 1st, 1st, 3rd, 4th)
    let currentRank = 1;
    let tieCount = 0;
    let lastScore = null;
    const rankedList = list.map((item) => {
      if (lastScore !== null && item.score < lastScore) {
        currentRank += tieCount;
        tieCount = 1;
      } else {
        tieCount++;
      }
      lastScore = item.score;
      return {
        rank: currentRank,
        handle: item.handle,
        score: item.score
      };
    });

    // Find and render my rank
    const myRankInfo = rankedList.find(x => x.handle === myHandle);
    const myRankDiv = document.getElementById("leaderboardMyRank");
    myRankDiv.innerHTML = "";
    if (myRankInfo) {
      let medal = "";
      if (myRankInfo.rank === 1) medal = "🥇 ";
      else if (myRankInfo.rank === 2) medal = "🥈 ";
      else if (myRankInfo.rank === 3) medal = "🥉 ";
      [
        this.t("myRank", { rank: `${medal}${myRankInfo.rank}` }),
        maskHandle(myRankInfo.handle),
        this.t("scoreUnit", { score: myRankInfo.score }),
      ].forEach((text) => {
        const span = document.createElement("span");
        span.textContent = text;
        myRankDiv.appendChild(span);
      });
    } else {
      [
        this.t("myScore"),
        maskHandle(myHandle),
        this.t("scoreUnit", { score: this.score }),
      ].forEach((text) => {
        const span = document.createElement("span");
        span.textContent = text;
        myRankDiv.appendChild(span);
      });
    }

    // Reset submit button text
    this.submitScoreButton.disabled = false;
    this.submitScoreButton.textContent = this.t("submitScore");

    // Reset cheer panel so a new game allows sending another cheer
    this.cheerPanel?.classList.remove("is-sent");
  }

  async submitCheer() {
    const cheerInput = document.getElementById("cheerInput");
    const message = cheerInput.value.trim();
    if (!message) {
      this.showNotice(this.t("noticeCheerRequired"), "error");
      cheerInput.focus();
      return;
    }

    const handle = this.lastSubmittedHandle || this.t("anonymous");
    this.cheerSubmitBtn.disabled = true;
    this.cheerSubmitBtn.textContent = this.t("sending");

    // 1. Local Storage Fallback
    try {
      const cheers = JSON.parse(localStorage.getItem("apink_cheers") || "[]");
      cheers.push({ handle: handle, message: message, time: new Date().toISOString() });
      localStorage.setItem("apink_cheers", JSON.stringify(cheers));
    } catch (e) { }

    // 2. Google Sheets Sync if URL configured
    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "text/plain"
          },
          body: JSON.stringify({ handle: handle, score: this.score, message: message })
        });
      } catch (e) {
        console.error("Google Sheets Sync for cheers failed:", e);
      }
    }

    this.showNotice(this.t("noticeCheerSuccess"), "success");
    cheerInput.value = "";
    this.cheerSubmitBtn.disabled = false;
    this.cheerSubmitBtn.textContent = this.t("cheerSubmit");
    this.cheerPanel?.classList.add("is-sent");
  }

  closeLeaderboard() {
    this.leaderboardOverlay.classList.remove("is-visible");
    this.restartGame();
  }
}

window.apinkGame = new BaseballGame();
window.apinkGame.start();
