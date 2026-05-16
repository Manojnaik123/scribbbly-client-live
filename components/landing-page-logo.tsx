import { LOGO_COLORS } from '@/lib/colors/all-colors';
import { LOGO_LETTERS } from '@/lib/constants/all-texts';

import { Room } from "@shared/room"


const LandingPageLogo = () => {
    return (
        <div
            className="flex items-end flex-wrap justify-center gap-0.5 sm:gap-1 select-none"
            style={{ animation: 'pixelFloat 3s steps(3) infinite' }}
        >
            {LOGO_LETTERS.map((letter, i) => (
                <span
                    key={i}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold leading-none"
                    style={{
                        color: LOGO_COLORS[i % LOGO_COLORS.length],
                        textShadow: '3px 3px 0 #000',
                    }}
                >
                    {letter}
                </span>
            ))}
        </div>
    )
}

export default LandingPageLogo

