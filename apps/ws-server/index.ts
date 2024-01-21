import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { Room } from '@repo/types';

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

    socket.on('createRoom', (username: string) => {
        let roomId: string = generateRandomRoomId();
        const prevRooms = rooms.map(room => room.id)

        while (prevRooms.includes(roomId)) {
            roomId = generateRandomRoomId();
        }

        rooms.push({ id: roomId, users: [username] });
        socket.join(roomId);

        io.to(socket.id).emit('created', roomId);
    });


    socket.on('joinRoom', (roomId: string, username: string) => {
        const currRooms = rooms.map(room => room.id)
        const roomIdx = currRooms.findIndex((room) => room === roomId);

        if (roomIdx != -1) {
            socket.join(roomId);
            rooms[roomIdx]?.users.push(username)
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
