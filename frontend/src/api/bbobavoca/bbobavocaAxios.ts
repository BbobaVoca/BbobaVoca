import { AxiosResponse } from "axios";
import { MakeVocaCard, VocaTheme, VocaThemeCard, SuccessResponse, AllVocaTheme, AllVocaThemeCard, VocaPrint, AllVocaThemes, VocaThemeDetail, VocaThemes } from "../../interfaces/Interfaces";
import { bobbaVocaAxios } from "../axios";


// 단어 생성
export const makeVocas = async (
    token: string,
    category: string,
    description: string,
    age: number,
    language: number
): Promise<AxiosResponse<VocaTheme> | null> => {
    const response = await bobbaVocaAxios.post(
        "bbobavoca/make",
        { category, description, age, language },
        { headers: { Authorization: `Bearer ${token}` }}
    );
    return response;
};

// 내 카드 카테고리 반환
export const getMyTheme = async (
    token: string
): Promise<AxiosResponse<VocaThemes> | null> => {
    const response = await bobbaVocaAxios.get(
        "bbobavoca/myvoca",
        { headers: { Authorization: `Bearer ${token}` }}
    );
    return response;
};

// 내 카드 정보 반환
export const getMyVocaCards = async (
    token: string,
    themeInput : VocaTheme
): Promise<AxiosResponse<VocaThemeCard> | null> => {
    const response = await bobbaVocaAxios.post(
        "bbobavoca/select-myvoca",
        { themeInput },
        { headers: { Authorization: `Bearer ${token}` }}
    );
    return response;
};

// 카드 삭제
export const removeVocaTheme = async (
    token: string,
    themeInput : VocaTheme
): Promise<AxiosResponse<SuccessResponse> | null> => {
    const response = await bobbaVocaAxios.post(
        "bbobavoca/remove",
        { themeInput },
        { headers: { Authorization: `Bearer ${token}` }}
    );
    return response;
};

// 전체 카드 카테고리 반환
export const getAllVocaTheme = async (
): Promise<AxiosResponse<AllVocaThemes> | null> => {
    const response = await bobbaVocaAxios.get(
        "bbobavoca/allvoca"
    );
    return response;
};

// 선택 카드 정보 반환
export const getSelectVocas = async (
    token: string,
    themeInput : AllVocaTheme
): Promise<AxiosResponse<AllVocaThemeCard> | null> => {
    const response = await bobbaVocaAxios.post(
        "bbobavoca/select-voca",
        { themeInput },
        { headers: { Authorization: `Bearer ${token}` }}
    );
    return response;
};

// 프린트
export const printVocas = async (
    token: string,
    print : VocaPrint
): Promise<AxiosResponse<SuccessResponse> | null> => {
    const response = await bobbaVocaAxios.post(
        "bbobavoca/print",
        { print },
        { headers: { Authorization: `Bearer ${token}` }}
    );
    return response;
};