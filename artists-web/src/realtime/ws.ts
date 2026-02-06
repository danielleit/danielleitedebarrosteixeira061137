"use client";

import { useEffect, useState } from 'react';
import { config } from '@/core/config';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

export interface AlbumNotification {
  type: string;
  albumId: number;
  albumName: string;
  artistId: number;
  artistName: string;
  message: string;
}

export function useWebSocket(onMessage: (notification: AlbumNotification) => void) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS(config.wsUrl);
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe('/topic/albums', (message: IMessage) => {
          const notification: AlbumNotification = JSON.parse(message.body);
          onMessage(notification);
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [onMessage]);

  return { connected };
}
