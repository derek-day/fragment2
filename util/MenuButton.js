'use client'; // Only needed if you're using the App Router

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For Pages Router
import { auth, db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useParams } from "next/navigation";
import { adventurePages } from '../app/adventure/pages';


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
    <div style={{ position: 'relative', display: 'inline-block', zIndex: 1 }}>
      <button onClick={() => setOpen(!open)} style={{ padding: '10px 15px' }} className="choice-button mb-4">
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
          {/* <ul style={{ listStyle: 'none', margin: 0, padding: '0px' }}>
            <li>
              <button onClick={() => handleNavigation('/')} style={menuItemStyle}>Resume</button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/')} style={menuItemStyle}>Character</button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/')} style={menuItemStyle}>Settings</button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/')} style={menuItemStyle}>Support</button>
            </li>
            <li>
              <button onClick={handleLogout} style={menuItemStyle}>Logout</button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/')} style={menuItemStyle}>Last Saved: {}</button>
            </li>
          </ul> */}

          {/* Inside of Character
          - Inventory
          - Skills/Talent Tree
          - Stats
          - Map

          Inside of Settings
          - 🔊 Audio: mute/unmute, volume sliders for music & sound effects.
          - 🎨 Theme / Accessibility: font size, contrast, dyslexia-friendly font, light/dark mode.
          - ⏩ Text Speed / Auto-Advance (if you add dialogue-like sequences).
          - 🌐 Language (if localized).

          Inside of Support
          - “How to Play” or tutorial recap.
          - Contact / feedback link.
          - Credits.

          Possible addins
          - Achievements
          - Journal (shows choices made and npc names/locations/images)
          - User Profiles */}

          <ul style={{ listStyle: 'none', margin: 0, padding: '0px', zIndex: 1000, position: 'relative' }}>
            <li>
              <button onClick={() => handleNavigation('/')} style={menuItemStyle}>Home</button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/stats')} style={menuItemStyle}>Stats</button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/stats')} style={menuItemStyle}>Data Packet</button>
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
