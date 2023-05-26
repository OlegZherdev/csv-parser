"use strict";
import { readFileFromState, parseCsv} from './modules/file-handler.js';
import { createLegend, createGraph, setMaxScaleValueArray } from './modules/graphCreator.js';

const state = {
    values: [],
    file: "",
    reader: "",
    csv: "Time,Boost pressure bar,Boost pressure setpoint bar,Control deviation of the boost pressure regulator - bank-specific bank 1 bar\n0.0000,0.00,0.00,0.00\n0.1650,0.00,0.00,8.18\n0.3240,0.01,0.00,8.18\n0.5010,0.01,0.00,8.18\n0.7000,0.01,0.00,8.18\n0.8960,0.01,0.00,8.18\n1.0640,0.01,0.00,8.18\n1.2440,0.01,0.00,8.18\n1.4380,0.01,0.00,8.18\n1.6240,0.01,0.00,8.18\n1.8120,0.01,0.00,8.18\n2.0000,0.01,0.00,8.18\n2.2390,0.01,0.00,8.18\n2.4590,0.01,0.00,8.18\n2.6570,0.01,0.00,8.18\n2.8750,0.01,0.00,8.18\n3.0760,0.01,0.00,8.18\n3.3000,0.01,0.00,8.18\n3.5390,0.01,0.00,8.18\n3.7640,0.01,0.00,8.19\n3.9620,0.01,0.00,8.19\n4.1890,0.01,0.00,8.19\n4.4150,0.01,0.00,8.19\n4.6020,0.00,0.00,8.19\n4.7930,0.00,0.00,8.19\n5.0180,0.00,0.00,8.19\n5.2340,0.00,0.00,8.19\n5.4600,0.00,0.00,8.19\n5.6790,0.00,0.00,8.19\n5.8690,0.00,0.00,8.19\n6.0770,0.00,0.00,8.19\n6.2750,0.00,0.00,8.19\n6.4960,0.00,0.00,8.19\n6.7230,0.00,0.00,8.19\n6.9440,0.00,0.00,8.19\n7.1550,0.00,0.00,8.19\n7.3690,0.00,0.00,8.19\n7.5830,0.00,0.00,8.19\n7.7720,0.00,0.00,8.19\n7.9810,0.00,0.00,8.19\n8.1960,0.00,0.00,8.19\n8.3830,0.00,0.00,8.19\n8.5910,0.00,0.00,8.19\n8.7820,0.00,0.00,8.19\n9.0040,0.00,0.00,8.19\n9.2400,0.00,0.00,8.19\n9.4980,0.00,0.00,8.19\n9.7250,0.00,0.00,8.19\n9.9440,0.00,0.00,8.19\n10.1580,0.00,0.00,8.19\n10.3630,0.01,0.00,8.19\n10.5670,0.01,0.00,8.19\n10.7710,0.01,0.00,8.17\n10.9960,0.03,0.00,8.17\n11.2110,0.03,0.00,8.17\n11.4340,0.03,0.00,8.12\n11.6450,0.10,0.00,8.12\n11.8810,0.10,0.00,8.12\n12.1030,0.10,0.00,8.05\n12.3230,0.17,0.00,8.05\n12.5320,0.17,0.01,8.05\n12.7430,0.17,0.01,0.01\n12.9660,0.15,0.01,0.01\n13.1840,0.15,0.33,0.01\n13.4010,0.15,0.33,0.13\n13.6110,0.39,0.33,0.13\n13.8730,0.39,0.44,0.13\n14.1030,0.39,0.44,0.01\n14.3120,0.39,0.44,0.01\n14.5430,0.39,0.40,0.01\n14.7810,0.39,0.40,8.17\n14.9920,0.47,0.40,8.17\n15.2130,0.47,0.37,8.17\n15.4030,0.47,0.37,0.05\n15.5980,0.34,0.37,0.05\n15.8120,0.34,0.41,0.05\n16.0760,0.34,0.41,0.07\n16.3000,0.34,0.41,0.07\n16.5210,0.34,0.40,0.07\n16.7560,0.34,0.40,0.06\n16.9530,0.34,0.40,0.06\n17.1580,0.34,0.38,0.06\n17.3560,0.34,0.38,0.05\n17.5640,0.34,0.38,0.05\n17.7920,0.34,0.30,0.05\n18.0040,0.34,0.30,8.06\n18.2260,0.47,0.30,8.06\n18.4600,0.47,0.45,8.06\n18.6670,0.47,0.45,0.13\n18.8990,0.37,0.45,0.13\n19.1230,0.37,0.45,0.13\n19.3170,0.37,0.45,0.06\n19.4940,0.37,0.45,0.06\n19.6960,0.37,0.42,0.06\n19.9180,0.37,0.42,0.05\n20.1230,0.37,0.42,0.05\n20.3450,0.37,0.42,0.05\n20.5450,0.37,0.42,0.03\n20.7640,0.39,0.42,0.03\n20.9820,0.39,0.42,0.03\n21.2080,0.39,0.42,0.03\n21.4400,0.37,0.42,0.03\n21.6520,0.37,0.00,0.03\n21.8680,0.37,0.00,8.02\n22.0550,0.13,0.00,8.02\n22.2420,0.13,0.02,8.02\n22.4720,0.13,0.02,8.12\n22.6820,0.08,0.02,8.12\n22.9020,0.08,0.00,8.12\n23.1120,0.08,0.00,8.14\n23.3310,0.06,0.00,8.14\n23.5510,0.06,0.02,8.14\n23.7570,0.06,0.02,8.12\n23.9710,0.09,0.02,8.12\n24.1960,0.09,0.02,8.12\n24.4210,0.09,0.02,8.12\n24.6540,0.09,0.02,8.12\n24.9010,0.09,0.02,8.12\n25.1400,0.09,0.02,8.12\n25.3600,0.09,0.02,8.12\n25.5830,0.09,0.02,8.12\n25.8070,0.09,0.02,8.12\n25.9950,0.09,0.02,8.12\n26.2390,0.09,0.02,8.12\n26.4750,0.09,0.02,8.12\n26.7040,0.08,0.02,8.12\n26.9110,0.08,0.02,8.12\n27.1220,0.08,0.02,8.13\n27.3340,0.08,0.02,8.13\n27.6150,0.08,0.02,8.13\n27.8180,0.08,0.02,8.13\n28.0200,0.08,0.02,8.13\n28.2360,0.08,0.02,8.13\n28.4690,0.08,0.02,8.13\n28.6920,0.08,0.02,8.13\n28.9690,0.08,0.02,8.13\n29.2140,0.08,0.02,8.13\n29.4550,0.08,0.02,8.13\n29.6570,0.08,0.02,8.13\n29.8750,0.08,0.02,8.13\n30.0550,0.08,0.02,8.13\n30.2590,0.08,0.02,8.13\n30.4580,0.08,0.02,8.13\n30.6780,0.08,0.02,8.13\n30.9020,0.08,0.02,8.13\n31.1180,0.08,0.02,8.13\n31.3410,0.08,0.02,8.13\n31.5380,0.08,0.02,8.13\n31.7420,0.08,0.02,8.13\n31.9670,0.07,0.02,8.13\n32.1570,0.07,0.02,8.13\n32.3750,0.07,0.02,8.14\n32.6510,0.07,0.02,8.14\n32.8670,0.07,0.02,8.14\n33.0820,0.07,0.02,8.14\n33.2800,0.07,0.02,8.14\n33.5060,0.07,0.02,8.14\n33.7140,0.07,0.02,8.15\n33.9140,0.06,0.02,8.15\n34.1220,0.06,0.02,8.15\n34.3570,0.06,0.02,8.17\n34.5860,0.04,0.02,8.17\n34.8110,0.04,0.02,8.17\n35.0410,0.04,0.02,8.18\n35.2760,0.03,0.02,8.18\n35.4760,0.03,0.02,8.18\n35.7120,0.03,0.02,8.18\n35.9140,0.02,0.02,8.18\n36.1320,0.02,0.02,8.18\n36.3510,0.02,0.02,8.19\n36.5640,0.02,0.02,8.19\n36.7100,0.02,0.01,8.19\n36.8670,0.02,0.01,8.19\n37.1010,0.02,0.01,8.19\n37.2880,0.02,0.01,8.19\n37.4630,0.02,0.01,8.19\n37.6310,0.02,0.01,8.19\n37.8350,0.02,0.00,8.19\n38.0360,0.02,0.00,8.18\n38.2590,0.02,0.00,8.18\n38.4820,0.02,0.00,8.18\n38.6690,0.02,0.00,8.18\n38.8430,0.02,0.00,8.18\n39.0350,0.02,0.00,8.18\n39.2660,0.02,0.00,8.18\n39.4770,0.02,0.00,8.18\n39.7020,0.02,0.00,8.18\n39.9110,0.02,0.00,8.18\n40.1120,0.01,0.00,8.18\n40.3230,0.01,0.00,8.18\n40.5380,0.01,0.00,8.18\n40.7480,0.01,0.00,8.18\n40.9740,0.01,0.00,8.18\n41.1910,0.01,0.00,8.18\n41.4210,0.01,0.00,8.18\n41.6860,0.01,0.00,8.18\n41.8780,0.01,0.00,8.19\n42.0950,0.01,0.00,8.19\n42.2440,0.01,0.00,8.19\n42.4170,0.01,0.00,8.19\n42.6030,0.00,0.00,8.19\n42.8390,0.00,0.00,8.19\n43.0460,0.00,0.00,8.19\n43.2680,0.01,0.00,8.19\n43.4800,0.01,0.00,8.19\n43.6980,0.01,0.00,8.19\n43.9240,0.01,0.00,8.19\n44.1590,0.01,0.00,8.19\n44.3860,0.01,0.00,8.18\n44.6030,0.01,0.00,8.18\n44.8140,0.01,0.00,8.18\n45.0230,0.01,0.00,8.18\n45.2150,0.02,0.00,8.18\n45.4020,0.02,0.00,8.18\n45.6110,0.02,0.00,8.16\n45.8270,0.04,0.00,8.16\n46.0470,0.04,0.00,8.16\n46.2800,0.04,0.00,8.12\n46.4990,0.09,0.00,8.12\n46.7830,0.09,0.00,8.12\n47.0170,0.09,0.00,8.02\n47.2380,0.21,0.00,8.02\n47.4550,0.21,0.23,8.02\n47.7210,0.21,0.23,0.05\n47.9550,0.38,0.23,0.05\n48.1940,0.38,0.51,0.05\n48.4160,0.38,0.51,8.05\n48.6410,0.35,0.51,8.05\n48.8830,0.35,0.41,8.05\n49.1020,0.35,0.41,0.03\n49.3640,0.39,0.41,0.03\n49.5970,0.39,0.33,0.03\n49.8110,0.39,0.33,8.07\n49.9830,0.46,0.33,8.07\n50.1740,0.46,0.43,8.07\n50.4150,0.46,0.43,0.08\n50.6610,0.33,0.43,0.08\n50.8590,0.33,0.40,0.08\n51.0830,0.33,0.40,0.06\n51.3280,0.35,0.40,0.06\n51.5450,0.35,0.38,0.06\n51.7840,0.35,0.38,0.05\n52.0120,0.35,0.38,0.05\n52.2360,0.35,0.29,0.05\n52.4460,0.35,0.29,8.15\n52.6600,0.52,0.29,8.15\n52.8980,0.52,0.42,8.15\n53.1210,0.52,0.42,0.12\n53.3210,0.34,0.42,0.12\n53.4970,0.34,0.45,0.12\n53.7210,0.34,0.45,0.06\n53.9540,0.39,0.45,0.06\n54.1680,0.39,0.42,0.06\n54.3950,0.39,0.42,0.05\n54.5980,0.37,0.42,0.05\n54.8360,0.37,0.41,0.05\n55.0250,0.37,0.41,0.03\n55.1790,0.39,0.41,0.03\n55.3760,0.39,0.42,0.03\n55.5670,0.39,0.42,0.03\n55.7680,0.39,0.42,0.03\n55.9470,0.39,0.41,0.03\n56.1520,0.39,0.41,0.03\n56.3400,0.38,0.41,0.03\n56.5240,0.38,0.40,0.03\n56.7220,0.38,0.40,0.03\n56.9710,0.34,0.40,0.03\n57.1910,0.34,0.37,0.03\n57.4320,0.34,0.37,0.04\n57.6530,0.31,0.37,0.04\n57.8680,0.31,0.36,0.04\n58.1020,0.31,0.36,0.05\n58.3330,0.29,0.36,0.05\n58.5740,0.29,0.34,0.05\n58.7740,0.29,0.34,8.17\n59.0160,0.43,0.34,8.17\n59.2490,0.43,0.37,8.17\n59.4450,0.43,0.37,0.07\n59.6750,0.30,0.37,0.07\n59.9060,0.30,0.39,0.07\n60.1130,0.30,0.39,0.08\n60.3450,0.33,0.39,0.08\n60.5550,0.33,0.00,0.08\n60.7740,0.33,0.00,7.97\n60.9830,0.14,0.00,7.97\n61.2070,0.14,0.02,7.97\n61.4230,0.14,0.02,8.11\n61.6250,0.08,0.02,8.11\n61.8170,0.08,0.02,8.11\n62.0570,0.08,0.02,8.14\n62.3200,0.07,0.02,8.14\n62.6030,0.07,0.02,8.14\n62.8410,0.07,0.02,8.11\n63.0590,0.10,0.02,8.11\n63.2830,0.10,0.02,8.11\n63.5180,0.10,0.02,8.11\n63.7210,0.10,0.02,8.11\n63.9420,0.10,0.02,8.11\n64.1720,0.10,0.02,8.11\n64.3960,0.10,0.02,8.11\n64.6010,0.10,0.02,8.11\n64.8340,0.10,0.02,8.11\n65.0690,0.10,0.02,8.11\n65.2910,0.10,0.02,8.11\n65.5060,0.10,0.02,8.11\n65.7130,0.10,0.02,8.11\n65.9470,0.10,0.02,8.11\n66.1870,0.10,0.02,8.11\n66.4130,0.09,0.02,8.11\n66.6410,0.09,0.02,8.11\n66.8570,0.09,0.02,8.12\n67.0780,0.09,0.02,8.12\n67.3030,0.09,0.02,8.12\n67.5230,0.09,0.02,8.12\n67.7500,0.09,0.02,8.12\n67.9760,0.09,0.00,8.12\n68.1960,0.09,0.00,8.14\n68.4120,0.04,0.00,8.14\n68.6230,0.04,0.02,8.14\n68.8150,0.04,0.02,8.18\n69.0150,0.02,0.02,8.18\n69.2410,0.02,0.02,8.18\n69.4730,0.02,0.02,0.00\n69.7030,0.02,0.02,0.00\n69.9200,0.02,0.02,0.00\n70.1340,0.02,0.02,8.19\n70.3460,0.02,0.02,8.19\n70.5620,0.02,0.02,8.19\n70.8100,0.02,0.02,8.19\n71.0480,0.02,0.02,8.19\n71.2180,0.02,0.02,8.19\n71.4040,0.02,0.02,0.00\n71.5990,0.02,0.02,0.00\n71.8000,0.02,0.02,0.00\n72.0170,0.02,0.02,0.00\n72.2440,0.02,0.02,0.00\n72.4760,0.02,0.00,0.00\n72.7160,0.02,0.00,8.17\n72.9400,0.02,0.00,8.17\n73.1600,0.02,0.00,8.17\n73.3820,0.02,0.00,8.17\n73.6020,0.02,0.00,8.17\n73.8140,0.02,0.00,8.17\n74.0340,0.02,0.00,8.17\n",
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
console.log('1')
async function compile() {
    console.log(2)
    inputZone.style.display = "none";
    graphZone.style.display = "flex";

    if (REGEX_FILE_TYPE.test(state.file.name)) {
        await readFileFromState();
        await parseCsv();
    } else {
        showError("Неверный формат файла.")
    }
    await createLegend();
    setMaxScaleValueArray();
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