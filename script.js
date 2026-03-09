/* ===== DATA ===== */
const songs = [
  {
    title: "What You Want",
    artist: "CORTIS",
    file: "WhatYouWant.mp3",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUMVhaQmgJHo7p2UfoSJwSOUkgM2JCUFBl3Q&s"
  },
  {
    title: "Song of the Stars",
    artist: "TOMORROW X TOGETHER",
    file: "SongoftheStars.mp3",
    cover: "https://upload.wikimedia.org/wikipedia/id/c/c4/Tomorrow_X_Together_-_The_Star_Chapter_Together.png"
  },
  {
    title: "Dynamite",
    artist: "BTS",
    file: "Dynamite.mp3",
    cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/BTS_Dynamite_%28NightTime_Version%29.svg/500px-BTS_Dynamite_%28NightTime_Version%29.svg.png"
  },
  {
    title: "Deja Vu",
    artist: "TOMORROW X TOGETHER",
    file: "DejaVu.mp3",
    cover: "https://upload.wikimedia.org/wikipedia/id/e/ea/TXT_-_Minisode_3_Tomorrow.png"
  },
  {
    title: "Butter",
    artist: "BTS",
    file: "Butter.m4a",
    cover: "https://upload.wikimedia.org/wikipedia/en/d/db/BTS_-_Butter.png"
  },
  {
    title: "Lights",
    artist: "BTS",
    file: "Lights.m4a",
    cover: "https://t2.genius.com/unsafe/387x387/https%3A%2F%2Fimages.genius.com%2F652e45bc76841bc9fa933df382187149.593x593x1.jpg"
  },
  {
    title: "0X1=LOVESONG",
    artist: "TOMORROW X TOGETHER",
    file: "0X1LOVESONG.m4a",
    cover: "https://upload.wikimedia.org/wikipedia/id/6/6a/The_Chaos_Chapter_-_Freeze.png"
  },
  {
    title: "JoyRide",
    artist: "CORTIS",
    file: "JoyRide.m4a",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUMVhaQmgJHo7p2UfoSJwSOUkgM2JCUFBl3Q&s"
  },
  {
    title: "FaSHioN",
    artist: "CORTIS",
    file: "FaSHioN.m4a",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUMVhaQmgJHo7p2UfoSJwSOUkgM2JCUFBl3Q&s"
  }
];

/* ===== STATE ===== */
let currentSong = -1;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let isMuted = false;
let likedSongs = new Set();
let recentlyPlayed = [];
let filteredSongs = [...songs];
let featuredIndex = 0;

/* ===== ELEMENTS ===== */
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const progress = document.getElementById("progress");
const progressFill = document.getElementById("progressFill");
const progressThumb = document.getElementById("progressThumb");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playerThumb = document.getElementById("playerThumb");
const playerLikeBtn = document.getElementById("playerLikeBtn");
const volumeInput = document.getElementById("volume");
const volumeFill = document.getElementById("volumeFill");
const volIcon = document.getElementById("volIcon");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const featuredTitle = document.getElementById("featuredTitle");
const featuredArtist = document.getElementById("featuredArtist");
const featuredCover = document.getElementById("featuredCover");
const featuredBg = document.getElementById("featuredBg");
const featuredLikeBtn = document.getElementById("featuredLikeBtn");
const songContainer = document.getElementById("songs");
const recentListEl = document.getElementById("recentList");

/* ===== INIT ===== */
function init() {
  setFeatured(0);
  renderSongs(songs);
  renderRecent();

  audio.volume = 0.8;
  volumeInput.value = 80;

  audio.addEventListener("timeupdate", onTimeUpdate);
  audio.addEventListener("ended", onEnded);
  audio.addEventListener("loadedmetadata", onMetadata);
  progress.addEventListener("input", onProgressInput);
  volumeInput.addEventListener("input", onVolumeInput);
}

/* ===== FEATURED ===== */
function setFeatured(index) {
  featuredIndex = index;
  const song = songs[index];

  featuredTitle.textContent = song.title;
  featuredArtist.textContent = song.artist;

  featuredCover.innerHTML = "";
  const img = document.createElement("img");
  img.src = song.cover;
  img.alt = song.title;
  img.onerror = () => { featuredCover.innerHTML = '<div class="cover-placeholder">🎵</div>'; };
  featuredCover.appendChild(img);

  featuredBg.style.backgroundImage = `url(${song.cover})`;

  updateFeaturedLike();
}

function playFeatured() {
  playSong(featuredIndex);
}

/* ===== RENDER SONGS ===== */
function renderSongs(list) {
  songContainer.innerHTML = "";
  list.forEach((song, i) => {
    const realIndex = songs.indexOf(song);
    const card = document.createElement("div");
    card.className = "song-card" + (realIndex === currentSong ? " playing" : "") + (likedSongs.has(realIndex) ? " liked" : "");
    card.id = `card-${realIndex}`;

    card.innerHTML = `
      <div class="card-img">
        <img src="${song.cover}" alt="${song.title}" onerror="this.style.display='none'">
        <button class="card-play-btn" onclick="event.stopPropagation(); playSong(${realIndex})">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
      <div class="card-liked-badge">♥</div>
      <div class="card-title">${song.title}</div>
      <div class="card-artist">${song.artist}</div>
    `;

    card.addEventListener("click", () => {
      setFeatured(realIndex);
      playSong(realIndex);
    });

    card.addEventListener("mouseenter", () => {
      if (realIndex !== currentSong) setFeatured(realIndex);
    });

    card.addEventListener("mouseleave", () => {
      setFeatured(currentSong >= 0 ? currentSong : 0);
    });

    songContainer.appendChild(card);
  });
}

