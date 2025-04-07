"use client";
import { useState, useEffect, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { BottomNavbar } from "@/components/BottomNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QRCodeReader = () => {
  const [scanned, setScanned] = useState(false);
  const [attendee_id, setAttendeeId] = useState<string | null>(null); // Now holds full raw QR string
  const [cameraError, setCameraError] = useState<string | null>(null);
  const toastShownRef = useRef(false);

  // Show hint toast if no QR is detected
  useEffect(() => {
    toastShownRef.current = false;

    const timeout = setTimeout(() => {
      if (!scanned && !cameraError && !toastShownRef.current) {
        toast.info("No QR code detected. Please make sure the QR code is clearly visible.");
        toastShownRef.current = true;
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [scanned, cameraError]);

  const handleScan = (e: any) => {
    if (scanned || !e?.[0]?.rawValue) return;

    try {
      const raw = e[0].rawValue;
      setAttendeeId(raw);
      setScanned(true); // Set scanned to true
      console.log("QR Scanned, setting scanned state to true");

      toast.success("QR Code scanned. Press Confirm to submit.");
    } catch (error) {
      toast.error("Invalid QR Code.");
    }
  };

  const handleCameraError = (error: Error) => {
    console.error("Camera error:", error);
    setCameraError("Camera access error");
    toast.error("Unable to access camera. Please check your camera permissions.");
  };

  const handleConfirm = () => {
    // Simply reload the page, just like handleReset
    window.location.reload();
  };

  const handleReset = () => {
    // Simply reload the page
    window.location.reload();
  };

  // Debug - log current state
  useEffect(() => {
    console.log("Current state - scanned:", scanned, "attendee_id:", attendee_id);
  }, [scanned, attendee_id]);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-white gap-4">
      <img
        src="/sarisari2025logo.png"
        alt="Logo"
        className="w-8 h-6 lg:w-10 lg:h-8 mb-4"
      />
      <h2 className="font-inter text-2xl lg:text-3xl font-bold text-center mt-8">
        Place QR inside the box
      </h2>

      {cameraError ? (
        <div className="w-56 h-56 lg:w-72 lg:h-72 border-2 border-red-500 rounded-lg flex items-center justify-center bg-gray-100">
          <p className="text-red-500 text-center p-4">
            Camera access error. Please check your permissions and refresh the page.
          </p>
        </div>
      ) : (
        <div className="w-56 h-56 lg:w-72 lg:h-72 border-2 border-black rounded-lg overflow-hidden relative">
          <Scanner
            onScan={handleScan}
            onError={handleCameraError}
            className="w-full h-full object-cover"
            constraints={{
              video: {
                facingMode: "environment",
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
            }}
          />
        </div>
      )}

      {/* User ID Message Container */}
      {attendee_id ? (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded-md w-full max-w-md text-center">
          Attendee ID: <br /> {attendee_id}
        </div>
      ) : null}

      {/* Separate Button - Will always be visible */}
      <div className="w-full flex justify-center mt-6">
        <button
          className="font-inter px-5 py-3 bg-black text-white rounded-md w-11/12 md:w-1/3 lg:w-1/4"
          onClick={scanned ? handleConfirm : handleReset}
          type="button"
        >
          {scanned ? "Confirm" : "Reset"}
        </button>
      </div>

      <div className="mt-16"></div> {/* Spacer */}
      
      <BottomNavbar />

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default QRCodeReader;