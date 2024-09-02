import React from 'react';
import Tile from './components/tile';
import Board from './components/board/board';
import { Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Board></Board>
    </div>
  );
}

export default App;
