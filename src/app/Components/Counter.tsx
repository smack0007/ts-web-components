import { Component, ComponentBase, html } from "../ComponentFramework.js";

@Component("app-counter")
export class Counter extends ComponentBase {
    public static get observedAttributes(): Array<string> {
        return ["count"];
    }

    public get count(): number {
        const temp = this.getAttribute("count");
        
        console.info("count", temp);

        return +(temp as string);
    }

    public set count(value: number) {
        this.setAttribute("count", value.toString());
    }

    protected renderElement(): HTMLElement {
        return (
            <div>The count is {this.count}</div>
        );
    }

    protected renderElementStyle(): string {
        return (
            `.name {
                color: red;
            }`
        );
    }

    private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        console.info("attributeChangedCallback", name, oldValue, newValue);
        this.render();
    }
}