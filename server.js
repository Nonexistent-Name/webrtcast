import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { WebSocketServer } from 'ws';
import robotjs from 'robotjs';

const server = createServer(async (req, res) =>
    readFile(`./public${req.url === '/' ? '/index.html' : req.url}`)
        .then(file => res.end(file))
        .catch(() => {
            res.writeHead(404);
            res.end();
        })
);

server.listen(1420);
console.log('Started web server at http://localhost:1420');

const wss = new WebSocketServer({ server });
console.log('Started WebSocket server');

const screen = robotjs.getScreenSize();
let mouseDown = false;

const parseMessage = data => {
    data = JSON.parse(data);

    switch (data.type) {
        case 'keydown':
            try {
                robotjs.keyToggle(data.key, 'down');
            } catch (err) {
                console.error(`Could not toggle key: ${data.key}`);
            }
            break;

        case 'keyup':
            try {
                robotjs.keyToggle(data.key, 'up');
            } catch (err) {
                console.error(`Could not toggle key: ${data.key}`);
            }
            break;

        case 'mousedown':
            robotjs.mouseToggle('down', data.button);
            if (data.button === 'left') mouseDown = true;
            break;

        case 'mouseup':
            robotjs.mouseToggle('up', data.button);
            if (data.button === 'left') mouseDown = false;
            break;

        case 'mousepos':
            const pos = [data.x * screen.width, data.y * screen.height];
            if (mouseDown) robotjs.dragMouse(...pos);
            else robotjs.moveMouse(...pos);
            break;
    }
};

wss.on('connection', ws => {
    console.log(`Companion website connected`);

    ws.on('message', parseMessage);

    ws.on('close', () => console.log('Companion website disconnected'));
});
