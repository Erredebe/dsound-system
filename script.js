const navLinks = document.querySelectorAll('.site-nav a');
const createSongIframe = (song) => {
  const iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '140';
  iframe.style.borderRadius = '12px';
  iframe.style.border = '0';
  iframe.allowFullscreen = true;
  iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  iframe.loading = 'lazy';
  iframe.src = song.embedUrl;
  iframe.title = `${song.title} by Dsound-System`;
  return iframe;
};

const setupRevealAnimations = () => {
  const revealItems = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
};

const setupActiveNav = () => {
  const sections = [...document.querySelectorAll('main section[id]')];

  const setActiveLink = () => {
    const scrollPoint = window.scrollY + window.innerHeight * 0.3;
    let currentId = sections[0]?.id;

    sections.forEach((section) => {
      if (scrollPoint >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isMatch = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('is-active', isMatch);
    });
  };

  setActiveLink();
  window.addEventListener('scroll', setActiveLink, { passive: true });
};

const createSongCard = (song, index) => {
  const article = document.createElement('article');
  const delayClass = index === 0 ? '' : ` delay-${Math.min(index, 2)}`;
  article.className = `embed-card song-card reveal${delayClass}`;

  const shell = document.createElement('div');
  shell.className = 'song-card-shell';

  const top = document.createElement('div');
  top.className = 'song-top';

  const titleTag = document.createElement('span');
  titleTag.className = 'media-tag';
  titleTag.textContent = song.title;

  const embedFrame = document.createElement('div');
  embedFrame.className = 'embed-frame';
  embedFrame.appendChild(createSongIframe(song));

  top.append(titleTag, embedFrame);
  shell.appendChild(top);

  if (song.lyrics) {
    const toggle = document.createElement('button');
    toggle.className = 'button button-secondary lyrics-toggle';
    toggle.type = 'button';
    toggle.textContent = 'Ver mas';
    toggle.setAttribute('aria-expanded', 'false');

    const lyrics = document.createElement('pre');
    lyrics.className = 'song-lyrics';
    lyrics.hidden = true;
    lyrics.textContent = song.lyrics;

    toggle.addEventListener('click', () => {
      const isOpen = !lyrics.hidden;
      lyrics.hidden = isOpen;
      article.classList.toggle('is-expanded', !isOpen);
      toggle.textContent = isOpen ? 'Ver mas' : 'Ver menos';
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    shell.append(toggle, lyrics);
  }

  article.appendChild(shell);

  return article;
};

const populatePage = (data) => {
  document.title = data.site.title;
  document.querySelector('meta[name="description"]').setAttribute('content', data.site.description);

  document.getElementById('hero-eyebrow').textContent = data.hero.eyebrow;
  document.getElementById('hero-title').textContent = data.hero.title;
  document.getElementById('hero-text').textContent = data.hero.text;

  const primaryCta = document.getElementById('hero-primary-cta');
  primaryCta.textContent = data.hero.primaryCta.label;
  primaryCta.href = data.hero.primaryCta.href;

  document.getElementById('music-eyebrow').textContent = data.music.eyebrow;

  const songsGrid = document.getElementById('songs-grid');
  const sortedSongs = [...data.music.songs].sort((a, b) => {
    const aOrder = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
    const bOrder = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return a.title.localeCompare(b.title);
  });

  songsGrid.replaceChildren(...sortedSongs.map(createSongCard));
};

const init = async () => {
  try {
    const response = await fetch('data.json');

    if (!response.ok) {
      throw new Error('No se pudo cargar data.json');
    }

    const data = await response.json();
    populatePage(data);
    setupRevealAnimations();
    setupActiveNav();
  } catch (error) {
    console.error(error);
    const songsGrid = document.getElementById('songs-grid');

    songsGrid.innerHTML = `
      <article class="embed-card song-card reveal is-visible">
        <span class="media-tag">Error</span>
        <h3>No se pudo cargar el contenido</h3>
        <p>Arranca la web con un servidor local para que el navegador pueda leer <code>data.json</code>.</p>
      </article>
    `;
  }
};

init();
