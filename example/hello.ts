export default function hello() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  console.log(`Hello! ${global.user}`);
}
