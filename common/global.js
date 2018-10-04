var controlsProgressEl = document.querySelector('#TLcontrols .progress');

var TLcontrols = anime.timeline({
    easing: 'linear',
    update: function (anim) {
        controlsProgressEl.value = anim.progress;
    }
});

document.querySelector('#TLcontrols .play').onclick = TLcontrols.play;
document.querySelector('#TLcontrols .pause').onclick = TLcontrols.pause;
document.querySelector('#TLcontrols .restart').onclick = TLcontrols.restart;

controlsProgressEl.addEventListener('input', function () {
    TLcontrols.seek(TLcontrols.duration * (controlsProgressEl.value / 100));
});

['input', 'change'].forEach(function (evt) {
    controlsProgressEl.addEventListener(evt, function () {
        TLcontrols.seek(TLcontrols.duration * (controlsProgressEl.value / 100));
    });
});