'use client'

import { PlayerRowProps } from "@/lib/comp-props/player-row-props";
import PixelAvatar from "./pixel-avatar";
import socket from "@/lib/socket/socket";

export default function PlayerRow(
    { index, player, isActive }: PlayerRowProps
) {

    return (
        <div
            className={`
                        flex items-center gap-2 px-3 py-3 border-b border-card-background border-l-4
                        ${isActive ? 'bg-card-background border-l-yellow' : 'border-l-transparent'}
                    `}>

            {/* Rank */}
            <span className=" text-[6px] md:text-[7px] text-red w-3 md:w-5 shrink-0">
                {'# ' + index}
            </span>

            {/* Avatar */}
            <div className="shrink-0">
                <PixelAvatar
                    color={player.avatarColor ??'blue'}
                    scale={2}
                    className="hidden md:flex"
                    active={isActive}
                />

                <PixelAvatar
                    color={player.avatarColor ?? 'blue'}
                    scale={1}
                    className="sm:hidden"
                />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 min-w-0">
                <span
                    className={`text-[5px] md:text-[7px] truncate ${isActive ? 'text-blue' : 'text-text-white'
                        }`}
                >
                    {player.name}
                    {socket.id === player.id ? ' [YOU]' : ''}
                </span>

                <span className="text-[5px] md:text-[6px] text-green">
                    {player.score} PTS {player.isHost && '[Host]'}
                </span>
            </div>

            {/* Drawing indicator */}
            {isActive && (
                <span className="text-[10px] shrink-0 ml-auto">✏</span>
            )}
        </div>
    )
}