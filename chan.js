(() => {
  'use strict';

  const screens = Array.from(document.querySelectorAll('.screen'));
  const progressCount = document.getElementById('progress-count');
  const progressTrack = document.getElementById('progress-track');
  const progressFill = document.getElementById('progress-fill');
  const backButton = document.getElementById('back-button');
  const announcement = document.getElementById('screen-announcement');
  const cakeIllustration = document.getElementById('cake-illustration');
  const cakeAction = document.getElementById('cake-action');
  const cakeActionLabel = document.getElementById('cake-action-label');
  const cakeActionEmoji = document.getElementById('cake-action-emoji');
  const relightButton = document.getElementById('relight-candle');
  const cakeTitle = document.getElementById('cake-title');
  const cakeCopy = document.getElementById('cake-copy');
  const openEnvelopeButton = document.getElementById('open-envelope');
  const envelopeArt = document.querySelector('.envelope-art');
  const envelopeAction = document.getElementById('envelope-action');
  const memoryGallery = document.getElementById('memory-gallery');
  const memoryUpload = document.getElementById('memory-upload');
  const uploadHint = document.getElementById('upload-hint');
  const photoDialog = document.getElementById('photo-dialog');
  const dialogImage = document.getElementById('dialog-image');
  const dialogCaption = document.getElementById('dialog-caption');
  const dialogClose = document.getElementById('dialog-close');

  let currentStep = 1;
  let candleBlown = false;
  let envelopeIsOpening = false;
  const localPhotoUrls = [];

  const stepNames = [
    'A Gift For You',
    'Birthday cake',
    'The envelope',
    'Your letter',
    'Memory recap'
  ];

  function showStep(step, direction = 'forward') {
    const nextStep = Math.min(Math.max(step, 1), screens.length);
    if (nextStep === currentStep) return;

    const outgoing = screens[currentStep - 1];
    const incoming = screens[nextStep - 1];
    outgoing.classList.remove('is-active');
    outgoing.setAttribute('aria-hidden', 'true');
    outgoing.hidden = true;

    incoming.hidden = false;
    incoming.setAttribute('aria-hidden', 'false');
    incoming.classList.remove('is-active');
    // Restart the short scene entrance animation on repeat visits.
    void incoming.offsetWidth;
    incoming.classList.add('is-active');

    currentStep = nextStep;
    const count = String(currentStep).padStart(2, '0');
    progressCount.innerHTML = `${count} <i>/</i> 05`;
    progressTrack.setAttribute('aria-valuenow', String(currentStep));
    progressFill.style.width = `${(currentStep / screens.length) * 100}%`;
    backButton.hidden = currentStep === 1;
    announcement.textContent = `${stepNames[currentStep - 1]}, step ${currentStep} of ${screens.length}.`;

    const heading = incoming.querySelector('h1, h2');
    if (heading) heading.setAttribute('tabindex', '-1');
    window.setTimeout(() => heading?.focus({ preventScroll: true }), 80);
    if (direction === 'forward') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('open-gift').addEventListener('click', () => showStep(2));
  backButton.addEventListener('click', () => showStep(currentStep - 1, 'back'));

  function celebrateCake() {
    if (candleBlown) {
      showStep(3);
      return;
    }

    candleBlown = true;
    cakeIllustration.classList.add('is-blown');
    cakeIllustration.setAttribute('aria-label', 'A blue birthday cake with its candle blown out');
    cakeTitle.textContent = 'Happy Birthday, Chan Chan! 🎂';
    cakeCopy.textContent = 'May your year be full of bright little moments, big laughs, and wonderful surprises.';
    cakeActionLabel.textContent = 'Continue to your letter';
    cakeActionEmoji.textContent = '💌';
    relightButton.hidden = false;
    launchConfetti();
  }

  cakeAction.addEventListener('click', celebrateCake);
  relightButton.addEventListener('click', () => {
    candleBlown = false;
    cakeIllustration.classList.remove('is-blown');
    cakeIllustration.setAttribute('aria-label', 'A bright blue birthday cake with a candle burning');
    cakeTitle.textContent = 'Make a wish, Champ…';
    cakeCopy.textContent = 'Take a breath, think of something wonderful, then blow out your candle.';
    cakeActionLabel.textContent = 'Blow the Candle';
    cakeActionEmoji.textContent = '💨';
    relightButton.hidden = true;
  });

  function openEnvelope() {
    if (envelopeIsOpening) return;
    envelopeIsOpening = true;
    openEnvelopeButton.setAttribute('aria-expanded', 'true');
    envelopeArt.classList.add('is-opening');
    window.setTimeout(() => {
      showStep(4);
      envelopeIsOpening = false;
    }, 720);
  }

  openEnvelopeButton.addEventListener('click', openEnvelope);
  envelopeAction.addEventListener('click', openEnvelope);
  document.getElementById('letter-next').addEventListener('click', () => showStep(5));
  document.getElementById('restart-story').addEventListener('click', () => {
    candleBlown = false;
    cakeIllustration.classList.remove('is-blown');
    cakeIllustration.setAttribute('aria-label', 'A bright blue birthday cake with a candle burning');
    cakeTitle.textContent = 'Make a wish, Champ…';
    cakeCopy.textContent = 'Take a breath, think of something wonderful, then blow out your candle.';
    cakeActionLabel.textContent = 'Blow the Candle';
    cakeActionEmoji.textContent = '💨';
    relightButton.hidden = true;
    envelopeIsOpening = false;
    openEnvelopeButton.setAttribute('aria-expanded', 'false');
    envelopeArt.classList.remove('is-opening');
    showStep(1, 'back');
  });

  function launchConfetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#1ba6d5', '#ffd75e', '#ff8998', '#6ccde7', '#6d86dc'];
    const layer = document.createElement('div');
    layer.className = 'confetti-layer';
    layer.setAttribute('aria-hidden', 'true');
    Object.assign(layer.style, {
      position: 'fixed', inset: '0', zIndex: '30', pointerEvents: 'none', overflow: 'hidden'
    });
    for (let i = 0; i < 34; i += 1) {
      const piece = document.createElement('i');
      const size = 5 + Math.random() * 8;
      Object.assign(piece.style, {
        position: 'absolute', left: `${Math.random() * 100}%`, top: '-14px',
        width: `${size}px`, height: `${size * (1.2 + Math.random())}px`,
        borderRadius: Math.random() > .5 ? '50%' : '2px',
        background: colors[i % colors.length],
        opacity: String(.65 + Math.random() * .35),
        transform: `rotate(${Math.random() * 180}deg)`,
        animation: `confetti-fall ${2.2 + Math.random() * 1.8}s ${Math.random() * .45}s ease-in forwards`
      });
      layer.appendChild(piece);
    }
    document.body.appendChild(layer);
    window.setTimeout(() => layer.remove(), 4700);
  }

  const confettiStyle = document.createElement('style');
  confettiStyle.textContent = '@keyframes confetti-fall { to { transform: translate3d(24px, 105vh, 0) rotate(620deg); opacity: 0; } }';
  document.head.appendChild(confettiStyle);

  memoryUpload.addEventListener('change', (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'));
    if (!files.length) return;

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      localPhotoUrls.push(url);
      const card = document.createElement('figure');
      card.className = 'memory-card user-memory';
      const photoButton = document.createElement('button');
      photoButton.type = 'button';
      photoButton.className = 'memory-photo';
      photoButton.setAttribute('aria-label', `View added memory: ${file.name}`);
      const img = document.createElement('img');
      img.src = url;
      img.alt = `Added birthday memory: ${file.name}`;
      const number = document.createElement('span');
      number.className = 'photo-number';
      number.setAttribute('aria-hidden', 'true');
      number.textContent = String(memoryGallery.children.length + 1).padStart(2, '0');
      photoButton.append(img, number);
      const caption = document.createElement('figcaption');
      caption.textContent = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ') || 'A favorite memory';
      card.append(photoButton, caption);
      memoryGallery.appendChild(card);
    });

    uploadHint.textContent = `${files.length} photo${files.length === 1 ? '' : 's'} added for this visit. Your pictures stay in this browser.`;
    event.target.value = '';
  });

  memoryGallery.addEventListener('click', (event) => {
    const button = event.target.closest('.memory-photo');
    if (!button) return;
    const img = button.querySelector('img');
    const caption = button.closest('.memory-card')?.querySelector('figcaption')?.textContent.trim() || img.alt;
    dialogImage.src = img.src;
    dialogImage.alt = img.alt;
    dialogCaption.textContent = caption;
    photoDialog.showModal();
  });

  function closePhotoDialog() {
    if (photoDialog.open) photoDialog.close();
  }
  dialogClose.addEventListener('click', closePhotoDialog);
  photoDialog.addEventListener('click', (event) => {
    if (event.target === photoDialog) closePhotoDialog();
  });
  photoDialog.addEventListener('close', () => {
    dialogImage.src = '';
  });

  window.addEventListener('beforeunload', () => {
    localPhotoUrls.forEach((url) => URL.revokeObjectURL(url));
  });

 

})();
