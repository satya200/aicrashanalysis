# PowerPoint Creation Instructions

## Quick Start (5 Minutes)

### Option 1: Use HTML Presentation (Recommended)

**The easiest and fastest way - Professional, ready to present!**

1. **Open the HTML file:**
   ```bash
   cd /Users/ssahu777/ai_crashanalysis/ppt
   open presentation.html
   ```
   Or double-click `presentation.html` in Finder

2. **Fill in your details:**
   - Slide 1: Enter your name and team
   - Slide 5: Add demo video link
   - Slide 6: Add your email and GitHub
   - Values auto-save!

3. **Present in full-screen:**
   - Press **F11** for fullscreen
   - Use **Arrow Keys** to navigate
   - Or click navigation buttons

4. **Done!** You're ready to present

---

### Option 2: Create PowerPoint from HTML (If Required)

If you need an actual .pptx file:

#### Step 1: Export HTML to PDF
```bash
1. Open presentation.html in Chrome
2. Press Ctrl+P (Cmd+P on Mac)
3. Destination: "Save as PDF"
4. Layout: Landscape
5. Options: Background graphics ON
6. Save as "RDK_Crash_AI_Presentation.pdf"
```

#### Step 2: Convert PDF to PowerPoint

**Method A: Online Converter**
1. Go to https://www.ilovepdf.com/pdf_to_powerpoint
2. Upload the PDF
3. Download the PPTX file
4. Open in PowerPoint and customize

**Method B: Google Slides**
1. Go to Google Slides
2. File → Import Slides
3. Upload the PDF
4. Export as PPTX: File → Download → Microsoft PowerPoint

**Method C: PowerPoint Direct**
1. Open PowerPoint
2. Insert → Object → Create from File
3. Select the PDF
4. Check "Display as icon" = OFF
5. Adjust as needed

---

### Option 3: Build PowerPoint Manually

Use the detailed guide in `SLIDE_CONTENT.md` to create slides manually.

**Time Required:** 30-45 minutes for professional quality

#### Quick Steps:

1. **Open PowerPoint**
2. **Set Dimensions:** Design → Slide Size → Widescreen (16:9)
3. **For Each Slide:**
   - Choose layout from `SLIDE_CONTENT.md`
   - Copy content from the markdown file
   - Add gradient background (Format Background → Gradient)
   - Insert icons/emojis
   - Apply animations

