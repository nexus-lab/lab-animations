document.querySelector('#playground').onclick = function (e) {
    console.log(e.clientX - document.querySelector('#playground').offsetLeft, e.clientY - document.querySelector('#playground').offsetTop)
}

const timePopUp = 200;
const packetSpeed = 1 / 15;
const typingSpeed = 1 / 20;
const victimToWWW = anime.path('#vic-www');
const wwwToServer = anime.path('#www-srv');
const hackerToWWW = anime.path('#hkr-www');
const wwwToMalicious = anime.path('#www-msv');
const serverToDatabase = anime.path('#srv-dtb');

function clickOn(id, cursor) {
    const el = document.querySelector(id);
    const cr = document.querySelector(cursor);
    return [{
        targets: cursor,
        duration: 100,
        opacity: [0, 1]
    }, {
        targets: cursor,
        easing: 'easeInOutSine',
        duration: 500,
        translateX: () => {
            const offsetLeft = relativeOffset(id).left + el.offsetWidth / 2 - relativeOffset(cursor).left - cr.offsetWidth / 2;
            return relativeValue(offsetLeft)
        },
        translateY: () => {
            const offsetTop = relativeOffset(id).top + el.offsetHeight / 2 - relativeOffset(cursor).top;
            return relativeValue(offsetTop);
        }
    }, {
        targets: id,
        scale: [1, 0.8],
        duration: 100,
        delay: 100
    }, {
        targets: id,
        scale: 1,
        duration: 100
    }, {
        targets: cursor,
        duration: 100,
        delay: 100,
        opacity: 0
    }];
}

function fillIn(id, text) {
    const input = document.querySelector(id);
    const wrapper = { currentLen: 0 };
    return [{
        targets: wrapper,
        easing: 'linear',
        currentLen: text.length,
        duration: text.length / typingSpeed,
        delay: 500,
        update: function () {
            input.value = text.slice(0, wrapper.currentLen);
            input.scrollTop = input.scrollHeight;
        }
    }];
}

function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }
  

domready(function () {
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

    /**
     * Phase 2
     */
    playground.add(showSplash('#splash-2'));
    playground.add(clickOn('#hacker', '#hand-cursor'));
    playground.add({
        targets: '#browser-1',
        easing: 'easeInOutSine',
        translateY: [320, 0],
        opacity: [0, 1],
        duration: 500
    });
    playground.add({
        targets: '#browser-1 #rate i:not(:last-child)',
        color: '#febd69',
        duration: 100,
        delay: function (el, i) { return 2000 + i * 150 }
    });
    playground.add(fillIn('#text-review', htmlDecode(document.querySelector('#look-inside .html').innerHTML)));
    playground.add(clickOn('#review-submit', '#hand-cursor'));
    playground.add({
        targets: '#browser-1 .review',
        translateY: [-42, 0],
        duration: 300,
        delay: 500
    });
    playground.add({
        targets: '#hacker-review-new',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        offset: '-=300'
    });
    playground.add({
        targets: '#browser-1',
        easing: 'easeInOutSine',
        translateY: 320,
        opacity: 0,
        duration: 500,
        delay: 2000
    });
    playground.add(showPacket('#http-request', [hackerToWWW, wwwToServer], ['normal', 'normal'], 500, packetSpeed));
    playground.add(showPacket('#db-reviews', [serverToDatabase], ['normal'], 0, packetSpeed));

    /**
     * Phase 3
     */
    playground.add(showSplash('#splash-3'));
    playground.add(showPacket('#http-request', [victimToWWW, wwwToServer], ['normal', 'normal'], 0, packetSpeed));
    playground.add(showPacket('#db-reviews', [serverToDatabase], ['reverse'], 0, packetSpeed));
    playground.add(showPacket('#http-response', [wwwToServer, victimToWWW], ['reverse', 'reverse'], 0, packetSpeed));
    playground.add(clickOn('#victim', '#hand-cursor'));
    const browser2 = document.querySelector('#browser-2');
    const hackerReview = document.querySelector('#hacker-review .text');
    const hackerReviewInside = document.querySelector('#look-inside');
    playground.add({
        targets: '#browser-2',
        easing: 'easeInOutSine',
        translateY: [320, 0],
        opacity: [0, 1],
        duration: 500
    });
    playground.add({
        targets: '#hacker-review .text',
        backgroundColor: [
            { value: 'rgba(0, 0, 0, 0)' },
            { value: 'rgb(40, 44, 52)' },
            { value: 'rgba(0, 0, 0, 0)' },
            { value: 'rgb(40, 44, 52)' },
            { value: 'rgba(0, 0, 0, 0)' },
            { value: 'rgb(40, 44, 52)' },
            { value: 'rgba(0, 0, 0, 0)' }
        ],
        color: [
            { value: '#333' },
            { value: '#fff' },
            { value: '#333' },
            { value: '#fff' },
            { value: '#333' },
            { value: '#fff' },
            { value: '#333' }
        ],
        duration: 2000,
        delay: 1500
    });
    playground.add({
        targets: '#look-inside',
        opacity: [0, 1],
        duration: 200
    });
    playground.add({
        targets: '#look-inside',
        easing: 'easeInOutSine',
        translateX: [hackerReview.offsetLeft, (browser2.offsetWidth - hackerReviewInside.offsetWidth) / 2],
        translateY: [hackerReview.offsetTop, (browser2.offsetHeight - hackerReviewInside.offsetHeight) / 2],
        scaleX: [hackerReview.offsetWidth / hackerReviewInside.offsetWidth, 1],
        scaleY: [hackerReview.offsetHeight / hackerReviewInside.offsetHeight, 1],
        duration: 500,
        offset: '-=200'
    });
    playground.add({
        targets: '#look-inside',
        easing: 'easeInOutSine',
        translateX: hackerReview.offsetLeft,
        translateY: hackerReview.offsetTop,
        scaleX: hackerReview.offsetWidth / hackerReviewInside.offsetWidth,
        scaleY: hackerReview.offsetHeight / hackerReviewInside.offsetHeight,
        duration: 500,
        delay: 4000
    });
    playground.add({
        targets: '#look-inside',
        opacity: 0,
        duration: 200,
        offset: '-=200'
    });
    playground.add(fillIn('#cardholder', 'Alice Wonderland'));
    playground.add(fillIn('#card-no', '4169624585012079'));
    playground.add(fillIn('#expiration-date', '12/2022'));
    playground.add(fillIn('#security-code', '789'));
    playground.add(clickOn('#buy-submit', '#hand-cursor'));
    playground.add({
        targets: '#browser-2',
        easing: 'easeInOutSine',
        translateY: 320,
        opacity: 0,
        duration: 500,
        delay: 1000
    });
    playground.add(showPacket('#http-request', [victimToWWW, wwwToServer], ['normal', 'normal'], 1000));
    playground.add(showPacket('#payment-data', [victimToWWW, wwwToMalicious], ['normal', 'normal'],
        300 - packetTime([victimToWWW, wwwToServer], packetSpeed), packetSpeed));
    playground.add(showDialog('#dlg-attacker'));
});