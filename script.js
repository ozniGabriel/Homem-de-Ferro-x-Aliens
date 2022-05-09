let startGame = document.querySelector('#playButton')
let inicio = document.querySelector('.inicio')
let playArea = document.querySelector('.jogo')
let hero = document.querySelector('.jogador')
let points = document.querySelector('.points')
let images = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png']
let score = 0
let finish = false

// MOVIMENTAR O HERÓI
function moveHero(event) {
    if (event === 'ArrowDown') {
        let yPosition = parseInt(
            window.getComputedStyle(hero).getPropertyValue('top')
        )
        if (yPosition >= 490) {
            return
        }
        hero.style.top = `${yPosition + 30}px`
    }

    if (event === 'ArrowUp') {
        let yPosition = parseInt(
            window.getComputedStyle(hero).getPropertyValue('top')
        )
        if (yPosition <= 20) {
            return
        }
        hero.style.top = `${yPosition - 30}px`
    }
}

// CRIAR UM DISPARO
function createLaser() {
    let laser = document.createElement('img')
    laser.src = 'img/shoot.png'
    laser.classList.add('laser')
    positionLaser(laser)
}

// POSICIONAR CORRETAMENTE O DISPARO NA TELA
function positionLaser(laser) {
    let xPosition = parseInt(
        window.getComputedStyle(hero).getPropertyValue('left')
    )
    let yPosition = parseInt(
        window.getComputedStyle(hero).getPropertyValue('top')
    )
    laser.style.left = `${xPosition + 190}px`
    laser.style.top = `${yPosition}px`
    playArea.appendChild(laser)
    moveLaser(laser)
}

// MOVER O DISPARO (LASER)
function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left)
        let aliens = document.querySelectorAll('.alien')
        if (xPosition >= 950) {
            laser.remove()
        }
        aliens.forEach(alien => {
            if (detectCollision(laser, alien)) {
                clearInterval(laserInterval)
                showExplosion(alien, laser)
            }
        })
        laser.style.left = `${xPosition + 40}px`
    }, 60)
}

// DETECTAR ALIENS ABATIDOS
function detectCollision(laser, alien) {
    let laserTop = parseInt(
        window.getComputedStyle(laser).getPropertyValue('top')
    )
    let laserLeft = parseInt(
        window.getComputedStyle(laser).getPropertyValue('left')
    )
    let laserBottom = parseInt(
        window.getComputedStyle(laser).getPropertyValue('bottom')
    )

    let alienTop = parseInt(
        window.getComputedStyle(alien).getPropertyValue('top')
    )
    let alienLeft = parseInt(
        window.getComputedStyle(alien).getPropertyValue('left')
    )
    let alienBottom = parseInt(
        window.getComputedStyle(alien).getPropertyValue('bottom')
    )

    if (
        laserLeft >= alienLeft &&
        laserTop + 30 >= alienTop &&
        laserBottom + 30 >= alienBottom
    ) {
        return true
    } else {
        return false
    }
}

// CRIAR INIMIGOS
function createAliens() {
    let alien = document.createElement('img')
    let indexRandomImage = Math.floor(Math.random() * images.length)
    alien.src = images[indexRandomImage]
    alien.classList.add('alien')
    alien.style.top = `${Math.floor(Math.random() * 500)}px`
    playArea.appendChild(alien)
    moveAlien(alien)
}

// MOVIMENTAR INIMIGOS
function moveAlien(alien) {
    let walkingAlien = setInterval(() => {
        let alienLeft = parseInt(
            window.getComputedStyle(alien).getPropertyValue('left')
        )

        alien.style.left = `${alienLeft - 8}px`

        if (alienLeft <= 120) {
            return gameOver()
        }
    }, 50)
}

// FIM DE JOGO
function gameOver() {
    playArea.classList.add('jogoPerdido')
    let aliens = document.querySelectorAll('.alien')
    let lasers = document.querySelectorAll('.laser')
    aliens.forEach(alien => alien.remove()) //REMOVE TODOS OS ALIENS QUE AINDA ESTIVEREM NA TELA
    lasers.forEach(laser => laser.remove())
    finish = true
    document.querySelector('#message').innerHTML = 'Missão Fracassada!'
    startGame.innerHTML = 'Novo Jogo'
    inicio.style.display = 'flex'
    hero.style.top = '100px'
}

// FUNÇÃO PRA RESOLVER UM BUG QUE DAVA NA HORA DE SOMAR OS PONTOS
function showExplosion(alien, laser) {
    laser.remove()
    let explosion = document.createElement('img')
    explosion.src = 'img/explosion.png'
    explosion.classList.add('explosion')
    explosion.style.top = window.getComputedStyle(alien).getPropertyValue('top')
    explosion.style.left = window
        .getComputedStyle(alien)
        .getPropertyValue('left')
    alien.remove()
    playArea.appendChild(explosion)
    setTimeout(() => {
        explosion.classList.add('explosionHide')
    }, 200)
    setTimeout(() => {
        explosion.remove()
    }, 1000)
    score += 10
    points.innerHTML = `Pontuação: ${score}`
}

// INICIAR JOGO
function playGame() {
    playArea.classList.remove('jogoPerdido')
    inicio.style.display = 'none'
    finish = false
    score = 0
    points.innerHTML = 'Pontuação: 0'

    window.addEventListener('keydown', event => {
        if (event.key === ' ') {
            createLaser()
        }
        moveHero(event.key)
    })

    setInterval(() => {
        if (!finish) {
            createAliens()
        }
    }, 2500)

    setInterval(()=>{
        hero.src = "img/iron-man-rocket.png"
        setTimeout(()=>{
            hero.src = "img/iron-man.png"
        },500)
    },1000)
}

startGame.addEventListener('click', playGame)