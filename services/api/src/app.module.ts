import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { DietaryModule } from './modules/dietary/dietary.module';
import { SuggestionsModule } from './modules/suggestions/suggestions.module';
import { MealPlansModule } from './modules/meal-plans/meal-plans.module';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { InteractionsModule } from './modules/interactions/interactions.module';
import { MealLogsModule } from './modules/meal-logs/meal-logs.module';
import { ShoppingListModule } from './modules/shopping-list/shopping-list.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting (global defaults)
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,   // 1 second
        limit: 10,   // 10 req/sec
      },
      {
        name: 'long',
        ttl: 60000,  // 1 minute
        limit: 100,  // 100 req/min
      },
    ]),

    // Infrastructure
    PrismaModule,
    // Feature modules
    AuthModule,
    UsersModule,
    OnboardingModule,
    RecipesModule,
    DietaryModule,
    SuggestionsModule,
    MealPlansModule,
    NutritionModule,
    InteractionsModule,
    MealLogsModule,
    ShoppingListModule,
    NotificationsModule,
    HealthModule,
  ],
})
export class AppModule {}

