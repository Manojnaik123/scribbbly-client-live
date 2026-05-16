'use client'


import { useEffect, useState } from "react";


import PixelSelect from "./pixel-select";
import { PixelSelectColor } from "@/lib/comp-props/pixel-select-props";
import { Room } from "@shared/room";
import socket from "@/lib/socket/socket";
import { DRAW_TIME, GAME_ROUNDS, LANGUAGES, PLAYER_COUNT } from "@/lib/constants/all-constants";
import { WaitingRoomProps } from "@/lib/comp-props/waiting-room-prop";

const settings: {
    label: string
    value: (string | number)[]
    color: PixelSelectColor
}[] = [
        { label: 'MAX PLAYERS', value: PLAYER_COUNT, color: 'yellow' },
        { label: 'DRAW TIME', value: DRAW_TIME, color: 'green' },
        { label: 'MAX ROUNDS', value: GAME_ROUNDS, color: 'pink' },
        { label: 'LANGUAGE', value: LANGUAGES, color: 'cyan' },
    ]

type IdentifierType = 'LANGUAGE' | 'MAX ROUNDS' | 'MAX PLAYERS' | 'DRAW TIME'

const settingKeyMap = {
    LANGUAGE: 'selectedLanguage',
    'MAX ROUNDS': 'maxRounds',
    'MAX PLAYERS': 'maxPlayersCount',
    'DRAW TIME': 'drawTime'
} as const

export default function WaitingRoom({ isHost, roomId, onStart }: WaitingRoomProps) {

    const [room, setRoom] = useState<Room | null>(null)

    const isRoomOwner: boolean = room?.players.find(player => player.isHost === true)?.id === socket.id

    const copyInvite = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url)
    }

    function handleSelectChange(identifier: IdentifierType, value: (string | number)) {
        console.log(identifier, value);

        const roomProp = settingKeyMap[identifier]

        socket.emit('settings-change', {
            roomId,
            roomProp,
            value
        })
    }

    useEffect(() => {
    }, [])

    return (
        <div className={`flex flex-col gap-4 p-4 bg-[#1a1a3e] border-2 border-green w-full h-full ${isHost ? '' : 'cursor-not-allowed'} `}>

            <div className="text-center text-green text-[8px] tracking-widest animate-bounce">
                WAITING FOR PLAYERS...
            </div>

            {/* Settings */}
            <div className="flex flex-col gap-2">
                {settings.map(({ label, value, color }) => (
                    <div key={label + value + color} className="flex justify-between border-b border-[#2a2a5a] pb-2 text-[8px]">
                        <span className="text-[#888]">{label}</span>
                        <div className="flex w-1/2 ">
                            <PixelSelect
                                height="h-8"
                                onChange={(value) => handleSelectChange(label as IdentifierType, value)}
                                value={''}
                                options={value} color={color}
                                disabled={!isRoomOwner}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-auto">
                {isHost && (
                    <button
                        onClick={() => onStart()}
                        className="flex-1 py-3 bg-[#00c853] shadow-[3px_3px_0_#000]
                            border-2 border-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
                            text-white text-[10px] hover:bg-[#00a040] transition-colors">
                        START!
                    </button>
                )}
                <button
                    onClick={copyInvite}
                    className="flex-1 py-3 bg-[#2979ff]  text-white shadow-[3px_3px_0_#000]
                        border-2 border-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
                        text-[10px] hover:bg-[#1a56cc] transition-colors">
                    INVITE!
                </button>
            </div>

        </div>
    )
}