import fs from "fs"
import YAML from "yaml"
import {IDeck, ICard} from "./types/types" 
import path from "path"

export function parseYaml(yamlPath: string) : IDeck{
    const myData = YAML.parse(fs.readFileSync(yamlPath, 'utf-8'))    
    
    let cardLists: Array<ICard> = [];

    let randomUUID: string = crypto.randomUUID(); 

    for (var i = 0; i < myData['cards'].length; i++) {
        let curr = myData['cards'][i];
        let card: ICard = {
            deckId: curr['deckId'] || randomUUID,
            cardId: curr['cardId'] || i+1,
            question: curr['question'],
            answer: curr['answer'],
            laters: curr['laters'],
            dueDate: curr['dueDate'],
        }
        cardLists.push(card)
    }

    let newDeck: IDeck = {
        deckId: myData['deckId'] || randomUUID,
        deckName: myData['name'] || myData['deckName'], // Fallback if user provides name or deckName
        filepath: myData['filepath'] || path.resolve(yamlPath),
        lastUpdated: myData['lastUpdated'],
        created: myData['created'],
        lastUtilized: myData['lastUtilized'],
        uses: myData['uses'],
        streak: myData['streak'],
        cards: cardLists,
    } 

    return newDeck
}

export function dumpDeck(deckInfo:IDeck, path:string) {
    let doc = YAML.stringify(deckInfo)
    fs.writeFileSync(path+deckInfo.deckName+".yaml", doc, 'utf-8')
}
