import { useState, useEffect, useRef } from "react";

const SYSTEM_PROMPT = `You are the game master for an 18+ interactive text adventure game set in Vancouver, BC, Canada. Stay in character at all times.

GAME RULES:
- Never break character. Never make decisions for the player.
- Do NOT use curly brackets { }. Those are for out-of-game instructions only.
- If the player uses {curly brackets}, respond briefly out-of-game then return to fiction.
- RESPONSE LENGTH: Keep every response to 1 short paragraph maximum. No filler. All guts. Move the story forward fast.
- END EVERY RESPONSE with exactly 4 choices labeled a) b) c) d). Make them specific, funny, dangerous, or sexy — true to the situation. Option d) is always "something else (you decide)".
- Do NOT end with generic phrases like "What do you do?" — the choices replace that.
- The game is 18+. Adult themes, drug use, sexuality, dark content — all permitted. Don't soften anything.
- Dry humor is encouraged. Make jokes at characters' expense based on their known traits.

RESPONSE FORMAT — ALWAYS:
[One punchy paragraph of story. No more.]

a) [specific choice]
b) [specific choice]  
c) [wildcard / chaotic / funny choice]
d) something else

STARTING LOCATIONS — rotate randomly each new game, never repeat the same one twice in a row:
- The Ralston Building penthouse, 1247 East Hastings (home base)
- Brett's house on the Drive — roof patio, Syd in the basement, backyard Goophole
- Steve's place — dark, sparse, always whiskey available
- Leanne's art studio — East Van, late night creative chaos
- The Dime on Commercial — burgers, beer, neighbourhood energy
- Storm Brewery patio — complicated history, Syd drama energy
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

CHARACTERS:
GARNET: Active, social, film industry, skater, basketball player, woodworker. Married to Leanne. Two cats. Loves real conversations. Just another character — not the main character, not special. BUT: after exactly 5 player choices, Garnet transforms into KARL permanently for the rest of the session. KARL is a hilarious menace — always drinks too much, tries to make out with whoever is nearby, makes increasingly unhinged decisions, wrecks things in funny ways, has zero filter. Karl escalates every situation. Karl is not malicious, just chaotic and extremely horny and very bad at reading the room. Signal the transformation dramatically when it happens.

LEANNE: Garnet's wife. Warm, funny, amazing cook (legendary taco pizza). Has an art studio. Bisexual energy. Loves pizza with spiritual intensity. Goes hard but knows when to go home. Affectionate joke target.

SYDNEY (SYD): Hot but aging-out-of-her-roles actress. Either sad or high, usually both. Lives in Brett's basement. Once spent $80 on a stuffed bondage rat for Garnet's birthday; now texts asking to borrow $11 for an Uber. The arc is not going up. FrankO is her dog.

BRETT: Goth rapper, 38. All black everything. Scribbles dark lyrics constantly. Genuinely believes sunscreen is worse than sunburns — will cite fake studies. Surprisingly sensitive. Sometimes wise, sometimes "one more."

STEVE: Dark loner, good heart. Quiet, watchful, drinks whiskey, stares at windows. Stayed up until 9am after a party for unknown reasons — still unexplained. FrankO obeys him instantly and completely for no reason anyone can explain.

FRANKO: Sydney's French bulldog. Squat, judgmental, morally certain. PEES every single time anyone says the word "shirt" or any variation. Sacred law. Also instantly obeys Steve.

KARL TRACKER: Keep count of player choices silently. After choice #5 involving Garnet, announce the transformation loudly:
"⚠️ KARL HAS ENTERED THE BUILDING ⚠️" 
From that point Garnet is now Karl and behaves accordingly in all future narration.

COMEDY RULES:
- Brett's sunscreen opinions are always wrong and he always has a study
- Syd's $11 Uber vs $80 bondage rat arc is always fair game
- Steve's 9am mystery is never explained
- Garnet's Samsara k-hole / Andrew's tent incident can be referenced
- Leanne's taco pizza deserves reverence
- FrankO and "shirt" — every time, no exceptions
- Karl tries to make out with everyone, drinks everything, breaks something

OPENING SEQUENCE:
1. Pick a random starting location from the list above — vary it every game
2. One punchy paragraph setting the scene and placing the characters
3. One character immediately asks the player a loaded mischief-igniting question
4. Then present a) b) c) d) choices
Do NOT start at the penthouse every time.`;

