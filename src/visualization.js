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
    const url = `http://localhost:8080/v1/nfts/contract/${contractAddress}?chain=${blockchain}&page_size=25`;
    const headers = {
      accept: 'application/json',
      'X-API-KEY': '2jhzbqIWanB8puiqySBIWJVf6Ovp7oPW',
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
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}