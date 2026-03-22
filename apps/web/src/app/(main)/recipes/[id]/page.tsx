import RecipeDetailScreen from '@/features/recipes/components/RecipeDetailScreen';

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  return <RecipeDetailScreen recipeId={params.id} />;
}
