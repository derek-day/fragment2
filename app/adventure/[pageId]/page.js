"use client";
import { useParams } from "next/navigation";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import bgImage from "@/public/portal.png";
import { adventurePages } from "../pages";
// import transitionSound from "@/public/transition.mp3";


export default function AdventurePage() {
    const { pageId } = useParams();
    const router = useRouter();
    const page = adventurePages[pageId];
    const [selectedChoice, setSelectedChoice] = useState(null);
  
    useEffect(() => {
        if (!page) router.push("/adventure/page_1");
    }, [page]);

    if (!page) return null;


  return (
    <div className="min-h-screen bg-cover bg-center text-white p-6" style={{ backgroundImage: `url(${page.src})`}}>
      {/* <h1 className="text-3xl font-bold mb-4">{page.title}</h1> */}
      <div className="story-text">
        <div className="mb-6 space-y-2">
            {page.text.split("\n\n").map((para, idx) => (
            <p key={idx} className="text-lg">{para}</p>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        {page.choices.map((choice, index) => (
          <button
            key={index}
            className={`block w-full px-4 py-2 rounded hover:bg-blue-800 ${selectedChoice === choice ? 'bg-blue-700' : 'bg-blue-600'}`}
            onClick={() => setSelectedChoice(choice)}
          >
            {choice.label}
          </button>
        ))}

        {selectedChoice && (
          <button
            className="mt-4 bg-green-600 px-4 py-2 rounded hover:bg-green-800"
            onClick={() => router.push(`/adventure/${selectedChoice.next}`)}
          >
            Continue
          </button>
        )}
      </div>


      {/* <div className="space-y-4">
        {page.choices.map((choice, index) => (
          <button
            key={index}
            className="block w-full bg-blue-600 px-4 py-2 rounded hover:bg-blue-800"
            onClick={() => router.push(`/adventure/${choice.next}`)}
          >
            {choice.label}
          </button>
        ))}
      </div> */}
    </div>

  );
}
