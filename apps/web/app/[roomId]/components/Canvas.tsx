import React, { useEffect, useState } from 'react'
import { useDraw } from '../../../hooks/useDraw'
import { Draw, DrawLineProps } from '@repo/types'
import { socket } from '../../../utils/socket'
import drawLineUtils from '../../../utils/drawLineUtils'
import { HexColorPicker } from 'react-colorful'

const Canvas = () => {
    const [color, setColor] = useState("#fff")
    const { canvasRef, onMouseDown, handleClear } = useDraw(createLine)

    function createLine({ prevPoint, currentPoint, ctx }: Draw) {
        socket.emit('draw_line', ({ prevPoint, currentPoint, color }))
        drawLineUtils({ prevPoint, currentPoint, ctx, color })
    }

    function eraseCanvas() {
        socket.emit('clear_canvas')
        handleClear()
    }

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');

        if (ctx) socket.emit("joined_room")

        socket.on("prevData", ({ prevMoves }: { prevMoves: DrawLineProps[] }) => {
            if (!ctx) return;

            for (let i = 0; i < prevMoves.length; i++) {
                drawLineUtils({
                    prevPoint: prevMoves[i]!.prevPoint,
                    currentPoint: prevMoves[i]!.currentPoint,
                    color: prevMoves[i]!.color,
                    ctx
                });
            }
        });

        socket.on('draw_line', ({ prevPoint, currentPoint, color }: DrawLineProps) => {
            if (!ctx) return;
            drawLineUtils({ prevPoint, currentPoint, ctx, color })
        })

        socket.on('clear_canvas', () => {
            handleClear()
        })

        return () => {
            socket.off('draw_line')
        }

    }, [])

    return (
        <>
            <div className='flex flex-col bg-black items-center justify-center max-h-screen max-w-screen overflow-hidden'>
                <canvas onMouseDown={onMouseDown}
                    ref={canvasRef}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    className='border-2 ' />
            </div>
            <div className='absolute top-0'>
                <div className='ml-10 mt-10'>
                    <HexColorPicker color={color} onChange={setColor} />
                </div>
                <button className='bg-white ml-10 mt-10 w-[200px] p-3 rounded-full text-xl' onClick={eraseCanvas}>clear</button>
            </div>
        </>
    )
}

export default Canvas