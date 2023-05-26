"use strict";
import { state, showError } from '../script.js'

const REGEX_TITLE = /^Time,/;

async function readFileFromState() {
    return new Promise((resolve) => {
        state.reader = new FileReader();
        state.reader.readAsText(state.file);

        state.reader.onload = (event) => {
            state.csv = event.target.result;
            (REGEX_TITLE.test(state.csv) !== false) 
                ? resolve() 
                : showError("Заголовки колонок не соответствуют шаблону");
        }
    })
}

async function parseCsv() {
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
                showError("Неверный формат данных");
                return;
            }

            column.values.push(newArrayItem);

            if (column.maxValue < newArrayItem) column.maxValue = newArrayItem;            
        }) 
    })

    if (state.error === false) {
        return Promise.resolve();
    }
}

export { readFileFromState, parseCsv }