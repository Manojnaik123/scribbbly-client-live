export default function GameNavbar({ roomName }: { roomName: string }) {
    return (
        <nav className="w-full h-12 bg-card-background border-b-4 border-green flex items-center justify-between px-4 shrink-0">
            <span className="text-green text-[13px]" style={{ textShadow: '2px 2px 0 #000' }}>
                SKRIBBBLY
            </span>
            <div className="flex items-center gap-3">
                {/* <span className="text-[8px] text-yellow">Invite link:</span>
                <span className="text-[8px] text-green border border-green px-2 py-1">{`http://localhost:3000/?roomId=${roomName}`}</span> */}
            </div>
        </nav>
    )
}
