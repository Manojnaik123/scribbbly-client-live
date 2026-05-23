'use client'


import React, { useEffect, useState } from 'react'

import { log } from 'next/dist/server/typescript/utils';
import { Room } from '@shared/room';
import ChatLine from './chatline';
import { Message } from '@shared/messages';
import { GUESS, MESSAGES_UPDATED } from '@shared/socket-names';
import socket from '@/lib/socket/socket';
import { playSound } from '@/lib/sound';
import { useMute } from '@/context/mute-context';


const ChatPanel = ({ room }: { room: Room }) => {
    const [messages, setMessages] = useState<Message[] | null>(room.messages || [])
    const [guess, setGuess] = useState<string>('')

    const isDrawing = room.turnOrder[room.currentDrawerIndex] === socket.id

    const { isMuted } = useMute()

    function onGuessSubmit() {

        socket.emit(GUESS, {
            guess: guess,
            roomId: room.id
        })

        setGuess('')
    }

    useEffect(() => {
        socket.on(MESSAGES_UPDATED, (messages: Message[]) => {
            setMessages(messages)
        })

        return () => {
            socket.off(MESSAGES_UPDATED)
        }
    }, [])

    return (
        <div className="flex flex-col h-full max-h-full overflow-hidden w-full  bg-background border-l-2 border-border">

            <div className="bg-card-background border-b-2 border-border px-3 py-2 shrink-0">
                <span className="text-pink text-[7px] sm:text-[8px]">CHAT LOG</span>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-1 px-2 sm:px-3 py-2 ">
                {messages && (messages || []).map((msg, index) => (
                    <ChatLine key={`${msg.playerId}-${msg.text}-${index}`} message={msg} />
                ))}
            </div>

            {/* Input — always at bottom, never cut off */}
            <div className="shrink-0 border-t-4 border-green flex items-center px-2 py-2 gap-2 bg-background">
                <span className="text-green text-[9px] shrink-0">{'>'}</span>
                <input
                    type="text"
                    value={guess}
                    onChange={(e) => {
                        playSound('sounds/type.mp3', isMuted)
                        setGuess(e.target.value)
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && onGuessSubmit()}
                    placeholder={isDrawing ? room.phase === 'waiting' ? 'YOU WILL DRAW FIRST' : 'YOU ARE DRAWING' : 'TYPE GUESS_'}
                    disabled={isDrawing}
                    className="flex-1 min-w-0 bg-transparent text-green text-[6px] sm:text-[7px] outline-none placeholder:text-green/50 disabled:text-grey disabled:placeholder:text-grey/50"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                />
            </div>
        </div>
    )
}

export default ChatPanel