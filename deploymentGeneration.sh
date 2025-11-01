#!/bin/bash

# Limpiar y crear directorio build
rm -rf build
mkdir -p build

# Copiar archivos al build
cp -r assets img js temas *.html build/ 2>/dev/null

# Generar info del build
echo "Build: $(date)" > build/build-info.txt
echo "Commit: $(git rev-parse HEAD 2>/dev/null)" >> build/build-info.txt

echo "Build completado en ./build"