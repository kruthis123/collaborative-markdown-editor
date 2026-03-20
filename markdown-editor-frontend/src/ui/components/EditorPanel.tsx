'use client';

import EditorToolBar from "./EditorToolBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Editor from "@monaco-editor/react";
import { useCallback, useRef, useEffect } from "react";
import type * as Monaco from 'monaco-editor';
import { applyDelete, applyInsert, incrementCounter } from "@/store/markdown-slice";
import { sendToServer } from "@/app/lib/socket";
import { store } from "@/store/store";

export default function EditorPanel() {
  const markdown = useSelector((state: RootState) => state.markdown.markdown);
  const counter = useSelector((state: RootState) => state.markdown.crdt.counter);
  const remoteVersion = useSelector((state: RootState) => state.markdown.ui.remoteVersion);
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);

  const counterRef = useRef(counter);
  const isApplyingRemoteChangeRef = useRef(false);
  
  // Sync ref with Redux state on every render
  useEffect(() => {
    counterRef.current = counter;
  }, [counter]);

  // Sync Monaco from Redux ONLY when remoteVersion changes (remote operations)
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    if (remoteVersion === 0) return; // Skip initial state
    
    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    const currentContent = model.getValue();
    const latestMarkdown = store.getState().markdown.markdown;
    
    // Only update if content actually differs
    if (currentContent !== latestMarkdown) {
      // Save cursor position before sync
      const position = editor.getPosition();
      const selection = editor.getSelection();
      
      isApplyingRemoteChangeRef.current = true;
      model.setValue(latestMarkdown);
      isApplyingRemoteChangeRef.current = false;
      
      // Restore cursor position after sync
      if (position) {
        editor.setPosition(position);
      }
      if (selection) {
        editor.setSelection(selection);
      }
    }
  }, [remoteVersion]);

  const addChangeEventListener = useCallback(() => {
    editorRef.current?.onDidChangeModelContent((event) => {
      if (isApplyingRemoteChangeRef.current) {
        return;
      }

      event.changes.forEach(change => {
        const index = change.rangeOffset;

        // DELETE (rangeLength > 0 and text = "") and REPLACE (rangeLength > 0 and text.length > 0)
        if (change.rangeLength > 0) {
          dispatch(applyDelete({ index, length: change.rangeLength }));
          sendToServer(JSON.stringify({
            type: 'delete',
            index,
            length: change.rangeLength
          }));
        }

        // INSERT (rangeLength = 0 and text.length > 0) and REPLACE (rangeLength > 0 and text.length > 0)
        if (change.text.length > 0) {
          // Read clientId directly from store to avoid stale closure
          const clientId = store.getState().markdown.crdt.clientId;
          // Start with current Redux counter value for this batch of changes
          let localCounter = counterRef.current;
          
          for (let i = 0; i < change.text.length; i++) {
            const char = change.text[i];
            const id = `${clientId}-${localCounter}`;
            
            dispatch(applyInsert({ index: index + i, char, id }));
            dispatch(incrementCounter());

            sendToServer(JSON.stringify({
              type: 'insert',
              index: index + i,
              char,
              id
            }));
            
            // Increment local counter for next iteration
            localCounter++;
          }
          
          // Update ref with the final counter value
          counterRef.current = localCounter;
        }
      })
    });
  }, [dispatch]);

  return (
    <div className="grow-1 h-[100%]">
      <EditorToolBar editorRef={editorRef} />
      <div className="pr-4 h-[calc(100%-40px)]">
        <Editor
          defaultLanguage="markdown"
          defaultValue={markdown}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            monacoRef.current = monaco;
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