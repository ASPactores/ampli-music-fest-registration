import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { useState } from "react";
import { useApiPost } from "@/hooks/useApi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const formSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email("Invalid email"),
  phone_number: z
    .string()
    .min(11, "Enter a correct phone number")
    .max(11, "Enter a correct phone number"),
  up_student: z.boolean(),
  year_degree: z.string().optional(),
  affiliation: z.string().optional(),
  hear_about_event: z
    .array(z.string())
    .min(
      1,
      "Please select at least one option for how you heard about the event"
    ),
  follow_guidelines: z.boolean(),
  allow_updates: z.boolean(),
});

const hear_about_event = [
  {
    id: "socmed",
    label: "Social Media",
  },
  {
    id: "wordofmouth",
    label: "Word of Mouth",
  },
  {
    id: "poster",
    label: "Posters",
  },
  {
    id: "others",
    label: "Others",
  },
] as const;

export default function EventRegistrationPage() {
  // Define bottom navigation height - adjust this value based on your actual nav height
  const bottomNavHeight = 90; // in pixels

  // State to track the "Others" input
  const [otherText, setOtherText] = useState<string>("");

  // Track the selected value
  const [isUPStudent, setIsUPStudent] = useState<boolean | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      hear_about_event: [],
    },
  });

  const { mutate: checkin, isPending } = useApiPost(
    "/attendees/register",
    false
  );
  const navigate = useNavigate();

  // 2. Define a submit handler.
  function onSubmit(data: z.infer<typeof formSchema>) {
    const submitData = {
      ...data,
      // Format the hear_about_event field to include "others" text if selected
      hear_about_event: data.hear_about_event
        .map((item) => (item === "Others" ? `Others: ${otherText}` : item))
        .join(", "), // Join all selected options with commas
    };

    console.log("Submitting data:", submitData);

    checkin(submitData, {
      onSuccess: (response) => {
        console.log("Registration successful:", response);
        toast.success("Registration successful!");
        navigate("/success");
      },
      onError: (err) => {
        console.error("Registration error:", err);
        toast.error("Registration failed. Please try again.");
      },
    });
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Toaster richColors position="top-center" closeButton={false} />
      <div
        className="flex flex-col hear_about_event-center w-[95vw] max-w-4xl justify-center h-full pl-10 pr-10 bg-white"
        style={{ paddingBottom: `${bottomNavHeight + 20}px` }} // Add dynamic padding + extra space
      >
        <h1 className="text-2xl font-bold pb-5 text-center">
          User Registration
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="i.e. Juan dela Cruz"
                      {...field}
                      className="p-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Address */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="i.e. jdcruz@gmail.com"
                      {...field}
                      className="p-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="i.e. 09123456789"
                      {...field}
                      className="p-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* UP Radio Button */}
            <FormField
              control={form.control}
              name="up_student"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Are you a UP student?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        // Convert string to boolean
                        const boolValue = value === "true";
                        field.onChange(boolValue);
                        setIsUPStudent(boolValue); // Update state with boolean
                      }}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="true" className="p-2" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="false" className="p-2" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditionally render Year - Degree Program */}
            {isUPStudent === true && (
              <FormField
                control={form.control}
                name="year_degree" // Update field name to match schema
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      If yes, kindly indicate your year - degree program
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="i.e. 1 - BACMA; N/A"
                        {...field}
                        className="p-6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isUPStudent === false && (
              <FormField
                control={form.control}
                name="affiliation" // Update field name to match schema
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>If no, what is your affiliation?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="i.e. General public; N/A"
                        {...field}
                        className="p-6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Checkbox: Hear about event */}
            <FormField
              control={form.control}
              name="hear_about_event"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>How did you hear about this event?</FormLabel>
                  </div>
                  {hear_about_event.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="hear_about_event"
                      render={({ field: innerField }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                          >
                            <FormControl>
                              <Checkbox
                                className="p-2"
                                checked={innerField.value?.includes(item.label)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...innerField.value, item.label]
                                    : innerField.value?.filter(
                                        (value) => value !== item.label
                                      );

                                  innerField.onChange(updatedValue);

                                  // Clear "Others" text input if "others" is unchecked
                                  if (item.id === "others" && !checked) {
                                    setOtherText("");
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  {/* Conditionally render the "Others" input field */}
                  {field.value?.includes("Others") && (
                    <div className="mt-2 ml-7">
                      <Input
                        placeholder="Please specify"
                        value={otherText}
                        onChange={(e) => setOtherText(e.target.value)}
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="follow_guidelines"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Do you agree to follow event guidelines and safety
                    protocols?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        const boolValue = value === "true";
                        field.onChange(boolValue);
                      }}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="true" className="p-2" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="false" className="p-2" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allow_updates"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Do you allow us to contact you for event updates?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        const boolValue = value === "true";
                        field.onChange(boolValue);
                      }}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="true" className="p-2" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="false" className="p-2" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="font-inter w-full px-5 py-6 text-[14px] bg-black text-white rounded-md cursor-pointer disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? "Checking In..." : "Check-in"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
