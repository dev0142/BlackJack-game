
let blackjackgame = {
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cardMap': { '0': [1, 11], '1': 2, '2': 3, '3': 4, '4': 5, '5': 6, '6': 7, '7': 8, '8': 9, '9': 10, '10': 10, '11': 10, '12': 10 },
    'wins': 0,
    'loss': 0,
    'draw': 0,
    'isStand': false,
    'turnover': false

}


const YOU = blackjackgame['you'];
const DEALER = blackjackgame['dealer'];
const IMAGE = blackjackgame['cardMap'];




const randomImage = ["./images/A.png", "./images/2.png", "./images/3.png", "./images/4.png", "./images/5.png", "./images/6.png", "./images/7.png", "./images/8.png", "./images/9.png", "./images/10.png", "./images/J.png", "./images/K.png", "./images/Q.png"];

const hitaudio = new Audio("./sounds/swish.m4a");
const winaudio = new Audio("./sounds/cash.mp3");
const lossaudio = new Audio("./sounds/aww.mp3");






document.querySelector('#blackjack-hit').addEventListener('click', blackjackhit);
document.querySelector('#blackjack-stand').addEventListener('click', blackjackstand);
document.querySelector('#blackjack-deal').addEventListener('click', blackjackdeal);

function blackjackdeal() {

    if (blackjackgame['turnover'] === true) {

        removeCards();
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = "black";
        blackjackgame['isStand'] = false;
        blackjackgame['turnover'] = false;
        
    }




}
function removeCards() {
    let allimg = document.querySelectorAll('#allimage');
    for (let i = 0; i < allimg.length; i++) {
        allimg[i].remove();
    }
}


function blackjackhit() {
    if (blackjackgame['isStand'] === false) {
        showCards(YOU);
        showScore(YOU);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function blackjackstand() {
    if (blackjackgame['turnover'] === false) {
        blackjackgame['isStand'] = true;
        while (DEALER['score'] < 19 && blackjackgame['isStand'] === true) {

            showCards(DEALER);
            showScore(DEALER);
            await sleep(1000);
        }

        blackjackgame['turnover'] = true;
        showResult(computeWinner());

    }

}


function showCards(activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.setAttribute('id', 'allimage');
        let a = Math.floor(Math.random(3) * 13);
        cardImage.src = randomImage[a];
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitaudio.play();
        updateScore(activePlayer, a);


    }



}

function updateScore(activePlayer, a) {
    if (a === 0) {
        if (activePlayer['score'] + IMAGE[a][1] <= 21) {
            activePlayer['score'] += IMAGE[a][1];
        }
        else {
            activePlayer['score'] += IMAGE[a][0];
        }
    }
    else {

        activePlayer['score'] += IMAGE[a];
        console.log(activePlayer['score']);
    }

}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = "BUST";
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';

    }
    else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}
function computeWinner() {
    let winner;
    //condition:higher score than dealer or when dealer busts but you're not
    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            blackjackgame['wins']++;

            winner = YOU;
        }
        else if (YOU['score'] < DEALER['score']) {
            blackjackgame['loss']++;
            winner = DEALER;

        }
        else if (YOU['score'] === DEALER['score']) {
            blackjackgame['draw']++;

        }
    }
    //condition:when user busts but dealer doesn't
    else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackgame['loss']++;
        winner = DEALER;
    }
    //conditon:when you and dealer busts!
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackgame['draw']++;

    }
    return winner;

}

function showResult(winner) {
    if (blackjackgame['turnover'] === true) {
        let message, messageColor;
        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackgame['wins'];
            message = "You Won!";
            winaudio.play();
            messageColor = "Green";

        }
        else if (winner === DEALER) {
            document.querySelector('#loss').textContent = blackjackgame['loss'];
            message = "You Lost!";
            lossaudio.play();
            messageColor = "Red";

        }
        else {
            document.querySelector('#draw').textContent = blackjackgame['draw'];
            message = "Match Tied!";
            messageColor = "Black";

        }
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;

    }
}