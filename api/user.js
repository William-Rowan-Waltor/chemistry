const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (req.method === 'GET') {
    try {
      // 1. Try Vercel KV if configured
      if (kvUrl && kvToken) {
        const resp = await fetch(`${kvUrl}/get/user_db`, {
          headers: { Authorization: `Bearer ${kvToken}` }
        });
        if (resp.ok) {
          const kvData = await resp.json();
          if (kvData.result) {
            const parsed = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
            return res.status(200).json({ ok: true, data: parsed, storage: 'vercel-kv' });
          }
        }
      }

      // 2. Fallback to bundled user-db.json
      const localPath = path.join(process.cwd(), 'data', 'user-db.json');
      if (fs.existsSync(localPath)) {
        const raw = fs.readFileSync(localPath, 'utf8');
        return res.status(200).json({ ok: true, data: JSON.parse(raw), storage: 'bundled-json' });
      }

      return res.status(200).json({
        ok: true,
        data: { profile: { xp: 0, streak: { days: 0 } }, customData: null },
        storage: 'empty'
      });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      body.updatedAt = new Date().toISOString();

      // 1. Save to Vercel KV if available
      if (kvUrl && kvToken) {
        const resp = await fetch(`${kvUrl}/set/user_db`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${kvToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        if (resp.ok) {
          return res.status(200).json({ ok: true, timestamp: Date.now(), storage: 'vercel-kv' });
        }
      }

      // 2. Try writing local file (in dev / build environment)
      try {
        const localPath = path.join(process.cwd(), 'data', 'user-db.json');
        fs.writeFileSync(localPath, JSON.stringify(body, null, 2), 'utf8');
        return res.status(200).json({ ok: true, timestamp: Date.now(), storage: 'local-file' });
      } catch (e) {
        return res.status(200).json({ ok: true, timestamp: Date.now(), storage: 'ephemeral' });
      }
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  res.status(405).json({ ok: false, error: 'Method not allowed' });
};
