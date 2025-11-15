let songs = [
  {
    songTitle: "Radha-Jale",
    songName: " Radha kaise na jale ~ lofi bits",
    fileName: "songs/Radha_jale.mp3",
    coverName: "song_banner/govind-radhe.jpg",
  },
  {
    songTitle: "Radhe-sham",
    songName: " Govind Radhe Radhe sham ~ lofi bits",
    fileName: "songs/radhe_sham.mp3",
    coverName: "song_banner/krishna1.jpg",
  },
  {
    songTitle: "Radha Rani",
    songName: "Radha Rani Lage ~ bass reaxed.",
    fileName: "songs/radha_rani.mp3",
    coverName: "song_banner/radha1.png",
  },
  {
    songTitle: "Hanuman Chalisa",
    songName: "Hanuman-Chalisa ~ bas boosted",
    fileName: "songs/hanuman_chalisa.mp3",
    coverName: "song_banner/hanumana1.jpg",
  },
  {
    songTitle: "Ham Katha Sunate",
    songName: "Ham katha sunate ram shakal gun dham ki ....",
    fileName: "songs/ham_katha_sunate.mp3",
    coverName: "song_banner/rama2.jpg",
  },
  {
    songTitle: "Aarambh Hei Prachand",
    songName: "Aarambh hei Prachand ~ Bass Boosted..",
    fileName: "songs/aarambh_he_prachand.mp3",
    coverName: "song_banner/rama3.jpg",
  },
  {
    songTitle: "Hey Raam",
    songName: "Hey Raam (Female Version) ",
    fileName: "songs/Hey_Ram(female).mp3",
    coverName: "song_banner/raam-siya1.jpg",
  },
  {
    songTitle: "Hey Raam",
    songName: "Hey Raam (Male Version) ",
    fileName: "songs/Hey_Ram(male).mp3",
    coverName: "song_banner/rama4.jpg",
  },
  {
    songTitle: "Namo Namo",
    songName: "Namo Namo ji shankara (Kedarnath)",
    fileName: "songs/namo_namo.mp3",
    coverName: "song_banner/shiva1.jpg",
  },
  {
    songTitle: "Kahani Karn ki",
    songName: "My Favourite",
    fileName: "songs/Kahani_Karn_ki.mp3",
    coverName: "song_banner/karna1.png",
  },
  {
    songTitle: "Raam Siya Raam",
    songName: "Mangal Bhavan... Amangal Haari..",
    fileName: "songs/Ram_Siya_Ram.mp3",
    coverName: "song_banner/rama1.jpg",
  },
  {
    songTitle: "Raam Siya Raam",
    songName: "Mangal Bhavan... Amangal Haari..",
    fileName: "songs/Ram_Siya_Ram.mp3",
    coverName: "song_banner/rama1.jpg",
  },
];

// DOM Elements
let masterPlay = document.getElementById("masterPlay");
const nav = document.querySelector(".navbar");
let songLoader = document.getElementById("songLoader");
let songGif = document.getElementById("songGif");
let songItems = document.getElementsByClassName("songItem");
let playThis = document.getElementsByClassName("playThis");
let currentPlayingSong = document.getElementById("currentPlayingSong");
let currentTimeDisplay = document.getElementById("currentTime");
let totalTimeDisplay = document.getElementById("totalTime");
let volumeSlider = document.getElementById("volumeSlider");
let volumeBtn = document.getElementById("volumeBtn");
let autoPlayToggle = document.getElementById("autoPlayToggle");
let shuffleBtn = document.getElementById("shuffleBtn");
let repeatBtn = document.getElementById("repeatBtn");
let songIndex = 1;
let isPlaying = false;
let isAutoPlay = true;
let isShuffle = false;
let repeatMode = 0; // 0: off, 1: all, 2: one
let shuffledIndices = [];
let audioContext = null;
let analyser = null;
let dataArray = null;
let animationFrameId = null;

// Initialize audio
var audioElement = new Audio("songs/radhe_sham.mp3");
audioElement.volume = 0.7;

