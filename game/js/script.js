// Plug-in timer module
class Timer {
  constructor(hours, minutes, seconds, timerId, timer) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.timerId = timerId;
    this.timer = timer;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.timer = document.getElementById("display-timer");
  }

  start() {
    this.timerId = setInterval(() => {
      this.seconds++;
      if (this.seconds === 60) {
        this.minutes++;
        this.seconds = 0;
      }
      if (this.minutes === 60) {
        this.hours++;
        this.minutes = 0;
      }
      this.timer.textContent = `${this.hours} Hrs : ${this.minutes} Mins :
      ${this.seconds} Secs`;
    }, 1000);
  }

  stop() {
    clearInterval(this.timerId);
  }

  reset() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.timer.textContent = `${this.hours} Hrs : ${this.minutes} Mins :
    ${this.seconds} Secs`;
  }
}

/*
 * Create a list that holds all of your cards
 */

let cards = [
  "fa-diamond", "fa-diamond",
  "fa-paper-plane-o", "fa-paper-plane-o",
  "fa-anchor", "fa-anchor",
  "fa-bolt", "fa-bolt",
  "fa-cube", "fa-cube",
  "fa-leaf", "fa-leaf",
  "fa-bicycle", "fa-bicycle",
  "fa-bomb", "fa-bomb"
];

// grab the deck
let deck = document.querySelector("ul.deck");
// get me the restart button
let restart = document.querySelector("div.restart");
// select span.moves to update the moves
let moves = document.querySelector("span.moves");
// select stars from score panel
let stars = document.querySelector(".stars");
// target the progress dialgoue
let progModal = document.getElementById("progress-modal");

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

initGame(progModal);

// TODO: write a function to generate the cards

function generateCards(cards) {
  const fragment = document.createDocumentFragment();

  // iterate over each card in the cards array
  for (const card of cards) {
    fragment.appendChild(createCard(card));
  }

  // return the fragment of generated cards
  return fragment;
}

// TODO: write a function to generate HTML of a single card

