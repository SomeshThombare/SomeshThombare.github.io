# Personal portfolio

A responsive, static portfolio built with HTML, CSS, and vanilla JavaScript. It can be hosted directly on GitHub Pages; there is no build step, backend, package manager, or form service.

> **Personalized starter content:** Profile details, education, internships, certificates, skills, and the trading-agent project title and stack were added from information supplied by the portfolio owner. Complete the remaining project narrative, responsibilities, and links with accurate details before publishing. Empty project links are intentionally omitted. Experience and certificates are not marked verified.

## Run locally

Open `index.html` in a browser. For the most reliable relative asset paths, use any static file server (for example, VS Code Live Server) and visit its local address. The portfolio itself does not require a server. A local browser may hide the resume button until the PDF is available over HTTP; this is expected.

## Update your content

All content is kept in `assets/js/`. Edit the sample objects directly; section markup and styles update automatically. To add an item, copy an object in the relevant array, change its fields, and save.

### Name, introduction, links, and email

Edit `assets/js/config.js`:

```js
window.PORTFOLIO_CONFIG = {
  name: "Ada Lovelace",       // Hero name and browser title
  nameShort: "Ada Lovelace",  // Header and footer
  title: "Software Engineer",
  roleTitles: ["Software Engineer", "Full-Stack Developer"], // Hero titles rotate in order
  intro: "A short introduction for the home screen.",
  aboutHeading: "Curious by nature. Builder by choice.",
  about: "Your professional overview.",
  internshipDuration: "6+", // Resume-based summary shown in the About card
  projectsDelivered: "6+", // Total delivered projects; project cards show detailed featured work
  availability: "Available for opportunities",
  location: "London, UK",
  email: "ada@example.com",
  contactIntro: "A sentence inviting people to get in touch.",
  resumePath: "assets/resume.pdf",
  contactMethod: "mailto",
  socials: [
    { label: "GitHub", url: "https://github.com/ada", icon: "GH" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/ada/", icon: "in" },
    { label: "Email", url: "mailto:ada@example.com", icon: "@" }
  ]
};
```

Use real URLs and an email address you want public. The contact form prepares a `mailto:` draft in the visitor's email application; if it does not open automatically, the form displays a direct link to the prepared draft. It does not send or store messages. No service secrets belong in this repository.

### Education and experience

Edit `assets/js/education.js`. Each record uses `degree`, `institution`, `startYear`, `endYear`, `result`, `academicProject`, and optional `logo` (a path such as `assets/images/education/school.png`). Remove a record by deleting its object.

Edit `assets/js/experience.js`. A record includes `title`, `company`, `location`, `startDate`, `endDate`, `current` (boolean), `verified` (boolean), `responsibilities` (an array of bullet strings), `technologies` (an array of names), and optional `logo`. Set `verified: true` only when the experience is genuinely verified; only those records count in the statistics.

### Skills and certifications

Edit `assets/js/skills.js`. Each category has a `category`, a short `icon`, and a `skills` array. Each skill has `name`, `icon`, and optional `level`. For example:

```js
{ name: "TypeScript", icon: "TS", level: "" }
```

Edit `assets/js/certifications.js` to add `{ name, issuer, date, description, image, credentialId, verificationUrl }`. Optional values can be empty strings; empty images and verification links are omitted. Only add credentials you actually hold.

The **Core technologies** statistic checks for Python, Django, JavaScript, HTML, CSS, SQL, React.js, Docker, Git/GitHub, and REST APIs across skills, projects, and internships. Repeated entries count once; common label variants such as `HTML5`/`HTML` and `REST APIs`/`REST API` are treated as the same item. When all ten are present, it displays `10+`.

Known tools in the Technical Skills section use their Devicon SVG logo from the Devicon CDN. Skills without a matching logo keep their small text badge, and a badge is shown if an SVG cannot load. These logos require an internet connection in the visitor's browser.

### Add a project

