/* Data-driven renderers. User content is inserted with textContent (never as HTML). */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const make = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; };
  const socialIconPath = (label) => ({
    github: "M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.04c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.95.1-.74.4-1.25.73-1.54-2.57-.29-5.27-1.29-5.27-5.73 0-1.27.45-2.3 1.19-3.11-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.16 1.19a10.98 10.98 0 0 1 5.76 0c2.2-1.5 3.16-1.19 3.16-1.19.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.11 0 4.45-2.7 5.43-5.28 5.72.41.36.78 1.06.78 2.14v3.19c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z",
    linkedin: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.35V9h3.42v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.23 0Z",
    email: "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm18 2L12 14 2 7"
  })[String(label).toLowerCase()];
  const appendSocialIcon = (container, social) => {
    const pathData = socialIconPath(social.label);
    if (!pathData) { container.textContent = social.icon || social.label.slice(0, 2); return; }
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", social.label.toLowerCase() === "linkedin" ? "0 0 24 24" : social.label.toLowerCase() === "email" ? "0 0 24 24" : "0 0 24 24");
    svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path"); path.setAttribute("d", pathData);
    if (social.label.toLowerCase() === "email") { path.setAttribute("fill", "none"); path.setAttribute("stroke", "currentColor"); path.setAttribute("stroke-width", "1.8"); path.setAttribute("stroke-linecap", "round"); path.setAttribute("stroke-linejoin", "round"); }
    svg.append(path); container.append(svg);
  };
  const DEVICON_IMAGES = {
    python: "python/python-original.svg", django: "django/django-plain.svg", "django rest framework": "djangorest/djangorest-plain-wordmark.svg",
    flask: "flask/flask-original.svg", fastapi: "fastapi/fastapi-original.svg", javascript: "javascript/javascript-plain.svg",
    html5: "html5/html5-plain.svg", css3: "css3/css3-plain.svg", bootstrap: "bootstrap/bootstrap-plain.svg",
    react: "react/react-original.svg", redux: "redux/redux-original.svg", axios: "axios/axios-plain.svg",
    mysql: "mysql/mysql-original-wordmark.svg", postgresql: "postgresql/postgresql-plain.svg", sqlite: "sqlite/sqlite-plain.svg",
    tensorflow: "tensorflow/tensorflow-original.svg", "tensorflow / keras": "tensorflow/tensorflow-original.svg", "hugging face transformers": "huggingface/huggingface-original.svg",
    "scikit-learn": "scikitlearn/scikitlearn-plain.svg", numpy: "numpy/numpy-original.svg", pandas: "pandas/pandas-original.svg",
    docker: "docker/docker-plain.svg", aws: "amazonwebservices/amazonwebservices-original-wordmark.svg", linux: "linux/linux-original.svg",
    git: "git/git-plain.svg", github: "github/github-original.svg", "visual studio code": "vscode/vscode-plain.svg", "chart.js": "chartjs/chartjs-plain.svg"
  };
  const getDeviconKey = name => String(name || "").toLowerCase().replace(/\s*\((?:basic|es6)\)/g, "").replace(/\s*\/\s*cloud fundamentals/g, "").replace(/\s+\d+(?:\.\d+)*$/g, "").replace("react.js", "react").trim();
  const buildSkillIcon = skill => {
    const badge = make("span", "skill-icon"), fallback = make("span", "skill-icon-fallback", skill.icon || "•");
    badge.append(fallback);
    const iconPath = DEVICON_IMAGES[getDeviconKey(skill.name)];
    if (iconPath) {
      const img = make("img", "skill-logo"); img.alt = ""; img.loading = "lazy"; img.decoding = "async";
      img.src = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconPath.trim()}`;
      img.addEventListener("load", () => { fallback.hidden = true; }, { once: true });
      img.addEventListener("error", () => img.remove(), { once: true });
      badge.prepend(img);
    }
    return badge;
  };
  const safeUrl = (value) => { const raw = String(value || "").trim(); if (!raw || raw.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(raw) && !/^(https?:|mailto:)/i.test(raw)) return ""; try { new URL(raw, location.href); return raw; } catch { return ""; } };
  const link = (label, href, cls = "text-link") => { const url = safeUrl(href); if (!url) return null; const a = make("a", cls, label); a.href = url; if (/^https?:/.test(url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } return a; };
  const addImage = (parent, src, alt, cls) => { const url = safeUrl(src); if (!url) return; const img = make("img", cls); img.src = url; img.alt = alt; img.loading = "lazy"; img.onerror = () => img.remove(); parent.append(img); };
  const renderConfig = () => {
    const c = window.PORTFOLIO_CONFIG || {};
    document.querySelectorAll("[data-config]").forEach(el => { const value = c[el.dataset.config]; if (value) el.textContent = value; else el.hidden = true; });
    document.title = `${c.name || "Portfolio"} | Portfolio`;
    document.querySelectorAll("[data-resume]").forEach(a => { const url = safeUrl(c.resumePath); a.href = url || "#"; a.hidden = !url; if (url) a.setAttribute("download", "Somesh_Thombare.pdf"); });
    const mail = safeUrl(`mailto:${c.email || ""}`);
    document.querySelectorAll("[data-email-link]").forEach(a => { if (!mail || !c.email) a.hidden = true; else { a.href = mail; const span = a.querySelector("[data-config='email']"); if (span) span.textContent = c.email; } });
    document.querySelectorAll("[data-email-button]").forEach(a => { if (!mail) a.hidden = true; else a.href = mail; });
    const socials = (c.socials || []).filter(s => safeUrl(s.url));
    ["[data-socials]", "[data-contact-socials]", "[data-footer-socials]"].forEach(sel => { const target = $(sel); if (!target) return; socials.forEach(s => { const a = link("", s.url, "social-link"); if (!a) return; a.setAttribute("aria-label", s.label); a.title = s.label; const glyph = make("span", "social-glyph"); appendSocialIcon(glyph, s); a.append(glyph); target.append(a); }); });
  };
  const renderEducation = () => { const root = $("#education-list"); (window.EDUCATION || []).forEach(item => { const row = make("article", "education-item"); addImage(row, item.logo, `${item.institution} logo`, "entry-logo"); const body = make("div", "entry-body"); body.append(make("p", "entry-date", [item.startYear, item.endYear].filter(Boolean).join(" — "))); body.append(make("h3", "entry-title", item.degree)); body.append(make("p", "entry-sub", item.institution)); if (item.result) body.append(make("p", "entry-detail", item.result)); if (item.academicProject) body.append(make("p", "entry-detail", item.academicProject)); row.append(body); root.append(row); }); if (!root.children.length) root.append(make("p", "empty-state", "Add your education records in education.js.")); };
  const renderExperience = () => { const root = $("#experience-list"); (window.EXPERIENCE || []).forEach(item => { const row = make("article", "timeline-item"); row.append(make("span", "timeline-dot")); const card = make("div", "panel timeline-card"); const top = make("div", "timeline-top"); top.append(make("p", "entry-date", `${item.startDate || ""} — ${item.current ? "Present" : (item.endDate || "")}`)); if (item.verified) top.append(make("span", "verified-badge", "✓ VERIFIED")); addImage(top, item.logo, `${item.company} logo`, "company-logo"); card.append(top, make("h3", "entry-title", item.title), make("p", "entry-sub", [item.company, item.location].filter(Boolean).join(" · ")));
      if ((item.responsibilities || []).length) { const list = make("ul", "responsibility-list"); item.responsibilities.forEach(t => list.append(make("li", "", t))); card.append(list); } if ((item.technologies || []).length) { const chips = make("div", "chip-row"); item.technologies.forEach(t => chips.append(make("span", "chip", t))); card.append(chips); } row.append(card); root.append(row); }); if (!root.children.length) root.append(make("p", "empty-state", "Add roles or internships in experience.js.")); };
  const renderAboutHighlights = () => {
    const root = $("#about-highlights");
    const experienceValue = window.PORTFOLIO_CONFIG?.internshipDuration;
    const projectCount = window.PORTFOLIO_CONFIG?.projectsDelivered || (window.PROJECTS || []).filter(project => /AI|ML/i.test(project.category || "")).length;
    [[experienceValue, "Months internship experience"], [projectCount || "", "Projects delivered"]].forEach(([value, label]) => {
      if (!value) return;
      const item = make("div", "about-highlight");
      item.append(make("strong", "about-highlight-value", String(value)), make("span", "about-highlight-label", label));
      root.append(item);
    });
  };
  const renderSkills = () => { const root = $("#skills-list"); (window.SKILLS || []).forEach(cat => { const card = make("article", "panel skill-card"); const head = make("div", "skill-heading"); head.append(make("span", "skill-category-icon", cat.icon || "◈"), make("h3", "", cat.category)); card.append(head); const list = make("div", "skill-items"); (cat.skills || []).forEach(s => { const item = make("div", "skill-item"); item.append(buildSkillIcon(s), make("span", "skill-name", s.name)); if (s.level) item.append(make("span", "skill-level", s.level)); list.append(item); }); card.append(list); root.append(card); }); if (!root.children.length) root.append(make("p", "empty-state", "Add skill categories in skills.js.")); };
  const renderCertifications = () => { const root = $("#certifications-list"); (window.CERTIFICATIONS || []).forEach(item => { const card = make("article", "panel cert-card"); if (item.type) card.append(make("p", "panel-kicker", item.type.toUpperCase())); card.append(make("span", "cert-mark", "✳")); addImage(card, item.image, `${item.name} certificate`, "cert-image"); card.append(make("h3", "entry-title", item.name), make("p", "entry-sub", item.issuer)); if (item.date) card.append(make("p", "entry-date", item.date)); if (item.description) card.append(make("p", "cert-description", item.description)); if (item.credentialId) card.append(make("p", "entry-detail", `Credential ID: ${item.credentialId}`)); const a = link("Verify credential ↗", item.verificationUrl, "text-link"); if (a) card.append(a); root.append(card); }); if (!root.children.length) root.append(make("p", "empty-state", "Add certificates in certifications.js.")); };
  const makeGithubButton = (href, label, className) => {
    const button = link(label, href, className);
    if (!button) return null;
    button.setAttribute("aria-label", `${label} for this project`);
    const icon = make("span", "social-glyph"); appendSocialIcon(icon, { label: "GitHub" }); button.prepend(icon);
    return button;
  };
  const renderProjects = () => { const root = $("#projects-list"); const items = window.PROJECTS || []; items.forEach((p, i) => { const card = make("article", "panel project-card"); const visual = make("div", `project-visual project-visual-${i % 3}`); if (p.image) addImage(visual, p.image, `${p.title} preview`, "project-image"); if (!visual.querySelector("img")) visual.append(make("span", "visual-mark", String(i + 1).padStart(2, "0")), make("span", "visual-orbit"), make("span", "visual-caption", (p.technologies || []).slice(0, 3).join(" · "))); card.append(visual); const body = make("div", "project-body"); body.append(make("p", "panel-kicker", p.category || "PROJECT"), make("h3", "project-title", p.title), make("p", "project-summary", p.solution || p.problem || "")); const chips = make("div", "chip-row"); (p.technologies || []).forEach(t => chips.append(make("span", "chip", t))); body.append(chips); const actions = make("div", "project-actions"); const details = make("button", "button button-small button-primary project-detail-button", "View Details ↗"); details.type = "button"; details.addEventListener("click", () => showDetails(p)); actions.append(details); const repo = makeGithubButton(p.repositoryUrl, "GitHub", "button button-small button-github"); if (repo) actions.append(repo); body.append(actions); card.append(body); root.append(card); }); if (!items.length) root.append(make("p", "empty-state", "Add projects in projects.js.")); };
  const showDetails = (p) => { const root = $("#dialog-body"); root.replaceChildren(); root.append(make("p", "section-index", p.category || "PROJECT DETAILS")); const title = make("h2", "dialog-title", p.title); title.id = "dialog-title"; root.append(title); const sections = [["Overview", p.overview], ["The problem", p.problem], ["The solution", p.solution], ["My contribution", p.contribution], ["Challenges", p.challenges], ["Future improvements", p.futureImprovements]]; sections.forEach(([h, t]) => { if (t) root.append(make("h3", "dialog-subtitle", h), make("p", "dialog-copy", t)); }); if ((p.features || []).length) { root.append(make("h3", "dialog-subtitle", "Features")); const ul = make("ul", "responsibility-list"); p.features.forEach(x => ul.append(make("li", "", x))); root.append(ul); } if ((p.technologies || []).length) { root.append(make("h3", "dialog-subtitle", "Technologies")); const chips = make("div", "chip-row"); p.technologies.forEach(x => chips.append(make("span", "chip", x))); root.append(chips); }
    const gallery = [...(p.screenshots || [])]; if (p.architectureImage) gallery.push(p.architectureImage); if (gallery.length) { root.append(make("h3", "dialog-subtitle", "Screenshots & architecture")); const imgs = make("div", "dialog-gallery"); gallery.forEach((src, i) => addImage(imgs, src, `${p.title} image ${i + 1}`, "dialog-image")); root.append(imgs); }
    if (p.video) { let videoUrl = safeUrl(p.video); if (videoUrl) { try { const parsed = new URL(videoUrl, location.href); if (parsed.hostname === "youtu.be") videoUrl = `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`; else if (parsed.hostname.endsWith("youtube.com") && !parsed.pathname.startsWith("/embed/")) { const videoId = parsed.searchParams.get("v") || parsed.pathname.match(/\/(?:shorts|live)\/([^/?]+)/)?.[1]; if (videoId) videoUrl = `https://www.youtube-nocookie.com/embed/${videoId}`; } } catch {} root.append(make("h3", "dialog-subtitle", "Demo video")); if (/\.mp4(?:$|\?)/i.test(videoUrl)) { const v = document.createElement("video"); v.controls = true; v.preload = "metadata"; v.src = videoUrl; v.className = "dialog-video"; root.append(v); } else { const iframe = document.createElement("iframe"); iframe.src = videoUrl; iframe.title = `${p.title} demonstration video`; iframe.loading = "lazy"; iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"; iframe.allowFullscreen = true; iframe.className = "dialog-video"; root.append(iframe); } } }
    const actions = make("div", "dialog-actions"); const repo = makeGithubButton(p.repositoryUrl, "GitHub Repository", "button button-github"); const live = link("Live Demo ↗", p.liveUrl, "button button-primary"); if (repo) actions.append(repo); if (live) actions.append(live); if (actions.children.length) root.append(actions); $("#project-dialog").showModal(); };
  const renderStats = () => {
    const root = $("#stats-list");
    const projects = (window.PROJECTS || []).filter(p => safeUrl(p.repositoryUrl) || safeUrl(p.liveUrl)).length;
    const projectsDelivered = window.PORTFOLIO_CONFIG?.projectsDelivered || String(projects).padStart(2, "0");
    const internships = (window.EXPERIENCE || []).filter(role => role.title && role.company).length;
    const technologyNames = [
      ...(window.SKILLS || []).flatMap(category => (category.skills || []).map(skill => skill.name)),
      ...(window.PROJECTS || []).flatMap(project => project.technologies || []),
      ...(window.EXPERIENCE || []).flatMap(role => role.technologies || [])
    ];
    const knownTechnologyNames = new Set(technologyNames.filter(Boolean).map(name => String(name).trim().toLocaleLowerCase()).filter(Boolean));
    const coreTechnologies = [
      ["Python", ["python"]], ["Django", ["django"]], ["JavaScript", ["javascript", "javascript (es6)", "js"]],
      ["HTML", ["html", "html5"]], ["CSS", ["css", "css3"]], ["SQL", ["sql"]],
      ["React.js", ["react.js"]], ["Docker", ["docker", "docker (basic)"]], ["Git & GitHub", ["git & github", "git", "github"]],
      ["REST API", ["rest api", "rest apis"]]
    ];
    const coreTechnologyCount = coreTechnologies.filter(([, aliases]) => aliases.some(name => knownTechnologyNames.has(name))).length;
    const certs = (window.CERTIFICATIONS || []).filter(c => c.type !== "Achievement" && c.type !== "Research publication" && c.name && !/add your/i.test(c.name) && c.issuer && !/organisation/i.test(c.issuer)).length;
    [[projectsDelivered, "Projects delivered", projectsDelivered], [internships, "Internships", String(internships).padStart(2, "0")], [certs, "Certifications", String(certs).padStart(2, "0")], [coreTechnologyCount, "Core technologies", coreTechnologyCount >= 10 ? "10+" : String(coreTechnologyCount).padStart(2, "0")]].forEach(([n, label, display]) => { if (!n) return; const item = make("div", "stat-item"); item.append(make("strong", "stat-number", display), make("span", "stat-label", label)); root.append(item); });
    if (!root.children.length) root.hidden = true;
  };
  const setupMotion = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const targets = document.querySelectorAll(".section-heading, .about-panel, .education-panel, .timeline-item, .skill-card, .cert-card, .project-card, .stats-grid, .contact-top, .contact-form");
    targets.forEach((element, index) => { element.classList.add("reveal-item"); element.style.setProperty("--reveal-delay", `${(index % 3) * 75}ms`); });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
    document.documentElement.classList.add("has-reveal");
    targets.forEach(element => observer.observe(element));
  };
  const setupThemeToggle = () => {
    const button = $("#theme-toggle");
    if (!button) return;
    const storedTheme = (() => { try { return localStorage.getItem("portfolio-theme"); } catch { return null; } })();
    const applyTheme = theme => {
      const light = theme === "light";
      document.documentElement.dataset.theme = light ? "light" : "dark";
      button.setAttribute("aria-pressed", String(light));
      button.setAttribute("aria-label", `Switch to ${light ? "dark" : "light"} theme`);
      button.querySelector(".theme-toggle-icon").textContent = light ? "☾" : "☼";
      button.querySelector(".theme-toggle-label").textContent = light ? "Dark" : "Light";
      const themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) themeColor.content = light ? "#f5f7fb" : "#090a0f";
    };
    applyTheme(storedTheme === "light" ? "light" : "dark");
    button.addEventListener("click", () => {
      const theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      applyTheme(theme);
      try { localStorage.setItem("portfolio-theme", theme); } catch {}
    });
  };
  const setupTitleRotation = () => {
    const track = $(".role-track"), accessible = $("#role-title-accessible");
    const roles = (window.PORTFOLIO_CONFIG?.roleTitles || [window.PORTFOLIO_CONFIG?.title]).filter(Boolean);
    if (!track || !roles.length) return;
    accessible.textContent = roles.join(" · ");
    const makeGroup = () => {
      const group = make("span", "role-group");
      roles.forEach((role, index) => {
        if (index) group.append(make("span", "role-separator", "✳"));
        group.append(make("span", "accent-text role-item", role));
      });
      return group;
    };
    track.replaceChildren(makeGroup());
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || roles.length < 2) { track.classList.add("is-static"); return; }
    track.append(makeGroup());
  };
  const setup = () => {
    const toggle = $(".menu-toggle"), nav = $("#nav-links");
    toggle.addEventListener("click", () => { const open = toggle.getAttribute("aria-expanded") !== "true"; toggle.setAttribute("aria-expanded", String(open)); toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation"); nav.classList.toggle("is-open", open); });
    nav.addEventListener("click", e => { if (e.target.closest("a")) { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open navigation"); } });
    const dialog = $("#project-dialog");
    $(".dialog-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && dialog.open) dialog.close(); });
    $("#contact-form").addEventListener("submit", e => {
      e.preventDefault();
      const c = window.PORTFOLIO_CONFIG || {}, help = $("#form-help"), fallback = $("#compose-fallback");
      if (c.contactMethod !== "mailto" || !c.email || !safeUrl(`mailto:${c.email}`)) { help.textContent = "Set a valid email and contactMethod: 'mailto' in config.js."; return; }
      const data = new FormData(e.currentTarget);
      const subject = encodeURIComponent(data.get("subject"));
      const body = encodeURIComponent(`From: ${data.get("name")} (${data.get("email")})\n\n${data.get("message")}`);
      const draftUrl = `mailto:${c.email}?subject=${subject}&body=${body}`;
      fallback.href = draftUrl; fallback.hidden = false;
      help.replaceChildren(document.createTextNode("Your email app should open. If it doesn’t, use this link: "), fallback);
      location.href = draftUrl;
    });
    $("#year").textContent = String(new Date().getFullYear());
  };
  renderConfig(); renderEducation(); renderExperience(); renderAboutHighlights(); renderSkills(); renderCertifications(); renderProjects(); renderStats(); setupThemeToggle(); setup(); setupMotion(); setupTitleRotation();
})();
