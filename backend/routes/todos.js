import express from "express";
import { z } from "zod";

const router = express.Router();

const TodoSchema = z.object({
  id: z.number(),
  task: z.string(),
  checked: z.boolean(),
});

let todos = [
  { id: 1, task: "Do Activity", checked: false },
  { id: 2, task: "Go to Church", checked: true },
  { id: 3, task: "Code", checked: false },
];

// GET /todos
router.get("/", (req, res) => {
  res.status(200).send(todos);
});

// GET /todos/:id
router.get("/:id", (req, res) => {
  const todoId = req.params.id;

  const foundIndex = todos.findIndex((ti) => ti.id === Number(todoId));

  if (foundIndex === -1) {
    res.status(404).send("Not Found");
  } else {
    res.status(200).send(todos[foundIndex]);
  }
});

// POST /todos - { "task": "Make a wish" }
// POST /todos - { "stuff": "" }
router.post("/", (req, res) => {
  const newTodo = { ...req.body, id: new Date().getTime() };
  const parsedResult = TodoSchema.safeParse(newTodo);

  if (!parsedResult.success) {
    return res.status(400).send(parsedResult.error);
  }

  todos = [...todos, parsedResult.data];
  res.status(201).send(parsedResult.data);
});

// PATCH /todos/:id - { "checked": true }
// PATCH /todos/:id - { "checked": "" }
router.patch("/:id", (req, res) => {
  const todoId = req.params.id;
  const foundIndex = todos.findIndex((ti) => ti.id === Number(todoId));

  if (foundIndex === -1) {
    res.status(404).send("Not Found");
  } else {
    const updateTodo = { ...todos[foundIndex], checked: req.body.checked };
    const parsedResult = TodoSchema.safeParse(updateTodo);

    if (!parsedResult.success) {
      return res.status(400).send(parsedResult.error);
    }
    todos[foundIndex] = parsedResult.data;
    res.status(200).send(parsedResult.data);
  }
});

// DELETE /todos
router.delete("/", (req, res) => {
  todos = [];
  res.status(204).send();
});

// DELETE /todos/:id
router.delete("/:id", (req, res) => {
  const todoId = req.params.id;
  const foundIndex = todos.findIndex((ti) => ti.id === Number(todoId));

  if (foundIndex === -1) {
    res.status(404).send("Not Found");
  } else {
    todos.splice(foundIndex, 1);
    res.status(204).send();
  }
});

export default router;
