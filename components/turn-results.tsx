import { Room } from '@shared/room'
import socket from '@/lib/socket/socket'
import React from 'react'

const GUESS_POINTS = [7, 5, 3, 1]

const TurnResults = ({ room }: { room: Room }) => {
  const correctGuesses = room.correctGuesses ?? []
  const drawerId = room.turnOrder[room.currentDrawerIndex]
  const drawer = room.players.find(p => p.id === drawerId)
  const anyGuessed = correctGuesses.length > 0
  const currentSocketId = socket.id

  const correctPlayers = correctGuesses
    .map((id, i) => ({
      player: room.players.find(p => p.id === id)!,
      points: GUESS_POINTS[i] ?? 1,
      correct: true,
    }))
    .filter(entry => entry.player)

  const missedPlayers = room.players
    .filter(p => !correctGuesses.includes(p.id) && p.id !== drawerId)
    .map(player => ({ player, points: 0, correct: false }))

  const allResults = [...correctPlayers, ...missedPlayers]

  return (
    <div className="h-full bg-card-background border-4 border-green w-full p-6 sm:p-8 flex flex-col items-center gap-4 relative overflow-y-auto">

      <h2 className="text-text-white text-[12px] sm:text-[14px] text-center">
        THE WORD WAS <span className="text-yellow">{room.currentWord}</span>
      </h2>

      {anyGuessed ? (
        <p className="text-green text-[9px] sm:text-[10px]">RESULTS OF THIS TURN</p>
      ) : (
        <p className="text-[#c80d0d] text-[9px] sm:text-[10px]">NO ONE GUESSED CORRECT</p>
      )}

      <div className="w-full flex flex-col gap-2">

        {allResults.map(({ player, points, correct }) => {
          const isMe = player.id === currentSocketId

          return (
            <div
              key={player.id}
              className={`flex justify-between items-center px-3 py-2 shadow-[3px_3px_0_#000]
                ${isMe
                  ? 'bg-[#1a2a1a] border-2 border-green'
                  : 'bg-[#0f1330] border border-dark-blue'
                }`}
            >
              <div className="flex items-center gap-2">
                {correct && <span className="text-green text-[7px]">✓</span>}
                <span className={`text-[9px] sm:text-[10px] ${isMe ? 'text-green' : 'text-text-white'}`}>
                  {player.name}
                  {isMe && <span className="text-[6px] text-green ml-1">(YOU)</span>}
                </span>
              </div>
              <span className={`text-[9px] sm:text-[10px] ${correct ? 'text-green' : 'text-[#c80d0d]'}`}>
                {correct ? `+${points}` : '-'}
              </span>
            </div>
          )
        })}

        {/* Drawer row */}
        {drawer && (
          <div className={`flex justify-between items-center px-3 py-2 shadow-[3px_3px_0_#000] mt-1
            ${drawer.id === currentSocketId
              ? 'bg-[#1a2a1a] border-2 border-green'
              : 'bg-[#0f1330] border-2 border-green'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-yellow text-[7px]">✏️</span>
              <span className={`text-[9px] sm:text-[10px] ${drawer.id === currentSocketId ? 'text-green' : 'text-text-white'}`}>
                {drawer.name}
                {drawer.id === currentSocketId
                  ? <span className="text-[6px] text-green ml-1">(YOU)</span>
                  : <span className="text-grey text-[6px] ml-1">(DRAWER)</span>
                }
              </span>
            </div>
            <span className={`text-[9px] sm:text-[10px] ${anyGuessed ? 'text-green' : 'text-[#c80d0d]'}`}>
              {anyGuessed ? '+5' : '-'}
            </span>
          </div>
        )}
      </div>

      <span className="text-[7px] text-[#888] mt-auto">
        NEXT TURN STARTING...
      </span>
    </div>
  )
}

export default TurnResults