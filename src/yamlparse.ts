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

        const deckId = myData['deckId'] || randomUUID;

        for (var i = 0; i < myData['cards'].length; i++) {
            let curr = myData['cards'][i];

            if(!curr.hasOwnProperty('question')) {
                throw new Error("Card #" + i + " is missing a question.")
            }

            if(!curr.hasOwnProperty('answer')) {
                throw new Error("Card #" + i + ", with question: " + curr['question'] + " is missing an answer.")
            }
            let card: ICard = {
                deckId: deckId,
                cardId: curr['cardId'] ? String(curr['cardId']) : `${deckId}-${i}`,
                question: curr['question'],
                answer: curr['answer'],
                laters: curr['laters'] ?? 0,
                dueDate: curr['dueDate'] ? new Date(curr['dueDate']) : new Date(),
            }
            cardLists.push(card)
        }

        let newDeck: IDeck = {
            deckId: deckId,
            deckName: myData['name'] || myData['deckName'] || path.basename(yamlPath, '.yaml'),
            filepath: myData['filepath'] || path.resolve(yamlPath),
            lastUpdated: myData['lastUpdated'] ? new Date(myData['lastUpdated']) : new Date(),
            created: myData['created'] ? new Date(myData['created']) : new Date(),
            lastUtilized: myData['lastUtilized'] ? new Date(myData['lastUtilized']) : new Date(),
            uses: myData['uses'] ?? 0,
            streak: myData['streak'] ?? 0,
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
