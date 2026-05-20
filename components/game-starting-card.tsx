'use client'

import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import PixelButton from './pixel-button';
import PixelAvatar from './pixel-avatar';
import { AVATAR_COLORS } from '@/lib/colors/all-colors';
import PixelSelect from './pixel-select';
import { LANGUAGES, LanguageType } from '@shared/language';
import { GameStartingCardProps } from '@/lib/comp-props/game-starting-card-props';
import { SERVER_URL } from '@/lib/constants/all-texts';

const GameStartingCard = ({
    roomId,
    setRoomId,
    selectedLanguage,
    setSelectedLanguage,
    enteredUserName,
    setEnteredUserName,
    activeAvatarIndex,
    setActiveAvatarIndex

}: GameStartingCardProps) => {

    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)

    const searchParams = useSearchParams()

    const searchParamRoomId = searchParams.get('roomId')

    const isInvitedUser = !!searchParamRoomId

    const router = useRouter()


    function prevAvatar() {
        setActiveAvatarIndex((i) => (i - 1 + AVATAR_COLORS.length) % AVATAR_COLORS.length)
    }

    function nextAvatar() {
        setActiveAvatarIndex((i) => (i + 1) % AVATAR_COLORS.length)
    }

    function randomAvatar() {
        setActiveAvatarIndex(Math.floor(Math.random() * AVATAR_COLORS.length))
    }

    async function handleCreateRoom() {
        setButtonDisabled(true)
        const res = await fetch(`${SERVER_URL}/create-room`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await res.json()

        if (!data) {
            setButtonDisabled(false)
            return
        }

        setRoomId(data.roomId)

        router.push(`?roomId=${data.roomId}`)
    }

    async function handlePLay() {
        if (searchParamRoomId) {
            setRoomId(searchParamRoomId)
        } else {
            console.log('you cannnot join room without referal');
        }
    }

    return (
        <>
            <Suspense fallback={null}>
                
                <div className="w-full border-b-4 border-yellow pb-4">
                    <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                        {AVATAR_COLORS.map((colorKey, i) => (
                            <div
                                key={colorKey}
                                className="bg-card-background p-1 border-2 border-border shadow-[3px_3px_0_#000] cursor-pointer hover:border-yellow"
                                style={{ animation: `pixelBounce 1.5s steps(2) infinite`, animationDelay: `${i * 0.15}s` }}
                                onClick={() => {
                                    setActiveAvatarIndex(i)
                                }}
                            >
                                {/* Smaller on mobile */}
                                <PixelAvatar color={colorKey} scale={2} active={i === activeAvatarIndex} className="sm:hidden" />
                                {/* larger on desktop */}
                                <PixelAvatar color={colorKey} scale={3} active={i === activeAvatarIndex} className="hidden sm:block" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='w-full max-w-lg border-4 border-yellow shadow-[8px_8px_0_#000] p-4 sm:p-6 flex flex-col gap-5 relative'>
                    <span className="absolute -top-3 right-4 bg-yellow text-black text-[7px] px-2 py-0.5 font-['Press_Start_2P']">
                        LOGIN_v1.94
                    </span>
                    <div className="flex flex-col gap-2">
                        <label className="text-[7px] sm:text-[8px] text-white">ENTER YOUR CODENAME:</label>
                        <input
                            type="text"
                            value={enteredUserName}
                            onChange={(e) => {
                                setEnteredUserName(e.target.value)
                            }}
                            placeholder="PLAYER_ONE"
                            maxLength={16}
                            className="w-full h-11 sm:h-12 bg-black border-2 border-green px-3 text-green text-[9px] sm:text-[10px] outline-none focus:border-yellow placeholder:text-green/50"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[7px] sm:text-[8px] text-white">LANGUAGE:</label>
                        <div className="flex gap-3">
                            <PixelSelect
                                value={selectedLanguage}
                                onChange={(value) => setSelectedLanguage(value as LanguageType)}
                                options={LANGUAGES}
                                color='pink'
                            />
                            <button
                                onClick={randomAvatar}
                                className="bg-dark-blue border-2 border-border text-white text-[7px] sm:text-[8px] px-3 sm:px-4 shadow-[3px_3px_0_#000] hover:bg-dark-blue/80 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                            >
                                ⚄ RANDOM
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[7px] sm:text-[8px] text-text-white text-center">CHOOSE AVATAR:</label>
                        <div className="flex items-center justify-center gap-4 bg-black border-2 border-dark-blue p-4">
                            <button
                                onClick={prevAvatar}
                                className="text-text-white text-xl w-8 h-8 bg-dark-blue border-2 border-black shadow-[3px_3px_0_#000] hover:bg-[#3d3d8b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center"
                            >
                                ‹
                            </button>
                            <PixelAvatar color={AVATAR_COLORS[activeAvatarIndex]} scale={4} className="sm:hidden" />
                            <PixelAvatar color={AVATAR_COLORS[activeAvatarIndex]} scale={6} className="hidden sm:block" />
                            <button
                                onClick={nextAvatar}
                                className="text-text-white text-xl w-8 h-8 bg-dark-blue border-2 border-black shadow-[3px_3px_0_#000] hover:bg-[#3d3d8b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                    <PixelButton label={`> ${isInvitedUser ? 'JOIN ROOM' : 'PLAY'}! <`} color="green" fullWidth onClick={handlePLay} />
                    <PixelButton label={`${ !buttonDisabled ?'[ CREATE PRIVATE ROOM ]' : '[ CREATING ROOM... ]'}`} color="cyan" fullWidth onClick={handleCreateRoom} disabled={buttonDisabled}/>
                </div>
            </Suspense>
        </>
    )
}

export default GameStartingCard

