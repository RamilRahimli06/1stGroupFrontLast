/* ============================================================
   1st Group Academy — Premium JS
   Production-grade interactions, animations, UX
   ============================================================ */

'use strict';

// ==================== SCROLL PROGRESS BAR ====================
const scrollBar = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollBar) scrollBar.style.width = progress + '%';
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ==================== NAVBAR ====================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Hamburger toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navLinks && navLinks.classList.contains('open')) {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

// Navbar shrink on scroll
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
}, { passive: true });

// ==================== LANGUAGE SWITCH ====================
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// ==================== SCROLL ANIMATIONS ====================
const fadeElements = document.querySelectorAll('.fade-up');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('appear');
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
});

fadeElements.forEach(el => fadeObserver.observe(el));

// Immediate check for elements in view on load
setTimeout(() => {
  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.classList.add('appear');
    }
  });
}, 80);

// ==================== COUNTER ANIMATION ====================
const counters = document.querySelectorAll('.counter-num');
let counted = false;

function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(update);
}

function startCounters() {
  if (counted) return;
  counted = true;
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    if (!isNaN(target)) animateCounter(counter, target);
  });
}

const counterSection = document.querySelector('.counters');
if (counterSection) {
  const counterObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      startCounters();
      counterObserver.disconnect();
    }
  }, { threshold: 0.3 });
  counterObserver.observe(counterSection);
}

// ==================== INSTRUCTOR CAROUSEL ====================
const carousel = document.getElementById('instructorsCarousel');
const prevBtn = document.getElementById('prevInstructorBtn');
const nextBtn = document.getElementById('nextInstructorBtn');

if (carousel) {
  const SCROLL_AMOUNT = 294; // card width + gap

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
    });
  }

  // Touch swipe support
  let startX = 0;
  carousel.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      carousel.scrollBy({ left: diff > 0 ? SCROLL_AMOUNT : -SCROLL_AMOUNT, behavior: 'smooth' });
    }
  }, { passive: true });

  // Update nav button states
  function updateCarouselNav() {
    if (prevBtn) prevBtn.style.opacity = carousel.scrollLeft <= 10 ? '0.4' : '1';
    if (nextBtn) {
      const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;
      nextBtn.style.opacity = atEnd ? '0.4' : '1';
    }
  }
  carousel.addEventListener('scroll', updateCarouselNav, { passive: true });
  updateCarouselNav();
}

// ==================== FAQ ACCORDION ====================
document.querySelectorAll('.faq-q').forEach(question => {
  question.addEventListener('click', function () {
    const parent = this.parentElement;
    const isActive = parent.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item.active').forEach(item => {
      item.classList.remove('active');
    });

    // Open clicked (if it was not active)
    if (!isActive) {
      parent.classList.add('active');
    }
  });
});

// ==================== BACK TO TOP ====================
const backTopBtn = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  if (backTopBtn) {
    const visible = window.scrollY > 500;
    backTopBtn.style.display = visible ? 'flex' : 'none';
  }
}, { passive: true });

if (backTopBtn) {
  backTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 68;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ==================== CONTACT FORM ====================
async function submitForm() {
  const data = {
    firstName:   document.getElementById('fname')?.value?.trim()  || '',
    lastName:    document.getElementById('lname')?.value?.trim()  || '',
    email:       document.getElementById('email')?.value?.trim()  || '',
    phoneNumber: document.getElementById('phone')?.value?.trim()  || '',
    course:      document.getElementById('courseSelect')?.value   || '',
    message:     document.getElementById('message')?.value?.trim() || ''
  };

  // Basic validation
  if (!data.firstName) {
    shakeInput('fname');
    return;
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    shakeInput('email');
    return;
  }

  const submitBtn = document.querySelector('.form-submit');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending…</span>';
  submitBtn.disabled = true;

  try {
    const response = await fetch('https://onestgroupapi.onrender.com/api/contact/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      showSuccess();
      clearForm();
    } else {
      showFormError(result.error || 'An error occurred. Please try again.');
    }
  } catch {
    showFormError('Server connection error. Please check your internet or try again later.');
  } finally {
    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
  }
}

function shakeInput(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#ef4444';
  el.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)';
  el.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-6px)' },
    { transform: 'translateX(6px)' },
    { transform: 'translateX(-4px)' },
    { transform: 'translateX(0)' }
  ], { duration: 300, easing: 'ease-out' });
  el.focus();
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.boxShadow = '';
  }, 2500);
}

function showSuccess() {
  const msg = document.getElementById('successMsg');
  if (msg) {
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 6000);
  }
}

function showFormError(text) {
  alert(text);
}

function clearForm() {
  ['fname', 'lname', 'email', 'phone', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const sel = document.getElementById('courseSelect');
  if (sel) sel.selectedIndex = 0;
}

// Make globally available
window.submitForm = submitForm;

// ==================== MICRO-INTERACTIONS ====================

// Button ripple effect
document.querySelectorAll('.btn-primary, .btn-ghost, .form-submit, .btn-enroll').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
      background: rgba(255,255,255,0.25);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-out 0.5s ease-out forwards;
      pointer-events: none;
    `;
    if (!document.querySelector('#ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = '@keyframes ripple-out { to { transform: scale(2.5); opacity: 0; } }';
      document.head.appendChild(style);
    }
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("locationBtn");

function openLocation() {
  const url = "https://www.google.com/maps?q=26+Nadir+Əliyev+SİGMA+Plaza+Baku";
  window.open(url, "_blank");
}
});
// Course card cursor effect
document.querySelectorAll('.course-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    this.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', function () {
    this.style.transform = '';
    this.style.transition = 'transform 0.5s ease';
    setTimeout(() => { this.style.transition = ''; }, 500);
  });
});

// ==================== ACTIVE NAV LINK ON SCROLL ====================
const sections = document.querySelectorAll('section[id], div[id]');
const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));