import net from 'net';

const server = net.createServer((socket) => {
    console.log('TCP handshake completed with ' + socket.remoteAddress + ':' + socket.remotePort);
    socket.write('Hello from TCP server!\n');
    socket.on('data', (data) => {
        console.log('Received from client: ' + data.toString());
    });

});

server.listen(8800,"127.0.0.1", () => {
    console.log('TCP server listening on port 8800');
});

server.on('error', (err) => {
    console.error('Server error: ', err);
});