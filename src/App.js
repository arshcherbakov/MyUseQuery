import { useEffect, useState, useRef } from "react";
import "./App.css";

const useQuery = ({ argsParams, queryFn }) => {
  const [data, setData] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // можно сделать бачинг isPending, isLoading, isError
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  const renderFerst = useRef(true);

  useEffect(() => {
    if (renderFerst.current) {
      renderFerst.current = false;
    } else {
      setIsLoading(false);
    }

    const getData = async () => {
      try {
        const response = await queryFn();
        const data = await response.json();

        setData(data.results);
        setIsPending(false);
      } catch (error) {
        setIsError(true);
        setError(error);
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
  const [isPop, setIsPending] = useState(false);
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
      <button onClick={() => setIsPending(true)}>Проверить загрузку</button>
    </div>
  );
};

export default App;
