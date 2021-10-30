"use strict";



document.addEventListener('DOMContentLoaded', () => {

document.querySelector('.inf').addEventListener('click',()=>{
    swal({title: "Objetivo: ",
        text:("Obtener 10.000 puntos para ganar. Para ello evita colisionar con el enemigo y recoge todas las gemas que puedas. Cada gema suma 100 puntos. Las animaciones keyframe estan en el personaje cuando corre, cuando salta y cuando muere. Tambien en el npc y en las gemas.")});
})

    let avatares = document.querySelector('#avatares');
    let botonPersonaje = document.querySelector('#personaje');
    botonPersonaje.addEventListener('click', () => {
        avatares.hidden = false;
        let nodos = avatares.children;
        nodos[0].addEventListener('click', (e) => {
            document.querySelector('#player').classList.background = "url('./img/run-Sailor\ Moon\ \(1\).png')";
            avatares.hidden = true;
        })
        nodos[1].addEventListener('click', (e) => {
            document.querySelector("#player").classList.background = "url('./img/run-Sailor\ Mars.png')";
            player.classList.add('player-run-right1');
            player.hidden = true;
            avatares.hidden = true;
        })
    })

    /** VARIABLES DEL JUEGO **/
    let gameOver = true;

    /** SCENE OBJECT **/
    let building = document.getElementById('building-back');
    let backgroundFar = document.getElementById('background-far');
    let ground = document.getElementById('ground');
    let backgrounGame = document.getElementById('game-runner');

    //** PLAYER OBJECT **/
    let player = document.getElementById('player');
    let playerWidth = player.offsetWidth;
    let playerHeight = player.offsetHeight;
    let playerPosX;
    let playerPosY;
    let points = document.getElementById('points');

    //** NPC OBJECT **/
    let npc = document.getElementById('npc');
    let npcWidth = npc.offsetWidth;
    let npcHeight = npc.offsetHeight;
    let npcPosX;
    let npcPosY;

    /** COIN OBJECT **/
    let coin = document.getElementById('coin');
    let coinWidth = coin.offsetWidth;
    let coinHeight = coin.offsetHeight;
    let coinPosX;
    let coinPosY;


    /* Si el player se encuentra saltando evita que comience otra animación de salto **/
    let activeJump = true;
    //compatibilidad de navegador
    document.keypress = (e) => {
        e = e || window.event;
        let charCode = e.key || e.which;
        if (charCode === 32) {
            e.preventDefault();
            return false;
        }
    }

    //salta al presionar space
    document.onkeydown = e => {
        if (e.code == 'Space') {
            if (activeJump && !gameOver) {
                activeJump = false;
                if (document.querySelector('#player').classList.background == "url('./img/run-Sailor\ Moon\ \(1\).png')") {
                    player.classList.add('jump');
                }
                if (document.querySelector("#player").classList.background == "url('./img/run-Sailor\ Mars.png')") {
                    player.classList.add('jump1');
                }
                setTimeout(() => {
                    player.classList.remove('jump');
                    player.classList.remove('jump1');
                    activeJump = true;
                }, 900);
            }
        }

    }
    //si el personaje muere reinicia el juego al presionar enter
    document.onkeyup = e => {
        if (e.code == 'Enter') {
            player.hidden = false;
            if (gameOver) {
                resetGame();
            }
        }
    }

    let gameLoop = () => {
        if (!gameOver) {
            increasePoints(1);
            coin.classList.add('coin-animated');
            npc.classList.add('npc-run');
            //Actualizar juego
            update();

            /** Función para saber si recolecto una moneda **/
            if (grabCoin(playerPosX, playerPosY, playerWidth, playerHeight,
                coinPosX, coinPosY, coinWidth, coinHeight)) {
                increasePoints(100);
                coin.classList.remove('coin-animated');
            }


            /** Función para saber si el juego debe terminar **/
            if (isGameOver(playerPosX, playerPosY, playerWidth,
                playerHeight, npcPosX, npcPosY, npcWidth,
                npcHeight)) {
                gameOver = true;
                window.cancelAnimationFrame(gameLoop);

            } else if (isWonGame()) {
                stopGame();
                let info = document.getElementById('info-primary');
                info.innerHTML = "WIN";
                info.classList.remove('no-visibility');
                gameOver = true;
                window.cancelAnimationFrame(gameLoop);
            } else {
                window.requestAnimationFrame(gameLoop);
            }
        } else {
            stopGame();
        }
    }

    window.requestAnimationFrame(gameLoop);


    function isGameOver(x1, y1, w1, h1, x2, y2, w2, h2) {
        if ((isCollition(x1, y1, w1, h1, x2, y2, w2, h2))) {
            stopGame();
            /** Añade la animación de muerte **/
            if (document.querySelector('#player').classList.background == "url('./img/run-Sailor\ Moon\ \(1\).png')") {
                player.classList.add('dead');
            } else {
                player.classList.add('dead1');
            }
            setTimeout(() => {
                player.classList.remove('dead');
                player.classList.remove('dead1');
            }, 2000);
            /** Información al usuario **/
            let infoEndGame = document.getElementById('info-primary');
            infoEndGame.innerHTML = "GAME OVER";
            infoEndGame.classList.remove('no-visibility');
            return true;
        } else {
            return false;
        }
    }

    function grabCoin(playerPosX, playerPosY, playerWidth, playerHeight,
        coinPosX, coinPosY, coinWidth, coinHeight) {
        return isCollition(playerPosX, playerPosY, playerWidth, playerHeight,
            coinPosX, coinPosY, coinWidth, coinHeight);
    }


    function stopGame() {
        /** DETENCIÓN DE ANIMACIONES DEL FONDO **/
        building.classList.remove('building');
        backgroundFar.classList.remove('far');
        ground.classList.remove('ground');
        /** DETENCION DE ANIMACION DE NPC **/
        npc.classList.remove('npc-run');
        /** DETENCIÓN DE ANIMACIÓN DE CORRER DEL PLAYER**/
        player.classList.remove('player-run-right');
        player.classList.remove('player-run-right1');
        /** DETENCIÓN DE ANIMACIÓN DE GOLPE DEL PLAYER**/
        let gameInfo = document.getElementById('game-info');
        gameInfo.classList.remove('no-visibility');
        /** DETENCION DE ANIMACION DE GEMA **/
        coin.classList.remove('coin-animated');
        npc.classList.remove('npc-run');
        /**FONDO FIJO**/
        backgrounGame.classList.add('game');
    }

    // Función para actualizar los objetos del juego, PLAYER y NPC.
    function update() {
        playerPosX = player.offsetLeft;
        playerPosY = player.offsetTop;

        npcPosX = npc.offsetLeft;
        npcPosY = npc.offsetTop + 20;

        coinPosX = coin.offsetLeft;
        coinPosY = coin.offsetTop;
    }

    // Función para saber si se gano el juego
    function isWonGame() {
        return points.innerHTML >= 10000;
    }

    // Funcion para el manejo de la puntuacion
    function increasePoints(numberOfPoints = 0) {
        let point = parseInt(points.innerHTML) + numberOfPoints;
        points.innerHTML = point;
    }

    // Función para poder volver a jugar
    function resetGame() {
        // Reiniciar puntos del juego 
        points.innerHTML = 0;
        // quita carteles de información
        let gameInfo = document.getElementById('game-info');
        gameInfo.classList.add('no-visibility');
        // Animar fondo
        building.classList.add('building');
        backgroundFar.classList.add('far');
        ground.classList.add('ground');
        // Animar personaje
        player.classList.remove('dead');
        player.classList.remove('dead1');
        if (document.querySelector('#player').classList.background == "url('./img/run-Sailor\ Moon\ \(1\).png')") {
            player.classList.add('player-run-right');
        } else {
            player.classList.add('player-run-right1');
        }
        // Animar NPC 
        npc.classList.add('npc-run');
        // Animar COIN
        coin.classList.add('coin-animated');
        //Llamar al Loop del juego de nuevo
        gameOver = false;
        window.requestAnimationFrame(gameLoop);
    }
});
//devuelve true si existe colicion o false sino
function isCollition(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 &&
        h1 + y1 > y2;
}