// Load preferences and initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadUserPreferences();
  
  // Try to resume last played song
  setTimeout(() => {
    if (!resumeLastPlayed()) {
      // If no resume, load default song
      if (currentPlayingSong) {
        currentPlayingSong.innerText = songs[songIndex - 1].songTitle;
      }
      const playerCover = document.getElementById("playerCover");
      if (playerCover) {
        playerCover.src = songs[songIndex - 1].coverName;
      }
    }
  }, 200);
});

// Initialize Web Audio API for rhythm visualization
function initAudioContext() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audioElement);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  } catch (e) {
    console.log("Web Audio API not supported");
  }
}

// Initialize shuffled indices
function initShuffledIndices() {
  shuffledIndices = Array.from({ length: songs.length }, (_, i) => i + 1);
  for (let i = shuffledIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
  }
}
initShuffledIndices();

// ==================== LOCALSTORAGE MANAGEMENT ====================
const STORAGE_KEYS = {
  PREFERENCES: 'mfocus_preferences',
  PLAYBACK_HISTORY: 'mfocus_history',
  LAST_PLAYED: 'mfocus_last_played',
  FAVORITES: 'mfocus_favorites',
  PLAY_COUNTS: 'mfocus_play_counts'
};

// Load user preferences from localStorage
function loadUserPreferences() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (saved) {
      const prefs = JSON.parse(saved);
      isAutoPlay = prefs.autoPlay !== undefined ? prefs.autoPlay : true;
      isShuffle = prefs.shuffle !== undefined ? prefs.shuffle : false;
      repeatMode = prefs.repeatMode !== undefined ? prefs.repeatMode : 0;
      if (prefs.volume !== undefined) {
        audioElement.volume = prefs.volume;
        if (volumeSlider) volumeSlider.value = prefs.volume * 100;
        updateVolumeIcon(prefs.volume * 100);
      }
      
      // Update UI
      if (autoPlayToggle) {
        autoPlayToggle.classList.toggle("active", isAutoPlay);
        const icon = autoPlayToggle.querySelector("i");
        icon.className = isAutoPlay ? "fas fa-forward" : "fas fa-pause";
      }
      if (shuffleBtn) {
        shuffleBtn.classList.toggle("active", isShuffle);
        if (isShuffle) initShuffledIndices();
      }
      if (repeatBtn) {
        repeatBtn.classList.toggle("active", repeatMode > 0);
        const icon = repeatBtn.querySelector("i");
        if (repeatMode === 0) {
          icon.className = "fas fa-redo";
          icon.style.opacity = "0.6";
        } else if (repeatMode === 1) {
          icon.className = "fas fa-redo";
          icon.style.opacity = "1";
        } else {
          icon.className = "fas fa-redo-alt";
          icon.style.opacity = "1";
        }
      }
    }
  } catch (e) {
    console.log("Error loading preferences:", e);
  }
}

// Save user preferences to localStorage
function saveUserPreferences() {
  try {
    const prefs = {
      autoPlay: isAutoPlay,
      shuffle: isShuffle,
      repeatMode: repeatMode,
      volume: audioElement.volume,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (e) {
    console.log("Error saving preferences:", e);
  }
}

// Add song to playback history
function addToHistory(songIndex) {
  try {
    let history = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYBACK_HISTORY) || '[]');
    const songData = {
      index: songIndex,
      title: songs[songIndex - 1].songTitle,
      timestamp: Date.now()
    };
    
    // Remove if already exists (to avoid duplicates)
    history = history.filter(item => item.index !== songIndex);
    // Add to beginning
    history.unshift(songData);
    // Keep only last 50 songs
    history = history.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEYS.PLAYBACK_HISTORY, JSON.stringify(history));
    
    // Update play count
    updatePlayCount(songIndex);
  } catch (e) {
    console.log("Error saving history:", e);
  }
}

