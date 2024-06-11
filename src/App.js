import { useEffect, useState, useRef } from "react";
import "./App.css";

const useUpdateEffect = (argsParams, fnSecondRendering) => {
  const renderFirst = useRef(true);

  useEffect(() => {
    if (renderFirst.current) {
      renderFirst.current = false;
    } else {
      fnSecondRendering(false);
    }
  }, argsParams);
};

const useQuery = ({ argsParams = [], queryFn }) => {
  const [data, setData] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // можно сделать бачинг isPending, isLoading, isError
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  const handleLoading = (isLloading) => {
    setIsLoading(isLloading);
  };

  useUpdateEffect(argsParams, handleLoading);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await queryFn();
        const data = await response.json();

        setData(data.results);
      } catch (error) {
        setIsError(true);
        setError(error);
      } finally {
        setIsPending(false);
      }
    };

    getData();
  }, argsParams);

  return {
    isPending,
    data,
    error,
    isLoading,
    isError,
  };
};

const App = () => {
  const [isPop, setIsPop] = useState(false);
  const { isPending, isError, data, error, isLoading } = useQuery({
    argsParams: [isPop],
    queryFn: () =>
      fetch(" https://pokeapi.co/api/v2/pokemon?limit=10&offset=0"),
  });

  console.log(isLoading);

  return (
    <div className="App">
      {isPending ? (
        <h1>Loading...</h1>
      ) : isError ? (
        <p>{error}</p>
      ) : (
        data.map((pokemon, index) => <p key={index}>{pokemon.name}</p>)
      )}
      <button onClick={() => setIsPop(true)}>Проверить загрузку</button>
    </div>
  );
};

export default App;
