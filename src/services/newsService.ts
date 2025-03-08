
import { toast } from "sonner";
import { fetchArticles, fetchArticleById as fetchSupabaseArticleById, Article as SupabaseArticle } from "./supabaseService";

// Define types for our news data
export interface NewsArticle {
	id: string;
	title: string;
	description: string;
	content: string;
	url: string;
	image: string;
	publishedAt: string;
	source: {
		name: string;
		url: string;
	};
	category: string;
}

export type NewsCategory = 'general' | 'business' | 'technology' | 'entertainment' | 'sports' | 'science' | 'health';

// Function to convert Supabase Article to NewsArticle format
const mapArticleToNewsArticle = (article: SupabaseArticle): NewsArticle => {
	return {
		id: article.id,
		title: article.title,
		description: article.description || "",
		content: article.content,
		url: article.url || "",
		image: article.image_url || "",
		publishedAt: article.published_at,
		source: {
			name: "News Aggregator", // This would come from companies table in a full implementation
			url: "",
		},
		category: article.category || "general",
	};
};

// Mock data for development (we'll use this if the Supabase data is empty)
const mockNewsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Apple Unveils Revolutionary AI Features for iOS 18",
    description: "The tech giant announced significant AI enhancements coming to iPhone and iPad in the next major software update.",
    content: "Apple has revealed its most ambitious AI strategy yet with iOS 18, introducing features that will transform how users interact with their devices. The update includes an enhanced Siri with deeper app integration, AI-powered photo editing tools, predictive text suggestions, and smart notification management. \"These features represent the biggest leap forward in iOS intelligence,\" said Apple CEO Tim Cook during the announcement. The company emphasized that all AI processing happens on-device, maintaining Apple's commitment to privacy. Developers will also gain access to new AI APIs, enabling a new generation of intelligent apps. The update is expected to roll out this fall for iPhone 12 and newer devices.",
    url: "https://example.com/apple-ai-features",
    image: "https://source.unsplash.com/random/800x600?apple",
    publishedAt: "2023-06-10T14:30:00Z",
    source: {
      name: "Tech Insider",
      url: "https://example.com/tech-insider"
    },
    category: "technology"
  },
  {
    id: "2",
    title: "Global Markets Rise as Inflation Concerns Ease",
    description: "Stock markets worldwide showed gains as new economic data suggests inflation may be cooling.",
    content: "Global stock markets rallied on Thursday as fresh economic data indicated that inflation pressures might be easing in major economies. The S&P 500 rose 1.2%, while European indices gained an average of 0.8%. Asian markets also closed higher, with Japan's Nikkei up 1.5%. The positive market reaction came after the U.S. Labor Department reported that consumer prices increased less than expected in May, rising 3.1% from a year earlier—down from 3.4% in April. \"This is exactly what investors wanted to see,\" said Jane Smith, chief economist at Global Investments. \"It suggests the Fed's policy is working without pushing the economy into recession.\" Bond yields fell following the news, with the 10-year Treasury yield dropping to 3.8%. Economists now predict that central banks might begin cutting interest rates sooner than previously expected, possibly as early as September.",
    url: "https://example.com/markets-inflation",
    image: "https://source.unsplash.com/random/800x600?finance",
    publishedAt: "2023-06-09T18:45:00Z",
    source: {
      name: "Financial Times",
      url: "https://example.com/financial-times"
    },
    category: "business"
  },
  {
    id: "3",
    title: "Breakthrough in Renewable Energy Storage Announced",
    description: "Scientists develop a new battery technology that could solve the intermittency problem of renewable energy.",
    content: "Researchers at MIT have announced a breakthrough in energy storage technology that could revolutionize renewable energy usage. The new battery system, which uses abundant materials such as aluminum and sulfur, can store electricity for long periods at one-sixth the cost of current lithium-ion batteries. This development addresses one of the main challenges of renewable energy sources like solar and wind power: their intermittent nature. \"With this technology, we can store energy when the sun is shining or the wind is blowing, and deploy it when needed,\" explained Dr. Rebecca Chen, the lead researcher on the project. The battery has demonstrated the ability to withstand thousands of charge cycles without significant degradation. Industry experts believe this could accelerate the global transition to clean energy, making renewable sources more reliable and cost-effective. Several energy companies have already expressed interest in commercializing the technology, with pilot projects expected to begin next year.",
    url: "https://example.com/renewable-energy-breakthrough",
    image: "https://source.unsplash.com/random/800x600?energy",
    publishedAt: "2023-06-08T09:15:00Z",
    source: {
      name: "Science Daily",
      url: "https://example.com/science-daily"
    },
    category: "science"
  },
  {
    id: "4",
    title: "Olympic Committee Announces New Sustainability Requirements for Future Games",
    description: "Future Olympic host cities will need to meet strict environmental standards under new guidelines.",
    content: "The International Olympic Committee (IOC) has introduced comprehensive sustainability requirements for cities bidding to host future Olympic Games. Under the new framework, potential host cities must demonstrate how they will achieve carbon neutrality, minimize waste, and protect local ecosystems. \"The Olympic Games must be a force for positive change in the world,\" said IOC President Thomas Bach. \"These requirements ensure that sustainability is at the heart of planning and delivery.\" The guidelines require host cities to use existing or temporary venues whenever possible, power all Olympic facilities with renewable energy, and eliminate single-use plastics. Additionally, hosts must implement plans for sustainable transportation, responsible sourcing, and water conservation. The IOC also announced a partnership with the United Nations to monitor compliance with these standards. The new requirements will take effect immediately and apply to bids for the 2036 Summer Olympics and beyond. Environmental experts have welcomed the announcement, though some critics question whether the measures go far enough to address the Games' historical environmental impact.",
    url: "https://example.com/olympic-sustainability",
    image: "https://source.unsplash.com/random/800x600?olympics",
    publishedAt: "2023-06-07T16:20:00Z",
    source: {
      name: "Sports News Network",
      url: "https://example.com/sports-news"
    },
    category: "sports"
  },
  {
    id: "5",
    title: "Major Breakthrough in Alzheimer's Treatment Shows Promise in Clinical Trials",
    description: "A new drug therapy has demonstrated significant cognitive improvements in early-stage Alzheimer's patients.",
    content: "A groundbreaking drug therapy for Alzheimer's disease has shown remarkable results in Phase 3 clinical trials, potentially offering hope to millions of patients worldwide. The treatment, developed by NeuroCure Pharmaceuticals, targets the tau protein tangles in the brain—one of the hallmarks of Alzheimer's disease. According to results published in the New England Journal of Medicine, patients receiving the drug experienced a 42% reduction in cognitive decline compared to those on placebo over an 18-month period. \"These results represent the most significant advancement in Alzheimer's treatment in decades,\" said Dr. James Wilson, who led the international study. \"For the first time, we're seeing a therapy that doesn't just slow the disease but appears to partially reverse cognitive symptoms in some patients.\" The treatment combines an antibody therapy with a novel delivery system that helps the drug cross the blood-brain barrier more effectively than previous attempts. Side effects were reported as mild to moderate, primarily consisting of headaches and dizziness. The pharmaceutical company has already submitted data to regulatory agencies and hopes to receive approval within the next year. If approved, the treatment would initially target patients with early-stage Alzheimer's, though researchers are optimistic it could eventually be used preventatively in high-risk individuals.",
    url: "https://example.com/alzheimers-breakthrough",
    image: "https://source.unsplash.com/random/800x600?medical",
    publishedAt: "2023-06-06T11:05:00Z",
    source: {
      name: "Health Journal",
      url: "https://example.com/health-journal"
    },
    category: "health"
  },
  {
    id: "6",
    title: "Film Industry Embraces Virtual Production Technologies",
    description: "Hollywood studios are increasingly adopting LED-wall technology pioneered by 'The Mandalorian'.",
    content: "The film and television industry is undergoing a significant transformation as more productions adopt virtual production techniques using massive LED walls. The technology, which gained prominence with Disney's 'The Mandalorian,' creates realistic digital backgrounds in real-time, eliminating the need for green screens and post-production compositing. Major studios including Warner Bros., Universal, and Sony have invested heavily in permanent virtual production stages over the past year. \"This isn't just a trend—it's a revolution in how we make content,\" said filmmaker James Cameron, who is utilizing the technology for his upcoming projects. The LED walls display computer-generated environments that respond to camera movements, creating the illusion that actors are on location while actually filming on a soundstage. This approach offers numerous advantages: productions can 'visit' multiple locations in a single day, weather and lighting conditions can be precisely controlled, and the environmental impact of travel is reduced. Industry analysts estimate that by 2025, over 40% of major productions will use some form of virtual production. The technology has also created new job categories that blend traditional filmmaking skills with game design and real-time rendering expertise. Film schools have begun incorporating these techniques into their curricula to prepare students for the changing landscape.",
    url: "https://example.com/virtual-production",
    image: "https://source.unsplash.com/random/800x600?movie",
    publishedAt: "2023-06-05T08:30:00Z",
    source: {
      name: "Entertainment Weekly",
      url: "https://example.com/entertainment-weekly"
    },
    category: "entertainment"
  }
];

