import { AxiosResponse } from "axios";
import { VocaTheme, VocaThemeCard, SuccessResponse, AllVocaThemeCard, AllVocaThemes, VocaThemes, TimelineMessage } from "../../interfaces/Interfaces";
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
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
};

// 내 카드 카테고리 반환
export const getMyTheme = async (
    token: string
): Promise<AxiosResponse<VocaThemes> | null> => {
    const response = await bobbaVocaAxios.get(
        "bbobavoca/myvoca",
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
};

// 내 카드 정보 반환
export const getMyVocaCards = async (
    token: string,
    category: string,
    description: string
): Promise<AxiosResponse<VocaThemeCard> | null> => {
    const response = await bobbaVocaAxios.post(
        "bbobavoca/select-myvoca",
        { category, description },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
};

// 카드 삭제
export const removeVocaTheme = async (
    token: string,
    category: string,
    description: string
): Promise<AxiosResponse<SuccessResponse> | null> => {
    const response = await bobbaVocaAxios.post(
        "bbobavoca/remove",
        { category, description },
        { headers: { Authorization: `Bearer ${token}` } }
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
    category: string,
    description: string,
    nickname: string
): Promise<AxiosResponse<AllVocaThemeCard> | null> => {
    const response = await bobbaVocaAxios.post(
        "bbobavoca/select-voca",
        { category, description, nickname }
    );
    return response;
};

// 프린트
export const printVocas = async (
    token: string,
    category: string,
    description: string,
    nickname: string,
    type: number,
    template: number
): Promise<AxiosResponse<SuccessResponse> | null> => {
    const response = await bobbaVocaAxios.post(
        "bbobavoca/print",
        { category, description, nickname, type, template },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
};


export const makeTimeline = async (
    token: string,
    msg: string
): Promise<AxiosResponse<SuccessResponse> | null> => {
    const response = await bobbaVocaAxios.post(
        "bbobavoca/make-timeline",
        { msg },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
};

// 타임라인 데이터 가져오기
export const getTimeline = async (
    token: string
): Promise<AxiosResponse<TimelineMessage>> => {
    const response = await bobbaVocaAxios.get(
        "bbobavoca/timeline",
        {
            headers: { Authorization: `Bearer ${token}` }
        });
    return response;
};


// export const updateProfile = async (
//     token: string,
//     //babies:string,
//     file: File,

// ): Promise<AxiosResponse<SuccessResponse> | null> => {
//     const formData = new FormData();
//     //formData.append('name',babies ); // 'babyName'는 서버에서 정의한 필드명
//     formData.append('profile', file); // 'profile'는 서버에서 정의한 파일 필드명

//     const response = await bobbaVocaAxios.post(
//         "members/profile-update",
//         formData,
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'multipart/form-data'
//             }
//         }
//     );
//     return response;
// };

// 프로필 올리기
export const updateProfile = async (
    token: string,
    formData: FormData
): Promise<AxiosResponse<SuccessResponse> | null> => {
    const response = await bobbaVocaAxios.post(
        "members/profile-update",
        formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response;
};

// 프린터 아이디 전송하기
export const sendPrinterId = async (
    token: string,
    printId: string
): Promise<AxiosResponse<{ message: string }>> => {
    const response = await bobbaVocaAxios.post(
        "bbobavoca/print-id",
        { printId }, // Include the printId in the request body
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response;
};

// 프린터기ID 데이터 가져오기
export const getPrinterId = async (
    token: string
): Promise<AxiosResponse<{ printId: string }| null>> => {
    const response = await bobbaVocaAxios.get(
        "bbobavoca/get-print-id",
        {
            headers: { Authorization: `Bearer ${token}` }
        });
    return response;
};