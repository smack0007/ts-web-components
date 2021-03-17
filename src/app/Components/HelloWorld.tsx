import { Component, ComponentBase } from "../Component.js";

@Component("hello-world")
export class HelloWorld extends ComponentBase {   
    protected renderStyle(): string {
        return (
            `.name {
                color: red;
            }`
        );
    }

    protected renderHTML(): HTMLElement {
        return (
            <div>Hello <span class="name" click={() => this.onClick()}><slot name="name"></slot></span>!</div>
        );
    }

    private onClick(): void {
        console.info("Clicked!");
    }
}