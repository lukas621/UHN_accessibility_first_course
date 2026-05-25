/* ═══════════════════════════════════════════════════════════════
   Course Completion & Variable Tracking System
   - Persists progress in localStorage (key: guide01_progress)
   - Tracks visited slides, quiz score, MAP completion, time
   - Shows resume modal, progress indicator, results page
   ═══════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  var STORAGE_KEY = 'guide01_progress';
  var MAP_STORAGE_KEY = 'guide01_map_responses';
  var allSlides = document.querySelectorAll('.slide[data-slide]');
  var totalSlides = allSlides.length;
  var MAP_SLIDE = 18;
  var LAST_SLIDE = 23;
  var QUIZ_TOTAL = 3; // 3 KC questions: kc1-1, kc1-2, kc2-1
  var PASS_THRESHOLD = 2; // 80% of 3 = 2.4, so 2/3 passes

  // ── 1. Global courseData object (merge, don't overwrite) ──
  if (!window.courseData) window.courseData = {};
  var cd = window.courseData;
  cd.currentSlide = cd.currentSlide || 1;
  cd.totalSlides = totalSlides;
  cd.visitedSlides = cd.visitedSlides || [1];
  cd.quizScore = cd.quizScore || 0;
  cd.quizTotal = QUIZ_TOTAL;
  cd.quizPassed = cd.quizPassed || false;
  cd.mapCompleted = cd.mapCompleted || false;
  cd.courseCompleted = cd.courseCompleted || false;
  cd.completionDate = cd.completionDate || null;
  cd.timeSpent = cd.timeSpent || 0;
  cd.bookmarkSlide = cd.bookmarkSlide || 1;
  // Keep submissions from navigation.js if already set
  cd.submissions = cd.submissions || {};

  // ── Helper: deep copy ──
  function cloneData() {
    return JSON.parse(JSON.stringify(window.courseData));
  }

  // ── getCourseData for SCORM ──
  window.getCourseData = function() {
    return cloneData();
  };

  // ── localStorage persistence ──
  var quizAnswers = {}; // keyed by qnum => true/false

  function saveProgress() {
    try {
      var data = JSON.parse(JSON.stringify(window.courseData));
      data.quizAnswers = quizAnswers;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch(e) { /* quota exceeded — silently fail */ }
  }

  function loadProgress() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch(e) { return null; }
  }

  // ── Time tracking ──
  var timerInterval = null;
  var timerRunning = false;

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    timerInterval = setInterval(function() {
      window.courseData.timeSpent++;
    }, 1000);
  }

  function pauseTimer() {
    timerRunning = false;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) { pauseTimer(); saveProgress(); }
    else { startTimer(); }
  });

  // ── Progress indicator (update existing side menu elements) ──
  function updateProgressIndicator() {
    var visited = window.courseData.visitedSlides.length;
    var total = window.courseData.totalSlides;
    var pct = Math.round((visited / total) * 100);

    var fill = document.querySelector('.sm-progress-fill');
    if (fill) {
      fill.style.width = pct + '%';
      fill.style.background = pct >= 100 ? 'var(--red)' : 'var(--chartreuse)';
    }
    var txt = document.querySelector('.sm-progress-text');
    if (txt) {
      txt.textContent = visited + ' / ' + total + ' \u00B7 ' + pct + '%';
    }
  }

  // ── Quiz score tracking ──
  // Score is derived from submissions state: if the final selected answer matches
  // the correct answer, it counts as correct — regardless of how many attempts it took.
  function recalcQuizScore() {
    var correct = 0;
    // Check KC submissions (kc-*) — these track the final selected answer
    document.querySelectorAll('.kc-options[data-qnum]').forEach(function(kcContainer) {
      var qnum = kcContainer.getAttribute('data-qnum');
      var correctAnswer = kcContainer.getAttribute('data-correct');
      var containerKey = 'kc-' + qnum;
      var sub = window.courseData.submissions[containerKey];
      if (sub && sub.selected) {
        if (sub.selected === correctAnswer) {
          correct++;
          quizAnswers[qnum] = true;
        } else {
          quizAnswers[qnum] = false;
        }
      }
    });
    window.courseData.quizScore = correct;
    window.courseData.quizPassed = (correct >= PASS_THRESHOLD);
    saveProgress();
    checkCompletion();
  }

  // Expose recalcQuizScore so navigation.js can trigger it after submissions
  window.recalcQuizScore = recalcQuizScore;

  // Also hook branching scenario options for save triggers
  document.querySelectorAll('.options[data-correct]').forEach(function(optContainer) {
    var opts = optContainer.querySelectorAll('.option');
    var answered = false;
    opts.forEach(function(opt) {
      opt.addEventListener('click', function() {
        if (answered) return;
        var choice = opt.getAttribute('data-choice');
        if (!choice) return;
        answered = true;
        saveProgress();
      });
    });
  });

  // ── MAP completion tracking ──
  function checkMapCompletion() {
    var mapSlide = document.querySelector('[data-slide="' + MAP_SLIDE + '"]');
    if (!mapSlide) return false;
    var fields = mapSlide.querySelectorAll('.map-field .input[contenteditable]');
    var defaults = ['Type your response here...', 'Type your response here... (optional)', ''];
    for (var i = 0; i < fields.length; i++) {
      var val = fields[i].textContent.trim();
      if (val && defaults.indexOf(val) === -1) {
        return true;
      }
    }
    return false;
  }

  // Listen for input on MAP fields
  document.querySelectorAll('.map-field .input[contenteditable]').forEach(function(field) {
    field.addEventListener('input', function() {
      window.courseData.mapCompleted = checkMapCompletion();
      saveProgress();
      checkCompletion();
    });
    field.addEventListener('blur', function() {
      window.courseData.mapCompleted = checkMapCompletion();
      saveProgress();
      checkCompletion();
    });
  });

  // ── MAP Save Button ──
  function hookMapSaveButton() {
    var saveBtn = document.querySelector('.map-save-btn');
    if (!saveBtn) return;

    saveBtn.addEventListener('click', function() {
      var mapSlide = document.querySelector('[data-slide="' + MAP_SLIDE + '"]');
      if (!mapSlide) return;
      var fields = mapSlide.querySelectorAll('.map-field .input[contenteditable]');
      var responses = {
        mapStop: fields[0] ? fields[0].textContent.trim() : '',
        mapStart: fields[1] ? fields[1].textContent.trim() : '',
        mapContinue: fields[2] ? fields[2].textContent.trim() : ''
      };

      // Save to localStorage
      try {
        localStorage.setItem(MAP_STORAGE_KEY, JSON.stringify(responses));
      } catch(e) {}

      // Mark as completed
      window.courseData.mapCompleted = true;
      saveProgress();
      checkCompletion();

      // Green flash confirmation
      var origBg = saveBtn.style.background;
      saveBtn.style.background = '#74AE54';
      saveBtn.textContent = '\u2713 SAVED';
      setTimeout(function() {
        saveBtn.style.background = origBg;
        saveBtn.innerHTML = 'SAVE MY MAP<span style="font-size:24px;">\u203A</span>';
      }, 2000);
    });
  }

  // ── Completion check — Storyline-style rules ──
  // REQUIRED: last slide visited + quiz passed
  // OPTIONAL: MAP completed, all slides visited
  function checkCompletion() {
    if (window.courseData.courseCompleted) return true;

    var lastSlideVisited = (window.courseData.visitedSlides.indexOf(LAST_SLIDE) !== -1);
    var quizOk = window.courseData.quizPassed;

    if (lastSlideVisited && quizOk) {
      window.courseData.courseCompleted = true;
      window.courseData.completionDate = new Date().toISOString();
      saveProgress();

      // Update SCORM status
      if (window.SCORM && window.SCORM.syncToLMS) {
        window.SCORM.syncToLMS();
      }

      return true;
    }
    return false;
  }

  // ── Format time ──
  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + 'm ' + s + 's';
  }

  // Resume modal removed — welcome-dialog.js handles resume now
  var resumeModal = { classList: { add: function(){}, remove: function(){} }, querySelector: function(){ return null; } };

  // ── Certificate overlay (printable) ──
  var certLogoSrc = '';
  var logoEl = document.querySelector('.topbar .brand img.logo');
  if (logoEl) certLogoSrc = logoEl.src;
  var completionOverlay = document.createElement('div');
  completionOverlay.className = 'tracking-completion-overlay';
  completionOverlay.innerHTML =
    '<div class="cert-card" id="printCert">' +
      '<div class="cert-logo-row"><img class="cert-logo" src="' + certLogoSrc + '" alt="UHN \u2014 Canada\'s Hospital"></div>' +
      '<div class="cert-eyebrow">UNIVERSITY HEALTH NETWORK</div>' +
      '<div class="cert-rule"></div>' +
      '<h2>Certificate of <span class="accent">Completion</span></h2>' +
      '<p class="cert-presents">This certifies that</p>' +
      '<div class="cert-name-row"><input type="text" class="cert-learner-name" placeholder="Enter your full name" spellcheck="false"></div>' +
      '<p class="cert-presents">has successfully completed</p>' +
      '<h3 class="cert-course-title">Accessibility First Series \u2014 Guide 01</h3>' +
      '<p class="cert-course-sub">Foundations of Disability, Inclusion &amp; Accessible Design</p>' +
      '<div class="cert-badge">Accessibility<br>First:<br>Foundations</div>' +
      '<div class="cert-stats">' +
        '<div class="cert-stat"><span class="val cert-score">0/3</span><span class="lbl">Quiz Score</span></div>' +
        '<div class="cert-stat"><span class="val cert-time">0m 0s</span><span class="lbl">Time Spent</span></div>' +
        '<div class="cert-stat"><span class="val cert-slides">0/0</span><span class="lbl">Slides</span></div>' +
      '</div>' +
      '<div class="cert-date"></div>' +
      '<div class="cert-signatures">' +
        '<div class="cert-sig"><div class="cert-sig-line"></div><div class="cert-sig-name">Jacqueline Silvera</div><div class="cert-sig-title">IDEAA, People &amp; Culture, UHN</div></div>' +
        '<div class="cert-sig"><div class="cert-sig-line"></div><div class="cert-sig-name cert-sig-learner">Learner</div><div class="cert-sig-title">Date of Completion</div></div>' +
      '</div>' +
      '<div class="cert-footer-text">Accessibility First eLearning Series \u00B7 University Health Network \u00B7 Toronto, Ontario, Canada</div>' +
      '<div class="cert-actions no-print">' +
        '<button class="cert-print-btn">PRINT CERTIFICATE</button>' +
        '<button class="cert-close">CLOSE</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(completionOverlay);

  completionOverlay.querySelector('.cert-close').addEventListener('click', function() {
    completionOverlay.classList.remove('visible');
  });
  completionOverlay.querySelector('.cert-print-btn').addEventListener('click', function() {
    window.print();
  });
  var nameInput = completionOverlay.querySelector('.cert-learner-name');
  var sigLearner = completionOverlay.querySelector('.cert-sig-learner');
  nameInput.addEventListener('input', function() {
    sigLearner.textContent = nameInput.value || 'Learner';
  });

  function showCompletionOverlay() {
    var d = window.courseData;
    completionOverlay.querySelector('.cert-score').textContent = d.quizScore + '/' + d.quizTotal;
    completionOverlay.querySelector('.cert-time').textContent = formatTime(d.timeSpent);
    completionOverlay.querySelector('.cert-slides').textContent = d.visitedSlides.length + '/' + d.totalSlides;
    var dateStr = d.completionDate ? new Date(d.completionDate).toLocaleDateString('en-CA', { year:'numeric', month:'long', day:'numeric' }) : '';
    completionOverlay.querySelector('.cert-date').textContent = 'Completed: ' + dateStr;
    // Pre-fill learner name from welcome dialog
    try {
      var user = JSON.parse(localStorage.getItem('guide01_user') || '{}');
      if (user.name && nameInput) nameInput.value = user.name;
      if (user.name && sigLearner) sigLearner.textContent = user.name;
    } catch(e) {}
    completionOverlay.classList.add('visible');
  }

  // ── Results Page (Slide 23) ──
  function refreshResultsPage() {
    var container = document.getElementById('resultsPageContainer');
    if (!container) return;

    var d = window.courseData;
    var lastVisited = d.visitedSlides.indexOf(LAST_SLIDE) !== -1;
    var quizOk = d.quizPassed;
    var mapOk = d.mapCompleted;
    var isComplete = d.courseCompleted;

    if (!isComplete) { checkCompletion(); isComplete = d.courseCompleted; }

    // SVG icons
    var iconCheck = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
    var iconX = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    var iconExit = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';

    var html = '';
    var h = 'font-family:var(--font-head);';

    // ── WRAPPER (fits 1920x1080, topbar 84px, footer 80px) ──
    html += '<div style="padding:96px 72px 0; height:976px; box-sizing:border-box; overflow:hidden; display:flex; flex-direction:column; gap:18px;">';

    // ── ROW 1: Title + Banner (side by side) ──
    html += '<div style="display:grid; grid-template-columns:300px 1fr; gap:24px; ">';
    html += '<div>' +
      '<div style="' + h + 'font-size:16px; letter-spacing:4px; color:var(--lilac); text-transform:uppercase;">ACCESSIBILITY FIRST</div>' +
      '<div style="' + h + 'font-size:44px; color:var(--navy); margin-top:6px; line-height:1.05;">Guide 01:<br>Results</div>' +
    '</div>';

    if (isComplete) {
      html += '<div style="background:var(--chartreuse,#74AE54); color:#fff; padding:28px 36px; display:flex; align-items:center; gap:20px;">' +
        '<div style="width:56px; height:56px; border-radius:50%; background:rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0;">' + iconCheck + '</div>' +
        '<div>' +
          '<div style="' + h + 'font-size:30px; letter-spacing:3px;">COURSE COMPLETE</div>' +
          '<div style="font-size:18px; opacity:0.9; margin-top:6px;">You have met all requirements for Guide 01.</div>' +
        '</div></div>';
    } else {
      var remaining = [];
      if (!quizOk) remaining.push('Pass the quiz (' + d.quizScore + '/' + d.quizTotal + ', need ' + PASS_THRESHOLD + '/' + d.quizTotal + ')');
      if (!lastVisited) remaining.push('Reach the last slide');
      html += '<div style="background:var(--red,#C0233B); color:#fff; padding:28px 36px;">' +
        '<div style="display:flex; align-items:center; gap:20px; margin-bottom:10px;">' +
          '<div style="width:56px; height:56px; border-radius:50%; background:rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0;">' + iconX + '</div>' +
          '<div style="' + h + 'font-size:30px; letter-spacing:3px;">COURSE INCOMPLETE</div>' +
        '</div>' +
        '<div style="font-size:18px; opacity:0.9; margin-left:76px;">Complete the following:</div>' +
        '<ul style="list-style:none; padding:6px 0 0 76px; margin:0;">';
      remaining.forEach(function(item) { html += '<li style="font-size:18px; padding:3px 0;">&bull; ' + item + '</li>'; });
      html += '</ul></div>';
    }
    html += '</div>';

    // ── ROW 2: Score cards (3 large) ──
    html += '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:18px;">';

    html += '<div style="background:var(--navy,#192858); color:#fff; padding:28px 24px; text-align:center;">' +
      '<div style="' + h + 'font-size:52px; line-height:1;">' + d.quizScore + '/' + d.quizTotal + '</div>' +
      '<div style="' + h + 'font-size:16px; letter-spacing:3px; margin-top:12px; opacity:0.8;">QUIZ SCORE</div>' +
      '<div style="font-size:18px; margin-top:6px; opacity:0.65;">' + (quizOk ? 'Passed' : 'Not passed') + '</div>' +
    '</div>';

    html += '<div style="background:var(--cobalt,#245BAA); color:#fff; padding:28px 24px; text-align:center;">' +
      '<div style="' + h + 'font-size:52px; line-height:1;">' + formatTime(d.timeSpent) + '</div>' +
      '<div style="' + h + 'font-size:16px; letter-spacing:3px; margin-top:12px; opacity:0.8;">TIME SPENT</div>' +
      '<div style="font-size:18px; margin-top:6px; opacity:0.65;">Session duration</div>' +
    '</div>';

    html += '<div style="background:var(--navy-deep,#0F1A3D); color:#fff; padding:28px 24px; text-align:center;">' +
      '<div style="' + h + 'font-size:52px; line-height:1;">' + d.visitedSlides.length + '/' + d.totalSlides + '</div>' +
      '<div style="' + h + 'font-size:16px; letter-spacing:3px; margin-top:12px; opacity:0.8;">SLIDES VISITED</div>' +
      '<div style="font-size:18px; margin-top:6px; opacity:0.65;">' + (d.visitedSlides.length >= d.totalSlides ? 'All visited' : (d.totalSlides - d.visitedSlides.length) + ' remaining') + '</div>' +
    '</div>';
    html += '</div>';

    // ── ROW 3: Buttons (5 across — retry, action plan, badge, certificate, exit) ──
    var btnBase = '' + h + 'font-size:18px; padding:20px 16px; border:0; letter-spacing:2px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; width:100%;';
    var dis = 'opacity:0.3; cursor:not-allowed; pointer-events:none;';

    html += '<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:14px;">';

    html += '<button id="retryQuizBtn" style="' + btnBase + ' background:var(--red,#C0233B); color:#fff;">RETRY QUIZ</button>';
    html += '<button id="downloadMapBtn" style="' + btnBase + ' background:var(--cobalt,#245BAA); color:#fff;' + (!mapOk ? dis : '') + '">ACTION PLAN</button>';
    html += '<button id="downloadBadgeBtn" style="' + btnBase + ' background:var(--chartreuse,#74AE54); color:#fff;' + (!isComplete ? dis : '') + '">BADGE</button>';
    html += '<button id="printCertBtn" style="' + btnBase + ' background:var(--navy,#192858); color:#fff;' + (!isComplete ? dis : '') + '">CERTIFICATE</button>';
    html += '</div>';

    // ── ROW 4: Resources + Up Next ──
    html += '<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; flex:1;">';
    html += '<div style="background:#f4f4f4; padding:24px 28px;">' +
      '<div style="' + h + 'font-size:16px; letter-spacing:3px; color:var(--navy); border-bottom:2px solid var(--navy); padding-bottom:6px; margin-bottom:10px;">RESOURCES</div>' +
      '<div style="font-size:20px; line-height:1.8; color:#444;">AODA: ontario.ca/laws/statute/05a11 &nbsp;&bull;&nbsp; OHRC: ohrc.on.ca<br>UHN Accessibility Policy &nbsp;&bull;&nbsp; UHN IDEAA Office</div>' +
    '</div>';
    html += '<div style="padding:24px 28px; background:var(--navy,#192858); color:#fff; display:flex; flex-direction:column; justify-content:center;">' +
      '<div style="' + h + 'font-size:16px; letter-spacing:3px; color:var(--lilac); margin-bottom:6px;">UP NEXT</div>' +
      '<div style="' + h + 'font-size:26px; line-height:1.3;">Guide 02: Perceptions, Attitudes &amp; Barriers</div>' +
    '</div>';
    html += '</div>';

    // ── ROW 5: EXIT button (centered) + footer ──
    html += '<div style="text-align:center;">' +
      '<button id="exitCourseBtn" style="' + h + 'font-size:16px; padding:14px 48px; border:2px solid var(--navy); background:transparent; color:var(--navy); letter-spacing:3px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:10px;">' + iconExit + ' EXIT COURSE</button>' +
      '<div style="' + h + 'font-size:11px; letter-spacing:2px; color:#bbb; margin-top:8px;">UNIVERSITY HEALTH NETWORK &middot; TORONTO &middot; ACCESSIBILITY FIRST SERIES</div>' +
    '</div>';

    html += '</div>'; // close wrapper

    container.innerHTML = html;
    wireResultsButtons();
  }

  function wireResultsButtons() {
    // RETRY QUIZ
    var retryBtn = document.getElementById('retryQuizBtn');
    if (retryBtn) {
      retryBtn.addEventListener('click', function() {
        retryQuiz();
      });
    }

    // DOWNLOAD ACTION PLAN
    var downloadMapBtn = document.getElementById('downloadMapBtn');
    if (downloadMapBtn && window.courseData.mapCompleted) {
      downloadMapBtn.addEventListener('click', function() {
        openMapDownload();
      });
    }

    // DOWNLOAD BADGE
    var downloadBadgeBtn = document.getElementById('downloadBadgeBtn');
    if (downloadBadgeBtn && window.courseData.courseCompleted) {
      downloadBadgeBtn.addEventListener('click', function() {
        openBadgeDownload();
      });
    }

    // PRINT CERTIFICATE
    var printCertBtn = document.getElementById('printCertBtn');
    if (printCertBtn && window.courseData.courseCompleted) {
      printCertBtn.addEventListener('click', function() {
        showCompletionOverlay();
      });
    }

    // EXIT COURSE
    var exitBtn = document.getElementById('exitCourseBtn');
    if (exitBtn) {
      exitBtn.addEventListener('click', function() {
        if (window.SCORM && window.SCORM.syncToLMS) window.SCORM.syncToLMS();
        if (window.SCORM && window.SCORM.terminate) window.SCORM.terminate();
        window.location.href = 'lms/goodbye.html';
      });
      exitBtn.addEventListener('mouseenter', function() {
        exitBtn.style.background = 'var(--red)';
        exitBtn.style.color = '#fff';
        exitBtn.style.borderColor = 'var(--red)';
      });
      exitBtn.addEventListener('mouseleave', function() {
        exitBtn.style.background = 'transparent';
        exitBtn.style.color = 'var(--navy)';
        exitBtn.style.borderColor = 'var(--navy)';
      });
    }
  }

  // ── Retry Quiz ──
  function retryQuiz() {
    // Reset quiz answers in tracker
    quizAnswers = {};
    window.courseData.quizScore = 0;
    window.courseData.quizPassed = false;

    // If course was completed but we're retrying, reset completion
    // (they might score lower this time)
    window.courseData.courseCompleted = false;
    window.courseData.completionDate = null;

    // Call the navigation.js reset function which:
    // - Removes disabled-choice class and restores pointer-events on ALL options
    // - Removes attempt-hint elements
    // - Re-initializes submission state objects so closures pick up fresh state
    // - Resets locked state, submit buttons, and feedback panels/overlays
    if (window.resetQuizUI) {
      window.resetQuizUI();
    }

    saveProgress();

    // Reset quiz-q to first question
    document.querySelectorAll('.quiz-q').forEach(function(q) {
      q.classList.remove('active');
    });
    document.querySelectorAll('.quiz-q[data-q="1"]').forEach(function(q) {
      q.classList.add('active');
    });
    // Hide quiz next buttons
    document.querySelectorAll('[data-quiz-next]').forEach(function(btn) {
      btn.style.display = 'none';
    });
    // Also reset correct/incorrect feedback in quiz-q
    document.querySelectorAll('[data-fb-correct]').forEach(function(el) {
      el.classList.remove('show', 'correct-fb');
    });
    document.querySelectorAll('[data-fb-wrong]').forEach(function(el) {
      el.classList.remove('show', 'incorrect-fb');
    });

    // Navigate to slide 10 (first scenario)
    window.goSlide(10);
  }

  // ── MAP Download ──
  function openMapDownload() {
    window.open('assets/MAP-Template-Demo.html', '_blank');
  }

  // ── Badge Download ──
  function openBadgeDownload() {
    var learnerName = '';
    try {
      var user = JSON.parse(localStorage.getItem('guide01_user') || '{}');
      learnerName = user.name || 'Learner';
    } catch(e) { learnerName = 'Learner'; }

    var completionDate = '';
    if (window.courseData.completionDate) {
      completionDate = new Date(window.courseData.completionDate).toLocaleDateString('en-CA', { year:'numeric', month:'long', day:'numeric' });
    }

    var badgeHtml = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Badge - Guide 01</title>' +
      '<style>' +
        '@page { size:5in 7in; margin:0; }' +
        '* { margin:0; padding:0; box-sizing:border-box; }' +
        'body { font-family:Arial,Helvetica,sans-serif; background:#e8e8e8; display:flex; justify-content:center; align-items:center; min-height:100vh; }' +
        '.badge-card { width:5in; background:#fff; box-shadow:0 4px 24px rgba(0,0,0,0.12); text-align:center; overflow:hidden; }' +
        '.badge-header { background:#192858; color:#fff; padding:24px 20px 16px; }' +
        '.badge-header .logo { font-family:"Arial Black",Arial,sans-serif; font-size:22px; letter-spacing:2px; }' +
        '.badge-header .series { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:rgba(255,255,255,0.7); margin-top:4px; }' +
        '.accent-line { height:4px; background:linear-gradient(to right, #C0233B 25%, #245BAA 25% 50%, #74AE54 50% 75%, #C48ABD 75%); }' +
        '.badge-body { padding:32px 24px; }' +
        '.badge-circle { width:160px; height:160px; border-radius:50%; background:#192858; color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-family:"Arial Black",Arial,sans-serif; font-size:16px; text-align:center; line-height:1.3; padding:20px; }' +
        '.badge-title { font-family:"Arial Black",Arial,sans-serif; font-size:20px; color:#192858; margin-bottom:4px; }' +
        '.badge-sub { font-size:13px; color:#5A5A5A; margin-bottom:20px; }' +
        '.badge-name { font-family:"Arial Black",Arial,sans-serif; font-size:16px; color:#C0233B; margin-bottom:4px; }' +
        '.badge-date { font-size:12px; color:#888; }' +
        '.badge-footer { background:#f8f8f8; border-top:1px solid #e4e4e4; padding:12px; font-size:9px; color:#999; }' +
        '@media print { body { background:none; } .badge-card { box-shadow:none; } * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; } .no-print { display:none !important; } }' +
      '</style></head><body>' +
      '<div class="badge-card">' +
        '<div class="badge-header"><div class="logo">UHN</div><div class="series">Accessibility First Series</div></div>' +
        '<div class="accent-line"></div>' +
        '<div class="badge-body">' +
          '<div class="badge-circle">Accessibility<br>First:<br>Foundations</div>' +
          '<div class="badge-title">Guide 01 Complete</div>' +
          '<div class="badge-sub">Foundations of Disability, Inclusion &amp; Accessible Design</div>' +
          '<div class="badge-name">' + escapeHtml(learnerName) + '</div>' +
          '<div class="badge-date">' + completionDate + '</div>' +
        '</div>' +
        '<div class="badge-footer">University Health Network \u00B7 Toronto, Ontario \u00B7 Accessibility First eLearning Series</div>' +
        '<div class="no-print" style="padding:12px; text-align:center;"><button onclick="window.print()" style="font-family:Arial Black,Arial,sans-serif; font-size:14px; padding:10px 24px; background:#192858; color:#fff; border:0; letter-spacing:2px; cursor:pointer;">PRINT BADGE</button></div>' +
      '</div>' +
      '</body></html>';

    var w = window.open('', '_blank');
    if (w) {
      w.document.write(badgeHtml);
      w.document.close();
    }
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Expose refreshResultsPage globally so goSlide hook can call it
  window.refreshResultsPage = refreshResultsPage;

  // ── Hook into existing goSlide ──
  var _trackingPrevGoSlide = window.goSlide;
  window.goSlide = function(n) {
    var prevSlide = window.courseData.currentSlide;
    _trackingPrevGoSlide(n);

    // Check if the slide actually changed (inner goSlide may have blocked it)
    var activeSlide = document.querySelector('.slide.active');
    var actualSlide = activeSlide ? parseInt(activeSlide.getAttribute('data-slide')) : prevSlide;
    if (actualSlide === prevSlide && n !== prevSlide) return; // blocked, don't update state

    // Update current slide
    window.courseData.currentSlide = actualSlide;

    // Add to visitedSlides if not already there
    if (window.courseData.visitedSlides.indexOf(actualSlide) === -1) {
      window.courseData.visitedSlides.push(actualSlide);
    }

    // Update bookmark
    window.courseData.bookmarkSlide = actualSlide;

    // Update progress indicator
    updateProgressIndicator();

    // Save to localStorage
    saveProgress();

    // Check completion
    checkCompletion();

    // Refresh results page when navigating to the last slide
    if (n === LAST_SLIDE) {
      setTimeout(refreshResultsPage, 50);
    }
  };

  // ── Initialization ──
  function init() {
    var saved = loadProgress();

    if (saved && saved.bookmarkSlide && saved.bookmarkSlide > 1) {
      // Restore state
      window.courseData.visitedSlides = saved.visitedSlides || [1];
      window.courseData.quizScore = saved.quizScore || 0;
      window.courseData.quizPassed = saved.quizPassed || false;
      window.courseData.mapCompleted = saved.mapCompleted || false;
      window.courseData.courseCompleted = saved.courseCompleted || false;
      window.courseData.completionDate = saved.completionDate || null;
      window.courseData.timeSpent = saved.timeSpent || 0;
      window.courseData.bookmarkSlide = saved.bookmarkSlide;
      window.courseData.currentSlide = saved.currentSlide || 1;
      window.courseData.totalSlides = totalSlides;
      window.courseData.submissions = saved.submissions || {};

      // Restore quiz answers
      if (saved.quizAnswers) quizAnswers = saved.quizAnswers;

      // Show resume modal
      var slideNum = saved.bookmarkSlide;
      resumeModal.querySelector('p').textContent = 'Resume where you left off? Slide ' + slideNum;
      resumeModal.classList.add('visible');

      resumeModal.querySelector('.btn-resume').addEventListener('click', function() {
        resumeModal.classList.remove('visible');
        window.goSlide(slideNum);
      });

      resumeModal.querySelector('.btn-start-over').addEventListener('click', function() {
        resumeModal.classList.remove('visible');
        window.courseData.visitedSlides = [1];
        window.courseData.quizScore = 0;
        window.courseData.quizPassed = false;
        window.courseData.mapCompleted = false;
        window.courseData.courseCompleted = false;
        window.courseData.completionDate = null;
        window.courseData.timeSpent = 0;
        window.courseData.bookmarkSlide = 1;
        window.courseData.currentSlide = 1;
        window.courseData.submissions = {};
        quizAnswers = {};
        saveProgress();
        updateProgressIndicator();
        window.goSlide(1);
      });
    } else {
      window.courseData.visitedSlides = [1];
      window.courseData.submissions = window.courseData.submissions || {};
      saveProgress();
    }

    // Start timer
    startTimer();

    // Update progress indicator
    updateProgressIndicator();

    // Hook MAP save button
    hookMapSaveButton();

    // If we're on the last slide, render results
    if (window.courseData.currentSlide === LAST_SLIDE) {
      setTimeout(refreshResultsPage, 100);
    }
  }

  // Run init after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

})();
