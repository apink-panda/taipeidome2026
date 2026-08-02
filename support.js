// Combined bilingual cheer wall.
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwJssnwqL636-7t1P2LtspixCWvdm4ffMhQxmAYDB62f4Y2BwvgmxRryl-nbN3Qsu6P/exec";

const cheerRotationMs = 5 * 1000;
const refreshIntervalMs = 10 * 60 * 1000;
const homeLanguageStorageKey = "apink_language_preference";
const performanceFeedCacheKey = "apink_performance_feed_v1";

async function prefetchPerformanceFeed() {
  try {
    const response = await fetch("./api/performance", { cache: "default" });
    if (!response.ok) return;
    const result = await response.json();
    if (!result?.ok || !Array.isArray(result.data)) return;
    localStorage.setItem(performanceFeedCacheKey, JSON.stringify({
      cachedAt: Date.now(),
      updatedAt: result.updatedAt || "",
      data: result.data,
    }));
  } catch (error) {
    // Preloading is optional; performance.html will fetch the feed when needed.
  }
}

function schedulePerformancePrefetch() {
  const run = () => prefetchPerformanceFeed();
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 1200 });
  } else {
    window.setTimeout(run, 250);
  }
}

const homeI18n = {
  zh: {
    htmlLang: "zh-Hant",
    title: "7/31 台北大巨蛋應援活動 | Apink × PANDA",
    description: "7/31 Apink 台北大巨蛋應援活動首頁，隨機展示四個應援遊戲收集的中韓雙語留言。",
    languageLabel: "語言",
    languageAuto: "自動",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    skipLink: "跳至目前應援留言",
    topbarAria: "頁面導覽",
    eyebrow: "Apink × Panda · 台北大巨蛋",
    heading: '7/31<br />台北大巨蛋<br />應援活動<span lang="ko">7/31 타이베이 돔 응원 이벤트</span>',
    intro: "四個應援遊戲收集的 Panda 心意，在這裡化成粉色星光。",
    wallLabel: "PANDA 應援即時輪播 · PANDA 응원 라이브",
    liveMark: "閃耀中",
    changeNote: '<span aria-hidden="true">✦ · · ✦</span>忽明忽滅後，遇見下一句',
    showAll: "查看全部留言",
    hideAll: "回到單則輪播",
    allHeading: "所有應援留言",
    allListAria: "所有中韓應援留言",
    allCount: "{count} 則留言",
    allLoading: "留言載入中……",
    allEmpty: "目前還沒有留言。",
    navAria: "應援活動導覽",
    performanceLink: "🎤 開球及賽後表演",
    baseballLink: "⚾ 棒球應援遊戲",
    fishLink: "🎣 幸運明太魚",
    swipeLink: "⚡ 快手捕獲戰",
    leaderboardLink: "🏆 四項排行榜",
    marqueeAria: "持續播放的中韓雙語應援跑馬燈",
    disclaimer: "本活動為粉絲自發性應援，與官方主辦單位無關。",
    syncedAll: "所有應援已同步",
    syncedPartial: "部分應援已同步，其餘顯示暫存",
    localOnly: "顯示本機暫存應援",
    status: "{sync} · {count} 則應援 · 每 5 秒隨機展示{fallback}",
    fallback: " · {count} 則保留原文",
  },
  en: {
    htmlLang: "en",
    title: "7/31 Taipei Dome Cheer Event | Apink × PANDA",
    description: "The Apink Taipei Dome cheer event home, featuring Chinese and Korean messages collected across four games.",
    languageLabel: "Language",
    languageAuto: "Auto",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    skipLink: "Skip to the current cheer",
    topbarAria: "Page navigation",
    eyebrow: "Apink × Panda · Taipei Dome",
    heading: '7/31<br />Taipei Dome<br />Cheer Event<span lang="ko">7/31 타이베이 돔 응원 이벤트</span>',
    intro: "Messages from all four cheer games gather here as pink starlight.",
    wallLabel: "PANDA LIVE CHEERS · 中文 + 한국어",
    liveMark: "NOW GLOWING",
    changeNote: '<span aria-hidden="true">✦ · · ✦</span>Fade and glow into the next message',
    showAll: "View All Cheers",
    hideAll: "Back to Live Cheer",
    allHeading: "All Cheer Messages",
    allListAria: "All Chinese and Korean cheer messages",
    allCount: "{count} messages",
    allLoading: "Loading messages…",
    allEmpty: "No messages yet.",
    navAria: "Cheer event navigation",
    performanceLink: "🎤 First Pitch & Postgame Show",
    baseballLink: "⚾ Baseball Cheer Game",
    fishLink: "🎣 Lucky Myeongtae",
    swipeLink: "⚡ Swipe Catch",
    leaderboardLink: "🏆 All Leaderboards",
    marqueeAria: "Scrolling Chinese and Korean cheer messages",
    disclaimer: "This is a fan-organized cheer event and is not affiliated with the official organizer.",
    syncedAll: "All cheers synced",
    syncedPartial: "Some cheers synced; cached messages shown for the rest",
    localOnly: "Showing locally cached cheers",
    status: "{sync} · {count} cheers · Random display every 5 seconds{fallback}",
    fallback: " · {count} kept in the original language",
  },
  ja: {
    htmlLang: "ja",
    title: "7/31 台北ドーム応援イベント | Apink × PANDA",
    description: "4つの応援ゲームから集まった中国語・韓国語のメッセージをランダムに紹介する、Apink台北ドーム応援イベントのホームです。",
    languageLabel: "言語",
    languageAuto: "自動",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    skipLink: "現在の応援メッセージへ移動",
    topbarAria: "ページナビゲーション",
    eyebrow: "Apink × Panda · 台北ドーム",
    heading: '7/31<br />台北ドーム<br />応援イベント<span lang="ko">7/31 타이베이 돔 응원 이벤트</span>',
    intro: "4つの応援ゲームに寄せられたPandaの想いが、ここでピンクの星明かりになります。",
    wallLabel: "PANDA 応援ライブ · 中文 + 한국어",
    liveMark: "点灯中",
    changeNote: '<span aria-hidden="true">✦ · · ✦</span>光が揺らめいたら、次のメッセージへ',
    showAll: "すべてのメッセージ",
    hideAll: "1件表示に戻る",
    allHeading: "すべての応援メッセージ",
    allListAria: "中国語と韓国語の全応援メッセージ",
    allCount: "{count}件のメッセージ",
    allLoading: "メッセージを読み込み中…",
    allEmpty: "メッセージはまだありません。",
    navAria: "応援イベントのナビゲーション",
    performanceLink: "🎤 始球式＆試合後公演",
    baseballLink: "⚾ 野球応援ゲーム",
    fishLink: "🎣 幸運のミョンテ",
    swipeLink: "⚡ 早取りチャレンジ",
    leaderboardLink: "🏆 全ランキング",
    marqueeAria: "中国語と韓国語の応援メッセージを流すテロップ",
    disclaimer: "本イベントはファンによる自主的な応援活動であり、公式主催者とは関係ありません。",
    syncedAll: "すべての応援を同期しました",
    syncedPartial: "一部を同期し、残りは保存データを表示中",
    localOnly: "保存済みの応援を表示中",
    status: "{sync} · {count}件 · 5秒ごとにランダム表示{fallback}",
    fallback: " · {count}件は原文のまま",
  },
  ko: {
    htmlLang: "ko",
    title: "7/31 타이베이 돔 응원 이벤트 | Apink × PANDA",
    description: "네 가지 응원 게임에서 모인 중국어와 한국어 메시지를 무작위로 소개하는 Apink 타이베이 돔 응원 이벤트 홈입니다.",
    languageLabel: "언어",
    languageAuto: "자동",
    languageZh: "繁體中文",
    languageEn: "English",
    languageJa: "日本語",
    languageKo: "한국어",
    skipLink: "현재 응원 메시지로 이동",
    topbarAria: "페이지 탐색",
    eyebrow: "Apink × Panda · 타이베이 돔",
    heading: '7/31<br />타이베이 돔<br />응원 이벤트<span lang="zh-Hant">7/31 台北大巨蛋應援活動</span>',
    intro: "네 가지 응원 게임에서 모인 Panda의 마음이 이곳에서 분홍빛 별이 됩니다.",
    wallLabel: "PANDA 응원 라이브 · 中文 + 한국어",
    liveMark: "반짝이는 중",
    changeNote: '<span aria-hidden="true">✦ · · ✦</span>빛이 깜빡이면 다음 메시지를 만나요',
    showAll: "전체 메시지 보기",
    hideAll: "한 문장 보기로",
    allHeading: "모든 응원 메시지",
    allListAria: "모든 중국어·한국어 응원 메시지",
    allCount: "메시지 {count}개",
    allLoading: "메시지를 불러오는 중…",
    allEmpty: "아직 메시지가 없어요.",
    navAria: "응원 이벤트 탐색",
    performanceLink: "🎤 시구 및 경기 후 공연",
    baseballLink: "⚾ 야구 응원 게임",
    fishLink: "🎣 행운 명태",
    swipeLink: "⚡ 빠른 손 캐치",
    leaderboardLink: "🏆 전체 랭킹",
    marqueeAria: "중국어와 한국어 응원 메시지 전광판",
    disclaimer: "본 이벤트는 팬들이 자발적으로 진행하는 응원 활동이며 공식 주최 측과 무관합니다.",
    syncedAll: "모든 응원을 동기화했어요",
    syncedPartial: "일부를 동기화하고 나머지는 저장된 메시지를 표시해요",
    localOnly: "기기에 저장된 응원을 표시해요",
    status: "{sync} · 응원 {count}개 · 5초마다 무작위 표시{fallback}",
    fallback: " · {count}개는 원문 유지",
  },
};

