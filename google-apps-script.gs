/**
 * Apink Taipei Dome — Leaderboards & Cheers backend
 *
 * Sheets used (auto-created if missing):
 * - Baseball: Leaderboard   | Cheers
 * - Fish:     FishScores    | FishCheers
 * - Fish Pro: FishProScores | FishProCheers
 * - Fish Swipe: FishSwipeScores | FishSwipeCheers
 *
 * Score headers: handle | score
 * Cheer headers: handle | message | time
 */
var SHEET_LEADERBOARD = "Leaderboard";
var SHEET_CHEERS = "Cheers";
var SHEET_FISH_LEADERBOARD = "FishScores";
var SHEET_FISH_CHEERS = "FishCheers";
var SHEET_FISH_PRO_LEADERBOARD = "FishProScores";
var SHEET_FISH_PRO_CHEERS = "FishProCheers";
var SHEET_FISH_SWIPE_LEADERBOARD = "FishSwipeScores";
var SHEET_FISH_SWIPE_CHEERS = "FishSwipeCheers";

var GAME_SHEETS = {
  baseball: {
    leaderboard: SHEET_LEADERBOARD,
    cheers: SHEET_CHEERS
  },
  fish: {
    leaderboard: SHEET_FISH_LEADERBOARD,
    cheers: SHEET_FISH_CHEERS
  },
  fish_pro: {
    leaderboard: SHEET_FISH_PRO_LEADERBOARD,
    cheers: SHEET_FISH_PRO_CHEERS
  },
  fish_swipe: {
    leaderboard: SHEET_FISH_SWIPE_LEADERBOARD,
    cheers: SHEET_FISH_SWIPE_CHEERS
  }
};

var GET_ACTIONS = {
  leaderboard: { game: "baseball", type: "leaderboard" },
  cheers: { game: "baseball", type: "cheers" },
  fish_leaderboard: { game: "fish", type: "leaderboard" },
  fish_cheers: { game: "fish", type: "cheers" },
  fish_pro_leaderboard: { game: "fish_pro", type: "leaderboard" },
  fish_pro_cheers: { game: "fish_pro", type: "cheers" },
  fish_swipe_leaderboard: { game: "fish_swipe", type: "leaderboard" },
  fish_swipe_cheers: { game: "fish_swipe", type: "cheers" }
};

// ---- Entry points -------------------------------------------------

function doGet(e) {
  try {
    var action = String(e && e.parameter && e.parameter.action || "leaderboard");
    var target = GET_ACTIONS[action] || GET_ACTIONS.leaderboard;

    if (target.type === "cheers") {
      return jsonOutput({
        game: target.game,
        cheers: getCheers(target.game)
      });
    }

    return jsonOutput({
      game: target.game,
      leaderboard: getLeaderboard(target.game)
    });
  } catch (err) {
    return jsonOutput({ error: String(err) });
  }
}

function doPost(e) {
  var game = "baseball";
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    game = normalizeGame(body.game);
    var handle = String(body.handle || "").trim();
    var message = String(body.message || "").trim();
    var lock = LockService.getScriptLock();

    lock.waitLock(10000);
    try {
      if (message) {
        // Blessings are stored independently for each game.
        if (handle) appendCheer(game, handle, message);
      } else if (handle) {
        // Keep the highest score per handle within this game only.
        upsertScore(game, handle, Number(body.score) || 0);
      }
    } finally {
      lock.releaseLock();
    }

    // The game echo is required by the fish frontend so it never accepts
    // a leaderboard returned from an older, baseball-only deployment.
    return jsonOutput({
      game: game,
      leaderboard: getLeaderboard(game)
    });
  } catch (err) {
    return jsonOutput({ game: game, error: String(err) });
  }
}

// ---- Leaderboards -------------------------------------------------

function getLeaderboard(game) {
  var sheet = getSheet(sheetName(game, "leaderboard"), ["handle", "score"]);
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  var headers = values[0].map(normalizeHeader);
  var hCol = headers.indexOf("handle");
  var sCol = headers.indexOf("score");
  if (hCol === -1) hCol = 0;
  if (sCol === -1) sCol = 1;

  var out = [];
  for (var i = 1; i < values.length; i++) {
    var handle = String(values[i][hCol] || "").trim();
    var score = Number(values[i][sCol]);
    if (!handle || !isFinite(score)) continue;
    out.push({ handle: handle, score: score });
  }
  out.sort(function (a, b) { return b.score - a.score; });
  return out;
}

function upsertScore(game, handle, score) {
  var sheet = getSheet(sheetName(game, "leaderboard"), ["handle", "score"]);
  var values = sheet.getDataRange().getValues();
  var headers = values[0].map(normalizeHeader);
  var hCol = headers.indexOf("handle");
  var sCol = headers.indexOf("score");
  if (hCol === -1) hCol = 0;
  if (sCol === -1) sCol = 1;

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][hCol] || "").trim() === handle) {
      var existing = Number(values[i][sCol]) || 0;
      if (score > existing) {
        sheet.getRange(i + 1, sCol + 1).setValue(score);
      }
      return;
    }
  }

  var row = [];
  row[hCol] = handle;
  row[sCol] = score;
  sheet.appendRow(row);
}

// ---- Cheers -------------------------------------------------------

function getCheers(game) {
  var sheet = getSheet(sheetName(game, "cheers"), ["handle", "message", "time"]);
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  var headers = values[0].map(normalizeHeader);
  var hCol = headers.indexOf("handle");
  var mCol = headers.indexOf("message");
  var tCol = headers.indexOf("time");
  if (hCol === -1) hCol = 0;
  if (mCol === -1) mCol = 1;
  if (tCol === -1) tCol = 2;

  var out = [];
  for (var i = 1; i < values.length; i++) {
    var message = String(values[i][mCol] || "").trim();
    if (!message) continue;
    out.push({
      handle: String(values[i][hCol] || "").trim(),
      message: message,
      time: values[i][tCol] ? String(values[i][tCol]) : ""
    });
  }
  return out;
}

function appendCheer(game, handle, message) {
  var sheet = getSheet(sheetName(game, "cheers"), ["handle", "message", "time"]);
  var headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(normalizeHeader);
  var hCol = headers.indexOf("handle");
  var mCol = headers.indexOf("message");
  var tCol = headers.indexOf("time");
  if (hCol === -1) hCol = 0;
  if (mCol === -1) mCol = 1;
  if (tCol === -1) tCol = 2;

  var row = [];
  row[hCol] = handle;
  row[mCol] = message;
  row[tCol] = new Date().toISOString();
  sheet.appendRow(row);
}

// ---- Helpers ------------------------------------------------------

function normalizeGame(game) {
  var value = String(game || "").toLowerCase().trim();
  return GAME_SHEETS[value] ? value : "baseball";
}

function sheetName(game, type) {
  var config = GAME_SHEETS[normalizeGame(game)];
  return config[type];
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeHeader(h) {
  return String(h || "").toLowerCase().trim();
}

function getSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  return sheet;
}
