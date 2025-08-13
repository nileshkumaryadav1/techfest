import Student from "@/models/Student";

/**
 * Get the current authenticated student from the request.
 * Reads student ID from headers (e.g., x-student-id).
 *
 * @param {Request} req - Next.js request object
 * @returns {Promise<Student|null>} - Returns student document or null if not found
 */
export async function getCurrentStudent(req) {
  try {
    // Read student ID from custom header
    const studentId = req.headers.get("x-student-id");
    if (!studentId) return null;

    // Fetch student from DB (exclude sensitive fields)
    const student = await Student.findById(studentId).select("-password");
    return student || null;
  } catch (err) {
    console.error("Error in getCurrentStudent:", err);
    return null;
  }
}
