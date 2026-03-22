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
          className={clsx(
            'markdown-preview prose lg:prose-lg max-w-4xl mx-auto',
            {
              'prose-invert dark': isDarkTheme,
            },
            
            // Links
            'prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline',
            
            // Code blocks
            'prose-pre:bg-gray-100 dark:prose-pre:bg-[#161b22] prose-pre:border',
            isDarkTheme ? 'prose-pre:border-gray-700' : 'prose-pre:border-gray-300',
            'prose-code:text-sm prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
            'prose-code:bg-gray-100 dark:prose-code:bg-[#161b22]',
            'prose-code:before:content-none prose-code:after:content-none',
            
            // Lists
            'prose-ul:my-4 prose-ol:my-4',
            'prose-li:my-1',
            
            // Tables
            'prose-table:border-collapse prose-table:w-full',
            'prose-th:border prose-th:px-4 prose-th:py-2 prose-th:bg-gray-100 dark:prose-th:bg-[#161b22]',
            'prose-td:border prose-td:px-4 prose-td:py-2',
            isDarkTheme ? 'prose-th:border-gray-700 prose-td:border-gray-700' : 'prose-th:border-gray-300 prose-td:border-gray-300',
            
            // Blockquotes
            'prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600',
            'prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-400',
            
            // Horizontal rules
            'prose-hr:border-gray-300 dark:prose-hr:border-gray-700',
            
            // Images
            'prose-img:rounded-lg prose-img:shadow-md',
            
            // Strong and emphasis
            'prose-strong:font-semibold',
          )}
          style={{ tabSize: 4, MozTabSize: 4 }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
          >{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}