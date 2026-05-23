'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Undo2, Trash } from 'lucide-react'
import { CANVAS_COLORS } from '@/lib/colors/all-colors';
import { Room } from '@shared/room';
import socket from '@/lib/socket/socket';
import { DRAW_LINE, DRAWING_UPDATED } from '@shared/socket-names';
import { Stroke } from '@shared/stroke';
import { playSound } from '@/lib/sound';
import { useMute } from '@/context/mute-context';

const STROKE_SIZES = [2, 5, 10];

type DrawnStroke = {
    x1: number; y1: number;
    x2: number; y2: number;
    color: string; size: number;
}

const Canvas = ({ room }: { room: Room }) => {
    const [color, setColor] = useState<string>('#000000')
    const [strokeSize, setStrokeSize] = useState<number>(2)
    const [showSizePicker, setShowSizePicker] = useState<boolean>(false)

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const isDrawing = useRef<boolean>(false)
    const prePoint = useRef<{ x: number, y: number }>({ x: 0, y: 0 })
    const isDrawer = useRef<boolean>(false)
    const strokeHistory = useRef<DrawnStroke[][]>([])
    const currentStroke = useRef<DrawnStroke[]>([])

    const { isMuted } = useMute()

    isDrawer.current = room.turnOrder[room.currentDrawerIndex] === socket.id

    function redrawAll() {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (const group of strokeHistory.current) {
            for (const s of group) {
                drawLine(ctx, s.x1, s.y1, s.x2, s.y2, s.color, s.size)
            }
        }
    }

    function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, size: number) {
        ctx.strokeStyle = color
        ctx.lineWidth = size
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
    }

    function drawLines(x1: number, y1: number, x2: number, y2: number, color: string, size: number = strokeSize) {
        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx) return
        drawLine(ctx, x1, y1, x2, y2, color, size)
    }

    function emitLine(x1: number, y1: number, x2: number, y2: number) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        socket.emit(DRAW_LINE, {
            roomId: room?.id,
            color,
            size: strokeSize,
            x1: x1 / canvas.width,
            y1: y1 / canvas.height,
            x2: x2 / canvas.width,
            y2: y2 / canvas.height,
        });
    }

    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
        if (!isDrawer.current) return
        isDrawing.current = true
        currentStroke.current = []
        const rect = canvasRef.current!.getBoundingClientRect()
        prePoint.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
        if (!isDrawer.current || !isDrawing.current) return
        const canvas = canvasRef.current
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const curPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        drawLines(prePoint.current.x, prePoint.current.y, curPoint.x, curPoint.y, color, strokeSize)
        emitLine(prePoint.current.x, prePoint.current.y, curPoint.x, curPoint.y)
        currentStroke.current.push({ x1: prePoint.current.x, y1: prePoint.current.y, x2: curPoint.x, y2: curPoint.y, color, size: strokeSize })
        prePoint.current = curPoint
    }

    function handleMouseUp() {
        if (!isDrawer.current) return
        if (currentStroke.current.length > 0) {
            strokeHistory.current.push([...currentStroke.current])
            currentStroke.current = []
        }
        isDrawing.current = false
    }

    function handleTouchStart(e: React.TouchEvent<HTMLCanvasElement>) {
        if (!isDrawer.current) return
        e.preventDefault()
        currentStroke.current = []
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
        drawLines(prePoint.current.x, prePoint.current.y, curPoint.x, curPoint.y, color, strokeSize)
        emitLine(prePoint.current.x, prePoint.current.y, curPoint.x, curPoint.y)
        currentStroke.current.push({ x1: prePoint.current.x, y1: prePoint.current.y, x2: curPoint.x, y2: curPoint.y, color, size: strokeSize })
        prePoint.current = curPoint
    }

    function handleTouchEnd() {
        if (currentStroke.current.length > 0) {
            strokeHistory.current.push([...currentStroke.current])
            currentStroke.current = []
        }
        isDrawing.current = false
    }

    function handleClear() {
        playSound('sounds/select.mp3', isMuted);
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        strokeHistory.current = []
    }

    function handleUndo() {
        playSound('sounds/select.mp3', isMuted);
        strokeHistory.current.pop()
        redrawAll()
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        function resizeCanvas() {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            if (canvas.width !== rect.width || canvas.height !== rect.height) {
                canvas.width = rect.width;
                canvas.height = rect.height;
                redrawAll();
            }
        }

        resizeCanvas();

        const observer = new ResizeObserver(resizeCanvas);
        observer.observe(canvas);

        socket.on(DRAWING_UPDATED, (stroke: Stroke) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            drawLines(
                stroke.x1 * canvas.width,
                stroke.y1 * canvas.height,
                stroke.x2 * canvas.width,
                stroke.y2 * canvas.height,
                stroke.color,
                stroke.size ?? 2
            );
        });

        return () => {
            observer.disconnect();
            socket.off(DRAWING_UPDATED);
        };
    }, []);

    return (
        <div className="h-full w-full relative">
            {/* Canvas fills entire container */}
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full max-h-screen bg-white border-4 border-green"
                style={{ touchAction: 'none' }}
            />

            {/* Toolbar floats above canvas */}
            {isDrawer.current && (
                <div className='absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 bg-card-background/95 border-2 border-green px-3 py-2 shadow-[4px_4px_0_#000] w-2/3'>

                    {/* Colors */}
                    <div className='grid grid-cols-4 grid-rows-2 gap-0.5'>
                        {CANVAS_COLORS.map((butColor) => (
                            <button
                                onClick={() => { setColor(butColor); playSound('sounds/select.mp3', isMuted) }}
                                key={butColor}
                                className={`${color === butColor ? 'border-2 border-white' : 'border-0'} hover:border-2 hover:border-white h-4 w-4 md:h-5 md:w-5`}
                                style={{ backgroundColor: butColor }}
                            />
                        ))}
                    </div>

                    <div className='w-px h-8 bg-green/40 shrink-0' />

                    {/* Stroke size picker */}
                    <div className='relative shrink-0'>
                        <button
                            onClick={() => setShowSizePicker(p => !p)}
                            className="border-2 border-green/50 bg-gray-700 h-8 w-8 md:h-10 md:w-10 flex justify-center items-center shadow-[2px_2px_0_#000] hover:border-green"
                        >
                            <div
                                className='rounded-full'
                                style={{ width: strokeSize * 2, height: strokeSize * 2, backgroundColor: color }}
                            />
                        </button>

                        {showSizePicker && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card-background border-2 border-green px-2 py-2 flex flex-col gap-2 items-center shadow-[3px_3px_0_#000] z-20">
                                {STROKE_SIZES.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => { playSound('sounds/select.mp3', isMuted); setStrokeSize(size); setShowSizePicker(false) }}
                                        className={`flex items-center justify-center h-8 w-8 border-2 ${strokeSize === size ? 'border-green' : 'border-transparent'} hover:border-green bg-gray-700`}
                                    >
                                        <div
                                            className='rounded-full'
                                            style={{ width: size * 2, height: size * 2, backgroundColor: color }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='w-px h-8 bg-green/40 shrink-0' />

                    {/* Undo + Clear */}
                    <div className='flex gap-2 shrink-0'>
                        <div className='relative group'>
                            <button
                                onClick={handleUndo}
                                className="border-2 border-green/50 bg-gray-700 h-8 w-8 md:h-10 md:w-10 flex justify-center items-center shadow-[2px_2px_0_#000] hover:border-green text-green"
                            >
                                <Undo2 size={16} strokeWidth={3} />
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card-background border-2 border-green text-green px-2 py-1 text-[7px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-[2px_2px_0_#000]">
                                UNDO
                            </div>
                        </div>

                        <div className='relative group'>
                            <button
                                onClick={handleClear}
                                className="border-2 border-green/50 bg-gray-700 h-8 w-8 md:h-10 md:w-10 flex justify-center items-center shadow-[2px_2px_0_#000] hover:border-green text-green"
                            >
                                <Trash size={16} strokeWidth={3} />
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card-background border-2 border-green text-red px-2 py-1 text-[7px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-[2px_2px_0_#000]">
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