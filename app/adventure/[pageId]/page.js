"use client";
import { useParams } from "next/navigation";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import bgImage from "@/public/portal.png";
import { adventurePages } from "../pages";
// import transitionSound from "@/public/transition.mp3";
import MenuButton from "@/util/MenuButton";


export default function AdventurePage() {
    const { pageId } = useParams();
    const router = useRouter();
    const page = adventurePages[pageId];
    const [selectedChoice, setSelectedChoice] = useState(null);
  
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

    function handleContinue() {
      if (selectedChoice) {
        router.push(`/adventure/${selectedChoice.next}`);
        setSelectedChoice(null);
      } else if (page.next) {
        router.push(`/adventure/${page.next}`);
      }
    }

    useEffect(() => {
      if (page?.title) {
        document.title = page.title + " | The Fragment Protocol";
      }
    }, [page]);



  return (      
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white p-6" style={{ backgroundImage: `url(${page.src})`}}>
      <MenuButton />
      {/* <button onClick={handleLogout} className="bg-red-600 px-3 py-1 mb-5 rounded hover:bg-red-800">Logout</button> */}

      {/* <h1 className="text-3xl font-bold mb-4">{page.title}</h1> */}
      <div className="story-text p-2 mb-6">
        <div className="space-y-2 m-2">
            {page.text.split("\n\n").map((para, idx) => (
            <p key={idx} className="text-base">{para}</p>
            ))}
        </div>
      </div>

      <div className="space-y-4">

      {page.choices &&
        page.choices.map((choice, i) => (
          <button
            key={i}
            className={`block choice-button w-64 px-4 py-2 rounded text-md ${
              selectedChoice?.next === choice.next
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedChoice(choice)}
          >
            {choice.label}
          </button>
        ))}

      {/* Continue button enabled only if a choice was picked */}
      {(page.choices || page.next) && (
        <button
          className={`mt-4 float-right bg-green-600 px-4 py-2 rounded ${
            selectedChoice || page.next ? "bg-green-600 text-white hover:bg-green-800" : "bg-gray-400 text-gray-700"
          }`}
          onClick={handleContinue}
          disabled={!selectedChoice && !page.next}
        >
          Continue
        </button>
      )}



        {/* {page.choices.map((choice, index) => (
          <button
            key={index}
            className={`block choice-button w-64 px-4 py-2 rounded text-md ${selectedChoice === choice ? 'selected-choice' : 'bg-blue-600'}`}
            onClick={() => setSelectedChoice(choice)}
          >
            {choice.label}
          </button>
        ))}

        {selectedChoice && (
          <button
            className="mt-4 float-right bg-green-600 px-4 py-2 rounded hover:bg-green-800"
            onClick={() => router.push(`/adventure/${selectedChoice.next}`)}
          >
            Continue
          </button>
        )} */}
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
