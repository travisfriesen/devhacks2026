import { ICard } from "@/types/types";

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
            break;
        case 2: // later-session
            // Insert somewhere inside of the queue (middle? random?)
            break;
        case 3: // next-session
            // This is due tomorrow, so leave the queue but update the date in the card
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
