import * as JSX from "./JSX.js";

main();

function main() {
  const appElement = document.getElementById("app");
  appElement?.appendChild(<div>Hello World!</div>);
}