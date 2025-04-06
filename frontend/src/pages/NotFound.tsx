import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 bg-white text-black flex items-center justify-center text-center font-inter">
      <div className="flex flex-col items-center max-w-md px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-4">404</h1>
        <p className="text-2xl md:text-3xl font-medium mb-6">Page Not Found</p>
        <p className="text-base md:text-lg text-gray-700 mb-8">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Button
          variant="outline"
          className="bg-black text-white hover:bg-white hover:text-black hover:cursor-pointer transition"
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
