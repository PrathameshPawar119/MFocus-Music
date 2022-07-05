
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
  }
];

let masterPlay = document.getElementById('masterPlay');
// let songLoader = document.getElementById('songLoader');
let songLoader = document.getElementsByClassName("songLoader");
  songLoader = songLoader[0];
let songGif = document.getElementById('songGif');
let songItems = document.getElementsByClassName('songItem');
let playThis = document.getElementsByClassName('playThis');
let currentPlayingSong = document.getElementById('currentPlayingSong');
let bottomSongMeta = document.getElementsByClassName('bottom_song_meta');
let songIndex = 1;

var audioElement = new Audio('songs/radhe_sham.mp3');


// Putting Data into Cards
for (let i = 0; i < songItems.length; i++) {
    const element = songItems[i];
    element.getElementsByTagName('img')[0].src = songs[i].coverName;
    element.getElementsByTagName('h2')[0].innerText = songs[i].songTitle;
    element.getElementsByTagName('p')[0].innerText = songs[i].songName;
    
}

//play button
masterPlay.addEventListener('click', ()=>{
    if (audioElement.paused) {
        audioElement.play();
    }
    else{
        audioElement.pause();
    }
    
});


// for each song's button
Array.from(playThis).forEach((element) =>{
    element.addEventListener('click', (e) => {
            songIndex = parseInt(e.target.id);  // index of clicked song's button
            audioElement.src = songs[songIndex-1].fileName;
            currentPlayingSong.innerText = songs[songIndex-1].songTitle;
            audioElement.currentTime = 0;
            audioElement.play();

            masterPlay.style.clipPath =
              "polygon(0 0, 40% 0, 40% 100%, 60% 100%, 60% 0, 100% 0, 100% 100%, 0 100%);";
    });
});


// Previous and Next butons eventlisteners
let previous = document.getElementById('previousBtn');
let next = document.getElementById('nextBtn');

next.addEventListener('click', ()=> {
    songIndex = ((songIndex) % songs.length)+1;
    audioElement.src = songs[songIndex - 1].fileName;
    currentPlayingSong.innerText = songs[songIndex - 1].songTitle;
    audioElement.currentTime = 0;
    audioElement.play();
})
previous.addEventListener("click", () => {
  if (songIndex <= 0) {
    songIndex = 0;
  }
  else{
    songIndex -= 1;
  }
  audioElement.src = songs[songIndex - 1].fileName;
  currentPlayingSong.innerText = songs[songIndex - 1].songTitle;
  audioElement.currentTime = 0;
  audioElement.play();
});




// Progress bar
audioElement.addEventListener('timeupdate', ()=>{
    // Update seek bar here
    progress = parseInt((audioElement.currentTime/audioElement.duration)*100);
    songLoader.value = progress;
});

songLoader.addEventListener('change', ()=>{
    audioElement.currentTime = (songLoader.value*audioElement.duration)/100;
})




// Function to check that audio is playing or not at instance
function isPlaying(audioElement) 
{ 
  return !audioElement.paused; 
}


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


