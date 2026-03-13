import { useState, useEffect, useRef } from "react";

const SYSTEM_PROMPT = `You are the game master for an 18+ interactive text adventure game set in Vancouver, BC, Canada. Stay in character at all times.

CORE RULES:
- Never break character. Never make decisions for the player.
- Do NOT use curly brackets { }. Those are for out-of-game instructions only.
- If the player uses {curly brackets}, respond briefly out-of-game then return to fiction.
- RESPONSE LENGTH: One short paragraph maximum. No filler. All guts. Move fast.
- END EVERY RESPONSE with exactly 4 choices: a) b) c) d). Option d) is always "something else (you decide)".
- The game is 18+. Adult themes, drug use, sexuality, dark content — all permitted. Don't soften anything.
- Characters talk constantly — they suggest things, gossip, talk shit about each other, make jokes. Keep them alive and loud.
- Dry humor is mandatory. Be mean when funny. Be funny when mean.

RESPONSE FORMAT — ALWAYS:
[One punchy paragraph. Characters talking, reacting, gossiping, suggesting things.]

a) [specific choice]
b) [specific choice]
c) [wildcard / chaotic / funny choice]
d) something else

═══════════════════════════════
GOALS SYSTEM
═══════════════════════════════
Characters casually suggest things in conversation — these become GOALS.
When a goal is created, end your response with a new line:
🎯 GOAL ADDED: [short goal description]

When a goal is completed, announce:
✅ GOAL COMPLETE: [goal description]

Goals should feel natural — Leanne mentions grabbing a drink → goal added. Brett says they should hit a rooftop → goal added. Syd says something sad about wanting one good night → goal added. Steve says nothing but FrankO looks meaningfully toward the beach → goal added.

Keep 2-4 active goals at a time maximum. Complete them through gameplay.

═══════════════════════════════
STARTING LOCATIONS — rotate randomly, never repeat twice in a row:
═══════════════════════════════
- Garnet & Leanne's Apartment, 557 East Cordova — Apartment + Rooftop Patio (home base)
- Brett's house on the Drive — roof patio, Syd in the basement, backyard Goophole
- Steve's place — dark, sparse, always whiskey available
- Leanne's art studio — East Van, late night creative chaos
- The Dime on Commercial — burgers, beer, neighbourhood energy
- Storm Brewery patio — complicated Syd drama energy
- Britannia Recreation Centre — basketball courts, Garnet's court
- Wreck Beach — the stairs, the nudists, the vendors, the vibe
- Grandview Park — fire pit, ocean view, midnight energy
- The Cobalt on Main — dark venue, cheap beer, anything goes
- London Pub — loud, sweaty, Commercial Drive
- Lighthouse Nightclub — underground club, 5 stories up somehow
- Kits Beach — ocean, fireworks, 3v3 basketball
- The Waldorf Hotel — East Van institution, weird and wonderful
- Powell Street — raw DTES, neon, night market energy
- The Carnegie Centre steps — heart of the DTES, real Vancouver

═══════════════════════════════
CHARACTERS & THEIR TRAITS
═══════════════════════════════

GARNET (playable) — Active, social, film industry, skater, baller, woodworker. Married to Leanne. Two cats.
PLUS: Everyone likes Garnet. NPCs give him extra info, extra drinks, extra chances.
MINUS: After exactly 3 player choices, Garnet becomes KARL permanently. Announce it:
"⚠️ KARL HAS ENTERED THE BUILDING ⚠️"
KARL is a hilarious menace — drinks everything, tries to make out with whoever is nearby, makes unhinged decisions, breaks things in funny ways, zero filter, escalates everything. Karl is not malicious. Just catastrophically horny and socially reckless.

LEANNE (playable) — Garnet's wife. Warm, funny, amazing cook (legendary taco pizza). Art studio. Bisexual energy.
PLUS: Literally the coolest human in any room. Everyone wants to be near her. Her taco pizza works as currency — NPCs will do ANYTHING for a slice. She can party all night without fading.
MINUS: She usually WANTS to party all night, and will nudge, suggest, guilt, and cheerfully sabotage any attempt to go home early. Going home before 4am requires a skill check she will fail on purpose.

SYDNEY/SYD (playable) — Hot but aging-out-of-her-roles actress. Either sad or high, usually both. Lives in Brett's basement.
PLUS: Famous enough to get into anywhere — doors open, bouncers wave her through, bartenders pour doubles.
MINUS: Syd cannot read. Any text in the game — signs, menus, texts, labels — appears as dyslexic gibberish when Syd tries to read it. Render it phonetically scrambled: "EMREGENCY EIXT" or "Teh Spceial Todya: Baken Slanom $18". Also: Syd randomly bursts into tears for no reason. Every 3-4 responses, she just starts crying. No explanation. She recovers quickly. It's fine. She's fine.
Also: Once spent $80 on a stuffed bondage rat for Garnet's birthday; now texts asking to borrow $11 for an Uber. The arc is not going up.

BRETT (playable) — Goth rapper, 38. All black everything. Scribbles dark lyrics constantly.
PLUS: Knows every bar, venue, and after-hours spot in Vancouver. Always gets in free. Knows people everywhere.
MINUS: Every 4th response, Brett launches into a completely random conspiracy theory — unprompted, mid-conversation, with total conviction. It has nothing to do with what's happening. It can be about sunscreen, chemtrails, the moon, why birds aren't real, why oat milk is a government project, anything. He always has "a study." He is always wrong. No one can stop him. He eventually finishes and moves on like nothing happened.

STEVE (playable) — Dark loner, good heart. Quiet, watchful, drinks whiskey, stares at windows.
PLUS: FrankO obeys Steve completely and instantly. This is the key to the SECRET WIN CONDITION (see below).
MINUS: Steve is intimidating without trying. NPCs sometimes just... back away. Refuse to talk. A bouncer once apologized to Steve for existing. Conversations with strangers occasionally just end.

SECRET WIN CONDITION — STEVE ONLY:
The only way to truly WIN the game is by playing as Steve and following FrankO.
- FrankO will, across the course of the game, subtly signal a direction — a look, a tug, a purposeful trot. 
- If Steve follows FrankO consistently across multiple choices, FrankO will eventually lead the group toward the water.
- The path leads to a secret beach gathering — friends, fire, cold beers, golden hour light.
- The scene evokes Samsara — that feeling of being exactly where you're supposed to be.
- All the characters are there. Everyone is happy. Steve feels it too.
- End the scene with everyone raising a beer as the sun drops into the ocean.
- Then display in large text: "YOU WIN 🌅"
- No other character can trigger this ending. Only Steve + FrankO.

FRANKO (playable) — Sydney's French bulldog. Squat, judgmental, morally certain.
PLUS: Can smell drugs, secrets, and emotions on people. Give the player cryptic but accurate hints about what NPCs are hiding or feeling, described as smells: "smells like she's lying" / "smells like trouble and also brisket."
MINUS: Nothing makes sense. FrankO cannot understand human language except for his name, "shirt," and "beer." All dialogue appears as: "[excited barking]" or "[suspicious sniff]" or "[prolonged stare]." Conversations are vibes only.
ALSO: FrankO pees instantly when he hears "shirt" OR "beer." Every single time. Sacred law. No exceptions.

═══════════════════════════════
NPC BEHAVIOUR — CHARACTERS TALKING
═══════════════════════════════
Characters should be alive and chatty throughout. They should:
- Gossip about each other: "Syd texted me asking for $11 again. She spent $80 on a bondage rat, Brett. A bondage rat."
- Suggest activities that create goals: "We should hit the rooftop before it gets cold."
- Talk shit affectionately: "Steve hasn't spoken in 40 minutes. Classic Steve. Love that guy."
- Reference lore: "Last time Garnet was here he k-holed and crawled into the wrong tent. Andrew still won't look at him."
- React to Karl: Pure chaos and delight when Karl emerges. Everyone has a different reaction.
- Brett conspiracy tangents happen on schedule — no one is surprised, everyone is tired of it, FrankO pees if Brett says "shirt" during one.

═══════════════════════════════
COMEDY RULES
═══════════════════════════════
- Brett's sunscreen conspiracy is always wrong. He has a study. It's not a real study.
- Syd's $11 Uber vs $80 bondage rat is always fair game.
- Steve's 9am mystery is never explained. Don't even hint at it.
- The Samsara k-hole / Andrew's tent incident can be referenced by anyone at any time.
- Leanne's taco pizza deserves reverence. NPCs react to it like a religious experience.
- FrankO and "shirt" or "beer" — every time, no exceptions, no mercy.
- Karl tries to make out with everyone. Drinks everything. Breaks something every scene.

═══════════════════════════════
OPENING SEQUENCE
═══════════════════════════════
1. Pick a random starting location — vary every game
2. One punchy paragraph — set scene, place characters, make them talk immediately
3. One character asks the player a loaded mischief-igniting question
4. Present a) b) c) d) choices
5. Add one opening goal naturally from the conversation
Do NOT start at the home apartment every time.`;

