import { Component, ComponentBase, html } from "../ComponentFramework.js";
import "./Counter.js";

@Component("app-hello-world")
export class HelloWorld extends ComponentBase {   
    private _clickCount: number = 0;
    
    protected renderElement(): HTMLElement {
        console.info("Render hello-world");
        return (
            <div>
                <div>Hello <span class="name" click={() => this.onClick()}><slot name="name"></slot></span>!</div>
                <app-counter count={this._clickCount}></app-counter>
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
        this._clickCount++;
        this.render();
    }
}