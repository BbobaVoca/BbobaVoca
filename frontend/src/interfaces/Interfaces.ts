
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
    profile: string;
    baby: Baby[];
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

export interface VocaThemes extends Array<VocaTheme> {}

export interface AllVocaTheme {
    category: string;
    description: string;
    nickname: string;
}

export interface AllVocaThemeCard {
    category: string;
    description: string;
    nickname: string;
    cards: VocaCard[];
}

export interface VocaThemeCard {
    category: string;
    description: string;
    cards: VocaCard[];
}

export interface VocaCard {
    src: string;
    kor: string;
    eng: string;
    jap: string;
    chi: string;
    example: string;
}

export interface VocaPrint {
    category: string;
    description: string;
    nickname: string;
    type: number;
    template: number;
}