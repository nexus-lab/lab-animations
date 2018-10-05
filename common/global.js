const controlsProgressEl = document.querySelector('#playground .progress');

const playground = anime.timeline({
    easing: 'linear',
    autoplay: false,
    update: function (anim) {
        controlsProgressEl.value = anim.progress;
    }
});

(function () {
    let duration = 0;
    function getNodes(target) {
        return document.querySelectorAll(target);
    }
    function updateDuration(action) {
        if (typeof (action['offset']) !== 'undefined') {
            const operator = /^(\*=|\+=|-=)/.exec(action.offset);
            if (!operator) {
                duration = action.offset;
            } else {
                const y = parseFloat(action.offset.replace(operator[0], ''));
                switch (operator[0][0]) {
                    case '+': duration = duration + y; break;
                    case '-': duration = duration - y; break;
                    case '*': duration = duration * y; break;
                }
            }
        }
        const offset = duration;
        const nodes = Array.isArray(action.targets) ? [].concat.apply([], action.targets.map(getNodes)) :
            getNodes(action.targets);
        if (typeof(action['delay']) !== 'undefined') {
            if (typeof(action.delay) === 'function') {
                duration += Math.max.apply(null, Array.prototype.slice.call(nodes).map((node, i) => {
                    return action.delay(node, i);
                }));
            } else {
                duration += action.delay;
            }
        }
        duration += typeof (action.duration) !== 'undefined' ? action.duration : 0;
        return offset;
    }

    const _timelineAdd = playground.add;
    playground.add = function (actions) {
        (Array.isArray(actions) ? actions : [actions]).forEach(action => {
            action.offset = updateDuration(action);
            _timelineAdd.call(playground, action);
        });
    }
})();

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

anime.easings['reverseLinear'] = function (t) {
    return 1 - t;
}

function makeOffset(offset) {
    return offset < 0 ? '-=' + Math.abs(offset) : '+=' + offset;
}

function showSplash(id) {
    return [{
        targets: id,
        zIndex: 998,
        duration: 10
    }, {
        targets: id,
        opacity: [0, 1],
        duration: 500,
        offset: '+=1500'
    }, {
        targets: id,
        opacity: 0,
        duration: 500,
        offset: '+=2000'
    }, {
        targets: id,
        zIndex: -1,
        duration: 10
    }];
}