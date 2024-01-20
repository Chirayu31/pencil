import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

type Room = string;

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

const rooms: Room[] = [];

app.get('/', (req, res) => res.send('Hello world'));

io.on('connection', (socket: Socket) => {
    console.log('A user connected', socket.id);

    socket.on('createRoom', (username) => {
        let roomId: string = generateRandomRoomId();
        while (rooms.includes(roomId)) {
            roomId = generateRandomRoomId();
        }

        rooms.push(roomId);
        socket.join(roomId);

        console.log(socket.id, roomId)

        io.to(socket.id).emit('created', roomId);
    });


    socket.on('joinRoom', (roomId, username) => {
        const room = rooms.find((room) => room === roomId);

        if (room) {
            socket.join(roomId);
            console.log(socket.id, roomId)
            io.to(socket.id).emit('joined', roomId);
        } else {
            io.to(socket.id).emit('joined', '');
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function generateRandomRoomId() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
