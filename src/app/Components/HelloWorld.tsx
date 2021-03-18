import { Component, ComponentBase, ComponentChild, html } from "../ComponentFramework.js";
import "./Counter.js";
import { Counter } from "./Counter.js";

@Component("app-hello-world")
export class HelloWorld extends ComponentBase {       
    @ComponentChild("app-counter")
    private _counter: Counter | null = null;

    protected renderElement(): HTMLElement {
        return (
            <div>
                <div>Hello <span class="name" click={() => this.onClick()}><slot name="name"></slot></span>!</div>
                <app-counter count="0"></app-counter>
            </div>
        );
    }

    protected renderElementStyle(): string {
        return (
            `.name {
                color: red;
            }
            
            app-counter {
                background-color: pink;
            }`
        );
    }

    private onClick(): void {
        console.info("Clicked!");
        
        if (this._counter !== null) {
            this._counter.count++;
        }
    }
}
