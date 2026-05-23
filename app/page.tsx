'use client'

import { useState } from 'react'
import { Suspense } from 'react'
import Navbar from '@/components/landing-navbar';
import LandingPageLogo from '@/components/landing-page-logo';
import InformationSection from '@/components/information-section';
import Footer from '@/components/footer';
import GameStartingCard from '@/components/game-starting-card';
import { LanguageType } from '@shared/language';
import GameRoom from '@/components/game-room';

export default function Home() {
  const [roomId, setRoomId] = useState('')
  const [activeAvatarIndex, setActiveAvatarIndex] = useState(0)
  const [enteredUserName, setEnteredUserName] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>('ENGLISH')

  const Overlays = () => (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{ background: 'repeating-linear-gradient(transparent 0px, transparent 1px, rgba(0,0,0,0.15) 1px, rgba(0,0,0,0.15) 2px)' }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.7) 100%)' }}
      />
    </>
  )

  if (roomId) {
    return (
      <div className="min-h-screen  flex flex-col bg-background text-white">
        <Overlays />
        <Navbar />
        <GameRoom
          selectedLanguage={selectedLanguage}
          enteredUserName={enteredUserName}
          activeAvatarIndex={activeAvatarIndex}
          roomId={roomId}
        />
        <Footer />
      </div>
    )
  }

  return (
    <Suspense fallback={null}>
      <div className="min-h-screen flex flex-col bg-background text-white">
        <Overlays />

        <Navbar  />
        <div className="w-full h-1 bg-yellow" />

        <main className="flex-1 flex flex-col items-center px-4 py-8 gap-8">
          <LandingPageLogo />

          <p className="text-green text-[6px] sm:text-[8px] tracking-widest text-center">
            {`>> DRAW. GUESS. WIN. <<`}
          </p>

          <GameStartingCard
            roomId={roomId}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            setRoomId={setRoomId}
            enteredUserName={enteredUserName}
            setEnteredUserName={setEnteredUserName}
            activeAvatarIndex={activeAvatarIndex}
            setActiveAvatarIndex={setActiveAvatarIndex}
          />

          <InformationSection />
        </main>
        <Footer />
      </div>
    </Suspense>
  )
}