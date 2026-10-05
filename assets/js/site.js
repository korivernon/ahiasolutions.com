/* Renders every Ahïa Solutions page from data/site.json.
   Each page sets <body data-page="home|about|services|contact">. */
(function () {
  'use strict';
  const K = window.KSV;
  const { esc, md, inline, safeUrl, isExternal } = K;
  const $ = (s, r) => (r || document).querySelector(s);

  const PAGE = document.body.dataset.page || 'home';
  const NAV = [['index.html', 'Home', 'home'], ['about.html', 'About Us', 'about'], ['services.html', 'Services', 'services']];
  const ICONS = {
    laptop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4.5" width="16" height="11" rx="1.5"/><path d="M2 19.5h20l-1.6-3H3.6z"/></svg>',
    chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20.5h18"/><rect x="5" y="11" width="3.2" height="7.5" rx=".6"/><rect x="10.4" y="6" width="3.2" height="12.5" rx=".6"/><rect x="15.8" y="13.5" width="3.2" height="5" rx=".6"/></svg>',
    code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15"/></svg>',
    megaphone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10v4h3l7 4.5v-13l-7 4.5zM16.5 9a4 4 0 0 1 0 6M7 14l1.2 5h2.6L10 14.5"/></svg>',
    gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5"/></svg>',
    video: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="m15.5 10.5 6-3.5v10l-6-3.5z"/></svg>',
  };

  const vis = l => (l || []).filter(x => x && !x.hidden);
  const ext = u => (isExternal(u) ? ' target="_blank" rel="noopener"' : '');
  const pen = path => K.isAdmin() ? '<a class="edit-pen" href="admin/#' + esc(path) + '" title="Edit in admin">✎</a>' : '';
  const btn = (href, label, cls) => '<a class="btn ' + cls + '" href="' + esc(safeUrl(href)) + '"' + ext(href) + '>' + esc(label) + '</a>';
  const video = (src, title) => {
    const ok = src && /^https:\/\/(www\.)?(youtube(-nocookie)?\.com|player\.vimeo\.com)\//.test(src);
    return ok ? '<div class="video"><iframe src="' + esc(src) + '" title="' + esc(title) + '" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div>' : '';
  };
  const heading = (t, tag) => '<' + (tag || 'h2') + ' class="sec-title">' + esc(t) + '</' + (tag || 'h2') + '><div class="heading-line"></div>';

  function header(d) {
    return '<nav class="nav" aria-label="Main"><div class="container nav-inner">' +
      '<a class="brand" href="index.html">' + esc(d.brand.name) + '</a>' +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '<div class="nav-menu" id="nav-menu">' +
        NAV.map(n => '<a class="nav-link' + (PAGE === n[2] ? ' active' : '') + '" href="' + n[0] + '"' + (PAGE === n[2] ? ' aria-current="page"' : '') + '>' + n[1] + '</a>').join('') +
        '<a class="btn btn-outline nav-cta" href="contact.html"' + (PAGE === 'contact' ? ' aria-current="page"' : '') + '>Contact Us</a>' +
      '</div></div></nav>';
  }

  function footer(d) {
    const links = vis(d.links);
    return '<footer class="footer"><div class="container">' +
      heading(d.brand.name) +
      '<p>' + inline(d.brand.footerTagline || '') + '</p>' +
      '<div class="foot-links">' + NAV.map(n => '<a href="' + n[0] + '">' + n[1] + '</a>').join('') + '<a href="contact.html">Contact Us</a>' +
        links.map(l => '<a href="' + esc(safeUrl(l.url)) + '"' + ext(l.url) + '>' + esc(l.label) + '</a>').join('') + '</div>' +
      '</div><div class="copyright">' + esc(d.brand.name) + ' © ' + new Date().getFullYear() + '</div></footer>';
  }

  function servicesBlock(d, dark) {
    const list = vis(d.services);
    if (!list.length) return '';
    return '<section class="services' + (dark ? ' dark' : '') + '" data-edit="services">' + pen('services') +
      '<div class="container">' + heading(d.servicesTitle || 'Services') +
      '<div class="service-grid">' + list.map(s =>
        '<div class="service" data-edit="services/' + esc(s.id) + '">' +
          '<span class="icon">' + (ICONS[s.icon] || ICONS.laptop) + '</span>' +
          '<h3>' + esc(s.title) + '</h3><p>' + inline(s.text) + '</p></div>').join('') +
      '</div></div></section>';
  }

  function home(d) {
    const h = d.home, m = d.mission || {};
    return '<section class="hero container" data-edit="home">' + pen('home') +
        '<div class="hero-media reveal">' + video(h.video, 'Ahïa Solutions') + '</div>' +
        '<div class="hero-copy reveal">' +
          '<h1>' + esc(h.title) + '</h1>' + md(h.text) +
          '<div class="actions">' + btn('contact.html', h.primaryButton || 'Contact Us', 'btn-dark') + btn('services.html', h.secondaryButton || 'Learn more', 'btn-outline') + '</div>' +
        '</div></section>' +
      (m.hidden ? '' : '<section class="mission" data-edit="mission">' + pen('home') + '<div class="container narrow">' +
        heading(m.title || 'Our Mission') + md(m.text) +
        (m.button ? '<div class="actions center">' + btn('contact.html', m.button, 'btn-orange') + '</div>' : '') +
      '</div></section>') +
      servicesBlock(d, false);
  }

  function about(d) {
    const a = d.about;
    return '<section class="hero container" data-edit="about">' + pen('about') +
        '<div class="hero-media reveal">' + video(a.video, 'About Ahïa Solutions') + '</div>' +
        '<div class="hero-copy reveal"><h1>' + esc(a.title) + '</h1>' +
          (a.definition ? '<p class="definition"><em>' + esc(a.definition) + '</em></p>' : '') + md(a.story) + '</div>' +
      '</section>' +
      '<section class="split container" data-edit="about">' +
        '<div class="split-copy reveal"><h2 class="big">' + esc(a.title2) + '</h2>' + md(a.text2) +
          '<div class="actions">' + btn('contact.html', 'Contact Us', 'btn-dark') + btn('services.html', 'Learn more', 'btn-outline') + '</div></div>' +
        (a.image ? '<div class="split-media reveal"><img src="' + esc(safeUrl(a.image)) + '" alt="" width="900" height="922" loading="lazy"></div>' : '') +
      '</section>' +
      servicesBlock(d, true);
  }

  function services(d) {
    return '<div class="page-top"></div>' + servicesBlock(d, false) +
      '<section class="mission"><div class="container narrow">' + heading('Ready to get started?') +
      '<p>Tell us what you need and we will put together a plan that fits your business.</p>' +
      '<div class="actions center">' + btn('contact.html', 'Contact Us', 'btn-orange') + '</div></div></section>';
  }

  function contact(d) {
    const c = d.contact;
    return '<section class="logo-band"><a href="index.html"><img src="' + esc(safeUrl(d.brand.logo)) + '" alt="' + esc(d.brand.name) + '" width="474" height="117"></a></section>' +
      '<section class="contact" data-edit="contact">' + pen('contact') + '<div class="container">' +
        heading(c.title || 'Contact Us') + (c.intro ? '<p class="center intro">' + inline(c.intro) + '</p>' : '') +
        (c.formEmbed && /^https:\/\/docs\.google\.com\/forms\//.test(c.formEmbed)
          ? '<div class="form-frame"><iframe src="' + esc(c.formEmbed) + '" title="Contact form" height="' + (Number(c.formHeight) || 1150) + '">Loading…</iframe></div>'
          : '') +
      '</div></section>';
  }

  function wire() {
    const t = $('.nav-toggle'), m = $('#nav-menu');
    t.addEventListener('click', () => { const open = t.getAttribute('aria-expanded') !== 'true'; t.setAttribute('aria-expanded', open); m.classList.toggle('open', open); });
    if (K.isAdmin()) {
      const b = document.createElement('button');
      b.className = 'btn btn-dark edit-fab'; b.type = 'button'; b.textContent = '✎ Edit mode';
      b.addEventListener('click', () => { const on = document.body.classList.toggle('editing'); b.textContent = on ? '✓ Done' : '✎ Edit mode'; });
      document.body.appendChild(b);
    }
  }

  K.loadSite().then(res => {
    const d = res.data;
    d.brand = d.brand || { name: 'Ahïa Solutions' };
    $('#site-header').outerHTML = header(d);
    $('#app').innerHTML = ({ home, about, services, contact }[PAGE] || home)(d);
    $('#site-footer').outerHTML = footer(d);
    wire();
    if (res.draft) {
      const b = document.createElement('div'); b.className = 'banner';
      b.innerHTML = 'DRAFT PREVIEW · not published <a href="admin/">back to admin</a>';
      document.body.appendChild(b);
    }
  }).catch(err => {
    $('#app').innerHTML = '<p class="container loading">Could not load the page (' + esc(err.message) + '). Please refresh.</p>';
  });
})();