function createCard(card) {
  // returns card HTML for each given card

  // create the listItem and set its attribute nodes
  let listItem = document.createElement("li"),
      attr = document.createAttribute("class"),
      type = document.createAttribute("data-card-type");
  attr.value = "card";
  type.value = `${card}`;
  listItem.setAttributeNode(attr);
  listItem.setAttributeNode(type);

  // create the icon element and set its attribute node
  let icon = document.createElement("i"),
      att = document.createAttribute("class");
  att.value = `fa ${card}`;
  icon.setAttributeNode(att);

  // append the icon element to its respective listItem
  listItem.appendChild(icon);

  // return card HTML as listItem
  return listItem;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another
 *    function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality  --> CONTINUE HERE...
 *    in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this
 *      functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the
 *      card's symbol (put this functionality in another function that you call
 *      from this one)
 *    + increment the move counter and display it on the page (put this
 *      functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score
 *      (put this functionality in another function that you call from this one)
 */

// array to work with list of open cards, move counter
let openCards = [], moveCounter = 0, gameId;

// initialize timer object
let timer = new Timer();

// TODO: write an event handler for the restart button
restart.addEventListener("click", function () {
  restartGame(progModal);
});

// TODO: write an event handler for the deck
deck.addEventListener("click", function (event) {
  let target = event.target;
  displayCard(target);
  addCard(target, openCards);
  gamePlay(target, openCards);
});

// TODO: write a game play function to handle the game play
function gamePlay(target, openCards) {
  if (openCards.length == 2) {
    // check if the cards match
    if (matchCards(openCards)) {
      // match found, lock the cards in open position
      setTimeout(function () {
        lockCards(openCards);
        emptyList(openCards);
      }, 300);
      updateMoves(target);
    } else {
      // match not found, hide cards, empty list of open cards
      unmatch(openCards);
      setTimeout(function () {
        hideCards(openCards);
        emptyList(openCards);
      }, 300);
      updateMoves(target);
    }
  }
  setTimeout(isWinner, 300);
}

// TODO: write a function to restart the game
function restartGame(progModal) {
  // reinitialize game using the same function to initialize our game
  initGame(progModal);
  // stop timer
  timer.stop();
  // reset timer
  timer.reset();
  // reset Moves
  resetMoves();
  // reset stars
  resetStars();
  // clear the deck
  clearDeck();
}

// TODO: write a function to initialize Game
function initGame(progModal) {
  // display progress modal
  setTimeout(() => displayModal(progModal, "block"), 0);
  // close progress modal
  setTimeout(() => displayModal(progModal, "none"), 5500);
  // prepare deck before time
  setTimeout(() => {
    // preparing deck..., shuffle cards on the fly
    deck.appendChild(generateCards(shuffle(cards)));
  }, 5000);
}

// TODO: write a function to clear the deck
function clearDeck() {
  while (deck.firstElementChild != null) {
    deck.firstElementChild.remove();
  }
}

// TODO: write a function to display card

function displayCard(card) {
  if (card && card.nodeName === "LI") {
    card.classList.add("open", "show", "disable");
  }
}

// TODO: write a function to add open cards to the list of openCards
function addCard(card, list) {
  list.push(card);
}

// TODO: write a function to match cards
function matchCards(list) {
  let cardTypes = [];
  for (const card of list) {
    cardTypes.push(card.getAttribute("data-card-type"));
  }

  return (cardTypes[0] === cardTypes[1]);
}

// TODO: write a function to lock the cards in open position
function lockCards(list) {
  for (const card of list) {
    card.classList.remove("open", "show");
    card.classList.add("match");
  }
}

// TODO: write a function to hide cards
function hideCards(list) {
  for (const card of list) {
    card.classList.remove("open", "show", "disable");
  }
}

// TODO: write a function to empty the list of open cards
function emptyList(list) {
  while (list.length > 0) {
    list.pop();
  }
}

// TODO: write a function to unmatch the open cards
function unmatch(list) {
  for (const card of list) {
    card.classList.add("unmatch");
  }
  setTimeout(function () {
    for (const card of list) {
      card.classList.remove("unmatch");
    }
  }, 300);
}

// TODO: write a function to keep track of the moves and display it on the page

function updateMoves(target) {
  if (target && target.nodeName === "LI") {
    moveCounter++;
    moves.textContent = '';
    moves.textContent = moveCounter;
  }
  if (moveCounter === 1) {
    timer.start();
  }
  updateStars();
}

// TODO: write a function to reset moves in the score panel
function resetMoves() {
  moveCounter = 0;
  moves.textContent = '0';
}

// TODO: write a function to reset stars
function resetStars() {
  stars.innerHTML = '';
  stars.innerHTML = `<li><i class="fa fa-star"></i></li>
  <li><i id="star-two" class="fa fa-star"></i></li>
  <li><i id="star-three" class="fa fa-star"></i></li>`;
}

// TODO: write a function to update the stars
// half star: fa-star-half-full, full star empty: fa-star-o

function updateStars() {
  const starOne = document.getElementById("star-two");
  const starTwo = document.getElementById("star-three");
  if (moveCounter === 4) {
    starTwo.classList.remove("fa-star");
    starTwo.classList.add("fa-star-half-full");
  } else if (moveCounter === 8) {
    starTwo.classList.remove("fa-star-half-full");
    starTwo.classList.add("fa-star-o");
  } else if (moveCounter === 12) {
    starOne.classList.remove("fa-star");
    starOne.classList.add("fa-star-half-full");
  } else if (moveCounter === 16) {
    starOne.classList.remove("fa-star-half-full");
    starOne.classList.add("fa-star-o");
  }
}

// TODO: write a function to check for a win win situation
function isWinner() {
  let matchedCards = document.querySelectorAll(".match");
  if (matchedCards.length === 16) {
    timer.stop();
    gameStats();
    setTimeout(() => displayModal(congratsModal, "block"), 1200);
  }
}

// TODO: implement modal dialgoue box

// Get the modal
let congratsModal = document.getElementById("congrats-dialogue");
// Get the <span> element that closes the modal
let closeButton = document.querySelector(".close-button");
// Get the modal close button to close the dialogue
let modalCloseBtn = document.getElementById("modal-close-btn");
// Get the modal play again button to restart the game
let modalPlayAgain = document.getElementById("modal-play-again");

// When the user clicks on <span> (x), close the modal
closeButton.addEventListener("click", function () {
  displayModal(congratsModal, "none");
});

// When the user clicks on dialogue Close button, close the modal
modalCloseBtn.addEventListener("click", function () {
  displayModal(congratsModal, "none");
});

// When the user clicks on Play Again! button, close the modal
// and restart the game
modalPlayAgain.addEventListener("click", function () {
  restartGame(progModal);
  displayModal(congratsModal, "none");
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", function (event) {
  if (event.target === congratsModal) {
    displayModal(congratsModal, "none");
  }
});

// Handle modal display
function displayModal(modal, display) {
  modal.style.display = display;
}

// TODO: write a function to summarize game stats
function gameStats() {
  let timer = document.getElementById("display-timer").textContent;
  let movesPlaceholder = document.getElementById("moves-placeholder");
  let timePlaceholder = document.getElementById("time-placeholder");
  getStars();
  movesPlaceholder.textContent = moves.textContent;
  timePlaceholder.textContent = timer;
}

// TODO: write a function to get the star rating (helper function to gameStats)
function getStars() {
  let starsPlaceholder = document.getElementById("stars-placeholder");
  let stars = document.querySelectorAll(".stars li");
  let fragment = document.createDocumentFragment();
  let uList = document.createElement("ul");
  let fragmentCopy;
  for (const star of stars) {
    star.style.display = "inline";
    fragment.appendChild(star);
  }
  // Clone fragment to keep display of stars intact
  // on the Memory Game UI window.
  fragmentClone = fragment.cloneNode(true);
  // preformat unordered list for modal window
  uList.style.cssText = "list-style-type:none;margin:0;padding:0;";
  // Leave the Document Window display of stars intact
  keepDocumentStars(fragmentClone);
  // clone it to the modal window
  uList.appendChild(fragment);
  starsPlaceholder.innerHTML = '';
  starsPlaceholder.appendChild(uList);
}

/*
 * @description: keeps the stars in our Memory Game UI window .score panel
 * intact which get erased as a side effect of using querySelectorAll
 * in my getStars function.
 */

function keepDocumentStars(fragmentClone) {
  // create new unordered list element
  let uList = document.createElement("ul");
  // target the Memory Game UI window .score panel stars
  let documentStars = document.querySelector(".stars");
  // populate unordered list using fragmentClone
  uList.appendChild(fragmentClone);
  // Re-display the stars
  documentStars.innerHTML = uList.innerHTML;
}

