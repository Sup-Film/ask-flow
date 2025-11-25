import { useParams } from "react-router";

export default function UserProfile() {
  const params = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Profile (Dynamic Route)</h1>
      <p className="mt-2">
        User ID:{" "}
        <span className="font-mono bg-muted p-1 rounded">{params.id}</span>
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Try changing the URL to /users/123 or /users/abc
      </p>
    </div>
  );
}
