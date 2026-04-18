/* ═══════════════════════════════════════════
   Pacific Dental Clinic & Implant Centre
   index.js – Main JavaScript
═══════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────
   CONSTANTS
──────────────────────────────────────────── */
const WHATSAPP_NUMBER = '8801819114508'; // international, no +

/* ────────────────────────────────────────────
   DOM REFERENCES
──────────────────────────────────────────── */
const pageLoader    = document.getElementById('page-loader');
const navbar        = document.getElementById('navbar');
const logoLink      = document.getElementById('logo-link');
const hamburgerBtn  = document.getElementById('hamburger-btn');
const navLinks      = document.getElementById('nav-links');
const navOverlay    = document.getElementById('nav-overlay');
const allNavLinks   = document.querySelectorAll('.nav-link');
const bookNowBtn    = document.getElementById('book-now-btn');
const heroBookBtn   = document.getElementById('hero-book-btn');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalCloseBtn = document.getElementById('modal-close');
const bookingForm   = document.getElementById('booking-form');
const formSuccess   = document.getElementById('form-success');
const submitBtn     = document.getElementById('submit-booking');
const currentYearEl = document.getElementById('current-year');
const revealEls     = document.querySelectorAll('.reveal');

/* ────────────────────────────────────────────
   1. PAGE LOADER
──────────────────────────────────────────── */
function hideLoader() {
  pageLoader.classList.add('hidden');
}
window.addEventListener('load', () => setTimeout(hideLoader, 900));

logoLink.addEventListener('click', (e) => {
  e.preventDefault();
  pageLoader.classList.remove('hidden');
  setTimeout(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, 600);
  setTimeout(hideLoader, 1500);
});

/* ────────────────────────────────────────────
   2. NAVBAR – scroll + active link
──────────────────────────────────────────── */
function handleNavScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

const sections = ['home', 'about', 'services', 'location'];
function updateActiveLink() {
  const scrollPos = window.scrollY + 100;
  sections.forEach((id) => {
    const section = document.getElementById(id);
    const link    = document.getElementById('nav-' + id);
    if (!section || !link) return;
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      allNavLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ────────────────────────────────────────────
   3. MOBILE HAMBURGER MENU
──────────────────────────────────────────── */
function openMobileMenu() {
  hamburgerBtn.classList.add('open');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  navLinks.classList.add('open');
  navOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  hamburgerBtn.classList.remove('open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburgerBtn.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
});
navOverlay.addEventListener('click', closeMobileMenu);
allNavLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

/* ────────────────────────────────────────────
   4. SMOOTH SCROLL
──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ────────────────────────────────────────────
   5. BOOKING MODAL – open / close
──────────────────────────────────────────── */
function openModal() {
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('booking-date');
  if (dateInput) dateInput.min = today;
  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const first = modalBackdrop.querySelector('input, textarea');
    if (first) first.focus();
  }, 400);
}
function closeModal() {
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
  clearFormErrors();
}

bookNowBtn.addEventListener('click', openModal);
heroBookBtn.addEventListener('click', openModal);
modalCloseBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeMobileMenu(); closeModal(); }
});

/* ────────────────────────────────────────────
   6. FORM VALIDATION
──────────────────────────────────────────── */
function clearFormErrors() {
  bookingForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
  hideSuccess();
}
function setFieldError(inputId, show) {
  const group = document.getElementById(inputId) && document.getElementById(inputId).closest('.form-group');
  if (group) group.classList.toggle('error', show);
}
function validateForm(name, phone, date, time, problem) {
  let valid = true;

  const nameOk = name.trim().length >= 2;
  setFieldError('patient-name', !nameOk);
  if (!nameOk) valid = false;

  const phoneOk = /^[\d\s\+\-\(\)]{7,20}$/.test(phone.trim());
  setFieldError('patient-phone', !phoneOk);
  if (!phoneOk) valid = false;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const picked = date ? new Date(date) : null;
  const dateOk = picked && picked >= today;
  setFieldError('booking-date', !dateOk);
  if (!dateOk) valid = false;

  const timeOk = !!time;
  setFieldError('booking-time', !timeOk);
  if (!timeOk) valid = false;

  const problemOk = problem.trim().length >= 5;
  setFieldError('patient-problem', !problemOk);
  if (!problemOk) valid = false;

  return valid;
}

// Live clear errors when user types / changes a field
bookingForm.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('input',  () => field.closest('.form-group') && field.closest('.form-group').classList.remove('error'));
  field.addEventListener('change', () => field.closest('.form-group') && field.closest('.form-group').classList.remove('error'));
});

