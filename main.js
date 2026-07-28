/* EnerLink Group — site behavior */

// ---------------------------------------------------------------------------
// Contact form delivery — pick ONE approach:
//
//   1. Netlify Forms (default): host the site on Netlify and submissions appear
//      in your Netlify dashboard under Forms. Turn on email notifications there
//      (Site settings > Forms > Notifications) to get each inquiry by email.
//      Nothing else to configure — FORMS is already set to 'netlify' below.
//
//   2. Formspree / any host: sign up free at https://formspree.io, create a
//      form, and paste its endpoint into FORM_ENDPOINT. This works on ANY host
//      (Cloudflare Pages, GitHub Pages, etc.) and takes priority when set.
//
//   3. No backend: set FORMS to '' and leave FORM_ENDPOINT blank — the form
//      then opens the visitor's email app pre-filled (mailto).
//
// In every case, if delivery fails the form falls back to mailto so an inquiry
// is never lost.
const FORM_ENDPOINT = '';            // e.g. 'https://formspree.io/f/xxxxxxxx'
const FORMS = 'netlify';             // 'netlify' or ''
const CONTACT_EMAIL = 'info@enerlinkgroup.com';
// ---------------------------------------------------------------------------

// ---- Theme (dark mode) ----
const root = document.documentElement;
const stored = localStorage.getItem('theme');
if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  root.classList.add('dark');
}
function toggleTheme() {
  root.classList.toggle('dark');
  localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
}
document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
document.getElementById('theme-toggle-m')?.addEventListener('click', toggleTheme);

// ---- Mobile menu ----
const btn = document.getElementById('mobile-menu-button');
const menu = document.getElementById('mobile-menu');
btn?.addEventListener('click', () => {
  const open = menu.classList.toggle('hidden');
  btn.setAttribute('aria-expanded', String(!open));
});
document.querySelectorAll('#mobile-menu a').forEach(link =>
  link.addEventListener('click', () => {
    menu.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
  })
);

// ---- Header on scroll + back to top ----
const header = document.getElementById('site-header');
const toTop = document.getElementById('back-to-top');
const onScroll = () => {
  const y = window.scrollY;
  if (y > 20) {
    header.classList.remove('is-top');
    header.classList.add('bg-white/85', 'dark:bg-ink/85', 'backdrop-blur', 'shadow-lg', 'border-gray-200', 'dark:border-white/10');
  } else {
    header.classList.add('is-top');
    header.classList.remove('bg-white/85', 'dark:bg-ink/85', 'backdrop-blur', 'shadow-lg', 'border-gray-200', 'dark:border-white/10');
  }
  if (y > 500) {
    toTop.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-3');
  } else {
    toTop.classList.add('opacity-0', 'pointer-events-none', 'translate-y-3');
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---- Reveal on scroll ----
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---- Animated counters ----
const easeOut = t => 1 - Math.pow(1 - t, 3);
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const dur = 1400; const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = prefix + Math.round(easeOut(p) * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target); } });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

// ---- Active nav link (multi-page: active state is set in markup via .nav-active) ----
// On single-page anchors (if any remain), highlight the section in view.
const anchorLinks = [...document.querySelectorAll('.nav-link')].filter(l => (l.getAttribute('href') || '').startsWith('#'));
if (anchorLinks.length) {
  const sections = anchorLinks.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const spyIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        anchorLinks.forEach(l => l.classList.remove('text-primary', 'font-semibold'));
        const active = document.querySelector('.nav-link[href="#' + e.target.id + '"]');
        active?.classList.add('text-primary', 'font-semibold');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spyIO.observe(s));
}

// ---- Contact form ----
const form = document.getElementById('contact-form');
const msg = document.getElementById('form-message');

function showMsg(text, ok = true) {
  msg.textContent = text;
  msg.classList.toggle('text-green-600', ok);
  msg.classList.toggle('dark:text-green-400', ok);
  msg.classList.toggle('text-red-600', !ok);
  msg.classList.toggle('dark:text-red-400', !ok);
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }

  const data = Object.fromEntries(new FormData(form).entries());
  const submitBtn = form.querySelector('button[type="submit"]');

  // Option 1: POST to a configured endpoint (e.g. Formspree). Works on any host.
  if (FORM_ENDPOINT) {
    submitBtn.disabled = true;
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (res.ok) {
        showMsg('Thank you for your message. We will be in touch shortly.');
        form.reset();
        return;
      }
    } catch { /* fall through to mailto */ }
    finally { submitBtn.disabled = false; }
    return mailtoFallback(data);
  }

  // Option 2: Netlify Forms — post URL-encoded data back to the site root.
  // Netlify captures it (dashboard + optional email). On other hosts this will
  // not succeed, so we fall back to mailto.
  if (FORMS === 'netlify') {
    submitBtn.disabled = true;
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      if (res.ok) {
        showMsg('Thank you for your message. We will be in touch shortly.');
        form.reset();
        return;
      }
    } catch { /* fall through to mailto */ }
    finally { submitBtn.disabled = false; }
    return mailtoFallback(data);
  }

  // Option 3 (default): open the visitor's email client, pre-filled.
  return mailtoFallback(data);
});

function mailtoFallback(data) {
  const subject = encodeURIComponent('Website inquiry from ' + (data.name || 'a visitor'));
  const body = encodeURIComponent(
    'Name: ' + (data.name || '') + '\n' +
    'Company: ' + (data.company || '') + '\n' +
    'Email: ' + (data.email || '') + '\n\n' +
    (data.message || '')
  );
  window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
  showMsg('Opening your email app to send the inquiry to ' + CONTACT_EMAIL + '.');
  form.reset();
}