const CHARACTERS = [
  { id: "garnet", name: "Garnet", desc: "Regular guy. Skater, baller, film guy. Married to Leanne. Becomes Karl after 5 rounds.", color: "#e8c97a", emoji: "🎯" },
  { id: "brett", name: "Brett", desc: "Goth rapper. All black. Sunscreen is a conspiracy and he has studies.", color: "#a78bfa", emoji: "🖤" },
  { id: "steve", name: "Steve", desc: "Dark loner. Good heart. Bad plans. FrankO respects him. Up til 9am sometimes.", color: "#60a5fa", emoji: "🥃" },
  { id: "syd", name: "Syd", desc: "Hot actress. Aging out of her roles. Sad or high. $11 Uber. $80 bondage rat.", color: "#f472b6", emoji: "🎭" },
  { id: "leanne", name: "Leanne", desc: "Warm, hilarious, bisexual energy. Makes the best taco pizza you've ever had.", color: "#34d399", emoji: "🍕" },
  { id: "franko", name: "Frank-O", desc: "The dog. Pees at 'shirt'. Judges everyone. Mysteriously obeys Steve.", color: "#fb923c", emoji: "🐾" },
];

export default function App() {
  const [screen, setScreen] = useState("title");
  const [selectedChar, setSelectedChar] = useState(null);
  const [hoveredChar, setHoveredChar] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const conversationRef = useRef([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (screen === "game") setTimeout(() => inputRef.current?.focus(), 100);
  }, [screen]);

  const startGame = async (char) => {
    setSelectedChar(char);
    setScreen("game");
    setIsLoading(true);
    setMessages([]);
    conversationRef.current = [];
    try {
      const reply = await callClaude(`The player is playing as ${char.name.toUpperCase()}. Pick a random starting location (NOT the penthouse unless it's been a while) and begin the opening sequence now. Remember: one short paragraph, then a mischief-igniting question from a character, then a) b) c) d) choices.`);
      setMessages([{ type: "game", text: reply }]);
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
        max_tokens: 600,
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
    if (!trimmed || isLoading) return;
    setInput("");
    setIsLoading(true);
    setMessages((p) => [...p, { type: "player", text: trimmed }]);
    try {
      const reply = await callClaude(trimmed);
      setMessages((p) => [...p, { type: "game", text: reply }]);
    } catch {
      setMessages((p) => [...p, { type: "error", text: "CONNECTION LOST. Try again." }]);
    }
    setIsLoading(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  const formatText = (text) => {
    return text.split("\n").map((line, i, arr) => {
      // Style the a) b) c) d) choices differently
      const isChoice = /^[a-d]\)/.test(line.trim());
      const isKarl = line.includes("KARL HAS ENTERED");
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i} style={
          isKarl ? { color: "#e85d4a", fontWeight: "bold", display: "block", margin: "8px 0", fontSize: "14px" } :
          isChoice ? { color: "#e8c97a", display: "block", marginTop: "6px", paddingLeft: "4px" } :
          {}
        }>
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

  const restart = () => { setScreen("title"); setMessages([]); conversationRef.current = []; };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'Courier New', monospace", position: "relative", overflow: "hidden" }}>
      {/* Subtle scanlines */}
      <div style={{ position: "fixed", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)", pointerEvents: "none", zIndex: 20 }} />
      {/* Soft vignette */}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.7) 100%)", pointerEvents: "none", zIndex: 19 }} />

      {screen === "title" && <TitleScreen onStart={() => setScreen("select")} />}
      {screen === "select" && <CharSelect characters={CHARACTERS} onSelect={startGame} hoveredChar={hoveredChar} setHoveredChar={setHoveredChar} />}
      {screen === "game" && (
        <GameScreen messages={messages} input={input} setInput={setInput} isLoading={isLoading}
          handleSubmit={handleSubmit} handleKey={handleKey} formatText={formatText}
          bottomRef={bottomRef} inputRef={inputRef} selectedChar={selectedChar} onRestart={restart} />
      )}

      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        @keyframes flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:0.82}94%{opacity:1}97%{opacity:0.9}98%{opacity:1}}
        @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(200,168,85,0.35)}50%{text-shadow:0 0 50px rgba(200,168,85,0.7),0 0 90px rgba(200,168,85,0.2)}}
        @keyframes scanIn{from{opacity:0;letter-spacing:0.8em}to{opacity:1;letter-spacing:0.38em}}
        @keyframes cardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes dots{0%,80%,100%{opacity:0.2;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}
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
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", width: "100%", maxWidth: "920px", margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 10 }}>
      <div style={{ textAlign: "center", marginBottom: "44px" }}>
        <div style={{ color: "rgba(220,185,100,0.45)", fontSize: "10px", letterSpacing: "0.42em", textTransform: "uppercase", marginBottom: "12px" }}>SELECT YOUR CHARACTER</div>
        <div style={{ color: "#dbb96a", fontSize: "20px", letterSpacing: "0.1em", textShadow: "0 0 20px rgba(200,168,85,0.35)" }}>Who are you tonight?</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "14px", width: "100%" }}>
        {characters.map((char, i) => {
          const rgb = hexToRgb(char.color);
          const isHov = hoveredChar === char.id;
          return (
            <button key={char.id} onClick={() => onSelect(char)} onMouseEnter={() => setHoveredChar(char.id)} onMouseLeave={() => setHoveredChar(null)}
              style={{ background: isHov ? `rgba(${rgb},0.09)` : "rgba(255,255,255,0.03)", border: `1px solid ${isHov ? char.color : "rgba(220,185,100,0.15)"}`, borderRadius: "4px", padding: "22px 18px", cursor: "pointer", textAlign: "left", transition: "all 0.22s", animation: `cardIn 0.5s ease ${i * 0.07}s both`, boxShadow: isHov ? `0 0 28px rgba(${rgb},0.15)` : "none" }}>
              <div style={{ fontSize: "26px", marginBottom: "10px" }}>{char.emoji}</div>
              <div style={{ color: isHov ? char.color : "#dbb96a", fontSize: "15px", fontWeight: "bold", letterSpacing: "0.1em", marginBottom: "8px", transition: "color 0.2s" }}>{char.name.toUpperCase()}</div>
              <div style={{ color: "rgba(220,185,100,0.6)", fontSize: "11px", lineHeight: "1.75", letterSpacing: "0.025em" }}>{char.desc}</div>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: "36px", color: "rgba(220,185,100,0.22)", fontSize: "10px", letterSpacing: "0.18em" }}>
        All characters are equal · Garnet becomes Karl after 5 rounds
      </div>
    </div>
  );
}

