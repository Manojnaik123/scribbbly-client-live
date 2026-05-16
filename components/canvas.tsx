'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Undo2, Trash, CarTaxiFront } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { CANVAS_COLORS } from '@/lib/colors/all-colors';
import { Room } from '@shared/room';
import socket from '@/lib/socket/socket';
import { DrawStroke } from '@/lib/comp-props/stroke-type';
import { DRAW_LINE, DRAWING_UPDATED } from '@shared/socket-names';
import { Stroke } from '@shared/stroke';

const Canvas = ({ room }: { room: Room }) => {
    const [color, setColor] = useState<string>('black')

    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    const isDrawing = useRef<boolean>(false)

    const prePoint = useRef<{ x: number, y: number }>({
        x: 0,
        y: 0,
    })

    const isDrawer = useRef<boolean>(false);

    isDrawer.current = true

    function drawLines(x1: number, y1: number, x2: number, y2: number, color: string) {
        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx) return
        ctx.strokeStyle = color
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)

        ctx.stroke()
    }

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
        if (!isDrawer.current) return
        if (!isDrawing.current) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')

        const rect = canvas.getBoundingClientRect()

        const curPoint = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }

        drawLines(
            prePoint.current.x,
            prePoint.current.y,
            curPoint.x,
            curPoint.y,
            color
        )

        socket.emit(DRAW_LINE, {
            roomId: room?.id,
            color: color,
            size: 1,
            x1: prePoint.current.x,
            y1: prePoint.current.y,
            x2: curPoint.x,
            y2: curPoint.y
        })

        prePoint.current = curPoint
    }

    function handleMouseUp() {
        if (!isDrawer.current) return

        isDrawing.current = false
    }

    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
        if (!isDrawer.current) return

        isDrawing.current = true

        const rect = canvasRef.current!.getBoundingClientRect()

        prePoint.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return
        const react = canvas.getBoundingClientRect()
        canvas.width = react.width
        canvas.height = react.height

        const ctx = canvas?.getContext('2d');

        if (!ctx) return


        socket.on(DRAWING_UPDATED, (stroke: Stroke) => {
            drawLines(stroke.x1, stroke.y1, stroke.x2, stroke.y2, stroke.color)
        })

        return () => {
            socket.off(DRAWING_UPDATED)
        }

    }, [])

    return (
        <div className={` ${!isDrawer && 'cursor-not-allowed'} h-full w-full flex flex-col`}>
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className={`${!isDrawer && 'cursor-not-allowed'}  w-full h-full bg-white border-4 border-green`}>
            </canvas>
            <div className='bg-card-background h-12 md:h-16 p-2 flex justify-between items-center border-4 border-t-0 border-green'>
                <div className='grid grid-cols-4 grid-rows-2'>
                    {CANVAS_COLORS.map((butColor) => (
                        <button
                            onClick={() => setColor(butColor)}
                            key={butColor}
                            className={` ${color === butColor ? 'border-2' : 'border-0'} 
                                hover:border-2 border-grey
                            h-4 w-4 md:h-6 md:w-6 
                            `}
                            style={{ backgroundColor: butColor }}
                        />
                    ))}
                </div>
                <div className='bg-emerald-900'>
                    <div className='relative group'>
                        <button
                            className="
                            border-2 border-black
                            bg-gray-600
                            text-green
                            h-8
                            w-8
                            md:h-12
                            md:w-12
                            flex justify-center items-center
                            shadow-[3px_3px_0_#000]
                        "
                        >
                            <div className='h-2 w-2 bg-green-500 rounded-full'></div>
                        </button>

                        {/* Tooltip */}
                        <div
                            className="
                            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                            bg-card-background
                            border-2 border-black
                            text-green
                            px-2 py-1
                            text-[7px]
                            whitespace-nowrap
                            opacity-0 group-hover:opacity-100
                            pointer-events-none
                            shadow-[3px_3px_0_#000]
                        "
                            style={{ fontFamily: "'Press Start 2P', monospace" }}
                        >
                            Choose brush stroke
                        </div>
                    </div>
                </div>
                <div className='flex gap-2'>

                    {/* Undo */}
                    <div className='relative group'>
                        <button
                            className="
                                border-2 border-border
                                 bg-gray-600
                                text-green
                               h-8
                            w-8
                            md:h-12
                            md:w-12
                                flex justify-center items-center
                                shadow-[3px_3px_0_#000]
                            "
                        >
                            <Undo2 size={18} strokeWidth={3} />
                        </button>

                        {/* Tooltip */}
                        <div
                            className="
                            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                            bg-card-background
                            border-2 border-border
                            text-green
                            px-2 py-1
                            text-[7px]
                            whitespace-nowrap
                            opacity-0 group-hover:opacity-100
                            pointer-events-none
                            shadow-[3px_3px_0_#000]
                        "
                        >
                            UNDO
                        </div>
                    </div>

                    {/* Clear */}
                    <div className='relative group'>
                        <button
                            className="
                            border-2 border-black
                             bg-gray-600
                            text-green
                            h-8
                            w-8
                            md:h-12
                            md:w-12
                            flex justify-center items-center
                            shadow-[3px_3px_0_#000]
                        "
                        >
                            <Trash size={18} strokeWidth={3} />
                        </button>

                        {/* Tooltip */}
                        <div
                            className="
                            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                            bg-card-background
                            border-2 border-black
                            text-red
                            px-2 py-1
                            text-[7px]
                            whitespace-nowrap
                            opacity-0 group-hover:opacity-100
                            pointer-events-none
                            shadow-[3px_3px_0_#000]
                        "
                        >
                            CLEAR
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Canvas