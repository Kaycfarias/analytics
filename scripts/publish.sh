#!/bin/bash
set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Trackly Release Script${NC}\n"

# Verifica se há mudanças não commitadas
if [[ -n $(git status -s) ]]; then
  echo -e "${RED}❌ Há mudanças não commitadas. Commit ou stash antes de publicar.${NC}"
  exit 1
fi

# Pega versão atual
CURRENT_VERSION=$(node -p "require('./packages/sdk/package.json').version")
echo -e "📦 Versão atual: ${YELLOW}$CURRENT_VERSION${NC}"

# Pergunta tipo de bump
echo -e "\nQual tipo de versão?"
echo "  1) patch (0.2.6 → 0.2.7)"
echo "  2) minor (0.2.6 → 0.3.0)"
echo "  3) major (0.2.6 → 1.0.0)"
echo "  4) custom"
read -p "Escolha [1-4]: " BUMP_TYPE

case $BUMP_TYPE in
  1)
    NEW_VERSION=$(node -p "
      const v = '$CURRENT_VERSION'.split('.');
      v[2] = parseInt(v[2]) + 1;
      v.join('.');
    ")
    ;;
  2)
    NEW_VERSION=$(node -p "
      const v = '$CURRENT_VERSION'.split('.');
      v[1] = parseInt(v[1]) + 1;
      v[2] = 0;
      v.join('.');
    ")
    ;;
  3)
    NEW_VERSION=$(node -p "
      const v = '$CURRENT_VERSION'.split('.');
      v[0] = parseInt(v[0]) + 1;
      v[1] = 0;
      v[2] = 0;
      v.join('.');
    ")
    ;;
  4)
    read -p "Digite a nova versão: " NEW_VERSION
    ;;
  *)
    echo -e "${RED}Opção inválida${NC}"
    exit 1
    ;;
esac

echo -e "\n📝 Nova versão: ${GREEN}$NEW_VERSION${NC}"
read -p "Confirma? [y/N]: " CONFIRM

if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "Cancelado."
  exit 0
fi

# Atualiza package.json files
echo -e "\n📝 Atualizando package.json..."
node -e "
  const fs = require('fs');
  const sdkPath = './packages/sdk/package.json';
  const reactPath = './packages/react/package.json';
  
  const sdk = JSON.parse(fs.readFileSync(sdkPath, 'utf8'));
  const react = JSON.parse(fs.readFileSync(reactPath, 'utf8'));
  
  sdk.version = '$NEW_VERSION';
  react.version = '$NEW_VERSION';
  
  fs.writeFileSync(sdkPath, JSON.stringify(sdk, null, 2) + '\n');
  fs.writeFileSync(reactPath, JSON.stringify(react, null, 2) + '\n');
  
  console.log('✅ Versões atualizadas');
"

# Build
echo -e "\n🔨 Building packages..."
pnpm build

# Git commit e tag
echo -e "\n📦 Commitando e criando tag..."
git add packages/*/package.json
git commit -m "chore: bump version to $NEW_VERSION"
git tag "v$NEW_VERSION"

# Push
echo -e "\n🚢 Pushing para GitHub..."
git push
git push origin "v$NEW_VERSION"

echo -e "\n${GREEN}✅ Versão $NEW_VERSION publicada!${NC}"
echo -e "🔗 Acompanhe em: https://github.com/Kaycfarias/trackly/actions"
