export class Renderer{
    constructor(ctx, instrument){
        this.ctx = ctx;
        this.instrument = instrument;
    }

    brushedMetal(x,y,w,h){
        const g=this.ctx.createLinearGradient(x,y,x,y+h);
        g.addColorStop(0,"#f2f2f2");
        g.addColorStop(0.5,"#ffffff");
        g.addColorStop(1,"#bcbcbc");
        return g;
    }

    draw(){
        const {ctx,instrument}=this;
        const width=ctx.canvas.width/instrument.pixelRatio;
        const height=ctx.canvas.height/instrument.pixelRatio;

        ctx.clearRect(0,0,width,height);

        const origin=instrument.originX;
        const pxPerMm=instrument.pxPerMm;

        // Specimen
        ctx.fillStyle="#333";
        ctx.fillRect(origin,350,
            instrument.specimen.width*pxPerMm,50);

        // Main Beam
        ctx.fillStyle=this.brushedMetal(100,250,2000,80);
        ctx.fillRect(100,250,2000,80);

        // Main Scale
        ctx.fillStyle="#000";
        for(let i=0;i<=200;i++){
            const x=origin+i*pxPerMm;
            const h=i%10===0?40:20;
            ctx.fillRect(x,330-h,1.5,h);
        }

        // Sliding Jaw
        const offset=(instrument.slidingMm+
                     instrument.zeroError)*pxPerMm;

        ctx.fillStyle="rgba(230,230,230,0.98)";
        ctx.fillRect(origin+offset,220,200,150);

        // Vernier (10 VSD = 9 MSD)
        const vsd=0.9;
        ctx.fillStyle="red";
        for(let j=0;j<=10;j++){
            const vx=origin+offset+j*vsd*pxPerMm;
            ctx.fillRect(vx,330,1.5,25);
        }
    }
}
