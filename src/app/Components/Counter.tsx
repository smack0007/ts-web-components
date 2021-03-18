import { Component, ComponentBase, ComponentChild, html } from "../ComponentFramework.js";

@Component("app-counter")
export class Counter extends ComponentBase {
    public static get observedAttributes(): Array<string> {
        return ["count"];
    }

    @ComponentChild(".count")
    private _countElement: HTMLElement | null = null;

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
            <div>The count is <span class="count">{this.count}</span></div>
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
        
        if (this._countElement !== null) {
            this._countElement.innerText = this.count.toString();
        }
    }
}