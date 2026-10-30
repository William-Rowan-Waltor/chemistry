import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
ENGINE_JS = ROOT / "js" / "engine.js"

text = ENGINE_JS.read_text(encoding="utf-8")

# 1. Update CUSTOM_DATA_KEY
old_key = 'var CUSTOM_DATA_KEY = "hoa11_12_custom_data_v2";'
new_key = 'var CUSTOM_DATA_KEY = "hoa11_12_custom_data_v3";'
assert old_key in text, "old_key not found"
text = text.replace(old_key, new_key, 1)

# 2. Update syncFromCloud
old_sync = """              localStorage.setItem(CUSTOM_DATA_KEY, JSON.stringify(cloudData.customData));
              Object.assign(DATA, cloudData.customData);
              updated = true;"""
new_sync = """              localStorage.setItem(CUSTOM_DATA_KEY, JSON.stringify(cloudData.customData));
              Object.assign(DATA, cloudData.customData);
              ensureOfficialTestsPreserved();
              updated = true;"""

if old_sync not in text and old_sync.replace('\n', '\r\n') in text:
    old_sync = old_sync.replace('\n', '\r\n')
    new_sync = new_sync.replace('\n', '\r\n')

assert old_sync in text, "old_sync not found"
text = text.replace(old_sync, new_sync, 1)

# 3. Add ensureOfficialTestsPreserved and update initCustomData
old_init = """  function initCustomData() {
    try {
      ORIGINAL_DATA = JSON.parse(JSON.stringify(DATA));
      var raw = localStorage.getItem(CUSTOM_DATA_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.chapters) {
          Object.assign(DATA, parsed);
        }
      }
    } catch (e) {
      console.warn("initCustomData error", e);
    }
  }"""

new_init = """  function ensureOfficialTestsPreserved() {
    if (ORIGINAL_DATA && Array.isArray(ORIGINAL_DATA.tests)) {
      DATA.tests = DATA.tests || [];
      var existingIds = {};
      for (var i = 0; i < DATA.tests.length; i++) {
        if (DATA.tests[i] && DATA.tests[i].id) {
          existingIds[DATA.tests[i].id] = true;
        }
      }
      for (var j = 0; j < ORIGINAL_DATA.tests.length; j++) {
        var ot = ORIGINAL_DATA.tests[j];
        if (ot && ot.id && !existingIds[ot.id]) {
          DATA.tests.push(ot);
          existingIds[ot.id] = true;
        }
      }
    }
  }

  function initCustomData() {
    try {
      ORIGINAL_DATA = JSON.parse(JSON.stringify(DATA));
      var raw = localStorage.getItem(CUSTOM_DATA_KEY);
      if (!raw) {
        raw = localStorage.getItem("hoa11_12_custom_data_v2") || localStorage.getItem("hoa11_12_custom_data_v1");
      }
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.chapters) {
          Object.assign(DATA, parsed);
        }
      }
      ensureOfficialTestsPreserved();
    } catch (e) {
      console.warn("initCustomData error", e);
    }
  }"""

if old_init not in text and old_init.replace('\n', '\r\n') in text:
    old_init = old_init.replace('\n', '\r\n')
    new_init = new_init.replace('\n', '\r\n')

assert old_init in text, "old_init not found"
text = text.replace(old_init, new_init, 1)

ENGINE_JS.write_text(text, encoding="utf-8")
print("Successfully patched js/engine.js with test preservation & v3 key!")
