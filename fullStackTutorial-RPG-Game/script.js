//single line comment
/*
multi line comment
*/

let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

//adding weapons
const weapons = [
  {
    name: "Stick",
    power: 5
  },

  {
    name: "Gold Dagger",
    power: 25
  },

  {
    name: "Axe",
    power: 50
  },

  {
    name: "Katana",
    power: 100
  }
];

//adding monsters
const monster = [
  {
    name: "Goblin",
    level: 2,
    health: 50
  },

  {
    name: "Fanged Beast",
    level: 8,
    health: 250
  },

  {
    name: "Dragon",
    level: 20,
    health: 500
  }
];

//adding locations
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store.\""
  },

  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You've entered the store."
  },

  {
    name: "cave",
    "button text": ["Fight goblin", "Fight fanged beast", "Go to town square"],
    "button functions": [fightGoblin, fightBeast, goTown],
    text: "You've entered the cave. You see some monsters."
  },

  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster."
  },

  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: "The monster screams \"Arg!\" as it dies. You gain xp points and gold."
  },

  {
    name: "lose",
    "button text": ["Replay?", "Replay?", "Replay?"],
    "button functions": [restart, restart, restart],
    text: "Wasted."
  },

  {
    name: "win",
    "button text": ["Replay?", "Replay?", "Replay?"],
    "button functions": [restart, restart, restart],
    text: "You defeated the dragon! You've completed the game!"
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If your number matched you WON!!"

  }
];

//initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = /*"Go to Store"*/ location["button text"][0];
  button2.innerText = /*"Go to cave"*/ location["button text"][1];
  button3.innerText = /*"Fight dragon"*/ location["button text"][2];
  button1.onclick = /*goStore*/ location["button functions"][0];
  button2.onclick = /*goCave*/ location["button functions"][1];
  button3.onclick = /*fightDragon*/ location["button functions"][2];
  text.innerText = location.text;
}
function goTown() {
  update(locations[0]);
}
function goStore() {
  update(locations[1]);
}
function goCave() {
  update(locations[2]);
}
function buyHealth() {
  if (gold >= 10) {
    gold = gold - 10;
    health = health + 25;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innertext = "You don't have enough gold to buy health.";
  }
}
function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}
function sellWeapon() {
  if (inventory.length > 1) {
    gold = gold + 15;
    goldText.innertext = gold;
    let currentWeapon = inventory.shift();
    text.innertext = "You sold a " + currentWeapon + ".";
    text.innertext = "In your inventory you have: " + inventory;
  } else {
    text.innertext = "Fighting monsters without a weapon is a death wish!";
  }
}
function fightGoblin() {
  fighting = 0;
  goFight();
}
function fightBeast() {
  fighting = 1;
  goFight();
}
function fightDragon() {
  fighting = 2;
  goFight();
}
function goFight() {
  update(locations[3]);
  monsterHealth = monster[fighting].health;
  monsterStats.style.display = "block";
  monsterNameText.innerText = monster[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}
function attack() {
  text.innertext = "The" + monster[fighting].name + "has seen you, fight!.";
  text.innertext = "You fight it with your" + weapons[currentWeapon].name + ".";
  if (isMonsterHit()) {
    health = health - getMonsterAttackValue(monster[fighting].level);
  } else {
    text.innertext = "You miss.";
  }
  monsterHealth = monsterHealth - weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster();
  }
  if (Math.random() <= .2 && inventory.length !== 1) {
    text.innertext += "Your" + inventory.pop() + "breaks.";
    currentWeapon--;
  }
}
function isMonsterHit() {
  return Math.random() > 0.35 || health < 10;
}
function getMonsterAttackValue(level) {
  let hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit); return hit;
}
function dodge() {
  text.innertext = "You're too quick!, you dodged the attack from the" + monster[fighting].name + ".";

}
function defeatMonster() {
  gold = gold + Math.floor(monster[fighting].level * 6.7);
  xp = xp + monster[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}
function lose() {
  update(locations[5]);
}
function winGame() {
  update(locations[6]);
}
function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}
function easterEgg() {
  update(locations[7]);
}
function pickTwo() {
  pick(2);
}
function pickEight() {
  pick(8);
}
function pick(guess) {
  let numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.indexOf(guess) !== -1) {
    text.innerText += "Right! You win 20 gold!"
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!"
    health -= 10;
    healthText.innerText = health
    if (health <= 0) {
      lose();
    }
  }
}