"use client";
import { useParams } from "next/navigation";
// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import bgImage from "@/public/portal.png";
// import transitionSound from "@/public/transition.mp3";


export default function AdventurePage() {
  const { pageId } = useParams();

    // useEffect(() => {
    //   const audio = new Audio(transitionSound);
    //   audio.play();
  
    //   const unsub = onAuthStateChanged(auth, (u) => {
    //     if (u) {
    //       setUser(u);
    //       updateDoc(doc(db, "users", u.uid), {
    //         currentPage: pageId,
    //       });
    //     } else {
    //       router.push("/");
    //     }
    //   });
  
    //   return () => unsub();
    // }, [pageId]);
  
    // Fake choices
    const choices = {
      page_1: ["page_2", "page_3"],
      page_2: ["page_4"],
      page_3: ["page_5"]
    };
  

  return (
    // <div className="min-h-screen flex flex-col justify-center items-center text-white bg-black">
    //   <h1 className="text-4xl font-bold mb-4">You are on {pageId}</h1>
    //   <p className="text-lg">Adventure continues...</p>
    // </div>


    <div
      className="min-h-screen bg-cover bg-center text-white p-6"
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
      <h1 className="text-3xl font-bold mb-4">You are on {pageId}</h1>
      <p className="mb-4">Choose your next step:</p>
      <div className="flex flex-col gap-3">
        {(choices[pageId] || []).map((choice) => (
          <button
            key={choice}
            onClick={() => router.push(`/adventure/${choice}`)}
            className="bg-black bg-opacity-50 p-4 rounded hover:bg-opacity-70"
          >
            Go to {choice}
          </button>
        ))}
      </div>
    </div>

  );
}
