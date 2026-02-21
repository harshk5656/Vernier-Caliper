const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scalePx = 10;
const leastCount = 0.02;

let trueMeasurement = 0;
let slider = 0;
let dragging = false;
let startX = 0;
let score = 0;

const generateBtn = document.getElementById("generateBtn");
const submitBtn = document.getElementById("submitBtn");
const revealBtn = document.getElementById("revealBtn");
const zeroInput = document.getElementById("zeroError");
const studentInput = document.getElementById("studentReading");
const resultText = document.getElementById("result");
const scoreText = document.getElementById("score");

function generateObject() {
    trueMeasurement = Math.random() * 80 + 5;
    trueMeasurement = Math.round(trueMeasurement / leastCount) * leastCount;
    slider = trueMeasurement * scalePx;
    resultText.innerText = "";
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let baseY = canvas.height / 2;

    // Main scale body
    ctx.fillStyle = "#ddd";
    ctx.fillRect(100, baseY - 20, 1000, 40);

    ctx.strokeStyle = "black";
    ctx.font = "12px Arial";

    for (let i = 0; i <= 100; i++) {
        let x = 100 + i * scalePx;
        ctx.beginPath();
        ctx.moveTo(x, baseY - 20);
        ctx.lineTo(x, i % 10 === 0 ? baseY - 50 : baseY - 35);
        ctx.stroke();

        if (i % 10 === 0) {
            ctx.fillText(i, x - 5, baseY - 60);
        }
    }

    // Object
    ctx.fillStyle = "#4da6ff";
    ctx.fillRect(100, baseY - 60, trueMeasurement * scalePx, 40);

    // Sliding Vernier
    ctx.fillStyle = "#ccc";
    ctx.fillRect(100 + slider, baseY - 80, 200, 100);
}

function checkAnswer() {
    let zeroError = parseFloat(zeroInput.value) || 0;
    let student = parseFloat(studentInput.value) || 0;

    let correct = trueMeasurement + zeroError;
    correct = Math.round(correct / leastCount) * leastCount;

    if (Math.abs(student - correct) <= leastCount) {
        score++;
        resultText.innerText = "✅ Correct!";
        resultText.style.color = "lightgreen";
    } else {
        resultText.innerText = "❌ Incorrect!";
        resultText.style.color = "red";
    }

    scoreText.innerText = "Score: " + score;
}

function revealAnswer() {
    let zeroError = parseFloat(zeroInput.value) || 0;
    let correct = trueMeasurement + zeroError;
    correct = Math.round(correct / leastCount) * leastCount;

    resultText.innerText = "Correct Reading: " + correct.toFixed(2) + " mm";
    resultText.style.color = "yellow";
}

generateBtn.addEventListener("click", generateObject);
submitBtn.addEventListener("click", checkAnswer);
revealBtn.addEventListener("click", revealAnswer);

generateObject();
