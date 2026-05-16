
import { Message } from '@shared/messages'

export default function ChatLine({ message }: { message: Message }) {
    if (message.type === 'system') {
        return (
            <p className="text-pink text-[5px] sm:text-[6px] leading-5">{`>> ${message.text}`}</p>
        )
    }

    if (message.type === 'correct') {
        return (
            <div className="bg-green px-2 py-1.5 shrink-0">
                <p className="text-black text-[5px] sm:text-[7px] leading-5">{`>> ${message.text}`}</p>
                <p className="text-black text-[5px] sm:text-[7px]">{`+${message.points}`}</p>
            </div>
        )
    }

    return (
        <p className="text-[5px] sm:text-[7px] leading-5 wrap-break-word">
            <span className="text-blue">{message.player}</span>
            <span className="text-grey">{' > '}</span>
            <span className="text-text-white">{message.text}</span>
        </p>
    )
}