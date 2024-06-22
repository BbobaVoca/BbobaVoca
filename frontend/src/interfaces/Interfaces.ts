
export interface SuccessResponse {
    message: string;
}

export interface LoginResponse {
    token: string;
}

export interface CheckBooleanResponse {
    isExist: boolean;
}

export interface MyUser {
    email: string;
    nickname: string;
    babies: Baby;
    credit: number;
}

export interface User {
    email: string;
    nickname: string;
}

export interface Users extends Array<User> {}

export interface Baby {
    name: string;
    profile: string;
}

export interface MakeVocaCard {
    category: string;
    description: string;
    age: number;
    language: number;
}

export interface VocaTheme {
    category: string;
    description: string;
}

export interface VocaThemeDetail {
    category: string;
    description: string;
    bgColor: string;
}

export interface VocaThemes extends Array<VocaThemeDetail> {}

export interface AllVocaThemeDetail {
    category: string;
    description: string;
    bgColor: string;
    nickname: string;
}

export interface AllVocaTheme {
    category: string;
    description: string;
    nickname: string;
}

export interface AllVocaThemes extends Array<AllVocaThemeDetail> {}

export interface AllVocaThemeCard {
    category: string;
    description: string;
    bgColor: string;
    nickname: string;
    cards: VocaCard[];
}

export interface VocaThemeCard {
    category: string;
    description: string;
    bgColor: string;
    cards: VocaCard[];
}

export interface VocaCard {
    src: string;
    kor: string;
    other: string;
    example: string;
}

export interface VocaPrint {
    category: string;
    description: string;
    nickname: string;
    type: number;
    template: number;
}

export interface ThemeCardProps {
    category: string;
    description: string;
    color: string;
    onDelete: (category: string, description: string) => void;
}

export interface TimelineMessage {
    babies: Baby;
    msg: string;
    vocas: VocaData;
}

export interface VocaData {
    [key: number]: {
        timestamp: string;
        voca: string[];
    };
}

export interface VocaTimeline {
    timelineMessages: TimelineMessage[];
}
