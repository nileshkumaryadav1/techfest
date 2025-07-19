// components/dashboard/StudentInfo.jsx
export default function StudentInfo({ student }) {
  return (
    <div className="mb-8 p-4 border rounded-xl bg-[var(--card)]">
      <h2 className="text-xl font-semibold">👤 Your Info</h2>
      <p className="mt-2">Name: {student.name}</p>
      <p>Email: {student.email}</p>
      <p>College Name: {student.college}</p>
      <p>Year: {student.year}</p>
      <p>Branch: {student.branch}</p>
    </div>
  );
}