import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [coins, setCoins] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [dailyBonus, setDailyBonus] = useState(false);

  useEffect(() => {
    const lastClaimed = localStorage.getItem('lastClaimed');
    if (lastClaimed && (Date.now() - new Date(lastClaimed)) > 86400000) {
      setDailyBonus(true);
    }
  }, []);

  const mineCoins = () => {
    setCoins(coins + clickPower);
  };

  const upgradeClickPower = () => {
    if (coins >= 100) {
      setCoins(coins - 100);
      setClickPower(clickPower + 1);
    }
  };

  const claimDailyBonus = () => {
    if (dailyBonus) {
      setCoins(coins + 50);
      setDailyBonus(false);
      localStorage.setItem('lastClaimed', new Date());
    }
  };

  return (
    <div className="container mx-auto text-center p-4">
      <h1 className="text-4xl font-bold my-4">Idle Mining Game</h1>
      <div className="my-4">
        <p className="text-2xl">Coins: {coins}</p>
        <img
          src="https://pngimg.com/uploads/coin/coin_PNG36871.png" // ganti dengan URL gambar sebenarnya
          alt="Mine"
          onClick={mineCoins}
          className="w-32 h-32 mx-auto cursor-pointer"
        />
      </div>
      <div className="my-4">
        <p>Click Power: {clickPower}</p>
        <button onClick={upgradeClickPower} className="btn btn-secondary mt-4">Upgrade Click Power (100 coins)</button>
      </div>
      <div className="my-4">
        {dailyBonus ? <button onClick={claimDailyBonus} className="btn btn-success mt-4">Claim Daily Bonus</button> : <p>Daily bonus claimed!</p>}
      </div>
    </div>
  );
}

export default App;