import CookingModeScreen from '@/features/recipes/components/CookingModeScreen';

export const metadata = { title: 'Chế độ nấu ăn — MealMind' };

export default async function CookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CookingModeScreen recipeId={id} />;
}
