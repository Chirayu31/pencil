import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { DrawLineProps, Room } from '@repo/types';

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
    const getRoomId = () => {
        const joinedRoom = [...socket.rooms].find((room) => room !== socket.id);

        if (!joinedRoom) return socket.id;

        return joinedRoom;
    };

    socket.on('createRoom', (username: string) => {
        let roomId: string = generateRandomRoomId();
        const prevRooms = rooms.map(room => room.id)

        while (prevRooms.includes(roomId)) {
            roomId = generateRandomRoomId();
        }

        rooms.push({ id: roomId, users: new Map([[socket.id, username]]), prevMoves: [] });
        socket.join(roomId);

        io.to(socket.id).emit('created', roomId);
    });

    socket.on('joinRoom', (roomId: string, username: string) => {
        const currRooms = rooms.map(room => room.id)
        const roomIdx = currRooms.findIndex((room) => room === roomId);

        if (roomIdx != -1) {
            socket.join(roomId);
            rooms[roomIdx]!.users.set(socket.id, username)
            io.to(socket.id).emit('joined', roomId);
        } else {
            io.to(socket.id).emit('joined', '');
        }
    });

    socket.on("joined_room", () => {
        const roomId = getRoomId()
        const currentRoom = rooms.find(room => room.id === roomId);

        if (!currentRoom) return;

        io.to(socket.id).emit('prevData', {
            prevMoves: [...currentRoom.prevMoves],
            users: [...currentRoom.users]
        });
    })

    socket.on('draw_line', ({ prevPoint, currentPoint, color }: DrawLineProps) => {
        const roomId = getRoomId()
        const roomExists = rooms.some(room => room.id === roomId);

        if (!roomExists) return;

        rooms.forEach((room) => {
            if (room.id === roomId) {
                room.prevMoves.push({ prevPoint, currentPoint, color })
            }
        })

        socket.broadcast.to(roomId).emit('draw_line', { prevPoint, currentPoint, color })
    })

    socket.on("clear_canvas", () => {
        const roomId = getRoomId()
        rooms.forEach((room) => {
            if (room.id === roomId) {
                room.prevMoves = []
            }
        })
        socket.broadcast.to(roomId).emit("clear_canvas")
    })


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
