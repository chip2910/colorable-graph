import './App.css';
import { useState } from 'react';

const isConnected = (nodes) => {
  const graphNodeKeys = Object.keys(nodes);
  if (!graphNodeKeys.length) {
    return;
  }
  const keyStart = graphNodeKeys[0];
  let visited = new Set();
  path(keyStart, nodes, visited);
  return visited.size === graphNodeKeys.length;
}

const path = (nodeKey, nodes, visited) => {
  visited.add(nodeKey);
  for (let i = 0; i <  nodes[nodeKey].directPaths.length; i++) {
    if (!visited.has(nodes[nodeKey].directPaths[i])) {
      path(nodes[nodeKey].directPaths[i], nodes, visited);
    }
  }
}


const isColorable = (nodes) => {
  if (!Object.keys(nodes).length) {
    return;
  }
  const nodesColor = {};
  const red = 0;
  const blue = 1;
  for (const a in nodes) {
    const node = nodes[a];
    let takenColors = new Set();
    for (let i=0; i < node.directPaths.length; i++) {
      if (nodesColor[node.directPaths[i]] !== undefined ) {
        takenColors.add(nodesColor[node.directPaths[i]]);
      } 
    }
    if (!takenColors.has(red)) {
      nodesColor[a] = red;
    } else if(!takenColors.has(blue)) {
      nodesColor[a] = blue;
    } else {
      return false;
    }
  }
  return true;
};


function App() {
  const [graphSentence, setGraphSentence] = useState();
  const [graphNodes, setGraphNodes] = useState({});
  const [isGraphColorable, setIsGraphColorable] = useState();
  const [isGraphConnected, setIsGraphConnected] = useState();

  const handleClear = () => {
    setGraphNodes({});
    setGraphSentence('');
  }

  const handleClick = () => {
    if (!graphSentence) {
      return;
    }
    const nodes = {};
    let pathNodes = [];
    const paths = graphSentence.split(/,|\n/);

    for (let i = 0; i < paths.length; i++) {
      pathNodes = paths[i].split('-');
      for (let j = 0; j < pathNodes.length; j++) {
        pathNodes[j] = pathNodes[j].trim();
        if (pathNodes[j] === "") {
          continue;
        }
        if (!nodes[pathNodes[j]]) {
          nodes[pathNodes[j]] = {
            directPaths: [],
          }
        }
        if (j > 0) {
          nodes[pathNodes[j]].directPaths.push(pathNodes[j-1]);
          if (pathNodes[j] !== pathNodes[j-1]) {
            nodes[pathNodes[j-1]].directPaths.push(pathNodes[j]);
          }
        }
      }
    }

    setGraphNodes(nodes);
    setIsGraphColorable(isColorable(nodes));
    setIsGraphConnected(isConnected(nodes));
  }

  const handleSentenceChange = (event) => {
    setGraphSentence(event.target.value);
  };

  const nodeList = Object.keys(graphNodes).map((key) => {
    return (
      <li key={key}><span className='infoRed'>{key}</span>: {graphNodes[key].directPaths.join(', ')}</li>    
    );
  });

  const nrNodes = Object.keys(graphNodes).length;

  return (
    <div className="App">
      <textarea
        className="App-textarea"
        onChange={handleSentenceChange}
        value={graphSentence}
      />
      <div>
        <button id='analize'
          onClick={handleClick}
        >
          Analize
        </button>
        <button id='clear'
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
      {nrNodes > 0 && (
        <div className='Result'>
          <div>
            <h3>These are the graph nodes and their links:</h3>
            <ul>
              {nodeList}
            </ul> 
          </div>
          <div>
            <h3>This graph is: <span className='infoRed'>{isGraphConnected ? 'connected' : 'not connected'}</span></h3>
          </div>
          <div>
            <h3>This graph is: <span className='infoRed'>{isGraphColorable ? 'red, blue colorable' : 'not colorable with red and blue colors'}</span></h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
