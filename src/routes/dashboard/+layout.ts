import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { projectExists } from '$lib/utils/project';

export const load: LayoutLoad = async ({ url }) => {
	if (!(await projectExists())) {
		throw redirect(300, '/new');
	}
};

