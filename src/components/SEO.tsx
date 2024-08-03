import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  url: string;
  image: string;
  twitterHandle?: string;
}

export default function SEO({ title, description, keywords, author, url, image, twitterHandle }: SEOProps) {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="icon" href="/favicon.webp" />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="pt_BR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {twitterHandle && <meta name="twitter:site" content={`@${twitterHandle}`} />}
      {twitterHandle && <meta name="twitter:creator" content={`@${twitterHandle}`} />}

      <link rel="canonical" href={url} />
      <meta name="theme-color" content="#317EFB" />
    </Head>
  );
};

