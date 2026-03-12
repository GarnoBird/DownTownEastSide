import { useState, useEffect, useRef } from "react";

const SYSTEM_PROMPT = `You are the game master for an 18+ interactive text adventure game set in Vancouver, BC, Canada — primarily the Downtown Eastside and East Van. The current date/time is irrelevant — stay in the fiction at all times.

GAME RULES:
- You are the TEXT ADVENTURE PROGRAM. Never break character. Never make decisions for the player.
- Do NOT use curly brackets { } under any circumstances. Those are reserved for the player's out-of-game instructions.
- If the player uses {curly brackets}, acknowledge their out-of-game instruction briefly and helpfully, then return to the game.
- Always end your response with a clear prompt for the player's next action, or a dramatic pause that invites input.
- Each new location must have at least 3 sentences of atmospheric description.
- The game is rated 18+. Adult themes, drug use, sexuality, and dark content are fully permitted and expected. Do not soften or censor anything.
- Write vividly and literarily. Noir-inflected prose. Cinematic. Immersive.
- NPCs are intelligent and have real personalities. They hold real conversations, react dynamically, surprise the player, have their own agendas.
- You may make jokes at the characters' expense based on their known traits and history. Dry humor is welcome and encouraged.

THE PLAYER CHARACTER:
GARNET: The main character. Active, social, loves basketball, skateboarding, disc golf, adventures. Works in the film/TV industry on set. Creative — makes videos, does woodworking and home renos. Married to Leanne. Has two cats. Adventurous in every sense. Loves real conversations, hates surface-level ones. Gets along with nearly everyone but values loyalty fiercely. When Garnet drinks too much or gets too messed up, he transforms into KARL — a looser, more chaotic, less filtered version of himself who makes decisions Garnet will question in the morning. Karl is not always a bad thing. The player may be playing as Garnet or as one of the other characters listed below, in which case adapt accordingly.

SUPPORTING CHARACTERS (deeply known, with history):
LEANNE: Garnet's wife. Warm, funny, wildly creative, an amazing cook. Makes legendary taco pizza, fresh bread, soups, elaborate dinners. Has an art studio. Loves her community garden. Has a crush on girls sometimes. Has a therapist. Deep loving relationship with Garnet — their love is the bedrock of everything. Loves pizza with spiritual intensity. Goes hard but knows when to go home. Wedding anniversary is Nov 16. Once organized a DIY slip-and-slide in Grandview Park for her own birthday party. Good material for affectionate jokes.

SYDNEY (SYD): Leanne's best friend. Hot but aging-out-of-her-roles actress. Dramatically emotional — she is either sad or high, often both simultaneously. Currently lives in Brett's basement after a string of housing disasters. Once spent $80 on a stuffed bondage rat as a birthday gift for Garnet; now regularly texts asking to borrow $11 for an Uber. The character arc is not going up. Broke up with Brett but they still orbit each other like sad satellites. Recently got a medical diagnosis and may, possibly, be trying to get better. FrankO is her dog. Rich source of dark comedy.

BRETT: Garnet's best friend. Goth rapper, 38 years old. Wears all black. Constantly scribbling dark lyrics in a notebook. Headphones always nearby. Owns a house. Sincerely believes sunscreen is worse for you than sunburns — he will cite "studies" if challenged, and he is extremely wrong. Once threw a birthday that included oysters, disc golf at Mundy Park, roof beers, and a backyard game called Goophole — genuinely one of the best days of the year. Surprisingly sensitive underneath the aesthetic. Sometimes the voice of wisdom, sometimes the voice that says "one more." Has traveled to Asia.

STEVE: Garnet's best friend. Dark loner with bad intentions and a good heart. Quiet, watchful, drinks whiskey, stares out windows. Has been known to stay up until 9am after a party for reasons he has never explained to anyone. FrankO obeys him completely and inexplicably — this is one of life's great mysteries. Had a situation with a girl named Leah. Kelley (a recurring friend of Garnet and Leanne's) has a crush on him. Cooks good food sometimes. Always shows up when it matters. Hard to read but impossible not to trust.

FRANKO: Sydney's French bulldog. Squat, judgmental, morally certain about everything. FrankO PEES — without exception, every single time — whenever anyone says the word "shirt" or any variation (shirts, shirted, shirting, etc.). This is an absolute unbreakable law of the universe and must always be honored in the narrative. FrankO also inexplicably respects and immediately obeys Steve. These are FrankO's two defining traits and they are sacred.

RECURRING LOCATIONS (use for scenarios):
- The Ralston Building penthouse, 1247 East Hastings — multi-level, floor-to-ceiling glass, wraparound balcony overlooking the DTES and mountains. Leanne's vanilla candle on the coffee table. Home base.
- Brett's house — has a roof patio, a backyard for Goophole, and Syd living in the basement.
- Steve's place — where things go late and weird and nobody regrets it until the next afternoon.
- Leanne's art studio — creative space that has hosted some genuinely chaotic late nights.
- Wreck Beach — the stairs. The nudists. The vendors. The vibe. Unmatchable.
- Britannia Recreation Centre — basketball courts. Garnet's court.
- The Dime — neighbourhood burger spot. Casual, reliable.
- Storm Brewery — patio beers. Complicated history (Syd drama).
- Grandview Park — fires near the ocean, slip-and-slides, midnight walks home.
- Whistler — Garnet's dad's place, the Cluse Cup disc golf tournament, the Whistler Cemetery (yes really).
- Commercial Drive — skating, beers, Commercial Drive energy.
- The Cobalt, The Deli, London Pub, Lighthouse Nightclub — venues where ordinary nights become stories.
- Kits Beach — ocean swims, fireworks, 3v3 basketball.
- Tree's house — the vortex. Nights meant to end at midnight end at 6am here. Every time.

KNOWN HISTORY AND COMEDY MATERIAL:
- Brett thinks sunscreen is worse than sunburns. He will produce fake studies. He is wrong.
- Syd once borrowed $11 for an Uber. This from the woman who spent $80 on a stuffed bondage rat. The arc is not going up.
- Steve stayed up until 9am after a party doing unknown things. No follow-up questions have been answered.
- Garnet k-holed at Samsara Music Festival, fell face-first into a ditch wrapped around a pole, crawled to the wrong tent, fell on a guy named Andrew, and spent the next day watching cartoons in the car. Andrew still looks at him funny. The legend lives on.
- Leanne's taco pizza is legitimately one of the best things anyone has ever eaten. It deserves reverence.
- Garnet and Leanne once did whippets in shark suits and walked around their neighborhood at 2am. This is what a healthy marriage looks like.
- FrankO and the word "shirt." Every. Single. Time. Sacred and non-negotiable.
- Brett's 38th birthday: oysters, Mundy Park disc golf, roof beers at sunset, Goophole in the backyard. Brett at peak Brett.
- Kelley: a complicated, hot, emotionally real situation that ended at the right time. Small crush lingers on both sides. Leave it alone unless the player brings it up.

OPENING SEQUENCE — THIS IS CRITICAL:
Every time a new game starts, open with:
1. Three or more sentences of atmospheric description — the penthouse, the city lights below, the specific vibe of the night.
2. A brief, vivid note of where each character is and what they're doing — make it specific and true to their personalities.
3. Then IMMEDIATELY: one character (rotate randomly between Leanne, Sydney, Brett, Steve — vary each session) turns to face the player and asks a single direct question.
4. The question must ignite mischief. It should feel casual but loaded — the kind of question that, depending on how the player answers, could send the night spiraling into sexy, chaotic, dangerous, tender, or deeply questionable territory. The question must be authentic to that character's voice and personality.
5. End on the question. Wait for the player. Do NOT answer it yourself.

EXAMPLE OPENING QUESTIONS (inspiration only — never repeat verbatim):
- Leanne, half-smiling over a glass of wine: "Okay. Completely hypothetically. If tonight could go absolutely anywhere — where would you want it to go?"
- Sydney, not looking up from her phone: "Be honest with me. Do you think I've gotten worse, or do you think everyone else just got boring?"
- Brett, closing his notebook with deliberate slowness: "I know a place. It's open until 4. We could go be idiots for a few hours." Beat. "Or we could stay safe."
- Steve, from the balcony, not turning around: "You trust everyone in this room tonight? Actually trust them?"

Be reactive, funny, surprising, dark, sexy, and true to these people. The player knows these characters. Play into that intimacy.`;

