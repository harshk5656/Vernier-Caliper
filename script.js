const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const readingText = document.getElementById("reading");
const clickSound = document.getElementById("clickSound");

canvas.width = window.innerWidth;
canvas.height = 500;

let slider = 0;
let dragging = false;
let startX = 0;

const baseY = 260;
const scalePx = 120; // 1 cm
const leastCount = 0.02;

function brushedMetal(x,y,w,h){
    let grad = ctx.createLinearGradient(x,y,x,y+h);
    grad.addColorStop(0,"#f2f2f2");
    grad.addColorStop(0.3,"#d0d0d0");
    grad.addColorStop(0.5,"#ffffff");
    grad.addColorStop(0.7,"#c0c0c0");
    grad.addColorStop(1,"#e8e8e8");
    return grad;
}

function drawBody(){
    ctx.shadowColor="rgba(0,0,0,0.5)";
    ctx.shadowBlur=20;
    ctx.fillStyle=brushedMetal(120,baseY-30,900,60);
    ctx.fillRect(120,baseY-30,900,60);
    ctx.shadowBlur=0;
}

function drawMainScale(){
    ctx.strokeStyle="#111";
    ctx.lineWidth=1;
    ctx.font="16px Arial";
    ctx.fillStyle="black";

    for(let i=0;i<=5;i++){
        let x=120+i*scalePx;

        ctx.beginPath();
        ctx.moveTo(x,baseY-30);
        ctx.lineTo(x,baseY-70);
        ctx.stroke();

        ctx.fillText(i,x-5,baseY-80);

        for(let j=1;j<10;j++){
            let smallX=x+j*(scalePx/10);
            ctx.beginPath();
            ctx.moveTo(smallX,baseY-30);
            ctx.lineTo(smallX,baseY-45);
            ctx.stroke();
        }
    }

    ctx.fillText("1 MSD = 0.1 cm",850,baseY-95);
}

function drawFixedJaw(){
    ctx.fillStyle=brushedMetal(70,baseY-180,70,160);
    ctx.fillRect(80,baseY-180,60,160);
}

function drawSlider(){
    let slideX=120+slider;

    ctx.fillStyle=brushedMetal(slideX,baseY-100,230,130);
    ctx.fillRect(slideX,baseY-100,230,130);

    // sliding jaw
    ctx.fillStyle=brushedMetal(slideX+210,baseY-180,60,160);
    ctx.fillRect(slideX+210,baseY-180,60,160);

    // Vernier scale
    ctx.strokeStyle="#000";
    let remainder=(slider/scalePx)%1;
    let coinciding=Math.round(remainder/leastCount);

    for(let i=0;i<=50;i++){
        let vx=slideX+i*(scalePx/50);

        ctx.beginPath();
        ctx.moveTo(vx,baseY-100);
        ctx.lineTo(vx,baseY-115);
        ctx.stroke();

        if(i===coinciding){
            ctx.strokeStyle="red";
            ctx.beginPath();
            ctx.moveTo(vx,baseY-100);
            ctx.lineTo(vx,baseY-130);
            ctx.stroke();
            ctx.strokeStyle="#000";
        }
    }

    // thumb roller
    ctx.fillStyle="#888";
    ctx.beginPath();
    ctx.arc(slideX+115,baseY+10,25,0,Math.PI*2);
    ctx.fill();

    // roller ridges
    ctx.strokeStyle="#555";
    for(let i=0;i<10;i++){
        ctx.beginPath();
        ctx.moveTo(slideX+95+i*4,baseY-10);
        ctx.lineTo(slideX+95+i*4,baseY+30);
        ctx.stroke();
    }

    // lock screw
    ctx.fillStyle="#666";
    ctx.beginPath();
    ctx.arc(slideX+180,baseY-110,8,0,Math.PI*2);
    ctx.fill();
}

function drawDepthRod(){
    let rodX=120+slider+900;
    ctx.fillStyle="#999";
    ctx.fillRect(rodX,baseY-5,4,50);
}

function calculateReading(){
    let mainScale=Math.floor(slider/scalePx);
    let remainder=(slider/scalePx)-mainScale;
    let vernier=Math.round(remainder/leastCount);
    let reading=(mainScale+vernier*leastCount)*10; // convert to mm
    readingText.innerText=reading.toFixed(2)+" mm";
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawBody();
    drawMainScale();
    drawFixedJaw();
    drawSlider();
    drawDepthRod();
    calculateReading();
}

function startDrag(x){
    dragging=true;
    startX=x;
}

function moveDrag(x){
    if(dragging){
        let dx=x-startX;
        slider+=dx;
        if(slider<0)slider=0;
        if(slider>600)slider=600;
        startX=x;
        clickSound.currentTime=0;
        clickSound.play();
        draw();
    }
}

canvas.addEventListener("mousedown",e=>startDrag(e.offsetX));
canvas.addEventListener("mousemove",e=>moveDrag(e.offsetX));
canvas.addEventListener("mouseup",()=>dragging=false);

canvas.addEventListener("touchstart",e=>startDrag(e.touches[0].clientX));
canvas.addEventListener("touchmove",e=>{
    moveDrag(e.touches[0].clientX);
});
canvas.addEventListener("touchend",()=>dragging=false);

draw();
