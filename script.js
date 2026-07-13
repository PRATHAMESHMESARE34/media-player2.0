/* ===========================================
   PREMIUM MEDIA PLAYER
   script.js (Part 1)
=========================================== */

const audio = document.getElementById("audio");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");

const muteBtn = document.getElementById("mute");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const title = document.getElementById("title");
const artist = document.getElementById("artist");

const cover = document.getElementById("cover");

const playlist = document.getElementById("playlist");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const search = document.getElementById("search");

const speed = document.getElementById("speed");

const themeBtn = document.getElementById("themeBtn");

let currentSong = 0;

let isPlaying = false;

let shuffle = false;

let repeat = false;

/* ==========================
   SONG LIST
========================== */

const songs = [

{

title:"Song One",

artist:"Unknown",

src:"assets/songs/song1.mp3",

cover:"assets/images/song1.jpg"

},

{

title:"Song Two",

artist:"Unknown",

src:"assets/songs/song2.mp3",

cover:"assets/images/song2.jpg"

},

{

title:"Song Three",

artist:"Unknown",

src:"assets/songs/song3.mp3",

cover:"assets/images/song3.jpg"

}

];

/* ==========================
   LOAD SONG
========================== */

function loadSong(index){

const song = songs[index];

audio.src = song.src;

title.textContent = song.title;

artist.textContent = song.artist;

cover.src = song.cover;

renderPlaylist();

}

/* ==========================
   PLAY
========================== */

function playSong(){

audio.play();

isPlaying = true;

playBtn.innerHTML = '<i class="fas fa-pause"></i>';

cover.classList.add("playing");

}

/* ==========================
   PAUSE
========================== */

function pauseSong(){

audio.pause();

isPlaying = false;

playBtn.innerHTML = '<i class="fas fa-play"></i>';

cover.classList.remove("playing");

}

/* ==========================
   PLAY BUTTON
========================== */

playBtn.addEventListener("click",()=>{

if(isPlaying){

pauseSong();

}else{

playSong();

}

});

/* ==========================
   NEXT SONG
========================== */

function nextSong(){

if(shuffle){

currentSong = Math.floor(Math.random()*songs.length);

}else{

currentSong++;

if(currentSong>=songs.length){

currentSong=0;

}

}

loadSong(currentSong);

playSong();

}

/* ==========================
   PREVIOUS SONG
========================== */

function prevSong(){

currentSong--;

if(currentSong<0){

currentSong=songs.length-1;

}

loadSong(currentSong);

playSong();

}

nextBtn.addEventListener("click",nextSong);

prevBtn.addEventListener("click",prevSong);

/* ==========================
   PLAYLIST
========================== */

function renderPlaylist(){

playlist.innerHTML="";

songs.forEach((song,index)=>{

const div=document.createElement("div");

div.className="song";

if(index===currentSong){

div.classList.add("active");

}

div.innerHTML=`

<img src="${song.cover}">

<div class="song-info">

<h4>${song.title}</h4>

<p>${song.artist}</p>

</div>

`;

div.onclick=()=>{

currentSong=index;

loadSong(index);

playSong();

};

playlist.appendChild(div);

});

}

/* ==========================
   INITIAL LOAD
========================== */

loadSong(currentSong);

/* ===========================================
   PROGRESS BAR & TIME
=========================================== */

audio.addEventListener("loadedmetadata", () => {

    progress.max = Math.floor(audio.duration);

    duration.textContent = formatTime(audio.duration);

});

audio.addEventListener("timeupdate", () => {

    progress.value = Math.floor(audio.currentTime);

    currentTime.textContent = formatTime(audio.currentTime);

});

progress.addEventListener("input", () => {

    audio.currentTime = progress.value;

});

function formatTime(time){

    if(isNaN(time)) return "00:00";

    const min = Math.floor(time / 60);

    const sec = Math.floor(time % 60);

    return `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;

}

/* ===========================================
   VOLUME
=========================================== */

const savedVolume = localStorage.getItem("player-volume");

if(savedVolume !== null){

    volume.value = savedVolume;

    audio.volume = savedVolume / 100;

}

volume.addEventListener("input", () => {

    audio.volume = volume.value / 100;

    localStorage.setItem("player-volume", volume.value);

    updateVolumeIcon();

});

function updateVolumeIcon(){

    if(audio.volume === 0){

        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';

    }

    else if(audio.volume < 0.5){

        muteBtn.innerHTML = '<i class="fas fa-volume-down"></i>';

    }

    else{

        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';

    }

}

updateVolumeIcon();

/* ===========================================
   MUTE
=========================================== */

let previousVolume = volume.value;

muteBtn.addEventListener("click", () => {

    if(audio.volume > 0){

        previousVolume = volume.value;

        audio.volume = 0;

        volume.value = 0;

    }

    else{

        audio.volume = previousVolume / 100;

        volume.value = previousVolume;

    }

    updateVolumeIcon();

});

/* ===========================================
   PLAYBACK SPEED
=========================================== */

speed.addEventListener("change", () => {

    audio.playbackRate = Number(speed.value);

});

/* ===========================================
   SHUFFLE
=========================================== */

shuffleBtn.addEventListener("click", () => {

    shuffle = !shuffle;

    shuffleBtn.classList.toggle("active-btn", shuffle);

});

/* ===========================================
   REPEAT
=========================================== */

repeatBtn.addEventListener("click", () => {

    repeat = !repeat;

    repeatBtn.classList.toggle("active-btn", repeat);

});

/* ===========================================
   SONG END
=========================================== */

audio.addEventListener("ended", () => {

    if(repeat){

        audio.currentTime = 0;

        playSong();

        return;

    }

    nextSong();

});
