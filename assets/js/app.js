document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    const button1 = document.getElementById(".button");
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let platformCount = 5
    let platforms = []
    let UpTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platformSpace = 600 / platformCount //om ruimte tussen platforms te bepalen
            let newPlatBottom = 100 + i * platformSpace
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 180) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if (platform.bottom < 8){
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    console.log(platforms)
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimerId) // zorgt dat vallen stopt terwijl doodler springt
    isJumping = true
    upTimerId = setInterval(function () {
        doodlerBottomSpace += 20 // Increment bottom space
        doodler.style.bottom = doodlerBottomSpace + 'px';

        if (doodlerBottomSpace > startPoint + 180) {
            console.log('Reached peak, starting to fall');
            fall();
        }
    }, 30);
}

    function fall() {
        clearInterval(upTimerId); // Stop jumping
        clearInterval(downTimerId); // Clear any existing fall interval
        isJumping = false;
        downTimerId = setInterval(function () {
            doodlerBottomSpace -= 5; // Reduce bottom space
            doodler.style.bottom = doodlerBottomSpace + 'px';
    
            if (doodlerBottomSpace <= 0) {
                gameOver();
            }
    
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    console.log('Landed on platform');
                    startPoint = doodlerBottomSpace;
                    jump(); // Transition back to jump
                }
            });
        }, 10);
    }
    
    function controls(e) {
        if (e.key === "ArrowLeft") {
            moveLeft()
        } else if (e.key === "ArrowRight") {
            moveRight()
        } else if (e.key === "ArrowUp") {
            moveStraight()
        }
    }

    function moveLeft(){
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        isGoingRight = false
      isGoingLeft = true
     leftTimerId = setInterval(function(){
        if (doodlerLeftSpace >= 0){
            doodlerLeftSpace -=5
            doodler.style.left = doodlerLeftSpace + 'px'
        }
       else moveRight()
     },20)
    }

    function moveRight(){
        clearInterval(leftTimerId);
    clearInterval(rightTimerId);
        isGoingLeft = false
        isGoingRight = true
        rightTimerId = setInterval(function(){
           if (doodlerLeftSpace <= 340){
            doodlerLeftSpace += 5
               doodler.style.left = doodlerLeftSpace + 'px'
           }
          else moveLeft()
        },20)
       }
    
       function moveStraight(){
       isGoingLeft = false
       isGoingRight = false
       clearInterval(rightTimerId)
       clearInterval(leftTimerId)
       }
    
       function gameOver() {
        console.log('game over')
        isGameOver = true
        while (grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }


    function start() {
        createPlatforms();
        createDoodler();
        setInterval(movePlatforms, 30);
        jump();
        document.addEventListener('keyup', controls);
    }

    //make Homescreen and attach to a button
    start()
})

// to do list:
// zorgen dat doodler niet meer via bovenkant eruit kan 
// doodler afbeelding veranderen 
// score manier veranderen
// game over scherm maken 
// coins toevoegen
// score laten opslaan??
// if function maken dat na een bepaalde score platforms tussen de 1 en 5 komen