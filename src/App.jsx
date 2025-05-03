import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./SignupForm";
import FanCardApp from "./FanCard";
import LoginForm from "./LoginForm";

//Routing for app

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupForm />} /> {/*Default route */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/fan-cards" element={<FanCardApp />} /> {/* Main */}
      </Routes>
    </Router>
  );
}

export default App;
