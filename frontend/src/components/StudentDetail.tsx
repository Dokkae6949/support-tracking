import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useStudentStore from "../store/studentStore";
import { useStudents } from "../hooks/useStudents";
import type { Student } from "../types";

const statusColor: Record<Student["status"], "success" | "warning" | "default"> = {
  aktiv: "success",
  pausiert: "warning",
  abgeschlossen: "default",
};

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const students = useStudentStore((s) => s.students);
  const setSelectedStudent = useStudentStore((s) => s.setSelectedStudent);
  const { updateStudent } = useStudents();

  const student = students.find((s) => s.id === id) ?? null;

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<Omit<Student, "id">>({
    name: "",
    foerderungsbedarf: "",
    status: "aktiv",
  });

  useEffect(() => {
    console.log("StudentDetail/useEffect: id=", id);
    setSelectedStudent(student);
    if (student) {
      setForm({
        name: student.name,
        foerderungsbedarf: student.foerderungsbedarf,
        status: student.status,
      });
    }
    return () => setSelectedStudent(null);
  }, [id, setSelectedStudent]);

  async function handleSave() {
    if (!id) return;
    console.log("StudentDetail/handleSave: id=", id);
    await updateStudent(id, form);
    setEdit(false);
  }

  if (!student) {
    return (
      <Box p={3}>
        <Typography>Schüler nicht gefunden.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
          Zurück
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth={600}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 2 }}
      >
        Zurück
      </Button>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Detailansicht</Typography>
            <Chip
              label={student.status}
              color={statusColor[student.status]}
              size="small"
            />
          </Stack>

          {edit ? (
            <>
              <TextField
                label="Name"
                fullWidth
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <TextField
                label="Förderungsbedarf"
                fullWidth
                value={form.foerderungsbedarf}
                onChange={(e) =>
                  setForm({ ...form, foerderungsbedarf: e.target.value })
                }
              />
              <Select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as Student["status"] })
                }
              >
                <MenuItem value="aktiv">Aktiv</MenuItem>
                <MenuItem value="pausiert">Pausiert</MenuItem>
                <MenuItem value="abgeschlossen">Abgeschlossen</MenuItem>
              </Select>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={handleSave}>
                  Speichern
                </Button>
                <Button onClick={() => setEdit(false)}>Abbrechen</Button>
              </Stack>
            </>
          ) : (
            <>
              <Box>
                <Typography variant="caption" color="text.secondary">Name</Typography>
                <Typography variant="body1">{student.name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Förderungsbedarf</Typography>
                <Typography variant="body1">{student.foerderungsbedarf}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">ID</Typography>
                <Typography variant="body2" color="text.secondary">{student.id}</Typography>
              </Box>
              <Button variant="outlined" onClick={() => setEdit(true)}>
                Bearbeiten
              </Button>
            </>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
