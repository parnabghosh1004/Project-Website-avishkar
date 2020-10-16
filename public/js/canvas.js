// window.addEventListener("load", () =>{
//     const canvas =document.querySelector("#canvas");
//     const ctx= canvas.getContext("2d");
//     //resizing
//     canvas.height = window.innerHeight;
//     canvas.width = window.innerWidth;
     
//     let painting=false;

//     function startPosition(e){
//         painting=true;
//         draw(e)
//     }
//     function finishedPosition(){
//         painting=false;
//         ctx.beginPath();
//     }
//     function draw(e){
//         if (!painting) return;
//         ctx.lineWidth=5;
//         ctx.lineCap="round";
//         ctx.strokeStyle='red';

//         ctx.lineTo(e.clientX,e.clientY);
//         ctx.stroke();
//         ctx.beginPath();
//         ctx.moveTo(e.clientX,e.clientY);        
//     }
//     canvas.addEventListener("mousedown",startPosition);
//     canvas.addEventListener("mouseup",finishedPosition);
//     canvas.addEventListener("mousemove",draw);
    
// });


const canvas =document.querySelector("#canvas");
    const ctx= canvas.getContext("2d");
    //resizing
    canvas.height = window.innerHeight-30;
    canvas.width = window.innerWidth -30;
     
    let painting=false;

    function startPosition(e){
        painting=true;
        draw(e)
    }
    function finishedPosition(){
        painting=false;
        ctx.beginPath();
    }
    function draw(e){
        if (!painting) return;
        ctx.lineWidth=5;
        ctx.lineCap="round";
        ctx.strokeStyle='red';

        ctx.lineTo(e.clientX,e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX,e.clientY);        
    }
    canvas.addEventListener("mousedown",startPosition);
    canvas.addEventListener("mouseup",finishedPosition);
    canvas.addEventListener("mousemove",draw);