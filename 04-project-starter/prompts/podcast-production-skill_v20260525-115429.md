# Podcast Production Skill

## Purpose
Generate, transcribe, cut, and embed NotebookLM podcast audio into course mockups and storyboards.

## When to Use
- When a guide needs a podcast/audio learning component
- When NotebookLM audio has been generated and needs to be processed
- When audio needs to be transcribed, captioned, and embedded into the HTML mockup

## Inputs Required
- Source document for NotebookLM (patient advisor reflection, ~500 words)
- Generated .m4a audio file from NotebookLM
- OPENAI_API_KEY for Whisper transcription

## Workflow

### Step 1 — Write Source Document
Create `Guide-XX/02-production/podcast/PODCAST-SOURCE-GUIDE-XX.md` with:
- Episode title, series label, target length
- Voice character description (patient advisor, warm, honest, specific)
- Source text (~500 words, first person, lived experience perspective)
- NotebookLM instructions
- Placeholder listening points (updated after generation)

**Template:**
```markdown
# Podcast Source Document — Guide XX: [Topic]

## Episode Overview
**Title:** "[Episode Title]"
**Series:** Accessibility First — Patient Advisor Reflections
**Episode:** Guide XX
**Actual Length:** ~18 minutes (full NotebookLM deep dive)
**Voice:** [Character name], UHN Patient & Family Advisor

## Source Text for NotebookLM
[~500 words, first person, lived experience]

## Key Listening Points
*Update timestamps after transcription*
```

### Step 2 — Generate in NotebookLM
1. Upload source doc as single source to new NotebookLM notebook
2. Open Studio panel → Generate Audio Overview
3. Download .m4a file
4. Save to `Guide-XX/02-production/podcast/` folder
5. Copy final audio to `Guide-XX/03-media/podcast/` for course build

### Step 3 — Transcribe
**If file > 25MB**, compress first:
```bash
afconvert input.m4a compressed.m4a -d aac -f m4af -b 64000 -q 65
```

**Run transcription:**
```bash
OPENAI_API_KEY="sk-..." python3 04-project-starter/scripts/transcribe_podcast.py --file "path/to/audio.m4a"
```

**Outputs:**
- `*_transcript.md` — timestamped transcript
- `*.srt` — SRT captions for Storyline
- `*_cut_guide.md` — segment table for identifying listening points
- `*_whisper.json` — raw Whisper API response

### Step 4 — Identify Key Listening Points
Review the transcript and cut guide. Find 4-6 anchor moments:
- Hook / opening statement
- Key concept introduction
- The emotional core / personal story
- Actionable takeaway / one sentence to use
- Closing reflection

Update `PODCAST-SOURCE-GUIDE-XX.md` with real timestamps.

### Step 5 — Use Full Podcast (Preferred)
Keep the full-length audio (~15-20 min). Do NOT cut unless specifically requested.

**Why:** NotebookLM podcasts flow naturally. Cutting creates awkward transitions. Listening points help learners navigate without cutting.

**If cutting IS needed:**
```bash
python3 04-project-starter/scripts/cut_podcast.py --segments "START-END,START-END"
```
Note: ffmpeg required (`brew install ffmpeg`).

### Step 6 — Update Storyboard
Update the podcast screen in the master storyboard with:
- Actual audio filename
- Actual duration
- Key listening points with real timestamps
- Reference to SRT captions file

### Step 7 — Update Narration Script
Update the voiceover script for the podcast screen to introduce:
- The full-length format
- What to listen for (reference 2-3 key moments)
- That captions and transcript are available

### Step 8 — Embed in HTML Mockup
Add to the podcast slide:
1. **Audio player** with `<audio>` tag pointing to .m4a file (copy file next to mockup HTML)
2. **Play/pause button** with JS toggle
3. **Progress bar** — clickable to seek, starts at 0%
4. **Time display** — current / total
5. **Key listening points** — clickable timestamps that `seekTo(seconds)`
6. **Toggleable transcript panel** — full timestamped text with:
   - `data-time` attribute on each paragraph
   - Active paragraph highlighting (cobalt left border + blue background)
   - Auto-scroll to current paragraph during playback
   - Click any paragraph to jump to that point

