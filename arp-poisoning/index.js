TLcontrols
    .add({
        targets: '#TLcontrols .square.el',
        translateX: [{ value: 80 }, { value: 160 }, { value: 250 }],
        translateY: [{ value: 30 }, { value: 60 }, { value: 60 }],
        duration: 3000,
        offset: 0
    })
    .add({
        targets: '#TLcontrols .circle.el',
        translateX: [{ value: 80 }, { value: 160 }, { value: 250 }],
        translateY: [{ value: 30 }, { value: -30 }, { value: -30 }],
        duration: 3000,
        offset: 0
    })
    .add({
        targets: '#TLcontrols .triangle.el',
        translateX: [{ value: 80 }, { value: 250 }],
        translateY: [{ value: -60 }, { value: -30 }, { value: -30 }],
        duration: 3000,
        offset: 0
    });