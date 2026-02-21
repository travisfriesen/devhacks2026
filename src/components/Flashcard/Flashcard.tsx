import React from "react";
import { IFlashcardProps } from "./Flashcard.types";

import LatexRenderer from "./LatexRenderer";

const Flashcard: React.FC<IFlashcardProps> = ({
    cardId,
    question,
    answer,
    flipped,
    onClick,
}) => {
    return (
        <div
            onClick={() => onClick(cardId)}
            className="cursor-pointer select-none"
            style={{ width: "580px", height: "340px", perspective: "1200px" }}>
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
                }}>
                <div
                    className="absolute inset-0 flex flex-col rounded-2xl overflow-hidden"
                    style={{
                        backfaceVisibility: "hidden",
                        backgroundColor: "var(--color-paper)",
                        boxShadow:
                            "0 8px 40px rgba(35,0,30,0.12), 0 2px 8px rgba(35,0,30,0.08)",
                    }}>
                    <div
                        className="px-6 py-3 flex items-center justify-between border-b"
                        style={{ borderColor: "rgba(35,0,30,0.08)" }}>
                        <span
                            className="font-ui text-xs uppercase tracking-widest"
                            style={{ color: "rgba(35,0,30,0.35)" }}>
                            Question
                        </span>
                        <span
                            className="font-ui text-xs"
                            style={{ color: "rgba(35,0,30,0.2)" }}>
                            click to reveal
                        </span>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-10 py-6">
                        <p className="font-latex text-2xl text-center leading-relaxed text-primary">
                            <LatexRenderer text={question} />
                        </p>
                    </div>
                </div>

                <div
                    className="absolute inset-0 flex flex-col rounded-2xl overflow-hidden"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        backgroundColor: "var(--color-paper)",
                        boxShadow:
                            "0 8px 40px rgba(35,0,30,0.12), 0 2px 8px rgba(35,0,30,0.08)",
                    }}>
                    <div
                        className="px-6 py-3 flex items-center border-b"
                        style={{
                            borderColor: "rgba(185,49,79,0.2)",
                            backgroundColor: "rgba(185,49,79,0.06)",
                        }}>
                        <span
                            className="font-ui text-xs uppercase tracking-widest"
                            style={{ color: "var(--color-secondary)" }}>
                            Answer
                        </span>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-10 py-6">
                        <p className="font-latex text-2xl text-center leading-relaxed text-primary">
                            <LatexRenderer text={answer} />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Flashcard;
