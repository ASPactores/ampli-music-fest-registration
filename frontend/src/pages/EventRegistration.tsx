export default function EventRegistrationPage() {
  return (
    <div className="px-3">
      <h1 className="text-3xl">Event Registration Page</h1><br />
      <form>
        <div className="text-left mb-5">
          <label htmlFor="name" className="text-sm">Full Name</label><br />
          <input type="text" id="name" name="name" className="w-full border-2" required />
        </div>
        <div className="text-left mb-5">
          <label htmlFor="email" className="text-sm">Email Address</label><br />
          <input type="email" id="email" name="email" className="w-full border-2" required />
        </div>
        <div className="text-left mb-5">
          <label htmlFor="phone" className="text-sm">Phone Number</label><br />
          <input type="tel" id="phone" name="phone" className="w-full border-2" required />
        </div>
        <div className="text-left mb-5">
          <label htmlFor="eventsource" className="text-sm">Are you a UP student?</label><br />
          <p className="text-xs">
            <label>
              <input type="radio" name="upstudent" value="yes" />
              Yes
            </label>
            <label>
              <input type="radio" name="upstudent" value="no" />
              No
            </label>
          </p>
        </div>
        <div className="text-left">
          <label htmlFor="degprog" className="text-sm">If yes, kindly indicate your year and degree program (i.e. 4 - BSCS)</label><br />
          <input type="text" id="degprog" name="degprog" required />
        </div>
        <div className="text-left">
          <label htmlFor="affiliation" className="text-sm">If no, kindly indicate your affiliation</label><br />
          <input type="text" id="affiliation" name="affiliation" required />
        </div>
        <div className="text-left">
          <label htmlFor="eventsource" className="text-sm">How did you hear about the event?</label><br />
          <p className="text-xs">
            <label>
              <input type="checkbox" name="event" value="socmed" />
              Social Media
            </label><br />
            <label>
              <input type="checkbox" name="event" value="mouth" />
              Word of Mouth
            </label><br />
            <label>
              <input type="checkbox" name="event" value="posters" />
              Posters
            </label><br />
            <label>
              <input type="checkbox" name="event" value="" />
              Others
            </label><br />
          </p>
        </div>
        <div className="text-left">
          <label htmlFor="eventsource" className="text-sm">Do you agree to follow event guidelines and safety protocols?</label><br />
          <p className="text-xs">
            <label>
              <input type="radio" name="protocols" value="yes" />
              Yes
            </label>
            <label>
              <input type="radio" name="protocols" value="no" />
              No
            </label>
          </p>
        </div>
        <div className="text-left">
          <label htmlFor="eventsource" className="text-sm">Do you allow us to contact you for event updates?</label><br />
          <p className="text-xs">
            <label>
              <input type="radio" name="updates" value="yes"/>
              Yes
            </label>
            <label>
              <input type="radio" name="updates" value="no"/>
              No
            </label>
          </p>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
