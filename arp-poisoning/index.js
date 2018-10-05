const timePopUp = 200;
const packetSpeed = 1 / 10;

const victimToSwitch = anime.path('#vic-swc');
const serverToSwitch = anime.path('#srv-swc');
const attackerToSwitch = anime.path('#atk-swc');

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

function showPacket(id, paths, directions, offset = 0) {
    return Array.prototype.concat.apply([], paths.map((path, i) => {
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
            duration: length / packetSpeed,
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

/**
 * Phase 1
 */
playground.add(showSplash('#splash-1'));
playground.add({
    targets: '.actor:not(#attacker)',
    scale: [0, 1],
    duration: timePopUp
});
playground.add({
    targets: '#links path:not(#atk-swc)',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 500,
    delay: function (el, i) { return i * 250 }
});

/**
 * Phase 2
 */
playground.add(showSplash('#splash-2'));
playground.add(showDialog('#dlg-victim'));
playground.add(showPacket('#arp-request', [victimToSwitch, serverToSwitch], ['normal', 'reverse']));
playground.add(showDialog('#dlg-server'));
playground.add(showPacket('#arp-response', [serverToSwitch, victimToSwitch], ['normal', 'reverse']));
playground.add(showDialog('#dlg-victim-1'));
playground.add(showPacket('#data-1', [victimToSwitch, serverToSwitch], ['normal', 'reverse']));
playground.add(showPacket('#data-2', [victimToSwitch, serverToSwitch], ['normal', 'reverse'],
    300 - ((victimToSwitch().el.getTotalLength() + serverToSwitch().el.getTotalLength()) / packetSpeed | 0)));
playground.add(showPacket('#data-3', [victimToSwitch, serverToSwitch], ['normal', 'reverse'],
    300 - ((victimToSwitch().el.getTotalLength() + serverToSwitch().el.getTotalLength()) / packetSpeed | 0)));

/**
 * Phase 3
 */
playground.add(showSplash('#splash-3'));
playground.add({
    targets: '.actor#attacker',
    scale: [0, 1],
    duration: timePopUp,
});
playground.add({
    targets: '#links path#atk-swc',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 500,
});
playground.add(showDialog('#dlg-victim'));
playground.add(showPacket('#arp-request', [victimToSwitch], ['normal']));
playground.add(showPacket('#arp-request', [serverToSwitch], ['reverse']));
playground.add(showPacket('#arp-request-1', [attackerToSwitch], ['reverse'],
    -(serverToSwitch().el.getTotalLength() / packetSpeed | 0)));
playground.add(showDialog('#dlg-server-1'));
playground.add(showDialog('#dlg-attacker', -3500));
playground.add(showPacket('#arp-response', [serverToSwitch, victimToSwitch], ['normal', 'reverse']));
playground.add(showPacket('#arp-response-1', [attackerToSwitch, victimToSwitch], ['normal', 'reverse'],
    -500 - ((victimToSwitch().el.getTotalLength() + serverToSwitch().el.getTotalLength()) / packetSpeed | 0)));

playground.add(showDialog('#dlg-victim-2'));
playground.add(showPacket('#data-1', [victimToSwitch, attackerToSwitch], ['normal', 'reverse']));
playground.add(showPacket('#data-2', [victimToSwitch, attackerToSwitch], ['normal', 'reverse'],
    300 - ((victimToSwitch().el.getTotalLength() + attackerToSwitch().el.getTotalLength()) / packetSpeed | 0)));
playground.add(showPacket('#data-3', [victimToSwitch, attackerToSwitch], ['normal', 'reverse'],
    300 - ((victimToSwitch().el.getTotalLength() + attackerToSwitch().el.getTotalLength()) / packetSpeed | 0)));
playground.add(showDialog('#dlg-attacker-1'));