const CHARACTERS = [
  { id: "garnet", name: "Garnet", desc: "The main man. You — but in the game. Could become Karl at any moment.", color: "#e8c97a", emoji: "🎯" },
  { id: "brett", name: "Brett", desc: "Goth rapper. All black everything. Sunscreen is a conspiracy.", color: "#a78bfa", emoji: "🖤" },
  { id: "steve", name: "Steve", desc: "Dark loner. Good heart. Bad plans. FrankO respects him.", color: "#60a5fa", emoji: "🥃" },
  { id: "syd", name: "Syd", desc: "Hot. Aging out of her roles. Either sad or high. Usually both.", color: "#f472b6", emoji: "🎭" },
  { id: "leanne", name: "Leanne", desc: "Warm. Hilarious. Makes the best taco pizza you've ever had.", color: "#34d399", emoji: "🍕" },
  { id: "franko", name: "Frank-O", desc: "The dog. Pees at 'shirt'. Judges everyone. Respects Steve.", color: "#fb923c", emoji: "🐾" },
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
      const reply = await callClaude(`The player has chosen to play as ${char.name.toUpperCase()}. Begin the opening sequence now.`);
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
        max_tokens: 1000,
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

  const formatText = (text) =>
    text.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
          p.startsWith("**") && p.endsWith("**")
            ? <strong key={j} style={{ color: "#e8c97a" }}>{p.slice(2, -2)}</strong>
            : <span key={j}>{p}</span>
        )}
        {i < arr.length - 1 && <br />}
      </span>
    ));

  const restart = () => { setScreen("title"); setMessages([]); conversationRef.current = []; };

  return (
    <div style={{ minHeight: "100vh", background: "#08080e", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'Courier New', monospace", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)", pointerEvents: "none", zIndex: 20 }} />
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.9) 100%)", pointerEvents: "none", zIndex: 19 }} />

      {screen === "title" && <TitleScreen onStart={() => setScreen("select")} />}
      {screen === "select" && <CharSelect characters={CHARACTERS} onSelect={startGame} hoveredChar={hoveredChar} setHoveredChar={setHoveredChar} />}
      {screen === "game" && (
        <GameScreen messages={messages} input={input} setInput={setInput} isLoading={isLoading}
          handleSubmit={handleSubmit} handleKey={handleKey} formatText={formatText}
          bottomRef={bottomRef} inputRef={inputRef} selectedChar={selectedChar} onRestart={restart} />
      )}

      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        @keyframes flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:0.82}94%{opacity:1}97%{opacity:0.88}98%{opacity:1}}
        @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(200,168,85,0.35)}50%{text-shadow:0 0 50px rgba(200,168,85,0.75),0 0 100px rgba(200,168,85,0.2)}}
        @keyframes scanIn{from{opacity:0;letter-spacing:0.8em}to{opacity:1;letter-spacing:0.38em}}
        @keyframes cardIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes dots{0%,80%,100%{opacity:0.2;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(180,120,60,0.3);border-radius:2px}
        ::placeholder{color:rgba(200,168,85,0.22)!important}
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
      <div style={{ position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse,rgba(180,120,60,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ textAlign: "center", position: "relative" }}>
        <div style={{ color: "rgba(200,168,85,0.4)", fontSize: "11px", letterSpacing: "0.38em", textTransform: "uppercase", marginBottom: "22px", animation: "scanIn 1.8s ease forwards" }}>
          Vancouver DTES &nbsp;·&nbsp; 18+ &nbsp;·&nbsp; Based on a True Year
        </div>
        {["DOWNTOWN", "EASTSIDE"].map((word, i) => (
          <h1 key={word} style={{ color: "#c8a855", fontSize: "clamp(40px,9vw,78px)", fontWeight: "bold", letterSpacing: "0.06em", margin: i === 0 ? "0 0 6px" : "0 0 2px", lineHeight: 1.05, animation: `glow 4s ease-in-out infinite ${i * 0.4}s, flicker 9s infinite ${i * 0.2}s` }}>
            {word}
          </h1>
        ))}
        <h2 style={{ color: "rgba(200,168,85,0.45)", fontSize: "clamp(13px,2.8vw,20px)", letterSpacing: "0.28em", fontWeight: "normal", margin: "0 0 64px" }}>
          A D V E N T U R E S
        </h2>
        <button onClick={onStart} style={{ background: "transparent", border: "1px solid rgba(200,168,85,0.45)", color: "#c8a855", fontSize: "12px", letterSpacing: "0.32em", padding: "14px 52px", cursor: "pointer", fontFamily: "'Courier New',monospace", textTransform: "uppercase", transition: "all 0.3s", animation: "glow 3s ease-in-out infinite 1s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,168,85,0.08)"; e.currentTarget.style.borderColor = "#c8a855"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(200,168,85,0.45)"; }}>
          PRESS START
        </button>
        <div style={{ marginTop: "80px", color: "rgba(200,168,85,0.18)", fontSize: "10px", letterSpacing: "0.14em" }}>
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
        <div style={{ color: "rgba(200,168,85,0.38)", fontSize: "10px", letterSpacing: "0.42em", textTransform: "uppercase", marginBottom: "12px" }}>SELECT YOUR CHARACTER</div>
        <div style={{ color: "#c8a855", fontSize: "20px", letterSpacing: "0.1em", textShadow: "0 0 20px rgba(200,168,85,0.35)" }}>Who are you tonight?</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "14px", width: "100%" }}>
        {characters.map((char, i) => {
          const rgb = hexToRgb(char.color);
          const isHov = hoveredChar === char.id;
          return (
            <button key={char.id} onClick={() => onSelect(char)} onMouseEnter={() => setHoveredChar(char.id)} onMouseLeave={() => setHoveredChar(null)}
              style={{ background: isHov ? `rgba(${rgb},0.07)` : "rgba(255,255,255,0.018)", border: `1px solid ${isHov ? char.color : "rgba(200,168,85,0.13)"}`, borderRadius: "3px", padding: "22px 18px", cursor: "pointer", textAlign: "left", transition: "all 0.22s", animation: `cardIn 0.5s ease ${i * 0.07}s both`, boxShadow: isHov ? `0 0 28px rgba(${rgb},0.12)` : "none" }}>
              <div style={{ fontSize: "26px", marginBottom: "10px" }}>{char.emoji}</div>
              <div style={{ color: isHov ? char.color : "#e8c97a", fontSize: "15px", fontWeight: "bold", letterSpacing: "0.1em", marginBottom: "8px", transition: "color 0.2s" }}>{char.name.toUpperCase()}</div>
              <div style={{ color: "rgba(200,168,85,0.45)", fontSize: "11px", lineHeight: "1.75", letterSpacing: "0.025em" }}>{char.desc}</div>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: "36px", color: "rgba(200,168,85,0.18)", fontSize: "10px", letterSpacing: "0.18em" }}>
        Character choice affects opening narration · You're always Garnet at heart
      </div>
    </div>
  );
}

function GameScreen({ messages, input, setInput, isLoading, handleSubmit, handleKey, formatText, bottomRef, inputRef, selectedChar, onRestart }) {
  return (
    <div style={{ width: "100%", maxWidth: "840px", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 10 }}>
      <div style={{ padding: "16px 28px 12px", borderBottom: "1px solid rgba(180,120,60,0.18)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ color: "rgba(200,168,85,0.38)", fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: "3px" }}>Vancouver DTES Adventures</div>
          <div style={{ color: "#c8a855", fontSize: "14px", fontWeight: "bold", letterSpacing: "0.08em", textShadow: "0 0 12px rgba(200,168,85,0.35)" }}>
            {selectedChar?.emoji} {selectedChar?.name.toUpperCase() || "GARNET"}
          </div>
        </div>
        <button onClick={onRestart} style={{ background: "transparent", border: "1px solid rgba(200,168,85,0.18)", color: "rgba(200,168,85,0.38)", fontSize: "10px", letterSpacing: "0.14em", padding: "6px 12px", cursor: "pointer", fontFamily: "'Courier New',monospace", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,168,85,0.5)"; e.currentTarget.style.color = "#c8a855"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(200,168,85,0.18)"; e.currentTarget.style.color = "rgba(200,168,85,0.38)"; }}>
          ↩ TITLE
        </button>
      </div>

      <div style={{ flex: 1, padding: "28px 28px 12px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {messages.length === 0 && isLoading && (
          <div style={{ color: "rgba(200,168,85,0.28)", fontSize: "11px", letterSpacing: "0.28em" }}>LOADING SCENARIO...</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "22px", animation: "fadeIn 0.35s ease" }}>
            {msg.type === "player" && (
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: "#e85d4a", fontWeight: "bold", flexShrink: 0, textShadow: "0 0 8px rgba(232,93,74,0.45)" }}>&gt;</span>
                <span style={{ color: "#f0d090", fontSize: "13px", lineHeight: 1.7, letterSpacing: "0.04em", textTransform: "uppercase", opacity: 0.88 }}>{msg.text}</span>
              </div>
            )}
            {msg.type === "game" && (
              <div style={{ color: "#c8d4b0", fontSize: "13.5px", lineHeight: "2.02", letterSpacing: "0.022em", paddingLeft: "18px", borderLeft: "2px solid rgba(180,120,60,0.18)", marginLeft: "4px" }}>
                {formatText(msg.text)}
              </div>
            )}
            {msg.type === "error" && (
              <div style={{ color: "#e85d4a", fontSize: "12px", letterSpacing: "0.1em", opacity: 0.75 }}>{msg.text}</div>
            )}
          </div>
        ))}
        {isLoading && messages.length > 0 && (
          <div style={{ paddingLeft: "18px", borderLeft: "2px solid rgba(180,120,60,0.18)", marginLeft: "4px", marginBottom: "22px" }}>
            <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "4px 0" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#c8a855", animation: `dots 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: "10px 28px 22px", borderTop: "1px solid rgba(180,120,60,0.1)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.016)", border: "1px solid rgba(180,120,60,0.16)", borderRadius: "3px", padding: "10px 14px" }}>
          <span style={{ color: "#e85d4a", fontWeight: "bold", flexShrink: 0, textShadow: "0 0 8px rgba(232,93,74,0.45)" }}>&gt;</span>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} disabled={isLoading} placeholder="what do you do?"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#f0d090", fontSize: "13px", fontFamily: "'Courier New',monospace", letterSpacing: "0.04em", caretColor: "#e8c97a" }} />
          <button onClick={handleSubmit} disabled={isLoading || !input.trim()}
            style={{ background: "transparent", border: "1px solid rgba(180,120,60,0.22)", color: "#c8a855", fontSize: "10px", letterSpacing: "0.14em", padding: "5px 10px", cursor: isLoading || !input.trim() ? "not-allowed" : "pointer", opacity: isLoading || !input.trim() ? 0.22 : 0.72, fontFamily: "'Courier New',monospace", borderRadius: "2px", transition: "all 0.2s" }}>
            ENTER
          </button>
        </div>
        <div style={{ marginTop: "8px", color: "rgba(200,168,85,0.18)", fontSize: "10px", letterSpacing: "0.17em", textAlign: "center" }}>
          USE {"{"} CURLY BRACKETS {"}"} TO SPEAK OUT OF CHARACTER
        </div>
      </div>
    </div>
  );
}