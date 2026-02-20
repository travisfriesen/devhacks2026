import fs from "fs"
import YAML from "yaml"
import {deck, card} from "./types/types"

export function parseYaml(path: string) : deck{
    console.log("starting yaml parsing")
    const myData = YAML.parse(fs.readFileSync(path, 'utf-8'))    
    
    let cardLists: Array<card> = [];
    for (var i = 0; i < myData['deck'].length; i++) {
        let curr = myData['deck'][i];
        let card: card = {
            deckId: curr['deckId'],
            cardId: curr['cardId'],
            question: curr['question'],
            answer: curr['answer'],
            laters: curr['laters'],
            dueDate: curr['dueDate'],
        }
        cardLists.push(card)
    }

    let new_deck: deck = {
        deckId: myData['deckId'],
        deckName: myData['name'],
        filepath: myData['filepath'],
        lastUpdated: myData['lastUpdated'],
        created: myData['created'],
        uses: myData['uses'],
        streak: myData['streak'],
        cards: cardLists,
    } 

    return new_deck
}


