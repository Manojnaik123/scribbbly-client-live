'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Undo2, Trash } from 'lucide-react'
import { CANVAS_COLORS } from '@/lib/colors/all-colors';
import { Room } from '@shared/room';
import socket from '@/lib/socket/socket';
import { DRAW_LINE, DRAWING_UPDATED } from '@shared/socket-names';
import { Stroke } from '@shared/stroke';

const Canvas = ({ room }: { room: Room }) => {
    const [color, setColor] = useState<string>('black')

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const isDrawing = useRef<boolean>(false)
    const prePoint = useRef<{ x: number, y: number }>({ x: 0, y: 0 })
    const isDrawer = useRef<boolean>(false);

    isDrawer.current = room.turnOrder[room.currentDrawerIndex] === socket.id

    function drawLines(x1: number, y1: number, x2: number, y2: number, color: string) {
        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx) return
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
    }

    function emitLine(x1: number, y1: number, x2: number, y2: number) {
        socket.emit(DRAW_LINE, {
            roomId: room?.id,
            color,
            size: 2,
            x1, y1, x2, y2
        })
    }

    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
        if (!isDrawer.current) return
        isDrawing.current = true
        const rect = canvasRef.current!.getBoundingClientRect()
        prePoint.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
        if (!isDrawer.current || !isDrawing.current) return
        const canvas = canvasRef.current
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const curPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        drawLines(prePoint.current.x, prePoint.current.y, curPoint.x, curPoint.y, color)
        emitLine(prePoint.current.x, prePoint.current.y, curPoint.x, curPoint.y)
        prePoint.current = curPoint
    }

    function handleMouseUp() {
        if (!isDrawer.current) return
        isDrawing.current = false
    }

    function handleTouchStart(e: React.TouchEvent<HTMLCanvasElement>) {
        if (!isDrawer.current) return
        e.preventDefault()
        const rect = canvasRef.current!.getBoundingClientRect()
        const touch = e.touches[0]
        isDrawing.current = true
        prePoint.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
    }

    function handleTouchMove(e: React.TouchEvent<HTMLCanvasElement>) {
        if (!isDrawer.current || !isDrawing.current) return
        e.preventDefault()
        const canvas = canvasRef.current
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const touch = e.touches[0]
        const curPoint = { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
        drawLines(prePoint.current.x, prePoint.current.y, curPoint.x, curPoint.y, color)
        emitLine(prePoint.current.x, prePoint.current.y, curPoint.x, curPoint.y)
        prePoint.current = curPoint
    }

    function handleTouchEnd() {
        isDrawing.current = false
    }

    function handleClear() {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    function handleUndo() {
        // undo logic can be added later
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height

        socket.on(DRAWING_UPDATED, (stroke: Stroke) => {
            drawLines(stroke.x1, stroke.y1, stroke.x2, stroke.y2, stroke.color)
        })

        return () => {
            socket.off(DRAWING_UPDATED)
        }
    }, [])

    return (
        <div className="h-full w-full flex flex-col">
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full h-full bg-white border-4 border-green"
                style={{ touchAction: 'none' }}
            />

            {/* Toolbar */}
            {isDrawer.current && (
                <div className='bg-card-background h-12 md:h-16 p-2 flex justify-between items-center border-4 border-t-0 border-green'>

                    {/* Colors */}
                    <div className='grid grid-cols-4 grid-rows-2 gap-0.5'>
                        {CANVAS_COLORS.map((butColor) => (
                            <button
                                onClick={() => setColor(butColor)}
                                key={butColor}
                                className={`${color === butColor ? 'border-2' : 'border-0'} hover:border-2 border-grey h-4 w-4 md:h-6 md:w-6`}
                                style={{ backgroundColor: butColor }}
                            />
                        ))}
                    </div>

                    {/* Brush size placeholder */}
                    <div className='relative group'>
                        <button className="border-2 border-black bg-gray-600 text-green h-8 w-8 md:h-12 md:w-12 flex justify-center items-center shadow-[3px_3px_0_#000]">
                            <div className='h-2 w-2 bg-green-500 rounded-full'></div>
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card-background border-2 border-black text-green px-2 py-1 text-[7px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-[3px_3px_0_#000]"
                            style={{ fontFamily: "'Press Start 2P', monospace" }}>
                            Choose brush stroke
                        </div>
                    </div>

                    {/* Undo + Clear */}
                    <div className='flex gap-2'>
                        <div className='relative group'>
                            <button
                                onClick={handleUndo}
                                className="border-2 border-border bg-gray-600 text-green h-8 w-8 md:h-12 md:w-12 flex justify-center items-center shadow-[3px_3px_0_#000]"
                            >
                                <Undo2 size={18} strokeWidth={3} />
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card-background border-2 border-border text-green px-2 py-1 text-[7px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-[3px_3px_0_#000]">
                                UNDO
                            </div>
                        </div>

                        <div className='relative group'>
                            <button
                                onClick={handleClear}
                                className="border-2 border-black bg-gray-600 text-green h-8 w-8 md:h-12 md:w-12 flex justify-center items-center shadow-[3px_3px_0_#000]"
                            >
                                <Trash size={18} strokeWidth={3} />
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card-background border-2 border-black text-red px-2 py-1 text-[7px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-[3px_3px_0_#000]">
                                CLEAR
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Canvas