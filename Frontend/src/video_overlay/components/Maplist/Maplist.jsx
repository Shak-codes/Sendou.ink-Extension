import styles from "./styles.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { MAP_ASSETS } from "../../../config/constants";

const Maplist = ({ matchData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mapList: maps } = matchData;
  const columns = 4;

  const [topMaps, bottomMaps] = [maps.slice(0, columns), maps.slice(columns)];

  const goToMaps = () => {
    if (location.pathname !== "/sendouq/maps") {
      navigate("maps");
    }
  };

  return (
    <section onClick={goToMaps} className={styles.mapContainer}>
      <section
        className={styles.topMaps}
        style={{
          gridTemplateColumns: `repeat(${columns}, auto)`,
        }}
      >
        {topMaps.map((entry, i) => {
          const stage = entry.map.stage;
          const url = `/stages/${stage.id}.png`;
          console.log("url", url);
          return (
            <img
              src={`${MAP_ASSETS}/${stage.id}.png`}
              className={styles.map}
              alt={`Stage ${i} - ${stage.name}`}
              title={stage.name}
            />
          );
        })}
        {topMaps.map((entry) => {
          const mode = entry.map.mode;
          const url = `${MAP_ASSETS}/${mode}.png`;
          console.log("url", url);
          return (
            <img src={url} className={styles.mode} alt={mode} title={mode} />
          );
        })}
      </section>
      <section
        className={styles.bottomMaps}
        style={{
          gridTemplateColumns: `repeat(${bottomMaps.length}, auto)`,
        }}
      >
        {bottomMaps.map((entry, i) => {
          const stage = entry.map.stage;
          const url = `${MAP_ASSETS}/${stage.id}.png`;
          console.log("url", url);
          return (
            <img
              src={url}
              className={styles.map}
              alt={`Stage ${bottomMaps.length + i} - ${stage.name}`}
              title={stage.name}
            />
          );
        })}
        {bottomMaps.map((entry) => {
          const mode = entry.map.mode;
          const url = `${MAP_ASSETS}/${mode}.png`;
          console.log("url", url);
          return (
            <img src={url} className={styles.mode} alt={mode} title={mode} />
          );
        })}
      </section>
    </section>
  );
};

export default Maplist;
