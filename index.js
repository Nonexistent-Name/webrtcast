import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { WebSocketServer } from 'ws';
// import robotjs from 'robotjs';

const server = createServer(async (req, res) => {
    switch (req.url) {
        case '/':
            res.end(await readFile('./index.html'));
            break;
        case '/viewer.js':
            res.end(await readFile('./viewer.js'));
            break;
        case '/host':
            res.end(await readFile('./host.html'));
            break;
        case '/host.js':
            res.end(await readFile('./host.js'));
            break;
        case '/style.css':
            res.end(await readFile('./style.css'));
            break;
    }
});

server.listen(1420);
console.log('Started web server at http://localhost:1420');

const wss = new WebSocketServer({ server });
console.log('Started WebSocket server');

wss.on('connection', ws => {
    console.log(`Companion website connected`);

    ws.on('message', data => {
        data = JSON.parse(data);
        console.log(data);

        // if (data.type === 'mouse') robotjs.moveMouse(data.x, data.y);
        // else if (data.type === 'click') robotjs.mouseClick();
        // else if (data.type === 'key') {
        //     try {
        //         robotjs.keyTap(data.key);
        //     } catch (err) {
        //         console.error(`Invalid key: ${data.key}`);
        //     }
        // }
    });

    ws.on('close', () => {
        console.log('Companion website disconnected');
    });
});
