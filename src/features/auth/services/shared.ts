import { formOptions } from "@tanstack/react-form/nextjs";
import * as z from "zod";

export const requestOtpSchema = z.object({
  email: z.email("Vui lòng nhập địa chỉ email hợp lệ"),
});

export const requestOtpFormOpts = formOptions({
  defaultValues: {
    email: "",
  },
  validators: {
    onChange: requestOtpSchema,
  },
});
