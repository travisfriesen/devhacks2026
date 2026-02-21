import { useState } from "react";
import { ICard } from "@/types/types"
import MDEditor, {commands} from "@uiw/react-md-editor";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface IEditorProps {
    card: ICard;
    setCard: (card: ICard) => void;
}

export default function Editor({ card, setCard }: IEditorProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    return (
        <div>
            <MDEditor
                value={title}
                onChange={setTitle}
                preview={"preview"}
                minHeight={20}
                enableScroll={false}
                commands={[]}
                extraCommands={[]}
                visibleDragbar={false}
                // extraCommands={[commands.fullscreen]}
                previewOptions={{
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeKatex],
                }}
            />
            <br />
            <MDEditor
                value={title}
                onChange={setTitle}
                preview={"edit"}
                minHeight={20}
                enableScroll={false}
                extraCommands={[commands.fullscreen]}
                previewOptions={{
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeKatex],
                }}
            />
            <br />
            <MDEditor
                value={content}
                onChange={setContent}
                preview={"preview"}
                commands={[]}
                extraCommands={[]}
                visibleDragbar={false}
                // extraCommands={[commands.fullscreen]}
                previewOptions={{
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeKatex],
                }}
            />
            <br />
            <MDEditor
                value={content}
                onChange={setContent}
                preview={"edit"}
                extraCommands={[commands.fullscreen]}
                previewOptions={{
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeKatex],
                }}
            />

        </div>
    );
}
