// Dynamic Songs Structure by Folders
const songsByFolder = {
  'LowFi': [
    {
      songTitle: "Radha-Jale",
      songName: " Radha kaise na jale ~ lofi bits",
      fileName: "songs/Radha_jale.mp3",
      coverName: "song_banner/govind-radhe.jpg",
      folder: "LowFi"
    },
    {
      songTitle: "Radhe-sham",
      songName: " Govind Radhe Radhe sham ~ lofi bits",
      fileName: "songs/radhe_sham.mp3",
      coverName: "song_banner/krishna1.jpg",
      folder: "LowFi"
    },
    {
      songTitle: "Radha Rani",
      songName: "Radha Rani Lage ~ bass reaxed.",
      fileName: "songs/radha_rani.mp3",
      coverName: "song_banner/radha1.png",
      folder: "LowFi"
    },
   
    {
      songTitle: "Ham Katha Sunate",
      songName: "Ham katha sunate ram shakal gun dham ki ....",
      fileName: "songs/ham_katha_sunate.mp3",
      coverName: "song_banner/rama2.jpg",
      folder: "LowFi"
    },
    {
      songTitle: "Raam Siya Raam",
      songName: "Mangal Bhavan... Amangal Haari..",
      fileName: "songs/Ram_Siya_Ram.mp3",
      coverName: "song_banner/rama1.jpg",
      folder: "motivations"
    },{
      songTitle: "Hey Raam",
      songName: "Hey Raam (Female Version) ",
      fileName: "songs/Hey_Ram(female).mp3",
      coverName: "song_banner/raam-siya1.jpg",
      folder: "motivations"
    },
    {
      songTitle: "Hey Raam",
      songName: "Hey Raam (Male Version) ",
      fileName: "songs/Hey_Ram(male).mp3",
      coverName: "song_banner/rama4.jpg",
      folder: "motivations"
    }
  ],
  'motivations': [
    
    {
      songTitle: "Namo Namo",
      songName: "Namo Namo ji shankara (Kedarnath)",
      fileName: "songs/namo_namo.mp3",
      coverName: "song_banner/shiva1.jpg",
      folder: "motivations"
    },
    {
      songTitle: "Kahani Karn ki",
      songName: "My Favourite",
      fileName: "songs/Kahani_Karn_ki.mp3",
      coverName: "song_banner/karna1.png",
      folder: "motivations"
    },
    {
      songTitle: "Aarambh Hei Prachand",
      songName: "Aarambh hei Prachand ~ Bass Boosted..",
      fileName: "songs/aarambh_he_prachand.mp3",
      coverName: "song_banner/rama3.jpg",
      folder: "LowFi"
    }, {
      songTitle: "Hanuman Chalisa",
      songName: "Hanuman-Chalisa ~ bas boosted",
      fileName: "songs/hanuman_chalisa.mp3",
      coverName: "song_banner/hanumana1.jpg",
      folder: "LowFi"
    }
  ],
  'Marathi Love': [
    {
      songTitle: "Saazni",
      songName: "Saazni ~ Marathi Love Song",
      fileName: "/songs/Saazni (Official Video) (1).mp3",
      coverName: "/song_banner/saaznisong.jpg",
      folder: "Marathi Love"
    },
    {
      songTitle: "Saaz yo tuza..",
      songName: "Saaz yo tuza. marathi love song",
      fileName: "/songs/Saaj-Hyo-Tuza.mp3",
      coverName: "/song_banner/saaz hyu tuza.jpg",
      folder: "Marathi Love"
    },
    {
      songTitle: "Man Dhavataya",
      songName: "Man Dhavtaya Tuzyach mage... (My Favourite)",
      fileName: "/songs/Mann_Dhaavataya.mp3",
      coverName: "/song_banner/man dhavtaya.jpg",
      folder: "Marathi Love"
    }
  ],
  'Old Love': [
    {
      songTitle: "Haseen Wadia",
      songName: "Yeh Haseen Vadiyan Yeh Khula Aasman Roja...",
      fileName: "/songs/Yeh Haseen Vadiyan Yeh Khula Aasman Roja 128 Kbps.mp3",
      coverName: "/song_banner/haseen wadia.jpg",
      folder: "Old Love"
    }
  ]
};

// Flatten all songs into a single array with global index
let allSongs = [];
let globalSongIndex = 1;
Object.keys(songsByFolder).forEach(folder => {
  songsByFolder[folder].forEach(song => {
    song.globalIndex = globalSongIndex++;
    allSongs.push(song);
  });
});

// For backward compatibility
let songs = allSongs;

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
let searchInput = document.getElementById("searchInput");
let foldersContainer = document.getElementById("foldersContainer");
let songsContainer = document.getElementById("songsContainer");
let selectedFolders = []; // Array to support multiple folder selection
let searchQuery = "";
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
var audioElement = new Audio();
audioElement.volume = 0.7;

