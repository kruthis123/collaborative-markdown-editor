'use client';

import EditorToolBar from "./EditorToolBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/store/store";
import Editor, { type Monaco } from "@monaco-editor/react";
import { useCallback, useRef, useEffect } from "react";
import { applyDelete, applyInsert, idToString, incrementCounter } from "@/store/markdown-slice";
import { sendToServer } from "@/app/lib/socket";

export default function EditorPanel() {
  const markdown = useSelector((state: RootState) => state.markdown.markdown);
  const counter = useSelector((state: RootState) => state.markdown.crdt.counter);
  const currentUser = useSelector((state: RootState) => state.user);
  const onlineUsers = useSelector((state: RootState) => state.presence);
  const remoteVersion = useSelector((state: RootState) => state.markdown.ui.remoteVersion);
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);
  const editorRef = useRef<Parameters<NonNullable<React.ComponentProps<typeof Editor>['onMount']>>[0] | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const counterRef = useRef(counter);
  const currentUserRef = useRef(currentUser);
  const isApplyingRemoteChangeRef = useRef(false);
  const decorationIdsRef = useRef<string[]>([]);
  
  // Sync ref with Redux state on every render
  useEffect(() => {
    counterRef.current = counter;
    currentUserRef.current = currentUser;
  }, [counter, currentUser]);

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

  useEffect(() => {
    const model = editorRef.current?.getModel();
    if (!model || !monacoRef.current) return;

    // Helper to convert hex color to rgba
    const hexToRgba = (hex: string, alpha: number) => {
      const r = Number.parseInt(hex.slice(1, 3), 16);
      const g = Number.parseInt(hex.slice(3, 5), 16);
      const b = Number.parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const decorations = Object.entries(onlineUsers)
      .filter(([userId]) => userId !== currentUser.userId) // Exclude current user
      .flatMap(([userId, user]) => {
      const startPos = model.getPositionAt(user.selection.start);
      const endPos = model.getPositionAt(user.selection.end);
      const isCursorOnly = user.selection.start === user.selection.end;
      
      // Create CSS-safe userId
      const safeUserId = userId.replace(/[^a-zA-Z0-9-_]/g, '_');
      
      const result = [];
      
      if (isCursorOnly) {
        // For cursor only, show a vertical line at the position
        // Use a minimal range at the exact position
        result.push({
          range: new monacoRef.current!.Range(
            startPos.lineNumber, 
            startPos.column, 
            startPos.lineNumber, 
            startPos.column + 1
          ),
          options: {
            className: `remote-cursor-${safeUserId}`,
            hoverMessage: [{ value: `${user.userName}` }],
            stickiness: monacoRef.current!.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
          }
        });
      } else {
        // For selection, show highlighted range
        result.push({
          range: new monacoRef.current!.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column),
          options: {
            className: `remote-selection-${safeUserId}`,
            hoverMessage: [{ value: `${user.userName}` }]
          }
        });
      }
      
      return result;
    });
    
    // Create dynamic style element for user colors
    let styleEl = document.getElementById('remote-user-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'remote-user-styles';
      document.head.appendChild(styleEl);
    }
    
    const styles = Object.entries(onlineUsers).map(([userId, user]) => {
      const safeUserId = userId.replace(/[^a-zA-Z0-9-_]/g, '_');
      return `
        .remote-selection-${safeUserId} {
          background-color: ${hexToRgba(user.color, 0.2)} !important;
        }
        .remote-cursor-${safeUserId} {
          background-color: transparent !important;
          border-left: 2px solid ${user.color} !important;
        }
      `;
    }).join('\n');
    
    styleEl.textContent = styles;
    
    // Update decorations, replacing old ones
    const newDecorationIds = editorRef.current?.deltaDecorations(decorationIdsRef.current, decorations);
    if (newDecorationIds) {
      decorationIdsRef.current = newDecorationIds;
    }
  }, [onlineUsers, currentUser.userId])

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

  const addCursorAndSelectionChangeEventListener = () => {
    if (editorRef.current) {
      editorRef.current.onDidChangeCursorSelection((e) => {
        const model = editorRef.current?.getModel();

        const start = model?.getOffsetAt(e.selection.getStartPosition());
        const end = model?.getOffsetAt(e.selection.getEndPosition());
        sendToServer(JSON.stringify({
          type: 'selection',
          userId: currentUserRef.current.userId,
          selection: { start, end },
          color: currentUserRef.current.color,
          userName: currentUserRef.current.userName
        }));
      })
    }
  };

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
            addCursorAndSelectionChangeEventListener();
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