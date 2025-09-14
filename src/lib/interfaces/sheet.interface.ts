
export const DELIMITER = ',';

export interface Sheet {
	fields: Field[];
	rows: Record<string, any>[];
}

export interface Field {
	title: string;
	instructions?: string;
}

