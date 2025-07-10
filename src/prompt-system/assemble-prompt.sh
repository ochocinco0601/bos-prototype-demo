#!/bin/bash
# BOS Prompt Assembler Script
# Usage: ./assemble-prompt.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_FILE="$SCRIPT_DIR/core/prompt-template.md"
MODULES_DIR="$SCRIPT_DIR/modules"

# Read template
template=$(cat "$TEMPLATE_FILE")

# Replace each module placeholder
for i in {0..9}; do
    module_file="$MODULES_DIR/module-$i-*.md"
    if ls $module_file 1> /dev/null 2>&1; then
        module_content=$(cat $module_file)
        placeholder="{{MODULE_${i}_*}}"
        # Use perl for more reliable replacement
        template=$(echo "$template" | perl -pe "s/\{\{MODULE_${i}_[A-Z_]+\}\}/$module_content/gs")
    fi
done

echo "$template"