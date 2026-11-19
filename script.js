document.documentElement.classList.add('js');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const openButton = document.getElementById('open-invitation');
const invitationContent = document.getElementById('invitation-content');
const siteHeader = document.querySelector('header');
const siteFooter = document.querySelector('footer');
const siteMain = document.querySelector('main');
const cardCover = document.getElementById('card-cover');
const ribbonButton = document.getElementById('untie-ribbon');
const backgroundMusic = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');
siteMain.inert = true;
ribbonButton.focus({ preventScroll: true });

backgroundMusic.volume = 0.28;
function updateMusicControl(isPlaying) {
  musicToggle.hidden = false;
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
  musicToggle.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
  musicToggle.querySelector('b').textContent = isPlaying ? 'Pause music' : 'Play music';
}

function playBackgroundMusic() {
  backgroundMusic.play().then(() => updateMusicControl(true)).catch(() => updateMusicControl(false));
}

musicToggle.addEventListener('click', () => {
  if (backgroundMusic.paused) playBackgroundMusic();
  else {
    backgroundMusic.pause();
    updateMusicControl(false);
  }
});

ribbonButton.addEventListener('click', () => {
  const openDelay = reducedMotion.matches ? 0 : 1050;
  playBackgroundMusic();
  ribbonButton.disabled = true;
  cardCover.classList.add('untying');
  window.setTimeout(() => {
    cardCover.hidden = true;
    document.body.classList.remove('card-closed');
    siteMain.inert = false;
    openButton.focus({ preventScroll: true });
  }, openDelay);
});

openButton.addEventListener('click', () => {
  openButton.disabled = true;
  openButton.setAttribute('aria-expanded', 'true');
  invitationContent.hidden = false;
  siteFooter.hidden = false;
  siteHeader.removeAttribute('aria-hidden');
  document.body.classList.remove('invitation-locked');
  requestAnimationFrame(() => document.getElementById('invitation').scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' }));
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
if (!reducedMotion.matches) {
  const petals = document.querySelector('.petals');
  for (let i=0; i<12; i++) {
    const petal = document.createElement('span'); petal.className='petal';
    petal.style.left=`${(i*17+7)%100}%`;petal.style.animationDuration=`${12+i%5*2}s`;petal.style.animationDelay=`${-i*2.7}s`;
    petals.appendChild(petal);
  }
}
const weddingDate = new Date('2026-12-24T10:30:00+05:30').getTime();
function updateCountdown() {
  const remaining = Math.max(0, Math.floor((weddingDate-Date.now())/1000));
  const values = {days:Math.floor(remaining/86400), hours:Math.floor(remaining/3600)%24, minutes:Math.floor(remaining/60)%60, seconds:remaining%60};
  Object.entries(values).forEach(([id,value]) => {document.getElementById(id).textContent=String(value).padStart(2,'0');});
}
updateCountdown();setInterval(updateCountdown,1000);

const rsvpForm = document.getElementById('rsvp-form');
rsvpForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = rsvpForm.elements.name.value.trim();
  const count = rsvpForm.elements.count.value;
  document.getElementById('rsvp-status').textContent = `Thank you, ${name}. Your RSVP for ${count} ${count === '1' ? 'guest' : 'guests'} has been noted.`;
  rsvpForm.querySelector('button').textContent = 'RSVP received';
  rsvpForm.querySelector('button').disabled = true;
});
