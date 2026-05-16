'use client'

import socket from '@/lib/socket/socket';
import { Room } from '@shared/room';
import { TIMER_TICK } from '@shared/socket-names';
import React, { useEffect, useState } from 'react'

const GameRommMiniNavbar = ({ room }: { room: Room }) => {
    const [timer, setTimer] = useState<number | null>(null)

    useEffect(() => {
        const handleTimerTick = (
            timer: number | null
        ) => {
            setTimer(timer)
        }

        socket.on(TIMER_TICK, handleTimerTick)

        return () => {
            socket.off(
                TIMER_TICK,
                handleTimerTick
            )
        }
    }, [])

    return (
        <div className='flex justify-start items-center px-2 py-1 md:px-4 md:py-2 gap-4'>
            {(room.phase === 'drawing' || room.phase === 'selecting-word') && (
                <div className='text-[10px] sm:text-[14px] border-2 p-1 md:p-4 border-green text-green'>
                    {timer ?? 'X'}
                </div>
            )}
            <div className=' flex flex-col'>
                <span className='text-[6px] sm:text-[8px] text-yellow'>Round</span>
                <span className="text-[8px] sm:text-[10px] text-text-white">{room.curRound} / {room?.maxRounds}</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-1 min-w-0">
                <span className="text-[6px] sm:text-[7px] text-pink">CURRENT GUESS:</span>
                <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                    {(room?.currentWord ?? '').split('').map((letter, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            {socket.id === room.turnOrder[room.currentDrawerIndex] ? (
                                <span className="text-[11px] sm:text-[14px] text-text-white w-4 sm:w-5">{letter || ' '}</span>
                            ) : (
                                <>
                                    <span className="text-[11px] sm:text-[14px] text-text-white w-4 sm:w-5">{' '}</span>
                                    <div className="w-4 sm:w-5 h-0.5 bg-text-white " />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GameRommMiniNavbar