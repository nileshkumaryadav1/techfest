// components/dashboard/StudentInfo.jsx
export default function StudentInfo({ student }) {
  return (
    <div className="mb-8 p-6 border border-[color:var(--border)] rounded-2xl bg-[color:var(--card)] shadow-md">
      <h2 className="text-2xl font-bold text-[color:var(--foreground)] mb-4">
        👤 Your Info
      </h2>
      <div className="space-y-2 text-[color:var(--secondary)]">
        <p>
          <span className="font-semibold text-[color:var(--foreground)]">Fest ID:</span>{" "}
          {student.festId}
        </p>
        <p>
          <span className="font-semibold text-[color:var(--foreground)]">ID:</span> {student._id}
        </p>
        <p>
          <span className="font-semibold text-[color:var(--foreground)]">Name:</span> {student.name}
        </p>
        <p>
          <span className="font-semibold text-[color:var(--foreground)]">Email:</span> {student.email}
        </p>
        <p>
          <span className="font-semibold text-[color:var(--foreground)]">College:</span> {student.college}
        </p>
        <p>
          <span className="font-semibold text-[color:var(--foreground)]">Year:</span> {student.year}
        </p>
        <p>
          <span className="font-semibold text-[color:var(--foreground)]">Branch:</span> {student.branch}
        </p>
      </div>
    </div>
  );
}
