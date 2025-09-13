import { queryCohere } from '$lib/server/server';
import { query } from '$app/server';


export const getPosts = query(queryCohere);