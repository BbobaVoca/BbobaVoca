import { AxiosResponse } from "axios";
import { CheckBooleanResponse, LoginResponse, MyUser, SuccessResponse, Users } from "../../interfaces/Interfaces";
import { bobbaVocaAxios } from "../axios";


// 회원가입
export const register = async (
    formData: FormData
): Promise<AxiosResponse<SuccessResponse> | null> => {
    const response = await bobbaVocaAxios.post(
        "members/signup",
        formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    });
    return response;
};

// 로그인
export const login = async (
    email : string,
    password : string
): Promise<AxiosResponse<LoginResponse> | null> => {
    const response = await bobbaVocaAxios.post(
        "members/login",
        {
            email,
            password,
        }
    );
    return response;
};

// 이메일 중복확인
export const checkEmail = async (
    email : string
): Promise<AxiosResponse<CheckBooleanResponse> | null> => {
    const response = await bobbaVocaAxios.post(
        "members/check-email",
        { email }
    );
    return response;
};

// 닉네임 중복확인
export const checkNickname = async (
    nickname : string
): Promise<AxiosResponse<CheckBooleanResponse> | null> => {
    const response = await bobbaVocaAxios.post(
        "members/check-nickname",
        { nickname }
    );
    return response;
};

// 프로필 올리기
export const uploadProfile = async (
    token: string,
    formData: FormData
): Promise<AxiosResponse<SuccessResponse> | null> => {
    const response = await bobbaVocaAxios.post(
        "voca/profile-update",
        formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response;
};

// 회원정보 전체 반환
export const users = async (
): Promise<AxiosResponse<Users> | null> => {
    const response = await bobbaVocaAxios.get(
        "members/list"
    );
    return response;
};

// 내 정보 반환
export const user = async (
    token: string
): Promise<AxiosResponse<MyUser> | null> => {
    const response = await bobbaVocaAxios.get(
        "members/member",
        { headers: { Authorization: `Bearer ${token}` }}
    );
    return response;
};