1. Open `assets/js/projects.js`.
2. Copy one example project object.
3. Change its `id`, `title`, `category`, `problem`, `solution`, `technologies`, image paths, and links.
4. Add screenshots or a demo video if available.
5. Save and preview the page.
6. Commit and push the change to GitHub.

Project fields include `overview`, `problem`, `solution`, `features` (array), `contribution`, `technologies` (array), `challenges`, `futureImprovements`, `image` (card cover), `screenshots` (array of paths), `architectureImage`, `video`, `repositoryUrl`, and `liveUrl`. Empty URLs are not shown. Project detail text and images appear in the accessible details dialog.

Images can live under `assets/images/projects/`; certificates can live in `assets/images/certificates/`. Use paths relative to the repository root, for example `assets/images/projects/weather-dashboard.png`. Keep image files reasonably sized and use descriptive alt text via the data-driven title.

Videos may be a public MP4 path/URL or an embeddable YouTube URL. For YouTube, provide an embed URL such as `https://www.youtube-nocookie.com/embed/VIDEO_ID` (including for unlisted videos when embedding is enabled). The dialog uses playback controls and does not autoplay. Large recordings should be hosted externally rather than committed to Git. Small local MP4s can be placed in `assets/videos/`.

## Resume

The current PDF is at `assets/js/resume.pdf`, and `resumePath` in `assets/js/config.js` points there. Both download links only appear when a PDF exists at that path. If you move or rename it, update `resumePath` to the new repository-relative path. You can also move it to `assets/resume.pdf` and set `resumePath: "assets/resume.pdf"`.

## Preview and publish

Before publishing, open `index.html` or serve the folder locally, check the mobile layout, and verify that every image and link points to a real file or URL. Browser developer tools can show missing assets in the Network panel and JavaScript errors in Console. Relative paths are case-sensitive on GitHub Pages; match each filename and folder exactly. The project details use a modal, so no extra page or route setup is needed.

To publish:

1. Create a GitHub repository and push this folder's contents to its default branch.
2. In repository **Settings → Pages**, choose **Deploy from a branch**, select the default branch and `/ (root)`, then save. GitHub Pages will publish `index.html`.
3. Wait for the Pages deployment and open the URL shown in Settings → Pages. For a project site, the URL typically ends in `/repository-name/`.
4. After future edits, commit and push; Pages redeploys the static files.

An optional Actions workflow is included at `.github/workflows/pages.yml`. To use it, configure repository Pages to **GitHub Actions** and push to `main`. If your default branch has another name, update the workflow trigger first. Alternatively, delete the workflow and use the branch publishing steps above.

## Troubleshooting

- **Images missing:** check the exact capitalization and path from the repository root; avoid local absolute paths.
- **Resume button missing:** confirm `assets/resume.pdf` exists, is a valid PDF, and `resumePath` matches.
- **Changes do not appear:** hard-refresh, wait for Pages to deploy, and inspect the Actions/Pages deployment status.
- **Project page has no GitHub/demo buttons:** empty links are intentionally hidden; add valid URLs to the project object.
- **Contact form does not open email:** the form reveals a link to the prepared `mailto:` draft after submit. The visitor still needs an email app or browser mail handler configured. A static site has no built-in message delivery.
- **Repository URL is a project site:** use repository-relative paths like `assets/images/...`, not `/assets/images/...`, so assets work below `/repository-name/`.

## Files

- `index.html` — semantic page structure and section anchors.
- `assets/css/style.css`, `assets/css/responsive.css`, `assets/css/motion.css`, `assets/css/design-refresh.css` — base styles, responsive layout, motion, and the reference-inspired visual system.
- `assets/js/config.js` — profile, contact, social links, and resume path.
- `assets/js/education.js`, `experience.js`, `skills.js`, `certifications.js`, `projects.js` — editable content arrays.
- `assets/js/main.js` — safe reusable rendering and interactions.
- `.github/workflows/pages.yml` — optional static Pages deployment.
