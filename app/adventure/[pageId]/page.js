import { getPageData } from '../../../lib/pageService';
import PageClient from './pageClient';

export default async function AdventurePage({ params }) {
  const pageId = params.pageId;
  const page = await getPageData(pageId);
  
  // Pass data to client component
  return <PageClient page={page} pageId={pageId} />;
}
