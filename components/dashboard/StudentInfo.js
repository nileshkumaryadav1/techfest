export default function StudentInfo({ student }) {
  const initials = student?.name
    ? student.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "ST";

  return (
    <div className="p-5 sm:p-6 md:p-8 rounded-3xl border border-[color:var(--border)] bg-gradient-to-br from-[color:var(--card)] to-[color:var(--background)] shadow-xl max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
            {initials}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[color:var(--foreground)]">
              {student.name}
            </h2>
            <p className="text-sm text-[color:var(--secondary)]">{student.email}</p>
          </div>
        </div>

        {/* Fest ID */}
        <div className="self-start sm:self-auto">
          <span className="px-3 py-1 text-xs sm:text-sm font-semibold rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-[color:var(--border)] text-[color:var(--foreground)] shadow-sm">
            🆔 Fest ID: {student.festId}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Personal */}
        <div className="space-y-2">
          <h3 className="font-semibold text-[color:var(--foreground)] mb-1">👤 Personal Details</h3>
          <p className="text-sm">
            <span className="font-medium text-[color:var(--foreground)]">📞 Phone:</span>{" "}
            {student.phone || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-[color:var(--foreground)]">📧 Email:</span>{" "}
            {student.email}
          </p>
        </div>

        {/* Academic */}
        <div className="space-y-2">
          <h3 className="font-semibold text-[color:var(--foreground)] mb-1">🎓 Academic Details</h3>
          <p className="text-sm">
            <span className="font-medium text-[color:var(--foreground)]">🏫 College:</span>{" "}
            {student.college}
          </p>
          <p className="text-sm">
            <span className="font-medium text-[color:var(--foreground)]">📅 Year:</span>{" "}
            {student.year}
          </p>
          <p className="text-sm">
            <span className="font-medium text-[color:var(--foreground)]">🛠️ Branch:</span>{" "}
            {student.branch}
          </p>
        </div>
      </div>
    </div>
  );
}
