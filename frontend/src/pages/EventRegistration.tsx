import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useState } from "react"
import Logo from './../assets/sari_sari_main_logo.svg';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  fname: z.string().min(2).max(50),
  email: z.string().email(),
  pnumber: z.string().min(11).max(11),
  confirmyupi: z.enum(["yupi", "nonyupi"]),
  yupi: z.string().optional(),
  nonyupi: z.string().optional(),
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Please select at least one item.",
  }),
  protocol: z.enum(["yesprotocol", "noprotocol"]),
  update: z.enum(["yesupdate", "noupdate"]),
})

const items = [
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
] as const

export default function EventRegistrationPage() {

  // State to track the "Others" input
  const [otherText, setOtherText] = useState<string>("");
  
  // Track the selected value
  const [isUPStudent, setIsUPStudent] = useState<string | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fname: "",
      email: "",
      items: [],
    },
  })

  // 2. Define a submit handler.
  function onSubmit(data: z.infer<typeof formSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  
  return (
    <div>
      <div className="flex justify-center mb-4">
        {/* Logo */}
        <img src={Logo} alt="Sari Sari Logo" className="h-14 w-14" />
      </div>

      <h1 className="text-2xl font-bold pb-5">User Registration</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="i.e. Juan dela Cruz" {...field} />
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
                  <Input placeholder="i.e. jdcruz@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="pnumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="i.e. 09123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* UP Radio Button */}
          <FormField
            control={form.control}
            name="confirmyupi"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Are you a UP student?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      setIsUPStudent(value); // Update state based on selection
                    }}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yupi" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="nonyupi" />
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
          {isUPStudent === "yupi" && (
            <FormField
              control={form.control}
              name="yupi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    If yes, kindly indicate your year - degree program
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="i.e. 1 - BACMA; N/A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Conditionally render Affiliation */}
          {isUPStudent === "nonyupi" && (
            <FormField
              control={form.control}
              name="nonyupi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>If no, what is your affiliation?</FormLabel>
                  <FormControl>
                    <Input placeholder="i.e. General public; N/A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Checkbox: Hear about event */}
          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>How did you hear about this event?</FormLabel>
                </div>
                {items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, item.id]);
                                } else {
                                  field.onChange(
                                    field.value?.filter((value) => value !== item.id)
                                  );
                                  if (item.id === "others") {
                                    setOtherText(""); // Clear the "Others" input when unchecked
                                  }
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
                {/* Render the "Others" input below the checkboxes */}
                {form.getValues("items")?.includes("others") && (
                  <div className="mt-2">
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
            name="protocol"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Do you agree to follow event guidelines and safety protocols?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yesprotocol" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="noprotocol" />
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
            name="update"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Do you allow us to contact you for event updates?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yesupdate" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="noupdate" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Register</Button>
        </form>
      </Form>
    </div>
  );
}
