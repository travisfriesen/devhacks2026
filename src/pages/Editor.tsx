import { useState, useEffect } from "react";
import { ICard } from "@/types/types";
import MDEditor, { commands } from "@uiw/react-md-editor";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const mdPreviewOptions = {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
};

interface IEditorProps {
    card: ICard;
    setCard: (card: ICard) => void;
}

export default function Editor({ card, setCard }: IEditorProps) {
    const [question, setQuestion] = useState(card.question);
    const [answer, setAnswer] = useState(card.answer);

    // Sync local state when a different card is selected
    useEffect(() => {
        setQuestion(card.question);
        setAnswer(card.answer);
    }, [card.cardId]);

    const handleQuestionChange = (val?: string) => {
        const q = val ?? "";
        setQuestion(q);
        setCard({ ...card, question: q });
    };

    const handleAnswerChange = (val?: string) => {
        const a = val ?? "";
        setAnswer(a);
        setCard({ ...card, answer: a });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <label className="font-ui text-xs uppercase tracking-widest text-primary/40">
                    Question
                </label>
                <div data-color-mode="light">
                    <MDEditor
                        value={question}
                        onChange={handleQuestionChange}
                        preview="live"
                        extraCommands={[commands.fullscreen]}
                        previewOptions={mdPreviewOptions}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-ui text-xs uppercase tracking-widest text-primary/40">
                    Answer
                </label>
                <div data-color-mode="light">
                    <MDEditor
                        value={answer}
                        onChange={handleAnswerChange}
                        preview="live"
                        extraCommands={[commands.fullscreen]}
                        previewOptions={mdPreviewOptions}
                    />
                </div>
            </div>
        </div>
    );
}