### Audio Player JS Template
```javascript
(function(){
  var audio, playBtn, fill, timeEl;
  function init(){
    audio = document.getElementById('podAudio');
    playBtn = document.getElementById('podPlayBtn');
    fill = document.getElementById('podFill');
    timeEl = document.getElementById('podTime');
    if(audio) audio.addEventListener('timeupdate', updateProgress);
    if(audio) audio.addEventListener('ended', function(){ if(playBtn) playBtn.textContent = '▶'; });
  }
  function fmt(s){ var m=Math.floor(s/60); var sec=Math.floor(s%60); return m+':'+(sec<10?'0':'')+sec; }
  function highlightTranscript(currentTime){
    var paras = document.querySelectorAll('.transcript-p');
    var activeIdx = -1;
    for(var i = paras.length - 1; i >= 0; i--){
      if(currentTime >= parseFloat(paras[i].getAttribute('data-time'))){ activeIdx = i; break; }
    }
    paras.forEach(function(p, i){
      if(i === activeIdx){
        if(!p.classList.contains('active')){
          p.classList.add('active');
          var panel = document.getElementById('podTranscript');
          if(panel && panel.style.display !== 'none') p.scrollIntoView({behavior:'smooth', block:'center'});
        }
      } else { p.classList.remove('active'); }
    });
  }
  function updateProgress(){
    if(!audio||!fill||!timeEl) return;
    var pct = audio.duration ? (audio.currentTime/audio.duration)*100 : 0;
    fill.style.width = pct+'%';
    timeEl.textContent = fmt(audio.currentTime)+' / '+fmt(audio.duration||0);
    highlightTranscript(audio.currentTime);
  }
  window.togglePod = function(){ if(!audio) init(); if(!audio) return; if(audio.paused){ audio.play(); playBtn.textContent='⏸'; } else { audio.pause(); playBtn.textContent='▶'; } };
  window.seekPod = function(e){ if(!audio) init(); if(!audio||!audio.duration) return; var r=e.currentTarget.getBoundingClientRect(); audio.currentTime=((e.clientX-r.left)/r.width)*audio.duration; };
  window.seekTo = function(sec){ if(!audio) init(); if(!audio) return; audio.currentTime=sec; if(audio.paused){ audio.play(); playBtn.textContent='⏸'; } };
  document.addEventListener('DOMContentLoaded', init);
})();
```

### Transcript CSS
```css
.transcript-p { transition:background 0.3s, border-color 0.3s; padding:8px 12px; margin:0 0 8px; border-left:3px solid transparent; border-radius:2px; cursor:pointer; }
.transcript-p.active { background:rgba(36,91,170,0.2); border-left-color:var(--cobalt); }
```

## Scripts Reference
- `04-project-starter/scripts/transcribe_podcast.py` — Whisper API transcription
- `04-project-starter/scripts/cut_podcast.py` — ffmpeg-based segment cutting

## Quality Checklist
- [ ] Source document written with clear voice character
- [ ] Audio generated and saved to `02-production/podcast/`
- [ ] Transcribed with timestamps
- [ ] SRT captions generated
- [ ] Key listening points identified with real timestamps
- [ ] Storyboard updated with audio filename, duration, listening points
- [ ] Narration script updated for podcast screen voiceover
- [ ] HTML mockup has working audio player
- [ ] Progress bar starts at 0% and tracks playback
- [ ] Listening points are clickable and seek to correct position
- [ ] Transcript panel toggles open/closed
- [ ] Active transcript paragraph highlights during playback
- [ ] Transcript auto-scrolls to current paragraph
- [ ] Audio file copied next to mockup HTML (for local playback)
