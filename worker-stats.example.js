const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Accept',
  'Access-Control-Max-Age': '86400'
};

function parseNum(v) {
  if (v == null) return null;
  const n = Number(v);
  return (typeof n === 'number' && !isNaN(n) && n >= 0) ? Math.round(n) : null;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    try {
      const kv = env.STATS;
      if (!kv) {
        return json({ error: 'KV binding "STATS" not found. Add it in Worker Settings → Variables → KV Namespace Bindings.' }, 500);
      }

      if (url.pathname === '/api/push-stats' && request.method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const pingVal = parseNum(body.ping ?? body.discordPing ?? body.discord_ping);
        const dbPingVal = parseNum(body.databasePing ?? body.dbPing ?? body.database_ping);
        const totalCommandsVal = parseNum(body.totalCommands ?? body.commandsUsed ?? body.commands_used ?? body.commands);
        const payload = {
          servers: Number(body.servers ?? body.guilds ?? 0),
          members: Number(body.members ?? body.users ?? 0),
          installedUsers: Number(body.installedUsers ?? body.installs ?? body.users ?? 0),
          ping: pingVal,
          databasePing: dbPingVal,
          totalCommands: totalCommandsVal != null ? totalCommandsVal : (await kv.get('stats', 'json'))?.totalCommands ?? null,
          updatedAt: body.updatedAt ?? new Date().toISOString()
        };
        await kv.put('stats', JSON.stringify(payload));
        return new Response('ok', { headers: CORS });
      }

      if (url.pathname === '/api/stats') {
        const data = await kv.get('stats', 'json') ?? {};
        const out = { ...data };
        if (out.databasePing != null) {
          out.dbPing = out.databasePing;
          out.database_ping = out.databasePing;
          out.mongoPing = out.databasePing;
        }
        return json(out);
      }

      if (url.pathname === '/api/push-commands' && request.method === 'POST') {
        const body = await request.json().catch(() => ({}));
        if (!body.updatedAt) body.updatedAt = new Date().toISOString();
        await kv.put('commands', JSON.stringify(body));
        return new Response('ok', { headers: CORS });
      }

      if (url.pathname === '/api/commands') {
        const data = await kv.get('commands', 'json');
        return json(data ?? {});
      }

      if (url.pathname === '/api/push-users' && request.method === 'POST') {
        const body = await request.json().catch(() => []);
        const list = Array.isArray(body) ? body : (body.users || body.list || []);
        const payload = Array.isArray(list) ? list : [];
        await kv.put('users', JSON.stringify(payload));
        return new Response('ok', { headers: CORS });
      }

      if (url.pathname === '/api/users') {
        const data = await kv.get('users', 'json');
        return json(Array.isArray(data) ? data : []);
      }

      return new Response('not found', { status: 404, headers: CORS });
    } catch (err) {
      return json({
        error: 'Worker exception',
        message: err?.message || String(err)
      }, 500);
    }
  }
};
