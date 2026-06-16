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

/* ---- Gold Dust Cursor ---- */
var goldColors = ['#D4AF94','#C9A84C','#E8C97A','#B8965A','#F0D080','#C4A89C'];
var lastGoldX = 0, lastGoldY = 0, goldThrottle = false;

window.addEventListener('mousemove', function(e) {
  if (goldThrottle) return;
  goldThrottle = true;
  requestAnimationFrame(function() { goldThrottle = false; });

  var dx = e.clientX - lastGoldX;
  var dy = e.clientY - lastGoldY;
  if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
  lastGoldX = e.clientX;
  lastGoldY = e.clientY;

  var count = 2 + Math.floor(Math.random() * 2);
  for (var i = 0; i < count; i++) {
    (function() {
      var el = document.createElement('div');
      el.className = 'gold-dust';
      var size = 2.5 + Math.random() * 3.5;
      var angle = Math.random() * Math.PI * 2;
      var spread = 6 + Math.random() * 10;
      var ox = Math.cos(angle) * spread;
      var oy = Math.sin(angle) * spread - (8 + Math.random() * 12);
      var dur = 500 + Math.random() * 400;

      el.style.cssText = [
        'left:' + (e.clientX + (Math.random() - 0.5) * 8) + 'px',
        'top:'  + (e.clientY + (Math.random() - 0.5) * 8) + 'px',
        'width:' + size + 'px',
        'height:' + size + 'px',
        'background:' + goldColors[Math.floor(Math.random() * goldColors.length)],
        '--gd-x:' + ox + 'px',
        '--gd-y:' + oy + 'px',
        '--gd-dur:' + dur + 'ms'
      ].join(';');

      document.body.appendChild(el);
      setTimeout(function() { el.remove(); }, dur + 50);
    })();
  }
});

/* ---- Button Sparkle on Click ---- */
var sparkleColors = ['#7B9B8F', '#C9D4C5', '#C4A89C', '#D4AF94', '#4A5D52', '#fff'];
var sparkleShapes = ['✦', '✧', '⋆', '✺', '✼'];

function burstSparkles(e) {
  var btn = e.currentTarget;
  var rect = btn.getBoundingClientRect();
  var cx = rect.left + rect.width / 2;
  var cy = rect.top + rect.height / 2;
  var count = 10;

  for (var i = 0; i < count; i++) {
    (function(i) {
      setTimeout(function() {
        var isStar = Math.random() > 0.5;
        var el = document.createElement('div');
        el.className = isStar ? 'sparkle-star' : 'sparkle';

        var angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.8;
        var dist1 = 20 + Math.random() * 20;
        var dist2 = 50 + Math.random() * 60;
        var sx = Math.cos(angle) * dist1;
        var sy1 = Math.sin(angle) * dist1 - 10;
        var sy2 = Math.sin(angle) * dist2 - 30;

        el.style.left = cx + 'px';
        el.style.top  = cy + 'px';
        el.style.setProperty('--sx',  sx  + 'px');
        el.style.setProperty('--sy1', sy1 + 'px');
        el.style.setProperty('--sy2', sy2 + 'px');

        if (isStar) {
          el.textContent = sparkleShapes[Math.floor(Math.random() * sparkleShapes.length)];
          el.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        } else {
          var size = 4 + Math.random() * 5;
          el.style.width  = size + 'px';
          el.style.height = size + 'px';
          el.style.background = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        }

        document.body.appendChild(el);
        setTimeout(function() { el.remove(); }, 1300);
      }, i * 30);
    })(i);
  }
}

document.querySelectorAll('.btn').forEach(function(btn) {
  btn.addEventListener('click', burstSparkles);
});

/* ---- Ambient Sparkles (floating on page) ---- */
var ambientColors = [
  { color: '#7B9B8F', opacity: 0.35 },
  { color: '#C9D4C5', opacity: 0.45 },
  { color: '#C4A89C', opacity: 0.30 },
  { color: '#D4AF94', opacity: 0.35 },
];

var ambientCount = 18;
for (var a = 0; a < ambientCount; a++) {
  (function() {
    var el = document.createElement('div');
    el.className = 'ambient-sparkle';
    var pick = ambientColors[Math.floor(Math.random() * ambientColors.length)];
    var size = 4 + Math.random() * 7;
    el.style.width    = size + 'px';
    el.style.height   = size + 'px';
    el.style.background = pick.color;
    el.style.left     = Math.random() * 100 + 'vw';
    el.style.top      = Math.random() * 100 + 'vh';
    el.style.setProperty('--dur',         (2.5 + Math.random() * 3.5) + 's');
    el.style.setProperty('--delay',       -(Math.random() * 5) + 's');
    el.style.setProperty('--max-opacity', pick.opacity);
    document.body.appendChild(el);
  })();
}
