import { atom } from "recoil";

export type BreadcrumbFragment = {
  path: string;
  name: string;
  options?: { path: string; name: string }[];
};
export const Breadcrumb = atom<BreadcrumbFragment[]>({
  key: "Breadcrumb",
  default: [],
});
