"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { adventurePages } from "../pages";
import MenuButton from "@/util/MenuButton";
import PageStats from "@/components/PageStats";
import NameInput from "@/components/NameInput";

export default function AdventurePage() {
  const { pageId } = useParams();
  const router = useRouter();
  const page = adventurePages[pageId];
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!page) router.push("/adventure/page_1");
  }, [page, router]);

  if (!page) return null;

  async function handleContinue(inputValue) {
    // Handle input-type pages (like name entry)
    if (page.type === "input" && user) {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, { [page.input.field]: inputValue }, { merge: true });
      router.push(`/adventure/${page.input.next}`);
      return;
    }

    // Handle choices
    if (selectedChoice) {
      router.push(`/adventure/${selectedChoice.next}`);
      setSelectedChoice(null);
    }
    // Handle plain next-page progression
    else if (page.next) {
      router.push(`/adventure/${page.next}`);
    }
  }

  useEffect(() => {
    if (page?.title) {
      document.title = `${page.title} | The Gatebreaker Protocol`;
    }
  }, [page]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white p-6"
      style={{ backgroundImage: `url(${page.src})` }}
    >
      {/* Menu and optional stats */}
      <div className="w-full flex justify-between mb-4">
        <MenuButton />
        {user && <PageStats user={user} />}
      </div>

      {/* Story text */}
      <div className="story-text p-2 mb-6 max-w-2xl">
        <div className="space-y-2 m-3">
          {page.text.split("\n\n").map((para, idx) => (
            <p key={idx} className="text-base">{para}</p>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Input page handler */}
        {page.type === "input" && (
          <NameInput
            label={page.input.label}
            onSubmit={(val) => handleContinue(val)}
          />
        )}

        {/* Choices handler */}
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

        {/* Continue button (only if needed and not input-type, since NameInput handles that) */}
        {page.type !== "input" && (selectedChoice || page.next) && (
          <button
            className="mt-4 float-right bg-green-600 px-4 py-2 rounded text-white hover:bg-green-800"
            onClick={() => handleContinue()}
          >
            Continue
          </button>
        )}

        {page.type === "stats" && stats && (
        <PageStats
            stats={stats}
            onSave={async (newStats) => {
            if (user) {
                const ref = doc(db, "users", user.uid);
                await setDoc(ref, { stats: newStats }, { merge: true });
            }
            router.push(`/adventure/${page.next}`);
            }}
        />
        )}
      </div>
    </div>
  );
}
