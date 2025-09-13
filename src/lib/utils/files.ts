import * as kv from "idb-keyval";

export const getUploadedFiles = async() => {
	const dir = await kv.get("images");
	if (!dir) return null;
	const entries: [string, FileSystemFileHandle][] = [];
	for await (const entry of dir.entries()) {
		if (entry[1].kind !== "directory") continue;
		entries.push(entry as [string, FileSystemFileHandle])
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
