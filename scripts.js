"use strict";

//major variables
var ctx, savectx, canvas, saveCanvas;
var gameState;


//Clothing type (closet) arrays

var closetHair = [];
var closetFace = [];
var closetAccessories = [];
var closetTop = [];
var closetBottoms = [];
var closetShoes = [];
var currentCloset;

var fullCloset = [closetShoes, closetBottoms, closetTop, closetFace, closetHair, closetAccessories];

//Current outfit - images to be drawn
var currentOutfit = [];
var dollToneRefs = [];
var dollTones = [];
var dollImgRef;
var currentPage;

var imgWidth = 350; // Dimensions of doll image
var imgHeight = 600;


//INIT =================================================================================


function init(){
    console.log('init called');
    window.requestAnimationFrame(update);
    
    canvas = document.getElementById("paintboard");
    ctx = canvas.getContext("2d");
    
    //initialize hidden saving canvas
    saveCanvas = document.createElement('canvas');
    saveCanvas.style.display = 'none';
    document.body.appendChild(saveCanvas);
    saveCanvas.width = imgWidth;
    saveCanvas.height = imgHeight;
    
    savectx = saveCanvas.getContext('2d');
    
    gameState = "start";
        
    //hook up closet buttons and mouse click
    hookUp();
    canvas.onmousedown = mouseClick;
    window.onblur = function(){
        gameState = "pause";
    }
    window.onfocus = function(){
        if(gameState != "start"){
            gameState = "main loop";
            requestAnimationFrame(update);
            refreshCloset();
        }
    }
    
    //generate images and populate arrays
    dollToneRefs.push("./Assets/BaseLight.png"); 
    dollToneRefs.push("./Assets/BaseMid.png");
    dollToneRefs.push("./Assets/BaseMed.png"); 
    dollToneRefs.push("./Assets/BaseDark.png");
    fillCloset();
    genImageTags();
    currentCloset = closetBottoms;
    currentPage = 0;
    
    //draw doll once
    dressDoll();
    beginNull();
    refreshCloset();
    
     //clear closet area
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(350,0, 800,600);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#336699";
    ctx.font = "20px calibri";
    ctx.fillText("Choose a clothing type below to begin", 380, 100);
    ctx.restore();
    
    
    
}

function update(){
    var updoot = requestAnimationFrame(update);
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0, 350,600);
    ctx.restore();
    
    //Gamestate loop
    
    //Begin
    if(gameState == "start"){
        dressDoll();
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(350,0, 800,600);
        ctx.restore();
        ctx.save();
        ctx.fillStyle = "#336699";
        ctx.font = "20px calibri";
        ctx.fillText("Choose a clothing type below to begin", 380, 100);
        ctx.restore();
    }
    
    //Main
    if(gameState == "main loop"){
        dressDoll();
    }
    
    //pause
    if(gameState == "pause"){
        dressDoll();
        
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0,0,800,600);
        ctx.restore();
        ctx.save();
        ctx.fillStyle = "#336699";
        ctx.font = "20px calibri";
        ctx.fillText("-- Paused --", 360, 300);
        ctx.restore();
        
        
        window.cancelAnimationFrame(updoot);
    }
}


//SETUP HELPERS ============================================================================

//mouse tracker
function getMouse(e){
    var mouse = {}
    mouse.x = e.pageX - e.target.offsetLeft;
    mouse.y = e.pageY - e.target.offsetTop;
    return mouse;
}

//upon click
function mouseClick(e){
    var mousePos = getMouse(e);
    console.log('clicko!');
    
    if(gameState == "start"){
     gameState = "main loop";   
    }
    
    //check for clicks on the clothes
    for(var i=currentPage*16; i < currentCloset.length && i < (currentPage+1) * 16; i++){
        console.log('checked click on ' + currentCloset.toString() + ' and element ' + currentCloset[i]);
        currentCloset[i].isClick(mousePos, ctx);   
    }    
    
    //relist the current outfit for drawing
    activateNextClothes(mousePos);
}


//generate Article objects
function fillCloset(){
    var arrayIndex = 0;
    
    //for all the keys in oLoader file, grab array and populate closets
    for (var key in oLoader){
        var keyArray = oLoader[key];
        
        
        for(var i=0; i < keyArray.length; i++){
            var articleCreate = new Article(keyArray[i], i);
            
            fullCloset[arrayIndex].push(articleCreate);
        }
        
        arrayIndex ++;
    }
    
    //load current outfit as naked
    for(var i=0; i < fullCloset.length; i++){
        currentOutfit.push(fullCloset[i][0]);
    }
}

//calculate page count for a closet and return count
function calcPages(closet){
    var pages;
    pages = Math.ceil(closet.length / 16);
    
    return pages;
}

//Generate the image tags in the html document 
function genImageTags(){
    var loaderDiv = document.getElementById("loader");
    
    //add dolls to the loader
    for(var i=0; i < dollToneRefs.length; i++){
        var node = document.createElement("img");
        node.setAttribute("src", dollToneRefs[i]);
        loaderDiv.appendChild(node);
        dollTones.push(node);
    }
        
    dollImgRef = dollTones[1];
    
    //add clothes to the loader
    for(var e=0; e < fullCloset.length; e++){
        for(var i=0; i < fullCloset[e].length; i++){
            
            fullCloset[e][i].loadImgTag(loaderDiv);
            
        }
    }
}


