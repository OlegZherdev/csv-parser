class SVGElement {
    constructor(tagName, container, id = '') {
        this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        container.append(this.svgElement);
        if (id !== '') this.svgElement.setAttribute('id', id)
    }

    setAttributes(attributesObject) {
        Object.keys(attributesObject).forEach((key) => {
            this.svgElement.setAttribute(key, attributesObject[key])
        })
    }

    getDOMElement() {
        return this.svgElement;
    }

    setColor(color) {
        this.setAttributes({
            'fill': color,
            'stroke': color,});
    }
}

class Circle extends SVGElement {
    constructor(container, x, y, r, id = '') {
        super('circle', container, id);
        
        this.setAttributes({
            'cx': x,
            'cy': y,
            'r': r,
        })
    }
}

class GraphLine extends SVGElement {
    constructor(container, coordinatesArray, strokeWidth = 1, id = '') {
        super('polyline', container, id);

        this.setAttributes({
            'points': `${coordinatesArray.join(" ")}`,
            'fill': 'none',
            'stroke-width': strokeWidth,
        });
    }
}

class VerticalLine extends SVGElement {
    constructor(container, x12, y1, y2, strokeWidth = 1, id = '') {
        super('line', container, id);

        this.setAttributes({
            'x1': x12,
            'x2': x12,
            'y1': y1,
            'y2': y2,
            'stroke-width': strokeWidth,
        })
    }

    setColor(color) {
        this.getDOMElement().setAttribute('stroke', color);
    }
}

class HorizontalLine extends SVGElement {
    constructor(container, x1, x2, y12, strokeWidth = 1, id = '') {
        super('line', container, id);

        this.setAttributes({
            'x1': x1,
            'x2': x2,
            'y1': y12,
            'y2': y12,
            'stroke-width': strokeWidth,
        })
    }

    setColor(color) {
        this.getDOMElement().setAttribute('stroke', color);
    }
}

class Text extends SVGElement {
    constructor(container, x, y, anchor, str, id = '') {
        super('text', container, id);

        this.setAttributes({
            'x': x,
            'y': y,
            'text-anchor': anchor,
        })
        this.svgElement.innerHTML = str;
    }
    setColor(color) {
        this.getDOMElement().setAttribute('fill', color);
    }
}

export {SVGElement, Circle, GraphLine, VerticalLine, HorizontalLine, Text}