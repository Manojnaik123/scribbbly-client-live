export type PixelButtonProps = {
    label: string
    onClick? : () => void
    color?: 'green' | 'cyan' | 'pink' | 'yellow' | 'gray'
    fullWidth? : boolean
    className? : string
    disabled? : boolean
}