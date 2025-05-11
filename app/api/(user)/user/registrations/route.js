export function GET() {
  const registeredEvents = [
    {
      title: "Event 1",
      date: "2023-08-01",
      _id: "123",
    },
    {
      title: "Event 2",
      date: "2023-08-02",
      _id: "456",
    },
  ];
  return new Response(JSON.stringify([registeredEvents]), { status: 200 });
}
