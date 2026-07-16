# Wedding Website Setup Guide

## 🎉 Overview

This is a beautiful, responsive React wedding website with:
- **Home page** with elegant animations
- **Info page** with Google Maps integration
- **RSVP form** that saves to Google Sheets
- Easy to customize and extend
- Mobile-friendly design

---

## 📋 Google Sheets Integration Setup

### Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Wedding RSVPs"
4. In the first row, add these column headers:
   ```
   Timestamp | Name | Email | Attending | Guests | Dietary Restrictions | Allergies | Message
   ```

### Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any code in the editor
3. Paste this code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Append the data to the sheet
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email,
      data.attending,
      data.guests,
      data.dietaryRestrictions,
      data.allergies,
      data.message
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'data': data
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'error': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Wedding RSVP Form Handler is running!");
}
```

4. Click the **disk icon** to save
5. Name your project (e.g., "Wedding RSVP Handler")

### Step 3: Deploy the Script

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: "Wedding RSVP Form"
   - **Execute as**: Me
   - **Who has access**: Anyone
5. Click **Deploy**
6. Click **Authorize access** and sign in with your Google account
7. Click **Advanced** → **Go to [project name] (unsafe)** → **Allow**
8. **COPY THE WEB APP URL** - you'll need this!

### Step 4: Update Your React App

1. Open `wedding-website.jsx`
2. Find this line (around line 19):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace it with your actual URL from Step 3:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

---

## 🗺️ Customizing Google Maps

### Option 1: Use the Embed Link (Easiest)

1. Go to [Google Maps](https://maps.google.com)
2. Search for your wedding venue
3. Click **Share** → **Embed a map**
4. Copy the iframe code
5. Replace the iframe in the `InfoPage` component (around line 180)

### Option 2: Add Custom Markers

To add specific markers for ceremony and reception:

1. Go to [Google My Maps](https://www.google.com/maps/d/)
2. Click **Create a new map**
3. Add markers for your venues
4. Click **Share** → **Embed on my site**
5. Copy the iframe and replace it in your code

---

## 🎨 Customization Guide

### Change Names and Date

In `wedding-website.jsx`, find the `HomePage` component:

```javascript
<span className="name-first">Sarah</span>  // Change to your names
<span className="name-second">James</span>
```

```javascript
<span>June 15, 2026</span>  // Change to your date
<span>Helsinki, Finland</span>  // Change to your location
```

### Change Colors

In the CSS section, modify the color variables:

```css
:root {
  --primary: #2c5f5d;        /* Main color */
  --accent: #d4a574;         /* Accent color */
  --bg-cream: #faf8f5;       /* Background */
}
```

### Update Wedding Details

In the `InfoPage` component, update:
- Ceremony time and location
- Reception details
- Dress code
- Hotel information

### Modify the Story Section

In `HomePage`, find the `.story-section` and update the text to your own story.

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. Create account at [Vercel](https://vercel.com)
2. Install Vercel CLI: `npm install -g vercel`
3. In your project folder: `vercel`
4. Follow the prompts
5. Your site will be live at `your-project.vercel.app`
6. Connect your custom domain in Vercel dashboard

### Option 2: Netlify

1. Create account at [Netlify](https://netlify.com)
2. Drag and drop your build folder
3. Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy
   ```

### Option 3: GitHub Pages

1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Deploy using `gh-pages` package

### Before Deployment

Create these files in your project:

**package.json**:
```json
{
  "name": "wedding-website",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "devDependencies": {
    "react-scripts": "5.0.1"
  }
}
```

**public/index.html**:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sarah & James - Wedding</title>
    <meta name="description" content="Join us for our wedding celebration" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

