import { generatePersonalizedInitialContent } from '@/ai/flows/personalized-initial-content';
import AuthPage from '@/components/auth/auth-page';

export default async function Home() {
  // Using default values as user is not authenticated yet.
  const personalizedContent = await generatePersonalizedInitialContent({
    interests: 'Artificial Intelligence, machine learning, technology trends',
    location: 'San Francisco, CA',
  });

  return <AuthPage initialContent={personalizedContent.contentSnippet} />;
}
