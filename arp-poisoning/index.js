const timePopUp = 200;

const victimToSwitch = anime.path('#victim-switch');
const serverToSwitch = anime.path('#server-switch');

anime.easings['reverseEase'] = function(t) {
    return 1 - t;
}

/**
 * Phase 1
 */
playground.add({
    targets: '#scene-1 .actor:not(#attacker)',
    scale: [0, 1],
    duration: timePopUp,
    offset: 0
});
playground.add({
    targets: '#connector path:not(#attacker-switch)',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 500,
    delay: function (el, i) { return i * 250 }
});

/**
 * Phase 2
 */
playground.add({
    targets: '#scene-2',
    opacity: 1,
    zIndex: 998,
    duration: 500,
    offset: '+=2000'
});
playground.add({
    targets: '#scene-2',
    opacity: 0,
    zIndex: -1,
    duration: 500,
    offset: '+=2000'
});
playground.add({
    targets: '#dialog #victim path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 500
});
playground.add({
    targets: '#dialog #victim text, #dialog #victim rect',
    opacity: [0, 1],
    duration: 500
});
playground.add({
    targets: '#dialog #victim text, #dialog #victim rect',
    opacity: 0,
    duration: 500,
    offset: '+=1000'
});
playground.add({
    targets: '#dialog #victim path',
    strokeDashoffset: [0, anime.setDashoffset],
    easing: 'easeInOutSine',
    duration: 500
});

playground.add({
    targets: '#arp-request',
    opacity: [0, 1],
    duration: 200
});
playground.add({
    targets: '#arp-request',
    translateX: victimToSwitch('x'),
    translateY: victimToSwitch('y'),
    duration: 2500,
    offset: '-=200'
});
playground.add({
    targets: '#arp-request',
    opacity: [1, 0],
    duration: 200,
    offset: '-=200'
});
playground.add({
    targets: '#arp-request',
    opacity: [0, 1],
    duration: 200
});
playground.add({
    targets: '#arp-request',
    translateX: serverToSwitch('x'),
    translateY: serverToSwitch('y'),
    easing: 'reverseEase',
    duration: 500,
    offset: '-=200'
});
playground.add({
    targets: '#arp-request',
    opacity: [1, 0],
    duration: 200,
    offset: '-=200'
});
playground.add({
    targets: '#arp-response',
    opacity: [0, 1],
    duration: 200
});
playground.add({
    targets: '#arp-response',
    translateX: serverToSwitch('x'),
    translateY: serverToSwitch('y'),
    duration: 500,
    offset: '-=200'
});
playground.add({
    targets: '#arp-response',
    opacity: [1, 0],
    duration: 200,
    offset: '-=200'
});
playground.add({
    targets: '#arp-response',
    opacity: [0, 1],
    duration: 200
});
playground.add({
    targets: '#arp-response',
    translateX: victimToSwitch('x'),
    translateY: victimToSwitch('y'),
    easing: 'reverseEase',
    duration: 2500,
    offset: '-=200'
});
playground.add({
    targets: '#arp-response',
    opacity: [1, 0],
    duration: 200,
    offset: '-=200'
});