//hook up the closet buttons and others
function hookUp(){
    //Check for Closet Swaps
    document.querySelector('#hairBtn').onclick = function(){
        swapCloset("Hair");
    };
    document.querySelector('#faceBtn').onclick = function(){
        swapCloset("Face");
    };
    document.querySelector('#accessBtn').onclick = function(){
        swapCloset("Access");
    }; 
    document.querySelector('#topsBtn').onclick = function(){
        swapCloset("Top");
    };
    document.querySelector('#bottomsBtn').onclick = function(){
        swapCloset("Bottoms");
    };
    document.querySelector('#shoesBtn').onclick = function(){
        swapCloset("Shoes");
    };
    
    //Check for page swaps
    document.querySelector('#prevBtn').onclick = function(){
        if(currentPage > 0){
            currentPage = currentPage - 1; 
            refreshCloset();
        }
    };
    document.querySelector('#nextBtn').onclick = function(){
        if(currentPage < calcPages(currentCloset)-1){
            currentPage = currentPage + 1;  
            refreshCloset();
        }
    };
    
    //check for skintone swaps
    document.querySelector('#lightskin').onclick = function(){
        swapCloset("light");   
    }
    document.querySelector('#midskin').onclick = function(){
        swapCloset("mid");   
    }
    document.querySelector('#medskin').onclick = function(){
        swapCloset("med");   
    }
    document.querySelector('#darkskin').onclick = function(){
        swapCloset("dark");   
    }
}



// ACTIVE FUNCTIONS ======================================================================



//Swap Active Closet upon button press
function swapCloset(whichButton) {
    console.log('Swapped to ' + whichButton + ' closet');
    
    if(gameState == "start"){
     gameState = "main loop";   
    }
    
    currentPage = 0;
    
    switch(whichButton){
        case "Hair":
            currentCloset = closetHair;
            break;
        case "Face":
            currentCloset = closetFace;
            break;
        case "Access":
            currentCloset = closetAccessories;
            break;
        case "Top":
            currentCloset = closetTop;
            break;
        case "Bottoms":
            currentCloset = closetBottoms;
            break;
        case "Shoes":
            currentCloset = closetShoes;
            break;
        case "light":
            dollImgRef = dollTones[0];
            break;
        case "mid":
            dollImgRef = dollTones[1];
            break;
        case "med":
            dollImgRef = dollTones[2];
            break;
        case "dark":
            dollImgRef = dollTones[3];
            break;
        default:
            currentCloset = closetHair;
    }
    
    refreshCloset();
}


//click in closet area; refresh active clothes
function activateNextClothes(mousePos){
    //check for click in closet area
    if(mousePos.x > 350){

        //deactivate former outfit piece based on active closet
        for(var i=0; i < currentCloset.length; i++){
            currentCloset[i].deactivate();
        }

        //reactivate click (or save the misclick, as it were)
        for(var i=0; i < currentCloset.length; i++){
            if(currentCloset[i].isNext() == true){
                   currentCloset[i].activate();
            }
        }
        
        //clear active array
        currentOutfit = [];
        
        //load the active clothes for each category
        for(var e=0; e < fullCloset.length; e++){
            for(var i=0; i < fullCloset[e].length; i++){

                if(fullCloset[e][i].isActive()){
                    currentOutfit.push(fullCloset[e][i]);
                }

            }
        }
        
    } //end area check
    
    refreshCloset();
}


//DRAWIN STUFF ==========================================================================

function dressDoll(){
    //console.log('dress doll called');
    ctx.drawImage(dollImgRef, -35,0);
    
    //check clothes for active status and draw them
    //this is really heavy; an active array would probably be smarter lol
    for(var i=0; i < currentOutfit.length; i++){
        currentOutfit[i].drawDressed(ctx);
    }
    
    saveDollToCanvas();
}


function refreshCloset(){
    //clear closet area
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(350,0, 800,600);
    
    //draw the current clothes
    for(var i=currentPage*16; i < currentCloset.length && i < (currentPage+1) * 16; i++){
        currentCloset[i].drawPreview(ctx);   
    }
}


//save out picture
function saveDollToCanvas(){
    savectx.drawImage(
        canvas,
        0,0, //top left of grab area
        imgWidth,imgHeight, //bottom right of grab area
        0,0, //top left of draw area
        imgWidth, imgHeight //bounds of draw area
    );
    
    var dollData = saveCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
    var saveAnchor = document.querySelector('#saveAnchor');
    saveAnchor.setAttribute('download', 'Doll.png');
    saveAnchor.setAttribute('href', dollData);
}


//GO =====================================================================================

//test activation of clothes
function beginNull(){
    closetHair[0].activate();
    closetFace[0].activate();
    closetAccessories[0].activate();
    closetTop[0].activate();
    closetBottoms[0].activate();
    closetShoes[0].activate();
}

//test what is active
function whatIsActive(){
    for(var e=0; e < fullCloset.length; e++){
            for(var i=0; i < fullCloset[e].length; i++){

                if(fullCloset[e][i].isActive()){
                    console.log(fullCloset[e][i]);
                }

            }
        }
    
}

window.onload = init;



























