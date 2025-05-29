import { useEffect } from "react";
import { pusher } from "../../../../utils/pusher";

interface UseRealtimeOptions {
  channelName: string;
  events: {
    [key: string]: (data: any) => void;
  };
}

export const useRealtime = ({
  channelName,
  events,
}: UseRealtimeOptions) => {
  useEffect(() => {
    const channel = pusher.subscribe(channelName);

    // Bind all events
    Object.entries(events).forEach(([eventName, handler]) => {
      channel.bind(eventName, handler);
    });

    return () => {
      // Cleanup all event bindings
      Object.entries(events).forEach(([eventName, handler]) => {
        channel.unbind(eventName, handler);
      });
      pusher.unsubscribe(channelName);
    };
  }, [channelName, events]);
};
