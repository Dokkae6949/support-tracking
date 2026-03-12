import { create } from "zustand";
import type { Student } from "../types";

interface StudentStore {
  students: Student[];
  selectedStudent: Student | null;
  setStudents: (students: Student[]) => void;
  setSelectedStudent: (student: Student | null) => void;
}

const useStudentStore = create<StudentStore>((set) => ({
  students: [],
  selectedStudent: null,
  setStudents: (students) => {
    console.log("store/setStudents: count=", students.length);
    set({ students });
  },
  setSelectedStudent: (student) => {
    console.log("store/setSelectedStudent: id=", student?.id);
    set({ selectedStudent: student });
  },
}));

export default useStudentStore;
