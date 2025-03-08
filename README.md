
# News Aggregator with TTS

A modern news aggregator application with text-to-speech capabilities.

## Database Structure

The application uses Supabase as the backend with the following database structure:

### Companies Table

Stores information about the news sources/companies.

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Articles Table

Stores news articles with a relationship to companies.

```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  url TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster querying
CREATE INDEX articles_company_id_idx ON articles(company_id);
CREATE INDEX articles_category_idx ON articles(category);
CREATE INDEX articles_published_at_idx ON articles(published_at);
```

### Audio Clips Table

Stores audio clips generated from articles.

```sql
CREATE TABLE audio_clips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  duration DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster querying
CREATE INDEX audio_clips_article_id_idx ON audio_clips(article_id);
```

## Features

- Browse news articles from various companies
- Filter articles by category
- Text-to-speech functionality to listen to articles
- Save favorite articles
- Responsive design for all devices

## Technology Stack

- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- Supabase for backend (database, authentication, storage)
- TTS (Text-to-Speech) integration
