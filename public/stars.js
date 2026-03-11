(function() {
  var c = document.getElementById('starsBg');
  if (!c) return;
  var n = 140;
  for (var i = 0; i < n; i++) {
    var s = document.createElement('span');
    s.className = 'star';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = Math.random() * 5 + 's';
    s.style.animationDuration = (2 + Math.random() * 3) + 's';
    s.style.width = s.style.height = (1 + Math.random() * 2) + 'px';
    c.appendChild(s);
  }
})();
