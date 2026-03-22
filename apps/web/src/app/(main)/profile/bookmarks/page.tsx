import SavedRecipesScreen from '@/features/recipes/components/SavedRecipesScreen';

export const metadata = {
  title: 'Món ăn đã lưu — MealMind',
  description: 'Danh sách các món ăn bạn đã lưu trên MealMind',
};

export default function BookmarksPage() {
  return <SavedRecipesScreen />;
}
