'use client';

import ReactMarkdown from "react-markdown";
import PreviewToolBar from "./PreviewToolBar";
import remarkGfm from 'remark-gfm'
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import clsx from "clsx";

export default function PreviewPanel() {
  const markdown = useSelector((state: RootState) => state.markdown.markdown);
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);

  return (
    <div className="grow-1 h-[100%]">
      <PreviewToolBar />
      <div className={clsx(
        'h-[calc(100%-45px)] overflow-y-auto p-5',
        {
          'bg-[#1e1e1e]': isDarkTheme,
          'bg-white': !isDarkTheme
        }
      )}>
        <div 
          className="prose prose-sm max-w-none dark:prose-invert [&_*]:!whitespace-pre-wrap"
          style={{ whiteSpace: 'pre-wrap', tabSize: 4, MozTabSize: 4 }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
          >{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}