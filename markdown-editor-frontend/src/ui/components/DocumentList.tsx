'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import clsx from 'clsx';
import Link from 'next/link';

type Document = {
  id: number;
  title: string;
  storage_path: string;
  owner: {
    name: string | null;
    email: string;
  };
};

type DocumentListProps = {
  ownedDocuments: Document[];
  sharedDocuments: Document[];
};

export default function DocumentList({ ownedDocuments, sharedDocuments }: DocumentListProps) {
  const [activeTab, setActiveTab] = useState<'owned' | 'shared'>('owned');
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);

  const documents = activeTab === 'owned' ? ownedDocuments : sharedDocuments;

  return (
    <div className={clsx(
      'h-full flex flex-col',
      {
        'bg-[#1e1e1e]': isDarkTheme,
        'bg-white': !isDarkTheme
      }
    )}>
      {/* Tabs */}
      <div className={clsx(
        'flex border-b',
        {
          'border-[#3c3c3c]': isDarkTheme,
          'border-gray-200': !isDarkTheme
        }
      )}>
        <button
          onClick={() => setActiveTab('owned')}
          className={clsx(
            'px-6 py-3 font-medium transition-colors',
            {
              'text-indigo-500 border-b-2 border-indigo-500': activeTab === 'owned',
              'text-gray-400 hover:text-gray-300': activeTab !== 'owned' && isDarkTheme,
              'text-gray-600 hover:text-gray-900': activeTab !== 'owned' && !isDarkTheme
            }
          )}
        >
          My Documents ({ownedDocuments.length})
        </button>
        <button
          onClick={() => setActiveTab('shared')}
          className={clsx(
            'px-6 py-3 font-medium transition-colors',
            {
              'text-indigo-500 border-b-2 border-indigo-500': activeTab === 'shared',
              'text-gray-400 hover:text-gray-300': activeTab !== 'shared' && isDarkTheme,
              'text-gray-600 hover:text-gray-900': activeTab !== 'shared' && !isDarkTheme
            }
          )}
        >
          Shared with Me ({sharedDocuments.length})
        </button>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-6">
        {documents.length === 0 ? (
          <div className={clsx(
            'text-center py-12',
            {
              'text-gray-400': isDarkTheme,
              'text-gray-500': !isDarkTheme
            }
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <p className="text-lg">
              {activeTab === 'owned' ? 'No documents yet' : 'No shared documents'}
            </p>
            <p className="text-sm mt-2">
              {activeTab === 'owned' ? 'Create your first document to get started' : 'Documents shared with you will appear here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <Link key={doc.id} href={`/editor/${doc.id}`}>
                <div
                  className={clsx(
                    'p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg',
                    {
                      'bg-[#252525] border-[#3c3c3c] hover:bg-[#2a2a2a]': isDarkTheme,
                      'bg-white border-gray-200 hover:border-indigo-300': !isDarkTheme
                    }
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <h3 className={clsx(
                    'font-semibold text-lg mb-1 truncate',
                    {
                      'text-white': isDarkTheme,
                      'text-gray-900': !isDarkTheme
                    }
                  )}>
                    {doc.title}
                  </h3>
                  <p className={clsx(
                    'text-sm',
                    {
                      'text-gray-400': isDarkTheme,
                      'text-gray-600': !isDarkTheme
                    }
                  )}>
                    {activeTab === 'shared' && (
                      <span>Owner: {doc.owner.name || doc.owner.email}</span>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
