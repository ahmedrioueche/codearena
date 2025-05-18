import ModesContainer from "../components/ModeContainer";
import Profile from "../components/Profile";

const HomePage = () => {
  return (
    <div className="container space-y-10 mx-auto p-2 py-0  dark:bg-dark-background ">
      <Profile />
      <ModesContainer />
    </div>
  );
};

export default HomePage;
