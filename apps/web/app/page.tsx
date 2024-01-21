'use client';
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { roomAtom, DEFAULT_ROOM } from "../atoms/room";
import { useRouter } from "next/navigation";
import { socket } from "../utils/socket";

export default function Page(): JSX.Element {
  const setRoomDetails = useSetRecoilState(roomAtom)
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');

  const router = useRouter();

  useEffect(() => {
    socket?.on('created', (receivedRoomId: string) => {
      console.log("here")
      setRoomDetails({ ...DEFAULT_ROOM, id: receivedRoomId })
      router.push(receivedRoomId)
    })

    const handleJoinedRoom = (receivedRoomId: string) => {
      if (receivedRoomId) {
        setRoomDetails({ ...DEFAULT_ROOM, id: receivedRoomId })
        router.push(receivedRoomId)
      } else {
        console.log('Room Not Found')
      }
    }

    socket?.on('joined', handleJoinedRoom);

    return () => {
      socket?.off('created');
      socket?.off('joined', handleJoinedRoom);
    };
  }, [roomId, router, setRoomDetails]);

  function handleCreateRoom() {
    socket?.emit('createRoom', username);
  }

  const handleJoinRoom = () => {
    if (roomId) socket?.emit('joinRoom', roomId, username);
  };

  return (
    <main>
      <label htmlFor="username">Enter your username</label>
      <input
        type='text'
        name='username'
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <div>
        <h3>Join a room</h3>
        <label htmlFor="room-id">Enter your room id</label>
        <input
          type='text'
          name='room-id'
          placeholder="room id"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>

      <div>
        <h3>Create a room</h3>
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>
    </main>
  );
}