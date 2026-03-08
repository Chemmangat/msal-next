# Google Search Console Setup - Step by Step

## 🎯 Goal
Get your site indexed by Google and submit your sitemap.

---

## Step 1: Go to Google Search Console

Visit: **https://search.google.com/search-console**

Sign in with your Google account.

---

## Step 2: Add Your Property

1. Click **"Add Property"** button (top left)

2. Choose **"URL prefix"** method (not Domain)
   - Enter your full URL: `https://your-domain.com`
   - Click **"Continue"**

---

## Step 3: Verify Ownership

Google will show you several verification methods. Choose the easiest one:

### Option A: HTML Tag (Recommended - Easiest)

1. Google will give you a meta tag like:
   ```html
   <meta name="google-site-verification" content="ABC123XYZ..." />
   ```

2. Copy the entire tag

3. Add it to your `src/app/layout.tsx` file in the `<head>` section:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://msal-next.vercel.app';

  return (
    <html lang="en">
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="YOUR_CODE_HERE" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            // ... existing code
          }) }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

4. Deploy your site:
   ```bash
   git add .
   git commit -m "Add Google Search Console verification"
   git push
   ```

5. Wait 1-2 minutes for deployment

6. Go back to Google Search Console and click **"Verify"**

✅ You should see "Ownership verified"!

---

### Option B: HTML File Upload (Alternative)

1. Download the HTML file Google provides (e.g., `google123abc.html`)

2. Place it in your `public/` folder

3. Deploy your site

4. Click **"Verify"** in Google Search Console

---

## Step 4: Submit Your Sitemap

Once verified:

1. In Google Search Console, click **"Sitemaps"** in the left menu

2. Under "Add a new sitemap", enter:
   ```
   sitemap.xml
   ```

3. Click **"Submit"**

✅ Google will start crawling your site!

---

## Step 5: Check Status

After submitting:

1. Wait 24-48 hours for Google to process

2. Check the "Sitemaps" page to see:
   - ✅ Success (green checkmark)
   - Number of pages discovered
   - Number of pages indexed

3. Go to "Coverage" to see which pages are indexed

---

## Step 6: Monitor Performance

After a few days, check:

1. **Performance** tab:
   - Total clicks
   - Total impressions
   - Average position
   - Click-through rate (CTR)

2. **Coverage** tab:
   - Valid pages
   - Errors (if any)
   - Warnings

3. **Enhancements** tab:
   - Mobile usability
   - Core Web Vitals

---

## 🎯 What to Expect

### Week 1
- Site gets indexed
- Sitemap processed
- First impressions appear

### Week 2-4
- 10-100 impressions/day
- 1-5 clicks/day
- Ranking for brand name

### Month 2-3
- 100-500 impressions/day
- 5-20 clicks/day
- Ranking for some keywords

---

## 🔍 Important URLs

After setup, these URLs will be tracked:

- **Homepage:** `https://your-domain.com`
- **Sitemap:** `https://your-domain.com/sitemap.xml`
- **Robots:** `https://your-domain.com/robots.txt`

---

## 🐛 Troubleshooting

### "Couldn't verify ownership"
- Make sure the meta tag is in the `<head>` section
- Check that your site is deployed
- Wait 2-3 minutes after deployment
- Try verifying again

### "Sitemap couldn't be read"
- Check that `https://your-domain.com/sitemap.xml` loads
- Make sure it's valid XML
- Wait 24 hours and try again

### "No pages indexed"
- Be patient - indexing takes 1-7 days
- Check Coverage tab for errors
- Make sure robots.txt allows crawling

---

## ✅ Quick Checklist

- [ ] Go to search.google.com/search-console
- [ ] Add property (URL prefix)
- [ ] Add verification meta tag to layout.tsx
- [ ] Deploy site
- [ ] Click "Verify" in Google Search Console
- [ ] Submit sitemap.xml
- [ ] Wait 24-48 hours
- [ ] Check Coverage and Performance tabs

---

## 🎉 You're Done!

Your site is now:
- ✅ Verified with Google
- ✅ Sitemap submitted
- ✅ Being crawled and indexed
- ✅ Ready to appear in search results

Check back in a few days to see your first impressions and clicks!

---

## 📊 Next Steps

1. **Monitor weekly** - Check Search Console every week
2. **Create content** - Write blog posts, tutorials
3. **Build backlinks** - Get other sites to link to you
4. **Optimize** - Improve pages with low CTR
5. **Track keywords** - See what people search for

---

## 💡 Pro Tips

1. **Set up email alerts** - Get notified of issues
2. **Check mobile usability** - Most traffic is mobile
3. **Fix Core Web Vitals** - Improves rankings
4. **Submit new pages** - Use URL Inspection tool
5. **Request indexing** - For important new pages

---

**Need help?** Check the Google Search Console Help Center: https://support.google.com/webmasters
