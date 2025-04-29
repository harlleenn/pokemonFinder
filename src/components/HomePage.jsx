import React, { useEffect, useState } from 'react';

export default function HomePage() {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=150";
  const [pokemons, setPokemons] = useState([]);
  const [searchPokemonInput, setSearchPokemonInput] = useState("");
  const [selectedType, setSelectedType] = useState(""); // state for selected type
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json(); // outer fetch

      const pokemonDetails = data.results.map( async (pokemon) => {
      const response = await fetch(pokemon.url); // fetching individual pokemon detail
      const pokemonData = await response.json();

        return {
          name: pokemon.name,
          id: pokemonData.id,
          image: pokemonData.sprites.front_default,
          types: pokemonData.types.map((type) => type.type.name),
        };
      });

      const allPokemonDetails = await Promise.all(pokemonDetails);
      setPokemons(allPokemonDetails);

    } catch (e) {
      console.log("There was an error fetching the data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

      const searchPokemons = pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchPokemonInput.toLowerCase())
    );
    const filteredPokemons = searchPokemons.filter((pokemon) => {
    if(!selectedType) return true;
    return pokemon.types.includes(selectedType);
    })
     

  useEffect(() => {
    if (filteredPokemons.length === 0) {
      setMessage("No Pokémon found :(");
    } else {
      setMessage("");
    }
  }, [filteredPokemons]);

  return (
    <div className="pokemon-container">
      <div>Pokemon cards</div>
      <div >
        <input
          placeholder="Search a Pokémon"
          value={searchPokemonInput}
          onChange={(e) => setSearchPokemonInput(e.target.value)}
          className='input'
        />
      </div>

      {/* Dropdown for types */}
      <select onChange={(e) => setSelectedType(e.target.value)} value={selectedType} className='select'>
        <option value="">Select a type</option>
        <option value="fire">Fire</option>
        <option value="water">Water</option>
        <option value="grass">Grass</option>
        <option value="electric">Electric</option>
      </select>

      {/* Display message if no Pokémon found */}
      {message && <div className='message'>{message}</div>}

      {/* Display the filtered Pokémon cards */}
      <div className='pokemon-cards'>
      {filteredPokemons.map((pokemon) => (
        <div className="pokemon-card" key={pokemon.id}>
          <h2>{pokemon.name}</h2>
          <img src={pokemon.image} alt={pokemon.name} />
          <p className="id">ID: {pokemon.id}</p>
          <p className="types">Types: {pokemon.types.join(", ")}</p>
        </div>
      ))}
      </div>
   
    </div>
  );
}
