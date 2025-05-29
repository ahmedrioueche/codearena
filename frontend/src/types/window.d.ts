import { Pusher } from 'pusher-js';

declare global {
  interface Window {
    pusher: Pusher;
  }
} 