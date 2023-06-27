# PERSONAL NFT PORTFOLIO TRACKER


## HOW TO USE THE BLOCKSPAN API TO VISUALIZE NFT DATA

Blockspan is a leading provider of NFT API services, enabling developers to easily interact with the world of non-fungible tokens (NFTs). NFTs represent ownership of a unique item or piece of content on the blockchain. We can use Blockspan APIs to find NFT data, and in this tutorial we will use graphs to vizualize that data. 


## REQUIREMENTS:
- Node.js and npm installed on your system.
- Basic knowledge of React.js and chart.js
- Blockspan API key


## STEP 1: SET UP YOU REACT APPLICATION

First, you'll need to set up your React application. If you already have a React application set up, you can skip this step.

`npx create-react-app visualizing-nft-data` 
`cd visualizing-nft-data`

This will create a new React application named `visualizing-nft-data` and navigate into the new directory.


## STEP 2: INSTALL AXIOS AND CHART.JS

We'll be using Axios to send HTTP requests to the Blockspan API. Install it with the following command:

`npm install axios`

To create graphs, we will use the chart.js library. Install it with the following command:

`npm install chart.js`


## STEP 3: CREATE YOUR REACT COMPONENT

Next, you'll need to create a React component that uses the Blockspan API to fetch portfolio data. Create a new file in the `src` directory called `visualization.js` and include the following code:

