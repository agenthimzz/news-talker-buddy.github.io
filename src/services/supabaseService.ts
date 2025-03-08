
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Define types for our database
export interface Company {
	id: string;
	name: string;
	logo_url: string;
	created_at: string;
}

export interface Article {
	id: string;
	company_id: string;
	title: string;
	description: string;
	content: string;
	url: string;
	image_url: string;
	published_at: string;
	category: string;
	created_at: string;
}

export interface AudioClip {
	id: string;
	article_id: string;
	audio_url: string;
	duration: number;
	created_at: string;
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
	console.error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Company operations
export const fetchCompanies = async (): Promise<Company[]> => {
	try {
		const { data, error } = await supabase
			.from('companies')
			.select('*')
			.order('name');
			
		if (error) throw error;
		return data || [];
	} catch (error) {
		console.error('Error fetching companies:', error);
		toast.error('Failed to fetch companies');
		return [];
	}
};

// Article operations
export const fetchArticles = async (
	category: string = '',
	companyId: string = '',
	limit: number = 10
): Promise<Article[]> => {
	try {
		let query = supabase
			.from('articles')
			.select('*')
			.order('published_at', { ascending: false })
			.limit(limit);
			
		if (category && category !== 'general') {
			query = query.eq('category', category);
		}
		
		if (companyId) {
			query = query.eq('company_id', companyId);
		}
		
		const { data, error } = await query;
		
		if (error) throw error;
		return data || [];
	} catch (error) {
		console.error('Error fetching articles:', error);
		toast.error('Failed to fetch articles');
		return [];
	}
};

export const fetchArticleById = async (id: string): Promise<Article | null> => {
	try {
		const { data, error } = await supabase
			.from('articles')
			.select('*')
			.eq('id', id)
			.single();
			
		if (error) throw error;
		return data;
	} catch (error) {
		console.error('Error fetching article:', error);
		toast.error('Failed to fetch article details');
		return null;
	}
};

// Audio clip operations
export const fetchAudioClipByArticleId = async (articleId: string): Promise<AudioClip | null> => {
	try {
		const { data, error } = await supabase
			.from('audio_clips')
			.select('*')
			.eq('article_id', articleId)
			.single();
			
		if (error && error.code !== 'PGRST116') throw error;
		return data || null;
	} catch (error) {
		console.error('Error fetching audio clip:', error);
		toast.error('Failed to fetch audio clip');
		return null;
	}
};

export const createAudioClip = async (audioClip: Omit<AudioClip, 'id' | 'created_at'>): Promise<AudioClip | null> => {
	try {
		const { data, error } = await supabase
			.from('audio_clips')
			.insert(audioClip)
			.select()
			.single();
			
		if (error) throw error;
		return data;
	} catch (error) {
		console.error('Error creating audio clip:', error);
		toast.error('Failed to save audio clip');
		return null;
	}
};
