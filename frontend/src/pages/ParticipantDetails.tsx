import CheckInCard from "@/components/ui/CheckInCard";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start pt-10 px-4 font-inter">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="mt-2 text-2xl font-bold text-green-700 mb-3 md:text-2xl lg:text-3xl">
          Successfully Checked-In
        </h1>

        <CheckInCard />

        <button className="w-80 fixed bottom-24 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors md:w-90 lg:bottom-30 lg:w-4/14 md:bottom-28">
          Check-in Another Participant
        </button>
      </div>
    </main>
  );
}
