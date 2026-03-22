/**
 * Seed database with initial data.
 *
 * Usage: pnpm db:seed
 *
 * Steps:
 * 1. Import ingredients from data/seeds/ingredients.json
 * 2. Import recipes from data/seeds/recipes.json
 * 3. Link recipe ingredients
 * 4. Calculate nutrition per recipe
 * 5. Index recipes in Meilisearch
 */

// TODO: Implement after Prisma schema is set up

async function main() {
  console.log('🌱 Seeding database...')

  // Step 1: Import ingredients
  console.log('Importing ingredients...')
  // TODO

  // Step 2: Import recipes
  console.log('Importing recipes...')
  // TODO

  // Step 3: Calculate nutrition
  console.log('Calculating nutrition...')
  // TODO

  // Step 4: Index in Meilisearch
  console.log('Indexing recipes in Meilisearch...')
  // TODO

  console.log('✅ Seed complete!')
}

main().catch(console.error)
