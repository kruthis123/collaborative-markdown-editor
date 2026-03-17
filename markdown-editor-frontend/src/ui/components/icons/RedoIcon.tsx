'use client';

import * as monaco from 'monaco-editor';

interface RedoIconProps {
  editorRef?: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
}

export default function RedoIcon({ editorRef }: RedoIconProps) {
  const handleRedo = () => {
    if (editorRef?.current) {
      editorRef.current.trigger('keyboard', 'redo', null);
    }
  };

  return (
    <button 
      title="Redo" 
      className="p-1.5 rounded hover:bg-gray-100"
      onClick={handleRedo}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
      </svg>
    </button>
  );
}
