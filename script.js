/* ============================================================
   ROSCHIN MILARGO — PORTFOLIO SCRIPT
   Handles: Custom cursor, Navbar, Typing effect, Intersection
   Observer (entrance animations), Parallax, Contact form,
   Mobile menu, Smooth scroll.
============================================================ */

'use strict';

// ============================================================
// 1. CUSTOM CURSOR
// ============================================================
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

// Track mouse position with smooth lag for the ring
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Dot follows instantly
  cursorDot.style.transform  = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
});

// Animate ring with lerp (linear interpolation) for smooth lag
function animateCursor() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  cursorRing.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover states: expand ring on interactive elements
const hoverTargets = document.querySelectorAll('a, button, .project-card, .cert-card, .stat-card, input, textarea');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
});


// ============================================================
// 2. NAVBAR — SHRINK ON SCROLL
// ============================================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


// ============================================================
// 3. MOBILE MENU — HAMBURGER TOGGLE
// ============================================================
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  // Prevent body scroll when menu is open
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});


// ============================================================
// 4. TYPING TEXT EFFECT (Hero Section)
//    Cycles through an array of roles with type/erase animation
// ============================================================
const typingEl = document.getElementById('typingText');

const roles = [
  'with AI.',
  'ideas to reality.',
  'imagination to reality.',
  'solutions that solve problem.',
  'things that matter.',
];

let roleIndex = 0;   // current role
let charIndex = 0;   // current character position
let isErasing = false;

function typeEffect() {
  const currentRole = roles[roleIndex];

  if (!isErasing) {
    // Typing forward
    typingEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentRole.length) {
      // Finished typing — pause, then start erasing
      isErasing = true;
      setTimeout(typeEffect, 2200); // hold duration
      return;
    }
    setTimeout(typeEffect, 65); // typing speed
  } else {
    // Erasing
    typingEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      // Finished erasing — move to next role
      isErasing = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      setTimeout(typeEffect, 350); // pause before next word
      return;
    }
    setTimeout(typeEffect, 35); // erase speed (faster than typing)
  }
}

// Start after a short delay so the hero animates in first
setTimeout(typeEffect, 1200);


// ============================================================
// 5. INTERSECTION OBSERVER — ENTRANCE ANIMATIONS
//    Watches .reveal-up and .reveal-right elements;
//    adds .visible class when they enter the viewport.
// ============================================================
const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

const observerOptions = {
  root: null,          // viewport
  rootMargin: '0px',
  threshold: 0.12,     // trigger when 12% of element is visible
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Unobserve after animation — each element only animates once
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

revealEls.forEach(el => revealObserver.observe(el));


// ============================================================
// 6. PARALLAX — BACKGROUND ORBS
//    Orbs move at different speeds based on their data-parallax
//    attribute, creating a sense of depth.
// ============================================================
const orbs = document.querySelectorAll('[data-parallax]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  orbs.forEach(orb => {
    const speed = parseFloat(orb.dataset.parallax) || 0.05;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
}, { passive: true });


// ============================================================
// 7. PARALLAX — MOUSE TILT on Hero shape
//    The hero geometric shape subtly responds to mouse movement
// ============================================================
const heroShapeWrap = document.querySelector('.hero-shape-wrap');

if (heroShapeWrap) {
  document.addEventListener('mousemove', (e) => {
    // Only apply within the hero section
    const hero = document.getElementById('hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.top > 0 || rect.bottom < 0) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const dx = (e.clientX - centerX) / centerX; // -1 to 1
    const dy = (e.clientY - centerY) / centerY; // -1 to 1

    heroShapeWrap.style.transform = `translateY(-50%) translate(${dx * 18}px, ${dy * 12}px)`;
  });
}


// ============================================================
// 8. MAGNETIC BUTTON EFFECT
//    Buttons in the hero CTA feel "magnetic" — they pull slightly
//    toward the cursor.
// ============================================================
const magneticBtns = document.querySelectorAll('.hero-cta .btn');

magneticBtns.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});


// ============================================================
// 9. ACTIVE NAV HIGHLIGHT on scroll
//    Highlights the correct nav link based on which section
//    is currently in view.
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--text-1)';
        }
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(sec => sectionObserver.observe(sec));


// ============================================================
// 10. CONTACT FORM — Simulated submit with validation
// ============================================================
const sendBtn    = document.getElementById('sendBtn');
const formStatus = document.getElementById('formStatus');
const nameInput  = document.getElementById('name');
const emailInput = document.getElementById('email');
const msgInput   = document.getElementById('message');

sendBtn.addEventListener('click', () => {
  // Simple client-side validation
  const name    = nameInput.value.trim();
  const email   = emailInput.value.trim();
  const message = msgInput.value.trim();
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name) {
    showStatus('Please enter your name.', 'error');
    nameInput.focus();
    return;
  }
  if (!email || !emailRx.test(email)) {
    showStatus('Please enter a valid email address.', 'error');
    emailInput.focus();
    return;
  }
  if (!message || message.length < 10) {
    showStatus('Please write a message (at least 10 characters).', 'error');
    msgInput.focus();
    return;
  }

  // Simulate async send
  sendBtn.textContent  = 'Sending...';
  sendBtn.disabled     = true;
  sendBtn.style.opacity = '0.7';

  setTimeout(() => {
    sendBtn.textContent  = 'Message Sent ✓';
    sendBtn.style.opacity = '1';
    showStatus('Thanks! I\'ll get back to you soon. 🚀', 'success');

    // Clear form
    nameInput.value  = '';
    emailInput.value = '';
    msgInput.value   = '';

    // Reset button after delay
    setTimeout(() => {
      sendBtn.textContent = 'Send Message';
      sendBtn.disabled    = false;
    }, 3500);
  }, 1400);
});

