declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface Element extends HTMLElement { }
        interface IntrinsicElements {
            [key: string]: any;
        }
    }
}

type HTMLAttributes = { [key: string ]: any };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function html(tagName: string, attributes: HTMLAttributes | null, ...children: HTMLElement[]): HTMLElement {
    const element = document.createElement(tagName);
    
    if (attributes !== null) {
        for (const attributeKey of Object.keys(attributes)) {
            const attributeValue = attributes[attributeKey];

            if (typeof attributeValue === "function") {
                element.addEventListener(attributeKey, attributeValue);
            } else if (attributeKey === "style" && typeof attributeValue === "object") {
                for (const styleKey of Object.keys(attributeValue)) {
                    const styleValue = attributeValue[styleKey];
                    (element.style as any)[styleKey] = styleValue;
                }
            } else {
                element.setAttribute(attributeKey, attributeValue);
            }
        }
    }
    
    for (const child of children) {
        element.append(child);
    }

    return element;
}

export function Component(name: string) {
    return function (target: CustomElementConstructor): void {
        customElements.define(name, target, { });
    }
}

export abstract class ComponentBase extends HTMLElement {
    private _shadow: ShadowRoot;
    private _styleElement: HTMLStyleElement;
    private _element: HTMLElement;

    public get element(): HTMLElement {
        return this._element;
    }

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        
        this._styleElement = document.createElement("style");
        this._shadow.appendChild(this._styleElement);
        this._styleElement.innerHTML = this.renderStyle();

        this._element = this.renderHTML();
        this._shadow.appendChild(this._element);
    }

    // private connectedCallback(): void {
        
    // }

    // private disconnectedCallback(): void {
        
    // }

    protected abstract renderStyle(): string;

    protected abstract renderHTML(): HTMLElement;
}
