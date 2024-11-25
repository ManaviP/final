import React, { useState } from 'react';

export default function MovieForm({ addMovie }) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && time) {
      addMovie(name, time);
      setName('');
      setTime('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Movie Name"
        className="p-2 m-2 border"
      />
      <input
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="p-2 m-2 border"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 m-2">
        Add Movie
      </button>
    </form>
  );
}
