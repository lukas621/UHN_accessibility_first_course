# SCORM Package Wrapper — Design Spec

**Last updated:** 2026-05-25 (v4)

## Purpose

Package the course from `04-course/current/` into a versioned SCORM 1.2 zip for LMS upload. Handles manifest versioning, file exclusions, and output to `05-releases/`.

## Current Folder Structure

```
05-build-output/01-.../
  04-course/
    current/                    ← LIVE course files (edit here)
      index.html                ← Course shell (23 slides, 1920x1080)
      imsmanifest.xml           ← SCORM 1.2 manifest
      css/course.css            ← All styles
      js/
        welcome-dialog.js       ← Name/role entry, resume option
        scormfunctions.js       ← SCORM API (LMS communication)
        navigation.js           ← Slides, menu, interactions, keyboard, touch
        voiceover.js            ← Audio player, CC engine, captions
        course-tracker.js       ← Completion, quiz scoring, MAP, certificate
        bgm.js                  ← Background music
      media/
        images/ (10 PNGs)
        vo/ (22 MP3s)
        bgm/Path_to_Wellness.mp3
        podcast/Five_words_to_restore_patient_dignity.m4a
      assets/
        uhn-logo.png            ← White logo (dark backgrounds)
        uhn-logo-dark.png       ← Dark logo (white backgrounds)
        MAP-Template-Demo.html
      lms/goodbye.html          ← Post-course exit page
      *.xsd                     ← SCORM schema files (4 files)
    template/                   ← Clean template for new guides
  05-releases/
    v3.0.zip                    ← Previous release
    v4.0.zip                    ← Current release (2026-05-25)
```

## Packaging Steps

### 1. Bump manifest version

Edit `04-course/current/imsmanifest.xml`:
```xml
<manifest identifier="UHN_AccessibilityFirst_Guide01"
          version="{NEW_VERSION}"
```
Increment the major version number each release (v3 → v4 → v5). This forces the LMS to treat it as a new package instead of using cached content.

### 2. Create zip

```bash
cd 04-course/current/
zip -r "../../05-releases/v{VERSION}.zip" . -x ".*" -x "*_v202*"
```

**Critical rules:**
- Zip from INSIDE `current/` so `imsmanifest.xml` is at zip root (not nested)
- Exclude `.DS_Store` and version backup files (`*_v202*`)
- Output to `05-releases/v{VERSION}.zip`

### 3. Verify

```bash
# Confirm manifest is at root (not in subfolder)
unzip -l v{VERSION}.zip | grep imsmanifest
# Should show: imsmanifest.xml (no path prefix)

# Check file count and size
unzip -l v{VERSION}.zip | tail -1
```

## LMS Upload (UHN MyLearning)

- **Cannot delete + re-upload** — must overwrite/replace the existing package
- After uploading, **clear browser cache** (Cmd+Shift+R) or use incognito to verify
- If LMS still shows old version, the manifest version bump should force a refresh

## imsmanifest.xml Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="UHN_AccessibilityFirst_Guide{NN}"
          version="{VERSION}"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="UHN_AF_G{NN}_ORG">
    <organization identifier="UHN_AF_G{NN}_ORG">
      <title>{course_title}</title>
      <item identifier="UHN_AF_G{NN}_ITEM"
            identifierref="UHN_AF_G{NN}_RES"
            isvisible="true">
        <title>{course_title}</title>
        <adlcp:masteryscore>80</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="UHN_AF_G{NN}_RES"
              type="webcontent"
              adlcp:scormtype="sco"
              href="index.html">
      <file href="index.html"/>
      <file href="css/course.css"/>
      <file href="js/welcome-dialog.js"/>
      <file href="js/navigation.js"/>
      <file href="js/voiceover.js"/>
      <file href="js/course-tracker.js"/>
      <file href="js/bgm.js"/>
      <file href="js/scormfunctions.js"/>
      <file href="assets/uhn-logo.png"/>
      <file href="assets/uhn-logo-dark.png"/>
      <file href="assets/MAP-Template-Demo.html"/>
      <file href="lms/goodbye.html"/>
    </resource>
  </resources>
</manifest>
```

## SCORM API Wrapper (scormfunctions.js)

Reference implementation at `04-course/current/js/scormfunctions.js`. Handles:
- `LMSInitialize` / `LMSFinish` — session lifecycle
- `cmi.core.lesson_status` — complete/incomplete
- `cmi.core.score.raw` — quiz percentage (0–100)
- `cmi.core.lesson_location` — bookmark (current slide number)
- `cmi.core.session_time` — HHHH:MM:SS format
- `cmi.suspend_data` — full state JSON (visitedSlides, quizScore, submissions, mapCompleted, timeSpent)
- Auto-sync every 30 seconds
- Auto-save on `beforeunload`
- Standalone mode fallback (logs to console when no LMS detected)

## File Ownership (parallel editing)

Each JS file has a single responsibility — only edit the file that owns the feature:
- `welcome-dialog.js` — welcome dialog
- `navigation.js` — slide nav, interactions, keyboard, touch, side menu
- `voiceover.js` — audio player, closed captions
- `course-tracker.js` — completion tracking, quiz scoring, MAP, certificate
- `bgm.js` — background music
- `scormfunctions.js` — SCORM/LMS communication
- `css/course.css` — all styles
- `index.html` — HTML structure (only edit when adding/changing screens)

Shared state lives in `window.courseData`. All JS files are IIFEs — no global pollution.

## Release History

| Version | Date | Notes |
|---------|------|-------|
| v3.0 | 2026-05-25 | Initial SCORM package with all features |
| v4.0 | 2026-05-25 | Manifest version bump to force LMS cache refresh |

## Success Criteria

1. LMS (UHN MyLearning / SumTotal) auto-detects the zip as SCORM 1.2
2. Course launches in LMS player
3. Completion status reports back to LMS
4. Quiz score reports back to LMS
5. Bookmarking (resume) works across sessions
6. Overwriting existing package picks up the new version (no stale cache)
