"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { adventurePages } from "../pages";
import MenuButton from "@/util/MenuButton";
import PageStats from "@/components/PageStats";
import NameInput from "@/components/NameInput";
import BattlePage from "@/components/BattlePage";
import RollPage from "@/components/RollPage";


export default function AdventurePage() {
  const { pageId } = useParams();
  const router = useRouter();
  const page = adventurePages[pageId];

  const [selectedChoice, setSelectedChoice] = useState(null);
  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [characterName, setCharacterName] = useState("");

  const [allocatedStats, setAllocatedStats] = useState(null);
  const [pointsRemaining, setPointsRemaining] = useState(10);

  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setCharacterName(snap.data().characterName || "");
      }
    };

    loadUser();
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!page) router.push("/adventure/page_1");
  }, [page]);

  if (!page) return null;

  async function handleContinue() {
    const ref = doc(db, "users", user.uid);

    if (page.type === "input" && user) {
      // const ref = doc(db, "users", user.uid);
      await setDoc(ref, { [page.input.field]: inputValue }, { merge: true });
      router.push(`/adventure/${page.input.next}`);
      return;
    }

    if (page.type === "stats" && user) {
      // const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        stats: allocatedStats,   // save all stats
      });

      await setDoc(ref, { allocatedStats }, { merge: true });

      let className = "";

      if (allocatedStats.Intelligence >= 14) className = "Mage";
      if (allocatedStats.Strength >= 14 || allocatedStats.Constitution >= 14) className = "Warrior";
      if (allocatedStats.Charisma >= 14 || allocatedStats.Wisdom >= 14) className = "Summoner";
      if (!className) className = "Undecided / Mixed";

      await updateDoc(ref, { className }, { merge: true });

      router.push(`/adventure/${page.next}`);
      return;
    }

    if (page.type === "classRedirect") {
      const userSnap = await getDoc(ref);
      const userData = userSnap.data();
      const className = userData?.className || "Adventurer";

      let nextPageId = page.next;

      console.log(page.classNext, "team_" + className);
      nextPageId = page.classNext[className] || page.next;
      console.log("Redirecting to:", nextPageId);
      router.push(`/adventure/${nextPageId}`);
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

  const renderText = page.text.replace(/{{characterName}}/g, characterName);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white p-6"
      style={{ backgroundImage: `url(${page.src})` }}
    >
      <MenuButton />

      <div className="story-text p-2 mb-6">
        <div className="space-y-2 m-3">
          {renderText.split("\n\n").map((para, idx) => (
            <p key={idx} className="text-base">{para}</p>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {page.type === "input" && (
          <NameInput
            label={page.input.label}
            value={inputValue}
            onChange={setInputValue}
          />
        )}

        {page.type === "stats" && (
          <PageStats onStatsChange={(stats, pointsRemaining) => {
            setAllocatedStats(stats);
            setPointsRemaining(pointsRemaining);
          }} />
        )}

        {page.type === "roll" && (
          <RollPage page={page} router={router} />
        )}

        {page.type === "battle" && (
          <BattlePage page={page} router={router} />
        )}

        {/* Choices */}
        {page.choices &&
          page.choices.map((choice, i) => (
            <button
              key={i}
              className={`block choice-button w-64 px-4 py-2 text-md ${
                selectedChoice?.next === choice.next
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedChoice(choice)}
            >
              {choice.label}
            </button>
          ))}

        {(page.type === "stats" || page.type === "input" || page.type === "classRedirect" || page.type === "roll" || page.type === "battle" || page.choices || page.next) && (
          <button
            className={`mt-4 float-right px-4 py-2 ${
              (page.type === "stats" && pointsRemaining > 0) ||
              (page.type === "input" && inputValue.trim() === "") ||
              (page.choices && !selectedChoice)
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-800"
            }`}
            onClick={handleContinue}
            disabled={
              (page.type === "stats" && pointsRemaining > 0) ||
              (page.type === "input" && inputValue.trim() === "") ||
              (page.choices && !selectedChoice)
            }
          >
            Continue
          </button>
        )}

      </div>
    </div>
  );
}
