'use client'


import { PixelAvatarProps } from '@/lib/comp-props/pixel-avatar-props';
import { useRef, useEffect } from 'react';

const PALLETS = {
    green: { body: '#3a8a3a', dark: '#1e5a1e', light: '#5ab85a', skin: '#f0b070', hair: '#2a5a2a', belt: '#8B6914', boot: '#1a3a1a', eye: '#111' },
    red: { body: '#aa2222', dark: '#6a1010', light: '#dd4444', skin: '#f0b070', hair: '#6a1010', belt: '#8B6914', boot: '#3a0808', eye: '#111' },
    blue: { body: '#2255aa', dark: '#112266', light: '#4488cc', skin: '#f0b070', hair: '#112266', belt: '#8B6914', boot: '#0a1a44', eye: '#111' },
    yellow: { body: '#ccaa00', dark: '#886600', light: '#ffdd44', skin: '#f0b070', hair: '#886600', belt: '#555', boot: '#443300', eye: '#111' },
    purple: { body: '#7733aa', dark: '#441166', light: '#aa55dd', skin: '#f0b070', hair: '#441166', belt: '#8B6914', boot: '#220844', eye: '#111' },
    cyan: { body: '#1188aa', dark: '#0a4466', light: '#33bbcc', skin: '#f0b070', hair: '#0a4466', belt: '#8B6914', boot: '#062233', eye: '#111' },
    orange: { body: '#cc5500', dark: '#883300', light: '#ff7722', skin: '#f0b070', hair: '#883300', belt: '#333', boot: '#441100', eye: '#111' },
    pink: { body: '#cc3377', dark: '#881144', light: '#ff66aa', skin: '#f0b070', hair: '#881144', belt: '#8B6914', boot: '#440022', eye: '#111' },
    gray: { body: '#556677', dark: '#334455', light: '#778899', skin: '#f0b070', hair: '#334455', belt: '#8B6914', boot: '#1a2233', eye: '#111' },
    white: { body: '#cccccc', dark: '#888888', light: '#eeeeee', skin: '#f0b070', hair: '#666666', belt: '#8B6914', boot: '#444444', eye: '#111' },
}

const PixelAvatar = ({
    color,
    scale,
    active,
    onClick,
    className
}: PixelAvatarProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');

        const pallet = PALLETS[color]

        function fillPixels(x: number, y: number, w: number, h: number, color: string) {
            if (!ctx) return
            ctx.fillStyle = color
            ctx.fillRect(x * scale, y * scale, w * scale, h * scale)
        }

        // helmet
        fillPixels(3, 0, 6, 1, pallet.dark)
        fillPixels(2, 1, 8, 1, pallet.body)
        fillPixels(2, 2, 8, 1, pallet.body)
        fillPixels(1, 2, 1, 1, pallet.dark)
        fillPixels(10, 2, 1, 1, pallet.dark)
        fillPixels(2, 3, 8, 1, pallet.dark)

        // Face
        fillPixels(2, 4, 8, 3, pallet.skin)
        fillPixels(3, 5, 2, 1, pallet.eye)
        fillPixels(7, 5, 2, 1, pallet.eye)
        fillPixels(5, 6, 2, 1, '#cc8855')

        // Neck
        fillPixels(5, 7, 2, 1, pallet.skin)

        // Torso
        fillPixels(2, 8, 8, 4, pallet.body)
        fillPixels(2, 8, 1, 4, pallet.dark)
        fillPixels(9, 8, 1, 4, pallet.dark)
        fillPixels(3, 8, 6, 1, pallet.light)

        // Belt
        fillPixels(2, 12, 8, 1, pallet.belt)
        fillPixels(5, 12, 2, 1, '#ffd700')

        // Left arm
        fillPixels(0, 8, 2, 4, pallet.body)
        fillPixels(0, 8, 1, 4, pallet.dark)
        fillPixels(0, 12, 2, 1, pallet.skin)
        fillPixels(0, 13, 2, 1, pallet.skin)

        // Right arm
        fillPixels(10, 8, 2, 4, pallet.body)
        fillPixels(11, 8, 1, 4, pallet.dark)
        fillPixels(10, 12, 2, 1, pallet.skin)
        fillPixels(10, 13, 2, 1, pallet.skin)

        // Legs
        fillPixels(2, 13, 3, 3, pallet.dark)
        fillPixels(7, 13, 3, 3, pallet.dark)
        fillPixels(3, 13, 1, 3, pallet.body)
        fillPixels(8, 13, 1, 3, pallet.body)

        // Boots
        fillPixels(1, 15, 3, 1, pallet.boot)
        fillPixels(7, 15, 3, 1, pallet.boot)
        fillPixels(1, 15, 1, 1, pallet.boot)
        fillPixels(10, 15, 1, 1, pallet.boot)

    }, [color, scale])

    return (
        <canvas
            ref={canvasRef}
            className={`
                block border-2 border-black
                ${active ? 'outline-2 outline-offset-2 outline-yellow' : ''}
                ${className || ''}
                `}
            height={16 * scale}
            width={12 * scale}
        >
        </canvas>
    )
}

export default PixelAvatar