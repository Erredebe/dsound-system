const pageMode = document.body.dataset.page || 'index';
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const songsMenu = document.getElementById('songs-menu');
const songsMenuToggle = document.getElementById('songs-menu-toggle');
const songsMenuList = document.getElementById('songs-menu-list');
const heroShare = document.getElementById('hero-share');
const heroMeta = document.getElementById('hero-meta');
const musicTitle = document.getElementById('music-title');
const musicIntro = document.getElementById('music-intro');

const shareIcons = {
  X: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 3H21l-4.59 5.24L21.8 21h-4.23l-3.31-4.83L9.98 21H7.87l4.91-5.61L2.2 3h4.34l2.99 4.36L13.35 3h2.11l-4.37 4.99L18.9 3Zm-1.48 16h1.17L6.45 4.9H5.19L17.42 19Z" fill="currentColor"/></svg>',
  Facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-7h2.35l.35-2.73H13.5V9.52c0-.79.22-1.33 1.35-1.33h1.44V5.75c-.25-.03-1.1-.1-2.09-.1-2.07 0-3.49 1.26-3.49 3.58v2.04H8.38V14h2.33v7h2.79Z" fill="currentColor"/></svg>',
  WhatsApp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.88 11.88 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.09.54 4.13 1.57 5.93L0 24l6.38-1.67a11.82 11.82 0 0 0 5.67 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.43-8.41ZM12.06 21.8h-.01a9.88 9.88 0 0 1-5.03-1.37l-.36-.21-3.79.99 1.01-3.7-.24-.38a9.9 9.9 0 0 1-1.52-5.24c0-5.47 4.45-9.91 9.92-9.91 2.65 0 5.14 1.03 7.01 2.9a9.85 9.85 0 0 1 2.9 7.01c0 5.47-4.45 9.91-9.89 9.91Zm5.44-7.43c-.3-.15-1.76-.87-2.03-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.35.22-.65.08-.3-.15-1.25-.46-2.38-1.48-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.21-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.5.08-.76.38-.26.3-1 1-.99 2.43 0 1.44 1.05 2.83 1.2 3.03.15.2 2.06 3.14 5 4.4.7.3 1.25.48 1.67.62.7.22 1.34.19 1.84.11.56-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" fill="currentColor"/></svg>',
  LinkedIn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5A1.75 1.75 0 1 1 5 7a1.75 1.75 0 0 1-.02-3.5ZM3.5 8.75h3V20h-3V8.75Zm4.75 0H11v1.54h.04c.38-.72 1.3-1.48 2.68-1.48 2.86 0 3.39 1.88 3.39 4.32V20h-3v-6.06c0-1.45-.03-3.31-2.01-3.31-2.01 0-2.32 1.57-2.32 3.2V20h-3V8.75Z" fill="currentColor"/></svg>',
  Copiar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1Zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H10V7h9v14Z" fill="currentColor"/></svg>',
};

const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getPageUrl = (pageName, slug) => {
  const url = new URL(pageName, window.location.href);
  url.search = '';
  url.hash = '';

  if (slug) {
    url.searchParams.set('song', slug);
  }

  return url.toString();
};

const getIndexUrl = () => getPageUrl('index.html');
const getSongPageUrl = (slug) => getPageUrl('song.html', slug);

