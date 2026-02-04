import dgram from 'dgram';

const socket=dgram.createSocket("udp4");

socket.bind(5500,'127.0.0.1')

socket.on('message',(msg,rinfo)=>{
    console.log(`Message received from ${rinfo.address}:${rinfo.port} - ${msg}`);
});

console.log("UDP server is listening on port 5500");