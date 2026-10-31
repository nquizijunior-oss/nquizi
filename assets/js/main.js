(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const storedTheme = localStorage.getItem('nquizi-theme');
  if (storedTheme === 'dark' || storedTheme === 'light') root.dataset.theme = storedTheme;
  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem('nquizi-theme', next);
    });
  }

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    const workParent = nav.querySelector('.has-submenu > a');
    if (workParent) {
      workParent.addEventListener('click', (event) => {
        if (window.matchMedia('(max-width: 700px)').matches) {
          const li = workParent.parentElement;
          if (!li.classList.contains('open-sub')) {
            event.preventDefault();
            li.classList.add('open-sub');
          }
        }
      });
    }
  }

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add('is-visible'));

  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('p');
    const close = () => { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true'); document.body.style.overflow=''; };
    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-lightbox]');
      if (trigger) {
        lightboxImg.src = '../' + trigger.dataset.lightbox;
        lightboxImg.alt = trigger.dataset.caption || 'Portfolio image';
        lightboxCaption.textContent = trigger.dataset.caption || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden','false');
        document.body.style.overflow='hidden';
      }
      if (event.target === lightbox || event.target.closest('.lightbox-close')) close();
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && lightbox.classList.contains('open')) close(); });
  }

  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const project = String(data.get('project') || '').trim();
      const message = String(data.get('message') || '').trim();
      const subject = encodeURIComponent(`Project enquiry: ${project}`);
      const body = encodeURIComponent(`Hello Nkenglefac,\n\nMy name is ${name}.\nEmail: ${email}\nProject: ${project}\n\n${message}\n\nThank you.`);
      const note = document.querySelector('#form-note');
      if (note) note.textContent = 'Your email application should open with the enquiry details. Please review and send the message.';
      window.location.href = `mailto:nquizijunior@gmail.com?subject=${subject}&body=${body}`;
    });
  }
})();
