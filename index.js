/* ═══════════════════════════════════════════
   Pacific Dental Clinic & Implant Centre
   index.js – Main JavaScript
═══════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────
   CONSTANTS
──────────────────────────────────────────── */
const WHATSAPP_NUMBER = '8801819114508'; // international format, no +

/* ────────────────────────────────────────────
   DOM REFERENCES
──────────────────────────────────────────── */
const pageLoader      = document.getElementById('page-loader');
const navbar          = document.getElementById('navbar');
const logoLink        = document.getElementById('logo-link');
const hamburgerBtn    = document.getElementById('hamburger-btn');
const navLinks        = document.getElementById('nav-links');
const navOverlay      = document.getElementById('nav-overlay');
const allNavLinks     = document.querySelectorAll('.nav-link');
const bookNowBtn      = document.getElementById('book-now-btn');
const heroBookBtn     = document.getElementById('hero-book-btn');
const modalBackdrop   = document.getElementById('modal-backdrop');
const modalCloseBtn   = document.getElementById('modal-close');
const bookingForm     = document.getElementById('booking-form');
const currentYearEl   = document.getElementById('current-year');
const revealEls       = document.querySelectorAll('.reveal');

/* ────────────────────────────────────────────
   1. PAGE LOADER
   Shows on first load; disappears gracefully.
   Clicking the logo triggers it again briefly.
──────────────────────────────────────────── */
function hideLoader() {
  pageLoader.classList.add('hidden');
}

// Remove loader when page is fully painted
window.addEventListener('load', () => {
  setTimeout(hideLoader, 900);
});

// Logo click → show loader → scroll to top → hide
logoLink.addEventListener('click', (e) => {
  e.preventDefault();

  // Show loader
  pageLoader.classList.remove('hidden');

  // After animation, scroll to top then remove
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, 600);

  setTimeout(() => {
    hideLoader();
  }, 1500);
});

/* ────────────────────────────────────────────
   2. NAVBAR – scroll behaviour & active link
──────────────────────────────────────────── */
function handleNavScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run once on load

// Highlight active nav link based on scroll position
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
  const isOpen = navLinks.classList.contains('open');
  isOpen ? closeMobileMenu() : openMobileMenu();
});

navOverlay.addEventListener('click', closeMobileMenu);

// Close mobile menu when a nav link is clicked
allNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMobileMenu();
    closeModal();
  }
});

/* ────────────────────────────────────────────
   4. SMOOTH SCROLL for anchor links
──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH   = navbar.offsetHeight;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ────────────────────────────────────────────
   5. BOOKING MODAL
──────────────────────────────────────────── */
function openModal() {
  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Focus first input for accessibility
  setTimeout(() => {
    const firstInput = modalBackdrop.querySelector('input, textarea');
    if (firstInput) firstInput.focus();
  }, 400);
}

function closeModal() {
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
  clearFormErrors();
}

// Open triggers
bookNowBtn.addEventListener('click', openModal);
heroBookBtn.addEventListener('click', openModal);

// Close triggers
modalCloseBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});

/* ────────────────────────────────────────────
   6. FORM VALIDATION & WHATSAPP SUBMIT
──────────────────────────────────────────── */
function getField(id) { return document.getElementById(id); }

function setError(groupEl, errorId, show) {
  if (show) {
    groupEl.classList.add('error');
  } else {
    groupEl.classList.remove('error');
  }
}

function clearFormErrors() {
  bookingForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
}

function validateForm(name, phone, problem) {
  let valid = true;

  const nameGroup    = getField('patient-name').closest('.form-group');
  const phoneGroup   = getField('patient-phone').closest('.form-group');
  const problemGroup = getField('patient-problem').closest('.form-group');

  // Name: required, at least 2 chars
  const nameTrimmed = name.trim();
  if (nameTrimmed.length < 2) {
    setError(nameGroup, 'name-error', true);
    valid = false;
  } else {
    setError(nameGroup, 'name-error', false);
  }

  // Phone: required, digits + optional +, spaces, dashes, min 7 chars
  const phoneTrimmed = phone.trim();
  const phoneRegex   = /^[\d\s\+\-\(\)]{7,20}$/;
  if (!phoneRegex.test(phoneTrimmed)) {
    setError(phoneGroup, 'phone-error', true);
    valid = false;
  } else {
    setError(phoneGroup, 'phone-error', false);
  }

  // Problem: required, at least 5 chars
  const problemTrimmed = problem.trim();
  if (problemTrimmed.length < 5) {
    setError(problemGroup, 'problem-error', true);
    valid = false;
  } else {
    setError(problemGroup, 'problem-error', false);
  }

  return valid;
}

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = getField('patient-name').value;
  const phone   = getField('patient-phone').value;
  const problem = getField('patient-problem').value;

  if (!validateForm(name, phone, problem)) return;

  // Build WhatsApp message
  const message = [
    `🦷 *Appointment Request – Pacific Dental Clinic*`,
    ``,
    `👤 *Name:* ${name.trim()}`,
    `📞 *Phone:* ${phone.trim()}`,
    `📝 *Problem / Reason:*`,
    `${problem.trim()}`,
    ``,
    `_(Sent via website booking form)_`
  ].join('\n');

  const encoded = encodeURIComponent(message);
  const waUrl   = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  // Visual feedback on button
  const submitBtn = document.getElementById('submit-booking');
  submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Opening WhatsApp…';
  submitBtn.style.background = 'linear-gradient(135deg, #25d366, #1aaf57)';
  submitBtn.disabled = true;

  setTimeout(() => {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    closeModal();
    bookingForm.reset();

    // Reset button after modal closes
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Send via WhatsApp';
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 500);
  }, 650);
});

// Live validation – remove error state when user starts typing
bookingForm.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('input', () => {
    const group = field.closest('.form-group');
    if (group.classList.contains('error')) {
      group.classList.remove('error');
    }
  });
});

/* ────────────────────────────────────────────
   7. SCROLL REVEAL ANIMATION
──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in the same parent grid
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const index    = siblings.indexOf(entry.target);
        const delay    = Math.min(index * 100, 400); // cap at 400ms

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ────────────────────────────────────────────
   8. SET CURRENT YEAR IN FOOTER
──────────────────────────────────────────── */
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

/* ────────────────────────────────────────────
   9. LOGO ANIMATED PULSE on hover (CSS does
      rotation; JS adds a class for more flair)
──────────────────────────────────────────── */
logoLink.addEventListener('mouseenter', () => {
  logoLink.querySelector('.tooth-logo').style.filter =
    'drop-shadow(0 0 8px rgba(26,111,196,0.45))';
});
logoLink.addEventListener('mouseleave', () => {
  logoLink.querySelector('.tooth-logo').style.filter = '';
});

/* ────────────────────────────────────────────
   10. RESIZE HANDLER – close mobile menu
       if screen grows beyond tablet breakpoint
──────────────────────────────────────────── */
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    closeMobileMenu();
  }
});
