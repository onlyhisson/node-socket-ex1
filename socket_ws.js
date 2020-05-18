const WebSocket = require('ws');

let count = 0;

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속', ip);
        ws.on('message', (message) => {
            console.log(message);
        });
        ws.on('error', (error) => {
            console.error(error);
        });
        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval); // 메모리 누수 방지
        });
        const interval = setInterval(() => {
            // ws.readyState = {CONNECTING, OPEN, CLOSING, CLOSED}
            if (ws.readyState === ws.OPEN) {    // OPEN 일때만 에러 없이 메시지 전송 가능
                ws.send(`${count} 서버에서 클라이언트로 메시지를 보냅니다.`);
                count++;
            }
        }, 3000);
        ws.interval = interval;
    });
};