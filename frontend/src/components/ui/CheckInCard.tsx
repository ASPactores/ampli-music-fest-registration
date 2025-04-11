export default function CheckInCard() {
    return (
      <div className="w-10/12 border border-black rounded-lg p-4 md:w-5/6 lg:w-7/8 font-inter">
        <div className="space-y-4 font-bold text-sm md:text-md lg:text-lg">
          <div>
            <p>Name:</p>
          </div>
          <div>
            <p>Affiliation:</p>
          </div>
          <div className="flex">
            <p>Status:</p>
            <p className="ml-1 text-green-600">Checked-in</p>
          </div>
        </div>
      </div>
    )
  }