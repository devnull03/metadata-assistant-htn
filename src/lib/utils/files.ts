// USELESS FILE
// 
import type { Image } from "$lib/interfaces/sheet.interface";
import * as kv from "idb-keyval";
import { queryCohereRemote } from "../../routes/new/data.remote";

export const getUploadedFiles = async () => {
	const dir = (await kv.get("images")) as FileSystemDirectoryHandle;
	if (!dir) return null;
	await dir.requestPermission();
	const entries = [];
	for await (const entry of dir.entries()) {
		if (entry[1].kind !== "file") continue;
		entries.push(entry);
	}
	return entries;
};
export const getStoredSpreadsheet = async () => {
    const sheet = await kv.get("sheet");
    if (!sheet) return null;
    return sheet as FileSystemDirectoryHandle;
};
export const setStoredSpreadsheet = async (data: any) => {
    await kv.set("sheet", data);
};
// USELESS
export interface ImageResponse {
    is_done: boolean;
    metadata: {
        fileTitle: "";
        title: "[Photograph of a red apple]";
        field_linked_agent: "";
        field_extent: "";
        field_description: "The image depicts a single, whole red apple with a glossy surface and a visible stem. The apple appears fresh and is centered against a plain white background. There are no other objects or elements present in the image.";
        field_rights: "";
        field_resource_type: "still image";
        field_language: "";
        field_note: "";
        field_subject: "Apples; Fruits";
        field_subjects_name: "";
        field_subject_name__organization: "";
        field_geographic_subject: "";
        field_coordinates: "";
    };
    questions: [
        "What is the intended use or context of this image?",
        "Who is the creator or photographer of this image?",
        "Are there any specific notes or additional information about this image that should be included?",
        "What is the language of the description or any associated text?",
        "Is there a specific geographic location or context related to this image?",
        "Are there any rights or licensing information associated with this image?"
    ];
}

// USELESS
export const getImageRes = async (filename: string, base64: string, qna?: [string, string][]) => {
	console.log(base64)
	localStorage.imageRes ||= "{}";
	const data = (JSON.parse(localStorage.imageRes)[filename] ?? null) as null | ImageResponse;
	const dat =
		!data || (!data.is_done && qna)
			? await (await fetch("/api/image", { method: "post", body: JSON.stringify({ image: base64, qna }) })).json()
			: data;
	const temp = JSON.parse(localStorage.imageRes);
	localStorage.imageRes = JSON.stringify({ ...temp, [filename]: dat });
	return dat;
};