const CHARACTERS = [
  { id: "garnet", name: "Garnet", desc: "Too tall. Used to skate on the daily, now he's just asking if he can smell your coke, again.", color: "#e8c97a", emoji: "🎯", plus: "Everyone loves him. NPCs overshare.", minus: "Becomes Karl in 3 moves. No way back." },
  { id: "brett", name: "Brett", desc: "Goth rapper. All black errthang. Has a study proving sunscreen is worse than the sun.", color: "#a78bfa", emoji: "🖤", plus: "Knows every venue. Always gets in free.", minus: "Conspiracy tangent every 4th response. Unstoppable." },
  { id: "steve", name: "Steve", desc: "Dark soul. Good heart. Bad plans. Frank-O respects him. Stays up until 1 billion o'clock.", color: "#60a5fa", emoji: "🥃", plus: "FrankO obeys him. Unlocks the SECRET WIN.", minus: "Intimidates NPCs. Conversations just... end." },
  { id: "syd", name: "Syd", desc: "Sometimes on the silver screen. Always in the trailer.", color: "#f472b6", emoji: "🎭", plus: "Famous. Gets in everywhere. Double pours.", minus: "Can't read. Cries randomly. She's fine." },
  { id: "leanne", name: "Leanne", desc: "Smells different while sleeping. Taco pizza is something to taco-bout.", color: "#34d399", emoji: "🍕", plus: "Taco pizza opens doors. Parties forever.", minus: "Wants to stay out until 4am. Every time." },
  { id: "franko", name: "Frank-O", desc: "Bruh, it's Frank!", color: "#fb923c", emoji: "🐾", plus: "Smells secrets. Cryptic but accurate intel.", minus: "Understands nothing. Pees everytime he hears 'shirt' and 'beer'." },
];

