import React from 'react';
import './App.css';
import FaceARNavbar from './FaceARNavbar';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Development from './Demo';
import Footer from './Footer';
import About from './About';
import { LensConfig, lensConfigs } from './constant/lensConfig';

const lensIDs = {
  basic: "2317d687-d5ce-4ccf-95ce-06ab74358a93",
  jumpGame: "0b504864-00df-4321-8fdf-0c86bd5bcfaa",
  timer: "623ea02f-ff58-48ce-a42d-badce1fecdb6",
  lip: "00120037-aec6-4798-8212-ffe013f704e8",
  eyeAndBrow: "54c0c4ce-d0d0-4cb7-9845-e0a322dc8249"
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
          <Route path="/demo/basic" element={<Development key="basic" config={lensConfigs.basic}/>} />
          <Route path="/demo/jump-game" element={<Development key="jump-game" config={lensConfigs.jumpGame}/>} />
          <Route path="/demo/timer" element={<Development key="timer" config={lensConfigs.timer}/>} />
          <Route path="/demo/lip" element={<Development key="lip" config={lensConfigs.lip}/>} />
          <Route path="/demo/eye-and-brow" element={<Development key="eye-and-brow" config={lensConfigs.eyeAndBrow}/>} />
        </Routes>
        <div className='p-4 mb-4'></div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