// Load folder selection from localStorage
function loadFolderSelection() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_FOLDER);
    if (saved) {
      const savedFolders = JSON.parse(saved);
      if (Array.isArray(savedFolders)) {
        selectedFolders = savedFolders;
      }
    }
  } catch (e) {
    console.log("Error loading folder selection:", e);
  }
}

// Save folder selection to localStorage
function saveFolderSelection() {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_FOLDER, JSON.stringify(selectedFolders));
  } catch (e) {
    console.log("Error saving folder selection:", e);
  }
}

// Initialize folder buttons
function initFolderButtons() {
  if (!foldersContainer) return;
  
  foldersContainer.innerHTML = '';
  
  // Create "All" button
  const allButton = document.createElement('button');
  allButton.className = `folder-btn ${selectedFolders.length === 0 ? 'active' : ''}`;
  allButton.textContent = 'All';
  allButton.dataset.folder = 'all';
  allButton.addEventListener('click', () => {
    selectedFolders = [];
    updateFolderButtons();
    saveFolderSelection();
    renderSongs();
  });
  foldersContainer.appendChild(allButton);
  
  // Create folder buttons
  Object.keys(songsByFolder).forEach(folder => {
    const button = document.createElement('button');
    button.className = `folder-btn ${selectedFolders.includes(folder) ? 'active' : ''}`;
    button.textContent = folder.charAt(0).toUpperCase() + folder.slice(1);
    button.dataset.folder = folder;
    button.addEventListener('click', () => {
      toggleFolder(folder);
    });
    foldersContainer.appendChild(button);
  });
}

function toggleFolder(folder) {
  const index = selectedFolders.indexOf(folder);
  if (index > -1) {
    // Remove folder
    selectedFolders.splice(index, 1);
  } else {
    // Add folder
    selectedFolders.push(folder);
  }
  updateFolderButtons();
  saveFolderSelection();
  renderSongs();
}

function updateFolderButtons() {
  const buttons = foldersContainer.querySelectorAll('.folder-btn');
  buttons.forEach(button => {
    const folder = button.dataset.folder;
    if (folder === 'all') {
      button.classList.toggle('active', selectedFolders.length === 0);
    } else {
      button.classList.toggle('active', selectedFolders.includes(folder));
    }
  });
}

// Initialize search
function initSearch() {
  if (!searchInput) return;
  
  const clearSearchBtn = document.getElementById('clearSearch');
  
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
    }
    renderSongs();
  });
  
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderSongs();
    });
  }
}

