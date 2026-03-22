#!/bin/bash
# Verify a feature meets its acceptance criteria.
#
# Usage: ./scripts/verify-feature.sh <feature-name>
# Example: ./scripts/verify-feature.sh meal-suggestion

FEATURE=$1

if [ -z "$FEATURE" ]; then
    echo "Usage: ./scripts/verify-feature.sh <feature-name>"
    echo "Available features:"
    ls specs/
    exit 1
fi

SPEC_DIR="specs/$FEATURE"

if [ ! -d "$SPEC_DIR" ]; then
    echo "Error: Feature '$FEATURE' not found in specs/"
    exit 1
fi

echo "=== Verifying feature: $FEATURE ==="
echo ""
echo "--- Acceptance Criteria ---"
cat "$SPEC_DIR/acceptance.md"
echo ""
echo "--- Running tests ---"
pnpm test --filter="*${FEATURE}*"
echo ""
echo "--- Lint check ---"
pnpm lint
echo ""
echo "=== Verification complete ==="
