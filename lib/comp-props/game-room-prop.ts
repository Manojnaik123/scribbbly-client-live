import { LanguageType } from "@shared/language";

export type GameRoomProp = {
    roomId: string 
    enteredUserName: string
    activeAvatarIndex: number
    selectedLanguage: LanguageType
}