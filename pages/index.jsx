import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home({ user }) {
  const [movies, setMovies] = useState([]);
  const [movieName, setMovieName] = useState('');
  const [movieTime, setMovieTime] = useState('');
  const [movieImage, setMovieImage] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null); // Track selected movie for tickets

  useEffect(() => {
    if (user) {
      fetchMovies();
    }
  }, [user]);

  // Fetch movies from Supabase
  const fetchMovies = async () => {
    try {
      const { data, error } = await supabase.from('movies').select('*');
      if (error) throw error;
      setMovies(data.map((movie) => ({ ...movie, tickets: [] }))); // Ensure tickets is always an array
    } catch (error) {
      console.error('Error fetching movies:', error.message);
    }
  };

  // Add movie to Supabase
  const addMovie = async () => {
    const newMovie = {
      name: movieName,
      time: movieTime,
      image: movieImage,
      locked: false,
    };

    try {
      const { data, error } = await supabase.from('movies').insert([newMovie]).select();
      if (error) throw error;
      setMovies((prev) => [...prev, ...data.map((movie) => ({ ...movie, tickets: [] }))]);
      setMovieName('');
      setMovieTime('');
      setMovieImage('');
    } catch (error) {
      console.error('Error adding movie:', error.message);
    }
  };

  // Fetch tickets for the selected movie
  const fetchTickets = async (movieId) => {
    try {
      const { data, error } = await supabase.from('tickets').select('*').eq('movie_id', movieId);
      if (error) throw error;

      setMovies((prev) =>
        prev.map((movie) =>
          movie.id === movieId ? { ...movie, tickets: data || [] } : movie
        )
      );
    } catch (error) {
      console.error('Error fetching tickets:', error.message);
    }
  };

  // Add ticket to Supabase
  const addTicket = async (ticketData) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert([{ ...ticketData, movie_id: selectedMovieId }])
        .select();
      if (error) throw error;

      fetchTickets(selectedMovieId);
    } catch (error) {
      console.error('Error adding ticket:', error.message);
    }
  };

  // Delete ticket from Supabase
  const deleteTicket = async (ticketId) => {
    try {
      const { error } = await supabase.from('tickets').delete().eq('id', ticketId);
      if (error) throw error;

      fetchTickets(selectedMovieId);
    } catch (error) {
      console.error('Error deleting ticket:', error.message);
    }
  };

  // Send email reminders
  const sendEmail = async () => {
    const selectedMovie = movies.find((movie) => movie.id === selectedMovieId);
    if (!selectedMovie) {
      alert('No movie selected');
      return;
    }

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieName: selectedMovie.name,
          tickets: selectedMovie.tickets,
        }),
      });

      if (response.ok) {
        alert('Emails sent successfully');
      } else {
        const error = await response.json();
        console.error('Error sending emails:', error.message);
        alert('Failed to send emails');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while sending emails.');
    }
  };

  if (!user) {
    return <p className="text-center mt-20">Redirecting to login...</p>;
  }

  return (
    <div className="min-h-screen ">
      {/* Main Content */}
      <main className="container mx-auto p-5">
        {/* Welcome Message */}
        <p className="text-center mb-5"> </p>

        {/* Movie Form */}
        <div className="mb-5">
          <input
            type="text"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            placeholder="Movie Name"
            className="p-2 m-2 border"
          />
          <input
            type="datetime-local"
            value={movieTime}
            onChange={(e) => setMovieTime(e.target.value)}
            className="p-2 m-2 border"
          />
          <input
            type="text"
            value={movieImage}
            onChange={(e) => setMovieImage(e.target.value)}
            placeholder="Movie Image URL"
            className="p-2 m-2 border"
          />
          <button
            onClick={addMovie}
            className="bg-blue-500 text-white p-2 m-2"
          >
            Add Movie
          </button>
        </div>

        {/* Movie List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className={`p-4 hover:shadow-black hover:shadow-md transition-shadow duration-300 cha rounded-lg shadow-md bg-white hover:scale-[95%] ${
                selectedMovieId === movie.id ? 'border-2 border-blue-500 ' : ''
              }`}
              onClick={() => {
                setSelectedMovieId(movie.id);
                fetchTickets(movie.id);
              }}
            >
              <img
                src={movie.image || 'https://via.placeholder.com/150'}
                alt={movie.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="font-bold mt-4">{movie.name}</h3>
              <p>{new Date(movie.time).toLocaleString()}</p>
              <p>{movie.tickets.length} Tickets</p>
            </div>
          ))}
        </div>

        {/* Tickets Section */}
        {selectedMovieId && (
          <div className="mt-5">
            <h2 className="text-xl font-bold mb-3">
              Tickets for: {movies.find((movie) => movie.id === selectedMovieId)?.name}
            </h2>
            <div>
              <input
                type="text"
                placeholder="Name"
                id="ticket-name"
                className="p-2 m-2 border"
              />
              <input
                type="email"
                placeholder="Email"
                id="ticket-email"
                className="p-2 m-2 border"
              />
              <input
                type="number"
                placeholder="Count"
                id="ticket-count"
                className="p-2 m-2 border"
              />
              <button
                onClick={() => {
                  const name = document.getElementById('ticket-name').value;
                  const email = document.getElementById('ticket-email').value;
                  const count = parseInt(document.getElementById('ticket-count').value, 10);
                  if (name && email && count > 0) {
                    addTicket({ name, email, count });
                  } else {
                    alert('Please fill all fields correctly.');
                  }
                }}
                className="bg-green-500 text-white p-2 m-2"
              >
                Add Ticket
              </button>
            </div>
            <table className="w-full mt-5 bg-white shadow-md rounded-lg border-collapse">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="p-3 border-r border-white">Name</th>
                  <th className="p-3 border-r border-white">Email</th>
                  <th className="p-3 border-r border-white">Count</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies
                  .find((movie) => movie.id === selectedMovieId)
                  ?.tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-t">
                      <td className="p-3 border-r border-gray-300">{ticket.name}</td>
                      <td className="p-3 border-r border-gray-300">{ticket.email}</td>
                      <td className="p-3 border-r border-gray-300">{ticket.count}</td>
                      <td className="p-3">
                        <button
                          onClick={() => deleteTicket(ticket.id)}
                          className="bg-red-500 text-white p-2 m-1"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <button
              onClick={sendEmail}
              className="mt-5 bg-blue-500 text-white p-3"
            >
              Send Email Reminders
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
