const tingleButton = document.querySelector("#tingle");
const form = document.querySelector("#tingle-form");
const num = document.querySelector("#num");
const share = document.querySelector("#share-fact");
const catergoryButton = document.querySelector("#catergory");

//form display
tingleButton.addEventListener("click", (e) => {
  if (form.getAttribute("style") == "display: none") {
    form.removeAttribute("style");
    tingleButton.textContent = "close";
  } else {
    form.setAttribute("style", "display: none");
    tingleButton.textContent = "Share a fact";
  }
});

//share-fact word count
share.addEventListener("keydown", (e) => {
  let originalValue = e.target.value.length;
  console.log(originalValue);
  setTimeout(() => {
    let newValue = e.target.value.length;
    console.log(newValue);
    let total = parseInt(num.textContent);
    if (originalValue < newValue) {
      total--;
    } else {
      total++;
    }
    num.textContent = total.toString();
  }, 1);
});

//add catergory button by javascript
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
catergoryButton.innerHTML = "";
let allCategories = CATEGORIES.map((ele) => {
  return ele.name;
});

catergoryButton.insertAdjacentHTML(
  "afterbegin",
  `<li>
<button class="coiny btn btn-all-catergory">All</button>
</li>`
);
let categoriesHtml = allCategories.map((ele) => {
  return `<li>
<button class="coiny btn btn-catergory ${ele}">
${ele}
</button>
</li>`;
});
let html = categoriesHtml.join("");
catergoryButton.insertAdjacentHTML("beforeend", html);

//connect datebase
const res = await fetch(
  "https://dbxnteypzchcfnwqyirn.supabase.co/rest/v1/facts",
  {
    headers: {
      apikey: "",
      Authorization: "",
    },
  }
);
//insert data from database
const factList = document.querySelector("#fact-list");
factList.innerHTML = "";
let data = await res.json();
createFactList(data);

function createFactList(arr) {
  let listHtml = data.map((ele) => {
    return `<li class="fact">
  <p class="sono">
    ${ele.text}<a
      href="${ele.source}"
      target="_blank"
      class="source"
      >(Source)</a
    >
  </p>
  <span class="coiny catergory ${ele.catergory}">${ele.catergory}</span>
  <div class="vote-button">
    <button>👍 ${ele.votesInteresting}</button>
    <button>🤯 ${ele.votesMindBlowing}</button>
    <button>⛔️ ${ele.votesFalse}</button>
  </div>
</li>`;
  });

  let newListHtml = listHtml.join("");

  return factList.insertAdjacentHTML("afterbegin", newListHtml);
}
