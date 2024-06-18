import { atom } from "recoil";
import { MyUser } from "./interfaces/Interfaces";

export const savedUserState = atom<MyUser | null>({
    key: "savedUserState",
    default: null,
  })