/* ===== RENDER RECENT ===== */
function renderRecent() {
  recentListEl.innerHTML = "";
  const list = recentlyPlayed.length > 0 ? recentlyPlayed.slice(0, 6) : songs.slice(0, 6);
  list.forEach((index, i) => {
    const song = songs[index] || songs[i];
    const realIndex = typeof index === "number" ? index : i;

    const item = document.createElement("div");
    item.className = "recent-item" + (realIndex === currentSong ? " playing" : "");
    item.id = `recent-${realIndex}`;

    item.innerHTML = `
      <div class="recent-num">${realIndex === currentSong ? "♫" : i + 1}</div>
      <div class="recent-thumb">
        <img src="${songs[realIndex].cover}" alt="${songs[realIndex].title}" onerror="this.style.display='none'">
      </div>
      <div class="recent-info">
        <div class="recent-title">${songs[realIndex].title}</div>
        <div class="recent-artist">${songs[realIndex].artist}</div>
      </div>
      <div class="recent-duration" id="dur-${realIndex}">—</div>
      <button class="recent-play" onclick="event.stopPropagation(); playSong(${realIndex})">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"/></svg>
      </button>
    `;

    item.addEventListener("click", () => playSong(realIndex));
    recentListEl.appendChild(item);
  });
}

/* ===== PLAY SONG ===== */
function playSong(index) {
  if (index < 0 || index >= songs.length) return;

  // Remove playing state from previous
  const prevCard = document.getElementById(`card-${currentSong}`);
  if (prevCard) prevCard.classList.remove("playing");
  const prevRecent = document.getElementById(`recent-${currentSong}`);
  if (prevRecent) prevRecent.classList.remove("playing");

  currentSong = index;
  const song = songs[index];

  audio.src = song.file;
  audio.play().catch(() => {});
  isPlaying = true;

  // Update player bar
  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;

  playerThumb.innerHTML = "";
  const img = document.createElement("img");
  img.src = song.cover;
  img.alt = song.title;
  img.onerror = () => { playerThumb.innerHTML = '<div class="thumb-placeholder">🎵</div>'; };
  playerThumb.appendChild(img);

  updatePlayIcon();
  updatePlayerLike();
  setFeatured(index);

  // Add playing state
  const card = document.getElementById(`card-${index}`);
  if (card) card.classList.add("playing");

  // Update recently played
  recentlyPlayed = recentlyPlayed.filter(i => i !== index);
  recentlyPlayed.unshift(index);
  if (recentlyPlayed.length > 6) recentlyPlayed.pop();
  renderRecent();

  // Title blink in document
  document.title = `♫ ${song.title} — Melodify`;
}

/* ===== PLAY / PAUSE ===== */
function playPause() {
  if (currentSong < 0) {
    playSong(0);
    return;
  }
  if (audio.paused) {
    audio.play().catch(() => {});
    isPlaying = true;
  } else {
    audio.pause();
    isPlaying = false;
  }
  updatePlayIcon();
}

function updatePlayIcon() {
  if (!audio.paused) {
    playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
  } else {
    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
  }
}

/* ===== NEXT / PREV ===== */
function nextSong() {
  let next;
  if (isShuffle) {
    next = Math.floor(Math.random() * songs.length);
  } else {
    next = (currentSong + 1) % songs.length;
  }
  playSong(next);
}

function prevSong() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  let prev = (currentSong - 1 + songs.length) % songs.length;
  playSong(prev);
}

/* ===== EVENTS ===== */
function onEnded() {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextSong();
  }
}

function onTimeUpdate() {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progress.value = pct;
  progressFill.style.width = pct + "%";
  progressThumb.style.left = pct + "%";
  currentTimeEl.textContent = formatTime(audio.currentTime);
}

function onMetadata() {
  durationEl.textContent = formatTime(audio.duration);
  // Try to update duration in recent list
  const durEl = document.getElementById(`dur-${currentSong}`);
  if (durEl) durEl.textContent = formatTime(audio.duration);
}

function onProgressInput() {
  if (!audio.duration) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
}

function onVolumeInput() {
  const val = volumeInput.value;
  audio.volume = val / 100;
  volumeFill.style.width = val + "%";
  isMuted = val == 0;
  updateVolIcon();
}

/* ===== VOLUME ===== */
function toggleMute() {
  isMuted = !isMuted;
  audio.muted = isMuted;
  updateVolIcon();
}

function updateVolIcon() {
  if (isMuted || audio.volume === 0) {
    volIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
  } else if (audio.volume < 0.5) {
    volIcon.innerHTML = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
  } else {
    volIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
  }
}

/* ===== SHUFFLE & REPEAT ===== */
function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
}

/* ===== LIKE ===== */
function toggleLike(index) {
  const i = index < 0 ? featuredIndex : index;
  if (likedSongs.has(i)) {
    likedSongs.delete(i);
  } else {
    likedSongs.add(i);
  }
  updatePlayerLike();
  updateFeaturedLike();
  const card = document.getElementById(`card-${i}`);
  if (card) card.classList.toggle("liked", likedSongs.has(i));
}

function updatePlayerLike() {
  playerLikeBtn.classList.toggle("liked", likedSongs.has(currentSong));
}

function updateFeaturedLike() {
  featuredLikeBtn.classList.toggle("liked", likedSongs.has(featuredIndex));
}

/* ===== SEARCH ===== */
function filterSongs() {
  const q = document.getElementById("searchInput").value.toLowerCase().trim();
  filteredSongs = q
    ? songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q))
    : [...songs];
  renderSongs(filteredSongs);
}

/* ===== HELPERS ===== */
function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ===== START ===== */
init();

