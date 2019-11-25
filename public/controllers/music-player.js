'use strict';

let audio = document.getElementsByTagName('audio')[0];

// PLAY/PAUSE FUNCTION

function playPause () {
    if(audio.paused) {
        audio.play();
        playButton.src = './public/assets/img/pause.svg';
    } else {
        audio.pause();
        playButton.src = './public/assets/img/play.svg';
    }
}

// triggered when pressed the play button
let playButton = document.getElementsByClassName('play-button')[0];
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
  playButton.src = './public/assets/img/play.svg';
}, false);

// DISPLAYING CURRENT TIME AND DURATION

let currentTime = document.getElementsByClassName('current-time')[0];
let currentDuration = document.getElementsByClassName('current-duration')[0]; 

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