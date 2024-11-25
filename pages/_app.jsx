import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Login from '../components/Login';
import Signup from '../components/Signup';


function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    fetchUser();

    // Correctly getting the unsubscribe function from onAuthStateChange
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    // Ensure to return the unsubscribe function
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const renderContent = () => {
    if (user) {
      return <Component {...pageProps} user={user} />; // Pass user as prop to the page component
    }
    return showSignup ? (
      <Signup onAuthSuccess={() => setShowSignup(false)} />
    ) : (
      <Login onAuthSuccess={() => setShowSignup(false)} />
    );
  };

  return (
    <>
      <Header />
      <main>
        {renderContent()}
      </main>
      
      <Footer />
    </>
  );
}

export default MyApp;
