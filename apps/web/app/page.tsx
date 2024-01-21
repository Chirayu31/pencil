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
    <main className="flex flex-col w-full h-screen min-h-screen overflow-hidden items-center pt-8">

      <h1 className="font-bold text-[96px] mb-2">Pencil</h1>
      <label className="text-xl mb-2" htmlFor="username">Enter your username</label>
      <input
        type='text'
        name='username'
        placeholder="Enter your Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-[300px] rounded-full p-3 border border-gray-500 pl-4 text-lg "
      />

      <div className="flex flex-col items-center mt-10 gap-4">
        <h3 className="font-semibold text-3xl text-center ">Join a room</h3>
        <label className="text-xl" htmlFor="room-id">Enter your room id</label>
        <input
          type='text'
          name='room-id'
          placeholder="Enter Room Id"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-[300px] rounded-full p-3 border border-gray-500 pl-4 text-lg "
        />
        <button className="bg-yellow-300 p-4 w-[200px] rounded-full text-lg  font-semibold " onClick={handleJoinRoom}>Join Room</button>
      </div>

      <div className="flex flex-col items-center mt-20 gap-4">
        <h3 className="font-semibold text-3xl text-center">Create a room</h3>
        <button className="bg-green-300 p-4 w-[200px] rounded-full text-lg font-semibold " onClick={handleCreateRoom}>Create Room</button>
      </div>
    </main>
  );
}