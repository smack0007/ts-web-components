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
    private _element: HTMLElement | null = null;

    public get element(): HTMLElement | null {
        return this._element;
    }

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        
        this._styleElement = document.createElement("style");
        this._shadow.appendChild(this._styleElement);

        this.render();
    }

    private connectedCallback(): void {
        this.render();    
    }

    // private disconnectedCallback(): void {
        
    // }

    protected render(): void {
        this._styleElement.innerHTML = this.renderElementStyle();

        if (this._element !== null) {
            this._shadow.removeChild(this._element);
        }

        this._element = this.renderElement();
        this._shadow.appendChild(this._element);
    }

    protected abstract renderElementStyle(): string;

    protected abstract renderElement(): HTMLElement;
}
