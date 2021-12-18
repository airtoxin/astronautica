import { trpc } from "./trpc";

function App() {
  const result = trpc.useQuery(["testRequest.list"]);
  return (
    <div>
      <p>hello</p>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}

export default App;
