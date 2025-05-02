import React, { useState, useEffect } from "react";
import "./App.css";
import { FaPlus } from "react-icons/fa";
import defaultImage from "./images/default-picture.jpg";

function App() {
  const [newCard, setNewCard] = useState({
    name: "",
    age: "",
    gender: "",
    favoriteTeam: "",
    favoriteTeamLogo: "",
    favoritePlayer: "",
    customImage: "", // New property for custom image
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [fanCards, setFanCards] = useState([]); // State to store all fan cards
  const [teamSearchTerm, setTeamSearchTerm] = useState(""); // State for team search term
  const [playerSearchTerm, setPlayerSearchTerm] = useState(""); // State for player search term
  const [selectedTeamId, setSelectedTeamId] = useState(null); //Store the ID of the selected team to fetch its players
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, image: "" });

  useEffect(() => {
    let url = "";

    if (teamSearchTerm) {
      // If user is typing, search teams
      url = `https://v3.football.api-sports.io/teams?search=${teamSearchTerm}`;
    } else {
      // If no search term, load default popular teams
      url = `https://v3.football.api-sports.io/teams?league=39&season=2023`;
    }
    //Fetch teams
    fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "6faaa8866cd0bff2ff529e95c1090cc4",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setTeams(data.response))
      .catch((error) => console.error("Error fetching teams:", error));
  }, [teamSearchTerm]);

  // Fetch players when a team is selected
  useEffect(() => {
    if (selectedTeamId) {
      fetch(
        `https://v3.football.api-sports.io/players?team=${selectedTeamId}&season=2023`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": "6faaa8866cd0bff2ff529e95c1090cc4",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setPlayers(data.response))
        .catch((error) => console.error("Error fetching players:", error));
    }
  }, [selectedTeamId]);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a JPEG, PNG, or GIF image.");
        return;
      }

      // Validate file size (e.g., max 2MB)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        alert("File size exceeds 2MB. Please upload a smaller image.");
        return;
      }

      // Read and set the image
      const reader = new FileReader();
      reader.onload = () => {
        setNewCard({ ...newCard, customImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCard = () => {
    setFanCards([...fanCards, newCard]); // Add the new card to the fanCards array
    setNewCard({
      name: "",
      age: "",
      gender: "",
      favoriteTeam: "",
      favoriteTeamLogo: "",
      favoritePlayer: "",
      customImage: "", // Reset custom image
    });
    setTeamSearchTerm(""); // Reset the team search term
    setSelectedTeamId(null);
    setPlayers([]);
    setIsModalOpen(false); // Close the modal
  };

  const handleTooltip = (e, type) => {
    const option = e.target.options[e.target.selectedIndex];
    const image = option.getAttribute("data-image");
  
    if (image) {
      setTooltip({
        visible: true,
        x: e.pageX + 10, // Position tooltip slightly to the right of the cursor
        y: e.pageY + 10, // Position tooltip slightly below the cursor
        image,
      });
    }
  };
  
  const hideTooltip = () => {
    setTooltip({ visible: false, x: 0, y: 0, image: "" });
  };

  return (
    <>
      <header>Soccer Fan Cards</header>
      <div className="card-container">
        {fanCards.map((card, index) => (
          <div className="fan-cards" key={index}>
            <img
              src={card.customImage || defaultImage} // Use custom image if available
              alt="fan-card"
              style={{ width: "100%" }}
            />
            <h1>{card.name}</h1>
            <p>Age: {card.age}</p>
            <p>Gender: {card.gender}</p>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              Favorite Team:
              {card.favoriteTeamLogo && (
                <img
                  src={card.favoriteTeamLogo}
                  alt={card.favoriteTeam}
                  style={{
                    width: "60px", // Increased size for the team logo
                    height: "60px",
                    objectFit: "contain",
                    borderRadius: "5px",
                  }}
                />
              )}
              {card.favoriteTeam}
            </p>
            <p>Favorite Player: {card.favoritePlayer}</p>
            {card.favoritePlayer && (
              <img
                src={card.favoritePlayerPhoto} // Add the player's photo
                alt={card.favoritePlayer}
                style={{
                  width: "80px", // Set size for the player's photo
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginTop: "10px",
                }}
              />
            )}
          </div>
        ))}

        {/* Add Card Button */}
        <div
          className="fan-cards add-card"
          onClick={() => setIsModalOpen(true)}
        >
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
              onChange={(e) => {
                const selectedTeamName = e.target.value;
                const selectedTeam = teams.find(
                  (team) => team.team.name === selectedTeamName
                );
                if (selectedTeam) {
                  setNewCard({
                    ...newCard,
                    favoriteTeam: selectedTeam.team.name,
                    favoriteTeamLogo: selectedTeam.team.logo, // Add logo to the card
                  });
                  setSelectedTeamId(selectedTeam.team.id);
                }
              }}
              onMouseMove={(e) => handleTooltip(e, "team")}
              onMouseLeave={hideTooltip}
            >
              <option value="">Select Favorite Team</option>
              {teams.map((team) => (
                <option
                  key={team.team.id}
                  value={team.team.name}
                  data-image={team.team.logo} // Store the team logo URL
                >
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
              onMouseMove={(e) => handleTooltip(e, "player")}
              onMouseLeave={hideTooltip}
            >
              <option value="">Select Favorite Player</option>
              {players.length === 0 && <option disabled>No Players found</option>}
              {players.map((player) => (
                <option
                  key={player.player.id}
                  value={player.player.name}
                  data-image={player.player.photo} // Store the player photo URL
                >
                  {player.player.name}
                </option>
              ))}
            </select>

            {/* New file input for custom image */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />

            <div className="button-group">
              <button onClick={handleAddCard}>Add Card</button>
              <button
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div id="tooltip" style={{ display: "none", position: "absolute" }}></div>
      {tooltip.visible && (
        <div
          className="tooltip"
          style={{
            position: "absolute",
            top: tooltip.y,
            left: tooltip.x,
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          <img
            src={tooltip.image}
            alt="Preview"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: "#fff",
            }}
          />
        </div>
      )}
    </>
  );
}

export default App;
