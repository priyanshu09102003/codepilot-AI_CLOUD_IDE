import { useEffect, useMemo, useRef } from "react"
import {basicSetup} from "codemirror"
import {oneDark} from "@codemirror/theme-one-dark"
import { customTheme } from "./extensions/theme"
import { getLanguageExtension } from "./extensions/language-extension"
import {indentWithTab} from "@codemirror/commands"
import {EditorView, keymap } from "@codemirror/view"
import { minimap } from "./extensions/minimap"

interface Props{
    fileName: string;
}

export const CodeEditor = ({fileName}:Props) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);

    const languageExtension = useMemo(() => {
        return getLanguageExtension(fileName)}, 
        [fileName])

    useEffect(() => {

        if(!editorRef.current) return;

        const view = new EditorView({
            doc: `const Counter = () => {
            const [value, setValue] = useState(0);
            const onIncrease = setValue((value) => value+1);
            const onDecrease = setValue((value) => value-1);

            return(
                <div>
                    <button onClick={onIncrease}>{value}</button>
                    <button onClick={onDecrease}>{value}</button>
                </div>
            )
            
            }`,
            parent: editorRef.current,
            extensions: [
                oneDark,
                customTheme,
                basicSetup,
                languageExtension,
                keymap.of([indentWithTab]),
                minimap()
            ]
        });

        viewRef.current = view;

        return () => {
            view.destroy();
        }

    }, [])

    return(
        <div ref={editorRef} className="size-full pl-4 bg-background" />

    )
}