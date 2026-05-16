import { pixelButtonColorMap } from '@/lib/colors/all-colors';
import { PixelButtonProps } from '@/lib/comp-props/pixel-button-prop';

const PixelButton = ({
    label,
    onClick,
    color = 'green',
    fullWidth,
    className
}:
    PixelButtonProps
) => {
    const currentColor = pixelButtonColorMap[color]
    return (
        <button
            onClick={onClick}
            className={`
        ${currentColor.bg} ${currentColor.text} ${currentColor.shadow} ${currentColor.hover}
        ${fullWidth ? 'w-full' : ''}
        border-2 border-border
        px-4 py-3
        font-['Press_Start_2P'] text-[11px] tracking-wider
        active:translate-x-0.75 active:translate-y-0.75 active:shadow-none
        transition-none cursor-crosshair
        ${className ?? ''}
      `}
        >
            {label}
        </button>
    )
}

export default PixelButton