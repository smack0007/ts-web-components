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

export function html(tagName: string, attributes: HTMLAttributes | null, ...children: HTMLElement[]): HTMLElement {
    const element = document.createElement(tagName);
    
    if (attributes !== null) {
        for (const attributeKey of Object.keys(attributes)) {
            const attributeValue = attributes[attributeKey];

            if (attributeKey === 'style' && typeof attributeValue === 'object') {
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