import { useCallback, useEffect, useState } from "react";
import { RoomApi } from "../../../../../../api/game/room";
import { APP_PAGES } from "../../../../../../constants/navigation";
import { useAppContext } from "../../../../../../context/AppContext";
import { Room } from "../../../../../../types/game/room";
import { User } from "../../../../../../types/user";

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
  }, [currentUser, currentRoom, setCurrentRoom]);

  return { validateRoom };
};

export const useRoomData = () => {
  const { currentRoom, currentUser } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);
  const [isAsker, setIsAsker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [room, setRoom] = useState<Room | null>(null);

  const fetchUpdatedRoom = useCallback(async () => {
    if (!currentRoom?.code) return null;

    try {
      setIsLoading(true);
      const updatedRoom = await RoomApi.getRoom(currentRoom.code);
      setRoom(updatedRoom);
      setUsers(updatedRoom?.users || []);
      setIsAsker(currentUser?._id === updatedRoom?.users?.[0]?._id);
      return updatedRoom;
    } catch (error) {
      console.error("Failed to fetch updated room:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentRoom?.code, currentUser?._id]);

  const addUser = useCallback((newUser: User) => {
    setUsers((prevUsers) => {
      if (!prevUsers.some((user) => user._id === newUser._id)) {
        return [...prevUsers, newUser];
      }
      return prevUsers;
    });
  }, []);

  const removeUser = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((u) => u._id !== userId));
  }, []);

  const leaveRoom = useCallback(async () => {
    if (!currentRoom?.code || !currentUser?._id) return;
    try {
      await RoomApi.leaveRoom(currentRoom.code, currentUser._id);
    } catch (error) {
      console.error("Leave room error:", error);
    }
  }, [currentRoom?.code, currentUser?._id]);

  useEffect(() => {
    const fetchRoomData = async () => {
      const updatedRoom = await fetchUpdatedRoom();
      if (!updatedRoom && currentRoom) {
        setUsers(currentRoom.users || []);
        setIsAsker(currentUser?._id === currentRoom.users?.[0]?._id);
      }
    };

    fetchRoomData();
  }, [currentRoom, currentUser, fetchUpdatedRoom]);

  return {
    users,
    isAsker,
    isLoading,
    room,
    addUser,
    removeUser,
    setUsers,
    setIsAsker,
    fetchUpdatedRoom,
    leaveRoom,
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
