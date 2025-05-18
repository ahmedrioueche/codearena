import { useEffect } from "react";
import { pusher } from "../../../../utils/pusher";

interface UseRealtimeOptions {
  channelName: string;
  eventName: string;
  onEvent: (data: any) => void;
}

export const useRealtime = ({
  channelName,
  eventName,
  onEvent,
}: UseRealtimeOptions) => {
  useEffect(() => {
    const channel = pusher.subscribe(channelName);

    channel.bind(eventName, onEvent);

    return () => {
      channel.unbind(eventName, onEvent);
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName, onEvent]);
};
