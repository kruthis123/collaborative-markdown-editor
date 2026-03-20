'use client';

import EditorToolBar from "./EditorToolBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/store/store";
import Editor from "@monaco-editor/react";
import { useCallback, useRef, useEffect } from "react";
import type * as Monaco from 'monaco-editor';
import { applyDelete, applyInsert, idToString, incrementCounter } from "@/store/markdown-slice";
import { sendToServer } from "@/app/lib/socket";

export default function EditorPanel() {
  const markdown = useSelector((state: RootState) => state.markdown.markdown);
  const counter = useSelector((state: RootState) => state.markdown.crdt.counter);
  const remoteVersion = useSelector((state: RootState) => state.markdown.ui.remoteVersion);
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const counterRef = useRef(counter);
  const isApplyingRemoteChangeRef = useRef(false);
  
  // Sync ref with Redux state on every render
  useEffect(() => {
    counterRef.current = counter;
  }, [counter]);

  // Sync Monaco from Redux ONLY when remoteVersion changes (remote operations)
  useEffect(() => {
    if (!editorRef.current) return;
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
        const order = store.getState().markdown.crdt.order;
        const byId = store.getState().markdown.crdt.byId;
        const visibleOrder = order
          .filter(id => !byId[id].deleted);

        // DELETE (rangeLength > 0 and text = "") and REPLACE (rangeLength > 0 and text.length > 0)
        if (change.rangeLength > 0) {
          const idsToDelete = visibleOrder.slice(index, index + change.rangeLength);
          idsToDelete.forEach(id => {
            dispatch(applyDelete({ id }));
            sendToServer(JSON.stringify({
              type: 'delete',
              id
            }));
          });
        }

        // INSERT (rangeLength = 0 and text.length > 0) and REPLACE (rangeLength > 0 and text.length > 0)
        if (change.text.length > 0) {
          // Read clientId directly from store to avoid stale closure
          const clientId = store.getState().markdown.crdt.clientId;
          // Start with current Redux counter value for this batch of changes
          let localCounter = counterRef.current;
          let currentLeftId = index === 0 ? null : visibleOrder[index - 1];

          for (const char of change.text) {
            const id = { client: clientId, clock: localCounter };
            const idString = idToString(id);
            dispatch(applyInsert({ id, char, left: currentLeftId }));
            dispatch(incrementCounter());

            sendToServer(JSON.stringify({
              type: 'insert',
              char,
              id,
              left: currentLeftId
            }));

            // Update left pointer for next character
            currentLeftId = idString;
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