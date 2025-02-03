import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container py-6 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          © 2024 Winget Package Manager
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </footer>
  );
}