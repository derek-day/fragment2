"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, BookOpen, LogOut, Settings } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      action: () => router.push("/dashboard"),
      color: "text-blue-400"
    },
    {
      icon: BookOpen,
      label: "Journal",
      action: () => router.push("/journal"),
      color: "text-purple-400"
    },
    {
      icon: Settings,
      label: "Settings",
      action: () => router.push("/settings"),
      color: "text-gray-400"
    },
    {
      icon: LogOut,
      label: "Logout",
      action: handleLogout,
      color: "text-red-400"
    }
  ];

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotate: -180
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const menuVariants = {
    hidden: { 
      opacity: 0,
      y: -20,
      scale: 0.8
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -20 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50" style={{ top: 10 }}>
      {/* Menu Toggle Button */}
      <motion.button
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-900 bg-opacity-90 backdrop-blur-sm text-white p-3  shadow-2xl border-2 border-gray-700 hover:border-gray-600 transition-colors"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.div>
      </motion.button>

      {/* Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-16 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-md shadow-2xl border-2 border-gray-700 overflow-hidden"
            style={{ minWidth: "200px" }}
          >
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                variants={itemVariants}
                whileHover={{ 
                  x: 5, 
                  backgroundColor: "rgba(55, 65, 81, 0.5)",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
              >
                <item.icon size={18} className={item.color} />
                <span className="text-white font-medium">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm -z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
}










// 'use client'; // Only needed if you're using the App Router

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // For Pages Router
// import { auth, db } from "../lib/firebase";
// import { doc, updateDoc } from "firebase/firestore";
// import { signOut } from "firebase/auth";
// import { useParams } from "next/navigation";
// import { adventurePages } from '../app/adventure/pages';
// //import Journal from '../components/Journal';


// export default function MenuButton() {
//   const [open, setOpen] = useState(false);
//   const router = useRouter();
//   const { pageId } = useParams();
//   const page = adventurePages[pageId];

//   const handleNavigation = (path) => {
//     setOpen(false);
//     router.push(path);
//   };

//       useEffect(() => {
//           if (!page) router.push("/adventure/page_1");
//       }, [page]);
  
//       if (!page) return null;
  

//     const handleLogout = async () => {
//         const user = auth.currentUser;
//         if (user) {
//           const userRef = doc(db, "users", user.uid);
//           await updateDoc(userRef, { currentPage: pageId });
//           await signOut(auth);
//           router.push("/");
//         }
//       };
  


//   return (
//     <div style={{ position: 'relative', display: 'inline-block', zIndex: 1 }}>
//       <button onClick={() => setOpen(!open)} style={{ padding: '10px 15px' }} className="choice-button mb-4">
//         ☰ Menu
//       </button>

//       {open && (
//         <div style={{
//           position: 'absolute',
//           top: '100%',
//           right: 0,
//           border: '1px solid #ccc',
//           boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//           zIndex: 1000
//         }}>
//           {/* <ul style={{ listStyle: 'none', margin: 0, padding: '0px' }}>
//             <li>
//               <button onClick={() => handleNavigation('/')} style={menuItemStyle}>Resume</button>
//             </li>
//             <li>
//               <button onClick={() => handleNavigation('/')} style={menuItemStyle}>Character</button>
//             </li>
//             <li>
//               <button onClick={() => handleNavigation('/')} style={menuItemStyle}>Settings</button>
//             </li>
//             <li>
//               <button onClick={() => handleNavigation('/')} style={menuItemStyle}>Support</button>
//             </li>
//             <li>
//               <button onClick={handleLogout} style={menuItemStyle}>Logout</button>
//             </li>
//             <li>
//               <button onClick={() => handleNavigation('/')} style={menuItemStyle}>Last Saved: {}</button>
//             </li>
//           </ul> */}

//           {/* Inside of Character
//           - Inventory
//           - Skills/Talent Tree
//           - Stats
//           - Map

//           Inside of Settings
//           - 🔊 Audio: mute/unmute, volume sliders for music & sound effects.
//           - 🎨 Theme / Accessibility: font size, contrast, dyslexia-friendly font, light/dark mode.
//           - ⏩ Text Speed / Auto-Advance (if you add dialogue-like sequences).
//           - 🌐 Language (if localized).

//           Inside of Support
//           - “How to Play” or tutorial recap.
//           - Contact / feedback link.
//           - Credits.

//           Possible addins
//           - Achievements
//           - Journal (shows choices made and npc names/locations/images)
//           - User Profiles */}

//           <ul style={{ listStyle: 'none', margin: 0, padding: '0px', zIndex: 1000, position: 'relative' }}>
//             <li>
//               <button onClick={() => handleNavigation('/')} style={menuItemStyle}>Home</button>
//             </li>
//             <li>
//               <button onClick={() => handleNavigation('/stats')} style={menuItemStyle}>Stats</button>
//             </li>
//             <li>
//               <button onClick={() => handleNavigation('/stats')} style={menuItemStyle}>Data Packet</button>
//             </li>
//             <li>
//               <button onClick={() => handleNavigation('/journal')} style={menuItemStyle}>Journal</button>
//             </li>
//             <li>
//               <button onClick={handleLogout} style={menuItemStyle}>Logout</button>
//             </li>
//           </ul>
//         </div>
//       )}
//     </div>

    
//   );
// }

// const menuItemStyle = {
//   //backgroundColor: 'rgba(9, 9, 19, 0.8)',
//   background: 'rgba(9, 9, 19, 0.8)',
//   border: '1px solid white',
//   padding: '8px 12px',
//   width: '100%',
//   textAlign: 'left',
//   fontFamily: '"ivypresto-headline", serif',
//   fontWeight: 300,
//   fontStyle: 'normal',
//   letterSpacing: '0.5px',
//   cursor: 'pointer'
// };
