const input = document.querySelector("#input");
const button = document.getElementById("add-task-btn");
const lists = document.querySelector(".quest-lists");
const checkBox = document.querySelectorAll(".checkbox");
const deleteBtn = document.querySelectorAll(".delete-btn");
const li = document.querySelectorAll("li");
const progress = document.querySelector(".level-graph");
const nextLevelText = document.querySelector(".next-level-txt p");
const cardsTxt = document.querySelector(".card-txts");
const cardP = document.querySelector(".card-paragraph");
const cardHeader = document.querySelector(".card-header");
const scoreXp = document.querySelector(".score-xp");

let todoArr = [];
let currentXP = 0;
let totalXP = 0;
let dailyMissionBonus = 0;
const maxXP = 100;

progress.max = maxXP;
progress.value = currentXP;

if (localStorage.getItem("tasks")) {
  todoArr = JSON.parse(localStorage.getItem("tasks"));
  todoArr.forEach((task) => {
    createTaskElement(task.text, task.completed);
  });
}

if (localStorage.getItem("dailyMissionBonus")) {
  dailyMissionBonus = JSON.parse(localStorage.getItem("dailyMissionBonus"));
}

function createTaskElement(text, completed = false) {
  const li = document.createElement("li");
  li.innerHTML = `<div class="checkbox-content"><input type="checkbox" ${
    completed ? "checked" : ""
  } /><span>${text}</span></div><button class="delete-btn">Delete</button>`;
  lists.appendChild(li);

  if (completed) {
    li.querySelector("span").style.textDecoration = "line-through";
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(todoArr));
}

button.addEventListener("click", () => {
  const value = input.value.replace(/ {2,}/g, " ").trim();
  if (!value) return;

  createTaskElement(value, false);
  input.value = "";

  todoArr.push({ text: value, completed: false });
  saveToLocalStorage();
  updateProgress();
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    button.click();
  }
});

lists.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const li = e.target.closest("li");
    if (li) {
      const span = li.querySelector("span");
      const taskText = span.textContent;

      todoArr = todoArr.filter((task) => task.text !== taskText);
      saveToLocalStorage();

      li.remove();
      updateProgress();
    }
  } else if (e.target.type === "checkbox") {
    const li = e.target.closest("li");
    const span = li.querySelector("span");
    const taskText = span.textContent;

    const task = todoArr.find((task) => task.text === taskText);
    if (task) {
      task.completed = e.target.checked;
      saveToLocalStorage();
      updateProgress();
      updateCounter();
    }

    span.style.textDecoration = e.target.checked ? "line-through" : "none";
  }

  updateCounter();
});

function updateProgress() {
  const completedCount = todoArr.filter((task) => task.completed).length;

  let baseXP = completedCount * 20;

  if (completedCount >= 3 && dailyMissionBonus === 0) {
    dailyMissionBonus = 20;
    localStorage.setItem(
      "dailyMissionBonus",
      JSON.stringify(dailyMissionBonus)
    );
  }

  if (completedCount >= 3) {
    totalXP = baseXP + dailyMissionBonus;
  } else {
    totalXP = baseXP;
  }

  currentXP = Math.min(totalXP, maxXP);

  progress.value = currentXP;
  nextLevelText.textContent = `Next level. ${currentXP}/${maxXP} XP`;
  scoreXp.textContent = `Total score: ${totalXP} XP`;

  saveToLocalStorage();
}

updateProgress();

function updateCounter() {
  let completedCount = todoArr.filter((task) => task.completed).length;

  const displayCount = Math.min(completedCount, 3);
  cardP.textContent = `${displayCount}/3 tasks completed!`;

  if (completedCount >= 3) {
    cardHeader.style.backgroundColor = "#53b03b";
  } else {
    cardHeader.style.backgroundColor = "#f3f6fb";
  }
}

updateCounter();
