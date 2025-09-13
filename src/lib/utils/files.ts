import * as kv from "idb-keyval";

export const getUploadedFiles = async() => {
	const dir = await kv.get("images");
	if (!dir) return null;
	return dir as FileSystemDirectoryHandle;	
}
export const getStoredSpreadsheet = async() => {
	const sheet = await kv.get("sheet");
	if (!sheet) return null;
	return sheet as FileSystemDirectoryHandle;	
}
export const setStoredSpreadsheet = async(data: any) => {
	await kv.set("sheet", data);
}