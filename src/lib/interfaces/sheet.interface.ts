
export const DELIMITER = ',';

export type Image = Record<string, FileSystemFileHandle>;
export interface Sheet {
	fields: Field[];
	rows: Record<string, any>[];
	images: Record<string, FileSystemFileHandle>[];
}

export interface Field {
	title: string;
	instructions?: string;
}
