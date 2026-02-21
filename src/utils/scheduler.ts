import { ICard } from "@/types/types";
import { updateCardLaters, updateCardDueDate } from "../data/cards"

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
            let tomorrow = incrementDate(card.dueDate, 1);

            updatedCard.dueDate = incrementDate(tomorrow, 1);
            updateCardDueDate(card, tomorrow);

            break;
        case 4: // later
            // This depends on the fibonacci backoff date algorithm
            break;
    }


    return {
        queue: [...rest, updatedCard],
        updatedCard,
    };
    
}

function incrementDate(date: Date, addAmt: number): Date {
    let day = date.getUTCDate();
    let month = date.getUTCMonth();
    let year = date.getFullYear();


    // TODO: ACCOUNT FOR LEAP YEARS

    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; 

    while (addAmt > 0) {
        if (day + addAmt > monthDays[month]) {
            addAmt = addAmt - (monthDays[month] - day + 1);
            day = 1;
            month++;
        }
        else {
            day += addAmt;
            addAmt = 0;
        }
    }

    year += Math.floor(month / 12);
    month = month % 12;

    console.log(new Date(year, month, day));

    return new Date(year, month, day);
}

