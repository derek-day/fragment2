"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
// import { rollDice, attackRoll, getAttackBonus, getArmorClass } from "@/util/dice";

export default function BattlePage({ page, router }) {
  const [player, setPlayer] = useState(null);
  const [enemy, setEnemy] = useState({ ...page.enemy });
  const [log, setLog] = useState([]);
  const [turn, setTurn] = useState("player");

  useEffect(() => {
    async function loadPlayer() {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, "characters", user.uid);
      const snap = await getDoc(ref);
      setPlayer(snap.data());
    }
    loadPlayer();
  }, []);

  if (!player) return <p>Loading...</p>;

  function handleAttack() {
    const attackBonus = getAttackBonus(player.stats, player.className);
    const ac = enemy.ac;

    const result = attackRoll(
      { attackBonus, damage: "1d6+2" }, // TODO: class-based weapon
      { ac }
    );

    if (result.hit) {
      const newHP = enemy.hp - result.damage;
      setEnemy({ ...enemy, hp: newHP });
      setLog([...log, `You hit for ${result.damage} damage! (Roll: ${result.roll})`]);
      if (newHP <= 0) return handleVictory();
    } else {
      setLog([...log, `You missed! (Roll: ${result.roll})`]);
    }
    setTurn("enemy");
  }

  function enemyAttack() {
    const playerAC = getArmorClass(player.stats, player.armor || 0);
    const result = attackRoll(enemy, { ac: playerAC });

    if (result.hit) {
      const newHP = player.hp - result.damage;
      setPlayer({ ...player, hp: newHP });
      setLog([...log, `${enemy.name} hits you for ${result.damage} damage!`]);
      if (newHP <= 0) return handleDefeat();
    } else {
      setLog([...log, `${enemy.name} misses!`]);
    }
    setTurn("player");
  }

  async function handleVictory() {
    const user = auth.currentUser;
    const ref = doc(db, "characters", user.uid);
    await setDoc(ref, {
      xp: (player.xp || 0) + enemy.xp,
      inventory: [...(player.inventory || []), enemy.itemDrop]
    }, { merge: true });

    router.push(`/adventure/${page.next}`);
  }

  function handleDefeat() {
    setLog([...log, "You have been defeated..."]);
    // maybe route to a "game over" page
    router.push("/adventure/game_over");
  }

  // auto-run enemy turn
  useEffect(() => {
    if (turn === "enemy" && enemy.hp > 0 && player.hp > 0) {
      setTimeout(enemyAttack, 1000);
    }
  }, [turn]);

  return (
    <div className="p-6 text-white">
      <h2>{page.title}</h2>
      <p>{page.text}</p>
      <p>{enemy.name} HP: {enemy.hp}</p>
      <p>Your HP: {player.hp}</p>

      {turn === "player" && (
        <button onClick={handleAttack} className="bg-red-600 px-4 py-2 rounded">
          Attack
        </button>
      )}

      <div className="mt-4 bg-gray-800 p-3 rounded max-h-64 overflow-y-auto">
        {log.map((entry, i) => <p key={i}>{entry}</p>)}
      </div>
    </div>
  );
}
