'use client';

import React, { useState } from 'react';

interface ToggleProps {
  callback? : () => void
}

export default function Toggle({
  callback = () => {}
} : ToggleProps){

  const [isOn, setIsOn] = useState<boolean>(false);

  const handleToggle = () => {
    setIsOn(prev => !prev);
    callback()
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-4 py-2 rounded-full cursor-pointer transition duration-300 ${
        isOn ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
      }`}
    >
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
};

