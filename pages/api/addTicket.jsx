import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { movieId, name, email, count } = req.body;

    const { data, error } = await supabase
      .from('tickets')
      .insert([
        {
          movie_id: movieId,
          name,
          email,
          count,
        },
      ])
      .single();

    if (error) {
      return res.status(500).json({ message: 'Error adding ticket', error });
    }

    res.status(200).json({ message: 'Ticket added successfully', data });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
