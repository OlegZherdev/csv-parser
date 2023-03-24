"use strict";
import {svg, SVG_COLOR} from './create-svg.js';
import {state} from '../script.js';

function moveInfoWindow(xPoint, yPoint, infoWindow, titleTime, titleValue) {
	const path = document.getElementById("path-info");

	let xCoordinate = xPoint - 5;
	let yCoordinate = yPoint;
	let transformX = 1;
	let transformY = 1

	if (xPoint > state.graphSizeX / 2 + 82) {
		transformX = -1;
		titleTime.setAttribute("x", "-165");
		titleValue.setAttribute("x", "-165");
		xCoordinate += 10;
	}
	if (yPoint > state.graphSizeY / 2) {
		transformY = -1;
		titleTime.setAttribute("y", "-47");
		titleValue.setAttribute("y", "-27");
	}

	path.setAttribute("transform", `scale(${transformX}, ${transformY})`);
	infoWindow.setAttribute("transform", `translate(${xCoordinate}, ${yCoordinate})`)
	svg.append(infoWindow);

	return path;
}

function fillInfoWindow(pointParametrs, infoWindow, titleTime, titleValue) {
	const [time, value, colorIndex] = pointParametrs;

	infoWindow.setAttribute("fill", SVG_COLOR[colorIndex]);
	titleTime.innerHTML = `Время: ${time}c`;
	titleValue.innerHTML = `Значение: ${value}`;	
}

export {moveInfoWindow, fillInfoWindow};