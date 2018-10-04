var controlsProgressEl = document.querySelector('#playground .progress');

var playground = anime.timeline({
    easing: 'linear',
    autoplay: false,
    update: function (anim) {
        controlsProgressEl.value = anim.progress;
    }
});

document.querySelector('#playground .play').onclick = playground.play;
document.querySelector('#playground .pause').onclick = playground.pause;
document.querySelector('#playground .restart').onclick = playground.restart;

controlsProgressEl.addEventListener('input', function () {
    playground.seek(playground.duration * (controlsProgressEl.value / 100));
});

['input', 'change'].forEach(function (evt) {
    controlsProgressEl.addEventListener(evt, function () {
        playground.seek(playground.duration * (controlsProgressEl.value / 100));
    });
});