import { atom } from 'recoil';
import { Room } from '@repo/types';

export const DEFAULT_ROOM: Room = {
    id: '',
    users: new Map<string, string>(),
    prevMoves: []
};

export const roomAtom = atom<Room>({
    key: 'roomAtom',
    default: DEFAULT_ROOM
})