import express from "express";
import { z } from "zod";
import { todoCollection } from "../db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

const TodoSchema = z.object({
  task: z.string(),
  checked: z.boolean(),
});

let todos = [
  { id: 1, task: "Do Activity", checked: false },
  { id: 2, task: "Go to Church", checked: true },
  { id: 3, task: "Code", checked: false },
];

// GET /todos
router.get("/", async (req, res) => {
  const todos = await todoCollection.find().toArray();
  res.status(200).send(todos);
});

// GET /todos/:id
router.get("/:id", async (req, res) => {
  const todoId = req.params.id;
  const foundIndex = await todoCollection.findOne(new ObjectId(todoId));

  if (foundIndex === null) {
    res.status(404).send("Not Found");
  } else {
    res.status(200).send(foundIndex);
  }
});

// POST /todos - { "task": "Make a wish" }
// POST /todos - { "stuff": "" }
router.post("/", async (req, res) => {
  const newTodo = req.body;
  const parsedResult = TodoSchema.safeParse(newTodo);

  if (!parsedResult.success) {
    return res.status(400).send(parsedResult.error);
  }

  const result = await todoCollection.insertOne(parsedResult.data);
  const { insertedId } = result;
  const todoItem = await todoCollection.findOne({
    _id: new ObjectId(insertedId),
  });
  res.status(201).send(todoItem);
});

// PATCH /todos/:id - { "checked": true }
// PATCH /todos/:id - { "checked": "" }
let counter = 0;
async function simulateSlowServer() {
  return new Promise((resolve, reject) => {
    counter += 1;
    console.log(counter);
    setTimeout(() => resolve(), (counter % 3) * 1000);
  });
}
router.patch("/:id", async (req, res) => {
  const todoId = req.params.id;
  const { checked } = req.body;

  await simulateSlowServer();

  if (!ObjectId.isValid(todoId)) return res.status(400).send("Invalid ID");

  const foundTodoItem = await todoCollection.findOne({
    _id: new ObjectId(todoId),
  });
  if (foundTodoItem == null) return res.status(404).send("Not Found");

  const parsedResult = TodoSchema.safeParse({ ...foundTodoItem, checked });
  if (!parsedResult.success) return res.status(400).send(parsedResult.error);

  await todoCollection.updateOne(
    { _id: new ObjectId(todoId) },
    { $set: { checked } }
  );
  const todoItem = await todoCollection.findOne({ _id: new ObjectId(todoId) });
  res.status(200).send(todoItem);
});
// DELETE /todos
router.delete("/", async (req, res) => {
  await todoCollection.deleteMany({});
  res.status(204).send();
});

// DELETE /todos/:id
router.delete("/:id", async (req, res) => {
  const todoId = req.params.id;

  if (!ObjectId.isValid(todoId)) return res.status(400).send("Invalid ID");

  const foundTodoItem = await todoCollection.findOne({
    _id: new ObjectId(todoId),
  });
  if (foundTodoItem == null) return res.status(404).send("Not Found");

  await todoCollection.deleteOne({ _id: new ObjectId(todoId) });
  res.status(204).send();
});

export default router;
