import axios, { AxiosResponse, isAxiosError } from "axios";

const possgAxios = axios.create({
    baseURL: "http://address/api",
    });