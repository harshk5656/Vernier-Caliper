import { Renderer } from "./renderer.js";
import { Specimen } from "./specimen.js";

export class Instrument {
    constructor(canvas, readout) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.readout = readout;

        this.pixelRatio = window.devicePixelRatio || 1;
        this.originX = 250;
        this.pxPerMm = 10;

        this.slidingMm = 50;
        this.zeroError = 0;

        this.specimen = new Specimen(32.45);

        this.renderer = new Renderer(this.ctx, this);

        this.init();
    }

    init(){
        this.resize();
        window.addEventListener("resize",()=>this.resize());
        this.attachEvents();
        this.render();
    }

    resize(){
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * this.pixelRatio;
        this.canvas.height = rect.height * this.pixelRatio;
        this.ctx.scale(this.pixelRatio,this.pixelRatio);
        this.render();
    }

    attachEvents(){
        let dragging=false;
        let startX=0;

        this.canvas.onmousedown=(e)=>{
            dragging=true;
            startX=e.offsetX;
        };

        window.onmousemove=(e)=>{
            if(!dragging) return;
            const dx=e.movementX;
            this.slidingMm += dx/this.pxPerMm;

            if(this.slidingMm < this.specimen.width)
                this.slidingMm = this.specimen.width;

            this.render();
        };

        window.onmouseup=()=>dragging=false;
    }

    setSpecimenWidth(w){
        this.specimen.width = w;
        this.slidingMm = w + 10;
        this.render();
    }

    setZero(z){
        this.zeroError = z;
        this.render();
    }

    render(){
        this.renderer.draw();
        const reading = Math.max(0, this.slidingMm + this.zeroError);
        this.readout.innerText = reading.toFixed(2) + " mm";
    }
}
