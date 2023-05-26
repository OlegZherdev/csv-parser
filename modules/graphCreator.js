import { state } from '../script.js'
import { Circle, VerticalLine, HorizontalLine, SVGElement, Text, GraphLine } from './SVGFactory.js';
import { SVG_PADDING_TOP, 
    SVG_PADDING_BOTTOM, 
    SVG_PADDING_LEFT, 
    SVG_PADDING_RIGHT, 
    SVG_COLOR } from './SVGSettints.js';
import { LegendItem } from './LegendItem.js';

const graphBox = document.querySelector(".graphic__svg");
const graphArea = document.querySelector(".graphic");
const ledendBox = document.querySelector(".graphic__legend-block");
const mainSVG = new SVGElement('svg', graphBox, "main-svg");

const Y_SCALE_LINE_QUANTITY = 5;
const X_SCALE_LINE_QUANTITY = 10;

export async function createLegend() {
    state.values.forEach((column, columnNumber) => {
        if (columnNumber !== 0) {
            new LegendItem(columnNumber, column.label);
        }
    })
    return;
}

export function createGraph() {
    if ( needReCreate() === false ) return;
    mainSVG.getDOMElement().innerHTML = "";
    getSizeMainSVG();

    mainSVG.setAttributes({
        with: state.graphWidth,
        height: state.graphHeight,
        viewBox: `0 0 ${state.graphWidth} ${state.graphHeight}`,
    })

    createScaleLine(mainSVG.getDOMElement());
    
    state.maxScaleValueArray.forEach((elem, columnNumber) => {
        if (elem < 0 && Math.abs(elem) > state.maxScaleValue) return;

        const group = new SVGElement('g', mainSVG.getDOMElement(), `graphGoup${columnNumber}`);
        const coordinatesArray = state.values[columnNumber].values.map((valuePoint, index) => {
            const timePoint = state.values[0].values[index];
            const [x, y] = getCoordinete(timePoint, valuePoint);
            const point = new Circle (group.getDOMElement(), x, y, 2);

            return `${x},${y}`
        })
        const graphLine = new GraphLine(group.getDOMElement(), coordinatesArray);
        group.setColor(SVG_COLOR[columnNumber]);

    })
    hideShowGroup();
}

function getSizeMainSVG() {
    state.graphWidth = graphArea.clientWidth;
    state.graphHeight = graphArea.clientHeight - ledendBox.clientHeight;
}

export async function setMaxScaleValueArray() {
    state.values.forEach((column, columnNumber) => {
        let maxValue = column.maxValue;
        let maxScaleValue = Math.floor(maxValue);
        let multiplier = 1;

        if (maxValue <= 1) {
            do {
                multiplier *= 10;
                maxValue *= 10;
            } while(maxValue < 1)
            maxScaleValue = Math.floor(maxValue) / multiplier
        }

        if (maxValue >= 10) {
            do {
                multiplier *= 10;
                maxValue /= 10;
            } while(maxValue > 10)
            maxScaleValue = Math.floor(maxValue) * multiplier
        }

        if (columnNumber === 0) maxScaleValue = maxScaleValue * -1;
        state.maxScaleValueArray.push(maxScaleValue);
    })
    return;
}

export function needReCreate() {
    const currentMaxScaleValue = Math.max.apply(0, state.maxScaleValueArray);

    if (currentMaxScaleValue !== state.maxScaleValue) {
        state.maxScaleValue = currentMaxScaleValue;
        hideShowGroup();
        let status = true;
        if (currentMaxScaleValue < 0) status = false;
        return status
    }
    hideShowGroup();
    return false;
}
function hideShowGroup() {
    state.maxScaleValueArray.forEach((elem, columnNumber) => {
        const group = document.getElementById(`graphGoup${columnNumber}`);
        if (columnNumber === 0 || group === null) return;

        if (elem < 0) {
            group.classList.add("non-select") 
        } else {
            group.classList.remove("non-select");
        }

    })
}

function createScaleLine(container) {
    const maxScaleValueX = Math.abs(state.maxScaleValueArray[0]);
    const maxScaleValueY = state.maxScaleValue;
    const stepScaleLineX = Math.round((maxScaleValueX / X_SCALE_LINE_QUANTITY) * 100) / 100;
    const stepScaleLineY = Math.round((maxScaleValueY / Y_SCALE_LINE_QUANTITY) * 100) / 100;
    
    for (let xValue = 0; xValue <= maxScaleValueX; xValue += stepScaleLineX) {
        const [xPoint] = getCoordinete(xValue, 0);
        const scaleLine = new VerticalLine(container, xPoint, state.graphHeight - SVG_PADDING_TOP + 7, SVG_PADDING_TOP)
        scaleLine.setColor('#f5f5f54a')
        createLineTitle(xValue, xPoint, "vertical", container);
    }

    for (let yValue = 0; yValue <= maxScaleValueY; yValue += stepScaleLineY) {
        const [xPoint, yPoint] = getCoordinete(0, yValue);
        const scaleLine = new HorizontalLine(container, SVG_PADDING_LEFT - 7, state.graphWidth - SVG_PADDING_RIGHT, yPoint)
        scaleLine.setColor('#f5f5f54a')
        createLineTitle(yValue, yPoint, "horizontal", container);
    }
}

function createLineTitle(valueTitle, coordinate, direction, container) {
    const textTitle = Math.round(valueTitle * 100) / 100;

    let y;
    let x;
    let anchor;
    
    if (direction === "horizontal") {
        y = coordinate + 7;
        x = SVG_PADDING_LEFT - 15;
        anchor = "end"
    }

    if (direction === "vertical") {
        x = coordinate;
        y = state.graphHeight - SVG_PADDING_TOP + 25;
        anchor = "middle"
    }
    
    const title = new Text(container, x, y, anchor, textTitle);

    title.setColor("white")
}

function getMaxValueY() {
    let maxValueY = 0;

    state.values.forEach((column, columnNumber) => {
        if (columnNumber !== 0 
            && maxValueY < column.maxValue 
            && state.maxScaleValueArray[columnNumber] > 0) 
                maxValueY = column.maxValue;
    })
    return maxValueY;
}

function getCoordinete(valueX, valueY) {
    const zoomX = (state.graphWidth  - SVG_PADDING_LEFT - SVG_PADDING_RIGHT) / state.values[0].maxValue;
    const zoomY = (state.graphHeight - SVG_PADDING_BOTTOM - SVG_PADDING_TOP) / getMaxValueY();
    const x = Math.round(valueX * zoomX) + SVG_PADDING_LEFT;
    const y = state.graphHeight - SVG_PADDING_TOP - Math.round(valueY * zoomY);

    return [x, y];
}