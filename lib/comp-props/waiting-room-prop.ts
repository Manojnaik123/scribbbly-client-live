import { Room } from "@/shared/room";

export type WaitingRoomProps = {
    room: Room
    isHost: boolean
    roomId: string
    onStart: () => void
}
