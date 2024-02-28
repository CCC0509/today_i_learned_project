import { useEffect, useState } from "react";
import "./style/style.css";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];
//setting layout
function App() {
  //control form display
  const [form, setForm] = useState(false);
  const [newFact, setNewFact] = useState([]);

  return (
    <>
      <Header form={form} setForm={setForm} />
      {form ? <Form newFact={newFact} setNewFact={setNewFact} /> : null}

      <main className="main">
        <Aside />
        <Fact newFact={newFact} />
      </main>
    </>
  );
}

function Header({ form, setForm }) {
  return (
    <header className="logo">
      <div>
        <img src="./logo.png" alt="logo" />
        <h1 className="coiny">TODAY I LEARED</h1>
      </div>

      <button className="coiny btn btn-large" onClick={() => setForm(!form)}>
        {form ? "close" : "Share a fact"}
      </button>
    </header>
  );
}

function Form({ newFact, setNewFact }) {
  //get the data from form input
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [cat, setCat] = useState("");

  //check if url valid
  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  //send data to Fact
  function handleSubmit(e) {
    e.preventDefault();
    console.log(text, source, cat);
    if (text && isValidHttpUrl(source) && cat && text.length <= 200) {
      //create new fact data
      let newFactData = {
        id: Math.round(Math.random() * 100),
        text,
        source,
        category: cat,
        votesInteresting: 0,
        votesMindblowing: 0,
        votesFalse: 0,
        createdIn: new Date().getFullYear(),
      };
      setNewFact([...newFact, newFactData]);
    }
    //reset input
    setText("");
    setSource("");
    setCat("");
  }
  return (
    <form action="" autoComplete="off" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        className="sono first-input"
        id="share-fact"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <span className="sono">{200 - text.length}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        className="sono"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        required
      />
      <select
        className="sono"
        value={cat}
        onChange={(e) => {
          setCat(e.target.value);
        }}
        required
      >
        <option value="">Choose catergory</option>
        {CATEGORIES.map((cat) => {
          return (
            <option key={cat.name} value={cat.name}>
              {cat.name.toUpperCase()}
            </option>
          );
        })}
      </select>
      <button className="coiny btn btn-large">Post</button>
    </form>
  );
}

function Aside() {
  return (
    <aside id="catergory">
      <ul>
        <li>
          <button className="coiny btn btn-all-catergory">All</button>
        </li>
        {CATEGORIES.map((cat) => {
          return (
            <li key={cat.name}>
              <button
                className="coiny btn btn-catergory"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function Fact({ newFact }) {
  return (
    <section>
      <ul>
        {initialFacts.map((fact) => {
          return <FactList key={fact.id} fact={fact} />;
        })}
        {newFact.map((fact) => {
          return <FactList key={fact.id} fact={fact} />;
        })}
      </ul>
    </section>
  );
}

function FactList({ fact }) {
  return (
    <li className="fact">
      <p className="sono">
        {fact.text}
        <a href={fact.source} target="_blank" className="source">
          (Source)
        </a>
      </p>

      <span
        className="coiny catergory "
        style={{
          backgroundColor: CATEGORIES.find((cat) => {
            return cat.name == fact.category;
          }).color,
        }}
      >
        {fact.category}
      </span>

      <div className="vote-button">
        <button>👍 {fact.votesInteresting}</button>
        <button>🤯 {fact.votesMindblowing}</button>
        <button>⛔️ {fact.votesFalse}</button>
      </div>
    </li>
  );
}

export default App;