#### Color Scheme to Use:
- **Slide 1:** Purple gradient (#667eea to #764ba2)
- **Slide 2:** Pink gradient (#f093fb to #f5576c)
- **Slide 3:** Blue gradient (#4facfe to #00f2fe)
- **Slide 4:** Green gradient (#43e97b to #38f9d7)
- **Slide 5:** Yellow gradient (#fa709a to #fee140)
- **Slide 6:** Purple gradient (same as Slide 1)

---

## HTML Presentation Features

### Navigation Controls:

**Keyboard Shortcuts:**
- **→ or Space:** Next slide
- **←:** Previous slide
- **Home:** First slide
- **End:** Last slide

**On-Screen Controls:**
- Click **◀** button: Previous slide
- Click **▶** button: Next slide
- See current slide number in bottom-left

### Editable Fields:

The presentation has input fields that you can fill:
- **Slide 1:** Your name and team
- **Slide 5:** Demo video link
- **Slide 6:** Contact information

**These are saved automatically** in your browser's localStorage!

### Presenting from HTML:

**Advantages:**
✅ Modern, professional gradient design
✅ Smooth animations
✅ No software required (just a browser)
✅ Works on any OS (Mac, Windows, Linux)
✅ Easy to update content
✅ Instant navigation
✅ No compatibility issues

**To Present:**
1. Open in Chrome or Firefox
2. Press F11 for fullscreen
3. Navigate with arrow keys
4. Exit fullscreen: Press F11 again or Esc

---

## Customization Guide

### Change Colors in HTML:

Open `presentation.html` in a text editor and find these sections:

```css
/* Slide 1 - Title */
#slide1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Slide 2 - Problem */
#slide2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

Change the hex color codes to your preferred colors.

### Add Your Logo:

Add this to Slide 1 in the HTML:

```html
<img src="your-logo.png" alt="Logo" style="position: absolute; top: 30px; left: 30px; height: 60px;">
```

Place your logo image in the `ppt/` folder.

### Change Fonts:

Find this in the `<style>` section:

```css
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```

Change to your preferred font.

---

## Demo Video Integration

### Option 1: Embed YouTube Video

1. Upload your demo video to YouTube
2. Copy the embed code
3. Replace the demo placeholder in Slide 5 with:

```html
<iframe width="1200" height="675" 
  src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
  frameborder="0" allowfullscreen>
</iframe>
```

### Option 2: Local Video File

1. Place video file in `ppt/` folder
2. Replace demo placeholder with:

```html
<video width="1200" height="675" controls>
  <source src="demo-video.mp4" type="video/mp4">
</video>
```

### Option 3: Link to Video

Just paste the video URL in the input field on Slide 5.
During presentation, click the link to open the video.

---

## Presentation Best Practices

### Before Demo Day:

1. **Test Everything:**
   - [ ] Open HTML presentation
   - [ ] Check all slides display correctly
   - [ ] Test navigation (arrows, buttons)
   - [ ] Verify editable fields are filled
   - [ ] Test fullscreen mode (F11)
   - [ ] Check demo video plays

2. **Prepare Backup:**
   - [ ] Export to PDF as backup
   - [ ] Screenshot all slides
   - [ ] Have offline copy of demo video
   - [ ] Print speaker notes

3. **Equipment Check:**
   - [ ] Test on presentation laptop/computer
   - [ ] Check display output (projector/screen)
   - [ ] Verify font sizes are readable
   - [ ] Test audio if using video
   - [ ] Have USB backup drive

### During Presentation:

**Timing (Total: 15-20 minutes):**
- Slide 1 (Title): 1 minute - Introduce yourself
- Slide 2 (Problem): 3 minutes - Explain pain points
- Slide 3 (Solution): 3 minutes - Show benefits
- Slide 4 (Architecture): 3 minutes - Technical overview
- Slide 5 (Demo): 6-8 minutes - Live demo or video
- Slide 6 (End): 1 minute + Q&A

**Tips:**
- Speak clearly and pace yourself
- Make eye contact with audience
- Use presenter notes if needed
- Have water nearby
- Smile and be confident!

### Handling Q&A:

**Common Questions to Prepare For:**
1. Which AI models are supported?
   - Answer: Gemini, GPT-5-2, Claude 4.6 Sonnet

2. How accurate is the AI analysis?
   - Answer: High confidence on common patterns (null pointers, memory issues). Provides multiple hypotheses ranked by likelihood.

3. How long does analysis take?
   - Answer: 10-15 seconds typically, up to 60 seconds for complex traces

4. Can it handle any programming language?
   - Answer: Yes, supports C/C++, Java, Python, and others

5. What's the deployment timeline?
   - Answer: Ready for production, phased rollout starting next sprint

---

## Troubleshooting

### HTML Presentation Issues:

**Problem:** Slides don't display correctly
- **Solution:** Use Chrome or Firefox browser
- Clear browser cache: Ctrl+Shift+Delete

**Problem:** Navigation doesn't work
- **Solution:** Click on the slide area first to focus
- Refresh the page (F5)

**Problem:** Input fields don't save
- **Solution:** Check browser allows localStorage
- Try in non-private/incognito browser window

**Problem:** Fullscreen doesn't work
- **Solution:** Use F11 key (not browser fullscreen button)
- Or manually maximize the window

### PDF Export Issues:

**Problem:** Gradients look bad in PDF
- **Solution:** In Print dialog, enable "Background graphics"
- Try "Print to PDF" instead of "Save as PDF"

**Problem:** Text is cut off
- **Solution:** Adjust margins in print settings
- Set to "Landscape" orientation

---

## Files in This Folder

```
ppt/
├── presentation.html          ← Main presentation (ready to use!)
├── SLIDE_CONTENT.md          ← Detailed content guide
├── POWERPOINT_INSTRUCTIONS.md ← This file
├── README.md                  ← Quick overview
└── sample.png                 ← Visual reference
```

---

## Quick Commands

### Open Presentation:
```bash
cd /Users/ssahu777/ai_crashanalysis/ppt
open presentation.html
```

### Export to PDF:
```bash
# In Chrome:
Ctrl+P → Save as PDF → Landscape → Save
```

### Edit Content:
```bash
# Open in text editor:
code presentation.html  # VS Code
nano presentation.html  # Terminal editor
open -e presentation.html  # TextEdit (Mac)
```

---

## Support & Help

### Need to Edit Slides?

1. **HTML:** Edit `presentation.html` in any text editor
2. **Content:** Refer to `SLIDE_CONTENT.md` for all text
3. **Design:** Modify CSS in `<style>` section of HTML

### Need PowerPoint File?

Follow "Option 2: Create PowerPoint from HTML" above.
Or create manually using `SLIDE_CONTENT.md` as guide.

### Need Different Design?

Edit the CSS gradients and colors in `presentation.html`:
- Search for `background: linear-gradient`
- Change color codes
- Save and refresh browser

---

## Success Checklist

Before your presentation:

✅ **Files Ready:**
- [ ] presentation.html opens correctly
- [ ] All 6 slides display properly
- [ ] Navigation works (arrows, buttons)

✅ **Content Complete:**
- [ ] Name and team filled in (Slide 1)
- [ ] Demo video ready (Slide 5)
- [ ] Contact info added (Slide 6)

✅ **Technical:**
- [ ] Tested on presentation computer
- [ ] Fullscreen mode works (F11)
- [ ] No errors in browser console

✅ **Preparation:**
- [ ] Practiced presentation (time it!)
- [ ] Prepared for Q&A
- [ ] Have backup (PDF, screenshots)
- [ ] Equipment tested

---

## You're All Set! 🚀

Your professional presentation is ready. Choose your method:

1. **Fastest:** Use HTML directly (recommended!)
2. **Optional:** Export to PDF/PowerPoint if needed
3. **Custom:** Build manually with content guide

**Good luck with your LabWeek demo!**

For questions or issues, refer to:
- `SLIDE_CONTENT.md` for content details
- `README.md` for quick overview
- Browser DevTools console for errors

**Break a leg! 🎤**