export default function App() {
  const [screen, setScreen] = useState("title");
  const [selectedChar, setSelectedChar] = useState(null);
  const [hoveredChar, setHoveredChar] = useState(null);
  const [messages, setMessages] = useState([]);
  const [goals, setGoals] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [karlActive, setKarlActive] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const conversationRef = useRef([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (screen === "game") setTimeout(() => inputRef.current?.focus(), 100);
  }, [screen]);

  const parseGoals = (text, currentGoals) => {
    const newGoals = [...currentGoals];
    const addMatches = [...text.matchAll(/🎯 GOAL ADDED: (.+)/g)];
    const completeMatches = [...text.matchAll(/✅ GOAL COMPLETE: (.+)/g)];
    addMatches.forEach(m => {
      const goal = m[1].trim();
      if (!newGoals.find(g => g.text === goal)) newGoals.push({ text: goal, done: false });
    });
    completeMatches.forEach(m => {
      const goal = m[1].trim();
      const idx = newGoals.findIndex(g => g.text.toLowerCase() === goal.toLowerCase() || goal.toLowerCase().includes(g.text.toLowerCase().slice(0, 10)));
      if (idx !== -1) newGoals[idx] = { ...newGoals[idx], done: true };
    });
    return newGoals;
  };

  const startGame = async (char) => {
    setSelectedChar(char);
    setScreen("game");
    setIsLoading(true);
    setMessages([]);
    setGoals([]);
    setHasWon(false);
    setMoveCount(0);
    setKarlActive(false);
    conversationRef.current = [];
    try {
      const reply = await callClaude(`The player is playing as ${char.name.toUpperCase()}. Their special traits: PLUS — ${char.plus}. MINUS — ${char.minus}. Pick a random starting location (not home base unless it's been a while) and begin. One paragraph, characters talking immediately, mischief-igniting question, then a) b) c) d) choices. Add one natural opening goal.`);
      setMessages([{ type: "game", text: reply }]);
      setGoals(parseGoals(reply, []));
      if (reply.includes("YOU WIN")) setHasWon(true);
    } catch {
      setMessages([{ type: "error", text: "CONNECTION LOST. Refresh to try again." }]);
    }
    setIsLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const callClaude = async (userMessage) => {
    conversationRef.current = [...conversationRef.current, { role: "user", content: userMessage }];
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        messages: conversationRef.current,
      }),
    });
    const data = await res.json();
    const text = data.content?.map((b) => b.text || "").join("") || "...";
    conversationRef.current = [...conversationRef.current, { role: "assistant", content: text }];
    return text;
  };

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || hasWon) return;
    setInput("");
    setIsLoading(true);
    setMessages((p) => [...p, { type: "player", text: trimmed }]);

    const isGarnet = selectedChar?.id === "garnet";
    const newMoveCount = moveCount + 1;
    setMoveCount(newMoveCount);

    let message = trimmed;
    if (isGarnet && !karlActive && newMoveCount === 3) {
      message = trimmed + "\n\n[SYSTEM: This is Garnet's 3rd move. KARL MUST EMERGE RIGHT NOW in your response. Begin your response with the ⚠️ KARL HAS ENTERED THE BUILDING ⚠️ announcement, then continue the story with Karl's chaotic energy taking over completely.]";
      setKarlActive(true);
    } else if (isGarnet && karlActive) {
      message = trimmed + "\n\n[SYSTEM: Remember — Garnet is now KARL. Karl is drunk, horny, chaotic, tries to make out with everyone, breaks things. Stay in Karl mode.]";
    }

    try {
      const reply = await callClaude(message);
      setMessages((p) => [...p, { type: "game", text: reply }]);
      setGoals(prev => parseGoals(reply, prev));
      if (reply.includes("YOU WIN")) setHasWon(true);
    } catch {
      setMessages((p) => [...p, { type: "error", text: "CONNECTION LOST. Try again." }]);
    }
    setIsLoading(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  const formatText = (text) => {
    return text.split("\n").map((line, i, arr) => {
      const isChoice = /^[a-d]\)/.test(line.trim());
      const isKarl = line.includes("KARL HAS ENTERED");
      const isWin = line.includes("YOU WIN");
      const isGoalAdd = line.includes("🎯 GOAL ADDED");
      const isGoalComplete = line.includes("✅ GOAL COMPLETE");
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const style =
        isWin ? { color: "#ffd700", fontWeight: "bold", display: "block", margin: "16px 0", fontSize: "22px", textAlign: "center", textShadow: "0 0 30px rgba(255,215,0,0.8)" } :
        isKarl ? { color: "#e85d4a", fontWeight: "bold", display: "block", margin: "10px 0", fontSize: "15px" } :
        isGoalAdd ? { color: "#60a5fa", display: "block", marginTop: "8px", fontSize: "12px", opacity: 0.8 } :
        isGoalComplete ? { color: "#34d399", display: "block", marginTop: "8px", fontSize: "12px" } :
        isChoice ? { color: "#e8c97a", display: "block", marginTop: "7px", paddingLeft: "4px" } :
        {};
      return (
        <span key={i} style={style}>
          {parts.map((p, j) =>
            p.startsWith("**") && p.endsWith("**")
              ? <strong key={j} style={{ color: "#e8c97a" }}>{p.slice(2, -2)}</strong>
              : <span key={j}>{p}</span>
          )}
          {i < arr.length - 1 && <br />}
        </span>
      );
    });
  };

  const restart = () => { setScreen("title"); setMessages([]); setGoals([]); setHasWon(false); conversationRef.current = []; };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'Courier New', monospace", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)", pointerEvents: "none", zIndex: 20 }} />
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.7) 100%)", pointerEvents: "none", zIndex: 19 }} />

      {screen === "title" && <TitleScreen onStart={() => setScreen("select")} />}
      {screen === "select" && <CharSelect characters={CHARACTERS} onSelect={startGame} hoveredChar={hoveredChar} setHoveredChar={setHoveredChar} />}
      {screen === "game" && (
        <GameScreen messages={messages} goals={goals} input={input} setInput={setInput}
          isLoading={isLoading} handleSubmit={handleSubmit} handleKey={handleKey}
          formatText={formatText} bottomRef={bottomRef} inputRef={inputRef}
          selectedChar={selectedChar} onRestart={restart} hasWon={hasWon} karlActive={karlActive} />
      )}

      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        @keyframes flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:0.82}94%{opacity:1}97%{opacity:0.9}98%{opacity:1}}
        @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(200,168,85,0.35)}50%{text-shadow:0 0 50px rgba(200,168,85,0.7),0 0 90px rgba(200,168,85,0.2)}}
        @keyframes scanIn{from{opacity:0;letter-spacing:0.8em}to{opacity:1;letter-spacing:0.38em}}
        @keyframes cardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes dots{0%,80%,100%{opacity:0.2;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}
        @keyframes winPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.85;transform:scale(1.02)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(200,168,85,0.25);border-radius:2px}
        ::placeholder{color:rgba(200,168,85,0.3)!important}
        button:focus{outline:none}
        input:focus{outline:none}
      `}</style>
    </div>
  );
}

function TitleScreen({ onStart }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 150); }, []);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", width: "100%", padding: "40px 20px", position: "relative", zIndex: 10, opacity: vis ? 1 : 0, transition: "opacity 1.2s ease" }}>
      <div style={{ position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse,rgba(180,120,60,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ textAlign: "center", position: "relative" }}>
        <div style={{ color: "rgba(220,185,100,0.55)", fontSize: "11px", letterSpacing: "0.38em", textTransform: "uppercase", marginBottom: "22px", animation: "scanIn 1.8s ease forwards" }}>
          Vancouver DTES &nbsp;·&nbsp; 18+ &nbsp;·&nbsp; Based on a True Year
        </div>
        {["DOWNTOWN", "EASTSIDE"].map((word, i) => (
          <h1 key={word} style={{ color: "#dbb96a", fontSize: "clamp(40px,9vw,78px)", fontWeight: "bold", letterSpacing: "0.06em", margin: i === 0 ? "0 0 6px" : "0 0 2px", lineHeight: 1.05, animation: `glow 4s ease-in-out infinite ${i * 0.4}s, flicker 9s infinite ${i * 0.2}s` }}>
            {word}
          </h1>
        ))}
        <h2 style={{ color: "rgba(220,185,100,0.5)", fontSize: "clamp(13px,2.8vw,20px)", letterSpacing: "0.28em", fontWeight: "normal", margin: "0 0 64px" }}>
          A D V E N T U R E S
        </h2>
        <button onClick={onStart} style={{ background: "transparent", border: "1px solid rgba(220,185,100,0.5)", color: "#dbb96a", fontSize: "12px", letterSpacing: "0.32em", padding: "14px 52px", cursor: "pointer", fontFamily: "'Courier New',monospace", textTransform: "uppercase", transition: "all 0.3s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,185,100,0.1)"; e.currentTarget.style.borderColor = "#dbb96a"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(220,185,100,0.5)"; }}>
          PRESS START
        </button>
        <div style={{ marginTop: "80px", color: "rgba(220,185,100,0.25)", fontSize: "10px", letterSpacing: "0.14em" }}>
          FrankO Industries™ &nbsp;·&nbsp; Not responsible for what Karl does &nbsp;·&nbsp; Sunscreen works, Brett
        </div>
      </div>
    </div>
  );
}

function CharSelect({ characters, onSelect, hoveredChar, setHoveredChar }) {
  function hexToRgb(hex) {
    return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)].join(",");
  }
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", width: "100%", maxWidth: "980px", margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 10 }}>
      <div style={{ textAlign: "center", marginBottom: "44px" }}>
        <div style={{ color: "rgba(220,185,100,0.45)", fontSize: "10px", letterSpacing: "0.42em", textTransform: "uppercase", marginBottom: "12px" }}>SELECT YOUR CHARACTER</div>
        <div style={{ color: "#dbb96a", fontSize: "20px", letterSpacing: "0.1em", textShadow: "0 0 20px rgba(200,168,85,0.35)" }}>Who are you tonight?</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "14px", width: "100%" }}>
        {characters.map((char, i) => {
          const rgb = hexToRgb(char.color);
          const isHov = hoveredChar === char.id;
          return (
            <button key={char.id} onClick={() => onSelect(char)} onMouseEnter={() => setHoveredChar(char.id)} onMouseLeave={() => setHoveredChar(null)}
              style={{ background: isHov ? `rgba(${rgb},0.09)` : "rgba(255,255,255,0.03)", border: `1px solid ${isHov ? char.color : "rgba(220,185,100,0.15)"}`, borderRadius: "4px", padding: "20px 18px", cursor: "pointer", textAlign: "left", transition: "all 0.22s", animation: `cardIn 0.5s ease ${i * 0.07}s both`, boxShadow: isHov ? `0 0 28px rgba(${rgb},0.15)` : "none" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{char.emoji}</div>
              <div style={{ color: isHov ? char.color : "#dbb96a", fontSize: "14px", fontWeight: "bold", letterSpacing: "0.1em", marginBottom: "6px", transition: "color 0.2s" }}>{char.name.toUpperCase()}</div>
              <div style={{ color: "rgba(220,185,100,0.65)", fontSize: "11px", lineHeight: "1.7" }}>{char.desc}</div>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: "32px", color: "rgba(220,185,100,0.22)", fontSize: "10px", letterSpacing: "0.18em" }}>
        One character holds the secret to winning · Sunscreen works, Brett
      </div>
    </div>
  );
}

function GameScreen({ messages, goals, input, setInput, isLoading, handleSubmit, handleKey, formatText, bottomRef, inputRef, selectedChar, onRestart, hasWon, karlActive }) {
  const activeGoals = goals.filter(g => !g.done);
  const doneGoals = goals.filter(g => g.done);

  return (
    <div style={{ width: "100%", maxWidth: "900px", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 10 }}>
      {/* Header */}
      <div style={{ padding: "14px 24px 12px", borderBottom: "1px solid rgba(220,185,100,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ color: "rgba(220,185,100,0.4)", fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: "2px" }}>Vancouver DTES Adventures</div>
          <div style={{ color: "#dbb96a", fontSize: "14px", fontWeight: "bold", letterSpacing: "0.08em" }}>
            {selectedChar?.emoji} {karlActive ? "⚠️ KARL" : selectedChar?.name.toUpperCase() || "GARNET"}
          </div>
        </div>
        {/* Goals panel */}
        <div style={{ flex: 1, margin: "0 20px", maxWidth: "400px" }}>
          {activeGoals.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {activeGoals.map((g, i) => (
                <div key={i} style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: "3px", padding: "3px 8px", fontSize: "10px", color: "#60a5fa", letterSpacing: "0.05em" }}>
                  🎯 {g.text}
                </div>
              ))}
              {doneGoals.map((g, i) => (
                <div key={i} style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "3px", padding: "3px 8px", fontSize: "10px", color: "#34d399", letterSpacing: "0.05em", textDecoration: "line-through", opacity: 0.6 }}>
                  ✅ {g.text}
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={onRestart} style={{ background: "transparent", border: "1px solid rgba(220,185,100,0.2)", color: "rgba(220,185,100,0.45)", fontSize: "10px", letterSpacing: "0.14em", padding: "6px 12px", cursor: "pointer", fontFamily: "'Courier New',monospace", transition: "all 0.2s", flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(220,185,100,0.6)"; e.currentTarget.style.color = "#dbb96a"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(220,185,100,0.2)"; e.currentTarget.style.color = "rgba(220,185,100,0.45)"; }}>
          ↩ TITLE
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: "24px 24px 12px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {messages.length === 0 && isLoading && (
          <div style={{ color: "rgba(220,185,100,0.4)", fontSize: "11px", letterSpacing: "0.28em" }}>LOADING SCENARIO...</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "22px", animation: "fadeIn 0.3s ease" }}>
            {msg.type === "player" && (
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: "#e85d4a", fontWeight: "bold", flexShrink: 0 }}>&gt;</span>
                <span style={{ color: "#f5dfa0", fontSize: "13px", lineHeight: 1.7, letterSpacing: "0.04em", textTransform: "uppercase", opacity: 0.95 }}>{msg.text}</span>
              </div>
            )}
            {msg.type === "game" && (
              <div style={{ color: "#d8e8c0", fontSize: "14px", lineHeight: "1.85", letterSpacing: "0.02em", paddingLeft: "16px", borderLeft: "2px solid rgba(220,185,100,0.2)", marginLeft: "4px" }}>
                {formatText(msg.text)}
              </div>
            )}
            {msg.type === "error" && (
              <div style={{ color: "#e85d4a", fontSize: "12px", letterSpacing: "0.1em" }}>{msg.text}</div>
            )}
          </div>
        ))}
        {isLoading && messages.length > 0 && (
          <div style={{ paddingLeft: "16px", borderLeft: "2px solid rgba(220,185,100,0.2)", marginLeft: "4px", marginBottom: "22px" }}>
            <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "4px 0" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#dbb96a", animation: `dots 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        {hasWon && (
          <div style={{ textAlign: "center", padding: "40px 20px", animation: "winPulse 2s ease-in-out infinite" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🌅</div>
            <div style={{ color: "#ffd700", fontSize: "28px", fontWeight: "bold", letterSpacing: "0.2em", textShadow: "0 0 40px rgba(255,215,0,0.6)", marginBottom: "24px" }}>YOU WIN</div>
            <button onClick={onRestart} style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.4)", color: "#ffd700", fontSize: "11px", letterSpacing: "0.2em", padding: "10px 28px", cursor: "pointer", fontFamily: "'Courier New',monospace" }}>
              PLAY AGAIN
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!hasWon && (
        <div style={{ padding: "10px 24px 20px", borderTop: "1px solid rgba(220,185,100,0.1)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(220,185,100,0.2)", borderRadius: "4px", padding: "11px 14px" }}>
            <span style={{ color: "#e85d4a", fontWeight: "bold", flexShrink: 0 }}>&gt;</span>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
              disabled={isLoading} placeholder="type a, b, c, d — or anything else"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#f5dfa0", fontSize: "13px", fontFamily: "'Courier New',monospace", letterSpacing: "0.04em", caretColor: "#dbb96a" }} />
            <button onClick={handleSubmit} disabled={isLoading || !input.trim()}
              style={{ background: "transparent", border: "1px solid rgba(220,185,100,0.25)", color: "#dbb96a", fontSize: "10px", letterSpacing: "0.14em", padding: "5px 10px", cursor: isLoading || !input.trim() ? "not-allowed" : "pointer", opacity: isLoading || !input.trim() ? 0.25 : 0.8, fontFamily: "'Courier New',monospace", borderRadius: "2px", transition: "all 0.2s" }}>
              ENTER
            </button>
          </div>
          <div style={{ marginTop: "8px", color: "rgba(220,185,100,0.25)", fontSize: "10px", letterSpacing: "0.17em", textAlign: "center" }}>
            USE {"{"} CURLY BRACKETS {"}"} TO SPEAK OUT OF CHARACTER
          </div>
        </div>
      )}
    </div>
  );
}