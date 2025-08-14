import React from 'react';
import './App.css';
import FaceARNavbar from './FaceARNavbar';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Development from './Demo';
import Footer from './Footer';
import About from './About';

const lensIDs = {
  basic: "2317d687-d5ce-4ccf-95ce-06ab74358a93",
  jumpGame: "40476bf8-01c0-45d9-b082-74392206e5e2",
  timer: "623ea02f-ff58-48ce-a42d-badce1fecdb6"
};

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <FaceARNavbar />
        <div className='p-4 mb-4'></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/demo/basic" element={<Development lensID={lensIDs.basic}/>} />
          <Route path="/demo/jump-game" element={<Development lensID={lensIDs.jumpGame}/>} />
          <Route path="/demo/timer" element={<Development lensID={lensIDs.timer}/>} />
        </Routes>
        <div className='p-4 mb-4'></div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
