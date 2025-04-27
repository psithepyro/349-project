import React, { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import defaultImage from './images/default-picture.jpg';

function App() {
  const [newCard, setNewCard] = useState({
    name: '',
    age: '',
    gender: '',
    favoriteTeam: '',
    favoritePlayer: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [fanCards, setFanCards] = useState([]); // State to store all fan cards
  const [teamSearchTerm, setTeamSearchTerm] = useState(''); // State for team search term
  const [playerSearchTerm, setPlayerSearchTerm] = useState(''); // State for player search term
  
  useEffect(() => {
    if (teamSearchTerm) {
      // Fetch teams based on team search term
      fetch(`https://v3.football.api-sports.io/teams?search=${teamSearchTerm}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': '6faaa8866cd0bff2ff529e95c1090cc4',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setTeams(data.response))
        .catch((error) => console.error('Error fetching teams:', error));
    }
  }, [teamSearchTerm]);

  useEffect(() => {
    if (playerSearchTerm) {
      // Fetch players based on player search term
      fetch(`https://v3.football.api-sports.io/players/profiles?search=${playerSearchTerm}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': '6faaa8866cd0bff2ff529e95c1090cc4',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setPlayers(data.response))
        .catch((error) => console.error('Error fetching players:', error));
    }
  }, [playerSearchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard({ ...newCard, [name]: value });
  };

  const handleTeamSearchChange = (e) => {
    setTeamSearchTerm(e.target.value); // Update the team search term
  };

  const handlePlayerSearchChange = (e) => {
    setPlayerSearchTerm(e.target.value); // Update the player search term
  };

  const handleAddCard = () => {
    setFanCards([...fanCards, newCard]); // Add the new card to the fanCards array
    setNewCard({
      name: '',
      age: '',
      gender: '',
      favoriteTeam: '',
      favoritePlayer: '',
    });
    setTeamSearchTerm(''); // Reset the team search term
    setPlayerSearchTerm(''); // Reset the player search term
    setIsModalOpen(false); // Close the modal
  };

  return (
    <>
      <header>Soccer Fan Cards</header>
      <div className="card-container">
        {/* Render existing fan cards */}
        {fanCards.map((card, index) => (
          <div className="fan-cards" key={index}>
            <img src={defaultImage} alt="fan-card" style={{ width: '100%' }} />
            <h1>{card.name}</h1>
            <p>Age: {card.age}</p>
            <p>Gender: {card.gender}</p>
            <p>Favorite Team: {card.favoriteTeam}</p>
            <p>Favorite Player: {card.favoritePlayer}</p>
          </div>
        ))}

        {/* Add Card Button */}
        <div className="fan-cards add-card" onClick={() => setIsModalOpen(true)}>
          <FaPlus className="plus-icon" />
        </div>
      </div>

      {/* Modal for adding a new card */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h1>Add New Card</h1>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newCard.name}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={newCard.age}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="gender"
              placeholder="Gender"
              value={newCard.gender}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Search Teams"
              value={teamSearchTerm}
              onChange={handleTeamSearchChange}
            />
            <select
              name="favoriteTeam"
              value={newCard.favoriteTeam}
              onChange={handleInputChange}
            >
              <option value="">Select Favorite Team</option>
              {teams.map((team) => (
                <option key={team.team.id} value={team.team.name}>
                  {team.team.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search Players"
              value={playerSearchTerm}
              onChange={handlePlayerSearchChange}
            />
            <select
              name="favoritePlayer"
              value={newCard.favoritePlayer}
              onChange={handleInputChange}
            >
              <option value="">Select Favorite Player</option>
              {players.map((player) => (
                <option key={player.player.id} value={player.player.name}>
                  {player.player.name}
                </option>
              ))}
            </select>
            <button onClick={handleAddCard}>Add Card</button>
            <button className="close-button" onClick={() => setIsModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
