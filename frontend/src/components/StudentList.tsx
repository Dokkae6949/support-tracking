import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import useStudentStore from "../store/studentStore";
import { useStudents } from "../hooks/useStudents";
import type { Student } from "../types";

const statusColor: Record<Student["status"], "success" | "warning" | "default"> = {
  aktiv: "success",
  pausiert: "warning",
  abgeschlossen: "default",
};

export default function StudentList() {
  const navigate = useNavigate();
  const students = useStudentStore((s) => s.students);
  const { fetchStudents, createStudent, deleteStudent } = useStudents();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Student, "id">>({
    name: "",
    foerderungsbedarf: "",
    status: "aktiv",
  });

  useEffect(() => {
    fetchStudents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate() {
    console.log("StudentList/handleCreate: name=", form.name);
    if (!form.name.trim() || !form.foerderungsbedarf.trim()) return;
    await createStudent(form);
    setForm({ name: "", foerderungsbedarf: "", status: "aktiv" });
    setOpen(false);
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    console.log("StudentList/handleDelete: id=", id);
    await deleteStudent(id);
  }

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Schüler – Förderungsbedarf</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Hinzufügen
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Förderungsbedarf</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((s) => (
              <TableRow
                key={s.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/students/${s.id}`)}
              >
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.foerderungsbedarf}</TableCell>
                <TableCell>
                  <Chip label={s.status} color={statusColor[s.status]} size="small" />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Löschen">
                    <IconButton
                      size="small"
                      onClick={(e) => handleDelete(s.id, e)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Neuer Schüler</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button variant="contained" onClick={handleCreate}>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
