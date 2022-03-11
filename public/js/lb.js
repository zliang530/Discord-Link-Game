const leaderboard = document.querySelector(".leaderboard")
const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav-links");

burger.addEventListener("click", e=>{
    nav.classList.toggle("active")
})

async function getLeaderboard(){
    const response = await fetch("/leaderboard/10")
    const processedReponse = await response.json()
    var i=0
    processedReponse.forEach(element => {
        i++;
        leaderboard.innerHTML +=   `<div class="col">
                                        <div class="user-score">
                                            <span>${i}</span>
                                            <span>${element.name}</span>
                                        </div>
                                        <span>${element.time.replace(/.(?=[0-9]{3})/g, ':')}</span>
                                    </div>`
        });
    while (i < 10){
        i++
        leaderboard.innerHTML +=   `<div class="col">
                                        <div class="user-score">
                                            <span>${i}</span>
                                            <span>---</span>
                                        </div>
                                        <span>---</span>
                                    </div>`
        
    }
}

getLeaderboard()