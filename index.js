const $ = document.querySelector.bind(document),
    $$ = document.querySelectorAll.bind(document);

const repeatBtn = $(".btn-repeat"),
    prevBtn = $(".btn-prev"),
    togglePlay = $(".btn-toggle-play"),
    nextBtn = $(".btn-next"),
    randomBtn = $(".btn-random"),
    slider = $("#slider");

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cdWidth = cdThumb.offsetWidth;
const audioDuration = $(".time.time-end");
const audioCurrentTime = $(".time.time-current");
const dashboard = $(".dashboard");
const playlist = $(".play-list");

const LOCAL_STORAGE_KEY = "Media-Config";
// localStorage.clear();

const app = {
    isPlaying: false,
    currentIndex: 0,
    isRandom: false,
    isRepeat: false,
    loveSong: [],

    config: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {},

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.config));
    },

    songs: [
        {
            name: "Lone Ranger Rachel Platten Lyrics Vietsub TikTok",
            description: "TikTok",
            path: "./assets/song/Lone Ranger  Rachel Platten Lyrics  Vietsub  TikTok .mp3",
            image: "./assets/img/Lone Ranger - Rachel Platten.jpg",
        },
        {
            name: "Our Stolen Theory United LAOS Remix",
            description: "Remix",
            path: "./assets/song/Our Stolen Theory  United LAOS Remix.mp3",
            image: "./assets/img/Our Stolen Theory - United (L.A.O.S Remix).jpg",
        },
        {
            name: "Phoebe Ryan Mine Win Woo Remix",
            description: "Remix",
            path: "./assets/song/Phoebe Ryan  Mine Win  Woo Remix.mp3",
            image: "./assets/img/Phoebe Ryan - Mine.jpg",
        },
        {
            name: "PIKASONIC Asuka",
            description: "Asuka",
            path: "./assets/song/PIKASONIC  Asuka.mp3",
            image: "./assets/img/PIKASONIC-Asuka.jpg",
        },
        {
            name: "Senbonzakura",
            description: "Youtube",
            path: "./assets/song/Senbonzakura.mp3",
            image: "./assets/img/Senbonzakura.jpg",
        },
        {
            name: "Try Pnk Steve Wuaten Remix Lyrics Vietsub TikTok",
            description: "TikTok",
            path: "./assets/song/Try  Pnk  Steve Wuaten Remix Lyrics  Vietsub  TikTok .mp3",
            image: "./assets/img/Try - P!nk.jpg",
        },
        {
            name: "Umbrella Ember Island Matte Remix Lyrics Vietsub",
            description: "Youtube",
            path: "./assets/song/Umbrella  Ember Island  Matte Remix Lyrics  Vietsub .mp3",
            image: "./assets/img/Umbrella - Ember Island.jpg",
        },
        {
            name: "Victory",
            description: "Youtube",
            path: "./assets/song/Victory.mp3",
            image: "./assets/img/Victory.jpg",
        },
        {
            name: "Windy Hill",
            description: "Youtube",
            path: "./assets/song/Windy Hill.mp3",
            image: "./assets/img/Windy-Hill.jpg",
        },
        {
            name: "君の名は Kimi no Na wa Nandemonaiya Kamishiraishi Mone Maxone Remix",
            description: "Remix",
            path: "./assets/song/君の名は  Kimi no Na wa Nandemonaiya  Kamishiraishi Mone Maxone Remix .mp3",
            image: "./assets/img/Nandemonaiya - Kamishiraishi Mone.jpg",
        },
    ],

    render: function () {
        var html = this.songs.map(
            (song, index) => `
            <div class="song ${
                index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
                <div
                    class="song__thumb"
                    style="
                        background-image: url('${song.image}');
                    "></div>

                <div class="song__description">
                    <h3>
                        ${song.name}
                    </h3>
                    <p>${song.description}</p>
                </div>

                <div class="options ${this.loveSong[index] ? "active" : ""}">
                    <i class="fa fa-heart"></i>
                </div>
            </div>
        `
        );
        playlist.innerHTML = html.join("");
    },

    loadConfig: function () {
        this.loveSong = Array(this.songs.length).fill(false);

        this.isRandom = this.config.isRandom || this.isRandom;
        this.isRepeat = this.config.isRepeat || this.isRepeat;
        this.loveSong = this.config.loveSong || this.loveSong;

        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    },

    loadCurrentSong: function () {
        heading.innerText = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

        this.render(); // render for changing active song class
        this.scrollToActiveSong();
    },

    secondsToMinutes: function (currentTime) {
        currentTime = Math.round(currentTime);
        secs = currentTime % 60;
        let mins = (currentTime - secs) / 60;
        secs = secs < 10 ? "0" + secs : secs;
        return `${mins}:${secs}`;
    },

    loadAudioDuration: function () {
        audioDuration.innerText = this.secondsToMinutes(audio.duration);
    },

    scrollToActiveSong: function () {
        const songItem = $(".song");
        const top = songItem.offsetHeight * this.currentIndex;
        window.scrollTo({
            top: top,
            behavior: "smooth",
        });
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    handleEvents: function () {
        _this = this;

        // Scroll play list
        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cdThumb.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cdThumb.style.opacity = newCdWidth / cdWidth;
        };

        // Click play button
        togglePlay.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // Once the metadata has been loaded
        audio.addEventListener("loadedmetadata", function () {
            _this.loadAudioDuration();

            playlist.style.marginTop =
                dashboard.offsetHeight + (cdWidth - cdThumb.offsetWidth) + "px";
            slider.value = 0;
        });

        // If song is playing
        audio.onplay = function () {
            _this.isPlaying = true;
            togglePlay.classList.add("playing");
            cdThumbAnimate.play();
        };
        // If song is pausing
        audio.onpause = function () {
            _this.isPlaying = false;
            togglePlay.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // When song is ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // If current playback position has changed
        audio.ontimeupdate = function () {
            slider.value = (audio.currentTime / audio.duration) * 100;
            audioCurrentTime.innerText = _this.secondsToMinutes(
                audio.currentTime
            );
        };

        // When moving to new position in audio
        slider.onchange = function (e) {
            const seekTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        };

        // CD animate
        const cdThumbAnimate = cdThumb.animate(
            [
                {
                    transform: "rotate(360deg)",
                },
            ],
            {
                duration: 30000, // 30 secs
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();

        // Next Song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
        };
        // Prev Song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
        };

        // Random Song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);

            _this.setConfig("isRandom", _this.isRandom);
        };

        // Repeat Song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);

            _this.setConfig("isRepeat", _this.isRepeat);
        };

        // When click on play list
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song");
            const optionsNode = e.target.closest(".options");

            if (songNode) {
                // Song options on click

                // index of songNode:
                // songNode.getAttribute("data-index")
                // or: songNode.dataset.index
                const songIndex = Number(songNode.dataset.index);
                if (optionsNode) {
                    songNode.style.opacity = 1;

                    _this.loveSong[songIndex] = !_this.loveSong[songIndex];
                    optionsNode.classList.toggle(
                        "active",
                        _this.loveSong[songIndex]
                    );
                    _this.setConfig("loveSong", _this.loveSong);
                } else {
                    // Not click on options -> move to other song

                    _this.currentIndex = songIndex;
                    _this.loadCurrentSong();
                    audio.play();
                }
            }
        };
    },

    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    start: function () {
        this.defineProperties();
        this.loadCurrentSong();
        this.handleEvents();

        this.loadConfig();
        this.render();
    },
};

app.start();
