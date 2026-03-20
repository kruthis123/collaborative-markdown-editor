'use client';

import ToggleThemeIcon from "./icons/ToggleThemeIcon";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import clsx from 'clsx';
import { EnlargeEditorIcon } from './icons';
import EnlargePreviewIcon from './icons/EnlargePreviewIcon';
import ProfileIcon, { ProfileIconProps } from './icons/ProfileIcon';
import SaveButton from './SaveButton';
import { usePathname } from 'next/navigation';

interface AuthenticatedNavbarProps extends ProfileIconProps {
  documentId?: number;
}

export default function AuthenticatedNavbar({ userName, userEmail, documentId }: Readonly<AuthenticatedNavbarProps>) {
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);
  const pathname = usePathname();
  const isEditorRoute = pathname === '/editor' || pathname?.startsWith('/editor/');

  return (
    <div className={clsx(
      'h-[50px] flex items-center justify-between pt-1',
      {
        'bg-[#1e1e1e] text-[#d4d4d4]': isDarkTheme,
        'bg-white text-gray-900': !isDarkTheme
      }
    )}>
      {/* Left side - App title */}
      <div className="pl-4 flex items-center">
        <div className="text-xl font-bold">Collaborative Markdown Editor</div>
        {isEditorRoute && (
          <div className="flex items-center pl-4 gap-4">
            <EnlargeEditorIcon />
            <EnlargePreviewIcon />
            <ToggleThemeIcon />
          </div>
        )}
      </div>

      {/* Right side - Save Button and Profile */}
      <div className="flex items-center gap-4 pr-2">
        {isEditorRoute && documentId && (
          <SaveButton documentId={documentId} />
        )}
        <ProfileIcon userName={userName} userEmail={userEmail} />
      </div>
    </div>
  );
}
