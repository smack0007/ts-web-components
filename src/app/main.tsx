import { html } from "./ComponentFramework.js";
import "./Components/HelloWorld.js";

const appElement = document.getElementById("app");
appElement?.appendChild(<app-hello-world><span slot="name">World</span></app-hello-world>);
