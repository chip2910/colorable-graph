import './App.css';
import { useState } from 'react';

const path = (nodeKey, graphNodes, visited) => {
  visited.add(nodeKey);
  for (const v of graphNodes[nodeKey].directPaths.values()) {  
    if (!visited.has(v)) {
      path(v, graphNodes, visited);
    }
  }
}

const isConnected = (graphNodes) => {
  const graphNodeKeys = Object.keys(graphNodes);
  if (!graphNodeKeys.length) {
    return false;
  }
  const keyStart = graphNodeKeys[0];
  let visited = new Set();
  path(keyStart, graphNodes, visited);
  return visited.size === graphNodeKeys.length;
}

const isColorable = (graphNodes) => {
  if (!Object.keys(graphNodes).length) {
    return false;
  }
  const nodesColor = {};
  const red = 0;
  const blue = 1;
  for (const a in graphNodes) {
    const node = graphNodes[a];
    let takenColors = new Set();
    for (const v of node.directPaths.values()) {   
      if (nodesColor[v] !== undefined ) {
        takenColors.add(nodesColor[v]);
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
  const [graphIsColorable, setGraphIsColorable] = useState(false);

  const handleClear = () => {
    setGraphNodes({});
    setGraphSentence('');
  }

  const handleAnalyze = () => {
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
            directPaths: new Set(),
          }
        }
        if (j > 0) {
          nodes[pathNodes[j]].directPaths.add(pathNodes[j-1]);
          if (pathNodes[j] !== pathNodes[j-1]) {
            nodes[pathNodes[j-1]].directPaths.add(pathNodes[j]);
          }
        }
      }
    }

    setGraphNodes(nodes);

    if (isConnected(nodes)) {
      setGraphIsColorable(isColorable(nodes));
    } else {
      setGraphIsColorable(false);
    }
  }

  const handleSentenceChange = (event) => {
    setGraphSentence(event.target.value);
  };

  const nodeList = Object.keys(graphNodes).map((key) => {
    const links = Array.from(graphNodes[key].directPaths);
    return (
      <li key={key}><span className='infoRed'>{key}</span>: {links.join(', ')}</li>    
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
        <button id='analyze'
          onClick={handleAnalyze}
        >
          Analyze
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
            <h3>This graph is: <span className='infoRed'>{isConnected(graphNodes) ? 'connected' : 'not connected'}</span></h3>
          </div>
          <div>
            <h3>This graph is: <span className='infoRed'>{graphIsColorable ? 'red, blue colorable' : 'not colorable with red and blue colors'}</span></h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
