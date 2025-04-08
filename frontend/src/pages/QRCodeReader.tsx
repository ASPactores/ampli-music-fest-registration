import { useState, useEffect, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { BottomNavbar } from "@/components/BottomNavbar";
import { toast, Toaster } from "sonner";

const QRCodeReader = () => {
  const [scanned, setScanned] = useState(false);
  const [attendee_id, setAttendeeId] = useState<string | null>(null); // Now holds full raw QR string
  const [cameraError, setCameraError] = useState<string | null>(null);
  const toastShownRef = useRef(false);

  // Check for login success toast flag when component mounts
  useEffect(() => {
    // Check if we should show login success toast
    const showLoginSuccessToast = sessionStorage.getItem("showLoginSuccessToast");
    if (showLoginSuccessToast === "true") {
      // Show the toast
      toast.success("Login successful!");
      // Remove the flag so it doesn't show again on refresh
      sessionStorage.removeItem("showLoginSuccessToast");
    }
  }, []);

  // Show hint toast if no QR is detected
  useEffect(() => {
    toastShownRef.current = false;

    const timeout = setTimeout(() => {
      if (!scanned && !cameraError && !toastShownRef.current) {
        toast.info(
          "No QR code detected. Please make sure the QR code is clearly visible."
        );
        toastShownRef.current = true;
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [scanned, cameraError]);

  // ...rest of the component remains the same

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

  const handleCameraError = (error: unknown) => {
    if (error instanceof Error) {
      console.error("Camera error:", error);
      setCameraError("Camera access error");
      toast.error(
        "Unable to access camera. Please check your camera permissions."
      );
    } else {
      console.error("Unknown camera error:", error);
      setCameraError("Unknown camera error");
      toast.error("An unknown error occurred with the camera.");
    }
  };

  const handleConfirm = () => {
    window.location.reload();
  };

  const handleReset = () => {
    window.location.reload();
  };

  // Debug - log current state
  useEffect(() => {
    console.log(
      "Current state - scanned:",
      scanned,
      "attendee_id:",
      attendee_id
    );
  }, [scanned, attendee_id]);

  return (
    <>
      <Toaster position="top-center" richColors expand={true} duration={3000} />
      <div className="flex flex-col items-center min-h-screen p-4 bg-white gap-4">
        <img
          src="/sarisari2025logo.png"
          alt="Logo"
          className="w-8 h-6 lg:w-10 lg:h-8 mb-4"
        />
        <h2 className="font-inter text-2xl lg:text-3xl font-bold text-center mt-8 mb-8">
          Place QR inside the box
        </h2>
        {cameraError ? (
          <div className="w-56 h-56 lg:w-72 lg:h-72 border-2 border-red-500 rounded-lg flex items-center justify-center bg-gray-100">
            <p className="text-red-500 text-center p-4">
              Camera access error. Please check your permissions and refresh the
              page.
            </p>
          </div>
        ) : (
          <div className="w-56 h-56 lg:w-72 lg:h-72 border-2 border-black rounded-lg overflow-hidden relative">
            <Scanner
              onScan={handleScan}
              onError={handleCameraError}
              constraints={{
                facingMode: "environment",
                width: { ideal: 1280 },
                height: { ideal: 1280 },
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
        <div className="fixed bottom-36 w-full flex justify-center">
          <button
            className="font-inter px-5 py-3 bg-black text-white rounded-md w-10/12 md:w-1/3 lg:w-1/4 cursor-pointer"
            onClick={scanned ? handleConfirm : handleReset}
            type="button"
          >
            {scanned ? "Confirm" : "Reset"}
          </button>
        </div>
        <div className="mt-16"></div> {/* Spacer */}
        <BottomNavbar />
      </div>
    </>
  );
};

export default QRCodeReader;