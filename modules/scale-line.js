"use strict";
import {state} from '../script.js';
import {createCoordinete, createSvgElement, setAttributes, svgDinamic, SVG_PADDING_LEFT, SVG_PADDING_TOP} from './create-svg.js'

const Y_SCALE_LINE_QUANTITY = 5;
const X_SCALE_LINE_QUANTITY = 10;

function creatScaleLine(zoomX, zoomY) {
    if (state.maxValueY === 0) return;

    const stepScaleLineX =  getStepLine(state.maxTimeValue, X_SCALE_LINE_QUANTITY);
    const stepScaleLineY =  getStepLine(state.maxValueY, Y_SCALE_LINE_QUANTITY);
    const maxScaleValueX = stepScaleLineX * X_SCALE_LINE_QUANTITY
    const maxScaleValueY = stepScaleLineY * Y_SCALE_LINE_QUANTITY

    for (let xValue = stepScaleLineX; xValue <= maxScaleValueX; xValue += stepScaleLineX) {
        const [xPoint] = createCoordinete(xValue, zoomX);
        const scaleLine = createSvgElement("line");

        setAttributes(scaleLine, {
            x1: xPoint,
            x2: xPoint,
            y1: state.graphSizeY + SVG_PADDING_TOP + 7,
            y2: SVG_PADDING_TOP,
            stroke: '#f5f5f54a',
            "stroke-width": 1,
        })
        svgDinamic.prepend(scaleLine);
        createLineTitle((xValue), xPoint, "horizontal");
    }
    
    for (let yValue = stepScaleLineY; yValue <= maxScaleValueY; yValue += stepScaleLineY) {
        const [xPoint, yPoint] = createCoordinete(0, 0, yValue, zoomY);
        const scaleLine = createSvgElement('line');

        setAttributes(scaleLine, {
            x1: SVG_PADDING_LEFT - 7,
            x2: state.graphSizeX + SVG_PADDING_LEFT,
            y1: yPoint,
            y2: yPoint,
            stroke: '#f5f5f54a',
            "stroke-width": 1,
        })
        svgDinamic.prepend(scaleLine);
        createLineTitle(yValue, yPoint, "vertical");
    }
}

function createLineTitle(valueTitle, coordinate, direction) {
    const title = createSvgElement('text');
    const textTitle = Math.round(valueTitle * 100) / 100;

    let y;
    let x;
    let anchor;
    
    if (direction === "vertical") {
        y = coordinate + 7;
        x = SVG_PADDING_LEFT - 10;
        anchor = "end"
        
    }
    if (direction === "horizontal") {
        x = coordinate;
        y = state.graphSizeY + SVG_PADDING_TOP + 30;
        anchor = "middle"
    }
    
    title.innerHTML = textTitle;

    setAttributes(title, {
        class: "scale-line-text",
        "x": x,
        "y": y,
        "fill": "white",
        "text-anchor": anchor,
    })
    svgDinamic.prepend(title);
}

function getStepLine(value, stepQuantity) {
    let multiplier = 1;
    let scaleLineStep = Math.floor(value) / stepQuantity;

    if (value < 1) {
        do {
            multiplier *= 10;
            value *= 10;
        } while(value < 1)
        scaleLineStep = (Math.floor(value) / stepQuantity) / multiplier;
    }
    if (value > 10) {
        do {
            multiplier *= 10;
            value /= 10;
        } while(value > 10)
        scaleLineStep = (Math.floor(value) / stepQuantity) * multiplier;
    }
    return scaleLineStep;
}

export {creatScaleLine};