const cheerSources = [
  {
    key: "baseball",
    action: "cheers",
    cacheKey: "apink_cheers",
    expectedGame: "baseball",
  },
  {
    key: "fish",
    action: "fish_cheers",
    cacheKey: "apink_fish_cheers",
    expectedGame: "fish",
  },
  {
    key: "fish_pro",
    action: "fish_pro_cheers",
    cacheKey: "apink_fish_pro_cheers",
    expectedGame: "fish_pro",
  },
  {
    key: "fish_swipe",
    action: "fish_swipe_cheers",
    cacheKey: "apink_fish_swipe_cheers",
    expectedGame: "fish_swipe",
  },
];

const translationGroups = [
  {
    sources: ["Apink 15 週年快樂，永遠一起走下去！💖", "Apink 15주년 축하해요, 앞으로도 영원히 함께해요! 💖"],
    zh: "Apink 15 週年快樂，永遠一起走下去！💖",
    ko: "Apink 15주년 축하해요, 앞으로도 영원히 함께해요! 💖",
  },
  {
    sources: ["Apink Forever 🩷🩷🩷🩷🩷🐼🐼🐼🐼🐼"],
    zh: "Apink 永遠在一起！🩷🩷🩷🩷🩷🐼🐼🐼🐼🐼",
    ko: "Apink 영원히 함께해요! 🩷🩷🩷🩷🩷🐼🐼🐼🐼🐼",
  },
  {
    sources: ["Apink Lets Go!!!!!!❤️🫶🏻投出帥氣球，支持Apink🐼"],
    zh: "Apink 出發吧！投出帥氣好球，永遠支持 Apink！❤️🫶🏻🐼",
    ko: "Apink 가자! 멋진 공을 던져요. 언제나 Apink를 응원해요! ❤️🫶🏻🐼",
  },
  {
    sources: ["Apink 大發！！！", "apink大發"],
    zh: "Apink 大發！！！",
    ko: "Apink 대박!!!",
  },
  {
    sources: ["Apink 的歌聲是 Panda 最幸福的禮物！🎶", "Apink's voices are the happiest gift for Pandas! 🎶"],
    zh: "Apink 的歌聲是 Panda 最幸福的禮物！🎶",
    ko: "Apink의 노래는 Panda에게 가장 행복한 선물이에요! 🎶",
  },
  {
    sources: ["Apink 與 Panda 的故事永遠不會結束！♾️", "Apink 與 Panda 的故事永遠不會結束！♾️l"],
    zh: "Apink 與 Panda 的故事永遠不會結束！♾️",
    ko: "Apink와 Panda의 이야기는 영원히 끝나지 않아요! ♾️",
  },
  {
    sources: ["Apink 與 Panda 的故事永遠不會結束！♾️ 我會繼續支持你們的 🫶"],
    zh: "Apink 與 Panda 的故事永遠不會結束！我會繼續支持你們！♾️🫶",
    ko: "Apink와 Panda의 이야기는 영원히 끝나지 않아요! 계속 응원할게요! ♾️🫶",
  },
  {
    sources: ["Apink 최고❤️謝謝實現大巨蛋的約定🤙"],
    zh: "Apink 最棒了❤️謝謝實現大巨蛋的約定🤙",
    ko: "Apink 최고❤️ 타이베이 돔의 약속을 지켜 줘서 고마워요🤙",
  },
  {
    sources: ["Apink 💖 台北大巨蛋衝呀！"],
    zh: "Apink 💖 台北大巨蛋衝呀！",
    ko: "Apink 💖 타이베이 돔으로 가자!",
  },
  {
    sources: ["Apink 💖 台北大巨蛋衝呀！恭喜你們登上夢想中的大舞台！！！！！"],
    zh: "Apink 💖 台北大巨蛋衝呀！恭喜登上夢想中的大舞台！",
    ko: "Apink 💖 타이베이 돔으로 가자! 꿈의 무대에 오른 것을 축하해요!",
  },
  {
    sources: ["Apink 💖 台北大巨蛋衝呀！한명당! 서른명!"],
    zh: "Apink 💖 台北大巨蛋衝呀！一人帶三十人！",
    ko: "Apink 💖 타이베이 돔으로 가자! 한 명당 서른 명!",
  },
  {
    sources: ["Apink南波萬！！"],
    zh: "Apink 第一名！！",
    ko: "Apink 넘버원!!",
  },
  {
    sources: ["Apink和panda永遠在一起～愛你們～♥️大發"],
    zh: "Apink 和 Panda 永遠在一起～愛你們～♥️大發！",
    ko: "Apink와 Panda 영원히 함께해요! 사랑해요! ♥️ 대박!",
  },
  {
    sources: ["Apink大發!!!!!! 大巨蛋Lets go~~~ 應援全場"],
    zh: "Apink 大發！大巨蛋出發，全場一起應援！",
    ko: "Apink 대박! 타이베이 돔으로 가자! 모두 함께 응원해요!",
  },
  {
    sources: ["Apink投球超帥😙😙😙期待登上大巨蛋"],
    zh: "Apink 投球超帥！期待登上大巨蛋！😙😙😙",
    ko: "Apink의 멋진 투구! 타이베이 돔 무대를 기대해요! 😙😙😙",
  },
  {
    sources: ["Apink繼續走花路！🐼🌸"],
    zh: "Apink 繼續走花路！🐼🌸",
    ko: "Apink, 앞으로도 꽃길만 걸어요! 🐼🌸",
  },
  {
    sources: ["Hello", "hello"],
    zh: "哈囉！",
    ko: "안녕하세요!",
  },
  {
    sources: ["Hhcfhhuu"],
    zh: "嗨！為 Apink 加油！",
    ko: "안녕! Apink를 응원해요!",
  },
  {
    sources: ["Panda 永遠支持 Apink，15 週年粗卡！🐼", "Panda 永遠支持 Apink，15 週年粗卡！🐼ijbvnlgxjonc"],
    zh: "Panda 永遠支持 Apink，15 週年快樂！🐼",
    ko: "Panda는 영원히 Apink를 응원해요. 15주년 축하해요! 🐼",
  },
  {
    sources: ["Ping Doongs 幫 Panda 釣滿幸福與幸運！🎣", "Ping Doongs가 Panda에게 행복과 행운을 낚아 줄게요! 🎣"],
    zh: "Ping Doongs 幫 Panda 釣滿幸福與幸運！🎣",
    ko: "Ping Doongs가 Panda에게 행복과 행운을 낚아 줄게요! 🎣",
  },
  {
    sources: ["一人帶三十人達標！！"],
    zh: "一人帶三十人達標！！",
    ko: "한 명당 서른 명, 목표 달성!!",
  },
  {
    sources: ["一個人帶三十個人！！支持開球成功，7月31日見！！！"],
    zh: "一個人帶三十個人！支持開球成功，7 月 31 日見！",
    ko: "한 명이 서른 명과 함께! 성공적인 시구를 응원해요. 7월 31일에 만나요!",
  },
  {
    sources: ["一起迎接更多個充滿愛的週年吧！🎉"],
    zh: "一起迎接更多個充滿愛的週年吧！🎉",
    ko: "사랑 가득한 기념일을 앞으로도 함께 맞이해요! 🎉",
  },
  {
    sources: ["五色明太魚守護 Apink 閃閃發光！✨"],
    zh: "五色明太魚守護 Apink 閃閃發光！✨",
    ko: "다섯 빛깔 명태가 반짝이는 Apink를 지켜 줄게요! ✨",
  },
  {
    sources: ["五隻幸運明太魚，守護 Apink 閃閃發光！✨", "다섯 마리 행운 명태가 빛나는 Apink를 지켜 줄게요! ✨"],
    zh: "五隻幸運明太魚，守護 Apink 閃閃發光！✨",
    ko: "다섯 마리 행운 명태가 빛나는 Apink를 지켜 줄게요! ✨",
  },
  {
    sources: ["和阿粉們在一起的時光珍貴又難忘！是美好的回憶🩷"],
    zh: "和 Apink 在一起的時光珍貴又難忘，是最美好的回憶！🩷",
    ko: "Apink와 함께한 시간은 소중하고 잊지 못할 아름다운 추억이에요! 🩷",
  },
  {
    sources: ["夢想的舞台實現了，可以跟著Apink開箱大巨蛋感到無比光榮！！！！！ 🐼🎤🌟"],
    zh: "夢想舞台實現了！能跟著 Apink 一起開箱大巨蛋，感到無比光榮！🐼🎤🌟",
    ko: "꿈의 무대가 이루어졌어요! Apink와 함께 타이베이 돔의 첫 순간을 맞아 정말 영광이에요! 🐼🎤🌟",
  },
  {
    sources: ["大巨蛋滿座！Apink 萬歲！"],
    zh: "大巨蛋滿座！Apink 萬歲！",
    ko: "타이베이 돔 만석! Apink 만세!",
  },
  {
    sources: ["大巨蛋滿座！Apink 萬歲！一人帶30人~~~！！！"],
    zh: "大巨蛋滿座！Apink 萬歲！一人帶三十人！",
    ko: "타이베이 돔 만석! Apink 만세! 한 명당 서른 명!",
  },
  {
    sources: ["大巨蛋滿座！Apink 萬歲！好好玩喔這遊戲！！！！"],
    zh: "大巨蛋滿座！Apink 萬歲！這個遊戲好好玩！",
    ko: "타이베이 돔 만석! Apink 만세! 이 게임 정말 재미있어요!",
  },
  {
    sources: ["對Apink的❤️永遠不會改變，不管是15年還是25年"],
    zh: "對 Apink 的愛永遠不會改變，不管是 15 年還是 25 年！❤️",
    ko: "15년이든 25년이든 Apink를 향한 사랑은 영원히 변하지 않아요! ❤️",
  },
  {
    sources: ["希望未來每一場Apink 的活動都能夠參與❤️竭盡所能🥺✌️🤟🤙🏼"],
    zh: "希望未來每一場 Apink 的活動都能參與，我會竭盡所能！❤️🥺✌️🤟🤙🏼",
    ko: "앞으로 모든 Apink 활동에 함께할 수 있도록 최선을 다할게요! ❤️🥺✌️🤟🤙🏼",
  },
  {
    sources: ["幸運明太魚把所有好事都送給 Apink！🐟"],
    zh: "幸運明太魚把所有好事都送給 Apink！🐟",
    ko: "행운 명태가 모든 좋은 일을 Apink에게 전해 줄게요! 🐟",
  },
  {
    sources: ["快手抓住五色明太魚，把幸運送給 Panda！🐟"],
    zh: "快手抓住五色明太魚，把幸運送給 Panda！🐟",
    ko: "빠른 손으로 다섯 빛깔 명태를 잡아 Panda에게 행운을 전해요! 🐟",
  },
  {
    sources: ["恩地全壘打！"],
    zh: "恩地全壘打！",
    ko: "은지 홈런!",
  },
  {
    sources: ["接下來的15年繼續當最給力的胖達🥰"],
    zh: "接下來的 15 年，也要繼續當最給力的 Panda！🥰",
    ko: "앞으로 15년도 가장 든든한 Panda가 될게요! 🥰",
  },
  {
    sources: ["普美投球超帥，初瓏全壘打！"],
    zh: "普美投球超帥，初瓏全壘打！",
    ko: "보미의 투구는 최고, 초롱은 홈런!",
  },
  {
    sources: ["普美投球超帥，恩地全壘打！"],
    zh: "普美投球超帥，恩地全壘打！",
    ko: "보미의 투구는 최고, 은지는 홈런!",
  },
  {
    sources: ["永遠愛Apink❤️"],
    zh: "永遠愛 Apink！❤️",
    ko: "Apink를 영원히 사랑해요! ❤️",
  },
  {
    sources: ["永遠支持 Apink！🐼🌸"],
    zh: "永遠支持 Apink！🐼🌸",
    ko: "언제나 Apink를 응원해요! 🐼🌸",
  },
  {
    sources: ["永遠支持 Apink！🐼🌸\n阿粉一生追，我瓏一生推🥰"],
    zh: "永遠支持 Apink！阿粉一生追，我瓏一生推！🐼🌸🥰",
    ko: "언제나 Apink를 응원해요! 평생 Panda, 평생 초롱 팬이에요! 🐼🌸🥰",
  },
  {
    sources: ["永遠支持 Apink！🐼🌸 阿粉我愛你！！！！！"],
    zh: "永遠支持 Apink！阿粉我愛你！🐼🌸",
    ko: "언제나 Apink를 응원해요! Apink 사랑해요! 🐼🌸",
  },
  {
    sources: ["永遠支持 Apink！🐼🌸要一直走花路哦~"],
    zh: "永遠支持 Apink！要一直走花路哦！🐼🌸",
    ko: "언제나 Apink를 응원해요! 계속 꽃길만 걸어요! 🐼🌸",
  },
  {
    sources: ["永遠的 我們的Apink 🩷"],
    zh: "永遠的、我們的 Apink！🩷",
    ko: "영원한 우리의 Apink! 🩷",
  },
  {
    sources: ["謝謝15 年一直陪在我們身邊 ~ 夏榮生日快樂"],
    zh: "謝謝 15 年來一直陪在我們身邊，夏榮生日快樂！",
    ko: "15년 동안 늘 곁에 있어 줘서 고마워요. 하영 생일 축하해요!",
  },
  {
    sources: ["願 Apink 和 Panda 每天都有滿滿好運！🍀", "願 Apink 和 Panda 每天都有滿滿好運！🍀hhgjhh", "願 Apink 和 Panda 每天都有滿滿好運！🐼💗"],
    zh: "願 Apink 和 Panda 每天都有滿滿好運！🍀",
    ko: "Apink와 Panda의 매일에 행운이 가득하길 바라요! 🍀",
  },
  {
    sources: ["願每位成員健康平安、天天開心！🌸"],
    zh: "願每位成員健康平安、天天開心！🌸",
    ko: "모든 멤버가 건강하고 매일 행복하길 바라요! 🌸",
  },
  {
    sources: ["願每位成員健康平安、天天開心！🌸 我非常愛你們 🫶"],
    zh: "願每位成員健康平安、天天開心！我非常愛你們！🌸🫶",
    ko: "모든 멤버가 건강하고 매일 행복하길 바라요! 정말 사랑해요! 🌸🫶",
  },
  {
    sources: ["사랑해. 우리 타이베이 만나요. 화이팅."],
    zh: "愛你們，我們台北見，加油！",
    ko: "사랑해요. 우리 타이베이에서 만나요. 화이팅!",
  },
  {
    sources: ["에이핑크 드디어 타이베이 돔에 와요!!!!! 진심으로 축하해요!!! 🫶🫶🫶🫶🫶⚾🫡"],
    zh: "Apink 終於來到台北大巨蛋！真心恭喜你們！🫶🫶🫶🫶🫶⚾🫡",
    ko: "에이핑크 드디어 타이베이 돔에 와요! 진심으로 축하해요! 🫶🫶🫶🫶🫶⚾🫡",
  },
  {
    sources: ["영원히 사랑해 영원히 함께해 영원히 우리는 에이핑크"],
    zh: "永遠相愛、永遠相伴，我們永遠是 Apink！",
    ko: "영원히 사랑해, 영원히 함께해, 영원히 우리는 에이핑크!",
  },
];

