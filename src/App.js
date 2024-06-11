import { useEffect, useState } from "react";
import "./App.css";

const useQuery = ({ argsParams, queryFn }) => {
  const [data, setData] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // можно сделать бачинг isPending, isLoading, isError
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    setIsPending(true);
    setIsLoading(false);

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
  const { isPending, isError, data, error, isLoading } = useQuery({
    argsParams: [],
    queryFn: () =>
      fetch(" https://pokeapi.co/api/v2/pokemon?limit=10&offset=0"),
  });

  return (
    <div className="App">
      {isPending ? (
        <h1>Loading...</h1>
      ) : isError ? (
        <p>{error}</p>
      ) : (
        data.map((pokemon, index) => <p key={index}>{pokemon.name}</p>)
      )}
    </div>
  );
};

export default App;
