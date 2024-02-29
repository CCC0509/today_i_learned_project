import { useEffect, useState } from "react";
import "./style/style.css";
import supabase from "./supabase";
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
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("Loading...");
  const [currentCat, setCat] = useState("all");
  const [isUpLoading, setIsUpLoading] = useState(false);
  //get data from supabase
  useEffect(() => {
    let getData = async () => {
      setLoading(true);
      let query = supabase.from("facts").select("*");
      if (currentCat !== "all") {
        query = query.eq("category", currentCat);
      }
      let { data: facts, error } = await query.order("votesInteresting", {
        ascending: false,
      });
      //error handle
      if (!error) {
        setNewFact(facts);
        setLoading(false);
      } else {
        setError("Something goes wrong...");
      }
    };
    getData();
  }, [currentCat]);

  return (
    <>
      <Header form={form} setForm={setForm} />
      {form ? (
        <Form
          isUpLoading={isUpLoading}
          setIsUpLoading={setIsUpLoading}
          newFact={newFact}
          setNewFact={setNewFact}
        />
      ) : null}

      <main className="main">
        <Aside setCat={setCat} />
        {isLoading ? (
          <Loader error={error} />
        ) : (
          <Fact newFact={newFact} setNewFact={setNewFact} />
        )}
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
      {/* form appearance */}
      <button className="coiny btn btn-large" onClick={() => setForm(!form)}>
        {form ? "close" : "Share a fact"}
      </button>
    </header>
  );
}

function Form({ isUpLoading, setIsUpLoading, newFact, setNewFact }) {
  //get the data from form input
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");

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
  async function handleSubmit(e) {
    e.preventDefault();

    if (text && isValidHttpUrl(source) && category && text.length <= 200) {
      //disable input while is uploding
      setIsUpLoading(true);
      //create insert new fact to database
      const { data, error } = await supabase
        .from("facts")
        .insert([
          {
            text,
            source,
            category,
            created_at: new Date(),
          },
        ])
        .select();
      //if data insert success
      if (!error) {
        //render data immediately
        setNewFact([data[0], ...newFact]);
      }
      setIsUpLoading(false);
      //reset input
      setText("");
      setSource("");
      setCategory("");
    }
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
        disabled={isUpLoading}
      />
      <span className="sono">{200 - text.length}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        className="sono"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        required
        disabled={isUpLoading}
      />
      <select
        className="sono"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
        required
        disabled={isUpLoading}
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

function Aside({ setCat }) {
  return (
    <aside id="catergory">
      <ul>
        <li>
          <button
            className="coiny btn btn-all-catergory"
            onClick={() => setCat("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => {
          return (
            <li key={cat.name}>
              <button
                className="coiny btn btn-catergory"
                style={{ backgroundColor: cat.color }}
                onClick={() => setCat(cat.name)}
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
//rendering fact
function Fact({ newFact, setNewFact }) {
  if (newFact.length == 0) {
    return (
      <p className=" sono">
        No facts for this catagory yet ! Come create one🤩
      </p>
    );
  }
  return (
    <section>
      <ul>
        {newFact.map((fact) => {
          return <FactList key={fact.id} fact={fact} setNewFact={setNewFact} />;
        })}
      </ul>
      <p className="sono">
        There are {newFact.length} in the database.Add your own !
      </p>
    </section>
  );
}
//loader animation
function Loader({ error }) {
  return <p className="card sono">{error}</p>;
}

function FactList({ fact, setNewFact }) {
  let [isUpLoading, setIsUpLoading] = useState(false);
  let isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;
  //update the number of button
  async function handleClick(str) {
    setIsUpLoading(true);
    let { data, error } = await supabase
      .from("facts")
      .update({ [str]: fact[str] + 1 })
      .eq("id", fact.id)
      .select();
    if (!error) {
      //render data immediately
      setNewFact((facts) => facts.map((f) => (f.id === fact.id ? data[0] : f)));
      setIsUpLoading(false);
    }
  }
  return (
    <li className="fact">
      <p className="sono">
        {isDisputed ? <sapn className="disputed">[⛔️DISPUTED]</sapn> : null}
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
        <button
          onClick={() => {
            handleClick("votesInteresting");
          }}
          disabled={isUpLoading}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => {
            handleClick("votesMindblowing");
          }}
          disabled={isUpLoading}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button
          onClick={() => {
            handleClick("votesFalse");
          }}
          disabled={isUpLoading}
        >
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
