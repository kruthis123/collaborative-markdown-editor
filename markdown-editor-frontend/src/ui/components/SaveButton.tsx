'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { saveDocumentContent } from '../../actions/documents';
import clsx from 'clsx';

interface SaveButtonProps {
  documentId: number;
}

export default function SaveButton({ documentId }: Readonly<SaveButtonProps>) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const markdown = useSelector((state: RootState) => state.markdown.markdown);
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const result = await saveDocumentContent(documentId, markdown);
      
      if (result.error) {
        setSaveStatus('error');
        console.error('Save error:', result.error);
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      setSaveStatus('error');
      console.error('Save failed:', error);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const getTitle = () => {
    if (isSaving) return 'Saving...';
    if (saveStatus === 'success') return 'Saved!';
    if (saveStatus === 'error') return 'Save failed';
    return 'Save document';
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaving}
      title={getTitle()}
      className={clsx(
        'p-1.5 rounded transition-all',
        {
          'hover:bg-gray-100': !isDarkTheme && saveStatus === 'idle',
          'hover:bg-[#3c3c3c]': isDarkTheme && saveStatus === 'idle',
          'opacity-50 cursor-not-allowed': isSaving
        }
      )}
    >
      {isSaving ? (
        <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : saveStatus === 'success' ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 text-green-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : saveStatus === 'error' ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 text-red-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
      )}
    </button>
  );
}
