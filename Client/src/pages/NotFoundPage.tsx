import { Link } from "react-router";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="font-mono font-bold text-[120px] text-muted leading-none mb-4">404</div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-3">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist. It may have been moved or deleted.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft size={14} /> Go Back
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Home size={14} /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
