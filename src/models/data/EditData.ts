import { z } from "zod";
import { SettingSchema } from "./Setting";

export const EditDataSchema = z.object({
	fileName: z.string(),
	setting: SettingSchema,
});

export type EditData = z.infer<typeof EditDataSchema>;
