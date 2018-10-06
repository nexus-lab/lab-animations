const timePopUp = 200;

const victimToSwitch = anime.path('#vic-swc');
const serverToSwitch = anime.path('#srv-swc');
const attackerToSwitch = anime.path('#atk-swc');

/**
 * Phase 1
 */
playground.add(showSplash('#splash-1', true));
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
    300 - packetTime([victimToSwitch, serverToSwitch])));
playground.add(showPacket('#data-3', [victimToSwitch, serverToSwitch], ['normal', 'reverse'],
    300 - packetTime([victimToSwitch, serverToSwitch])));

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
    -(serverToSwitch().el.getTotalLength() / defaultPacketSpeed | 0)));
playground.add(showDialog('#dlg-server-1'));
playground.add(showDialog('#dlg-attacker', -3500));
playground.add(showPacket('#arp-response', [serverToSwitch, victimToSwitch], ['normal', 'reverse']));
playground.add(showPacket('#arp-response-1', [attackerToSwitch, victimToSwitch], ['normal', 'reverse'],
    -500 - packetTime([victimToSwitch, serverToSwitch])))

playground.add(showDialog('#dlg-victim-2'));
playground.add(showPacket('#data-1', [victimToSwitch, attackerToSwitch], ['normal', 'reverse']));
playground.add(showPacket('#data-2', [victimToSwitch, attackerToSwitch], ['normal', 'reverse'],
    300 - packetTime([victimToSwitch, attackerToSwitch])))
playground.add(showPacket('#data-3', [victimToSwitch, attackerToSwitch], ['normal', 'reverse'],
    300 - packetTime([victimToSwitch, attackerToSwitch])))
playground.add(showDialog('#dlg-attacker-1'));