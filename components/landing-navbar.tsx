'use client'

import { useMute } from "@/context/mute-context";
import React from "react";

export default function Navbar() {

  const { isMuted, setIsMuted } = useMute()

  return (
    <nav className="shrink-0 w-full h-12 bg- border-b-4 border-green flex items-center justify-between px-6">
      <span className="font-['Press_Start_2P'] text-[13px] text-green shadow-[2px_2px_0_#000]">
        SKRIBBBLY
      </span>
      <div className="flex items-center gap-5 text-white">
        <button className="font-['Press_Start_2P'] text-[10px] transition-none" onClick={() => setIsMuted((prev) => !prev)}> {isMuted ? '🔊' : '🔇'}</button>
      </div>
    </nav>
  )
}
