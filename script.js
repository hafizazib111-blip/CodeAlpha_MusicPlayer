const audio = document.getElementById("audio");

const playButton = document.getElementById("play");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");

const volume = document.getElementById("volume");
const volumeValue = document.querySelector(".volume-value");
const progressBar = document.querySelector(".progress-bar");
const progress = document.getElementById("progress");
const progressThumb = document.querySelector(".progress-thumb");

const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");

const titleDisplay = document.getElementById("song-title");
const artistDisplay = document.getElementById("song-artist");

const songElements = document.querySelectorAll(".song");
const nowPlaying = document.querySelector(".now-playing");
const search = document.getElementById("search");

const songs = [
    {
        title: "Tu",
        artist: "Talwinder",
        src: "music/Tu.mp3"
    },
    {
        title: "High On You",
        artist: "Jind Universe",
        src: "music/High On You.mp3"
    },
    {
        title: "Haseen",
        artist: "Talwinder",
        src: "music/Haseen.mp3"
    },
    {
        title: "Pal Pal",
        artist: "Talwinder",
        src: "music/Pal Pal.mp3"
    },
    {
        title: "Her",
        artist: "Shubh",
        src: "music/Her.mp3"
    },
    {
        title: "G.O.A.T",
        artist: "Diljit Dosanjh",
        src: "music/G.O.A.T.mp3"
    },
    {
        title: "Boyfriend",
        artist: "Karan Aujla",
        src: "music/Boyfriend.mp3"
    },
    {
        title: "Khayaal",
        artist: "Talwinder",
        src: "music/Khayaal.mp3"
    },
    {
        title: "Cheques",
        artist: "Shubh",
        src: "music/Cheques.mp3"
    },
    {
        title: "King Shit",
        artist: "Shubh",
        src: "music/King Shit.mp3"
    }
];

let currentSong = 0;
let shuffle = false;
let repeat = false;

function updatePlayingUI(isPlaying) {
    nowPlaying.classList.toggle("playing", isPlaying);

    songElements.forEach(song => {
        song.classList.remove("playing");
    });

    if (isPlaying && songElements[currentSong]) {
        songElements[currentSong].classList.add("playing");
    }
}

function loadSong(index) {
    currentSong = index;

    const song = songs[currentSong];

    audio.pause();
    audio.src = encodeURI(song.src);
    audio.load();

    titleDisplay.textContent = song.title;
    artistDisplay.textContent = song.artist;

    progress.style.width = "0%";

    if (progressThumb) {
        progressThumb.style.left = "0%";
    }

    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = "0:00";

    songElements.forEach((item, i) => {
        item.classList.toggle("active", i === currentSong);
    });

    updatePlayingUI(false);
}

function playSong() {
    audio.play().catch(error => {
        console.error("Audio could not play:", error);
    });
}

function pauseSong() {
    audio.pause();
}

function togglePlay() {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
}

function nextSong() {
    if (shuffle) {
        let randomSong;

        do {
            randomSong = Math.floor(Math.random() * songs.length);
        } while (randomSong === currentSong && songs.length > 1);

        currentSong = randomSong;
    } else {
        currentSong++;

        if (currentSong >= songs.length) {
            currentSong = 0;
        }
    }

    loadSong(currentSong);
    playSong();
}

function previousSong() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong(currentSong);
    playSong();
}

function formatTime(seconds) {
    if (!isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}

playButton.addEventListener("click", togglePlay);
nextButton.addEventListener("click", nextSong);
previousButton.addEventListener("click", previousSong);

shuffleButton.addEventListener("click", () => {
    shuffle = !shuffle;
    shuffleButton.classList.toggle("active", shuffle);
});

repeatButton.addEventListener("click", () => {
    repeat = !repeat;
    repeatButton.classList.toggle("active", repeat);
});

audio.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    const percentage =
        (audio.currentTime / audio.duration) * 100;

    progress.style.width = `${percentage}%`;

    if (progressThumb) {
        progressThumb.style.left = `${percentage}%`;
    }

    currentTimeDisplay.textContent =
        formatTime(audio.currentTime);
});

audio.addEventListener("play", () => {
    playButton.textContent = "❚❚";
    updatePlayingUI(true);
});

audio.addEventListener("pause", () => {
    playButton.textContent = "▶";
    updatePlayingUI(false);
});

audio.addEventListener("ended", () => {
    if (repeat) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextSong();
    }
});

progressBar.addEventListener("click", event => {
    if (!audio.duration) return;

    const rect = progressBar.getBoundingClientRect();

    const percentage =
        (event.clientX - rect.left) / rect.width;

    audio.currentTime =
        percentage * audio.duration;
});

volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);

    if (volumeValue) {
        volumeValue.textContent =
            `${Math.round(volume.value * 100)}%`;
    }
});

songElements.forEach(song => {
    song.addEventListener("click", () => {
        const index = Number(song.dataset.index);

        loadSong(index);
        playSong();
    });
});

audio.addEventListener("error", () => {
    console.error(
        "Could not load:",
        songs[currentSong].src
    );
});

if (search) {
    search.addEventListener("input", () => {
        const query = search.value.toLowerCase().trim();

        songElements.forEach((song, index) => {
            const title =
                songs[index].title.toLowerCase();

            const artist =
                songs[index].artist.toLowerCase();

            const match =
                title.includes(query) ||
                artist.includes(query);

            song.style.display =
                match ? "flex" : "none";
        });
    });
}

loadSong(0);

audio.volume = 0.8;
volume.value = 0.8;

if (volumeValue) {
    volumeValue.textContent = "80%";
}