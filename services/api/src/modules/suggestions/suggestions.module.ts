import { Module } from '@nestjs/common';
import { SuggestionsController } from './suggestions.controller';
import { SuggestionsService } from './suggestions.service';
import { DietaryModule } from '../dietary/dietary.module';
import { RecipesModule } from '../recipes/recipes.module';

@Module({
  imports: [DietaryModule, RecipesModule],
  controllers: [SuggestionsController],
  providers: [SuggestionsService],
  exports: [SuggestionsService],
})
export class SuggestionsModule {}