// Update play count for a song
function updatePlayCount(songIndex) {
  try {
    let playCounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAY_COUNTS) || '{}');
    playCounts[songIndex] = (playCounts[songIndex] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.PLAY_COUNTS, JSON.stringify(playCounts));
  } catch (e) {
    console.log("Error updating play count:", e);
  }
}

// Get most played songs
function getMostPlayedSongs(limit = 5) {
  try {
    const playCounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAY_COUNTS) || '{}');
    return Object.entries(playCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([index]) => parseInt(index));
  } catch (e) {
    return [];
  }
}

// Save last played song and position
function saveLastPlayed() {
  try {
    const lastPlayed = {
      songIndex: songIndex,
      currentTime: audioElement.currentTime,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.LAST_PLAYED, JSON.stringify(lastPlayed));
  } catch (e) {
    console.log("Error saving last played:", e);
  }
}

// Load and resume last played song
function resumeLastPlayed() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
    if (saved) {
      const lastPlayed = JSON.parse(saved);
      // Only resume if it was played in last 24 hours
      const hoursSince = (Date.now() - lastPlayed.timestamp) / (1000 * 60 * 60);
      if (hoursSince < 24 && lastPlayed.songIndex >= 1 && lastPlayed.songIndex <= songs.length) {
        songIndex = lastPlayed.songIndex;
        const shouldResume = lastPlayed.currentTime > 5;
        loadSong(songIndex, shouldResume);
        // Resume from saved position if > 5 seconds
        if (shouldResume) {
          audioElement.addEventListener('loadeddata', () => {
            audioElement.currentTime = lastPlayed.currentTime;
          }, { once: true });
        }
        return true;
      }
    }
  } catch (e) {
    console.log("Error resuming last played:", e);
  }
  return false;
}

// Auto-save playback position periodically
setInterval(() => {
  if (!audioElement.paused && audioElement.currentTime > 0) {
    saveLastPlayed();
  }
}, 5000); // Save every 5 seconds

// Navbar scroll effect
window.addEventListener("scroll", function () {
  let navHeight = nav.getBoundingClientRect().height;
  let scrollHeight = this.window.pageYOffset;
  if (scrollHeight > navHeight) {
    nav.classList.add("fixedNav");
  } else {
    nav.classList.remove("fixedNav");
  }
});

// Put data into cards
for (let i = 0; i < songItems.length; i++) {
  if (i < songs.length) {
    const element = songItems[i];
    element.getElementsByTagName("img")[0].src = songs[i].coverName;
    element.getElementsByTagName("h2")[0].innerText = songs[i].songTitle;
    element.getElementsByTagName("p")[0].innerText = songs[i].songName;
  }
}

// Update play/pause button state
function updatePlayPauseState(playing) {
  isPlaying = playing;
  if (playing) {
    masterPlay.classList.add("playing");
    if (songGif) {
      songGif.classList.add("playing");
      startRhythmVisualization();
    }
  } else {
    masterPlay.classList.remove("playing");
    if (songGif) {
      songGif.classList.remove("playing");
      stopRhythmVisualization();
    }
  }
}

// Rhythm visualization based on audio frequency
function startRhythmVisualization() {
  if (!analyser) {
    initAudioContext();
  }
  if (!analyser) return;
  
  function animate() {
    if (!audioElement || audioElement.paused) {
      stopRhythmVisualization();
      return;
    }
    
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const intensity = average / 255;
    
    if (songGif) {
      const scale = 1 + intensity * 0.3;
      const rotation = Date.now() * 0.1 * (1 + intensity);
      songGif.style.transform = `rotate(${rotation}deg) scale(${scale})`;
      songGif.style.filter = `brightness(${1 + intensity * 0.5})`;
    }
    
    animationFrameId = requestAnimationFrame(animate);
  }
  
  animate();
}

function stopRhythmVisualization() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (songGif) {
    songGif.style.transform = "";
    songGif.style.filter = "";
  }
}

