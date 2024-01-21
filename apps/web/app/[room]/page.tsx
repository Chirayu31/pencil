'use client'
import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { roomAtom } from '../../atoms/room'

const Room = () => {
    const room = useRecoilValue(roomAtom)

    useEffect(() => {
        console.log(room)
    }, [])

    return (
        <div>Room</div>
    )
}

export default Room