import { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('');
  const [sellers, _] = useState([]);

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMsg(data.message));


    fetch('/api/seller')
      .then(res => res.json())
      .then(({sellers}) => setSellers(sellers))
  }, []);

  return (
    <div>
      {
        sellers && sellers.map(seller=><div>{seller.id}</div>)
      }
    </div>
    );
}

export default App;
