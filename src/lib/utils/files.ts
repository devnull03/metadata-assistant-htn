import type { Image } from "$lib/interfaces/sheet.interface";
import * as kv from "idb-keyval";

export const getUploadedFiles = async() => {
	const dir = await kv.get("images");
	if (!dir) return null;
	const entries: Image[] = [];
	for await (const entry of dir.entries()) {
		if (entry[1].kind !== "file") continue;
		entries.push(entry as Image);
	}
	return entries;
}

export const getStoredSpreadsheet = async() => {
	const sheet = await kv.get("sheet");
	if (!sheet) return null;
	return sheet as FileSystemDirectoryHandle;	
}

export const setStoredSpreadsheet = async(data: any) => {
	await kv.set("sheet", data);
}

