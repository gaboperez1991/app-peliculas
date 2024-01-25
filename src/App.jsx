import "./App.css";
//import { useRef } from 'react'
import { Movies } from "./Components/Movies";
import { useMovies } from "./hooks/useMovies";
import { useState, useEffect, useRef, useCallback } from "react";
import debounce from "just-debounce-it";

function useSearch() {
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  const isFirstinput = useRef(true);

  useEffect(() => {
    if (isFirstinput.current) {
      isFirstinput.current = search === "";
      return;
    }

    if (search === "") {
      setError("No se puede buscar una pelicula vacia");
      return;
    }

    if (search.match(/^\d+$/)) {
      setError("No se puede buscar una pelicula con números");
      return;
    }

    if (search.length < 3) {
      setError("La busqueda debe tener al menos 3 caracteres");
      return;
    }

    setError(null);
  }, [search]);
  return { search, updateSearch, error };
}

function App() {
  const [sort, setSort] = useState(false);

  const { search, updateSearch, error } = useSearch();
  const { movies, loading, getMovies } = useMovies({ search, sort });

  const debounceGetMovies = useCallback (
    debounce((search) => {
      console.log("search", search);
      getMovies({ search });
    }, 500),
    [getMovies]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    getMovies({ search });
    /*const {query} = Object.fromEntries(
      new window.FormData(event.target)
    )*/
  };

  const handleSort = () => {
    setSort(!sort);
  };

  const handleChange = (event) => {
    const newSearch = event.target.value;
    updateSearch(newSearch);
    debounceGetMovies(newSearch);
  };

  // JavaScript
  /*
    const inputEl = inputRef.current
    const value = inputEl.value
    console.log(value)
    */

  // react puro
  /*const value = inputRef.current.value
    console.log(value)*/

  /* 
    const handleSubmit = (event) => {
      event.preventDefault()
      const fields = Object.fromEntries (
        new windows.FormData(event.target)
      )
      console.log(fields)
    }

    ejemplo: <input name='query' placeholder='blablabla' />
              <input name='otro' placeholder='blablabla' />
              <input name='asdasd' placeholder='blablabla' />
    fields llama a todos los campos sin importar su nombre

    */

  return (
    <div className="page">
      <header>
        <h1>Buscador de Peliculas</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            value={search}
            name="query"
            placeholder="Escribe aquí..."
          />
          <input type="checkbox" onChange={handleSort} checked={sort} />
          <button type="submit">Buscar</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </header>

      <main>{loading ? <p>Cargando...</p> : <Movies movies={movies} />}</main>
    </div>
  );
}

export default App;
