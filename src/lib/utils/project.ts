import type { Image, Field, Sheet } from "$lib/interfaces/sheet.interface";
import { getUploadedFiles, setStoredSpreadsheet } from "./files";
import * as kv from "idb-keyval";

/**
 * Default fields configuration for new projects
 */
export interface DefaultFieldConfig {
	field: Field;
	generator?: (image: Image, index: number) => any;
}

/**
 * Default fields that are created for new projects
 */
export const DEFAULT_FIELDS: DefaultFieldConfig[] = [
	{
		field: {
			title: 'file',
			instructions: 'File names must match exactly with uploaded images.'
		},
		generator: (image: Image) => image[1].name
	},
	{
		field: {
			title: 'file_extension',
			instructions: 'File extension extracted from the filename.'
		},
		generator: (image: Image) => {
			const name = image[1].name;
			const lastDot = name.lastIndexOf('.');
			return lastDot !== -1 ? name.substring(lastDot + 1) : '';
		}
	},
	{
		field: {
			title: 'accessIdentifier',
			instructions: 'Unique identifier for accessing this item.'
		},
		generator: () => '' // Empty for now, can be customized later
	}
];

/**
 * Project creation options
 */
export interface ProjectCreationOptions {
	name?: string;
	defaultFields?: DefaultFieldConfig[];
	sortOrder?: 'asc' | 'desc';
}

/**
 * Fast check if a project exists in storage
 * @returns Promise<boolean> - true if project exists, false otherwise
 */
export async function projectExists(): Promise<boolean> {
	// Check if we're in a browser environment
	if (typeof window === 'undefined') {
		return true;
	}

	try {
		const sheet = await kv.get('sheet');
		return sheet !== undefined && sheet !== null;
	} catch (error) {
		console.error('Failed to check if project exists:', error);
		return false;
	}
}

/**
 * Sort images in the specified order
 */
function sortImages(images: Image[], order: 'asc' | 'desc' = 'desc'): Image[] {
	return images.sort((a, b) => {
		const nameA = a[1].name;
		const nameB = b[1].name;

		if (order === 'desc') {
			return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
		} else {
			return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
		}
	});
}

/**
 * Generate template spreadsheet data from images and field configurations
 */
function generateTemplateSpreadsheet(
	images: Image[],
	fieldConfigs: DefaultFieldConfig[]
): Sheet {
	// Extract fields from configurations
	const fields = fieldConfigs.map(config => config.field);

	// Generate rows using the generator functions
	const rows = images.map((image, index) => {
		const row: Record<string, any> = {};

		fieldConfigs.forEach(config => {
			const fieldTitle = config.field.title;
			if (config.generator) {
				row[fieldTitle] = config.generator(image, index);
			} else {
				row[fieldTitle] = '';
			}
		});

		return row;
	});

	return {
		fields,
		rows,
		images
	};
}

/**
 * Create a new project from scratch using uploaded images
 */
export async function createFromScratch(options: ProjectCreationOptions = {}): Promise<Sheet | null> {
	try {
		// Get uploaded files
		const images = await getUploadedFiles();
		if (!images || images.length === 0) {
			console.warn('No uploaded images found');
			return null;
		}

		// Use provided fields or default ones
		const fieldConfigs = options.defaultFields || DEFAULT_FIELDS;

		// Sort images (default: descending)
		const sortOrder = options.sortOrder || 'desc';
		const sortedImages = sortImages(images, sortOrder);

		// Generate template spreadsheet
		const sheet = generateTemplateSpreadsheet(sortedImages, fieldConfigs);

		// Store the project
		await setStoredSpreadsheet(sheet);

		// Optionally store project metadata
		if (options.name) {
			await kv.set('project-name', options.name);
		}

		console.log(`Created project with ${sheet.rows.length} items`);
		return sheet;

	} catch (error) {
		console.error('Failed to create project from scratch:', error);
		return null;
	}
}

/**
 * Create custom field configuration
 */
export function createFieldConfig(
	title: string,
	instructions?: string,
	generator?: (image: Image, index: number) => any
): DefaultFieldConfig {
	return {
		field: { title, instructions },
		generator
	};
}

/**
 * Get default field configurations (useful for extending)
 */
export function getDefaultFields(): DefaultFieldConfig[] {
	return [...DEFAULT_FIELDS];
}

/**
 * Create project with custom fields
 */
export async function createWithCustomFields(
	customFields: DefaultFieldConfig[],
	options: Omit<ProjectCreationOptions, 'defaultFields'> = {}
): Promise<Sheet | null> {
	return createFromScratch({
		...options,
		defaultFields: customFields
	});
}

/**
 * Load existing project from storage
 */
export async function loadProject(): Promise<Sheet | null> {
	try {
		const sheet = await kv.get('sheet');
		return sheet as Sheet || null;
	} catch (error) {
		console.error('Failed to load project:', error);
		return null;
	}
}

/**
 * Save project to storage
 */
export async function saveProject(sheet: Sheet): Promise<boolean> {
	try {
		await setStoredSpreadsheet(sheet);
		return true;
	} catch (error) {
		console.error('Failed to save project:', error);
		return false;
	}
}

/**
 * Clear current project
 */
export async function clearProject(): Promise<boolean> {
	try {
		await kv.del('sheet');
		await kv.del('project-name');
		return true;
	} catch (error) {
		console.error('Failed to clear project:', error);
		return false;
	}
}