// Load preferences and initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded");
  console.log("Total songs:", allSongs.length);
  console.log("Songs by folder:", Object.keys(songsByFolder));
  
  loadUserPreferences();
  loadFolderSelection();
  initFolderButtons();
  initSearch();
  renderSongs();
  
  // Add comprehensive error handling for audio element
  audioElement.addEventListener('error', function(e) {
    console.error("Audio element error:", e);
    console.error("Current src:", audioElement.src);
    const error = audioElement.error;
    if (error) {
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      switch(error.code) {
        case 1: console.error("MEDIA_ERR_ABORTED - The user aborted the loading"); break;
        case 2: console.error("MEDIA_ERR_NETWORK - A network error occurred"); break;
        case 3: console.error("MEDIA_ERR_DECODE - An error occurred while decoding"); break;
        case 4: console.error("MEDIA_ERR_SRC_NOT_SUPPORTED - The source is not supported"); break;
      }
    }
  });
  
  audioElement.addEventListener('canplay', () => {
    console.log("Audio can play, src:", audioElement.src);
  });
  
  audioElement.addEventListener('loadstart', () => {
    console.log("Audio loading started, src:", audioElement.src);
  });
  
  // Try to resume last played song
  setTimeout(() => {
    if (!resumeLastPlayed()) {
      // If no resume, load default song
      if (allSongs.length > 0) {
        songIndex = allSongs[0].globalIndex;
        if (currentPlayingSong) {
          currentPlayingSong.innerText = allSongs[0].songTitle;
        }
        const playerCover = document.getElementById("playerCover");
        if (playerCover) {
          playerCover.src = allSongs[0].coverName;
        }
        audioElement.src = allSongs[0].fileName;
        audioElement.load();
        console.log("Default song loaded:", allSongs[0].fileName);
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
  shuffledIndices = allSongs.map(s => s.globalIndex);
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
  PLAY_COUNTS: 'mfocus_play_counts',
  SELECTED_FOLDER: 'mfocus_selected_folder'
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
    const song = allSongs.find(s => s.globalIndex === songIndex);
    if (!song) return;
    
    const songData = {
      index: songIndex,
      title: song.songTitle,
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
      const song = allSongs.find(s => s.globalIndex === lastPlayed.songIndex);
      if (hoursSince < 24 && song) {
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

// ==================== PARTICLE SYSTEM ====================
function createParticles() {
  const container = document.getElementById("particlesContainer");
  if (!container) return;
  
  // Clear existing particles
  container.innerHTML = '';
  
  // Create particles
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    const startX = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 10 + Math.random() * 10;
    
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = startX + '%';
    particle.style.animationDelay = delay + 's';
    particle.style.animationDuration = duration + 's';
    particle.style.opacity = Math.random() * 0.5 + 0.3;
    
    // Random colors
    const colors = [
      'rgba(102, 126, 234, 0.8)',
      'rgba(118, 75, 162, 0.8)',
      'rgba(240, 147, 251, 0.8)',
      'rgba(79, 172, 254, 0.8)',
      'rgba(0, 242, 254, 0.8)',
      'rgba(255, 255, 255, 0.6)'
    ];
    particle.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]} 0%, transparent 70%)`;
    
    container.appendChild(particle);
  }
}

// Update particles based on music intensity
function updateParticles(intensity) {
  const particles = document.querySelectorAll('.particle');
  particles.forEach((particle, index) => {
    const scale = 1 + intensity * 0.5;
    const opacity = 0.3 + intensity * 0.5;
    particle.style.transform = `scale(${scale})`;
    particle.style.opacity = opacity;
  });
}

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

// Render songs dynamically
function renderSongs() {
  if (!songsContainer) return;
  
  // Get filtered songs
  let filteredSongs = allSongs;
  
  // Apply folder filter
  if (selectedFolders.length > 0) {
    filteredSongs = allSongs.filter(song => selectedFolders.includes(song.folder));
  }
  
  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredSongs = filteredSongs.filter(song => 
      song.songTitle.toLowerCase().includes(query) ||
      song.songName.toLowerCase().includes(query)
    );
  }
  
  // Group songs by selected folders
  let folderGroups = {};
  let otherSongs = [];
  
  if (selectedFolders.length > 0) {
    // Group by selected folders
    selectedFolders.forEach(folder => {
      const folderSongs = filteredSongs.filter(song => song.folder === folder);
      if (folderSongs.length > 0) {
        folderGroups[folder] = folderSongs;
      }
    });
    
    // Get other songs (not in selected folders) if search is active
    if (searchQuery) {
      otherSongs = allSongs.filter(song => 
        !selectedFolders.includes(song.folder) &&
        (song.songTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
         song.songName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
  } else {
    // No folder selected - show all songs
    otherSongs = filteredSongs;
  }
  
  // Clear container
  songsContainer.innerHTML = '';
  
  // Render selected folder groups at top
  selectedFolders.forEach(folder => {
    if (folderGroups[folder] && folderGroups[folder].length > 0) {
      const folderSection = createSongSection(folderGroups[folder], folder, true);
      songsContainer.appendChild(folderSection);
    }
  });
  
  // Render other songs
  if (otherSongs.length > 0) {
    const otherSection = createSongSection(otherSongs, selectedFolders.length > 0 ? 'Other Songs' : 'All Songs', false);
    songsContainer.appendChild(otherSection);
  }
  
  // Re-attach event listeners
  attachSongListeners();
}

function createSongSection(songs, title, isFeatured) {
  const section = document.createElement('div');
  section.className = `songs_container container ${isFeatured ? 'featured-section' : ''}`;
  
  if (isFeatured) {
    const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = title;
    section.appendChild(sectionTitle);
  }
  
  const grid = document.createElement('div');
  grid.className = 'sectionCenter';
  
  songs.forEach((song, index) => {
    const card = document.createElement('div');
    card.className = 'image songItem';
    card.innerHTML = `
      <img src="${song.coverName}" alt="${song.songTitle}" />
      <div class="details">
        <h2 class="songTitle">${song.songTitle}</h2>
        <p class="songName">${song.songName}</p>
        <div class="more">
          <button class="playThis bn632-hover bn21" data-index="${song.globalIndex}">Play</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  
  section.appendChild(grid);
  return section;
}

// Event delegation handler (defined once)
function handlePlayButtonClick(e) {
  const button = e.target.closest('.playThis');
  if (button) {
    e.preventDefault();
    e.stopPropagation();
    const globalIndex = parseInt(button.getAttribute('data-index'));
    if (isNaN(globalIndex)) {
      console.error('Invalid globalIndex:', button.getAttribute('data-index'));
      return;
    }
    console.log('Play button clicked, globalIndex:', globalIndex);
    const song = allSongs.find(s => s.globalIndex === globalIndex);
    if (song) {
      console.log('Song found:', song);
      songIndex = globalIndex;
      loadSong(songIndex);
      playSong();
    } else {
      console.error('Song not found for index:', globalIndex);
      console.log('Available songs:', allSongs.map(s => ({ index: s.globalIndex, title: s.songTitle })));
    }
  }
}

function attachSongListeners() {
  // Remove old listener if exists
  if (songsContainer && songsContainer._playHandler) {
    songsContainer.removeEventListener('click', songsContainer._playHandler);
  }
  
  // Use event delegation on the container (only add once)
  if (songsContainer) {
    songsContainer._playHandler = handlePlayButtonClick;
    songsContainer.addEventListener('click', songsContainer._playHandler);
  }
}

// Update play/pause button state
function updatePlayPauseState(playing) {
  isPlaying = playing;
  if (playing) {
    masterPlay.classList.add("playing");
    document.body.classList.add("playing");
    if (songGif) {
      songGif.classList.add("playing");
      startRhythmVisualization();
    }
    createParticles();
  } else {
    masterPlay.classList.remove("playing");
    document.body.classList.remove("playing");
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
    
    // Update particles with music intensity
    updateParticles(intensity);
    
    // Update body animation speed based on intensity
    if (intensity > 0.3) {
      document.body.style.animationDuration = `${8 - intensity * 4}s`;
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
  const song = allSongs.find(s => s.globalIndex === index);
  if (!song) {
    console.error("Song not found for index:", index);
    return;
  }
  
  console.log("Loading song:", song);
  songIndex = index;
  
  // Set audio source
  audioElement.src = song.fileName;
  
  // Update UI
  if (currentPlayingSong) {
    currentPlayingSong.innerText = song.songTitle;
  }
  
  if (!preserveTime) {
    audioElement.currentTime = 0;
  }
  
  // Load the audio
  audioElement.load();
  
  // Handle loading errors with fallback
  const errorHandler = function(e) {
    console.error("Audio loading error for:", song.fileName);
    const error = audioElement.error;
    if (error) {
      console.error("Error code:", error.code, "Message:", error.message);
    }
    
    // Try fallback path (in case files are in root songs folder)
    if (song.fileName.includes('/')) {
      const fallbackPath = song.fileName.replace(/songs\/[^\/]+\//, 'songs/');
      if (fallbackPath !== song.fileName) {
        console.log("Trying fallback path:", fallbackPath);
        audioElement.removeEventListener('error', errorHandler);
        audioElement.src = fallbackPath;
        audioElement.load();
      }
    }
  };
  
  audioElement.addEventListener('error', errorHandler, { once: true });
  
  // Update cover image in player if element exists
  const playerCover = document.getElementById("playerCover");
  if (playerCover) {
    playerCover.src = song.coverName;
  }
  
  // Add to history
  addToHistory(songIndex);
}

// Play song
function playSong() {
  if (!audioElement.src) {
    console.error("No audio source set");
    return;
  }
  
  const playPromise = audioElement.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      updatePlayPauseState(true);
      if (!audioContext) {
        initAudioContext();
      }
    }).catch((error) => {
      console.error("Play failed:", error);
      // Try to handle autoplay restrictions
      if (error.name === 'NotAllowedError') {
        console.log("Autoplay blocked. User interaction required.");
      } else if (error.name === 'NotSupportedError') {
        console.error("Audio format not supported");
      } else {
        console.error("Audio playback error:", error);
      }
    });
  }
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

// Individual song play buttons (handled in attachSongListeners)

// Next button
let next = document.getElementById("nextBtn");
next.addEventListener("click", () => {
  if (isShuffle) {
    const currentShuffleIndex = shuffledIndices.indexOf(songIndex);
    const nextShuffleIndex = (currentShuffleIndex + 1) % shuffledIndices.length;
    songIndex = shuffledIndices[nextShuffleIndex];
  } else {
    const currentSong = allSongs.find(s => s.globalIndex === songIndex);
    const currentIndex = allSongs.indexOf(currentSong);
    const nextIndex = (currentIndex + 1) % allSongs.length;
    songIndex = allSongs[nextIndex].globalIndex;
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
    const currentSong = allSongs.find(s => s.globalIndex === songIndex);
    const currentIndex = allSongs.indexOf(currentSong);
    const prevIndex = currentIndex <= 0 ? allSongs.length - 1 : currentIndex - 1;
    songIndex = allSongs[prevIndex].globalIndex;
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
      const currentSong = allSongs.find(s => s.globalIndex === songIndex);
      const currentIndex = allSongs.indexOf(currentSong);
      
      if (repeatMode === 1) {
        // Repeat all - loop back to start if at end
        const nextIndex = (currentIndex + 1) % allSongs.length;
        songIndex = allSongs[nextIndex].globalIndex;
      } else {
        // Normal play - stop at end if auto-play is off
        if (currentIndex >= allSongs.length - 1) {
          return; // Stop playback
        }
        songIndex = allSongs[currentIndex + 1].globalIndex;
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
