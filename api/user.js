const fs = require('fs');
const path = require('path');
const os = require('os');

const CLOUD_KV_URL = 'https://api.echovalue.dev/kv/default/chemistry_user_db';
const CLOUD_KV_TOKEN = 'HprV1hByiEMOXAzpN4Zd';

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const vercelKvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const vercelKvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const tmpFilePath = path.join(os.tmpdir(), 'chemistry_user_db.json');
  const bundledPath = path.join(process.cwd(), 'data', 'user-db.json');

  if (req.method === 'GET') {
    try {
      // 1. Try Vercel KV if configured via environment variables
      if (vercelKvUrl && vercelKvToken) {
        try {
          const resp = await fetch(`${vercelKvUrl}/get/user_db`, {
            headers: { Authorization: `Bearer ${vercelKvToken}` }
          });
          if (resp.ok) {
            const kvData = await resp.json();
            if (kvData.result) {
              const parsed = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
              return res.status(200).json({ ok: true, data: parsed, storage: 'vercel-kv' });
            }
          }
        } catch (e) {
          console.warn('Vercel KV get error, falling back:', e.message);
        }
      }

      // 2. Try Primary Zero-Config Cloud Database (Instant Persistent Cloud KV)
      try {
        const cloudResp = await fetch(CLOUD_KV_URL, {
          headers: { 'x-token': CLOUD_KV_TOKEN },
          signal: AbortSignal.timeout(3500)
        });
        if (cloudResp.ok) {
          const cloudData = await cloudResp.json();
          if (cloudData && cloudData.profile) {
            return res.status(200).json({ ok: true, data: cloudData, storage: 'cloud-kv' });
          }
        }
      } catch (e) {
        console.warn('Cloud KV get error, falling back:', e.message);
      }

      // 3. Try /tmp writable storage (warm serverless container)
      if (fs.existsSync(tmpFilePath)) {
        try {
          const raw = fs.readFileSync(tmpFilePath, 'utf8');
          return res.status(200).json({ ok: true, data: JSON.parse(raw), storage: 'tmp-cache' });
        } catch (e) {}
      }

      // 4. Fallback to bundled user-db.json
      if (fs.existsSync(bundledPath)) {
        const raw = fs.readFileSync(bundledPath, 'utf8');
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

      let savedToCloud = false;

      // 1. Save to Vercel KV if available
      if (vercelKvUrl && vercelKvToken) {
        try {
          const resp = await fetch(`${vercelKvUrl}/set/user_db`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${vercelKvToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });
          if (resp.ok) savedToCloud = true;
        } catch (e) {
          console.warn('Vercel KV set error:', e.message);
        }
      }

      // 2. Save to Primary Zero-Config Cloud Database
      try {
        const cloudResp = await fetch(CLOUD_KV_URL, {
          method: 'POST',
          headers: {
            'x-token': CLOUD_KV_TOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(4500)
        });
        if (cloudResp.ok) savedToCloud = true;
      } catch (e) {
        console.warn('Cloud KV set error:', e.message);
      }

      // 3. Save to /tmp filesystem cache
      try {
        fs.writeFileSync(tmpFilePath, JSON.stringify(body, null, 2), 'utf8');
      } catch (e) {}

      // 4. Save to local repository file (in dev / build environment)
      try {
        fs.writeFileSync(bundledPath, JSON.stringify(body, null, 2), 'utf8');
      } catch (e) {}

      return res.status(200).json({
        ok: true,
        timestamp: Date.now(),
        storage: savedToCloud ? 'cloud-kv' : 'local-tmp'
      });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  res.status(405).json({ ok: false, error: 'Method not allowed' });
};
