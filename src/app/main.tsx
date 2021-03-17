import { Component } from "./Component.js";
import "./Components/HelloWorld.js";

main();

function main() {
  const appElement = document.getElementById("app");
  appElement?.appendChild(<hello-world><span slot="name">World</span></hello-world>);
}