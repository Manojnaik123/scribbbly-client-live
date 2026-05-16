'use client'

import { Room } from '@shared/room';
import React, { useEffect, useState } from 'react'
import PlayerRow from './player-row';
import socket from '@/lib/socket/socket';



const PlayersList = ({ room }: { room: Room }) => {
    
  return (
    <div className="w-full h-full shrink-0 bg-background border-r-2 border-border flex flex-col">
      {/* Header */}
      <div className="bg-green px-3 py-2">
        <span className="text-black text-[8px]">PLAYERS</span>
      </div>

      {/* Player rows */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {room && room.players.map((player) => (
          <PlayerRow key={player.id} player={player} isActive={ (room.turnOrder ?? [])[(room.currentDrawerIndex ?? 0)] === player.id } />
        ))}
      </div>
    </div>
  )
}

export default PlayersList