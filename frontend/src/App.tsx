import main_logo from "./assets/sari_sari_main_logo.svg";

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <img src={main_logo} className="logo react" alt="Sari-sari 2025 Logo" />
      </div>
      <p className="font-semi-bold underline font-['Inter'] text-center">
        Hello world!
      </p>
    </>
  );
}

export default App;
