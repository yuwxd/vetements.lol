/**
 * OAuth2 callback handler for Discord authorization.
 * Checks URL for ?code=... and sends it to the bot API.
 * Passes guild_id and permissions if present (Discord adds them on redirect).
 * API URL: use VITE_API_URL env var (default: https://api.shiver.lol)
 */
(function () {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (!code) return;

  const overlay = document.getElementById('oauth-overlay');
  const errEl = document.getElementById('oauth-error');
  const API_BASE = (typeof __SHIVER_API_URL__ !== 'undefined' ? __SHIVER_API_URL__ : null)
    || window.SHIVER_API_URL
    || 'https://api.shiver.lol';

  var payload = { code: code };
  var guildId = params.get('guild_id');
  var permissions = params.get('permissions');
  if (guildId) payload.guild_id = guildId;
  if (permissions) payload.permissions = permissions;

  if (overlay) overlay.style.display = 'flex';

  fetch(API_BASE + '/api/auth/discord-callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(function (res) {
      if (res.ok) {
        window.location.replace('/success.html');
      } else {
        if (overlay) overlay.style.display = 'none';
        if (errEl) {
          errEl.style.display = 'flex';
          var msg = errEl.querySelector('.oauth-error-msg');
          if (msg) {
            msg.textContent = 'Authorization failed (HTTP ' + res.status + '). Check backend logs.';
          }
        }
      }
    })
    .catch(function (err) {
      if (overlay) overlay.style.display = 'none';
      if (errEl) {
        errEl.style.display = 'flex';
        var msg = errEl.querySelector('.oauth-error-msg');
        if (msg) {
          msg.textContent = 'Network error: ' + (err.message || 'Could not reach API');
        }
      }
    });
})();