```
import React, { useState } from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Pie} from 'react-chartjs-2';
import axios from 'axios'

ChartJS.register(ArcElement, Tooltip, Legend);

export function Visualization() {
  const [contractAddress, setcontractAddress] = useState('');
  const [blockchain, setBlockchain] = useState('eth-main');
  const [collection, setCollection] = useState(null)
  const [nfts, setnfts] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const getNFTs = async () => {
    setnfts(null)
    setCollection(null)
    setLoading(true)
    const url = `https://api.blockspan.com/v1/nfts/contract/${contractAddress}?chain=${blockchain}&page_size=25`;
    const headers = {
      accept: 'application/json',
      'X-API-KEY': 'YOUR_BLOCKSPAN_API_KEY',
    };

    try {
      const response = await axios.get(url, { headers });
      console.log('collection', response)
      console.log('nft array', response.data.results)
      setCollection(response)
      setnfts(response.data.results)
      setError(null);
      setLoading(false)
    } catch (error) {
      console.error(error);
      setError('No NFTs found on this chain in this contract address!');
      setCollection(null);
      setLoading(false)
    }
  };

  let tokenTypeData = null;
  if (nfts) {
    tokenTypeData = {
      labels: ['erc721', 'erc1155', 'null'],
      datasets: [
        {
          label: 'Token Type',
          data: [
            nfts.filter(nft => nft.token_type === 'erc721').length,
            nfts.filter(nft => nft.token_type === 'erc1155').length,
            nfts.filter(nft => nft.token_type === null).length
          ],
          backgroundColor: ['rgba(205, 205, 0, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 54, 54, 0.2)'],
          borderColor: ['rgba(205, 205, 0, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 54, 54, 1)'],
          borderWidth: 1
        }
      ]
    };
  }

  let photoData = null
  if (nfts) {
    photoData = {
      labels: ['Yes', 'No'],
      datasets: [
        {
          label: 'Contains an image?',
          data: [
            nfts.filter(nft => nft.cached_images !== null).length,
            nfts.filter(nft => nft.cached_images === null).length,
          ],
          backgroundColor: ['rgba(0, 128, 0, 0.2)', 'rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(0, 128, 0, 1)','rgba(255, 99, 132, 1)'],
          borderWidth: 1
        }
      ]
    };
  }

  let nameData = null
  if (nfts) {
    nameData = {
      labels: ['Named', 'Unnamed'],
      datasets: [
        {
          label: 'Contains a name?',
          data: [
            nfts.filter(nft => nft.token_name !== null).length,
            nfts.filter(nft => nft.token_name === null).length,
          ],
          backgroundColor: ['rgba(0, 128, 0, 0.2)', 'rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(0, 128, 0, 1)','rgba(255, 99, 132, 1)'],
          borderWidth: 1
        }
      ]
    };
  }

  const handleBlockchainChange = event => {
    setBlockchain(event.target.value);
  };

  return (
    <div>
      <h1 className="title">NFT Data Visualization</h1>
      <p className="message">
          Select a blockchain and input a contract address to see charts of NFT data.
      </p>
      <div className="inputContainer">
        <select name="blockchain"
          value={blockchain}
          onChange={handleBlockchainChange}>
          <option value="eth-main">eth-main</option>
          <option value="arbitrum-main">arbitrum-main</option>
          <option value="optimism-main">optimism-main</option>
          <option value="poly-main">poly-main</option>
          <option value="bsc-main">bsc-main</option>
          <option value="eth-goerli">eth-goerli</option>
        </select>
        <input type="text" placeholder="Contract Address"
            onChange={
                e => setcontractAddress(e.target.value)
            }/>
        <button onClick={getNFTs}>Get NFTs</button>
      </div>
      {loading && (
        <p className='message'>Loading...</p>
      )}
      {error && !loading &&(
        <p className='errorMessage'>Error: verify chain and contract address are valid</p>
      )}
      {collection && (
        <div>
          {nfts.length === 0 ? (
            <p className='errorMessage'>No NFTs found!</p>
          ) : (
            <p className='successMessage'>Found {nfts.length} NFTs!</p>
          )}
          <table className='tableContainer'>
            <thead>
              <th>Token Type</th>
              <th>NFT Contains Valid Image?</th>
              <th>NFT Contains Name?</th>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="chartContainer">
                    <Pie data={tokenTypeData} />
                  </div>
                </td>
                <td>
                  <div className="chartContainer">
                    <Pie data={photoData} />
                  </div>
                </td>
                <td>
                  <div className="chartContainer">
                    <Pie data={nameData} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

```

Remember to replace `YOUR_BLOCKSPAN_API_KEY` with your actual Blockspan API key.


## STEP 4: UPDATING THE STYLES WITHIN CSS FILE

To enhance the user interface in the browser, replace all code in the App.css file with the following:

```
.App {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
}

.title {
  margin-top: 20px;
  margin-bottom: 0;
  text-align: center;
}

.errorMessage {
  text-align: center;
  color: red;
  font-weight: bold;
}

.successMessage {
  text-align: center;
  color: green;
  font-weight: bold;
}

.message {
  text-align: center;
}

.image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.inputContainer {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.inputContainer input {
  padding: 10px;
  font-size: 1em;
  width: 200px;
}

.inputContainer button {
  padding: 10px;
  font-size: 1em;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
}

.inputContainer button:hover {
  background-color: #0056b3;
}

.imageContainer {
  display: flex;
  justify-content: center;
  width: 100%; 
}

.imageContainer img {
  width: 100%; 
  max-width: 500px;
  height: auto; 
}
.nftData {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.nftData .image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nftData h2 {
  margin: 10px 0;
}

.nftData p {
  font-size: 1.2em;
  font-weight: bold;
}

td {
  padding: 10px;
  text-align: left;
}

th {
  padding: 10px;
  text-align: center;
}

.tableContainer {
  margin: 0 auto;
}

.tableContainer {
  width: 100%;
  border-collapse: collapse;
}

.chartContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px; /* Adjust the height as needed */
}

```

## STEP 5: INTEGRATING COMPONENTS IN THE APP

Finally, let's use the `Visualization` function in our main `App` component.

Open App.js and modify it as follows:

```
import React from 'react';
import './App.css';
import { Visualization } from './visualization';

function App() {
  return (
    <div className="App">
      {Visualization()}
    </div>
  );
}

export default App;
```

Now, start the app with the following command:

`npm start`

You should now see the following:

- A drop down menu to select a blockchain
- A text box for contract address
- A get nfts button

Input the contract address you wish to see the data for, and click the get nfts button. You should then see three pie charts for token type, nft image, and nft name. 

This wraps up our guide to creating an nft data visualization tool using the Blockspan API and React.js. Happy coding!

## CONCLUSION

Congratulations! You've just built a simple yet powerful NFT data visualization tool using the Blockspan API and React.js. As you've seen, the Blockspan API is intuitive to use and provides detailed and accurate information, making it a perfect choice for this kind of application. This tutorial is just a starting point - there are many ways you can expand and improve your tool. For example, you could add more error checking, improve the UI, or retrieve more NFT data.

As the world of NFTs continues to grow and evolve, tools like this will become increasingly important. Whether you're an NFT enthusiast, a developer, or a startup, understanding NFTs is a valuable skill. We hope you found this tutorial helpful.