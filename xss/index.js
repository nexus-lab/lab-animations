document.querySelector('#playground').onclick = function (e) {
    console.log(e.clientX - document.querySelector('#playground').offsetLeft, e.clientY - document.querySelector('#playground').offsetTop)
}

const timePopUp = 200;
playground._top_ = document.querySelector('#playground').offsetTop;
playground._left_ = document.querySelector('#playground').offsetLeft;

function clickOn(element, cursor) {
    const el = document.querySelector(element);
    const csr = document.querySelector(cursor);
    const top = el.offsetTop + el.clientHeight / 2;
    const left = el.offsetLeft + el.clientWidth / 2;
    console.log(left, top)
    return [{
        targets: cursor,
        duration: 100,
        opacity: [0, 1]
    }, {
        targets: cursor,
        easing: 'easeInOutSine',
        duration: 500,
        translateX: left - csr.offsetLeft,
        translateY: top - csr.offsetTop,
    }, {
        targets: element,
        scale: [1, 0.8],
        duration: 100,
        delay: 100
    }, {
        targets: element,
        scale: 1,
        duration: 100
    }, {
        targets: cursor,
        duration: 100,
        delay: 100,
        opacity: 0
    }];
}

/**
 * Phase 1
 */
playground.add(showSplash('#splash-1'));
playground.add({
    targets: '.actor',
    scale: [0, 1],
    duration: timePopUp
});
playground.add({
    targets: '#links path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 500,
    delay: function (el, i) { return i * 250 }
});
playground.add(clickOn('#hacker', '#hand-cursor'));
playground.add(clickOn('#victim', '#hand-cursor'));