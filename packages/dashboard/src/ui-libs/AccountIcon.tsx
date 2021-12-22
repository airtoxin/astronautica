import { VoidFunctionComponent } from "react";

export const DefaultAccountIcon: VoidFunctionComponent<{
  accountName: string;
}> = ({ accountName }) => {
  const r = ("00" + accountName.charCodeAt(0).toString(16)).slice(-2);
  const g = ("00" + accountName.charCodeAt(1).toString(16)).slice(-2);
  const b = ("00" + accountName.charCodeAt(2).toString(16)).slice(-2);
  const backgroundColor = `#${r}${g}${b}`;
  return (
    <div
      title={accountName}
      className="flex justify-center items-center w-8 h-8 rounded-full drop-shadow text-white bg-blend-difference"
      style={{ backgroundColor }}
    >
      {accountName.slice(0, 1)}
    </div>
  );
};
