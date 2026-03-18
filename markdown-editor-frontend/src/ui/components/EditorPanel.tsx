'use client';

import EditorToolBar from "./EditorToolBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Editor from "@monaco-editor/react";
import { useCallback, useRef, useEffect } from "react";
import * as monaco from 'monaco-editor';
import { applyDelete, applyInsert, incrementCounter } from "@/store/markdown-slice";

export default function EditorPanel() {
  const markdown = useSelector((state: RootState) => state.markdown.markdown);
  const clientId = useSelector((state: RootState) => state.markdown.crdt.clientId);
  const counter = useSelector((state: RootState) => state.markdown.crdt.counter);
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const counterRef = useRef(counter);
  
  // Sync ref with Redux state on every render
  useEffect(() => {
    counterRef.current = counter;
  }, [counter]);

  const addChangeEventListener = useCallback(() => {
    editorRef.current?.onDidChangeModelContent((event) => {
      event.changes.forEach(change => {
        const index = change.rangeOffset;

        // DELETE (rangeLength > 0 and text = "") and REPLACE (rangeLength > 0 and text.length > 0)
        if (change.rangeLength > 0) {
          dispatch(applyDelete({ index, length: change.rangeLength }));
          // TODO: send to server
        }

        // INSERT (rangeLength = 0 and text.length > 0) and REPLACE (rangeLength > 0 and text.length > 0)
        if (change.text.length > 0) {
          // Start with current Redux counter value for this batch of changes
          let localCounter = counterRef.current;
          
          for (let i = 0; i < change.text.length; i++) {
            const char = change.text[i];
            const id = `${clientId}-${localCounter}`;
            
            dispatch(applyInsert({ index: index + i, char, id }));
            dispatch(incrementCounter());
            
            // Increment local counter for next iteration
            localCounter++;
          }
          
          // Update ref with the final counter value
          counterRef.current = localCounter;

          // TODO: send to server
        }
      })
    });
  }, [clientId, dispatch]);

  return (
    <div className="grow-1 h-[100%]">
      <EditorToolBar editorRef={editorRef} />
      <div className="pr-4 h-[calc(100%-40px)]">
        <Editor
          defaultLanguage="markdown"
          value={markdown}
          onMount={(editor) => {
            editorRef.current = editor;
            addChangeEventListener();
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