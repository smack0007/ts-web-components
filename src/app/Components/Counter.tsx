import { Component, ComponentAttribute, ComponentBase, ComponentChild, html } from "../ComponentFramework.js";

@Component("app-counter")
export class Counter extends ComponentBase {
    @ComponentChild(".count")
    private _countElement: HTMLElement | null = null;

    @ComponentAttribute("count")
    private _count: number = 0;

    public get count(): number {
        const temp = this.getAttribute("count");

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

    protected onAttributeChanged(name: string, oldValue: string, newValue: string): void {
        if (this._countElement !== null) {
            this._countElement.innerHTML = this._count.toString();
        }
    }
}
