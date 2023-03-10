// indoor environment variables
const limitScreenWidth = 1022;
const pathDocs = "sources/";
const words = ['BALL', 'STAR', 'GIFT', 'THIEF', 'UMBRELLA', 'AIRPLANE'];
let word = words[0];
let wordWithDash = word.replace(/./g, "_ ");
let level = 1;

// outdoor environment variables
const wordDOM = document.querySelector('.word');
const errorsDOM = document.querySelector('.errors');
const messageDom = document.querySelector('.title-message');
const inputDom = document.querySelector('.txtResponse');
const titleLevelDom = document.querySelector('.title-level');
const gallowContainerDom = document.querySelector('.gallowContainer');
const btnAdd = document.querySelector('.btn-add');
const btnRestartDom = document.querySelector('.btn-restart');
const imgGuess = document.getElementById('imgGuess');

// functions
document.addEventListener('keypress', whichKey);
inputDom.addEventListener('keypress', (evt) => {
    String.fromCharCode(evt.keyCode).match(/[!@#$%^&*()_+~`\-=\[\]{};':"\\|,.<>\/?]+/) && evt.preventDefault();
});
btnAdd.addEventListener("click", AddLetter);
btnRestartDom.addEventListener('click', () => { window.location.reload() });
wordDOM.textContent = wordWithDash;

function AddLetter(e) {
    e.preventDefault();

    const letter = inputDom.value.toUpperCase().trim();
    let correct = false;
    Clear();

    if (!letter) {
        WarnMessage('Its only a letter !');
        return;
    }

    if (wordWithDash.includes(letter)) {
        WarnMessage(`${letter} already matched !`);
        return;
    }

    for (let index in word) {
        if (letter === word[index]) {
            wordWithDash = wordWithDash.replaceAt(index * 2, letter);
            wordDOM.textContent = wordWithDash;
            correct = true;
        }
    }

    correct ? IsComplete() : AmountErrors();
}

function IsComplete() {
    if (wordDOM.textContent.split(' ').join('') == word) {
        level++;
        if (level <= 6) {
            word = words[level - 1];
            wordWithDash = word.replace(/./g, "_ ");
            wordDOM.textContent = wordWithDash;
            titleLevelDom.textContent = `Level ${level}`;
            imgGuess.src = returnImgLevel(level);
            return;
        }
        Win();
    }
}

function returnImgLevel(level) {
    switch (level) {
        case 2:
            return pathDocs + "star.jpg";
        case 3:
            return pathDocs + "gift.jpg";
        case 4:
            return pathDocs + "thief.jpg";
        case 5:
            return pathDocs + "umbrella.jpg";
        case 6:
            return pathDocs + "airplane.jpg";
    }
}

function AmountErrors() {
    const errorsAmount = Number(errorsDOM.innerText[0]) + 1;
    errorsDOM.textContent = `${(errorsAmount)} errors`;

    if (errorsAmount <= 2) {
        gallowContainerDom.style.display = (window.innerWidth > limitScreenWidth) ? 'block' : 'none';
    } else {
        Lose();
    }
}

function DisableElements() {
    btnAdd.disabled = true;
    inputDom.disabled = true;

    titleLevelDom.style.display = 'none';
    btnRestartDom.style.display = 'block';
}

function Lose() {
    DisableElements();

    document.getElementById('imgGallow').src = pathDocs + 'gallow-head.png';
    if (window.innerWidth <= limitScreenWidth) {
        document.querySelector('.form').style.display = 'none';
        gallowContainerDom.classList.remove('gallowContainerLg');
        gallowContainerDom.style.display = 'block';
    }

    messageDom.innerText = '¡ You LOST !';
    messageDom.style.backgroundColor = "red";
}

function Win() {
    DisableElements();
    messageDom.innerText = '¡ You WON !';
}

function WarnMessage(message) {
    const initialMessage = messageDom.innerText;
    messageDom.textContent = message;
    setTimeout(() => { messageDom.textContent = initialMessage }, 2000);
}

function Clear() {
    inputDom.value = '';
}

function whichKey(e) {
    if (e.key === 'Enter') { AddLetter() }
}

String.prototype.replaceAt = function (index, car) {
    return this.substring(0, index) + car + this.substring(index + car.length);
}