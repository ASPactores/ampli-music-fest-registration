export default function CheckInCard({
  full_name,
  up_student,
  year_degree,
  affiliation,
  status,
}: {
  full_name?: string;
  up_student?: boolean;
  year_degree?: string;
  affiliation?: string;
  status?: string;
}) {
  return (
    <div className="w-10/12 border border-black rounded-lg p-4 md:w-5/6 lg:w-7/8 font-inter">
      <div className="space-y-4 font-semibold text-sm md:text-md lg:text-lg">
        <div className="flex">
          <p className="text-sm">Name: </p>
          <p className="ml-1 font-normal">{full_name}</p>
        </div>
        <div className="flex">
          <p className="text-sm">UP Student:</p>
          <p className="ml-1 font-normal">{up_student ? "True" : "False"}</p>
        </div>
        <div className="flex">
          <p className="text-sm">Year and Degree Program:</p>
          <p className="ml-1 font-normal">{up_student ? year_degree : "N/A"}</p>
        </div>
        <div className="flex">
          <p className="text-sm">Affiliation: </p>
          <p className="ml-1 font-normal">
            {affiliation ? "N/A" : affiliation}
          </p>
        </div>
        <div className="flex">
          <p className="text-sm">Status:</p>
          <p className="ml-1 text-[#36782E]">{status?.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}
