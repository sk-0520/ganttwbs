import { z } from "zod";
import { SettingSchema } from "./Setting";

export const EditorDataSchema = z.object({
	fileName: z.string(),
	setting: SettingSchema,
});

export type EditorData = z.infer<typeof EditorDataSchema>;
