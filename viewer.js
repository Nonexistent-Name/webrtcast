const controls = document.getElementById('connectControls');
const peerInput = document.getElementById('peerInput');
const connectBtn = document.getElementById('connectBtn');
const streamDisplay = document.getElementById('stream');

const peer = new Peer();

peer.on('call', call => {
    call.answer();

    console.log('Video connection established');

    call.on('stream', stream => {
        console.log('Stream recieved');

        controls.style.display = 'none';
        streamDisplay.srcObject = stream;
        streamDisplay.style.display = 'unset';
    });

    call.on('close', () => {
        controls.style.display = '';
        streamDisplay.srcObject = null;
    });
});

connectBtn.addEventListener('click', () => {
    console.log(`Connecting to ${peerInput.value}`);

    const conn = peer.connect(peerInput.value);
    conn.on('open', () => {
        console.log('Input connection established');

        addEventListener('keyup', event => {
            conn.send({
                type: 'key',
                key: event.key.toLowerCase(),
            });
        });
    });
});

document.body.addEventListener('click', () =>
    document.body.requestFullscreen()
);