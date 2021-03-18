import { html } from "./ComponentFramework.js";
import "./Components/HelloWorld.js";

const appElement = document.getElementById("app");
appElement?.appendChild(<hello-world><span slot="name">World</span></hello-world>);