const getShareLinks = ({ title, url }) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const whatsappText = encodeURIComponent(`${title}\n${url}`);

  return [
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${whatsappText}`,
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];
};

const copyToClipboard = async (text, feedbackNode) => {
  try {
    await navigator.clipboard.writeText(text);
    feedbackNode.textContent = 'Enlace copiado';
  } catch (error) {
    feedbackNode.textContent = 'No se pudo copiar';
  }

  window.clearTimeout(copyToClipboard.timeoutId);
  copyToClipboard.timeoutId = window.setTimeout(() => {
    feedbackNode.textContent = '';
  }, 1800);
};

const createShareBlock = ({ title, url, compact = false, iconOnly = false }) => {
  const wrapper = document.createElement('div');
  wrapper.className = `share-block${compact ? ' is-compact' : ''}`;

  const label = document.createElement('p');
  label.className = 'share-label';
  label.textContent = 'Compartir';

  const actions = document.createElement('div');
  actions.className = 'share-actions';

  const feedback = document.createElement('span');
  feedback.className = 'share-feedback';
  feedback.setAttribute('aria-live', 'polite');

  const shareLinks = getShareLinks({ title, url }).map((item) => {
    const link = document.createElement('a');
    link.className = 'share-chip';
    link.href = item.href;
    link.target = '_blank';
    link.rel = 'noreferrer noopener';
    if (iconOnly && shareIcons[item.label]) {
      link.innerHTML = shareIcons[item.label];
      link.classList.add('share-chip-icon');
    } else {
      link.textContent = item.label;
    }
    link.setAttribute('aria-label', `Compartir en ${item.label}`);
    return link;
  });

  const copyButton = document.createElement('button');
  copyButton.className = 'share-chip share-copy';
  copyButton.type = 'button';
  if (iconOnly) {
    copyButton.innerHTML = shareIcons.Copiar;
    copyButton.classList.add('share-chip-icon');
    copyButton.setAttribute('aria-label', 'Copiar enlace');
  } else {
    copyButton.textContent = 'Copiar';
  }
  copyButton.addEventListener('click', () => {
    copyToClipboard(url, feedback);
  });

  actions.append(...shareLinks, copyButton);
  wrapper.append(label, actions, feedback);

  return wrapper;
};

const closeSongsMenu = () => {
  if (!songsMenu || !songsMenuToggle || !songsMenuList) {
    return;
  }

  songsMenuToggle.setAttribute('aria-expanded', 'false');
  songsMenuList.hidden = true;
  songsMenu.classList.remove('is-open');
};

const openSongsMenu = () => {
  if (!songsMenu || !songsMenuToggle || !songsMenuList) {
    return;
  }

  songsMenuToggle.setAttribute('aria-expanded', 'true');
  songsMenuList.hidden = false;
  songsMenu.classList.add('is-open');
};

const createSongIframe = (song, options = {}) => {
  const { autoplay = false } = options;
  const iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '140';
  iframe.style.borderRadius = '12px';
  iframe.style.border = '0';
  iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  iframe.loading = 'lazy';
  const iframeUrl = new URL(song.embedUrl);

  if (autoplay) {
    iframeUrl.searchParams.set('autoplay', '1');
  }

  iframe.src = iframeUrl.toString();
  iframe.title = `${song.title} by Dsound-System`;
  return iframe;
};

const createSongNavigator = (previousSong, nextSong) => {
  const nav = document.createElement('nav');
  nav.className = 'song-nav';
  nav.setAttribute('aria-label', 'Navegacion entre canciones');

  const createNavLink = (song, direction, fallbackLabel) => {
    const link = document.createElement('a');
    link.className = `song-nav-link song-nav-link-${direction}`;
    link.href = getSongPageUrl(song.slug);

    const eyebrow = document.createElement('span');
    eyebrow.className = 'song-nav-eyebrow';
    eyebrow.textContent = fallbackLabel;

    const title = document.createElement('span');
    title.className = 'song-nav-title';
    title.textContent = song.title;

    link.append(eyebrow, title);
    return link;
  };

  nav.append(
    createNavLink(previousSong, 'previous', 'Anterior'),
    createNavLink(nextSong, 'next', 'Siguiente')
  );

  return nav;
};

const setupRevealAnimations = () => {
  const revealItems = document.querySelectorAll('.reveal');

  if (!revealItems.length) {
    return;
  }

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

  if (!sections.length || !navLinks.length || pageMode !== 'index') {
    return;
  }

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

const setupSongsMenu = () => {
  if (!songsMenu || !songsMenuToggle || !songsMenuList) {
    return;
  }

  songsMenuToggle.addEventListener('click', () => {
    const isOpen = songsMenuToggle.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      closeSongsMenu();
      return;
    }

    openSongsMenu();
  });

  document.addEventListener('click', (event) => {
    if (!songsMenu.contains(event.target)) {
      closeSongsMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSongsMenu();
      songsMenuToggle.focus();
    }
  });

  songsMenuList.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeSongsMenu();
    }
  });
};

const setupParallaxEffects = () => {
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const heroImageFrame = document.querySelector('.hero-image-frame');
  let ticking = false;

  const updateScrollEffects = () => {
    ticking = false;

    const scrollY = window.scrollY;
    const heroHeight = hero ? Math.max(hero.offsetHeight, 1) : window.innerHeight;
    const progress = Math.min(scrollY / heroHeight, 1.2);

    root.style.setProperty('--scroll-y', `${scrollY}`);
    root.style.setProperty('--hero-progress', progress.toFixed(3));
    document.body.classList.toggle('is-scrolled', scrollY > 16);
  };

  const requestTick = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateScrollEffects);
  };

  updateScrollEffects();
  window.addEventListener('scroll', requestTick, { passive: true });

  if (!heroImageFrame || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  window.addEventListener(
    'mousemove',
    (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      root.style.setProperty('--pointer-x', x.toFixed(3));
      root.style.setProperty('--pointer-y', y.toFixed(3));
    },
    { passive: true }
  );
};

const createSongCard = (song, index, options = {}) => {
  const { selectedSlug = '', isolated = false, totalSongs = 0, previousSong = null, nextSong = null } = options;
  const article = document.createElement('article');
  const delayClass = index === 0 ? '' : ` delay-${Math.min(index, 2)}`;
  article.className = `embed-card song-card reveal${delayClass}${isolated ? ' song-card-detail' : ''}`;
  article.id = `song-${song.slug}`;

  if (song.slug === selectedSlug) {
    article.classList.add('is-selected');
  }

  const shell = document.createElement('div');
  shell.className = 'song-card-shell';

  if (isolated) {
    shell.classList.add('song-card-shell-detail');
  }

  const top = document.createElement('div');
  top.className = 'song-top';

  const title = document.createElement('p');
  title.className = 'song-card-title media-tag';
  title.textContent = song.title;

  const embedFrame = document.createElement('div');
  embedFrame.className = 'embed-frame';
  embedFrame.appendChild(createSongIframe(song, { autoplay: isolated }));

  const shareBlock = createShareBlock({
    title: `${song.title} | Dsound-System`,
    url: getSongPageUrl(song.slug),
    compact: true,
    iconOnly: true,
  });

  if (isolated) {
    const sidebar = document.createElement('aside');
    sidebar.className = 'song-detail-sidebar';

    const body = document.createElement('div');
    body.className = 'song-detail-body';

    sidebar.append(title, shareBlock);

    if (previousSong && nextSong) {
      sidebar.appendChild(createSongNavigator(previousSong, nextSong));
    }

    body.appendChild(embedFrame);
    shell.append(sidebar, body);
  } else {
    top.append(title, embedFrame);
    shell.appendChild(top);
    shell.appendChild(shareBlock);
  }

  if (song.lyrics) {
    const lyrics = document.createElement('pre');
    lyrics.className = 'song-lyrics';
    lyrics.hidden = !isolated;
    lyrics.textContent = song.lyrics;

    if (isolated) {
      article.classList.add('is-expanded');

      const lyricsHeading = document.createElement('p');
      lyricsHeading.className = 'lyrics-heading';
      lyricsHeading.textContent = 'Letra completa';

      shell.querySelector('.song-detail-body')?.append(lyricsHeading, lyrics);
    } else {
      const toggle = document.createElement('button');
      toggle.className = 'button button-secondary lyrics-toggle';
      toggle.type = 'button';
      toggle.textContent = 'Ver letra';
      toggle.setAttribute('aria-expanded', 'false');

      toggle.addEventListener('click', () => {
        const isOpen = !lyrics.hidden;
        lyrics.hidden = isOpen;
        article.classList.toggle('is-expanded', !isOpen);
        toggle.textContent = isOpen ? 'Ver letra' : 'Ocultar letra';
        toggle.setAttribute('aria-expanded', String(!isOpen));
      });

      shell.append(toggle, lyrics);
    }
  }

  article.appendChild(shell);

  return article;
};

const enrichSongs = (data) =>
  [...data.music.songs]
    .map((song) => ({
      ...song,
      slug: slugify(song.title),
    }))
    .sort((a, b) => {
      const aOrder = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
      const bOrder = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      return a.title.localeCompare(b.title);
    });

const renderMenuLinks = (songs, selectedSlug) => {
  if (!songsMenuList) {
    return;
  }

  songsMenuList.replaceChildren(
    ...songs.map((song) => {
      const link = document.createElement('a');
      link.className = 'songs-menu-link';
      link.href = getSongPageUrl(song.slug);
      link.textContent = song.title;

      if (song.slug === selectedSlug) {
        link.classList.add('is-active');
      }

      return link;
    })
  );
};

const populateIndexPage = (data, songs) => {
  document.title = data.site.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', data.site.description);
  document.getElementById('hero-eyebrow').textContent = data.hero.eyebrow;
  document.getElementById('hero-title').textContent = data.hero.title;
  document.getElementById('hero-text').textContent = data.hero.text;
  heroMeta?.replaceChildren();

  const primaryCta = document.getElementById('hero-primary-cta');
  primaryCta.textContent = data.hero.primaryCta.label;
  primaryCta.href = data.hero.primaryCta.href;

  if (heroShare) {
    heroShare.replaceChildren(
      createShareBlock({
        title: `${data.site.brand} | DS Sound Dub`,
        url: getIndexUrl(),
      })
    );
  }

  document.getElementById('music-eyebrow').textContent = data.music.eyebrow;
  if (musicTitle) {
    musicTitle.textContent = '';
  }
  if (musicIntro) {
    musicIntro.textContent = '';
  }

  const songsGrid = document.getElementById('songs-grid');
  songsGrid.replaceChildren(...songs.map((song, index) => createSongCard(song, index, { totalSongs: songs.length })));
  renderMenuLinks(songs, '');
};

const populateSongPage = (data, songs) => {
  const selectedSlug = new URLSearchParams(window.location.search).get('song') || songs[0]?.slug;
  const selectedSong = songs.find((song) => song.slug === selectedSlug) || songs[0];

  document.title = `${selectedSong.title} | Dsound-System`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', `${selectedSong.title}. ${data.music.intro}`);

  const songsGrid = document.getElementById('songs-grid');
  const selectedIndex = songs.indexOf(selectedSong);
  const previousSong = songs[(selectedIndex - 1 + songs.length) % songs.length];
  const nextSong = songs[(selectedIndex + 1) % songs.length];

  songsGrid.replaceChildren(
    createSongCard(selectedSong, selectedIndex, {
      selectedSlug: selectedSong.slug,
      isolated: true,
      totalSongs: songs.length,
      previousSong,
      nextSong,
    })
  );
  renderMenuLinks(songs, selectedSong.slug);
};

const populatePage = (data) => {
  const songs = enrichSongs(data);

  if (pageMode === 'song') {
    populateSongPage(data, songs);
    return;
  }

  populateIndexPage(data, songs);
};

const renderErrorState = () => {
  const songsGrid = document.getElementById('songs-grid');

  if (!songsGrid) {
    return;
  }

  songsGrid.innerHTML = `
    <article class="embed-card song-card reveal is-visible">
      <span class="media-tag">Error</span>
      <h3>No se pudo cargar el contenido</h3>
      <p>Arranca la web con un servidor local para que el navegador pueda leer <code>data.json</code>.</p>
    </article>
  `;
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
    setupSongsMenu();
    setupParallaxEffects();
  } catch (error) {
    console.error(error);
    renderErrorState();
  }
};

init();
