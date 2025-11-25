import { useParams } from "react-router";

export default function FileBrowser() {
  const params = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">File Browser (Splat Route)</h1>
      <p className="mt-2">
        Current Path:{" "}
        <span className="font-mono bg-muted p-1 rounded">{params["*"]}</span>
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        This route matches anything starting with /files/
      </p>
    </div>
  );
}
