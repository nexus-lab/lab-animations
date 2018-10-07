const typingSpeed = 1 / 80;
const terminal = document.querySelector('#console code');
const commandText = document.querySelector('#console script[type="text"]').textContent;
terminal.textContent = '';

function stall(delay) {
    return [{
        target: '.scene',
        duration: delay
    }];
}

function windowPopOut(id) {
    return [{
        targets: id,
        scale: [0.4, 1],
        opacity: [0, 1],
        duration: 200
    }];
}

function windowToFront(id) {
    return [{
        targets: id,
        zIndex: 10,
        duration: 10
    }, {
        targets: '.window:not(' + id + ')',
        zIndex: 0,
        duration: 10,
        offset: '-=10'
    }];
}

function moveBreakPoint(lineNo) {
    return [{
        targets: '#code #breakpoint',
        easing: 'easeInOutSine',
        translateY: 10 + lineNo * 14,
        opacity: 1,
        duration: 200,
        delay: 100
    }];
}

function typingCommand() {
    const wrap = { len: 0 };
    const fragments = commander.destruct(commander.next());
    const previous = commander.previous();
    return [{
        targets: wrap,
        easing: 'linear',
        len: fragments.length,
        duration: fragments.length / typingSpeed,
        run: function () {
            terminal.textContent = previous + fragments.slice(0, wrap.len + 1).join('');
            hljs.highlightBlock(terminal);
        }
    }];
}

function blinkBit(id) {
    return [{
        targets: id,
        duration: 1500,
        color: [
            { value: '#90c376' },
            { value: '#fb625d' },
            { value: '#90c376' },
            { value: '#fb625d' },
            { value: '#90c376' },
            { value: '#fb625d' },
            { value: '#90c376' }
        ]
    }];
}

function showText(id, text) {
    const wrap = { len: 0 };
    const container = document.querySelector(id);
    return [{
        targets: wrap,
        easing: 'linear',
        len: [-1, text.length],
        duration: text.length / typingSpeed,
        run: function () {
            container.textContent = text.slice(0, wrap.len + 1);
        }
    }];
}

function setTextDirect(id, before, after) {
    const container = document.querySelector(id);
    let began = false;
    return [{
        target: id,
        duration: 50,
        begin: function() {
            began = true;
        },
        run: function(anim) {
            if (!began) {
                return;
            }
            if (anim.progress < 100) {
                container.textContent = before;
            } else {
                container.textContent = after;
            }
        }
    }];
}

const commander = (function () {
    const commands = commandText.split('\n');
    let next = '';
    let current = '';
    let previous = '';
    return {
        next: function () {
            previous += current;
            current = next;
            let afterNext = commands.length > 0 ? commands.shift() : '';
            if (afterNext.startsWith('$ ')) {
                current = (current === '' ? '' : current + '\n') + '$ ';
                next = afterNext.slice(2);
            } else {
                next = '\n' + afterNext;
            }
            return current;
        },
        current: function () {
            return current;
        },
        previous: function () {
            return previous;
        },
        destruct: function (command) {
            let i = 0;
            const result = [];
            const letters = this.current().split('');
            while (i < letters.length) {
                let j = i;
                const letter = letters[i];
                switch (letter) {
                    case '$':
                        if (letters[j + 1] === ' ') {
                            j = i + 1;
                        }
                        result.push(command.slice(i, j + 1));
                        i = j + 1;
                        break;
                    case 'P':
                        if (letters.length > i + 9 && command.slice(i, i + 10) === 'Password: ') {
                            j = i + 9;
                            result.push('Password: ');
                        } else {
                            result.push('P');
                        }
                        i = j + 1;
                        break;
                    default:
                        if (letter.charCodeAt(0) === '\n'.charCodeAt(0)) {
                            result.push(...['\n', '', '', '', '', '']);
                            i = j + 1;
                            break;
                        }
                        result.push(letter);
                        i = j + 1;
                }
            }
            return result;
        }
    }
})();

function showEditorAndMoveBreakpoint(lineNo) {
    playground.add(windowToFront('#editor'));
    playground.add(stall(500));
    playground.add(moveBreakPoint(lineNo));
    playground.add(stall(500));
}

function typeNextCommand() {
    playground.add(windowToFront('#terminal'));
    playground.add(typingCommand());
}

function blinkBytes(id) {
    playground.add(windowToFront('#debugger'));
    playground.add(blinkBit(id));
}

/**
 * Phase 1
 */
playground.add(showSplash('#splash-1', true));

// intro
playground.add(windowPopOut('#editor'));
playground.add(windowPopOut('#terminal'));
typeNextCommand();
typeNextCommand();
playground.add(stall(1500));
playground.add(windowToFront('#editor'));
playground.add(stall(3000));
typeNextCommand();
playground.add(stall(1000));
typeNextCommand();
typeNextCommand();
playground.add(stall(1000));

// first run
typeNextCommand();
playground.add(stall(500));
showEditorAndMoveBreakpoint(5);
playground.add(stall(1500));
playground.add(windowToFront('#debugger'));
playground.add(windowPopOut('#debugger'));
blinkBytes('#m-granted');
playground.add(showText('#var-1', 'granted'));
playground.add(stall(1500));
showEditorAndMoveBreakpoint(6);
playground.add(windowToFront('#debugger'));
playground.add(setTextDirect('#m-granted', '4a', '00'));
blinkBytes('#m-granted');
playground.add(showText('#var-1', 'granted=0'));
playground.add(stall(1500));
showEditorAndMoveBreakpoint(7);
blinkBytes('#m-passwd-0, #m-passwd-1, #m-passwd-2, #m-passwd-3, #m-passwd-4, #m-passwd-5, #m-passwd-6');
playground.add(showText('#var-2', 'passwd[]'));
showEditorAndMoveBreakpoint(9);
typeNextCommand();
playground.add(stall(1500));
for (let i = 0; i < 7; i++) {
    const containerId = '#m-passwd-' + i;
    const before = document.querySelector(containerId).textContent;
    let after = '0' + 'pa$$wd\0'.charCodeAt(i).toString(16);
    after = after.slice(after.length - 2);
    playground.add(setTextDirect(containerId, before, after));
}
blinkBytes('#m-passwd-0, #m-passwd-1, #m-passwd-2, #m-passwd-3, #m-passwd-4, #m-passwd-5, #m-passwd-6');
playground.add(showText('#var-2', 'passwd[]="pa$$wd\\0"'));
playground.add(stall(1500));
showEditorAndMoveBreakpoint(16);
playground.add(stall(500));

// second run
typeNextCommand();
typeNextCommand();
typeNextCommand();
typeNextCommand();

// third run
playground.add(stall(1500));
typeNextCommand();
typeNextCommand();
typeNextCommand();
playground.add(stall(1000));
showEditorAndMoveBreakpoint(9);
playground.add(stall(500));
typeNextCommand();
playground.add(stall(1000));
for (let i = 0; i < 7; i++) {
    const containerId = '#m-passwd-' + i;
    let before = '0' + 'pa$$wd\0'.charCodeAt(i).toString(16);
    before = before.slice(before.length - 2);
    const after = '0' + '1234567'.charCodeAt(i).toString(16);
    playground.add(setTextDirect(containerId, before, after.slice(after.length - 2)));
    blinkBytes(containerId);
}
playground.add(showText('#var-2', 'passwd[]="1234567"'));
playground.add(setTextDirect('#m-granted', '00', '01'));
blinkBytes('#m-granted');
playground.add(showText('#var-1', 'passwd[8]=granted=1'));
showEditorAndMoveBreakpoint(16);
playground.add(stall(500));
typeNextCommand();