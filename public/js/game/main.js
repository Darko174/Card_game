

class Game {
    constructor(deck) {
        this.deck = this.shuffle(deck);
    }
    shuffle(deck) {
        let shuffledDeck = deck.map( i => i );

        for (let i = shuffledDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
        }
        return shuffledDeck
    }
    getCards(deck) {                                                                   /////!!!!!
        const firstPlayerCards = [];
        const secondPlayerCards = [];
        for (let i = 0; i < 6; i++) {
            firstPlayerCards.push(deck.pop());
            secondPlayerCards.push(deck.pop());
        }
        return {
            firstPlayerCards : firstPlayerCards,
            secondPlayerCards : secondPlayerCards
        }
    }
    createCard(cardInfo) {
        if(cardInfo) {
            const card = document.createElement("div");
            [ card.number, card.letter, card.t, card.imgUrl] = [ cardInfo.number, cardInfo.letter, cardInfo.text, cardInfo.imgUrl ];
            card.classList.add("card");
            card.style.backgroundImage = `url(${card.imgUrl})`;
            return card
        } else {
            return
        }
    }
    renderCards(cards, target) {
        cards.forEach( c => target.append(this.createCard(c))); 
    }
}
export default Game
