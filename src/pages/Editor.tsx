import {useState} from "react";
import MDEditor from '@uiw/react-md-editor';

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default function Editor() {
    const [content, setContent] = useState('');

    return (
        <div>
            <MDEditor
                value={content}
                onChange={setContent}
                preview={"edit"}
                previewOptions={{
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeKatex]
                }}
                />
            <MDEditor.Markdown source={content} style={{ whiteSpace: 'pre-wrap' }} />
        </div>
    )
}