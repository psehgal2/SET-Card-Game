/*
Name: Purvi Sehgal
Date: 06/12/2023

This is the JavaScript file for the Set game. It allows
the user to select a level and time and play the game
*/

const STYLE = ["striped", "solid", "outline"];
const COLOR = ["green", "purple", "red"];
const SHAPE = ["squiggle", "oval", "diamond"];
const COUNT = ["1", "2", "3"];
let timerId = null;
let secondsRemaining = 0;
(function () {
    "use strict";

    /**
     * Iniitializes the start, back, and refresh buttons. "Listens" for 
     * clicks on these buttons and starts the game, exits the game, or
     * refreshes the game accordingly
     * @param {None}
     * @returns {None}
     */
    function init() {
        const startButton = id("start-btn");
        startButton.addEventListener("click", startGame);
        const backButton = id("back-btn");
        backButton.addEventListener("click", exitGame);
        let refresh = id("refresh-btn");
        refresh.addEventListener("click", refreshGame);
    }

    /**
     * This function calls the functions to start the game
     * by toggling the game play page, setting up the board,
     * and starting the timer
     * @param {None}
     * @returns {None}
     */
    function startGame() {
        toggleView();
        setUpBoard();
        startTimer();
    }

    /**
     * This function sets up the board
     * based on the difficulty level by adding
     * cards to the board
     * @param {None}
     * @returns {None}
     */
    function setUpBoard() {
        let refresh = id("refresh-btn");
        refresh.disabled = false;
        let num_cards = 0;
        let difficulty = qs("input[name=diff]:checked").value;
        if (difficulty == "easy") {
            num_cards = 9;
        }
        else {
            num_cards = 12;
        }
        let isEasy = (difficulty == "easy");
        let card;
        for (let i = 0; i < num_cards; i++) {
            card = generateUniqueCard(isEasy);
            id("board").appendChild(card);
        }
    }

    /**
     * This function calls the functions to exit the game
     * by removing the board, stopping the timer, and
     * changing the game page to the main start page.
     * It also resets the counter to zero
     * @param {None}
     * @returns {None}
     */
    function exitGame() {
        id("set-count").textContent = "0";
        removeBoard();
        stopTimer();
        toggleView();
    }

    /**
     * This function stops the timer. It
     * updates the timer on the board and 
     * clears the timer. It also sets the global
     * constant that keeps track of the remaining seconds
     * to zero
     * @param {None}
     * @returns {None}
     */
    function stopTimer() {
        qs("#game-view #time").textContent = "00:00";
        clearInterval(timerId);
        timerId = null;
        secondsRemaining = 0;
    }

    /**
     * This function removes all of the cards on
     * the board 
     * @param {None}
     * @returns {None}
     */
    function removeBoard() {
        let num_cards = 0;
        let difficulty = qs("input[name=diff]:checked").value;
        if (difficulty == "easy") {
            num_cards = 9;
        }
        else {
            num_cards = 12;
        }
        let card;
        for (let i = 0; i < num_cards; i++) {
            card = qs(".card");
            id("board").removeChild(card);
        }
    }

     /**
     * This function calls the functions to refresh the game
     * by removing all of the cards on the board and adding
     * new cards to the board
     * @param {None}
     * @returns {None}
     */
    function refreshGame() {
        removeBoard();
        setUpBoard();
    }

    /**
     * If this function is called and the menu view 
     * is not hidden, then it hides it. If the menu 
     * view is hidden, then it shows it. If the game view
     * is not hidden, then it hides it. If the game view
     * is hidden, then it shows it. 
     * @param {None}
     * @returns {None}
     */
    function toggleView() {
        const menu = id("menu-view");
        menu.classList.toggle("hidden");
        const game = id("game-view");
        game.classList.toggle("hidden");
    }

    /**
     * This function generates random types 
     * for each of the attributes: style, shape, color, and count
     * unless the mode is Easy for which the style is fixed
     * @param {True if easy mode was selected and False if standard mode was selected}
     * @returns {4-element list containing random [style, shape, color, count] values}
     */
    function generateRandomAttributes(isEasy) {
        let style;
        if (isEasy) {
            style = "solid";
        }
        else {
            const randomIndex = Math.floor(Math.random() * STYLE.length);
            style = STYLE[randomIndex];
        }
        return [style, gen_random(SHAPE), gen_random(COLOR), gen_random(COUNT)];
    }

    /**
     * This function generates a value for an atrribute 
     * @param {An attribute - style, shape, color, or count}
     * @returns {4-element list containing random 
     * [style, shape, color, count] values}
     */
    function gen_random(ATTRIBUTE) {
        const randomIndex = Math.floor(Math.random() * ATTRIBUTE.length);
        return ATTRIBUTE[randomIndex];
    }

    /**
     * This function generates a card
     * and keeps generating until it generates a card
     * not already on the board. Then, it adds a click event
     * listener to the card
     * @param {True if easy mode was selected and False if 
     * standard mode was selected}
     * @returns {the div html element representing the generated card}
     */
    function generateUniqueCard(isEasy) {
        let found = false;
        let card_holder = gen("div");
        let attr;
        let new_id;
        while (!found) {
            attr = generateRandomAttributes(isEasy);
            new_id = `${attr[0]}-${attr[1]}-${attr[2]}-${attr[3]}`;
            if (!id(new_id)) {
                card_holder.id = new_id;
                found = true;
            }
        }
        for (let i = 0; i < parseInt(attr[3]); i++) {
            let image = gen("img");
            image.src = `imgs/${attr[0]}-${attr[1]}-${attr[2]}.png`;
            image.alt = `${new_id}`;
            card_holder.appendChild(image);
        }
        card_holder.classList.add("card");
        card_holder.addEventListener("click", cardSelected);
        return card_holder;
    }

    /**
     * This function takes 3 card div elements, compares each 
     * of the attribute types and, if each four
     * attributes for each card are either all the same or all 
     * different, then returns true.
     * @param {3 card div elements}
     * @returns {true if the three cards form a set or false 
     * if the three cards don't form a set}
     */
    function isASet(selected) {
        const NUMBER_ATTRIBUTES = 4;
        for (let i = 0; i < NUMBER_ATTRIBUTES; i++) {
            let check_set = new Set();
            for (let j = 0; j < selected.length; j++) {
                check_set.add((selected[j].id).split("-")[i]);
            }
            if ((check_set.size !== selected.length) && (check_set.size !== 1)) {
                return false;
            }
        }
        return true;
    }

    /**
     * This function initializes the time based on what the user
     * selected for the time and updates the appropriate global variable.
     * It then sets up a timer and calls it every second
     * @param {None}
     * @returns {None}
     */
    function startTimer() {
        const time = qs("#menu-view select option:checked").value;
        let minutes = String(Math.floor(time / 60)).padStart(2, '0');
        let seconds = String((time - minutes * 60)).padStart(2, '0');
        qs("#game-view #time").textContent = `${minutes}:${seconds}`;
        secondsRemaining = time;
        timerId = setInterval(advanceTimer, 1000);
    }

    /**
     * Updates the game timer (module-global and #time
     * shown on page) by 1 second. No return value
     * @param {None}
     * @returns {None}
     */
    function advanceTimer() {
        let minutes = Math.floor(secondsRemaining / 60);
        let seconds = secondsRemaining - minutes * 60;
        secondsRemaining -= 1;
        if ((seconds == 0) && (minutes !== 0)) {
            seconds = 59;
            minutes -= 1;
        }
        else {
            seconds -= 1;
        }
        if ((seconds == 0) && (minutes == 0)) {
            endGame();
        }
        qs("#game-view #time").textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    /**
     * This function handles everything when 
     * the timer reaches zero, including disabling the 
     * refresh button, unselecting all of the cards,
     * removing the card event listener, and calling 
     * the stop timer function
     * @param {None}
     * @returns {None}
     */
    function endGame() {
        let refresh = id("refresh-btn");
        refresh.disabled = true;
        const selectedCards = qsa(".selected");
        const cards = qsa(".card");
        for (let i = 0; i < cards.length; i++) {
            cards[i].removeEventListener("click", cardSelected);
        }
        for (let i = 0; i < selectedCards.length; i++) {
            selectedCards[i].classList.remove("selected");
        }
        stopTimer();
    }

    /**
     * Used when a card is selected, checking how many
     * cards are currently selected. If 3 cards are selected,
     * uses isASet to handle "correct" and "incorrect" cases.
     * No return value.
     * @param {True if easy mode was selected and False if 
     * standard mode was selected}
     * @returns {None}
     */
    function cardSelected(isEasy) {
        this.classList.toggle("selected");
        const selectedCards = qsa(".selected");
        if (selectedCards.length == 3) {
            toggleCard(selectedCards);
            if (isASet(selectedCards)) {
                id("set-count").textContent = String(parseInt(id("set-count").textContent) + 1);
                addText(selectedCards, true);
                setTimeout(() => {
                    for (let i = 0; i < selectedCards.length; i++) {
                        const newCard = generateUniqueCard(isEasy);
                        selectedCards[i].classList.remove("selected");
                        id("board").replaceChild(newCard, selectedCards[i]);
                    }
                }, 1000);
            }
            else {
                addText(selectedCards, false);
                setTimeout(resetCard, 1000, selectedCards);
                if (secondsRemaining < 15) {
                    stopTimer();
                    endGame();
                }
                else {
                    secondsRemaining -= 14;
                }
            }
        }
    }

    /**
     * This function toggles the hide images 
     * class onto the selected cards, so that 
     * the text when a set is found/not found
     * can be displayed
     * @param {list of cards with the selected class}
     * @returns {None}
     */
    function toggleCard(selectedCards) {
        for (let i = 0; i < selectedCards.length; i++) {
            selectedCards[i].classList.toggle("hide-imgs");
        }
    }

    /**
     * This adds the SET! or Not a Set :( text to each of 
     * the cards
     * @param {list of cards with the selected class, boolean - true 
     * if cards form a set; false otherwise}
     * @returns {None}
     */
    function addText(selectedCards, isSet) {
        for (let i = 0; i < selectedCards.length; i++) {
            let card_text = gen("p");
            if (isSet) {
                card_text.textContent = "SET!";
            }
            else {
                card_text.textContent = "Not a Set :(";
            }
            selectedCards[i].appendChild(card_text);
        }
    }

    /**
     * This resets the selected cards to the unselected
     * state
     * @param {list of cards with the selected class}
    * @returns {None}
    */
    function resetCard(selectedCards) {
        toggleCard(selectedCards);
        for (let i = 0; i < selectedCards.length; i++) {
            let card_id = selectedCards[i];
            let card_text = qs(`#${card_id.id} > p`);
            card_id.removeChild(card_text);
            selectedCards[i].classList.remove("selected");
        }
    }

    init();
})();
