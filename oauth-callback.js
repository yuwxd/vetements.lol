/**
 * OAuth2 callback handler for Discord authorization.
 * Checks URL for ?code=... and sends it to the bot API.
 * API URL: use VITE_API_URL env var (default: https://api.vetements.lol)
 */
(function () {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (!code) return;

  const overlay = document.getElementById('oauth-overlay');
  const errEl = document.getElementById('oauth-error');
  const API_BASE = (typeof __VETEMENTS_API_URL__ !== 'undefined' ? __VETEMENTS_API_URL__ : null)
    || window.VETEMENTS_API_URL
    || 'https://api.vetements.lol';

  if (overlay) overlay.style.display = 'flex';

  fetch(API_BASE + '/api/auth/discord-callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: code })
  })
    .then(function (res) {
      if (res.ok) {
        window.location.replace('/success.html');
      } else {
        if (overlay) overlay.style.display = 'none';
        if (errEl) errEl.style.display = 'flex';
      }
    })
    .catch(function () {
      if (overlay) overlay.style.display = 'none';
      if (errEl) errEl.style.display = 'flex';
    });
})();