const normalizeText = (value) => String(value || "").replace(/\s+/g, " ").trim();

const translationIndex = new Map();
translationGroups.forEach((group) => {
  group.sources.forEach((source) => {
    translationIndex.set(normalizeText(source), { zh: group.zh, ko: group.ko });
  });
});

function toBilingual(message) {
  const original = String(message || "").trim();
  const normalized = normalizeText(original);
  const exact = translationIndex.get(normalized);
  if (exact) return { ...exact, translated: true };

  if (normalized.startsWith("Apink前進大巨蛋")) {
    const wantsBomi = /普美開球/.test(normalized);
    return {
      zh: normalized,
      ko: wantsBomi
        ? "Apink, 타이베이 돔으로 가자! 보미의 시구를 보고 싶어요!"
        : "Apink, 타이베이 돔으로 가자!",
      translated: true,
    };
  }

  if (/[가-힣]/.test(normalized)) {
    return {
      zh: `原文應援：${original}`,
      ko: original,
      translated: false,
    };
  }

  return {
    zh: original,
    ko: `원문 응원: ${original}`,
    translated: false,
  };
}

const state = {
  cheers: [],
  queue: [],
  currentIndex: -1,
  rotationTimer: null,
  refreshTimer: null,
  changing: false,
  remoteSourceCount: 0,
  loaded: false,
};

