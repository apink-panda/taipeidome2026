/**
 * Apink performance feed cache layer.
 *
 * Integration steps in the existing Apps Script project:
 * 1. Keep the existing readPerformanceRows() function unchanged.
 * 2. Replace the existing doGet() with the doGet() below.
 * 3. Add the remaining functions from this file.
 * 4. Run setupPerformanceCacheTrigger() once and authorize it.
 * 5. Deploy a new web-app version. The existing /exec URL remains unchanged.
 *
 * This code only reads the spreadsheet. It never inserts, edits, or removes
 * spreadsheet fields or rows.
 */

var PERFORMANCE_CACHE_KEY = "apink-performance-feed-v1";
var PERFORMANCE_CACHE_TTL_SECONDS = 10 * 60;
var PERFORMANCE_CACHE_REFRESH_FUNCTION = "refreshPerformanceCache";

function doGet() {
  try {
    return performanceJsonOutput_(getCachedPerformancePayload_());
  } catch (error) {
    return performanceJsonOutput_({
      ok: false,
      data: [],
      error: String(error && error.message || error)
    });
  }
}

function getCachedPerformancePayload_() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get(PERFORMANCE_CACHE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      cache.remove(PERFORMANCE_CACHE_KEY);
    }
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    cached = cache.get(PERFORMANCE_CACHE_KEY);
    if (cached) return JSON.parse(cached);
    return refreshPerformanceCache_();
  } finally {
    lock.releaseLock();
  }
}

function refreshPerformanceCache() {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    return refreshPerformanceCache_();
  } finally {
    lock.releaseLock();
  }
}

function refreshPerformanceCache_() {
  var rows = readPerformanceRows();
  var serializedRows = JSON.stringify(rows);
  var digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    serializedRows,
    Utilities.Charset.UTF_8
  );
  var version = digest.map(function (value) {
    return (value + 256).toString(16).slice(-2);
  }).join("");
  var payload = {
    ok: true,
    data: rows,
    version: version,
    updatedAt: new Date().toISOString()
  };
  var serializedPayload = JSON.stringify(payload);

  if (Utilities.newBlob(serializedPayload).getBytes().length < 100 * 1024) {
    CacheService.getScriptCache().put(
      PERFORMANCE_CACHE_KEY,
      serializedPayload,
      PERFORMANCE_CACHE_TTL_SECONDS
    );
  }
  return payload;
}

function setupPerformanceCacheTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === PERFORMANCE_CACHE_REFRESH_FUNCTION) {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  refreshPerformanceCache();
  ScriptApp.newTrigger(PERFORMANCE_CACHE_REFRESH_FUNCTION)
    .timeBased()
    .everyMinutes(5)
    .create();

  return "已建立每 5 分鐘更新一次的表演資料快取。";
}

function clearPerformanceCache() {
  CacheService.getScriptCache().remove(PERFORMANCE_CACHE_KEY);
  return "表演資料快取已清除。";
}

function performanceJsonOutput_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
