import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { BookmarksController } from './bookmarks.controller';

@Module({
  controllers: [RecipesController, BookmarksController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
