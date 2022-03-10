// keep track of how many links were solved successfully
var solved = 0;

// time increment
var milliseconds = 0;
var seconds = 0;
var minutes = 0;

// instances of dom objects
var timer = document.querySelectorAll(".display")[0];
var input = document.querySelector(".input");
var displaylinks = document.querySelectorAll(".display")[1];
var health = [...document.querySelectorAll(".health div")];
var start = document.querySelector(".start-game");
var modalClose = document.querySelector(".modal-close");
var modalTime = document.querySelector(".modal-time");
var modalContainer = document.querySelector(".modal-box");
var modalSubmit = document.querySelector(".modal > button");
var modalName = document.querySelectorAll(".modal-content")[1];

// keep track of whether the game has been restarted yet
restart = false;
// ID which uniquely identifies the interval to be removed later
intervalId = 0;

modalClose.addEventListener("click", e =>{
    modalContainer.classList.remove("active");
})

async function startGame(numLinksReq){
    const res = await fetch(`/api/${numLinksReq}`) 
    const links = await res.json();

    if (restart === true){
        solved = 0;
        input.value = "";
        input.disabled = false;
        
        input.focus();
        displaylinks.textContent = links[solved+1]
    }
    else {
        displaylinks.textContent = links[solved+1]
        input.disabled = false;
        input.focus();
    
        // add a new event listener when starting game for first time
        input.addEventListener('keyup', (event)=> {  
            if (event.keyCode === 13) {
                if (displaylinks.textContent.localeCompare(input.value) === 0){
                    solved++;
                    if (solved === 10){
                        clearInterval(intervalId);

                        modalName.value = "";
                        modalTime.value = timer.textContent;
                        
                        displaylinks.textContent = "Completed!";
                        input.value = "";
                        input.disabled = true;
                        modalContainer.classList.add("active");
                    }
                    else{
                        displaylinks.textContent = links[solved+1]
                        input.value = "";
                    }   
                }
                else{
                    health.pop().style.color = "purple"
                    if (health.length <= 0){
                        clearInterval(intervalId);
                        displaylinks.textContent = "Game Over!"
                        input.disabled = true;
                    }
                }
            }
        });
    }

    if (restart === false){

        start.setAttribute("value", "↺");
        start.style.color = "green";
        start.style.fontSize = "2.7rem"
        
        intervalId = setInterval(function (){
            incrementTime();
            restart = true;
        },10)     
    }
    else{
        // reseting health color
        health = [...document.querySelectorAll(".health div")]
        health.forEach(e => {
            e.style.color = "red"
        })
        milliseconds=0;
        seconds=0;
        minutes=0;
        clearInterval(intervalId);

        intervalId = setInterval(function (){
            incrementTime();
        },10)  
    } 
}

start.addEventListener("click", function() {
    startGame(10);   
});

document.addEventListener("keyup", function(event) {

    if (event.key === "Control") {
        startGame(10);
    }
});

function incrementTime(){
    milliseconds += 10;
    if (milliseconds === 1000){
        milliseconds=0;
        seconds++;
        if (seconds === 60){
            seconds = 0;
            minutes++;
            if (minutes === 60){
                milliseconds=0;
                seconds=0;
                minutes=0;
            }
        }
    }
    let ms = milliseconds < 10 ? "0"+ milliseconds : milliseconds
    let s = seconds < 10 ? "0"+ seconds : seconds
    let m = minutes < 10 ? "0"+ minutes : minutes
    timer.textContent = `${m} : ${s} : ${ms}`;
} 