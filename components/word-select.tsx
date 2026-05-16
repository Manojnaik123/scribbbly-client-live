import { Room } from '@shared/room';
import React from 'react'
import GameRommMiniNavbar from './game-room-mini-navbar';
import socket from '@/lib/socket/socket';
import { WORD_SELECTED } from '@shared/socket-names';

const WordSelect = ({ room }: { room: Room }) => {

    const curPlayerId = room.turnOrder[room.currentDrawerIndex]

    const isDrawer = curPlayerId === socket.id

    function handleWordSelection(word: string) {
        socket.emit(WORD_SELECTED, {
            word,
            roomId : room.id
        })
    }

    return (
        <div className='relative flex flex-col h-full'>
            {/* OVERLAY */}
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

                <div className="bg-card-background border-4 border-yellow shadow-[8px_8px_0_#000] 
                                px-6 py-5 w-full h-full flex flex-col justify-center items-center  gap-4 relative">

                    {/* Top tag */}
                    <span className="absolute -top-3 right-4 bg-yellow text-black text-[7px] px-2 py-0.5">
                        WORD_SELECT_v1
                    </span>

                    {/* Title */}
                    <h2 className="text-text-white text-[10px] sm:text-[12px]">
                        {isDrawer ? 'CHOOSE A WORD' : `${room.players.find(p => p.id === curPlayerId)?.name} IS CHOOSING A WORD`}
                    </h2>

                    {/* Options */}
                    {isDrawer ? (
                        <div className="flex gap-3 flex-wrap justify-center items-center">
                            {room.wordOptions.map((w, i) => (
                                <button
                                    key={w}
                                    onClick={() => handleWordSelection(w)}
                                    className="
                                            bg-linear-to-b from-pink to-dark-pink
                                            border-2 border-border
                                            text-yellow
                                            text-[8px] sm:text-[9px]
                                            px-3 py-2
                                            shadow-[3px_3px_0_#000]
                                            hover:text-yellow
                                            hover:border-yellow
                                            active:translate-x-0.5
                                            active:translate-y-0.5
                                            active:shadow-none
                                            transition-all"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-text-white/50 text-[7px] sm:text-[9px] animate-pulse">PLEASE WAIT...</p>
                    )}

                </div>
            </div>

        </div>
    )
}

export default WordSelect