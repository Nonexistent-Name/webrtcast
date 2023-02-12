const video = document.getElementById('video');

const captureBtn = document.getElementById('captureBtn');

const peerInput = document.getElementById('peerInput');
const peerPlaceholder = document.getElementById('peerPlaceholder');
const peerIdText = document.getElementById('peerId');

const wsStatusText = document.getElementById('wsStatus');
const wsReconnectBtn = document.getElementById('wsReconnect');

let socket;

const wsConnect = () => {
    socket = new WebSocket('ws://localhost:1420');

    socket.addEventListener('open', () => {
        wsStatusText.innerText = 'Connected';
        wsReconnectBtn.style.display = 'none';

        socket.addEventListener('close', () => {
            wsStatusText.innerText = 'Disconnected';
            setTimeout(wsReconnect, 1000);
        });
    });

    socket.addEventListener('error', () => {
        wsStatusText.innerText = 'Error';
        wsReconnectBtn.style.display = 'revert';
    });
};

const wsReconnect = () => {
    wsStatusText.innerText = 'Reconnecting';
    wsReconnectBtn.style.display = 'none';
    wsConnect();
};

wsReconnectBtn.addEventListener('click', wsReconnect);

wsConnect();

peerInput.value = localStorage.getItem('peerid') ?? '';

captureBtn.addEventListener('click', async () => {
    if (captureBtn.innerText === 'Stop Streaming') {
        location.reload();
        return;
    }

    video.srcObject = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: { width: 1920, height: 1080 },
    });

    captureBtn.innerText = 'Stop Streaming';
    peerInput.style.display = 'none';
    peerPlaceholder.style.display = 'revert';

    localStorage.setItem('peerid', peerInput.value);
    const peer = new Peer(peerInput.value);

    peer.on('open', id => {
        peerIdText.innerText = id;
        peerIdText.style.display = 'revert';
        peerPlaceholder.style.display = 'none';
    });

    peer.on('connection', conn => {
        console.log('New connection');

        conn.on('open', async () => {
            console.log('Connection established, sending stream');

            peer.call(conn.peer, video.srcObject);
        });

        conn.on('data', data => socket.send(JSON.stringify(data)));
    });
});

peerIdText.addEventListener('click', () =>
    navigator.clipboard.writeText(peerIdText.innerText)
);
