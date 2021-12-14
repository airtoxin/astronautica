import { trpc } from "./trpc";

function App() {
  const hello = trpc.useQuery(["getUser", "foo"]);
  if (!hello.data) return <div>Loading...</div>;
  return (
    <div>
      <p>{hello.data.name}</p>
    </div>
  );
}

export default App;
