import React from 'react'
import InfoCard from './info-card';
import { HARDCODED_NEWS_ITEMS } from '@/lib/constants/all-texts';


const InformationSection = () => {
    return (
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-strech">
            <InfoCard title="// ABOUT" accentColor="text-yellow" borderColor="border-yellow">
                SCRIBBBLY is the ultimate multiplayer drawing and guessing game. Join a lobby, grab your pixel-brush, and outsmart your friends. No installation required.
            </InfoCard>

            <InfoCard title=">> NEWS" accentColor="text-pink" borderColor="border-pink">
                <div className="flex flex-col gap-3 overflow-y-auto max-h-80 pr-1 flex-1 ">
                    {HARDCODED_NEWS_ITEMS.map((item) => (
                        <div key={item.date} className="border-l-2 border-pink pl-2 flex flex-col gap-1">
                            <span className="text-pink">{item.date}</span>
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            </InfoCard>

            <InfoCard title="?? HOW TO PLAY" accentColor="text-blue" borderColor="border-blue">
                <div className="flex flex-col gap-3">

                    {/* Steps */}
                    <div className="bg-black border-2 border-dark-blue p-3 text-green leading-7">
                        <p>1. DRAW ITEM</p>
                        <p>2. OTHERS GUESS</p>
                        <p>3. GAIN POINTS!</p>
                    </div>

                    {/* Extra info */}
                    <div className="flex flex-col gap-2 text-muted leading-6">
                        <div className="flex gap-2">
                            <span className="text-yellow shrink-0">✦</span>
                            <span>DRAWER PICKS FROM 3 SECRET WORDS EACH ROUND</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-yellow shrink-0">✦</span>
                            <span>FASTER GUESSES = MORE POINTS</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-yellow shrink-0">✦</span>
                            <span>DRAWER ALSO SCORES WHEN OTHERS GUESS RIGHT</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-pink shrink-0">✦</span>
                            <span className="text-pink">GAME ENDS AFTER ALL ROUNDS. HIGHEST SCORE WINS!</span>
                        </div>
                    </div>

                </div>
            </InfoCard>
        </div>
    )
}

export default InformationSection