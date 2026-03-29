const navLinks = document.querySelectorAll('.site-nav a');
const songModalBackdrop = document.getElementById('song-modal-backdrop');
let activeSongCard = null;
let activeSongToggle = null;

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

const closeSongModal = () => {
  if (!activeSongCard) {
    return;
  }

  activeSongCard.classList.remove('is-modal-open');
  activeSongCard.removeAttribute('aria-modal');
  activeSongCard.removeAttribute('role');

  const closeButton = activeSongCard.querySelector('.song-card-close');
  const lyrics = activeSongCard.querySelector('.song-lyrics');

  if (closeButton) {
    closeButton.hidden = true;
  }

  if (lyrics) {
    lyrics.hidden = true;
  }

  if (activeSongToggle) {
    activeSongToggle.hidden = false;
    activeSongToggle.focus();
  }

  if (songModalBackdrop) {
    songModalBackdrop.hidden = true;
  }

  document.body.classList.remove('modal-open');
  activeSongCard = null;
  activeSongToggle = null;
};

const openSongModal = (card, toggleButton) => {
  closeSongModal();

  activeSongCard = card;
  activeSongToggle = toggleButton;

  const closeButton = card.querySelector('.song-card-close');
  const lyrics = card.querySelector('.song-lyrics');

  document.body.classList.add('modal-open');

  if (songModalBackdrop) {
    songModalBackdrop.hidden = false;
  }

  card.classList.add('is-modal-open');
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');

  if (toggleButton) {
    toggleButton.hidden = true;
  }

  if (lyrics) {
    lyrics.hidden = false;
  }

  if (closeButton) {
    closeButton.hidden = false;
    closeButton.focus();
  }
};

const setupSongModal = () => {
  if (!songModalBackdrop) {
    return;
  }

  songModalBackdrop.addEventListener('click', () => {
    closeSongModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeSongCard) {
      closeSongModal();
    }
  });
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

  const top = document.createElement('div');
  top.className = 'song-top';

  const titleTag = document.createElement('span');
  titleTag.className = 'media-tag';
  titleTag.textContent = song.title;

  const embedFrame = document.createElement('div');
  embedFrame.className = 'embed-frame';
  embedFrame.appendChild(createSongIframe(song));

  top.append(titleTag, embedFrame);
  article.appendChild(top);

  if (song.lyrics) {
    const closeButton = document.createElement('button');
    closeButton.className = 'song-modal-close song-card-close';
    closeButton.type = 'button';
    closeButton.textContent = 'Cerrar';
    closeButton.hidden = true;

    const toggle = document.createElement('button');
    toggle.className = 'button button-secondary lyrics-toggle';
    toggle.type = 'button';
    toggle.textContent = 'Ver mas';

    const lyrics = document.createElement('pre');
    lyrics.className = 'song-lyrics';
    lyrics.hidden = true;
    lyrics.textContent = song.lyrics;

    closeButton.addEventListener('click', () => {
      closeSongModal();
    });

    toggle.addEventListener('click', () => {
      openSongModal(article, toggle);
    });

    article.append(closeButton, toggle, lyrics);
  }

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
    setupSongModal();
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