export const fetchNews = async (category: NewsCategory = 'general', count: number = 10): Promise<NewsArticle[]> => {
	try {
		console.log(`Fetching ${count} news articles for category: ${category}`);
		
		// Try to get articles from Supabase
		const articles = await fetchArticles(category, "", count);
		
		if (articles.length > 0) {
			return articles.map(mapArticleToNewsArticle);
		}
		
		// Fallback to mock data if no articles in Supabase
		console.log("No articles found in Supabase, using mock data");
		
		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 800));
		
		// Filter by category if not 'general'
		const filteredArticles = category === 'general' 
			? mockNewsArticles 
			: mockNewsArticles.filter(article => article.category === category);
			
		return filteredArticles.slice(0, count);
	} catch (error) {
		console.error('Error fetching news:', error);
		toast.error('Failed to fetch news. Please try again.');
		return [];
	}
};

export const fetchArticleById = async (id: string): Promise<NewsArticle | null> => {
	try {
		// Try to get article from Supabase
		const article = await fetchSupabaseArticleById(id);
		
		if (article) {
			return mapArticleToNewsArticle(article);
		}
		
		// Fallback to mock data if article not found in Supabase
		console.log("Article not found in Supabase, checking mock data");
		
		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 500));
		
		const mockArticle = mockNewsArticles.find(article => article.id === id);
		if (!mockArticle) {
			throw new Error('Article not found');
		}
		
		return mockArticle;
	} catch (error) {
		console.error('Error fetching article:', error);
		toast.error('Failed to fetch article. Please try again.');
		return null;
	}
};
