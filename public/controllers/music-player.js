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