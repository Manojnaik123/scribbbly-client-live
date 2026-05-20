import { Dispatch, SetStateAction } from "react";
import { LanguageType } from '@shared/language'

export type GameStartingCardProps = {
    roomId: string,
    setRoomId: Dispatch<SetStateAction<string>>,
    selectedLanguage: LanguageType
    setSelectedLanguage: Dispatch<SetStateAction<LanguageType>>
    enteredUserName: string,
    setEnteredUserName: Dispatch<SetStateAction<string>>,
    activeAvatarIndex: number,
    setActiveAvatarIndex: Dispatch<SetStateAction<number>>
}