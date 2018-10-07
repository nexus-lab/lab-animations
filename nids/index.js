const timePopUp = 200;

domready(function() {
    /**
     * Phase 1
     */
    // playground.add(showSplash('#splash-1', true));
    playground.add({
        targets: '.scene > .actor',
        scale: [0, 1],
        duration: timePopUp
    });
    playground.add({
        targets: '.scene > #links path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 500,
        delay: function (el, i) { return i * 250 }
    });
    for (let i = 1; i <= 3; i++) {
        playground.add(showPacket('#packet-' + i, ['#usr-int', '#int-fwl', '#fwl-srv'], ['normal', 'normal', 'normal']));
        playground.add(showPacket('#packet-' + (i + 3), ['#fwl-nid'], ['normal'], -packetTime(['#fwl-srv'])));
        playground.add(showPacket('#bad-packet-' + i, ['#atk-int', '#int-fwl', '#fwl-srv'], ['normal', 'normal', 'normal'], -1500));
        playground.add(showPacket('#bad-packet-' + (i + 3), ['#fwl-nid'], ['normal'], -packetTime(['#fwl-srv'])));
    }
    
    /**
     * Phase 2
     */
    playground.add({
        targets: '#nids-magnify-border',
        opacity: [
            { value: 0 },
            { value: 1 },
            { value: 0 },
            { value: 1 },
            { value: 0 },
            { value: 1 }
        ],
        duration: 1000
    });

    const magnify = document.querySelector('#nids-magnify');
    const magnifyBorder = document.querySelector('#nids-magnify-border');
    playground.add({
        targets: '#nids-magnify',
        opacity: [0, 1],
        duration: 300
    });
    playground.add({
        targets: '#nids-magnify',
        borderColor: ['#72caaf', '#aaa'],
        translateX: [magnifyBorder.offsetLeft - magnify.offsetLeft, 0],
        translateY: [magnifyBorder.offsetTop - magnify.offsetTop, 0],
        scaleX: [magnifyBorder.offsetWidth / magnify.offsetWidth, 1],
        scaleY: [magnifyBorder.offsetHeight / magnify.offsetHeight, 1],
        duration: 500,
        offset: '-=300'
    });

    playground.add({
        targets: '#nids-magnify > .actor',
        scale: [0, 1],
        duration: timePopUp,
        offset: '-=400'
    });
    playground.add({
        targets: '#nids-magnify > #links path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 500,
        delay: function (el, i) { return i * 250 }
    });

    const nidsPacketSpeed = 1 / 24;
    const sniffer = document.querySelector('#sniffer');
    const fallY = sniffer.offsetTop - 20;
    for (let i = 7; i <= 9; i++) {
        for (let j = 0; j < 2; j++) {
            const prefix = j === 0 ? '' : 'bad-';
            const fallX = sniffer.offsetLeft + 30 + (Math.random() - 0.5) * 12;
            playground.add({
                targets: '#' + prefix + 'packet-' + i,
                rotateX: Math.random(),
                translateX: [fallX, fallX],
                translateY: [fallY, fallY + 20],
                opacity: [0, 1, 1, 0],
                duration: 800
            });
            playground.add(showPacket('#' + prefix + 'packet-' + i, ['#snf-pcr'], ['normal'], 0, nidsPacketSpeed));
            playground.add(showPacket('#' + prefix + 'signature-' + i, ['#pcr-dtr'], ['normal'], 0, nidsPacketSpeed));
            playground.add(showPacket('#rule-1', ['#dtr-rul'], ['reverse'], 0, nidsPacketSpeed));
            playground.add(showPacket('#rule-2', ['#dtr-rul'], ['reverse'], 0, nidsPacketSpeed));
        }
    }
})