import React from 'react';

export default function TicketForm({ movieId, addTicket }) {
  return (
    <div>
      <input type="text" placeholder="Name" id={`name-${movieId}`} className="p-2 m-2 border" />
      <input type="email" placeholder="Email" id={`email-${movieId}`} className="p-2 m-2 border" />
      <input type="number" placeholder="Count" id={`count-${movieId}`} className="p-2 m-2 border" />
      <button onClick={addTicket} className="bg-green-500 text-white p-2 m-2">
        Add Ticket
      </button>
    </div>
  );
}
