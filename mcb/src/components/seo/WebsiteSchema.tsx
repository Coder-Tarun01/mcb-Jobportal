import React from 'react';

interface WebsiteSchemaProps {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  potentialAction?: {
    target: string;
    queryInput: string;
  };
}

const WebsiteSchema: React.FC<WebsiteSchemaProps> = ({
  name = "MCB Jobs - MyCareerBuild",
  description = "Find your dream career with MCB Jobs. Discover 50,000+ job opportunities across India. Connect with top employers, build your career with our free job alerts, resume builder & career guidance.",
  url = "https://mcb.com",
  logo = "https://mcb.com/logo.png",
  sameAs = [
    "https://www.linkedin.com/company/mcb-jobs",
    "https://twitter.com/mcbjobs",
    "https://www.facebook.com/mcbjobs",
    "https://www.instagram.com/mcbjobs"
  ],
  potentialAction = {
    target: "https://mcb.com/jobs?q={search_term_string}",
    queryInput: "required name=search_term_string"
  }
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "description": description,
    "url": url,
    "logo": {
      "@type": "ImageObject",
      "url": logo,
      "width": 200,
      "height": 200
    },
    "sameAs": sameAs,
    "potentialAction": {
      "@type": "SearchAction",
      "target": potentialAction.target,
      "query-input": potentialAction.queryInput
    },
    "publisher": {
      "@type": "Organization",
      "name": "MCB - MyCareerBuild",
      "url": "https://mcb.com",
      "logo": {
        "@type": "ImageObject",
        "url": logo,
        "width": 200,
        "height": 200
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Job Listings",
      "description": "Current job openings and career opportunities",
      "url": "https://mcb.com/jobs"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default WebsiteSchema;
