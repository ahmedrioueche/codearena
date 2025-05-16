import { RoomApi } from "../../../../../../api/game/room";
import { APP_PAGES } from "../../../../../../constants/navigation";
import { useAppContext } from "../../../../../../context/AppContext";

export const useRoom = () => {
  const { currentUser, currentRoom, setCurrentRoom } = useAppContext();
  const isEmpty = (obj: object) => Object.keys(obj).length === 0;

  const validateRoom = async () => {
    // Basic client-side validation
    if (!currentUser || isEmpty(currentUser)) {
      location.href = APP_PAGES.home.route;
      return false;
    }

    // Check if we have a room in context
    if (!currentRoom || isEmpty(currentRoom)) {
      location.href = APP_PAGES.home.route;
      return false;
    }

    try {
      // Verify room exists and user has access
      const response = await RoomApi.getRoom(currentRoom.code);

      // Update room data in context if needed
      setCurrentRoom(response);

      return true;
    } catch (error) {
      console.error("Room validation failed:", error);
      location.href = APP_PAGES.home.route;

      return false;
    }
  };

  return { validateRoom };
};
