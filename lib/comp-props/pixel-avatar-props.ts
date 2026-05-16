import { AVATAR_COLORS } from "../colors/all-colors";

export type AvatarColorType = typeof AVATAR_COLORS[number]

export type PixelAvatarProps = {
    color : AvatarColorType
    scale: number
    active? : boolean
    onClick?: () => void
    className?: string
}