import { Room } from '@shared/room'
import socket from '@/lib/socket/socket'
import React from 'react'
import { RANK_STYLES } from '@/lib/colors/all-colors';



const MEDALS = ['👑', '🥈', '🥉']

const Leaderboard = ({ room }: { room: Room }) => {
  const currentSocketId = socket.id

  const sortedPlayers = [...room.players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  const rankedPlayers = sortedPlayers.map((player, i, arr) => {
    let rank: number
    if (i === 0) {
      rank = 1
    } else if ((player.score ?? 0) === (arr[i - 1].score ?? 0)) {
      rank = arr.findIndex(p => (p.score ?? 0) === (player.score ?? 0)) + 1
    } else {
      rank = i + 1
    }
    return { ...player, rank }
  })

  const top3 = rankedPlayers.filter(p => p.rank <= 3)
  const rest = rankedPlayers.filter(p => p.rank > 3)

  return (
    <div className="h-full w-full bg-card-background border-4 border-yellow overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-yellow tracking-wide">LEADERBOARD</span>
        <span className="text-[7px] text-green animate-pulse">★ FINAL</span>
      </div>

      <div className="h-px bg-dark-blue" />

      {/* Top 3 */}
      <div className="flex flex-col gap-2">
        {top3.map((player) => {
          const styleIndex = Math.min(player.rank - 1, 2)
          const style = RANK_STYLES[styleIndex]
          const isMe = player.id === currentSocketId

          return (
            <div
              key={player.id}
              className={`flex items-center border-2 ${style.border} bg-gradient-to-r ${style.bg}
                shadow-[3px_3px_0_#000] p-3
                ${isMe ? 'ring-2 ring-green ring-offset-1 ring-offset-black' : ''}
              `}
            >
              {/* Rank number */}
              <div className={`${style.numBg} ${style.size} text-black border-r-2 border-black mr-3 flex items-center justify-center shrink-0 font-bold`}>
                {player.rank}
              </div>

              {/* Name + medal */}
              <div className="flex-1 min-w-0">
                <div className={`text-[9px] sm:text-[10px] ${style.text} flex items-center gap-1`}>
                  <span>{MEDALS[styleIndex]}</span>
                  <span className="truncate">{player.name}</span>
                  {isMe && <span className="text-green text-[6px] ml-1">(YOU)</span>}
                </div>
                {player.rank === 1 && (
                  <span className="text-[6px] bg-yellow text-black px-1 py-0.5 mt-1 inline-block">★ WINNER</span>
                )}
              </div>

              {/* Score */}
              <div className={`${style.scoreSize} ${style.text} shrink-0 ml-2`}>
                {player.score ?? 0}
                <span className="text-[6px] text-grey ml-1">PTS</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Divider */}
      {rest.length > 0 && <div className="h-px bg-dark-blue" />}

      {/* Rest */}
      <div className="flex flex-col gap-2">
        {rest.map((player) => {
          const isMe = player.id === currentSocketId

          return (
            <div
              key={player.id}
              className={`flex items-center border-2 shadow-[3px_3px_0_#000] px-3 py-2
                ${isMe ? 'border-green bg-[#0a1a0a]' : 'border-dark-blue bg-[#0f0f2a]'}
              `}
            >
              {/* Rank number */}
              <div className="w-8 h-8 bg-dark-blue text-grey text-[9px] border-r-2 border-black mr-3 flex items-center justify-center shrink-0">
                {player.rank}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className={`text-[8px] truncate ${isMe ? 'text-green' : 'text-grey'}`}>
                  {player.name}
                  {isMe && <span className="text-[6px] ml-1">(YOU)</span>}
                </div>
              </div>

              {/* Score */}
              <div className="text-[9px] text-grey shrink-0 ml-2">
                {player.score ?? 0}
                <span className="text-[6px] ml-1">PTS</span>
              </div>
            </div>
          )
        })}
      </div>

      <span className="text-[7px] text-grey text-center mt-auto">
        THANKS FOR PLAYING!
      </span>
    </div>
  )
}

export default Leaderboard