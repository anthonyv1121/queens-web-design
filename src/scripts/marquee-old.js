
export const marquee = (parentEl, marqueeEl, textEl) => {
    const message = "<div class='neon'>websites</div>"
    const html = `<div id="${marqueeEl}"><div id="${textEl}">${message}</div></div>`;
    const imageBgW = 1700;
    const marqueeElX = 692; // (marqueeElX * ww)/imageBgW
    parentEl.append($("<div id='marquee-wrapper'>" + html + "</div>"));
    const marqueeElHolder = $("#" + marqueeEl);

    const createMarquee = () => {
        const text = $("#" + textEl);
        const width = text.width();
        setBgPosition();
        return {
            text,
            width,
            start_pos: marqueeElHolder.width(),
            end_pos: -width
        }
    }
    const getPosition= () => {
        const ww = parentEl.width();
        const bgPosX = (imageBgW - ww)/2;
        const marginL= 9;
        const position = {y: 645, x:(marqueeElX - bgPosX) + marginL}
        return position;
    }

    const setBgPosition = () => {
        const position = getPosition();
        marqueeElHolder.css({"top": position.y, "left": position.x })
        //parentEl.css("background-position", -position.bgPosX + "px 0")
    }


    const init = () => {
        const {text, width, start_pos, end_pos} = createMarquee();
        // text.css({'width': width,'left': start_pos});                        
        
        const scroll = () => {
            if (text.position().left <= -width) {
                text.css('left', start_pos);
                scroll();
            }
            else {
               let time = (parseInt(text.position().left, 10) - end_pos) * (10000 / (start_pos - end_pos)); // Increase or decrease speed by changing value 10000
               text.animate({'left': -width}, time, 'linear', () => {
                    scroll();
                });
            }
        }
    
        
    //    scroll();
       
    };
    
    // const fnConfig = {
    //     breakpoint:768, 
    //     run:init,
    //     onResize:true
    // }
    
    // old flicker functionality
    // function flicker() {
    //     var time = Math.floor(Math.random() * (1100 - 49 + 1) ) + 49;
    //     var text = $(".neon").text();
    //     $(".neon").html("")
    //     var letters = text.split("")
    //     var unique = letters.map((letter, i) =>{
    //         var letterId = `${letter}-${i}`
    //         $(".neon").append(`<div data-key="${letterId}" class="inline-block">${letter}</div>`);
    //         return letterId
    //     })
    //     //console.log(letters);
    //     return setInterval(function(){
    //         var index = Math.floor(Math.random() * (unique.length-1 - 0 + 1) ) + 0
    //         //console.log("index", index);
    //         $("[data-key=" + unique[index] + "]" ).toggleClass("flicker") 
    //      }, time);
    // }
    // return {
    //     init: () => runAtBrowserViewport(fnConfig)
    // };
    return init;
    
  
}