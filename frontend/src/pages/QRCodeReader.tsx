import { useState, useEffect, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { BottomNavbar } from "@/components/BottomNavbar";
import { toast, Toaster } from "sonner";
import { useApiPut } from "@/hooks/useApi";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";

interface ErrorResponse {
  detail?: string;
  [key: string]: any;
}

const QRCodeReader = () => {
  const [scanned, setScanned] = useState(false);
  const [attendee_id, setAttendeeId] = useState<string | null>(null); // Now holds full raw QR string
  const [cameraError, setCameraError] = useState<string | null>(null);
  const toastShownRef = useRef(false);
  const navigate = useNavigate();

  const { mutate: checkIn, isPending } = useApiPut(
    attendee_id ? `/attendees/${attendee_id}/check-in` : "",
    true,
    {
      onSuccess: (data) => {
        console.log("Check-in successful:", data);
        toast.success("Check-in successful!");
        navigate(`/admin/scan/checked-in/${attendee_id}`, {
          state: {
            full_name: data.full_name,
            up_student: data.up_student,
            year_degree: data.year_degree,
            affiliation: data.affiliation,
            status: data.status,
          },
        });
      },
      onError: (err: AxiosError<ErrorResponse>) => {
        console.error("Check-in error:", err);
        toast.error(
          `Check-in failed: ${err.response?.data.detail || "Unknown error"}`
        );
      },
    }
  );

  // Check for login success toast flag when component mounts
  useEffect(() => {
    // Check if we should show login success toast
    const showLoginSuccessToast = sessionStorage.getItem(
      "showLoginSuccessToast"
    );
    if (showLoginSuccessToast === "true") {
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
    if (!attendee_id) {
      toast.error("No attendee ID found.");
      return;
    }

    checkIn({});
  };

  const handleReset = () => {
    navigate(0);
  };

  return (
    <>
      <Toaster position="top-center" richColors expand={true} duration={3000} />
      <div className="flex flex-col items-center bg-white gap-4">
        <h2 className="font-inter text-2xl md:text-3xl lg:text-3xl font-bold text-center">
          Place QR inside the box
        </h2>
        {cameraError ? (
          <div className="w-56 h-56 md:w-72 md:h-72 lg:w-72 lg:h-72 border-2 border-red-500 rounded-lg flex items-center justify-center bg-gray-100">
            <p className="text-red-500 text-center p-4">
              Camera access error. Please check your permissions and refresh the
              page.
            </p>
          </div>
        ) : (
          <div className="w-50 h-50 md:w-56 md:h-56 lg:w-60 lg:h-60 border-2 border-black rounded-lg overflow-hidden relative">
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
          <div className="mt-4 text-sm p-2 bg-green-100 text-green-800 rounded-md w-80 max-w-md text-center lg:w-3/12 lg:mt-1">
            Attendee ID: <br /> {attendee_id}
          </div>
        ) : null}
        <div className="fixed bottom-24 lg:bottom-28 md:bottom-28 w-full flex flex-col items-center gap-3">
          <button
            className="font-inter px-5 py-3 text-[14px] bg-black text-white rounded-md w-80 lg:w-4/16 cursor-pointer disabled:opacity-50"
            onClick={scanned ? handleConfirm : handleReset}
            type="button"
            disabled={isPending}
          >
            {isPending ? "Checking in..." : scanned ? "Confirm" : "Reset"}
          </button>

          {scanned && (
            <button
              className="font-inter px-5 py-3 text-[14px] bg-white text-black border border-black rounded-md w-80 lg:w-4/16 cursor-pointer"
              onClick={handleReset}
              type="button"
              disabled={isPending}
            >
              Cancel
            </button>
          )}
        </div>
        <div className="mt-16"></div> {/* Spacer */}
        <BottomNavbar />
      </div>
    </>
  );
};

export default QRCodeReader;