/* ────────────────────────────────────────────
   7. FORM SUBMIT → WhatsApp pre-filled message
   ─────────────────────────────────────────
   How it works:
   1. All fields are validated (name, phone, date,
      time, problem).
   2. A 0.8s loading animation plays (good UX).
   3. WhatsApp opens in a NEW TAB with the full
      booking message already typed.
      The patient only needs to tap ➤ SEND once —
      no typing required.
   4. Success panel shows inside the form.
   5. Modal auto-closes after 3.5 seconds.
──────────────────────────────────────────── */
bookingForm.addEventListener('submit', function(e) {
  e.preventDefault();

  var name    = document.getElementById('patient-name').value;
  var phone   = document.getElementById('patient-phone').value;
  var date    = document.getElementById('booking-date').value;
  var time    = document.getElementById('booking-time').value;
  var problem = document.getElementById('patient-problem').value;

  if (!validateForm(name, phone, date, time, problem)) return;

  // Loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Preparing…';
  submitBtn.style.background = 'linear-gradient(135deg, #64a0e0, #1a6fc4)';

  setTimeout(function() {
    var msg = buildWhatsAppMessage(name, phone, date, time, problem);
    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);

    // Open WhatsApp in new tab – message is pre-filled
    window.open(url, '_blank', 'noopener,noreferrer');

    // Show in-form success state
    showSuccess();

    // Auto-close modal after 3.5 s then reset form
    setTimeout(function() {
      closeModal();
      setTimeout(resetForm, 600);
    }, 3500);

  }, 800);
});

/* ────────────────────────────────────────────
   MESSAGE BUILDER & HELPERS
──────────────────────────────────────────── */
function buildWhatsAppMessage(name, phone, date, time, problem) {
  var lines = [
    '\uD83E\uDDB7 *Appointment Request \u2014 Pacific Dental Clinic & Implant Centre*',
    '',
    '\uD83D\uDC64 *Patient Name:*  ' + name.trim(),
    '\uD83D\uDCDE *Phone / WhatsApp:*  ' + phone.trim(),
    '\uD83D\uDCC5 *Preferred Date:*  ' + formatDate(date),
    '\uD83D\uDD50 *Preferred Time:*  ' + formatTime(time),
    '\uD83D\uDCDD *Problem / Reason:*',
    problem.trim(),
    '',
    '_(Sent via Pacific Dental website \u2013 booking form)_'
  ];
  return lines.join('\n');
}

function formatDate(dateStr) {
  if (!dateStr) return '\u2014';
  var d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function formatTime(timeStr) {
  if (!timeStr) return '\u2014';
  var parts = timeStr.split(':');
  var h = parseInt(parts[0], 10);
  var m = parseInt(parts[1], 10);
  var ampm = h >= 12 ? 'PM' : 'AM';
  var h12  = ((h + 11) % 12 + 1);
  return h12 + ':' + String(m).padStart(2, '0') + ' ' + ampm;
}

function showSuccess() {
  bookingForm.querySelectorAll('.form-group, .form-row').forEach(function(el) {
    el.style.display = 'none';
  });
  formSuccess.classList.add('visible');
  formSuccess.style.display = 'flex';
  submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent to WhatsApp!';
  submitBtn.style.background = 'linear-gradient(135deg, #25d366, #128C7E)';
  submitBtn.disabled = true;
}

function hideSuccess() {
  formSuccess.classList.remove('visible');
  formSuccess.style.display = '';
}

function resetForm() {
  bookingForm.reset();
  bookingForm.querySelectorAll('.form-group, .form-row').forEach(function(el) {
    el.style.display = '';
  });
  hideSuccess();
  resetSubmitBtn();
}

function resetSubmitBtn() {
  submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Booking Request';
  submitBtn.style.background = '';
  submitBtn.disabled = false;
}

/* ────────────────────────────────────────────
   8. SCROLL REVEAL ANIMATION
──────────────────────────────────────────── */
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      var siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      var delay    = Math.min(siblings.indexOf(entry.target) * 100, 400);
      setTimeout(function() { entry.target.classList.add('visible'); }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(function(el) { revealObserver.observe(el); });

/* ────────────────────────────────────────────
   9. FOOTER YEAR
──────────────────────────────────────────── */
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

/* ────────────────────────────────────────────
   10. LOGO GLOW on hover
──────────────────────────────────────────── */
logoLink.addEventListener('mouseenter', function() {
  logoLink.querySelector('.tooth-logo').style.filter =
    'drop-shadow(0 0 8px rgba(26,111,196,0.45))';
});
logoLink.addEventListener('mouseleave', function() {
  logoLink.querySelector('.tooth-logo').style.filter = '';
});

/* ────────────────────────────────────────────
   11. RESIZE – close mobile menu
──────────────────────────────────────────── */
window.addEventListener('resize', function() {
  if (window.innerWidth > 900) closeMobileMenu();
});
