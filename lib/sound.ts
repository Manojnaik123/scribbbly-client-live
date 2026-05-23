export function playSound(src: string, isMuted: boolean) {
    const audio = new Audio(src)
    audio.volume = isMuted ? 0 :  0.3
    audio.play()
}