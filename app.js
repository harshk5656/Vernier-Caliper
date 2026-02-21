import { Instrument } from "./instrument.js";

const canvas = document.getElementById("canvas");
const readout = document.getElementById("readout");

const instrument = new Instrument(canvas, readout);

document.getElementById("applyBtn").onclick = () => {
    instrument.setSpecimenWidth(
        parseFloat(document.getElementById("widthInput").value)
    );
};

document.getElementById("zeroInput").oninput = (e) => {
    instrument.setZero(parseFloat(e.target.value));
    document.getElementById("zeroLabel").innerText =
        parseFloat(e.target.value).toFixed(2) + " mm";
};
