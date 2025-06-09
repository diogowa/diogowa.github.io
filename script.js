const numRows = 50;
const numColumns = 10;
let matrix = [];

// options
const CAT = 0;
const DOG = 1;
const CAT_LIKE = 2;
const DOG_LIKE = 3;

// counter for likes
const likesLimit = 0.3 * (numRows * numColumns);
let catLikesCounterHistory = 0;
let dogLikesCounterHistory = 0;
let catLikesCounter = 0;
let dogLikesCounter = 0;

let catPostsCounter = 0;
let dogPostsCounter = 0;

// parameters to calculate probability of cat post
const alpha = 0.7;
const K = 0.1 * (numRows * numColumns);


function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function drawGrid() {
    // reset everything
    catLikesCounterHistory = 0;
    dogLikesCounterHistory = 0;
    catLikesCounter = 0;
    dogLikesCounter = 0;
    catPostsCounter = 0;
    dogPostsCounter = 0;


    const catProb = getCatProbability();

    const cellsToFill = numRows * numColumns;
    catPostsCounter = Math.round(catProb * cellsToFill);
    dogPostsCounter = cellsToFill - catPostsCounter;

    const posts = Array(catPostsCounter).fill(CAT)
                    .concat(Array(dogPostsCounter).fill(DOG));

    shuffle(posts);

    let postsCounter = 0;
    for (let i = 0; i < numRows; i++) {
        matrix[i] = [];
        for (let j = 0; j < numColumns; j++) {
            matrix[i][j] = posts[postsCounter++];
        }
    }

    renderGrid();
}

function getLastLikePosition() {
    let lastLikeRow = -1;
    let lastLikeCol = -1;

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            if (matrix[i][j] === CAT_LIKE || matrix[i][j] === DOG_LIKE) {
                if (i > lastLikeRow) {
                    lastLikeRow = i;
                    lastLikeCol = j;
                }
                else if (i === lastLikeRow && j > lastLikeCol) {
                    lastLikeRow = i;
                    lastLikeCol = j;
                }
            }
        }    
    }

    return [lastLikeRow, lastLikeCol];
}

function addLike(topic) {
    let belowLimit = likesLimit > (catLikesCounterHistory + dogLikesCounterHistory);

    if (topic === 'cat') {
        if (!belowLimit) {
            if (dogLikesCounterHistory > 0) {
                dogLikesCounterHistory--;
            }
        }
        if (catLikesCounterHistory < likesLimit) {
            catLikesCounterHistory++;
        }
        catLikesCounter++;
    }
    if (topic === 'dog') {
        if (!belowLimit) {
            if (catLikesCounterHistory > 0) {
                catLikesCounterHistory--;
            }
        }
        if (dogLikesCounterHistory < likesLimit) {
            dogLikesCounterHistory++;
        }
        dogLikesCounter++;
    }
}

function getCatProbability() {
    const totalLikes = catLikesCounterHistory + dogLikesCounterHistory;

    const T = Math.max(1 - totalLikes / K, 0);

    const fracCat = (catLikesCounterHistory + alpha) / (totalLikes + 2 * alpha);

    return T * 0.5 + (1 - T) * fracCat;
}

function updateStatsHTML() {
    const catProb = getCatProbability();
    const dogProb = 1 - catProb;

    document.getElementById('catProb').textContent = `🐱 ${Math.round(catProb * 10000) / 100}%`;
    document.getElementById('dogProb').textContent = `🐶 ${Math.round(dogProb * 10000) / 100}%`;

    // calculate balanceOrEcho
    const totalFuturePosts = catPostsCounter + dogPostsCounter;
    const catProportion = catPostsCounter / totalFuturePosts;
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
    document.getElementById('likesCats').textContent = `${catLikesCounter}`;
    document.getElementById('likesDogs').textContent = `${dogLikesCounter}`;
    document.getElementById('futureCatPosts').textContent = `${catPostsCounter}`;
    document.getElementById('futureDogPosts').textContent = `${dogPostsCounter}`;
}

function redistributeGrid() {
    const [lastRow, lastCol] = getLastLikePosition();
    const catProb = getCatProbability();

    // calculate how many cells need to be filled
    let cellsToFill = 0;
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            if (i > lastRow || (i === lastRow && j > lastCol)) {
                cellsToFill++;
            }
        }
    }

    catPostsCounter = Math.round(catProb * cellsToFill);
    dogPostsCounter = cellsToFill - catPostsCounter;

    const posts = Array(catPostsCounter).fill(CAT)
                    .concat(Array(dogPostsCounter).fill(DOG));

    shuffle(posts);

    let postsCounter = 0;
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            if (i > lastRow || (i === lastRow && j > lastCol)) {
                matrix[i][j] = posts[postsCounter++];
            }
        }
    }

    renderGrid();
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
                    addLike('cat');
                } 
                else if (matrix[i][j] === DOG) {
                    matrix[i][j] = DOG_LIKE;
                    cell.classList.remove('dog'); 
                    cell.classList.add('dogLike');
                    addLike('dog');
                } 
                else if (matrix[i][j] === CAT_LIKE) {
                    matrix[i][j] = CAT;
                    cell.classList.remove('catLike'); 
                    cell.classList.add('cat');
                    catLikesCounterHistory--;
                    catLikesCounter--;
                }
                else {
                    matrix[i][j] = DOG;
                    cell.classList.remove('dogLike'); 
                    cell.classList.add('dog');
                    dogLikesCounterHistory--;
                    dogLikesCounter--;
                }

                redistributeGrid();
                updateStatsHTML();
            });

            grid.appendChild(cell);
        }
    }

    updateStatsHTML();
}

window.addEventListener('DOMContentLoaded', () => {
    drawGrid();
    updateStatsHTML();
});
