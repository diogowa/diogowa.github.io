const numRows = 50;
const numColumns = 10;
let matrix = [];

// options
const CAT = 0;
const DOG = 1;
const CAT_LIKE = 2;
const DOG_LIKE = 3;

// counter for likes
let catLikesCounter = 0;
let dogLikesCounter = 0;

// parameters to calculate probability of cat post
const alpha = 1;
const K = 12;


for (let i = 0; i < numRows; i++) {
    matrix[i] = [];
    for (let j = 0; j < numColumns; j++) {
        if (Math.random() < 0.5) {
            matrix[i][j] = CAT;
        } else {
            matrix[i][j] = DOG;
        }
    }
}

function getLastLikePosition() {
    let lastLike = [-1, -1];

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            if (matrix[i][j] === CAT_LIKE || matrix[i][j] === DOG_LIKE) {
                if (i > lastLike[0]) {
                    lastLike[0] = i;
                    lastLike[1] = j;
                }
                else if (i === lastLike[0] && j > lastLike[1]) {
                    lastLike[0] = i;
                    lastLike[1] = j;
                }
            }
        }    
    }

    return lastLike;
}

function getCatDogPostsCounter() {
    // counter for posts
    let catPostsCounter = 0;
    let dogPostsCounter = 0;

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            if (matrix[i][j] === CAT || matrix[i][j] === CAT_LIKE) {
                catPostsCounter++;
            } else {
                dogPostsCounter++;
            }
        }
    }

    return [catPostsCounter, dogPostsCounter];
}

function renderGrid() {
    const grid = document.getElementById('grid');

    grid.innerHTML = '';
    grid.classList.add('grid-container');

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            const cell = document.createElement('div');

            cell.className = 'cell';

            if (matrix[i][j] === CAT) {
                cell.classList.add('cat');
            } 
            else if (matrix[i][j] === DOG) {
                cell.classList.add('dog');
            } 
            else if (matrix[i][j] === CAT_LIKE) {
                cell.classList.add('catLike');
            }
            else {
                cell.classList.add('dogLike');
            }

            cell.dataset.row = i;
            cell.dataset.col = j;

            cell.addEventListener('click', function () {
                if (matrix[i][j] === CAT) {
                    matrix[i][j] = CAT_LIKE;
                    cell.classList.remove('cat'); 
                    cell.classList.add('catLike');
                    catLikesCounter++;
                } 
                else if (matrix[i][j] === DOG) {
                    matrix[i][j] = DOG_LIKE;
                    cell.classList.remove('dog'); 
                    cell.classList.add('dogLike');
                    dogLikesCounter++;
                } 
                else if (matrix[i][j] === CAT_LIKE) {
                    matrix[i][j] = CAT;
                    cell.classList.remove('catLike'); 
                    cell.classList.add('cat');
                    catLikesCounter--;
                }
                else {
                    matrix[i][j] = DOG;
                    cell.classList.remove('dogLike'); 
                    cell.classList.add('dog');
                    dogLikesCounter--;
                }

                updateStatsHTML();
                calculateNewGrid();
            });

            grid.appendChild(cell);
        }
    }
}

function getCatProbability() {
    const totalLikes = catLikesCounter + dogLikesCounter;

    const T = Math.max(1 - totalLikes / K, 0);

    const fracCat = (catLikesCounter + alpha) / (totalLikes + 2 * alpha);

    return T * 0.5 + (1 - T) * fracCat;
}

function updateStatsHTML() {
    const catProb = getCatProbability();
    const dogProb = 1 - catProb;

    document.getElementById('catProb').textContent = `🐱 ${Math.round(catProb * 10000) / 100}%`;
    document.getElementById('dogProb').textContent = `🐶 ${Math.round(dogProb * 10000) / 100}%`;

    // calculate balanceOrEcho
    const catDogPosts = getCatDogPostsCounter();
    const catProportion = catDogPosts[0] / (numRows * numColumns);
    const dogProportion = 1 - catProportion;
    const diffProportion = Math.abs(catProportion - dogProportion);
    if (diffProportion > 0.6) {
        document.getElementById('catProb').classList.add('bad');
        document.getElementById('dogProb').classList.add('bad');
    } else {
        document.getElementById('catProb').classList.remove('bad');
        document.getElementById('dogProb').classList.remove('bad');
    }

    document.getElementById('totalPosts').textContent = `${numRows * numColumns}`;
    document.getElementById('percentageCatPosts').textContent = `${Math.round(catProportion * 10000) / 100}%`;
    document.getElementById('percentageDogPosts').textContent = `${Math.round(dogProportion * 10000) / 100}%`;
}

function calculateNewGrid() {
    const lastLike = getLastLikePosition();

    const catProb = getCatProbability();

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            if (i < lastLike[0]) {
                continue;
            } else if (i === lastLike[0] && j <= lastLike[1]) {
                continue;
            }
            matrix[i][j] = Math.random() < catProb ? CAT : DOG;
        }
    }

    renderGrid();
}

window.addEventListener('DOMContentLoaded', () => {
    updateStatsHTML();
    renderGrid();
});
