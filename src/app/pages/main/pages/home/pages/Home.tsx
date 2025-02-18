import Analytics from "../components/Analytics";
import ModesContainer from "../components/ModeCardsContainer";
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
      <div className="w-full">
        <Analytics />
      </div>
    </div>
  );
};

export default Home;