const fishAvatarPaths = [
  "./assets/fish/rong_fish.webp",
  "./assets/fish/bomi_fish.webp",
  "./assets/fish/enji_fish.webp",
  "./assets/fish/najoo_fish.webp",
  "./assets/fish/hayoung_fish.webp",
];

let homeLanguageMode = "auto";
let homeLocale = "zh";

const interpolateHome = (template, values = {}) =>
  String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

const isHomePage = () => document.body.classList.contains("cheer-home-page");

function detectHomeLocale() {
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

function readHomeLanguageMode() {
  let stored = "auto";
  try {
    stored = localStorage.getItem(homeLanguageStorageKey) || "auto";
  } catch (error) {
    // Automatic language selection remains available without storage.
  }
  return ["auto", "zh", "en", "ja", "ko"].includes(stored) ? stored : "auto";
}

function writeHomeLanguageMode(mode) {
  homeLanguageMode = ["auto", "zh", "en", "ja", "ko"].includes(mode) ? mode : "auto";
  try {
    localStorage.setItem(homeLanguageStorageKey, homeLanguageMode);
  } catch (error) {
    // The selection still applies for the current visit.
  }
}

function homeT(key, values = {}) {
  return interpolateHome(homeI18n[homeLocale]?.[key] ?? homeI18n.zh[key] ?? key, values);
}

function setHomeText(selector, key) {
  const element = document.querySelector(selector);
  if (element) element.textContent = homeT(key);
}

function setHomeHtml(selector, key) {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = homeT(key);
}

function setHomeAria(selector, key) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute("aria-label", homeT(key));
}

