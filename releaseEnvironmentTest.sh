#!/bin/bash

# Validar HTML
echo "Validando HTML..."
find . -name "*.html" -not -path "./node_modules/*" -exec npx html-validate {} \;

# Validar CSS
echo "Validando CSS..."
find . -name "*.css" -not -path "./node_modules/*" -exec npx stylelint {} \;

# Validar JavaScript
echo "Validando JS..."
find . -name "*.js" -not -path "./node_modules/*" -exec npx eslint {} \;

echo "Pruebas completadas"