"use strict";
import {createLegend} from './modules/create-svg.js';

const state = {
    values: [],
    setGraphVisible: [],
    file: "",
    reader: "",
    csv: "",
    maxSvgWidth: 0,
    maxSvgHeight: 600,
    error: false,
    graphSizeX: 0,
    graphSizeY: 0,
    maxTimeValue: 0,
    maxValueY: 0,    
};

const REGEX_FILE_TYPE = /.csv$/;
const REGEX_TITLE = /^Time,/;

const inputZone = document.querySelector(".input-section");
const graphZone = document.querySelector(".graphic");
const input = inputZone.querySelector("input");
const graphArea = document.querySelector(".graphic__svg");

inputZone.addEventListener("dragover", (event) => event.preventDefault());
inputZone.addEventListener("drop", (event) => event.preventDefault());

inputZone.addEventListener("drop", (event) => {
    event.preventDefault();
    console.log(event.dataTransfer);
    state.file = event.dataTransfer.files[0];
    console.log(state.file.name);
    fileCheck();
});

inputZone.addEventListener("click", () => {
    input.click();
});

input.addEventListener("change", () => {
    state.file = input.files[0];
    fileCheck();
});

function fileCheck() {
    changeInpun("Формат не поддерживается", REGEX_FILE_TYPE.test(state.file.name));
}

function changeInpun(errorMessage, status) {
    inputZone.style.display = "none";
    graphZone.style.display = "flex";
    state.maxSvgWidth = graphArea.clientWidth;

    if (status) {
        readFileFromState();
        return;
    }
    
    graphZone.innerHTML = "";

    const messageHeading = document.createElement('h2');

    graphZone.classList.add('graphic__error');
    messageHeading.innerHTML = errorMessage;
    graphZone.prepend(messageHeading);
    state.error = true;

    graphZone.addEventListener('click', () => {
        location.reload();
    })
}

function readFileFromState() {
    state.reader = new FileReader();
    state.reader.readAsText(state.file);

    state.reader.onload = (event) => {
        state.csv = event.target.result;
        if (REGEX_TITLE.test(state.csv) === false) {
            changeInpun("Заголовки колонок не соответствуют шаблону");
            return;
        }
        parseCsv(); 
    }
}

function parseCsv() {
	state.csv.split("\n").forEach((line) => {
        if (line === "") return;
        line.split(",").forEach((subArrayItem, subIndex) => {
            if (typeof state.values[subIndex] !== "object") {
                state.values[subIndex] = {
                    label: subArrayItem,
                    maxValue: 0,
                    values: [],
                }
                return;
            }

            const column = state.values[subIndex];
            const newArrayItem = parseFloat(subArrayItem)
            
            if (isNaN(newArrayItem)) {
                changeInpun("Неверный формат данных");
                return;
            }
            column.values.push(newArrayItem);
            if (column.maxValue < newArrayItem) column.maxValue = newArrayItem;            
        }) 
    })
    if (state.error === false) createLegend();
}

export {state}