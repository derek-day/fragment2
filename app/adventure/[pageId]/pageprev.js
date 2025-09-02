"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import bgImage from "@/public/portal.png";
import { adventurePages } from "../pages";
import MenuButton from "@/util/MenuButton";
import PageStats from "@/components/PageStats";


export default function AdventurePage() {
    const { pageId } = useParams();
    const router = useRouter();
    const page = adventurePages[pageId];
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [inputValue, setInputValue] = useState("");
  
    useEffect(() => {
        if (!page) router.push("/adventure/page_1");
    }, [page]);

    if (!page) return null;

    async function handleContinue() {
      if (page.type === "input" && user) {
        const ref = doc(db, "users", user.uid);
        await setDoc(ref, { [page.input.field]: inputValue }, { merge: true });
        router.push(`/adventure/${page.input.next}`);
        return;
      }

      if (selectedChoice) {
        router.push(`/adventure/${selectedChoice.next}`);
        setSelectedChoice(null);
      } else if (page.next) {
        router.push(`/adventure/${page.next}`);
      }
    }

    useEffect(() => {
      if (page?.title) {
        document.title = page.title + " | The Gatebreaker Protocol";
      }
    }, [page]);

  return (      
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white p-6" style={{ backgroundImage: `url(${page.src})`}}>
      <MenuButton />

      <div className="story-text p-2 mb-6">
        <div className="space-y-2 m-3">
            {page.text.split("\n\n").map((para, idx) => (
            <p key={idx} className="text-base">{para}</p>
            ))}
        </div>
      </div>

      <div className="space-y-4">

        {page.type === "input" && (
          <div>
            <label className="block mb-2">{page.input.label}</label>
            <input
              type="text"
              className="border p-2 rounded w-full mb-4"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        )}

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

        {(page.type === "input" || page.choices || page.next) && (
          <button
            className={`mt-4 float-right bg-green-600 px-4 py-2 rounded ${
              selectedChoice || page.next || (page.type === "input" && inputValue.trim() !== "") ? "bg-green-600 text-white hover:bg-green-800" : "bg-gray-400 text-gray-700"
            }`}
            onClick={handleContinue}
            disabled={!selectedChoice && !page.next && !(page.type === "input" && inputValue.trim() === "")}
          >
            Continue
          </button>
        )}

      </div>
    </div>
  );
}
