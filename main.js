// ── Click-to-copy email ──
(function () {
  var toast = document.getElementById('toast');
  var tHide = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(tHide);
    tHide = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }
  document.querySelectorAll('.copy-email').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var email = a.getAttribute('data-email');
      if (!navigator.clipboard) return; // fall back to mailto
      e.preventDefault();
      navigator.clipboard.writeText(email).then(function () {
        a.classList.add('copied');
        showToast(email + ' copied to clipboard');
        setTimeout(function () { a.classList.remove('copied'); }, 1600);
      }).catch(function () { window.location.href = 'mailto:' + email; });
    });
  });
})();
