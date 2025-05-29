import { useCallback, useEffect, useState } from "react";
import { RoomApi } from "../../../../../../api/game/room";
import { APP_PAGES } from "../../../../../../constants/navigation";
import { useAppContext } from "../../../../../../context/AppContext";
import { User } from "../../../../../../types/user";
import { GameSettings } from "../../../../../../types/game/game";

export const useRoomValidation = () => {
  const { currentUser, currentRoom, setCurrentRoom } = useAppContext();

  const validateRoom = useCallback(async () => {
    // Basic client-side validation
    if (!currentUser || !currentUser._id) {
      window.location.href = APP_PAGES.home.route;
      return false;
    }

    // Check if we have a room in context
    if (!currentRoom || !currentRoom.code) {
      window.location.href = APP_PAGES.home.route;
      return false;
    }

    try {
      // Verify room exists and user has access
      const response = await RoomApi.getRoom(currentRoom.code);
      setCurrentRoom(response);
      return true;
    } catch (error) {
      console.error("Room validation failed:", error);
      window.location.href = APP_PAGES.home.route;
      return false;
    }
  }, [currentUser]);

  return { validateRoom };
};

export const useRoomData = () => {
  const { currentRoom, currentUser, setCurrentRoom } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);
  const [isAsker, setIsAsker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUpdatedRoom = useCallback(async () => {
    if (!currentRoom?.code) return null;

    try {
      setIsLoading(true);
      const updatedRoom = await RoomApi.getRoom(currentRoom.code);
      setCurrentRoom(updatedRoom);
      setUsers(updatedRoom?.users || []);
      setIsAsker(currentUser?._id === updatedRoom?.users?.[0]?._id);
      return updatedRoom;
    } catch (error) {
      console.error("Failed to fetch updated room:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?._id]);

  const addUser = useCallback(
    (newUser: User) => {
      setUsers((prevUsers) => {
        if (!prevUsers.some((user) => user._id === newUser._id)) {
          const updatedUsers = [...prevUsers, newUser];
          // Update currentRoom with the new users list
          setCurrentRoom((prevRoom) => {
            if (!prevRoom) return prevRoom;
            return {
              ...prevRoom,
              users: updatedUsers,
            };
          });
          return updatedUsers;
        }
        return prevUsers;
      });
    },
    [setCurrentRoom]
  );

  const removeUser = useCallback(
    (userId: string) => {
      setUsers((prev) => {
        const updatedUsers = prev.filter((u) => u._id !== userId);
        // Update currentRoom with the updated users list
        setCurrentRoom((prevRoom) => {
          if (!prevRoom) return prevRoom;
          return {
            ...prevRoom,
            users: updatedUsers,
          };
        });
        return updatedUsers;
      });
    },
    [setCurrentRoom]
  );

  const updateGameSettings = useCallback(
    (settings: Partial<GameSettings>) => {
      setCurrentRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;
        return {
          ...prevRoom,
          settings: {
            ...prevRoom.settings,
            ...settings,
          },
        };
      });

      return currentRoom?.settings;
    },
    [setCurrentRoom, currentRoom]
  );

  const leaveRoom = useCallback(async () => {
    if (!currentRoom?.code || !currentUser?._id) return;
    try {
      await RoomApi.leaveRoom(currentRoom.code, currentUser._id);
    } catch (error) {
      console.error("Leave room error:", error);
    }
  }, [currentRoom?.code, currentUser?._id]);

  // Add to your useRoomData hook
  const setPlayerReady = useCallback(
    async (userId: string) => {
      if (!currentRoom?.code || !currentUser?._id) return;

      try {
        // Optimistic UI update
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, playStatus: "ready" } : user
          )
        );

        // Update currentRoom state
        setCurrentRoom((prevRoom) => {
          if (!prevRoom) return prevRoom;
          return {
            ...prevRoom,
            users: prevRoom.users.map((user) =>
              user._id === userId ? { ...user, playStatus: "ready" } : user
            ),
          };
        });
      } catch (error) {
        console.error("Error setting player ready status:", error);
        // Revert optimistic update if needed
        await fetchUpdatedRoom();
      }
    },
    [currentRoom?.code, currentUser?._id, fetchUpdatedRoom, setCurrentRoom]
  );

  useEffect(() => {
    const fetchRoomData = async () => {
      const updatedRoom = await fetchUpdatedRoom();
      if (!updatedRoom && currentRoom) {
        setUsers(currentRoom.users || [currentUser]);
        setIsAsker(currentUser?._id === currentRoom.users?.[0]?._id);
      }
    };

    fetchRoomData();
  }, [currentUser]);

  return {
    users,
    isAsker,
    isLoading,
    addUser,
    removeUser,
    currentRoom,
    updateGameSettings,
    setCurrentRoom,
    setUsers,
    setIsAsker,
    fetchUpdatedRoom,
    leaveRoom,
    setPlayerReady,
  };
};

export const useRoom = () => {
  const validation = useRoomValidation();
  const data = useRoomData();

  return {
    ...validation,
    ...data,
  };
};
