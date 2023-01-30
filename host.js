const streamBtn = document.getElementById('streamBtn');
const peerId = document.getElementById('peerId');
const wsStatus = document.getElementById('wsStatus');
const streamDisplay = document.getElementById('stream');

streamBtn.addEventListener('click', async () => {
    streamDisplay.srcObject = await navigator.mediaDevices.getDisplayMedia();
});

let socket;
const wsConnect = () => {
    socket = new WebSocket('ws://localhost:1420');

    socket.addEventListener('open', event => {
        wsStatus.innerText = 'WebSocket: Connected';

        socket.addEventListener('close', event => {
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

const peer = new Peer(
    'MMCqiivJsASUtoprwsNHdk2PsKtGVbZ3T3gikoHbvM43vB5mQSyFPoRGEzooLz8a'
);
peer.on('open', id => {
    peerId.innerText = `Peer id: ${id}`;
});
peer.on('connection', conn => {
    conn.on('open', async () => {
        console.log('Input connection established');

        const call = peer.call(conn.peer, streamDisplay.srcObject);
    });

    conn.on('data', data => {
        socket.send(JSON.stringify(data));
    });
});