**src/index.js**:
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import WeddingWebsite from './wedding-website';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WeddingWebsite />
  </React.StrictMode>
);
```

Then run:
```bash
npm install
npm run build
```

---

## 🌐 Domain Setup (Porkbun)

1. Buy your domain at [Porkbun](https://porkbun.com)
2. In your hosting provider (Vercel/Netlify):
   - Go to Domain settings
   - Add your custom domain
   - Copy the DNS records
3. In Porkbun:
   - Go to DNS settings
   - Add the records from your hosting provider
4. Wait 24-48 hours for DNS propagation

---

## 📊 Analyzing RSVP Data

Your Google Sheet will automatically collect responses. You can:

### Count Dietary Restrictions

Add a new sheet tab and use formulas:

```
=COUNTIF('Sheet1'!F:F,"*vegetarian*")  // Count vegetarians
=COUNTIF('Sheet1'!F:F,"*vegan*")       // Count vegans
=COUNTIF('Sheet1'!F:F,"*gluten-free*") // Count gluten-free
```

### Count Total Guests

```
=SUM('Sheet1'!E:E)  // Total number of guests
```

### Count Attending vs. Not Attending

```
=COUNTIF('Sheet1'!D:D,"yes")  // Count "yes" responses
=COUNTIF('Sheet1'!D:D,"no")   // Count "no" responses
```

---

## 🔄 Alternatives to Google Sheets

### 1. **Airtable**
- More powerful than Sheets
- Better interface
- API available
- Free tier: 1,200 records
- Setup: Similar to Google Sheets but use Airtable API

### 2. **Firebase**
- Google's real-time database
- Free tier: 1GB storage
- More complex but very powerful
- Good for real-time updates

### 3. **FormSubmit**
- Send form data to email
- No backend needed
- Free
- URL: `https://formsubmit.co/your@email.com`

### 4. **Supabase**
- Open-source Firebase alternative
- PostgreSQL database
- Free tier: 500MB
- More professional solution

### 5. **Notion Database**
- Use Notion as a database
- Great for collaboration
- API available

---

## 🎮 Adding Features Later

### Hidden Minigame Ideas

**1. Easter Egg Hunt**
```javascript
// Add to your app
const [foundEggs, setFoundEggs] = useState(0);
// Place hidden clickable elements with onClick={() => setFoundEggs(prev => prev + 1)}
```

**2. Photo Gallery**
```javascript
// Add a new page with image grid
const GalleryPage = () => (
  <div className="gallery-grid">
    {/* Image components */}
  </div>
);
```

**3. Guest Book**
- Similar to RSVP form
- Let guests leave messages
- Display messages on a dedicated page

**4. Countdown Timer**
```javascript
const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(calculateTimeLeft());
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

**5. Interactive Seating Chart**
- SVG-based table layout
- Click tables to see who's sitting where

---

## 🐛 Troubleshooting

### RSVP Form Not Submitting

1. Check that you replaced `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE`
2. Verify the Apps Script is deployed as "Anyone"
3. Check browser console for errors (F12)
4. Test the script URL directly in browser - should show "running" message

### Maps Not Showing

1. Ensure iframe src has full URL with `https://`
2. Check browser console for errors
3. Try a different map embed

### Styling Issues

1. Check that Google Fonts are loading
2. Clear browser cache
3. Check CSS variables are defined

---

## 📱 Testing Checklist

- [ ] Test on desktop browser
- [ ] Test on mobile (Chrome, Safari)
- [ ] Test all navigation links
- [ ] Submit test RSVP
- [ ] Check Google Sheet received data
- [ ] Test map loads and is interactive
- [ ] Check all links work
- [ ] Verify responsive design on different screen sizes

---

## 📞 Support

If you have questions or run into issues:

1. Check the troubleshooting section above
2. Review the Google Apps Script logs (View → Logs)
3. Check browser console for JavaScript errors
4. Verify all URLs are correct

---

## 🎊 Tips for Success

1. **Test Early**: Set up Google Sheets integration first and test it
2. **Mobile First**: Most guests will view on mobile
3. **Keep It Simple**: Don't overcomplicate the RSVP form
4. **Set Deadlines**: Clearly communicate RSVP deadline
5. **Backup Data**: Regularly export your Google Sheet
6. **Send Reminders**: Follow up with non-responders
7. **Have Fun**: Add personal touches that represent you as a couple!

---

## 📋 Next Steps

1. Set up Google Sheet and Apps Script
2. Customize the content (names, dates, story)
3. Update colors and styling
4. Test thoroughly
5. Deploy to hosting service
6. Connect custom domain
7. Share with your guests!

**Congratulations on your upcoming wedding! 🎉💕**
