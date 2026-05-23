'use client'

import { useEffect, useState } from 'react';
import { GameRoomProp } from '@/lib/comp-props/game-room-prop';
import { Room } from '@shared/room';
import { Player } from '@shared/player';
import { JOIN_ROOM, ROOM_UPDATED, START_GAME } from '@shared/socket-names'
import { AVATAR_COLORS } from '@/lib/colors/all-colors';

import GameNavbar from './game-navbar';
import PlayersList from './player-list';
import ChatPanel from './chat-panel';
import socket from '@/lib/socket/socket';
import WaitingRoom from './waiting-room';
import WordSelect from './word-select';
import GameRommMiniNavbar from './game-room-mini-navbar';
import Canvas from './canvas';
import Leaderboard from './leaderboard';
import TurnResults from './turn-results';
import Navbar from './landing-navbar';
import { playSound } from '@/lib/sound';
import { useMute } from '@/context/mute-context';
import { AlertTriangle } from 'lucide-react';


const GameRoom = ({ roomId, activeAvatarIndex, enteredUserName, selectedLanguage }: GameRoomProp) => {
    const [room, setRoom] = useState<Room | null>(null)

    const { isMuted } = useMute()

    useEffect(() => {

        const joinRoom = () => {
            socket.emit(JOIN_ROOM, roomId, selectedLanguage, {
                avatarColor: AVATAR_COLORS[activeAvatarIndex],
                name: enteredUserName
            } as Player)
        }

        if (socket.connected) {
            joinRoom()
        } else {
            socket.on('connect', joinRoom)
        }

        socket.on(ROOM_UPDATED, (room: Room) => {
            playSound('sounds/start.mp3', isMuted);
            setRoom(room)
        })

        return () => {
            socket.off(ROOM_UPDATED)
        }
    }, [])

    function onGameStart() {
        socket.emit(START_GAME, {
            roomId,
        })
    }

    return (
        <div className=' flex flex-col flex-1 overflow-hidden'>
            <div className="flex-1 grid grid-cols-2 grid-rows-2 md:grid-cols-5 md:grid-rows-1">

                {/* Section 2 */}
                <div className="order-1 col-span-2 row-span-1 md:order-2 md:col-span-3 flex flex-col h-full">
                    {room?.phase === 'waiting' ? (
                        <WaitingRoom room={room} isHost={room?.players.find(player => player.id === socket.id)?.isHost || false} onStart={onGameStart} roomId={room?.id ?? ''} />
                    ) : room?.phase === 'selecting-word' ? (
                        <>
                            <GameRommMiniNavbar room={room} />
                            <WordSelect room={room} />
                        </>
                    ) : room?.phase === 'drawing' ? (
                        <>
                            <GameRommMiniNavbar room={room} />
                            <Canvas room={room} />
                        </>
                    ) : room?.phase === 'turn-result' ? (
                        <TurnResults room={room} />
                    ) : room?.phase === 'next-round' ? (
                        <div className='flex gap-4 w-full h-full  justify-center items-center'> next round <span className='text-4xl animate-bounce text-red'>{room.curRound}</span></div>
                    ) : room?.phase === 'leaderboard' ? (
                        <Leaderboard room={room} />
                    ) : (
                       <div className='h-full w-full flex justify-center items-center'>
                         <div className="flex items-center gap-3 border-b-2 border-red pb-4">
                            <AlertTriangle className="h-6 w-6 text-red" />
                            <h1 className="font-['Press_Start_2P'] text-xs sm:text-sm text-red tracking-wider">
                                ROOM NOT FOUND
                            </h1>
                        </div>
                       </div>
                    )}
                </div>

                {/* <Sample/> */}

                {/* Section 1 */}
                <div className=" order-2 md:order-1 md:col-span-1 ">
                    {room && <PlayersList room={room} />}
                </div>

                {/* Section 3 */}
                <div className=" order-3 md:order-3 md:col-span-1 h-full overflow-hidden">
                    {room && <ChatPanel room={room} />}
                </div>

            </div>
        </div>
    )
}

export default GameRoom

