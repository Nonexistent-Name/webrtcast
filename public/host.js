const streamBtn = document.getElementById('streamBtn');
const peerIdText = document.getElementById('peerId');
const wsStatus = document.getElementById('wsStatus');
const streamDisplay = document.getElementById('stream');

let streaming = false;
const updateBtnText = () => {
    streamBtn.innerText = streaming ? 'Stop Streaming' : 'Start Stream';
};

streamBtn.addEventListener('click', async () => {
    if (streaming) {
        location.reload();
        return;
    }

    streamDisplay.srcObject = await navigator.mediaDevices.getDisplayMedia();
    streaming = true;
    updateBtnText();
});

let socket;
const wsConnect = () => {
    socket = new WebSocket('ws://localhost:1420');

    socket.addEventListener('open', () => {
        wsStatus.innerText = 'WebSocket: Connected';

        socket.addEventListener('close', () => {
            wsStatus.innerText = 'WebSocket: Reconnecting';
            wsConnect();
        });

        socket.addEventListener('error', event => {
            console.error(event);
            wsStatus.innerText = 'WebSocket: Error';
        });
    });
};
wsConnect();

const peer = new Peer('amongussussybaka');

peer.on('open', id => {
    peerIdText.innerText = id;
});

peer.on('connection', conn => {
    console.log('New connection');

    conn.on('open', async () => {
        console.log('Connection established, sending stream');

        peer.call(conn.peer, streamDisplay.srcObject);
    });

    conn.on('data', data => socket.send(JSON.stringify(data)));
});

peerId.addEventListener('click', () => {
    navigator.clipboard.writeText(peerId.innerText);
});
