#!/bin/bash

# Instalar herramientas de validación
npm install -g html-validate stylelint eslint

# Crear archivos de configuración básicos
echo '{"extends":["html-validate:recommended"]}' > .htmlvalidate.json
echo '{"extends":"stylelint-config-standard"}' > .stylelintrc.json
echo '{"env":{"browser":true,"es6":true},"extends":"eslint:recommended"}' > .eslintrc.json

echo "Entorno configurado"