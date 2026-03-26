/* ═══════════════════════════════════════════
   ALTIN ADEMI STUDIO — script.js
═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Utility ── */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ═══════════════════════════
     1. CUSTOM CURSOR
  ═══════════════════════════ */
  const cursor   = qs('#cursor');
  const follower = qs('#cursor-follower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = 'a, button, .project-item, .service-card, .skill-tag, select';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverTargets)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverTargets)) {
        document.body.classList.remove('cursor-hover');
      }
    });

    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(0.7)';
    });
    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  }

  /* ═══════════════════════════
     2. NAVIGATION SCROLL
  ═══════════════════════════ */
  const nav = qs('#nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  /* ═══════════════════════════
     3. MOBILE MENU
  ═══════════════════════════ */
  const menuBtn    = qs('#menuBtn');
  const mobileMenu = qs('#mobileMenu');
  const mobileLinks = qsa('.mobile-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuBtn.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ═══════════════════════════
     4. SCROLL REVEAL (IntersectionObserver)
  ═══════════════════════════ */
  const revealElements = qsa('.reveal-up, .reveal-left');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, stop observing for performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* Trigger hero reveals on load */
  window.addEventListener('load', () => {
    qsa('.hero .reveal-up, .hero .reveal-left').forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('revealed');
      }, i * 60 + 200);
    });
  });

  /* ═══════════════════════════
     5. COUNTER ANIMATION
  ═══════════════════════════ */
  function animateCounter(el, target, duration = 1800) {
    let start = null;
    const startVal = 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(eased * (target - startVal) + startVal);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  const counterNums = qsa('.counter-num');
  let countersTriggered = false;

  const counterObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersTriggered) {
      countersTriggered = true;
      counterNums.forEach(num => {
        const target = parseInt(num.getAttribute('data-target'), 10);
        animateCounter(num, target);
      });
    }
  }, { threshold: 0.5 });

  const heroCounter = qs('.hero-counter');
  if (heroCounter) counterObserver.observe(heroCounter);

  /* ═══════════════════════════
     6. SMOOTH SECTION LINKS
  ═══════════════════════════ */
  qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = qs(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ═══════════════════════════
     7. PROJECT HOVER PARALLAX
  ═══════════════════════════ */
  qsa('.project-item').forEach(item => {
    const img = qs('.project-img', item);
    if (!img) return;

    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      img.style.transform = `scale(1.04) translate(${x * 8}px, ${y * 8}px)`;
    });

    item.addEventListener('mouseleave', () => {
      img.style.transform = '';
      img.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
      setTimeout(() => { img.style.transition = ''; }, 600);
    });
  });

  /* ═══════════════════════════
     8. CONTACT FORM
  ═══════════════════════════ */
  const form = qs('#contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const btn  = qs('.btn-submit', form);
      const span = qs('span', btn);
      const origText = span.textContent;

      btn.disabled = true;
      span.textContent = 'Sending...';

      // Simulate async send
      setTimeout(() => {
        span.textContent = 'Message Sent ✓';
        btn.style.background = 'rgba(200,169,125,0.15)';
        btn.style.borderColor = 'rgba(200,169,125,0.4)';
        btn.style.color = 'var(--accent)';

        form.reset();

        setTimeout(() => {
          span.textContent = origText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 3500);
      }, 1500);
    });
  }

  /* ═══════════════════════════
     9. HERO TITLE MOUSE PARALLAX
  ═══════════════════════════ */
  const heroBgText = qs('.hero-bg-text');
  if (heroBgText) {
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      heroBgText.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }, { passive: true });
  }

  /* ═══════════════════════════
     10. STAGGERED NAV REVEAL
  ═══════════════════════════ */
  setTimeout(() => {
    nav.style.opacity = '0';
    nav.style.transform = 'translateY(-20px)';
    nav.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nav.style.opacity = '1';
        nav.style.transform = 'translateY(0)';
      });
    });
  }, 100);

  /* ═══════════════════════════
     11. MARQUEE PAUSE ON HOVER
  ═══════════════════════════ */
  const marqueeTrack = qs('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  /* ═══════════════════════════
     12. SERVICE CARD TILT
  ═══════════════════════════ */
  qsa('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), background 0.3s';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });

  /* ═══════════════════════════
     13. FOOTER BACK TO TOP
  ═══════════════════════════ */
  const footerBack = qs('.footer-back');
  if (footerBack) {
    footerBack.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════
     14. FORM INPUT FOCUS FX
  ═══════════════════════════ */
  qsa('.form-group input, .form-group select').forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.form-group').style.setProperty('--focus', '1');
    });
    input.addEventListener('blur', () => {
      input.closest('.form-group').style.setProperty('--focus', '0');
    });
  });

  /* ═══════════════════════════
     15. SCROLL PROGRESS INDICATOR
  ═══════════════════════════ */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    z-index: 1001;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (scrolled / maxScroll) * 100;
    progressBar.style.width = pct + '%';
  }, { passive: true });

})();
