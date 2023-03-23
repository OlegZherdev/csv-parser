"use strict";
import {state} from '../script.js';
import {moveInfoWindow, fillInfoWindow} from './info-window.js';
import {creatScaleLine} from './scale-line.js';

const SVG_PADDING_TOP = 25;
const SVG_PADDING_BOTTOM = 35;
const SVG_PADDING_LEFT = 50;
const SVG_PADDING_RIGHT = 20;
const SVG_COLOR = ["Olive", "Red", "Lime", "Aqua", "aliceblue","Fuchsia", "Yellow", "White", "aliceblue"];
const LEGEND_PIC_HEIGHT = 30;
const LEGEND_PIC_WIDTH = 30;

const svg = document.getElementById("main-svg");
const svgDinamic = document.getElementById("dinamic-svg")
const legendUl = document.getElementById("ul-ledend");

function createLegend() {
    state.values.forEach((column, index) => {
        if (index === 0) {
            state.setGraphVisible.push(false);
        } else {
            const legendLi = document.querySelector(".legendItem");
            
            let newLegendItem;

            state.setGraphVisible.push(true);
            if (index === 1) {
                newLegendItem = legendLi 
            } else {
                newLegendItem = legendLi.cloneNode(true);
                legendUl.append(newLegendItem);
            }

            const legendTitle = newLegendItem.querySelector(".legendTitle");
            const legendPic = newLegendItem.querySelector(".graphic__pic");

            legendTitle.innerHTML = column.label;
            newLegendItem.setAttribute("data-index", index);
            newLegendItem.setAttribute("id", `legendItem${index}`);
            
            setAttributes(legendPic, {
                id: `legend${index}`,
                with: LEGEND_PIC_WIDTH,
                height: LEGEND_PIC_HEIGHT,
                viewBox: `0 0 ${LEGEND_PIC_WIDTH} ${LEGEND_PIC_HEIGHT}`,
                fill: SVG_COLOR[index],
                stroke: SVG_COLOR[index],
            })
            newLegendItem.addEventListener('click', selectGraph);
        }
    })
    createGraphSvg();
}

function createGraphSvg() {
    [state.graphSizeX, state.graphSizeY] = getGraphSize();
    [state.maxTimeValue, state.maxValueY] = getMaxValueXY();
    const zoomX = state.graphSizeX / state.maxTimeValue;
    const zoomY = state.graphSizeY / state.maxValueY;

    creatScaleLine(zoomX, zoomY);
    setAttributes(svg, {
        with: state.maxSvgWidth,
        height: state.maxSvgHeight,
        viewBox: `0 0 ${state.maxSvgWidth} ${state.maxSvgHeight}`,
    })

    state.setGraphVisible.forEach((visible, column) => {
        if (visible) {
            const id = `graphGoup${column}`;
            const polyline = createSvgElement('polyline');
            const group = createSvgElement('g');
            const color = SVG_COLOR[column];

            setAttributes(group, {
                id: id,
                stroke: color,
            })
            svgDinamic.append(group);
            

            const coordinatesLine = state.values[column].values.map((voluePoint, index) => {
                const timePoint = state.values[0].values[index];
                const [x, y] = createCoordinete(timePoint, zoomX, voluePoint, zoomY)
                const circle = createSvgElement('circle');

                setAttributes(circle, {
                    "data-info": `${timePoint},${voluePoint},${column}`,
                    fill: color,
                    cx: x,
                    cy: y,
                    r: 2,

                })
                group.append(circle);
                circle.onmouseover = circle.onmouseout = handler;
                // circle.addEventListener('click', showPointInfo)
                return `${x},${y}`
            })

            setAttributes(polyline, {
                points: `${coordinatesLine.join(" ")}`,
                fill: "none", 
            })
            group.append(polyline);
        }
    })
}

function handler(event) {
    const circle = event.currentTarget;
    const pointParametrs = event.currentTarget.dataset.info.split(",");
    const xPoint = event.currentTarget.attributes.cx.value;
    const yPoint = event.currentTarget.attributes.cy.value;
    const infoWindow = document.getElementById("info-window");
    const titleTime = document.getElementById("time-info");
    const titleValue = document.getElementById("value-info");

    const path = moveInfoWindow(xPoint, yPoint, infoWindow, titleTime, titleValue);
    fillInfoWindow(pointParametrs, infoWindow, titleTime, titleValue);
    

    if (event.type === 'mouseover') {
        infoWindow.style.display = "inline-block";
        circle.setAttribute("r", "4")
    }
    if (event.type === 'mouseout') {
        infoWindow.style.display = "none";
        path.removeAttribute("transform")
        titleTime.setAttribute("x", "15");
		titleValue.setAttribute("x", "15");
        titleTime.setAttribute("y", "35");
		titleValue.setAttribute("y", "55");
        circle.setAttribute("r", "2");
    }
}

function createCoordinete(valueX, zoomX, valueY, zoomY) {
    const x = Math.round(valueX * zoomX) + SVG_PADDING_LEFT;
    const y = state.graphSizeY + SVG_PADDING_TOP - Math.round(valueY * zoomY);

    return [x, y];
}

function selectGraph(event) {
    const visibleColumnIndex = event.currentTarget.dataset.index;

    state.setGraphVisible[visibleColumnIndex] = !state.setGraphVisible[visibleColumnIndex];
    svgDinamic.innerHTML = "";
    state.maxValueY = 0;
    viewLegendItemChanger(visibleColumnIndex)
    createGraphSvg();
}

function viewLegendItemChanger(itemIndex) {
    const ledendSvg = document.getElementById(`legend${itemIndex}`);

    if (state.setGraphVisible[itemIndex]) ledendSvg.classList.remove("non-select")
    if (!state.setGraphVisible[itemIndex]) ledendSvg.classList.add("non-select")
}

function getGraphSize() {
    const graphSizeX = state.maxSvgWidth - SVG_PADDING_LEFT - SVG_PADDING_RIGHT;
    const graphSizeY = state.maxSvgHeight - SVG_PADDING_TOP - SVG_PADDING_BOTTOM;

    return [graphSizeX, graphSizeY];
}

function getMaxValueXY() {
    let maxValueY = 0;
    let maxTimeValue = 0;

    state.values.forEach((column, index) => {
        if (index === 0) maxTimeValue = column.maxValue;
        if (column.maxValue > maxValueY &&
             state.setGraphVisible[index]) maxValueY = column.maxValue;
    });

    return [maxTimeValue, maxValueY];
}

function createSvgElement(tagName) {
	return document.createElementNS('http://www.w3.org/2000/svg', tagName);
}

function setAttributes(svgElement, attributesObject) {
	Object.keys(attributesObject).forEach((key) => {
		svgElement.setAttribute(key, attributesObject[key])
	})
}

export {createLegend, createCoordinete, createSvgElement, setAttributes, svg, svgDinamic, SVG_COLOR, SVG_PADDING_LEFT, SVG_PADDING_TOP};