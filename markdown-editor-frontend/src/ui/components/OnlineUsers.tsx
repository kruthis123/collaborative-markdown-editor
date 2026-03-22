'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function OnlineUsers() {
  const currentUser = useSelector((state: RootState) => state.user);
  const onlineUsers = useSelector((state: RootState) => state.presence);

  // Filter out current user
  const otherUsers = Object.entries(onlineUsers).filter(
    ([userId]) => userId !== currentUser.userId
  );

  if (otherUsers.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Editing:</span>
      <div className="flex items-center -space-x-2">
        {otherUsers.map(([userId, user]) => (
          <div
            key={userId}
            className="relative group"
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-sm cursor-default"
              style={{ backgroundColor: user.color }}
              title={user.userName}
            >
              {user.userName.charAt(0).toUpperCase()}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {user.userName}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
