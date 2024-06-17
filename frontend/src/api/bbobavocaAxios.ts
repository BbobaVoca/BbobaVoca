import axios, { AxiosResponse, isAxiosError } from "axios";
import { CheckBooleanResponse, LoginResponse, SuccessResponse, User, Users } from "../interfaces/Interfaces";

const possgAxios = axios.create({
    baseURL: "http://35.192.203.252:8080/voca",
});

// 회원가입
export const register = async (
    email : string,
    password : string,
    nickname : string
): Promise<AxiosResponse<SuccessResponse, any> | null> => {
    try {
        const response = await possgAxios.post(
            "members/signup",
            {
                email,
                password,
                nickname,
            }
        );
        return response;
    } catch (error) {
        if(isAxiosError<SuccessResponse>(error)) {
            console.log(`Error: ${error.response?.status} ${error.message}`);
            return null;
        } else {
            return null;
        }
    }
};

// 로그인
export const login = async (
    email : string,
    password : string
): Promise<AxiosResponse<LoginResponse, any> | null> => {
    try {
        const response = await possgAxios.post(
            "members/login",
            {
                email,
                password,
            }
        );
        return response;
    } catch (error) {
        if(isAxiosError<LoginResponse>(error)) {
            console.log(`Error: ${error.response?.status} ${error.message}`);
            return null;
        } else {
            return null;
        }
    }
};

// 이메일 중복확인
export const checkEmail = async (
    email : string
): Promise<AxiosResponse<CheckBooleanResponse, any> | null> => {
    try {
        const response = await possgAxios.post(
            "members/check-email",
            { email }
        );
        return response;
    } catch (error) {
        if(isAxiosError<CheckBooleanResponse>(error)) {
            console.log(`Error: ${error.response?.status} ${error.message}`);
            return null;
        } else {
            return null;
        }
    }
};

// 회원정보 전체 반환
export const users = async (
): Promise<AxiosResponse<Users, any> | null> => {
    try {
        const response = await possgAxios.get(
            "members/list"
        );
        return response;
    } catch (error) {
        if(isAxiosError<Users>(error)) {
            console.log(`Error: ${error.response?.status} ${error.message}`);
            return null;
        } else {
            return null;
        }
    }
};

// 내 정보 반환
export const user = async (
    token: string
): Promise<AxiosResponse<User, any> | null> => {
    try {
        const response = await possgAxios.get(
            "members/member",
            { headers: { Authorization: `Bearer ${token}` }}
        );
        return response;
    } catch (error) {
        if(isAxiosError<User>(error)) {
            console.log(`Error: ${error.response?.status} ${error.message}`);
            return null;
        } else {
            return null;
        }
    }
};