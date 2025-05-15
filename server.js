const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();


app.get("/", (req, res) => {
  console.log("Here")
  res.send("Hello World !")
})

const port = 3000;

// Yhdistetään MongoDB:hen
mongoose.connect("mongodb://localhost/todolist", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB yhdistetty"))
  .catch((err) => console.log("Virhe MongoDB-yhteydessä:", err));

// JSON-datan käsittely
app.use(bodyParser.json());

// Palvelimen käynnistys
app.listen(port, () => {
  console.log(`Palvelin kuuntelee portissa ${port}`);
});


const Todo = require("./models/Todo");

// Luo uusi tehtävä
app.post("/todos", async (req, res) => {
  const { task } = req.body;
  try {
    const newTodo = new Todo({ task });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Hae kaikki tehtävät
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Päivitä tehtävä
app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ "completed": true });
    todo.completed = req.body.completed;
    await todo.save();
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Poista tehtävä
app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: "Tehtävää ei löydy" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
