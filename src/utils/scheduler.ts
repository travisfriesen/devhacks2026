import { ICard } from "@/types/types";
import { updateCardLaters, updateCardDueDate } from "../data/cards.ts"

export function fibonacci(n: number): number {
    // Leaving this to Keira. Hopefully it's not a O(2^n) algorithm
    // -_-
    
    let fib1 = 3;
    let fib2 = 5;
    let result = 0;

    if (n == 0) {
        result = fib1;
    }
    else if (n == 1) {
        result = fib2; 
    }
    else {
        while (n >= 2) {
            n--;
            let temp = fib2;
            fib2 = fib1 + fib2;
            fib1 = temp;
        }
        result = fib2;
    }

    return result;
}

export type RecallRating = 1 | 2 | 3 | 4; // again | later-session | next-session | later

interface ICardQueue {
    queue: ICard[];
    updatedCard: ICard | null;
}

export function scheduleCard(
    card: ICard,
    rating: RecallRating,
    queue: ICard[],
): ICardQueue {
    const rest = queue.slice(1);
    let updatedCard = { ...card };

    switch (rating) {
        case 1: // again
            // We should push to top of the queue to give it again instantly
            // Done in UI logic
            break;
        case 2: // later-session
            // Insert somewhere inside of the queue (middle? random?)
            // Done in UI logic
            break;
        case 3: // next-session
            // This is due tomorrow, so leave the queue but update the date in the card
            const tomorrow = (): Date => {
                let day = card.dueDate.getDay();
                let month = card.dueDate.getMonth();
                let year = card.dueDate.getFullYear();

                const day31 = [1, 3, 5, 7, 8, 10, 12];
                const day30 = [4, 6, 9, 11];
                const day28 = [2];

                if (day31.includes(month) && day == 31 
                    || day30.includes(month) && day == 30 
                    || day28.includes(month) && day == 28) {
                    day = 1;
                    
                    if (month == 12) {
                        year++;
                        month = 1;
                    }
                    else {
                        month++;
                    }
                }
                else {
                    day++;
                }

                return new Date(year, month, day);
            } 
            break;
        case 4: // later
            // This depends on the fibonacci backoff date algorithm
            break;
    }

    mockSave(updatedCard);

    return {
        queue: [...rest, updatedCard],
        updatedCard,
    };
}

function mockSave(card: ICard) {
    // TODO: Pls replace this with the real DB call
    console.log("Saving card to DB:", card);
}
