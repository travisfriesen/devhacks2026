import fs from "fs"
import YAML from "yaml"
import {IDeck, ICard} from "./types/types" 
import path from "path"
import { Notification } from "electron"


export function parseYaml(yamlPath: string) : IDeck | undefined{
    try {
        const myData = YAML.parse(fs.readFileSync(yamlPath, 'utf-8'))    
        
        let cardLists: Array<ICard> = [];

        let randomUUID = crypto.randomUUID();

        for (var i = 0; i < myData['cards'].length; i++) {
            let curr = myData['cards'][i];

            if(!curr.hasOwnProperty('question')) {
                throw new Error("Card #" + i + " is missing a question.")
            }

            if(!curr.hasOwnProperty('answer')) {
                throw new Error("Card #" + i + ", with question: " + curr['question'] + " is missing an answer.")
            }
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
        };
        return newDeck;
    } catch(e) {
        let result = e.message;
        if (typeof e === "string") {
            e.toUpperCase() 
        } else if (e instanceof Error) {
            e.message 
        }
        const n = new Notification({title: "Error when parsing yaml at " + yamlPath, body: result})
        n.closeButtonText = "Dismiss Error"
        n.timeoutType = "never"
        n.show()
    }
    return undefined;
    
}

export function dumpDeck(deckInfo:IDeck, path:string) {
    let doc = YAML.stringify(deckInfo)
    fs.writeFileSync(path+deckInfo.deckName+".yaml", doc, 'utf-8')
}