function applyHomeLocale(mode = readHomeLanguageMode()) {
  if (!isHomePage()) return;

  homeLanguageMode = ["auto", "zh", "en", "ja", "ko"].includes(mode) ? mode : "auto";
  homeLocale = homeLanguageMode === "auto" ? detectHomeLocale() : homeLanguageMode;
  const copy = homeI18n[homeLocale] ?? homeI18n.zh;

  document.documentElement.lang = copy.htmlLang;
  document.title = homeT("title");
  document.querySelector('meta[name="description"]')?.setAttribute("content", homeT("description"));

  const select = document.querySelector("#homeLanguageSelect");
  if (select) {
    select.value = homeLanguageMode;
    select.querySelector('option[value="auto"]').textContent = homeT("languageAuto");
    select.querySelector('option[value="zh"]').textContent = homeT("languageZh");
    select.querySelector('option[value="en"]').textContent = homeT("languageEn");
    select.querySelector('option[value="ja"]').textContent = homeT("languageJa");
    select.querySelector('option[value="ko"]').textContent = homeT("languageKo");
  }

  setHomeText("#homeLanguageLabel", "languageLabel");
  setHomeText("#homeSkipLink", "skipLink");
  setHomeText("#homeEyebrow", "eyebrow");
  setHomeHtml("#cheerPageTitle", "heading");
  setHomeText("#homeIntroCopy", "intro");
  setHomeText("#homeWallLabel", "wallLabel");
  setHomeText("#homeLiveMark", "liveMark");
  setHomeHtml("#homeChangeNote", "changeNote");
  setHomeText("#showAllCheersButton", "showAll");
  setHomeText("#hideAllCheersButton", "hideAll");
  setHomeText("#allCheersTitle", "allHeading");
  setHomeText("#homePerformanceLink", "performanceLink");
  setHomeText("#homeBaseballLink", "baseballLink");
  setHomeText("#homeFishLink", "fishLink");
  setHomeText("#homeSwipeLink", "swipeLink");
  setHomeText("#homeLeaderboardLink", "leaderboardLink");
  setHomeText("#homeDisclaimer", "disclaimer");
  setHomeAria("#homeTopbar", "topbarAria");
  setHomeAria("#homeSiteNav", "navAria");
  setHomeAria("#homeMarquee", "marqueeAria");
  setHomeAria("#allCheersList", "allListAria");
  renderAllCheers();
  updateStatus(state.remoteSourceCount);
}

