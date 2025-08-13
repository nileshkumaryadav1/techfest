import useSWR from "swr";

// Fetcher with credentials included
const fetcher = (url) => fetch(url, { credentials: "include" }).then(res => res.json());

export default function useMyTeam() {
  // Safely access localStorage only on the client
  let studentId = null;
  if (typeof window !== "undefined") {
    try {
      const student = JSON.parse(localStorage.getItem("student"));
      studentId = student?._id || null;
    } catch (err) {
      console.error("Failed to parse student from localStorage:", err);
      studentId = null;
    }
  }

  const { data, error, mutate } = useSWR(
    studentId ? `/api/team/my?studentId=${studentId}` : null,
    fetcher
  );

  return {
    team: data?.team || null,
    isLeader: data?.isLeader || false,
    isLoading: !error && !data,
    isError: !!error,
    mutate,
  };
}
