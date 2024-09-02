import React from 'react';
import Board from './components/board/board';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Board />
      <p>Developer Note: All you can do right now is click on the properties and "purchase" them :)</p>
    </div>
  );
}

export default App;
