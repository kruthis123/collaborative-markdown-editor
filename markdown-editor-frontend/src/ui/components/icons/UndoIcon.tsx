'use client';

import * as monaco from 'monaco-editor';

interface UndoIconProps {
  editorRef?: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
}

export default function UndoIcon({ editorRef }: UndoIconProps) {
  const handleUndo = () => {
    if (editorRef?.current) {
      editorRef.current.trigger('keyboard', 'undo', null);
    }
  };

  return (
    <button 
      title="Undo" 
      className="p-1.5 rounded hover:bg-gray-100"
      onClick={handleUndo}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
      </svg>
    </button>
  );
}
