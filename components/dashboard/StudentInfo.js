export default function StudentInfo({ student }) {
  return (
    <div className="md:mb-8 mb-2 p-3 md:p-6 border border-[color:var(--border)] rounded-2xl bg-[color:var(--card)] shadow-lg">
      <h2 className="text-xl md:text-3xl font-extrabold text-[color:var(--foreground)] md:mb-6 mb-3 flex items-center gap-2">
        👤 Student Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[color:var(--secondary)]">
        {/* Personal Details */}
        <div>
          <p className="mb-1">
            <span className="font-medium text-[color:var(--foreground)]">🆔 Fest ID:</span> {student.festId}
          </p>
          <p className="mb-1">
            {/* <span className="font-medium text-[color:var(--foreground)]">🧬 Internal ID:</span> {student._id} */}
          </p>
          <p className="mb-1">
            <span className="font-medium text-[color:var(--foreground)]">👨‍🎓 Name:</span> {student.name}
          </p>
          <p className="mb-1">
            <span className="font-medium text-[color:var(--foreground)]">📞 Phone:</span> {student.phone || "N/A"}
          </p>
          <p className="mb-1">
            <span className="font-medium text-[color:var(--foreground)]">📧 Email:</span> {student.email}
          </p>
        </div>

        {/* Academic Details */}
        <div>
          <p className="mb-1">
            <span className="font-medium text-[color:var(--foreground)]">🎓 College:</span> {student.college}
          </p>
          <p className="mb-1">
            <span className="font-medium text-[color:var(--foreground)]">📅 Year:</span> {student.year}
          </p>
          <p className="mb-1">
            <span className="font-medium text-[color:var(--foreground)]">🛠️ Branch:</span> {student.branch}
          </p>
        </div>
      </div>
    </div>
  );
}
