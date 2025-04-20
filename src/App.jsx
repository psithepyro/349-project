import React, { useState } from 'react';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard({ ...newCard, [name]: value });
  };

  const handleAddCard = () => {
    console.log('New card added:', newCard);
    // Add logic to save or display the new card
    setNewCard({
      name: '',
      age: '',
      gender: '',
      favoriteTeam: '',
      favoritePlayer: '',
    });
    setIsModalOpen(false); // Close the modal after adding the card
  };

  return (
    <>
      <header>Soccar Fan Cards</header>
      <div className="card-container">
        <div className="fan-cards">
          <img src={defaultImage} alt="developer-francisco" style={{ width: '100%' }} />
          <h1>Francisco Godoy</h1>
          <p>Age : 25</p>
          <p>Gender : Male</p>
          <p>Favorite team</p>
          <p>Favorite player</p>
        </div>
        <div className="fan-cards add-card" onClick={() => setIsModalOpen(true)}>
          <FaPlus className="plus-icon" />
        </div>
      </div>

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
              name="favoriteTeam"
              placeholder="Favorite Team"
              value={newCard.favoriteTeam}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="favoritePlayer"
              placeholder="Favorite Player"
              value={newCard.favoritePlayer}
              onChange={handleInputChange}
            />
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
