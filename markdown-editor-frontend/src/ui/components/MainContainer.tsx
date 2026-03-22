'use client';

import EditorPanel from "@/ui/components/EditorPanel";
import PreviewPanel from "@/ui/components/PreviewPanel";
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from "react-resizable-panels";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useRef } from "react";
import clsx from "clsx";

interface MainContainerProps {
  documentId?: number;
  documentTitle?: string;
}

export default function MainContainer({ documentId, documentTitle }: MainContainerProps) {
  const isEditorPanelEnlarged = useSelector((state: RootState) => state.panelView.editorPanelEnlarged);
  const isPreviewPanelEnlarged = useSelector((state: RootState) => state.panelView.previewPanelEnlarged);
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);

  const editorPanelRef = useRef<ImperativePanelHandle | null>(null);
  const previewPanelRef = useRef<ImperativePanelHandle | null>(null);

  useEffect(() => {
    if (isEditorPanelEnlarged) {
      editorPanelRef.current?.resize(100);
    } else {
      if (!isPreviewPanelEnlarged) {
        editorPanelRef.current?.resize(55);
      }
    }
  }, [isEditorPanelEnlarged, isPreviewPanelEnlarged]);

  useEffect(() => {
    if (isPreviewPanelEnlarged) {
      previewPanelRef.current?.resize(100);
    } else {
      if (!isEditorPanelEnlarged) {
        previewPanelRef.current?.resize(45);
      }
    }
  }, [isPreviewPanelEnlarged, isEditorPanelEnlarged]);

  return (
    <div className={clsx(
      'h-[calc(100dvh - 50px)]',
      {
        'bg-[#1e1e1e] text-[#d4d4d4]': isDarkTheme,
        'bg-white text-gray-900': !isDarkTheme
      }
    )}>
      <PanelGroup direction="horizontal" style={{ height: "calc(100dvh - 50px)" }}>
        <Panel
          id="editor-panel"
          minSize={10}
          defaultSize={55}
          collapsible={true}
          ref={editorPanelRef}
          className={clsx(
          'border-t-1 border-l-1 ml-2 shadow-md',
            {
              'border-[#3c3c3c]': isDarkTheme,
              'border-[#d4d4d4]': !isDarkTheme
            },
            {
              'opacity-0': isPreviewPanelEnlarged,
              'opacity-100': !isPreviewPanelEnlarged
            }
          )}
        >
          <EditorPanel documentId={documentId} documentTitle={documentTitle} />
        </Panel>
        <PanelResizeHandle 
          className={clsx(
            'cursor-col-resize',
            {
              'border-[#3c3c3c] hover:bg-[#6c6c6c52] active:bg-[#6c6c6c52]': isDarkTheme,
              'border-[#d4d4d4] hover:bg-gray-200 active:bg-gray-200': !isDarkTheme
            },
            {
              'w-0 border-l-1': isEditorPanelEnlarged || isPreviewPanelEnlarged,
              'w-1.5 border-x-1': !(isEditorPanelEnlarged || isPreviewPanelEnlarged)
            }
          )}
        />
        <Panel
          id="preview-panel"
          minSize={30}
          defaultSize={45}
          collapsible={true}
          ref={previewPanelRef}
          className={clsx(
            'border-t-1 border-r-1 mr-2 shadow-md',
            {
              'border-[#3c3c3c] bg-[#1e1e1e]': isDarkTheme,
              'border-[#d4d4d4] bg-white': !isDarkTheme
            },
            {
              'opacity-0': isEditorPanelEnlarged,
              'opacity-100': !isEditorPanelEnlarged
            }
          )}
        >
          <PreviewPanel />
        </Panel>
      </PanelGroup>
    </div>
  );
}