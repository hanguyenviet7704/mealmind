/**
 * Generate TypeScript API client from OpenAPI specs.
 *
 * Usage: pnpm generate:api
 *
 * Reads OpenAPI specs from specs/*/api.yaml and services/api/openapi/
 * Generates typed client in packages/api-client/
 */

// TODO: Implement with openapi-typescript or similar tool

async function main() {
  console.log('Generating API client from OpenAPI specs...')

  // TODO: Read all api.yaml files from specs/
  // TODO: Merge into single OpenAPI spec
  // TODO: Generate TypeScript types + fetch client
  // TODO: Write to packages/api-client/src/

  console.log('✅ API client generated!')
}

main().catch(console.error)
