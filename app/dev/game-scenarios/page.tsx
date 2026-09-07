import { notFound } from 'next/navigation';
import { GameScenarios } from './scenarios';
export default function Page() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return <GameScenarios />;
}
