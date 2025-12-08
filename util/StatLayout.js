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
  const user = auth.currentUser;
  const characterName = user?.characterName || "???";
  const className = user?.className || "???";

  const handleNavigation = (path) => {
    setOpen(false);
    router.push(path);
  };

      useEffect(() => {
          if (!page) router.push("/adventure/page_1");
      }, [page]);
  
      if (!page) return null;

  return (
    <div style={statStyle}>
      <h2>Name: {characterName}</h2>
      <h2>Class: {className}</h2>
    </div>
    
  );
}

const statStyle = {
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
  position: 'relative',
  display: 'flex',
  zIndex: 1
};
