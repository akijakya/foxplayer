'use strict';

let audio = document.getElementsByTagName('audio')[0];

// PLAY/PAUSE FUNCTION

function playPause () {
    if(audio.paused) {
        audio.play();
        playButton.className = 'fas fa-pause';
    } else {
        audio.pause();
        playButton.className = 'fas fa-play';
    }
}

// triggered when pressed the play button
let playButton = document.getElementById('play-button').getElementsByTagName('i')[0];
playButton.addEventListener('click', () => playPause(), false);

// triggered when pressed the space bar
document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        playPause();
    }
}

// in some browsers, when a track ends, it doesn't set the audio to paused mode, thats why:
audio.addEventListener('ended', function(e) {
  audio.pause();
  playButton.className = 'fas fa-play';
}, false);

// DISPLAYING CURRENT TIME AND DURATION

let currentTime = document.getElementById('current-time');
let currentDuration = document.getElementById('current-duration'); 

audio.addEventListener('durationchange', function () {
    let s = parseInt(audio.duration % 60);
    let m = parseInt((audio.duration / 60) % 60);
    if (s < 10) {
        currentDuration.innerHTML = m + ":0" + s;
    } else {
        currentDuration.innerHTML = m + ":" + s;
    }
});

audio.addEventListener("timeupdate", function() {
    let s = parseInt(audio.currentTime % 60);
    let m = parseInt((audio.currentTime / 60) % 60);
    if (s < 10) {
        currentTime.innerHTML = m + ":0" + s;
    } else {
        currentTime.innerHTML = m + ":" + s;
    }
}, false);

// SEEKBAR AND VOLUME BAR

let seekBar = document.querySelector('#seekbar');

audio.addEventListener ('loadedmetadata', function () {
    seekBar.max = audio.duration;
});

audio.addEventListener ('timeupdate', function() {
    seekBar.value = audio.currentTime;
});

seekBar.addEventListener ('change', function () {
    audio.currentTime = seekBar.value;
});

seekBar.addEventListener ('click', function () {
    audio.currentTime = seekBar.value;
});

let volumeBar = document.querySelector('#volume-bar');

volumeBar.addEventListener ('change', function () {
    audio.volume = volumeBar.value / 10;
});

volumeBar.addEventListener ('click', function () {
    audio.volume = volumeBar.value / 10;
});