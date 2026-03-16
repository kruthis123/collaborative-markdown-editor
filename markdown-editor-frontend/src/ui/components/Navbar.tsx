'use client';

import Link from 'next/link';
import ToggleThemeIcon from '@/ui/components/icons/ToggleThemeIcon';
import EnlargeEditorIcon from '@/ui/components/icons/EnlargeEditorIcon';
import EnlargePreviewIcon from '@/ui/components/icons/EnlargePreviewIcon';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function Navbar() {
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);
  return (
    <div className={clsx(
      'h-[50px] flex items-center justify-between min-w-[550px] overflow-hidden',
      {
        'bg-[#1e1e1e] text-[#d4d4d4]': isDarkTheme,
        'bg-white text-gray-900': !isDarkTheme
      }
    )}>
      {/* Left side - App title */}
      <div className="pl-4 flex items-center">
        <div className="font-bold">Collaborative Markdown Editor</div>
        <div className="flex items-center pl-4 gap-4">
          <EnlargeEditorIcon />
          <EnlargePreviewIcon />
          <ToggleThemeIcon />
        </div>
      </div>

      {/* Right side - Login/Signup links */}
      <div className="pr-4 flex items-center gap-2">
        <Link 
          href="/login"
        >
          Login
        </Link>
        <span>/</span>
        <Link 
          href="/signup"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}