import CheckInCard from "@/components/ui/CheckInCard";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";

export default function ParticipantDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state as {
    full_name?: string;
    up_student?: boolean;
    year_degree?: string;
    affiliation?: string;
    status?: string;
  };

  return (
    <div className="flex flex-col items-center justify-start pt-10 px-4 font-inter">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold text-[#36782E] mt-4 text-center mb-10">
          Successfully Checked-In
        </h1>

        <CheckInCard {...data} />
        <div className="fixed bottom-24 lg:bottom-28 md:bottom-28 w-full flex flex-col items-center gap-3">
          <Button
            onClick={() => navigate(-1)}
            className="font-inter py-5 px-10 w-80 font-medium text-[14px] fixed bottom-24 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors md:w-90 lg:bottom-30 lg:w-4/14 md:bottom-28"
          >
            Check-in Another Participant
          </Button>
        </div>
      </div>
    </div>
  );
}