function showStatus(msg, type) {
  formStatus.textContent  = msg;
  formStatus.style.color  = type === 'error' ? '#f87171' : '#22c55e';
  // Clear after delay
  setTimeout(() => { formStatus.textContent = ''; }, 5000);
}


// ============================================================
// 11. SMOOTH REVEAL for hero on page load
//     Trigger visible class for hero elements immediately
//     (they use transition-delay for staggered entrance)
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  // Small timeout to let CSS transitions register
  setTimeout(() => {
    const heroReveals = document.querySelectorAll('.hero .reveal-up, .hero .reveal-right');
    heroReveals.forEach(el => el.classList.add('visible'));
  }, 100);
});


// ============================================================
// 12. CARD TILT (3D perspective on hover)
//     Project and cert cards tilt slightly in 3D to follow cursor
// ============================================================
const tiltCards = document.querySelectorAll('.project-card, .cert-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
    const dy   = (e.clientY - cy) / (rect.height / 2); // -1 to 1

    // Gentle tilt — max 6 degrees
    card.style.transform    = `perspective(1000px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateY(-6px) scale(1.01)`;
    card.style.transition   = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s, border-color 0.35s';
  });
});


// ============================================================
// 13. PAGE TRANSITION — subtle fade in on load
// ============================================================
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});
// ============================================================
// 14. GITHUB ACTIVITY — Fetch stats + build contribution heatmap
// ============================================================
(async function initGitHub() {
  const USERNAME = 'roschinmme-lang';

  // --- Fetch user profile stats ---
  try {
    const res  = await fetch(`https://api.github.com/users/${USERNAME}`);
    const data = await res.json();
    if (data.public_repos !== undefined) {
      animateCount(document.getElementById('ghRepos'),     data.public_repos);
      animateCount(document.getElementById('ghFollowers'), data.followers);
      animateCount(document.getElementById('ghFollowing'), data.following);
    }
  } catch (e) { console.warn('GitHub user fetch failed', e); }

  // --- Fetch events to count commits in the last year ---
  try {
    const evRes   = await fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=100`);
    const events  = await evRes.json();
    if (Array.isArray(events)) {
      const pushEvents = events.filter(e => e.type === 'PushEvent');
      const commits    = pushEvents.reduce((sum, e) => sum + (e.payload?.commits?.length || 0), 0);
      animateCount(document.getElementById('ghCommits'), commits);
    }
  } catch (e) { console.warn('GitHub events fetch failed', e); }

  // --- Build heatmap using GitHub's SVG contribution graph ---
  buildHeatmap(USERNAME);
})();

async function buildHeatmap(username) {
  const heatmapEl   = document.getElementById('ghHeatmap');
  const totalEl     = document.getElementById('ghTotalContribs');

  // Use github-contributions-api (public proxy) to get contribution data
  try {
    const res  = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
    const data = await res.json();

    if (!data.contributions) throw new Error('No data');

    const contributions = data.contributions; // array of { date, count, level }
    const total = data.total?.lastYear ?? contributions.reduce((s, d) => s + d.count, 0);

    totalEl.textContent = `${total.toLocaleString()} contributions in the last year`;

    // Group by week (Sunday start)
    const weeks = [];
    let week    = [];

    // Pad first week
    const firstDay = new Date(contributions[0].date).getDay();
    for (let i = 0; i < firstDay; i++) week.push(null);

    contributions.forEach(day => {
      week.push(day);
      if (week.length === 7) { weeks.push(week); week = []; }
    });
    if (week.length) weeks.push(week);

    // Render
    heatmapEl.innerHTML = '';
    weeks.forEach(w => {
      const col = document.createElement('div');
      col.className = 'gh-week';
      w.forEach(day => {
        const cell = document.createElement('div');
        cell.className = 'gh-day';
        if (day) {
          const level = day.level ?? getLevel(day.count);
          cell.setAttribute('data-level', level);
          const d = new Date(day.date);
          const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          cell.setAttribute('data-tip', `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${label}`);
        } else {
          cell.setAttribute('data-level', '0');
          cell.style.opacity = '0';
        }
        col.appendChild(cell);
      });
      heatmapEl.appendChild(col);
    });

  } catch (e) {
    // Fallback: render placeholder with error message
    document.getElementById('ghTotalContribs').textContent = 'Could not load contributions';
    console.warn('Heatmap fetch failed', e);
  }
}

function getLevel(count) {
  if (count === 0) return 0;
  if (count <= 2)  return 1;
  if (count <= 5)  return 2;
  if (count <= 9)  return 3;
  return 4;
}

function animateCount(el, target) {
  if (!el || isNaN(target)) return;
  const duration = 1200;
  const start    = performance.now();
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(t * target);
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}
