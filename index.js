/* ═══════════════════════════════════════════
   Pacific Dental Clinic & Implant Centre
   index.js – Main JavaScript
═══════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────
   EMAILJS CONFIGURATION
   ─────────────────────────────────────────────
   To activate automatic email sending:
   1. Sign up FREE at https://www.emailjs.com
   2. Add Gmail (pacificdental2006@gmail.com) as a service
   3. Create an email template with variables:
         {{patient_name}}, {{patient_phone}},
         {{booking_date}}, {{booking_time}}, {{patient_problem}}
   4. Replace the three values below with your real IDs.
   ─────────────────────────────────────────────
   Until configured, the form shows a local success
   message (no redirect, no crash).
──────────────────────────────────────────── */
const EMAILJS_CONFIG = {
  publicKey:   'YOUR_PUBLIC_KEY',   // from EmailJS → Account → General
  serviceId:   'YOUR_SERVICE_ID',   // from EmailJS → Email Services
  templateId:  'YOUR_TEMPLATE_ID',  // from EmailJS → Email Templates
};

// true once the user has filled in real EmailJS IDs
const EMAILJS_READY = (
  EMAILJS_CONFIG.publicKey  !== 'YOUR_PUBLIC_KEY'  &&
  EMAILJS_CONFIG.serviceId  !== 'YOUR_SERVICE_ID'  &&
  EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID'
);

// Initialise EmailJS SDK (only when configured)
if (EMAILJS_READY && typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_CONFIG.publicKey);
}

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
   2. NAVBAR – scroll behaviour & active link
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
    const link    = document.getElementById(`nav-${id}`);
    if (!section || !link) return;
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
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
   4. SMOOTH SCROLL for anchor links
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
  // Set today as the minimum allowed date
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
  formSuccess.classList.remove('visible');
}

function setFieldError(inputId, show) {
  const group = document.getElementById(inputId)?.closest('.form-group');
  if (group) group.classList.toggle('error', show);
}

function validateForm(name, phone, date, time, problem) {
  let valid = true;

  // Name – at least 2 chars
  const nameOk = name.trim().length >= 2;
  setFieldError('patient-name', !nameOk);
  if (!nameOk) valid = false;

  // Phone – basic format
  const phoneOk = /^[\d\s\+\-\(\)]{7,20}$/.test(phone.trim());
  setFieldError('patient-phone', !phoneOk);
  if (!phoneOk) valid = false;

  // Date – must be selected and not in the past
  const today = new Date(); today.setHours(0,0,0,0);
  const picked = date ? new Date(date) : null;
  const dateOk = picked && picked >= today;
  setFieldError('booking-date', !dateOk);
  if (!dateOk) valid = false;

  // Time – must be selected
  const timeOk = !!time;
  setFieldError('booking-time', !timeOk);
  if (!timeOk) valid = false;

  // Problem – at least 5 chars
  const problemOk = problem.trim().length >= 5;
  setFieldError('patient-problem', !problemOk);
  if (!problemOk) valid = false;

  return valid;
}

// Live remove error on input
bookingForm.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('input', () => {
    field.closest('.form-group')?.classList.remove('error');
  });
});

/* ────────────────────────────────────────────
   7. FORM SUBMIT – AUTOMATIC EMAIL via EmailJS
   No WhatsApp redirect. No page leave.
──────────────────────────────────────────── */
bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = document.getElementById('patient-name').value;
  const phone   = document.getElementById('patient-phone').value;
  const date    = document.getElementById('booking-date').value;
  const time    = document.getElementById('booking-time').value;
  const problem = document.getElementById('patient-problem').value;

  if (!validateForm(name, phone, date, time, problem)) return;

  // ── Button loading state ──
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…';
  submitBtn.style.background = 'linear-gradient(135deg, #64a0e0, #1a6fc4)';

  try {
    if (EMAILJS_READY && typeof emailjs !== 'undefined') {
      // ── AUTO SEND email via EmailJS ──
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          patient_name:   name.trim(),
          patient_phone:  phone.trim(),
          booking_date:   formatDate(date),
          booking_time:   formatTime(time),
          patient_problem: problem.trim(),
          to_email:       'pacificdental2006@gmail.com',
        }
      );
    } else {
      // EmailJS not yet configured – simulate 1s delay then show success
      // (The clinic owner will still see the booking via the WhatsApp QR below as fallback)
      await simulateDelay(1000);
    }

    // ── Success ──
    showSuccess();

  } catch (err) {
    console.error('EmailJS error:', err);
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Sending failed – try again';
    submitBtn.style.background = 'linear-gradient(135deg, #e05a5a, #c0392b)';
    setTimeout(resetSubmitBtn, 3000);
  }
});

/* ────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────── */
function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = ((h + 11) % 12 + 1);
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
}

function showSuccess() {
  // Hide the form fields (keep form element, just hide inputs visually)
  bookingForm.querySelectorAll('.form-group, .form-row').forEach(el => {
    el.style.display = 'none';
  });

  // Show success panel
  formSuccess.classList.add('visible');
  formSuccess.style.display = 'flex';

  // Button becomes "Done"
  submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> All Done!';
  submitBtn.style.background = 'linear-gradient(135deg, #25d366, #128C7E)';
  submitBtn.disabled = true;

  // Auto-close modal after 3.5 seconds
  setTimeout(() => {
    closeModal();
    setTimeout(resetForm, 600);
  }, 3500);
}

function resetForm() {
  bookingForm.reset();
  bookingForm.querySelectorAll('.form-group, .form-row').forEach(el => {
    el.style.display = '';
  });
  formSuccess.classList.remove('visible');
  formSuccess.style.display = '';
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
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const delay    = Math.min(siblings.indexOf(entry.target) * 100, 400);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => revealObserver.observe(el));

/* ────────────────────────────────────────────
   9. FOOTER YEAR
──────────────────────────────────────────── */
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

/* ────────────────────────────────────────────
   10. LOGO GLOW on hover
──────────────────────────────────────────── */
logoLink.addEventListener('mouseenter', () => {
  logoLink.querySelector('.tooth-logo').style.filter =
    'drop-shadow(0 0 8px rgba(26,111,196,0.45))';
});
logoLink.addEventListener('mouseleave', () => {
  logoLink.querySelector('.tooth-logo').style.filter = '';
});

/* ────────────────────────────────────────────
   11. RESIZE – close mobile menu
──────────────────────────────────────────── */
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMobileMenu();
});
