'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/user-slice';

interface UserLoaderProps {
  userId: string;
  userName: string;
}

export default function UserLoader({ userId, userName }: Readonly<UserLoaderProps>) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUser({ userName, userId }));
  }, [userId, userName, dispatch]);

  return null;
}
