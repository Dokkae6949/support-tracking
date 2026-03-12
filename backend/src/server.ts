import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";

// --- Types ---
interface Student {
  id: string;
  name: string;
  foerderungsbedarf: string;
  status: "aktiv" | "abgeschlossen" | "pausiert";
}

interface WsMessage {
  type: "update";
  data: Student[];
}

// --- Mock data ---
const students: Student[] = [
  { id: "1", name: "Max Mustermann", foerderungsbedarf: "Mathematik", status: "aktiv" },
  { id: "2", name: "Anna Schmidt", foerderungsbedarf: "Deutsch", status: "aktiv" },
  { id: "3", name: "Tom Fischer", foerderungsbedarf: "Englisch", status: "pausiert" },
];

let idCounter = students.length;

// --- Express setup ---
const app = express();
app.use(cors());
app.use(express.json());

// --- HTTP server ---
const server = http.createServer(app);

// --- WebSocket server ---
const wss = new WebSocketServer({ server });

function broadcast(data: Student[]): void {
  console.log("broadcast: students=", data.length);
  const msg: WsMessage = { type: "update", data };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg));
    }
  });
}

wss.on("connection", (ws) => {
  console.log("ws/connection: new client connected");
  ws.send(JSON.stringify({ type: "update", data: students }));
});

// --- REST routes ---

// GET /api/students
app.get("/api/students", (_req, res) => {
  console.log("get/students: count=", students.length);
  res.json({ data: students });
});

// GET /api/students/:id
app.get("/api/students/:id", (req, res) => {
  const { id } = req.params;
  console.log("get/student: id=", id);
  try {
    const student = students.find((s) => s.id === id);
    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    res.json({ data: student });
  } catch (err) {
    console.error("get/student error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/students
app.post("/api/students", (req, res) => {
  console.log("post/students: body=", req.body);
  try {
    const { name, foerderungsbedarf, status } = req.body as Omit<Student, "id">;
    const newStudent: Student = {
      id: String(++idCounter),
      name,
      foerderungsbedarf,
      status: status ?? "aktiv",
    };
    students.push(newStudent);
    broadcast(students);
    res.status(201).json({ data: newStudent });
  } catch (err) {
    console.error("post/students error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/students/:id
app.put("/api/students/:id", (req, res) => {
  const { id } = req.params;
  console.log("put/student: id=", id, "body=", req.body);
  try {
    const idx = students.findIndex((s) => s.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    students[idx] = { ...students[idx], ...req.body, id };
    broadcast(students);
    res.json({ data: students[idx] });
  } catch (err) {
    console.error("put/student error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/students/:id
app.delete("/api/students/:id", (req, res) => {
  const { id } = req.params;
  console.log("delete/student: id=", id);
  try {
    const idx = students.findIndex((s) => s.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    students.splice(idx, 1);
    broadcast(students);
    res.status(204).send();
  } catch (err) {
    console.error("delete/student error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Start ---
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
