import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="text-muted-foreground">
        This page is wrapped in a layout that doesn't add to the URL path.
      </p>
      <div className="space-y-2">
        <Button className="w-full">Sign In</Button>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
