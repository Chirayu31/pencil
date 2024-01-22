'use client'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { roomAtom } from '../../atoms/room'
import Canvas from './components/Canvas'

const Room = () => {
    const room = useRecoilValue(roomAtom)

    if (!room.id) {
        return (<>
            <p>
                room not found
            </p>
        </>)
    }

    return (
        <>
            <Canvas />
        </>
    )
}

export default Room