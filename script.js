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

let lyrics = [];

async function loadLyrics(file) {
    const response = await fetch(file);
    const text = await response.text();

    lyrics = text.split("\n").map(line => {
        const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);

        if (!match) return null;

        return {
            time: parseInt(match[1]) * 60 + parseFloat(match[2]),
            text: match[3]
        };
    }).filter(Boolean);
}

/* ==========================
   SONG LIST
========================== */

const songs = [

{

title:"Itna Na Muzse Tu Pyaar Badha",

artist:"recomposed by Pratham369.07_",

src:"assets/songs/Itna na muzse tu pyaar badha.mp3",

lrc: "assets/songs/Itna na muzse tu pyaar badha.lrc",

"duration": "3:53",

cover:"assets/images/Itna na muzse tu pyaar badha.png"

},

];

/* ==========================
   LOAD SONG
========================== */

function loadSong(index){

const song = songs[index];

audio.src = song.src;

console.log(audio.src);

title.textContent = song.title;

artist.textContent = song.artist;

cover.src = song.cover;

loadLyrics(song.lrc);

renderPlaylist();

}

/* ==========================
   PLAY
========================== */
function playSong() {

    audio.play()
    .then(() => {

        isPlaying = true;

        playBtn.innerHTML = '<i class="fas fa-pause"></i>';

        cover.classList.add("playing");

    })
    .catch(err => {

        console.error("Audio Error:", err);

    });

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

    const current = audio.currentTime;
    const lyricsBox = document.getElementById("lyrics");

    for (let i = lyrics.length - 1; i >= 0; i--) {
        if (current >= lyrics[i].time) {

            const prev = lyrics[i - 1]?.text || "";
            const curr = lyrics[i].text;
            const next1 = lyrics[i + 1]?.text || "";
            const next2 = lyrics[i + 2]?.text || "";

            lyricsBox.innerHTML = `
                <div class="lyric-line faded">${prev}</div>
                <div class="lyric-line active">${curr}</div>
                <div class="lyric-line faded">${next1}</div>
                <div class="lyric-line faded-more">${next2}</div>
            `;

            break;
        }
    }

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

/* ===========================================
   SEARCH
=========================================== */

search.addEventListener("keyup", () => {

    const value = search.value.toLowerCase();

    const songsList = document.querySelectorAll(".song");

    songsList.forEach((song) => {

        song.style.display = song.innerText
            .toLowerCase()
            .includes(value)
            ? "flex"
            : "none";

    });

});

/* ===========================================
   THEME
=========================================== */

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "light"){

    document.body.classList.add("light");

}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light")
            ? "light"
            : "dark"
    );

});

/* ===========================================
   SAVE CURRENT SONG
=========================================== */

function savePlayerState(){

    localStorage.setItem("currentSong", currentSong);
    localStorage.setItem("currentTime", audio.currentTime);

}

audio.addEventListener("timeupdate", savePlayerState);

/* ===========================================
   RESTORE
=========================================== */

const savedSong = localStorage.getItem("currentSong");
const savedTime = localStorage.getItem("currentTime");

if(savedSong !== null){

    currentSong = Number(savedSong);

    loadSong(currentSong);

    audio.addEventListener("loadedmetadata", () => {

        if(savedTime){

            audio.currentTime = Number(savedTime);

        }

    });

}

/* ===========================================
   KEYBOARD SHORTCUTS
=========================================== */

document.addEventListener("keydown", (e) => {

    if(e.target.tagName === "INPUT") return;

    switch(e.code){

        case "Space":

            e.preventDefault();

            isPlaying ? pauseSong() : playSong();

            break;

        case "ArrowRight":

            audio.currentTime += 5;

            break;

        case "ArrowLeft":

            audio.currentTime -= 5;

            break;

        case "ArrowUp":

            audio.volume = Math.min(audio.volume + 0.1, 1);
            volume.value = audio.volume * 100;
            updateVolumeIcon();

            break;

        case "ArrowDown":

            audio.volume = Math.max(audio.volume - 0.1, 0);
            volume.value = audio.volume * 100;
            updateVolumeIcon();

            break;

        case "KeyM":

            muteBtn.click();

            break;

        case "KeyN":

            nextSong();

            break;

        case "KeyP":

            prevSong();

            break;

    }

});

/* ===========================================
   MEDIA SESSION
=========================================== */

if("mediaSession" in navigator){

    navigator.mediaSession.setActionHandler("play", playSong);

    navigator.mediaSession.setActionHandler("pause", pauseSong);

    navigator.mediaSession.setActionHandler("previoustrack", prevSong);

    navigator.mediaSession.setActionHandler("nexttrack", nextSong);

}

/* ===========================================
   UPDATE MEDIA METADATA
=========================================== */

function updateMediaSession(){

    if(!("mediaSession" in navigator)) return;

    const song = songs[currentSong];

    navigator.mediaSession.metadata = new MediaMetadata({

        title: song.title,

        artist: song.artist,

        artwork: [

            {

                src: song.cover,

                sizes: "512x512",

                type: "image/jpeg"

            }

        ]

    });

}

const oldLoadSong = loadSong;

loadSong = function(index){

    oldLoadSong(index);

    updateMediaSession();

};

/* ===========================================
   LOADING
=========================================== */

audio.addEventListener("waiting", () => {

    document.body.classList.add("loading");

});

audio.addEventListener("playing", () => {

    document.body.classList.remove("loading");

});

/* ===========================================
   INITIALIZE
=========================================== */

loadSong(currentSong);

audio.volume = volume.value / 100;

updateVolumeIcon();

updateMediaSession();

renderPlaylist();


/* ===========================================
   END
=========================================== */
