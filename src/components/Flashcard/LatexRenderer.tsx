import React from "react";
import * as katex from "katex";

interface Props {
    text: string;
}

type Segment =
    | { type: "text"; content: string }
    | { type: "inline"; content: string }
    | { type: "block"; content: string };

function parseSegments(text: string): Segment[] {
    const segments: Segment[] = [];
    const pattern = /(\$\$(?:[^$]|\$(?!\$))+?\$\$|\$(?:[^$])+?\$)/g; // Matches $$...$$ or $...$
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            segments.push({
                type: "text",
                content: text.slice(lastIndex, match.index),
            });
        }
        const raw = match[0];
        if (raw.startsWith("$$")) {
            segments.push({ type: "block", content: raw.slice(2, -2) });
        } else {
            segments.push({ type: "inline", content: raw.slice(1, -1) });
        }
        lastIndex = pattern.lastIndex;
    }

    if (lastIndex < text.length) {
        segments.push({ type: "text", content: text.slice(lastIndex) });
    }

    return segments;
}

function renderMath(math: string, displayMode: boolean): string {
    try {
        return katex.renderToString(math, {
            displayMode,
            throwOnError: false,
            output: "html",
        });
    } catch {
        return math;
    }
}

const LatexRenderer: React.FC<Props> = ({ text }) => {
    const segments = parseSegments(text);

    return (
        <>
            {segments.map((seg, i) => {
                if (seg.type === "inline") {
                    return (
                        <span
                            className="font-latex text-3xl"
                            key={i}
                            dangerouslySetInnerHTML={{
                                __html: renderMath(seg.content, false),
                            }}
                        />
                    );
                }
                if (seg.type === "block") {
                    return (
                        <span
                            key={i}
                            className="font-latex"
                            className="block my-2"
                            dangerouslySetInnerHTML={{
                                __html: renderMath(seg.content, true),
                            }}
                        />
                    );
                }
                return (
                    <span
                        key={i}
                        className="font-latex text-3xl">
                        {seg.content}
                    </span>
                );
            })}
        </>
    );
};

export default LatexRenderer;
