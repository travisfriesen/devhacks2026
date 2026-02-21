import React from "react";
// TODO: MOve this search to just be a component that can be used in the search page, and remove it from the bottom nav
import { Search, Settings } from "lucide-react";
import { IDeck } from "@/types/types";
import { NavView } from "@/store/useAppStore";
import { RecallRating } from "@/utils/scheduler";

const MOCK_DECKS: IDeck[] = [
    {
        deckId: "1",
        deckName: "Calculus",
        filepath: "",
        lastUpdated: new Date(),
        created: new Date(),
        uses: 10,
        streak: 5,
        lastUtilized: new Date(0),
        cards: [
            {
                deckId: "1",
                cardId: "1-1",
                question: String.raw`What is the derivative of $f(x) = x^2$?`,
                answer: String.raw`$f'(x) = 2x$`,
                laters: 0,
                dueDate: new Date(),
            },
            {
                deckId: "1",
                cardId: "1-2",
                question: String.raw`State the Fundamental Theorem of Calculus.`,
                answer: String.raw`If $F$ is an antiderivative of $f$ on $[a,b]$, then $$\int_a^b f(x)\,dx = F(b) - F(a)$$`,
                laters: 0,
                dueDate: new Date(),
            },
            {
                deckId: "1",
                cardId: "1-3",
                question: String.raw`What is $\lim_{x \to 0} \frac{\sin x}{x}$?`,
                answer: String.raw`$1$`,
                laters: 0,
                dueDate: new Date(),
            },
            {
                deckId: "1",
                cardId: "1-4",
                question: String.raw`Differentiate $f(x) = e^{x^2}$`,
                answer: String.raw`$f'(x) = 2x e^{x^2}$`,
                laters: 0,
                dueDate: new Date(),
            },
        ],
    },
    {
        deckId: "2",
        deckName: "Linear Algebra",
        filepath: "",
        lastUpdated: new Date(),
        created: new Date(),
        uses: 20,
        streak: 10,
        lastUtilized: new Date(0),
        cards: [
            {
                deckId: "2",
                cardId: "2-1",
                question: String.raw`What is the determinant of a $2 \times 2$ matrix $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$?`,
                answer: String.raw`$ad - bc$`,
                laters: 0,
                dueDate: new Date(),
            },
            {
                deckId: "2",
                cardId: "2-2",
                question: String.raw`When is a matrix invertible?`,
                answer: String.raw`When its determinant is non-zero, i.e. $\det(A) \neq 0$`,
                laters: 0,
                dueDate: new Date(),
            },
            {
                deckId: "2",
                cardId: "2-3",
                question: String.raw`What does it mean for vectors $\mathbf{v}_1, \ldots, \mathbf{v}_n$ to be linearly independent?`,
                answer: String.raw`The only solution to $c_1\mathbf{v}_1 + \cdots + c_n\mathbf{v}_n = \mathbf{0}$ is $c_1 = \cdots = c_n = 0$`,
                laters: 0,
                dueDate: new Date(),
            },
        ],
    },
    {
        deckId: "3",
        deckName: "History",
        filepath: "",
        lastUpdated: new Date(),
        created: new Date(),
        uses: 4,
        streak: 2,
        lastUtilized: new Date(0),
        cards: [
            {
                deckId: "3",
                cardId: "3-1",
                question: "In what year did World War II end?",
                answer: "1945",
                laters: 0,
                dueDate: new Date(),
            },
            {
                deckId: "3",
                cardId: "3-2",
                question: "Who wrote the Communist Manifesto?",
                answer: "Karl Marx and Friedrich Engels, published in 1848.",
                laters: 0,
                dueDate: new Date(),
            },
        ],
    },
];

const BOTTOM_NAV: { view: NavView; icon: React.ReactNode; label: string }[] = [
    {
        view: "search",
        icon: <Search className="w-4 h-4" />,
        label: "Search",
    },
    {
        view: "settings",
        icon: <Settings className="w-4 h-4" />,
        label: "Settings",
    },
];

const HEATMAP = Array.from({ length: 26 }, () =>
    Array.from({ length: 7 }, () => {
        // 30% chance of no activity
        if (Math.random() < 0.3) return 0;
        // remaining spread low, rarely high
        const r = Math.random();
        if (r < 0.5) return Math.random() * 0.25;
        if (r < 0.7) return 0.25 + Math.random() * 0.25;
        if (r < 0.9) return 0.5 + Math.random() * 0.25;
        return 0.85 + Math.random() * 0.15;
    }),
);

const RECALL_BUTTONS: {
    rating: RecallRating;
    label: string;
    key: string;
    color: string;
}[] = [
        {
            rating: 1,
            label: "Again",
            key: "1",
            color: "var(--color-secondary)",
        },
        {
            rating: 2,
            label: "Later This Session",
            key: "2",
            color: "var(--color-tertiary)",
        },
        {
            rating: 3,
            label: "Next Session",
            key: "3",
            color: "var(--color-primary)",
        },
        {
            rating: 4,
            label: "Later",
            key: "4",
            color: "color-mix(in srgb, var(--color-primary) 40%, transparent)",
        },
    ];

export { MOCK_DECKS, BOTTOM_NAV, RECALL_BUTTONS, HEATMAP };