// Format time in MM:SS
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Update time displays
function updateTimeDisplay() {
  if (currentTimeDisplay) {
    currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
  }
  if (totalTimeDisplay && audioElement.duration) {
    totalTimeDisplay.textContent = formatTime(audioElement.duration);
  }
}

// Load and play song
function loadSong(index, preserveTime = false) {
  if (index < 1 || index > songs.length) return;
  songIndex = index;
  audioElement.src = songs[songIndex - 1].fileName;
  currentPlayingSong.innerText = songs[songIndex - 1].songTitle;
  if (!preserveTime) {
    audioElement.currentTime = 0;
  }
  audioElement.load();
  
  // Update cover image in player if element exists
  const playerCover = document.getElementById("playerCover");
  if (playerCover) {
    playerCover.src = songs[songIndex - 1].coverName;
  }
  
  // Add to history
  addToHistory(songIndex);
}

// Play song
function playSong() {
  audioElement.play().then(() => {
    updatePlayPauseState(true);
    if (!audioContext) {
      initAudioContext();
    }
  }).catch((error) => {
    console.log("Play failed:", error);
  });
}

// Pause song
function pauseSong() {
  audioElement.pause();
  updatePlayPauseState(false);
}

// Master play/pause button
masterPlay.addEventListener("click", () => {
  if (audioElement.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// Individual song play buttons
Array.from(playThis).forEach((element) => {
  element.addEventListener("click", (e) => {
    const clickedIndex = parseInt(e.target.id);
    if (clickedIndex >= 1 && clickedIndex <= songs.length) {
      loadSong(clickedIndex);
      playSong();
    }
  });
});

// Next button
let next = document.getElementById("nextBtn");
next.addEventListener("click", () => {
  if (isShuffle) {
    const currentShuffleIndex = shuffledIndices.indexOf(songIndex);
    const nextShuffleIndex = (currentShuffleIndex + 1) % shuffledIndices.length;
    songIndex = shuffledIndices[nextShuffleIndex];
  } else {
    songIndex = (songIndex % songs.length) + 1;
  }
  loadSong(songIndex);
  if (isAutoPlay) playSong();
});

// Previous button
let previous = document.getElementById("previousBtn");
previous.addEventListener("click", () => {
  if (isShuffle) {
    const currentShuffleIndex = shuffledIndices.indexOf(songIndex);
    const prevShuffleIndex = currentShuffleIndex <= 0 ? shuffledIndices.length - 1 : currentShuffleIndex - 1;
    songIndex = shuffledIndices[prevShuffleIndex];
  } else {
    songIndex = songIndex <= 1 ? songs.length : songIndex - 1;
  }
  loadSong(songIndex);
  if (isAutoPlay) playSong();
});

// Progress bar update
audioElement.addEventListener("timeupdate", () => {
  if (audioElement.duration) {
    const progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    if (songLoader) songLoader.value = progress;
    updateTimeDisplay();
  }
});

// Seek functionality
if (songLoader) {
  songLoader.addEventListener("input", () => {
    if (audioElement.duration) {
      audioElement.currentTime = (songLoader.value * audioElement.duration) / 100;
    }
  });
}

// Update total time when metadata is loaded
audioElement.addEventListener("loadedmetadata", () => {
  updateTimeDisplay();
});

// Auto-play next song when current ends
audioElement.addEventListener("ended", () => {
  saveLastPlayed(); // Save before moving to next
  
  if (repeatMode === 2) {
    // Repeat one song
    audioElement.currentTime = 0;
    playSong();
    return;
  }
  
  if (repeatMode === 1 || isAutoPlay) {
    if (isShuffle) {
      const currentShuffleIndex = shuffledIndices.indexOf(songIndex);
      if (currentShuffleIndex === -1) {
        // Current song not in shuffle, reinitialize
        initShuffledIndices();
        songIndex = shuffledIndices[0];
      } else {
        const nextShuffleIndex = (currentShuffleIndex + 1) % shuffledIndices.length;
        songIndex = shuffledIndices[nextShuffleIndex];
      }
    } else {
      if (repeatMode === 1) {
        // Repeat all - loop back to start if at end
        songIndex = (songIndex % songs.length) + 1;
      } else {
        // Normal play - stop at end if auto-play is off
        if (songIndex >= songs.length) {
          return; // Stop playback
        }
        songIndex = (songIndex % songs.length) + 1;
      }
    }
    loadSong(songIndex);
    if (isAutoPlay || repeatMode === 1) playSong();
  }
});

// Volume control
if (volumeSlider) {
  volumeSlider.addEventListener("input", (e) => {
    audioElement.volume = e.target.value / 100;
    updateVolumeIcon(e.target.value);
    saveUserPreferences();
  });
}

if (volumeBtn) {
  volumeBtn.addEventListener("click", () => {
    if (audioElement.volume > 0) {
      volumeSlider.value = 0;
      audioElement.volume = 0;
      updateVolumeIcon(0);
    } else {
      volumeSlider.value = 70;
      audioElement.volume = 0.7;
      updateVolumeIcon(70);
    }
  });
}

function updateVolumeIcon(volume) {
  const icon = volumeBtn.querySelector("i");
  if (volume == 0) {
    icon.className = "fas fa-volume-mute";
  } else if (volume < 50) {
    icon.className = "fas fa-volume-down";
  } else {
    icon.className = "fas fa-volume-up";
  }
}

// Auto-play toggle
if (autoPlayToggle) {
  autoPlayToggle.addEventListener("click", () => {
    isAutoPlay = !isAutoPlay;
    autoPlayToggle.classList.toggle("active", isAutoPlay);
    const icon = autoPlayToggle.querySelector("i");
    if (isAutoPlay) {
      icon.className = "fas fa-forward";
    } else {
      icon.className = "fas fa-pause";
    }
    saveUserPreferences();
  });
}

// Shuffle toggle
if (shuffleBtn) {
  shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active", isShuffle);
    if (isShuffle) {
      initShuffledIndices();
      // Make sure current song is not first in shuffle
      const currentIndex = shuffledIndices.indexOf(songIndex);
      if (currentIndex === 0 && shuffledIndices.length > 1) {
        [shuffledIndices[0], shuffledIndices[1]] = [shuffledIndices[1], shuffledIndices[0]];
      }
    }
    saveUserPreferences();
  });
}

// Repeat toggle
if (repeatBtn) {
  repeatBtn.addEventListener("click", () => {
    repeatMode = (repeatMode + 1) % 3;
    repeatBtn.classList.toggle("active", repeatMode > 0);
    const icon = repeatBtn.querySelector("i");
    if (repeatMode === 0) {
      // Off
      icon.className = "fas fa-redo";
      icon.style.opacity = "0.6";
      repeatBtn.title = "Repeat Off";
    } else if (repeatMode === 1) {
      // Repeat All
      icon.className = "fas fa-redo";
      icon.style.opacity = "1";
      repeatBtn.title = "Repeat All";
    } else {
      // Repeat One
      icon.className = "fas fa-redo-alt";
      icon.style.opacity = "1";
      repeatBtn.title = "Repeat One";
    }
    saveUserPreferences();
  });
}

// Initialize
audioElement.addEventListener("canplay", () => {
  updateTimeDisplay();
});

// Update play state when audio is paused/played externally
audioElement.addEventListener("play", () => {
  updatePlayPauseState(true);
});

audioElement.addEventListener("pause", () => {
  updatePlayPauseState(false);
});

// Initialize audio context on first user interaction
document.addEventListener("click", () => {
  if (!audioContext) {
    initAudioContext();
  }
}, { once: true });

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC29hCMGqKbvM8EwMaW-NM3d5VUSKANat0",
//   authDomain: "mind-focus.firebaseapp.com",
//   projectId: "mind-focus",
//   storageBucket: "mind-focus.appspot.com",
//   messagingSenderId: "956562082403",
//   appId: "1:956562082403:web:2f035609628d9f7b280656",
//   measurementId: "G-Y9MCVQWTPX"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
