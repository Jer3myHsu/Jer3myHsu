"use strict";
const log = console.log;
log("Express server");

const express = require("express");
const fs = require("fs");

const app = express();

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createDeck() {
	const deck = [];
	const nonNumberValue = ["A", "J", "Q", "K"];
	const suite = ["spade", "diamond", "club", "heart"]
	for (let i = 0; i < 52; i++) {
		deck.push({
			value: (i % 13 < 1 || i % 13 > 9) ? nonNumberValue[(i % 13) % 9] : i % 13 + 1,
			suite: suite[Math.floor(i / 13)]
		});
	}
	return deck;
}

app.get("/cards", function (req, res) {
  const deck = createDeck();
  const svg = fs.readFileSync(__dirname + "/images/template.svg", 'utf8').split("(breakpoint)");
  let output = svg[0];
  const cards = [];
  for (let i = 1; i <= 15; i += 3) {
    const cardIndex = random(0, 51 - Math.floor((i - 1) / 3));
    const card = deck[cardIndex];
    cards.push(card);
    deck.splice(cardIndex, 1);
	  if (["heart", "diamond"].includes(card.suite)) {
      output += "red";
    }
    output += svg[i];
    output += card.value;
    output += svg[i + 1];
    output += card.suite + ".svg";
    output += svg[i + 2];
  }
  output += svg[16];
  fs.writeFileSync(__dirname + "/images/output.svg", output);
  res.sendFile(__dirname + "/images/output.svg");
});

app.get("/:image", function (req, res) {
  res.sendFile(__dirname + "/images/" + req.params.image);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  log(`Listening on port ${port}...`);
});
