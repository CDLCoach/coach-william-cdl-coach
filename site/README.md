# Coach William Training — Static Website

Static web pages for Coach William Training, suitable for hosting with GitHub Pages.
These pages serve as the required Privacy Policy, Support, and About pages for the
**Coach William CDL Coach** app on both the Apple App Store and Google Play Store.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home / landing page with app overview and quick links |
| `privacy.html` | Privacy Policy (App Store & Google Play compliant) |
| `support.html` | Support page with FAQ and contact email |
| `about.html` | About Coach William Training and the teaching techniques used in the app |
| `css/style.css` | Shared stylesheet (dark navy + gold theme, mobile-responsive) |

## Design

The site matches the Coach William CDL Coach app aesthetic:
- **Background:** Deep navy `#0E1726`
- **Surface cards:** `#172234` with `#2C3D58` borders
- **Accent:** Safety amber/gold `#F5A623`
- **Typography:** System font stack (Segoe UI / SF / Helvetica)
- **Responsive:** Mobile-first layout with hamburger nav under 640px

## Hosting with GitHub Pages

1. **Create a new GitHub repository** named `coach-william-cdl-coach`.

2. **Upload all files** from this `site/` folder to the repository root:
   ```
   index.html
   privacy.html
   support.html
   about.html
   css/
     style.css
   ```

3. **Enable GitHub Pages:**
   - Go to **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**

4. **Wait 1–2 minutes** for the build to complete. Your site will be live at:
   ```
   https://cdlcoach.github.io/coach-william-cdl-coach/
   ```

5. **Use that URL** in your App Store Connect and Google Play Console listings:
   - **App Store:** Enter the URL in the "Privacy Policy URL" field
   - **Google Play:** Enter the URL in the "Privacy Policy" field under App Content → Data Safety
   - **Google Play:** Also enter the Support page URL in the "Support URL" or "Support email" field

6. **The app is already configured** for `https://cdlcoach.github.io/coach-william-cdl-coach/`
   — no further updates needed once Pages is live.

## Customization

- **Support email** is set to `chips2haul@yahoo.com` on all pages.
- **Last updated date** on `privacy.html` — update when you revise the policy.
- **GitHub Pages URL** — set to `https://cdlcoach.github.io/coach-william-cdl-coach/`
  in both the app (`expo/app/about.tsx`) and this README. Already configured.

## App Store Compliance Notes

- The privacy policy states the app does not collect personal information and does
  not require account creation — consistent with the current app behavior.
- The policy includes all standard sections required by Apple and Google:
  Information Collection, How Information Is Used, Third-Party Services,
  Children's Privacy, Data Security, Changes to This Privacy Policy,
  and Contact Information.
- The support page includes a contact email and FAQ — required for App Store
  and Google Play support URL fields.

## License

© Coach William Training. All Rights Reserved.
