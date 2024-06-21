import { atom } from "recoil";
import { MyUser, VocaThemeCard } from "./interfaces/Interfaces";

export const savedUserState = atom<MyUser | null>({
  key: "savedUserState",
  default: null,
})

export const vocaCardsInfoState = atom<VocaThemeCard | null>({
  key: "vocaCardsInfoState",
  default: null,
});