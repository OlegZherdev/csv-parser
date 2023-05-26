import { Circle, HorizontalLine, SVGElement } from './SVGFactory.js';
import { LEGEND_PIC_WIDTH, LEGEND_PIC_HEIGHT, SVG_COLOR } from './SVGSettints.js';
import { state } from '../script.js'
import { createGraph, needReCreate } from './graphCreator.js';

export class LegendItem {
    constructor(columnNumber, title) {
        const legendBlock = document.getElementById('ul-ledend')
        
        this.legndItem = document.createElement('li');

        legendBlock.append(this.legndItem);

        this.legndItem.setAttribute("data-columnNumber", columnNumber);
        this.legndItem.setAttribute("id", `legendItem${columnNumber}`);

        this.icon = new SVGElement('svg', this.legndItem, `legend${columnNumber}`);
        this.circle = new Circle(this.icon.getDOMElement(), 15, 15, 7);
        this.line = new HorizontalLine(this.icon.getDOMElement(), 3, 27, 15, 3);

        this.icon.setAttributes( {
            width: LEGEND_PIC_WIDTH,
            height: LEGEND_PIC_HEIGHT,
            viewBox: `0 0 ${LEGEND_PIC_WIDTH} ${LEGEND_PIC_HEIGHT}`,
        });

        this.icon.setColor(SVG_COLOR[columnNumber]);
        this.legndItem.append(this.icon.getDOMElement());
        this.titleLegend = document.createElement('p');
        this.titleLegend.innerHTML = title;
        this.legndItem.append(this.titleLegend);

        this.legndItem.onclick = () => {
            if (state.maxScaleValueArray[columnNumber] < 0) {
                this.legndItem.classList.remove("non-select");
            } else {
                this.legndItem.classList.add("non-select");
            }
            state.maxScaleValueArray[columnNumber] = state.maxScaleValueArray[columnNumber] * -1;
            createGraph();
        }
    }    

    getDOMElement() {
        return this.legndItem;
    }    
}