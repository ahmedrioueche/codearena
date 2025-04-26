import ModesContainer from "../components/ModeContainer";
import Profile from "../components/Profile";

const Home = () => {
  return (
    <div className="w-full space-y-8">
      <div className="w-full">
        <Profile />
      </div>
      <div className="w-full">
        <ModesContainer />
      </div>
    </div>
  );
};

export default Home;
