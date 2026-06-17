'use strict';

/* ---- Sticky Nav ---- */
const mainNav = document.getElementById('main-nav');
function onScroll() {
  mainNav.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- Hamburger / Mobile Menu ---- */
const hamburgerBtn  = document.getElementById('hamburger-btn');
const mobileMenu    = document.getElementById('mobile-menu');
const mobileCloseBtn = document.getElementById('mobile-close');

function openNav() {
  mobileMenu.classList.add('open');
  document.body.classList.add('nav-open');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  mobileCloseBtn.focus();
}

function closeNav() {
  mobileMenu.classList.remove('open');
  document.body.classList.remove('nav-open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
}

hamburgerBtn.addEventListener('click', openNav);
mobileCloseBtn.addEventListener('click', closeNav);

document.querySelectorAll('.mobile-link').forEach(function(link) {
  link.addEventListener('click', closeNav);
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeNav();
    hamburgerBtn.focus();
  }
});

/* ---- Smooth Scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (href === '#') return;
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    var offset = mainNav.offsetHeight;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});

/* ---- Scroll Reveal (Option A — enhanced stagger) ---- */
var reveals = document.querySelectorAll('.reveal');

document.querySelectorAll(
  '.services-grid, .specials-grid, .why-grid, .team-grid, .membership-grid, .testimonials-grid'
).forEach(function(grid) {
  grid.querySelectorAll('.reveal').forEach(function(card, i) {
    card.style.transitionDelay = (i * 90) + 'ms';
  });
});

var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(function(el) { revealObserver.observe(el); });

function checkInView() {
  reveals.forEach(function(el) {
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight + 32 && r.bottom > 0 && !el.classList.contains('revealed')) {
      el.style.transition = 'none';
      el.classList.add('revealed');
      requestAnimationFrame(function() { el.style.transition = ''; });
    }
  });
}
checkInView();
setTimeout(checkInView, 200);
window.addEventListener('load', checkInView);

/* ---- Number Counter (Option D) ---- */
function animateCounter(el) {
  var target  = parseInt(el.getAttribute('data-target'), 10);
  var suffix  = el.getAttribute('data-suffix') || '';
  var duration = 1800;
  var start    = null;

  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function step(timestamp) {
    if (!start) start = timestamp;
    var progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(ease(progress) * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

var counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

var statsBanner = document.querySelector('.stats-banner');
if (statsBanner) counterObserver.observe(statsBanner);

