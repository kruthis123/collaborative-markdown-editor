'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import clsx from 'clsx';
import Link from 'next/link';

export default function DocumentsHeader() {
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);

  return (
    <div className={clsx(
      'p-4 border-b flex justify-between items-center',
      {
        'border-[#3c3c3c]': isDarkTheme,
        'border-gray-200': !isDarkTheme
      }
    )}>
      <h1 className={clsx(
        'text-xl font-bold',
        {
          'text-white': isDarkTheme,
          'text-gray-900': !isDarkTheme
        }
      )}>
        Documents
      </h1>
      <Link href="/editor/new">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Document
        </button>
      </Link>
    </div>
  );
}
