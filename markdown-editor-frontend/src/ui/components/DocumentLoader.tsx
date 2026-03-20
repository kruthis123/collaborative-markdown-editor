'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadDocument, setClientId } from '@/store/markdown-slice';
import { setUser } from '@/store/user-slice';

interface DocumentLoaderProps {
  content: string;
  userId: string;
  userName: string;
}

export default function DocumentLoader({ content, userId, userName }: Readonly<DocumentLoaderProps>) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadDocument({ content }));
    dispatch(setClientId(userId));
    dispatch(setUser({ userName, userId }));
  }, [content, userId, userName, dispatch]);

  return null;
}
