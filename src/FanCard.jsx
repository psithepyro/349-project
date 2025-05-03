import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { FaPlus, FaDownload, FaEdit, FaTrash } from "react-icons/fa";
import defaultImage from "./images/default-picture.jpg";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

function FanCard() {
  const [newCard, setNewCard] = useState({
    name: "",
    age: "",
    location: "", // Replace gender with location
    favoriteTeam: "",
    favoriteTeamLogo: "",
    favoriteTeamId: "",
    favoritePlayer: "",
    favoritePlayerPhoto: "",
    customImage: "",
  });

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const [editingIndex, setEditingIndex] = useState(null); // Track the index of the card being edited
  const cardRefs = useRef([]); //store reference to each fan card to download

  //download card as an image with html2canvas
  const downloadCard = async (element, name) => {
    if (!element) return;

    //Hide all .noprint elements
    const hiddenElements = element.querySelectorAll(".no-print");
    hiddenElements.forEach((el) => (el.style.display = "none"));

    // capture card as an image
    const canvas = await html2canvas(element, {
      useCORS: true, //allows external images for logos
      scale: 2, //resolution
    });

    //make hidden elements visible again
    hiddenElements.forEach((el) => (el.style.display = ""));

    //create download link and trigger it
    const link = document.createElement("a");
    link.download = `${name}-fan-card.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [fanCards, setFanCards] = useState([]);
  const [teamSearchTerm, setTeamSearchTerm] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    image: "",
  });

  useEffect(() => {
    let url = "";

    if (teamSearchTerm) {
      // If user is typing, search teams
      url = `https://v3.football.api-sports.io/teams?search=${teamSearchTerm}`;
    } else {
      // If no search term, load default popular teams
      url = `https://v3.football.api-sports.io/teams?league=39&season=2024`;
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
        `https://v3.football.api-sports.io/players?team=${selectedTeamId}&season=2024`,
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
      location: "", // Replace gender with location
      favoriteTeam: "",
      favoriteTeamLogo: "",
      favoritePlayer: "",
      favoritePlayerPhoto: "",
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

  const handleSaveCard = () => {
    // Validation: Check if required fields are filled
    if (
      !newCard.name ||
      !newCard.age ||
      !newCard.location ||
      !newCard.favoriteTeam ||
      !newCard.favoritePlayer
    ) {
      alert("Please fill out all required fields before saving the card.");
      return; // Stop execution if validation fails
    }

    if (editingIndex !== null) {
      // Update the existing card at the specified index
      const updatedCards = [...fanCards];
      updatedCards[editingIndex] = { ...newCard }; // Create a new object to avoid mutating the state
      setFanCards(updatedCards);
    } else {
      // Add a new card if not editing
      setFanCards([...fanCards, { ...newCard }]); // Create a new object for the new card
    }

    // Reset state
    setNewCard({
      name: "",
      age: "",
      location: "",
      favoriteTeam: "",
      favoriteTeamLogo: "",
      favoriteTeamId: "",
      favoritePlayer: "",
      favoritePlayerPhoto: "",
      customImage: "",
    });
    setTeamSearchTerm(""); // Clear the team search query
    setSelectedTeamId(null); // Clear the selected team ID
    setPlayers([]); // Clear the players list
    setIsModalOpen(false); // Close the modal
    setEditingIndex(null); // Reset editing index
  };

  const handleEditCard = (index) => {
    const cardToEdit = fanCards[index];
    setNewCard(cardToEdit);
    setEditingIndex(index);
    setIsModalOpen(true);
    setTeamSearchTerm(cardToEdit.favoriteTeam);
    setSelectedTeamId(cardToEdit.favoriteTeamId); // Set team ID to fetch players
  };

  const handleDeleteCard = (index) => {
    const updatedCards = fanCards.filter((_, i) => i !== index);
    setFanCards(updatedCards);
  };

  //pre fills info from signup into
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) {
      const defaultCard = {
        name: storedUser.name || storedUser.username,
        age: storedUser.age || "",
        location: storedUser.location || "",
        favoriteTeam: "",
        favoriteTeamLogo: "",
        favoriteTeamId: "",
        favoritePlayer: "",
        favoritePlayerPhoto: "",
        customImage: storedUser.customImage || "",
      };

      // Set the newcard
      setNewCard(defaultCard);

      // add to fanCards so it shows
      setFanCards([defaultCard]);
    }
  }, []);

  return (
    <>
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 15px",
          backgroundColor: "red",
          color: "#red",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        Logout
      </button>
      <header>Soccer Fan Cards</header>
      <div className="card-container">
        {fanCards.map((card, index) => (
          <div
            className="fan-cards"
            key={index}
            ref={(el) => (cardRefs.current[index] = el)} //assign reference
          >
            <img
              src={card.customImage || defaultImage} // Use custom image if available
              alt="fan-card"
              style={{ width: "100%" }}
            />
            <h1>{card.name}</h1>
            <p>Age: {card.age}</p>
            <p>Location: {card.location}</p>
            <p style={{ textAlign: "center" }}>
              Favorite Team: {card.favoriteTeam}
              {card.favoriteTeamLogo && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={card.favoriteTeamLogo}
                    alt={card.favoriteTeam}
                    crossOrigin="anonymous"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      marginTop: "5px",
                    }}
                  />
                </div>
              )}
            </p>
            <p>Favorite Player: {card.favoritePlayer}</p>
            {card.favoritePlayer && (
              <img
                src={card.favoritePlayerPhoto} // Add the player's photo
                alt={card.favoritePlayer}
                crossOrigin="anonymous"
                style={{
                  width: "80px", // Set size for the player's photo
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginTop: "10px",
                }}
              />
            )}
            <div className="no-print" style={{ marginTop: "10px" }}>
              <button
                onClick={() => downloadCard(cardRefs.current[index], card.name)}
              >
                <FaDownload size={20} />
              </button>
              <button
                onClick={() => handleEditCard(index)}
                style={{ marginLeft: "8px" }}
              >
                <FaEdit size={20} />
              </button>
              <button
                onClick={() => handleDeleteCard(index)}
                style={{ marginLeft: "8px" }}
              >
                <FaTrash size={20} />
              </button>
            </div>
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
            <h1>{editingIndex !== null ? "Edit Card" : "Add New Card"}</h1>
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
              name="location" // Change name to location
              placeholder="City"
              value={newCard.location} // Update value to location
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
                    favoriteTeamLogo: selectedTeam.team.logo,
                    favoriteTeamId: selectedTeam.team.id, // Store team ID
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
            <select
              name="favoritePlayer"
              value={newCard.favoritePlayer}
              onChange={(e) => {
                const selectedPlayerName = e.target.value;
                const selectedOption = e.target.options[e.target.selectedIndex];
                const selectedPlayerPhoto =
                  selectedOption.getAttribute("data-image");
                setNewCard({
                  ...newCard,
                  favoritePlayer: selectedPlayerName,
                  favoritePlayerPhoto: selectedPlayerPhoto, // Save player photo
                });
              }}
              onMouseMove={(e) => handleTooltip(e, "player")}
              onMouseLeave={hideTooltip}
            >
              <option value="">Select Favorite Player</option>
              {players.length === 0 && (
                <option disabled>No Players found</option>
              )}
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
            <input type="file" accept="image/*" onChange={handleImageUpload} />

            <div className="button-group">
              <button onClick={handleSaveCard}>
                {editingIndex !== null ? "Save Changes" : "Add Card"}
              </button>
              <button
                className="close-button"
                onClick={() => {
                  setIsModalOpen(false); // Close the modal
                  setEditingIndex(null); // Reset the editing index
                  setNewCard({
                    name: "",
                    age: "",
                    location: "",
                    favoriteTeam: "",
                    favoriteTeamLogo: "",
                    favoriteTeamId: "",
                    favoritePlayer: "",
                    favoritePlayerPhoto: "",
                    customImage: "",
                  }); // Reset the newCard state
                  setTeamSearchTerm(""); // Clear the team search query
                  setSelectedTeamId(null); // Clear the selected team ID
                  setPlayers([]); // Clear the players list
                }}
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

export default FanCard;