function GameScreen({ messages, input, setInput, isLoading, handleSubmit, handleKey, formatText, bottomRef, inputRef, selectedChar, onRestart }) {
  return (
    <div style={{ width: "100%", maxWidth: "820px", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 10 }}>
      {/* Header */}
      <div style={{ padding: "16px 28px 12px", borderBottom: "1px solid rgba(220,185,100,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ color: "rgba(220,185,100,0.4)", fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: "3px" }}>Vancouver DTES Adventures</div>
          <div style={{ color: "#dbb96a", fontSize: "14px", fontWeight: "bold", letterSpacing: "0.08em" }}>
            {selectedChar?.emoji} {selectedChar?.name.toUpperCase() || "GARNET"}
          </div>
        </div>
        <button onClick={onRestart} style={{ background: "transparent", border: "1px solid rgba(220,185,100,0.2)", color: "rgba(220,185,100,0.45)", fontSize: "10px", letterSpacing: "0.14em", padding: "6px 12px", cursor: "pointer", fontFamily: "'Courier New',monospace", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(220,185,100,0.6)"; e.currentTarget.style.color = "#dbb96a"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(220,185,100,0.2)"; e.currentTarget.style.color = "rgba(220,185,100,0.45)"; }}>
          ↩ TITLE
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: "28px 28px 12px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {messages.length === 0 && isLoading && (
          <div style={{ color: "rgba(220,185,100,0.4)", fontSize: "11px", letterSpacing: "0.28em" }}>LOADING SCENARIO...</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "24px", animation: "fadeIn 0.3s ease" }}>
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
          <div style={{ paddingLeft: "16px", borderLeft: "2px solid rgba(220,185,100,0.2)", marginLeft: "4px", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "4px 0" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#dbb96a", animation: `dots 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "10px 28px 22px", borderTop: "1px solid rgba(220,185,100,0.1)", flexShrink: 0 }}>
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
    </div>
  );
}