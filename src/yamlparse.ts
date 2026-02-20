import fs from "fs"
import YAML from "yaml"
import {deck, card} from "./types/types" 
import path from "path"

export function parseYaml(yaml_path: string) : deck{
    const myData = YAML.parse(fs.readFileSync(yaml_path, 'utf-8'))    
    
    let cardLists: Array<card> = [];

    let randomUUID: string = crypto.randomUUID(); 

    for (var i = 0; i < myData['cards'].length; i++) {
        let curr = myData['cards'][i];
        let card: card = {
            deckId: curr['deckId'] || randomUUID,
            cardId: curr['cardId'] || i+1,
            question: curr['question'],
            answer: curr['answer'],
            laters: curr['laters'],
            dueDate: curr['dueDate'],
        }
        cardLists.push(card)
    }

    let new_deck: deck = {
        deckId: myData['deckId'] || randomUUID,
        deckName: myData['name'] || myData['deckName'], // Fallback if user provides name or deckName
        filepath: myData['filepath'] || path.resolve(yaml_path),
        lastUpdated: myData['lastUpdated'],
        created: myData['created'],
        uses: myData['uses'],
        streak: myData['streak'],
        cards: cardLists,
    } 

    return new_deck
}

export function dumpDeck(deck_info:deck, path:string) {
    let doc = YAML.stringify(deck_info)
    fs.writeFileSync(path+deck_info.deckName+".yaml", doc, 'utf-8')
}
