const defaultPacketSpeed = 1 / 10;
const controlsProgressEl = document.querySelector('#playground .progress');

function formatDuration(duration) {
    const total = Math.round(duration / 1000);
    const seconds = total % 60;
    const minutes = total / 60 | 0;
    return minutes + ':' + ('0' + seconds).slice(('0' + seconds).length - 2);
}

const playground = anime.timeline({
    easing: 'linear',
    autoplay: false,
    update: function (anim) {
        controlsProgressEl.value = anim.progress;
        if (anim.progress === 100) {
            document.querySelector('#playground .pause').disabled = true;
        }
        document.querySelector('#playground .duration').innerHTML =
            formatDuration((100 - anim.progress) * anim.duration / 100);
    }
});

(function () {
    let duration = 0;
    function getNodes(target) {
        try {
            return document.querySelectorAll(target);
        } catch (e) {
            return Array.isArray(target) ? target : [target];
        }
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
        if (typeof (action['delay']) !== 'undefined') {
            if (typeof (action.delay) === 'function') {
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

document.querySelector('#playground .play').onclick = function (e) {
    e.target.disabled = true;
    document.querySelector('#playground .pause').disabled = false;
    playground.play();
}
document.querySelector('#playground .pause').onclick = function (e) {
    e.target.disabled = true;
    document.querySelector('#playground .play').disabled = false;
    playground.pause();
}
document.querySelector('#playground .restart').onclick = playground.restart;

['input', 'change'].forEach(function (evt) {
    controlsProgressEl.addEventListener(evt, function () {
        const paused = playground.paused;
        playground.pause();
        playground.seek(playground.duration * (controlsProgressEl.value / 100));
        if (!paused) {
            playground.play();
            document.querySelector('#playground .play').disabled = true;
            document.querySelector('#playground .pause').disabled = false;
        } else {
            document.querySelector('#playground .play').disabled = false;
            document.querySelector('#playground .pause').disabled = true;
        }
    });
});

document.querySelector('#playground .play-button').addEventListener('click', function () {
    playground.play();
    document.querySelector('#playground .play-button').style.display = "none";
    document.querySelector('#playground .play').disabled = true;
    document.querySelector('#playground .pause').disabled = false;
});

['.scene', '.player'].forEach(id => {
    document.querySelector('#playground ' + id).addEventListener('mouseenter', function () {
        document.querySelector('#playground .player').style.transform = "translate(0, 0)";
    });
    document.querySelector('#playground ' + id).addEventListener('mouseleave', function () {
        document.querySelector('#playground .player').style.transform = "translate(0, 50px)";
    });
});

anime.easings['reverseLinear'] = function (t) {
    return 1 - t;
}

function makeOffset(offset) {
    return offset < 0 ? '-=' + Math.abs(offset) : '+=' + offset;
}

function absoluteOffset(id) {
    const el = document.querySelector(id);
    const rect = el.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

function relativeOffset(id) {
    const playgroundOffset = absoluteOffset('#playground');
    const offset = absoluteOffset(id);
    return { top: offset.top - playgroundOffset.top, left: offset.left - playgroundOffset.left };
}

function relativeValue(value) {
    return value < 0 ? '-=' + Math.abs(value) : '+=' + value;
}

function packetTime(paths, speed = defaultPacketSpeed) {
    let distance = 0;
    paths.forEach(path => {
        if (typeof (path) === 'string') {
            path = anime.path(path);
        }
        distance += path().el.getTotalLength();
    });
    return Math.round(distance / speed);
}

function connectActors(container, actor1, actor2, link) {
    const el1 = document.querySelector(actor1);
    const el2 = document.querySelector(actor2);
    const pos1 = {
        top: relativeOffset(actor1).top - relativeOffset(container).top,
        left: relativeOffset(actor1).left - relativeOffset(container).left
    };
    const pos2 = {
        top: relativeOffset(actor2).top - relativeOffset(container).top,
        left: relativeOffset(actor2).left - relativeOffset(container).left
    };
    const size1 = { width: el1.offsetWidth, height: el1.offsetHeight };
    const size2 = { width: el2.offsetWidth, height: el2.offsetHeight };
    const x1 = pos1.left + size1.width / 2;
    const y1 = pos1.top + 32;
    const x2 = pos2.left + size2.width / 2;
    const y2 = pos2.top + 32;
    function f(x = null, y = null) {
        if (y === null && x !== null) {
            return ((y1 - y2) * x + x1 * y2 - x2 * y1) / (x1 - x2);
        } else if (x === null && y !== null) {
            return ((x1 - x2) * y - x1 * y2 + x2 * y1) / (y1 - y2);
        }
    }
    function n(x, y) {
        return (x - x1) * (x - x2) <= 0 && (y - y1) * (y - y2) <= 0;
    }
    function c(l, t, r, b) {
        const f_l = f(l, null);
        if (f_l >= t && f_l <= b && n(l, f_l)) {
            return { x: l, y: f_l };
        }
        const f_t = f(null, t);
        if (f_t >= l && f_t <= r && n(f_t, t)) {
            return { x: f_t, y: t };
        }
        const f_r = f(r, null);
        if (f_r >= t && f_r <= b && n(r, f_r)) {
            return { x: r, y: f_r };
        }
        const f_b = f(null, b);
        if (f_b >= l && f_b <= r && n(f_b, b)) {
            return { x: f_b, y: b };
        }
    }

    const s = c(pos1.left, pos1.top, pos1.left + size1.width, pos1.top + size1.height);
    const e = c(pos2.left, pos2.top, pos2.left + size2.width, pos2.top + size2.height);
    const d = `M${s.x} ${s.y} L${e.x} ${e.y}`;
    document.querySelector(link).setAttribute('d', d);
}

function showSplash(id, beginning = false) {
    return [{
        targets: id,
        zIndex: 998,
        duration: 10
    }, {
        targets: id,
        opacity: [0, 1],
        duration: 500,
        offset: beginning ? '+=0' : '+=1500'
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

function showPacket(id, paths, directions, offset = 0, speed = defaultPacketSpeed) {
    return Array.prototype.concat.apply([], paths.map((path, i) => {
        if (typeof (path) === 'string') {
            path = anime.path(path);
        }
        const length = path().el.getTotalLength();
        const actions = [{
            targets: id,
            opacity: [0, 1],
            duration: 200,
            offset: i === 0 ? makeOffset(offset) : '+=0'
        }, {
            targets: id,
            translateX: path('x'),
            translateY: path('y'),
            easing: directions[i] === 'reverse' ? 'reverseLinear' : 'linear',
            duration: length / speed,
            offset: '-=200'
        }, {
            targets: id,
            opacity: [1, 0],
            duration: 200,
            offset: '-=200'
        }];
        return actions;
    }));
}

function showDialog(id, offset = 0) {
    return [{
        targets: `${id} path`,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 500,
        offset: makeOffset(offset)
    }, {
        targets: `${id} text, ${id} rect`,
        opacity: [0, 1],
        duration: 500
    }, {
        targets: `${id} text, ${id} rect`,
        opacity: 0,
        duration: 500,
        delay: 1500
    }, {
        targets: `${id} path`,
        strokeDashoffset: [0, anime.setDashoffset],
        easing: 'easeInOutSine',
        duration: 500
    }];
}

function stall(delay) {
    return [{
        target: '.scene',
        duration: delay
    }];
}