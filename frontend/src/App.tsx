import { Outlet } from "@tanstack/react-router";
import { FC } from "react";

const App: FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default App;
