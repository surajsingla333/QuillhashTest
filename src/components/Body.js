import React, { useState, useEffect } from 'react';
import PriceCard from './PriceCard';

import { XAxis, YAxis, LineChart, Line, CartesianGrid } from 'recharts';

const Body = () => {

  const [btcPrice, setBtcPrice] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  const [minPrice, setMinPrice] = useState(9000);
  const [maxPrice, setMaxPrice] = useState(9100);

  var btcs = new WebSocket('wss://ws-feed.pro.coinbase.com');

  btcs.onopen = function () {
    btcs.send(JSON.stringify({ "type": "subscribe", "product_ids": ["BTC-USD"], "channels": ["ticker"] }));
  }

  useEffect(() => {

    btcs.onmessage = function (onmsg) {
      var response = JSON.parse(onmsg.data);

      const price = response.price === undefined ? 0 : response.price;
      const time = response.time;

      const data = { time: time, price: price };

      if (price !== 0) {
        setBtcPrice(currData => [...currData, data]);
        if (price <= minPrice) {
          setMinPrice(price - 25);
        }
        if (price >= maxPrice) {
          setMaxPrice(price + 25);
        }
      }
      setCurrentPrice(price);

    }

  }, []);

  var component = btcPrice.slice(btcPrice.length > 10 ? btcPrice.length - 10 : 0).map((obj, index) => {
    const { time, price } = obj;
    return (
      <tr key={index}>
        <td>{time}</td>
        <td>{price}</td>
      </tr>
    )
  })

  return (
    <div className="container-fluid">
      <div className="row">

        <div className="col-6">
          <div className="row-12 mb-3">
            <div className="card-deck custom-card-deck">
              <PriceCard header="Bitcoin(BTC)" src={'/bitcoin.png'} alt="fireSpot" label="(Price in USD)" value={currentPrice} />
            </div>
          </div>
          <div className="row-12">
            <div className="card custom-card mb-5 mb-xs-4">
              <div className="card-body">
                <LineChart width={500} height={300} data={btcPrice}>
                  <XAxis dataKey="time" />
                  <YAxis domain={[minPrice, maxPrice]} />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" />
                </LineChart>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6">
          <table className="table table-bordered">
            <thead className="table-primary">
              <tr>
                <th scope="col">Time (in UTC)</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {component}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  )
}


export default Body;
