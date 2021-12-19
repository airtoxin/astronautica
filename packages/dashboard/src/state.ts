import { atom } from "recoil";

export const AuthToken = atom<string | null>({
  key: "AuthToken",
  default: null,
});
