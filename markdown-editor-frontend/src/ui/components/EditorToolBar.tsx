'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import * as monaco from 'monaco-editor';
import { UndoIcon, RedoIcon, CopyIcon, DownloadIcon } from './icons';

const MIN_GAP_BETWEEN_TITLE_AND_ICONS = 65;

interface EditorToolBarProps {
  editorRef?: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
}

export default function EditorToolBar({ editorRef }: EditorToolBarProps) {
  const [areIconsVisible, setAreIconsVisible] = useState(true);
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLDivElement>(null);
  const iconsWrapperRef = useRef<HTMLDivElement>(null);
  const measuredIconsWidth = useRef<number>(0); // To store the full width of icons

  const checkDimensions = useCallback(() => {
    if (toolbarRef.current && titleTextRef.current && iconsWrapperRef.current) {
      const iconsCurrentOffsetWidth = iconsWrapperRef.current.offsetWidth;
      if (iconsCurrentOffsetWidth > 0) {
        measuredIconsWidth.current = iconsCurrentOffsetWidth;
      }

      if (measuredIconsWidth.current === 0 && areIconsVisible) {
        requestAnimationFrame(checkDimensions); // Retry if icons width not yet captured
        return;
      }

      const toolbarWidth = toolbarRef.current.offsetWidth;
      const titleTextWidth = titleTextRef.current.offsetWidth; // Width of the (potentially truncated) title div
      const iconsWidthToCompare = measuredIconsWidth.current;

      if (iconsWidthToCompare > 0) {
        if (titleTextWidth + iconsWidthToCompare + MIN_GAP_BETWEEN_TITLE_AND_ICONS > toolbarWidth) {
          if (areIconsVisible) setAreIconsVisible(false);
        } else {
          if (!areIconsVisible) setAreIconsVisible(true);
        }
      }
    }
  }, [areIconsVisible]);

  useEffect(() => {
    if (toolbarRef.current && titleTextRef.current && iconsWrapperRef.current) {
      const rafId = requestAnimationFrame(checkDimensions);
      const observer = new ResizeObserver(checkDimensions);
      observer.observe(toolbarRef.current);

      return () => {
        cancelAnimationFrame(rafId);
        observer.disconnect();
      };
    }
  }, [checkDimensions]);

  return (
    <div className={clsx(
      'h-[40px] border-b-1 flex flex-row items-center px-4 justify-between',
      {
        'border-[#3c3c3c]': isDarkTheme,
        'border-[#d4d4d4]': !isDarkTheme
      }
    )} ref={toolbarRef}>
      <div className="flex-1 text-sm truncate max-w-[calc(100%-230px)] overflow-hidden whitespace-nowrap" ref={titleTextRef} title="Untitled.mdasdfafrafvrvrftgbg">
        Untitled.md
      </div>

      <div 
        className={`flex items-center gap-2 flex-nowrap ${areIconsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        ref={iconsWrapperRef}
      >
        <UndoIcon editorRef={editorRef} />
        <RedoIcon editorRef={editorRef} />
        <CopyIcon />
        <DownloadIcon fileName="Untitled.md" />
      </div>
    </div>
  );
}