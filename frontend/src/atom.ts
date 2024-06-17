import { atom } from "recoil";
import { User } from "./interfaces/Interfaces";

export const savedUserState = atom<User | null>({
    key: "savedUserState",
    default: null,
  })