import axios from "axios";

export const bobbaVocaAxios = axios.create({
    baseURL: "http://35.192.203.252:8080/voca",
});