import { KeyRound } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { useState, useEffect } from "react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [svg, setSvg] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/auth/register`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setSvg(data.qr_code)
      })
      .catch(() => {
      });
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <KeyRound className="size-6" />
              </div>
              <span className="sr-only">Password App</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to the Password App</h1>
            <FieldDescription>
              Already have an account? <a href="#">Sign in</a>
            </FieldDescription>
          </div>
        </FieldGroup>
      </form>
      <div
        dangerouslySetInnerHTML={{ __html: svg ?? "" }}
        className="flex justify-center items-center bg-white p-2"
      />
    </div>
  )
}
