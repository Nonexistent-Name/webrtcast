const streamBtn = document.getElementById('streamBtn');
const peerIdText = document.getElementById('peerId');
const wsStatus = document.getElementById('wsStatus');
const streamDisplay = document.getElementById('stream');

streamBtn.addEventListener('click', async () => {
    if (streamBtn.innerText === 'Stop Streaming') location.reload();

    streamDisplay.srcObject = await navigator.mediaDevices.getDisplayMedia();
    streamBtn.innerText = 'Stop Streaming';
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

const peer = new Peer();
peer.on('open', id => {
    peerIdText.innerText = id;
});
peer.on('connection', conn => {
    conn.on('open', async () => {
        console.log('Input connection established');

        peer.call(conn.peer, streamDisplay.srcObject);
    });

    conn.on('data', data => {
        socket.send(JSON.stringify(data));
    });
});

peerId.addEventListener('click', () => {
    navigator.clipboard.writeText(peerId.innerText);
});
