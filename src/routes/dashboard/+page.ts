import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	if (url.pathname === '/dashboard') {
		throw redirect(302, '/dashboard/assist');
	}
};


