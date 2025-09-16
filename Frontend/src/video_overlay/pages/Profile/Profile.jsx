import { useConfig } from "../../../context/ConfigContext";
import PlayerCard from "../../../components/PlayerCard/PlayerCard";
import Navbar from "../../components/Navbar/Navbar";

const Profile = () => {
  const configData = useConfig();

  return (
    <>
      <Navbar />
      <main>
        <PlayerCard userData={configData} />
      </main>
    </>
  );
};

export default Profile;
