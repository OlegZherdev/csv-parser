"use strict";
import { readFileFromState, parseCsv} from './modules/file-handler.js';
import { createLegend, createGraph, setMaxScaleValueArray } from './modules/graphCreator.js';

const state = {
    values: [],
    file: "",
    reader: "",
    csv: "",
    error: false,
    maxTimeValue: 0,
    graphWidth: 0,
    graphHeight: 0,
    maxScaleValue: 0,
    maxScaleValueArray: [],
};

const REGEX_FILE_TYPE = /.csv$/;

const inputZone = document.querySelector(".input-section");
const input = inputZone.querySelector("input");
const graphZone = document.querySelector(".graphic");

inputZone.addEventListener("dragover", (event) => event.preventDefault());
inputZone.addEventListener("drop", (event) => event.preventDefault());

inputZone.addEventListener("drop", (event) => {
    event.preventDefault();
    state.file = event.dataTransfer.files[0];

    compile();    
});

inputZone.addEventListener("click", () => {
    input.click();
});

input.addEventListener("change", () => {
    state.file = input.files[0];

    compile();
});

async function compile() {
    inputZone.style.display = "none";
    graphZone.style.display = "flex";

    if (REGEX_FILE_TYPE.test(state.file.name)) {
        await readFileFromState();
        await parseCsv();
    } else {
        showError("Неверный формат файла.")
    }
    await createLegend();
    await setMaxScaleValueArray();
    createGraph();
}

function showError(errorMessage) {
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

export {state, showError}