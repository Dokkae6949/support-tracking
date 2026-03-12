import type { Student } from "../types";
import useStudentStore from "../store/studentStore";

const API_BASE = "http://localhost:5000/api";

export function useStudents() {
  const setStudents = useStudentStore((s) => s.setStudents);

  async function fetchStudents(): Promise<void> {
    console.log("useStudents/fetchStudents: fetching");
    try {
      const res = await fetch(`${API_BASE}/students`);
      if (!res.ok) {
        console.error("useStudents/fetchStudents: status=", res.status);
        return;
      }
      const json = await res.json();
      console.log("useStudents/fetchStudents: count=", json.data.length);
      setStudents(json.data);
    } catch (err) {
      console.error("useStudents/fetchStudents error:", err);
    }
  }

  async function createStudent(
    data: Omit<Student, "id">
  ): Promise<Student | null> {
    console.log("useStudents/createStudent: name=", data.name);
    try {
      const res = await fetch(`${API_BASE}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        console.error("useStudents/createStudent: status=", res.status);
        return null;
      }
      const json = await res.json();
      return json.data as Student;
    } catch (err) {
      console.error("useStudents/createStudent error:", err);
      return null;
    }
  }

  async function updateStudent(
    id: string,
    data: Partial<Omit<Student, "id">>
  ): Promise<Student | null> {
    console.log("useStudents/updateStudent: id=", id);
    try {
      const res = await fetch(`${API_BASE}/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        console.error("useStudents/updateStudent: status=", res.status);
        return null;
      }
      const json = await res.json();
      return json.data as Student;
    } catch (err) {
      console.error("useStudents/updateStudent error:", err);
      return null;
    }
  }

  async function deleteStudent(id: string): Promise<boolean> {
    console.log("useStudents/deleteStudent: id=", id);
    try {
      const res = await fetch(`${API_BASE}/students/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("useStudents/deleteStudent: status=", res.status);
        return false;
      }
      return true;
    } catch (err) {
      console.error("useStudents/deleteStudent error:", err);
      return false;
    }
  }

  return { fetchStudents, createStudent, updateStudent, deleteStudent };
}
