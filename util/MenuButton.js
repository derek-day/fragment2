'use client'; // Only needed if you're using the App Router

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For Pages Router
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useParams } from "next/navigation";
import { adventurePages } from '@/app/adventure/pages';

export default function MenuButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { pageId } = useParams();
  const page = adventurePages[pageId];

  const handleNavigation = (path) => {
    setOpen(false);
    router.push(path);
  };

      useEffect(() => {
          if (!page) router.push("/adventure/page_1");
      }, [page]);
  
      if (!page) return null;
  

    const handleLogout = async () => {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, { currentPage: pageId });
          await signOut(auth);
          router.push("/");
        }
      };
  

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen(!open)} style={{ padding: '10px 15px' }} className="choice-button">
        ☰ Menu
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          border: '1px solid #ccc',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: '0px' }}>
            <li>
              <button onClick={() => handleNavigation('/')} style={menuItemStyle}>Home</button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/stats')} style={menuItemStyle}>Stats</button>
            </li>
            <li>
              <button onClick={handleLogout} style={menuItemStyle}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

const menuItemStyle = {
  //backgroundColor: 'rgba(9, 9, 19, 0.8)',
  background: 'rgba(9, 9, 19, 0.8)',
  border: '1px solid white',
  padding: '8px 12px',
  width: '100%',
  textAlign: 'left',
  fontFamily: '"ivypresto-headline", serif',
  fontWeight: 300,
  fontStyle: 'normal',
  letterSpacing: '0.5px',
  cursor: 'pointer'
};
