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
export function html(tagName: string, attributes: HTMLAttributes | null, ...children: Array<HTMLElement | Array<HTMLElement>>): HTMLElement {
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
    
    htmlAddChildren(element, children);

    return element;
}

function htmlAddChildren(element: HTMLElement, children: Array<HTMLElement | Array<HTMLElement>>): void {
    for (const child of children) {        
        if (Array.isArray(child)) {
            htmlAddChildren(element, child);
        } else {
            element.append(child);
        }
    }
}

export function Component(name: string) {
    return function (target: CustomElementConstructor): void {
        customElements.define(name, target, { });
    }
}

const componentAttributeMapKey = "__attribtues";
type ComponentAttributeMap = { [key: string]: string };

export function ComponentAttribute(name: string) {
    return function (target: unknown, propertyKey: string): void {        
        let attributeMap: ComponentAttributeMap = ((target as any).constructor)[componentAttributeMapKey];

        if (attributeMap === undefined) {
            attributeMap = {};
            ((target as any).constructor)[componentAttributeMapKey] = attributeMap;
        }

        attributeMap[name] = propertyKey;
    }
}

const componentChildMapKey = "__children";
type ComponentChildMap = { [key: string]: string };

export function ComponentChild(selector: string) {
    return function (target: unknown, propertyKey: string): void {
        let childMap: ComponentChildMap = (target as any)[componentChildMapKey];

        if (childMap === undefined) {
            childMap = {};
            (target as any)[componentChildMapKey] = childMap;
        }

        childMap[propertyKey] = selector;
    }
}

export abstract class ComponentBase extends HTMLElement {
    private _shadow: ShadowRoot;
    private _styleElement: HTMLStyleElement;
    private _element: HTMLElement | null = null;

    public static get observedAttributes(): Array<string> {
        const attributeMap = (this as any)[componentAttributeMapKey];

        if (attributeMap === undefined) {
            return [];
        }

        return Object.keys(attributeMap);
    }

    public get element(): HTMLElement | null {
        return this._element;
    }

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        
        this._styleElement = document.createElement("style");
        this._shadow.appendChild(this._styleElement);
    }

    private connectedCallback(): void {
        this.render();
        this.onInit();
    }

    // private disconnectedCallback(): void {
    // }

    private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        console.info("attributeChangedCallback", name, oldValue, newValue);
        
        const attributeMap = ((this as any).constructor)[componentAttributeMapKey];

        if (attributeMap !== undefined && attributeMap[name] !== undefined) {
            (this as any)[attributeMap[name]] = newValue;
        }

        this.onAttributeChanged(name, oldValue, newValue);
    }

    
    protected onInit(): void {}

    protected render(): void {
        this._styleElement.innerHTML = this.renderElementStyle();

        if (this._element !== null) {
            this._shadow.removeChild(this._element);
        }

        this._element = this.renderElement();
        this._shadow.appendChild(this._element);

        const childMap = (this as any)[componentChildMapKey];

        if (childMap !== undefined) {
            for (const property of Object.keys(childMap)) {
                (this as any)[property] = this._element.querySelector(childMap[property]);
            }
        }
    }

    protected abstract renderElementStyle(): string;

    protected abstract renderElement(): HTMLElement;

    protected onAttributeChanged(name: string, oldValue: string, newValue: string): void {}
}
