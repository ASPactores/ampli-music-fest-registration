import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import { useNavigate } from "react-router";

export default function CheckInSuccess() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col items-center justify-center h-[70vh] py-8">
        <CircleCheck fill="#36782E" className="h-40 w-40 text-white" />
        <h1 className="text-2xl font-bold text-[#36782E] mt-4 text-center">
          Check-In Successful!
        </h1>
        <p className="text-gray-600 mt-2">
          Thank you for checking in. Enjoy the event!
        </p>
        <Button
          onClick={() => navigate(-1)}
          className="font-inter px-5 py-6 bg-black text-l text-white rounded-md w-10/12 md:w-1/3 lg:w-1/4 cursor-pointer disabled:opacity-50 mt-20"
        >
          Register Another Participant
        </Button>
      </div>
    </>
  );
}
