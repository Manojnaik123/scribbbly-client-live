'use client'

import { createContext, useContext, useState } from 'react'

type MuteContextType = {
  isMuted: boolean
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>
}

const MuteContext = createContext<MuteContextType | null>(null)

export function MuteProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMuted, setIsMuted] = useState(false)

  return (
    <MuteContext.Provider value={{ isMuted, setIsMuted }}>
      {children}
    </MuteContext.Provider>
  )
}

export function useMute() {
  const context = useContext(MuteContext)

  if (!context) {
    throw new Error('useMute must be used inside MuteProvider')
  }

  return context
}