function maskHandle(handle) {
  const value = String(handle || "").trim();
  if (!value || value === "匿名" || value === "익명") return "PANDA";

  const prefix = value.startsWith("@") ? "@" : "";
  const body = prefix ? value.slice(1) : value;
  const chars = Array.from(body);
  if (!chars.length) return `${prefix}PANDA`;
  if (chars.length === 1) return `${prefix}${chars[0]}*`;

  const maskLength = Math.max(chars.length - 2, 1);
  return `${prefix}${chars[0]}${"*".repeat(maskLength)}${chars[chars.length - 1]}`;
}

function readLocalCheers(source) {
  try {
    const value = JSON.parse(localStorage.getItem(source.cacheKey) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

function writeLocalCheers(source, cheers) {
  try {
    localStorage.setItem(source.cacheKey, JSON.stringify(cheers));
  } catch (error) {
    // The live page still works when storage is unavailable.
  }
}

async function fetchSourceCheers(source) {
  const url = `${GOOGLE_SCRIPT_URL}?action=${source.action}&ts=${Date.now()}`;
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Cheer request failed: ${response.status}`);

  const data = await response.json();
  if (data?.game && data.game !== source.expectedGame) {
    throw new Error(`Unexpected cheer source: ${data.game}`);
  }
  return Array.isArray(data?.cheers) ? data.cheers : [];
}

function normalizeCheers(list) {
  return list
    .filter((item) => item && normalizeText(item.message))
    .map((item) => {
      const bilingual = toBilingual(item.message);
      return {
        handle: String(item.handle || "PANDA").trim() || "PANDA",
        time: item.time || "",
        zh: bilingual.zh,
        ko: bilingual.ko,
        translated: bilingual.translated,
        avatar: fishAvatarPaths[Math.floor(Math.random() * fishAvatarPaths.length)],
      };
    });
}

function shuffledIndexes(length) {
  const values = Array.from({ length }, (_, index) => index);
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }
  return values;
}

function refillQueue() {
  state.queue = shuffledIndexes(state.cheers.length);
  if (state.queue.length > 1 && state.queue[0] === state.currentIndex) {
    [state.queue[0], state.queue[1]] = [state.queue[1], state.queue[0]];
  }
}

function takeNextCheer() {
  if (!state.cheers.length) return null;
  if (!state.queue.length) refillQueue();
  const index = state.queue.shift();
  state.currentIndex = index;
  return state.cheers[index];
}

function renderCheer(cheer) {
  if (!cheer) return;
  const quoteZh = document.querySelector("#cheerQuoteZh");
  const quoteKo = document.querySelector("#cheerQuoteKo");
  const author = document.querySelector("#cheerAuthor");

  if (quoteZh) quoteZh.textContent = cheer.zh;
  if (quoteKo) quoteKo.textContent = cheer.ko;
  if (author) author.textContent = `@${maskHandle(cheer.handle).replace(/^@/, "")}`;
}

function renderAllCheers() {
  if (!isHomePage()) return;
  const list = document.querySelector("#allCheersList");
  const count = document.querySelector("#allCheersCount");
  if (!list) return;

  if (count) count.textContent = homeT("allCount", { count: state.cheers.length });

  if (!state.cheers.length) {
    const empty = document.createElement("li");
    empty.className = "cheer-all-empty";
    empty.id = "allCheersEmpty";
    empty.textContent = homeT(state.loaded ? "allEmpty" : "allLoading");
    list.replaceChildren(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  state.cheers.forEach((cheer) => {
    const item = document.createElement("li");
    item.className = "cheer-all-item";

    const avatar = document.createElement("img");
    avatar.className = "cheer-all-avatar";
    avatar.src = cheer.avatar;
    avatar.alt = "";
    avatar.loading = "lazy";
    avatar.decoding = "async";
    avatar.setAttribute("aria-hidden", "true");

    const copy = document.createElement("div");
    copy.className = "cheer-all-copy";

    const zh = document.createElement("p");
    zh.className = "cheer-all-zh";
    zh.lang = "zh-Hant";
    zh.textContent = cheer.zh;

    const ko = document.createElement("p");
    ko.className = "cheer-all-ko";
    ko.lang = "ko";
    ko.textContent = cheer.ko;

    const author = document.createElement("p");
    author.className = "cheer-all-author";
    author.textContent = `@${maskHandle(cheer.handle).replace(/^@/, "")}`;

    copy.append(zh, ko, author);
    item.append(avatar, copy);
    fragment.append(item);
  });

  list.replaceChildren(fragment);
}

function isAllCheersVisible() {
  return isHomePage() && document.querySelector("#cheerCardScene")?.classList.contains("is-flipped");
}

function syncRotationTimer() {
  window.clearInterval(state.rotationTimer);
  state.rotationTimer = null;
  if (!isAllCheersVisible()) {
    state.rotationTimer = window.setInterval(showNextCheer, cheerRotationMs);
  }
}

function setAllCheersVisible(visible) {
  if (!isHomePage()) return;
  const scene = document.querySelector("#cheerCardScene");
  const front = document.querySelector("#currentCheer");
  const back = document.querySelector("#allCheersPanel");
  const list = document.querySelector("#allCheersList");
  const showButton = document.querySelector("#showAllCheersButton");
  if (!scene || !front || !back || !list) return;

  scene.classList.toggle("is-flipped", visible);
  front.setAttribute("aria-hidden", visible ? "true" : "false");
  back.setAttribute("aria-hidden", visible ? "false" : "true");
  front.toggleAttribute("inert", visible);
  back.toggleAttribute("inert", !visible);
  list.tabIndex = visible ? 0 : -1;

  if (visible) {
    renderAllCheers();
    list.scrollTop = 0;
    window.requestAnimationFrame(() => list.focus({ preventScroll: true }));
  } else {
    window.requestAnimationFrame(() => showButton?.focus({ preventScroll: true }));
  }

  syncRotationTimer();
}

function showNextCheer({ immediate = false } = {}) {
  if (state.changing || !state.cheers.length) return;
  const nextCheer = takeNextCheer();
  const stage = document.querySelector("#cheerMessageStage");
  if (!stage || immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    renderCheer(nextCheer);
    return;
  }

  state.changing = true;
  stage.classList.remove("is-changing");
  stage.offsetHeight;
  stage.classList.add("is-changing");

  window.setTimeout(() => renderCheer(nextCheer), 480);
  window.setTimeout(() => {
    stage.classList.remove("is-changing");
    state.changing = false;
  }, 920);
}

function marqueeItems() {
  const seen = new Set();
  const items = [];
  for (const cheer of state.cheers) {
    const key = `${cheer.zh}|${cheer.ko}`;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(cheer);
    if (items.length === 8) break;
  }
  return items;
}

function renderMarquee() {
  const track = document.querySelector("#cheerMarqueeTrack");
  if (!track || !state.cheers.length) return;

  const items = marqueeItems();
  const createGroup = (hidden = false) => {
    const group = document.createElement("p");
    group.className = "cheer-marquee-group";
    if (hidden) group.setAttribute("aria-hidden", "true");

    items.forEach((cheer) => {
      const zh = document.createElement("span");
      zh.lang = "zh-Hant";
      zh.textContent = cheer.zh;
      const ko = document.createElement("span");
      ko.lang = "ko";
      ko.textContent = cheer.ko;
      group.append(zh, ko);
    });
    return group;
  };

  track.replaceChildren(createGroup(), createGroup(true));
}

function updateStatus(remoteSourceCount) {
  const status = document.querySelector("#cheerStatus");
  if (!status) return;
  state.remoteSourceCount = remoteSourceCount;

  const fallbackCount = translationGroups.length
    ? state.cheers.filter((cheer) => !cheer.translated).length
    : 0;

  if (isHomePage()) {
    const syncKey =
      remoteSourceCount === cheerSources.length
        ? "syncedAll"
        : remoteSourceCount
          ? "syncedPartial"
          : "localOnly";
    const fallback = fallbackCount ? homeT("fallback", { count: fallbackCount }) : "";
    status.textContent = homeT("status", {
      sync: homeT(syncKey),
      count: state.cheers.length,
      fallback,
    });
    return;
  }

  const syncLabel =
    remoteSourceCount === cheerSources.length
      ? "所有應援已同步"
      : remoteSourceCount
        ? "部分應援已同步，其餘顯示暫存"
        : "顯示本機暫存應援";
  status.textContent = `${syncLabel} · ${state.cheers.length} 則應援 · 每 5 秒隨機展示${
    fallbackCount ? ` · ${fallbackCount} 則保留原文` : ""
  }`;
}

async function loadAllCheers() {
  const results = await Promise.all(
    cheerSources.map(async (source) => {
      let cheers = readLocalCheers(source);
      let remote = false;
      try {
        cheers = await fetchSourceCheers(source);
        writeLocalCheers(source, cheers);
        remote = true;
      } catch (error) {
        console.warn(`Unable to sync ${source.key} cheers; using local cache.`, error);
      }
      return { source, cheers, remote };
    }),
  );

  const nextCheers = results.flatMap(({ cheers }) => normalizeCheers(cheers));
  state.loaded = true;
  if (!nextCheers.length) {
    state.cheers = [];
    state.queue = [];
    state.currentIndex = -1;
    document.querySelector("#cheerQuoteZh").textContent = "留下第一句給 Apink 的祝福吧！";
    document.querySelector("#cheerQuoteKo").textContent = "Apink에게 첫 응원 메시지를 남겨 주세요!";
    renderAllCheers();
    updateStatus(0);
    return;
  }

  state.cheers = nextCheers;
  state.queue = [];
  state.currentIndex = -1;
  showNextCheer({ immediate: true });
  renderAllCheers();
  renderMarquee();
  updateStatus(results.filter((result) => result.remote).length);
}

function startRotation() {
  window.clearInterval(state.refreshTimer);
  syncRotationTimer();
  state.refreshTimer = window.setInterval(loadAllCheers, refreshIntervalMs);
}

document.addEventListener("DOMContentLoaded", async () => {
  if (isHomePage()) {
    schedulePerformancePrefetch();
    applyHomeLocale();
    document.querySelector("#homeLanguageSelect")?.addEventListener("change", (event) => {
      writeHomeLanguageMode(event.target.value);
      applyHomeLocale(homeLanguageMode);
    });
    document.querySelector("#showAllCheersButton")?.addEventListener("click", () => {
      setAllCheersVisible(true);
    });
    document.querySelector("#hideAllCheersButton")?.addEventListener("click", () => {
      setAllCheersVisible(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isAllCheersVisible()) setAllCheersVisible(false);
    });
  }
  await loadAllCheers();
  startRotation();
});
