'use client';

import EditorToolBar from "./EditorToolBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Editor from "@monaco-editor/react";
import { updateMarkdown } from "@/store/markdown-slice";
import { useRef } from "react";
import * as monaco from 'monaco-editor';

export default function EditorPanel() {
  const markdown = useSelector((state: RootState) => state.markdown.content);
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  return (
    <div className="grow-1 h-[100%]">
      <EditorToolBar editorRef={editorRef} />
      <div className="pr-4 h-[calc(100%-40px)]">
        <Editor
          defaultLanguage="markdown"
          value={markdown}
          onChange={(value) => dispatch(updateMarkdown(value || ""))}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          options={{
            minimap: { enabled: false },
            scrollbar: {
              verticalScrollbarSize: 5,
              horizontalScrollbarSize: 5,
              useShadows: false
            },
            theme: isDarkTheme ? 'vs-dark' : 'light'
          }}
          className="mt-3"
        />
      </div>
    </div>
  );
}