class Article{
    
    constructor(creationValue, idVal){
        this.imageSrc = "./Assets/" + creationValue + ".png";
        this.imageRef;
        this.id = idVal;
        this.active = false;
        this.nextActive = false;
        
        this.previewX = 355 + 110*(this.id%4);
        this.previewY = Math.floor((this.id%16) / 4)*150;
        //temp solution
            /*if(this.id < 4){
             this.previewY = 150*0;   
            }
            else if(this.id > 4 && this.id < 8){
             this.previewY = 150*1;
            }
            else if(this.id > 8 && this.id < 12){
             this.previewY = 150*2;
            }*/
        
        this.xBounds = this.previewX + 105;
        this.yBounds = this.previewY + 150;
        
    }    
    
    //get set =================================================================
    
    activate(){
        this.active = true;  
        this.nextActive = false;
    }
        
    activateNext(){
        this.nextActive = true;
    }
    
    deactivate(){
        console.log(this.imageSrc + ' deactivated');
        this.active = false;   
    }
    
    //gets
    isActive(){
        return this.active;
    }
    
    isNext(){
        return this.nextActive;
    }
    
    
    
    //functions ===============================================================
    
    loadImgTag(loaderDiv){
        var node = document.createElement("img");
        node.setAttribute("src", this.imageSrc);
        loaderDiv.appendChild(node);
        
        this.imageRef = node;
    }
    
    drawPreview(ctx){
        //test box
        /*ctx.save();
        ctx.fillStyle = "#decaff";
        ctx.fillRect(this.previewX,this.previewY,105,150);
        ctx.restore();*/
        
        if(this.active){
            ctx.save();
            if(this.id%2 == 0){
                ctx.strokeStyle = "#c0ffee";
            }
            if(this.id%2 == 1){
                ctx.strokeStyle = "#decaff";
            }
            ctx.lineWidth = 5;
            ctx.strokeRect(this.previewX,this.previewY,105,150);
            ctx.restore();
        }
        
        ctx.drawImage(this.imageRef, this.previewX,this.previewY, 105,150);
    }
    
    drawDressed(ctx){
        //console.log(this.imageSrc + " is drawing");
        
        if(this.active){
            ctx.drawImage(this.imageRef, -35,0);
        }
    }
    
    //check for a click within bounds and set for activation
    isClick(mousePos, ctx){
        if(mousePos.x > this.previewX && mousePos.x < this.xBounds){
         if(mousePos.y > this.previewY && mousePos.y < this.yBounds){
             console.log(this.imageSrc + " was clicked");
             this.nextActive = true;
             
         }
        }
    }
    
    
    
} // END CLASS



























