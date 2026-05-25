/* ══════════════════════════════════════════════════════════════
   Welcome Dialog
   - Shows on every page load — user must enter name + role
   - Saves to localStorage (guide01_user)
   - Shows resume option if returning user
   - Blocks keyboard nav until dismissed
   ══════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  var STORAGE_KEY = 'guide01_user';
  var overlay = document.getElementById('welcomeOverlay');
  var nameInput = document.getElementById('welcomeName');
  var roleInput = document.getElementById('welcomeRole');
  var startBtn = document.getElementById('welcomeStartBtn');
  var resumeRow = document.getElementById('welcomeResumeRow');
  var resumeBtn = document.getElementById('welcomeResumeBtn');

  if (!overlay || !nameInput || !roleInput || !startBtn) return;

  // Flag to block keyboard nav while dialog is open
  window.welcomeDialogOpen = true;

  // Check for returning user
  var savedUser = null;
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) savedUser = JSON.parse(raw);
  } catch (e) {}

  if (savedUser && savedUser.name) {
    nameInput.value = savedUser.name;
    roleInput.value = savedUser.role || '';

    // Check if there's a saved slide to resume
    var progressRaw = localStorage.getItem('guide01_progress');
    if (progressRaw) {
      try {
        var progress = JSON.parse(progressRaw);
        if (progress.currentSlide && progress.currentSlide > 1) {
          resumeRow.style.display = '';
          resumeBtn.textContent = 'RESUME — SLIDE ' + progress.currentSlide;
        }
      } catch (e) {}
    }
  }

  function validate() {
    var valid = true;
    if (!nameInput.value.trim()) {
      nameInput.classList.add('error');
      valid = false;
    } else {
      nameInput.classList.remove('error');
    }
    if (!roleInput.value.trim()) {
      roleInput.classList.add('error');
      valid = false;
    } else {
      roleInput.classList.remove('error');
    }
    return valid;
  }

  function saveUser() {
    var userData = {
      name: nameInput.value.trim(),
      role: roleInput.value.trim(),
      lastVisit: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {}

    // Make user info available globally (for certificate, MAP template, etc.)
    window.learnerName = userData.name;
    window.learnerRole = userData.role;
  }

  function dismissDialog() {
    overlay.classList.add('hidden');
    window.welcomeDialogOpen = false;

    // Pre-fill certificate name if it exists
    var certName = document.querySelector('.cert-learner-name');
    if (certName && window.learnerName) {
      certName.value = window.learnerName;
    }
  }

  // Start button
  startBtn.addEventListener('click', function() {
    if (!validate()) return;
    saveUser();
    dismissDialog();
  });

  // Resume button
  if (resumeBtn) {
    resumeBtn.addEventListener('click', function() {
      if (!validate()) return;
      saveUser();
      dismissDialog();

      // Navigate to saved slide
      var progressRaw = localStorage.getItem('guide01_progress');
      if (progressRaw) {
        try {
          var progress = JSON.parse(progressRaw);
          if (progress.currentSlide && window.goSlide) {
            window.goSlide(progress.currentSlide);
          }
        } catch (e) {}
      }
    });
  }

  // Enter key submits
  nameInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); roleInput.focus(); }
  });
  roleInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); startBtn.click(); }
  });

  // Clear error on input
  nameInput.addEventListener('input', function() { nameInput.classList.remove('error'); });
  roleInput.addEventListener('input', function() { roleInput.classList.remove('error'); });

  // Focus name input on load
  setTimeout(function() { nameInput.focus(); }, 100);

})();
