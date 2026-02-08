# GitHub CI/CD Setup Guide

## 📋 Pré-requisitos

1. Repositório no GitHub: `https://github.com/kaycfarias/trackly`
2. Conta no npm: https://www.npmjs.com/
3. npm token com permissões de publicação

## 🔐 Configurar Trusted Publishing no npm (Recomendado)

**Trusted Publishing** usa OIDC para autenticação automática - mais seguro que tokens!

### Setup no npm.com

1. **Login no npm**: https://www.npmjs.com/login

2. **Para cada package** (`trackly-sdk` e `trackly-react`):
   
   a. Acesse: `https://www.npmjs.com/package/trackly-sdk/access`
   
   b. Clique em **Trusted publishers** → **Add trusted publisher**
   
   c. Preencha:
   - Provider: `GitHub`
   - Repository: `kaycfarias/trackly`
   - Workflow: `publish.yml`
   - Environment: (deixe vazio ou use `production`)
   
   d. Clique em **Add**
   
   e. Repita para `trackly-react`

### Verificar Configuração

✅ Você deve ver na página do package:
- "GitHub Actions from kaycfarias/trackly can publish to this package"

### Vantagens

- ✅ Sem necessidade de `NPM_TOKEN` secret
- ✅ Autenticação automática via OIDC
- ✅ Mais seguro (tokens não podem vazar)
- ✅ Auditoria completa via provenance

---

## 🔑 Alternativa: NPM_TOKEN (Não Recomendado)

<details>
<summary>Clique para ver setup com token manual</summary>

### 1. Gerar Token no npm (Método Antigo)

**⚠️ Use Trusted Publishing acima em vez disto!**

```bash
# Login no npm
npm login

# Ou via browser
https://www.npmjs.com/settings/YOUR_USERNAME/tokens
```

1. Acesse **Account Settings** → **Access Tokens**
2. Clique em **Generate New Token** → **Classic Token**
3. Nome: `GitHub Actions - Trackly`
4. Type: **Automation** (recomendado) ou **Publish**
5. Copie o token (começa com `npm_...`)

### 2. Adicionar Secret no GitHub

1. Vá para: `https://github.com/kaycfarias/trackly/settings/secrets/actions`
2. Clique em **New repository secret**
3. Name: `NPM_TOKEN`
4. Secret: Cole o token do npm
5. Clique em **Add secret**

</details>

---

## 🚀 Workflows Criados

### 1. **CI Workflow** (`.github/workflows/ci.yml`)

**Triggers:**

- Push em `main` ou `develop`
- Pull requests para `main` ou `develop`

**Ações:**

- ✅ Build dos packages
- ✅ Type checking do TypeScript
- ✅ Verificação de artifacts (dist/)
- ✅ Report de bundle sizes

### 2. **Publish Workflow** (`.github/workflows/publish.yml`)

**Trigger:**

- Push de tag com formato `v*` (ex: `v0.1.0`, `v1.2.3`)

**Ações:**

- ✅ Build dos packages
- ✅ Validação de versões (tag vs package.json)
- ✅ Publicação no npm com provenance
- ✅ Criação de GitHub Release automático

### 3. **PR Checks** (`.github/workflows/pr-checks.yml`)

**Trigger:**

- Pull requests (aberto/atualizado)

**Ações:**

- ✅ Validação de PR title (Conventional Commits)
- ✅ Alerta se package.json mudou
- ✅ Report de bundle sizes

## 📦 Processo de Release

### Opção 1: Manual (Recomendado para início)

```bash
# 1. Atualizar versões nos package.json
# packages/sdk/package.json
# packages/react/package.json

# 2. Commit e push
git add .
git commit -m "chore: release v0.1.0"
git push origin main

# 3. Criar tag
git tag v0.1.0
git push origin v0.1.0

# ✨ GitHub Actions vai automaticamente:
# - Buildar packages
# - Publicar no npm
# - Criar GitHub Release
```

### Opção 2: Usando GitHub CLI

```bash
# Atualizar versões primeiro, depois:
gh release create v0.1.0 \
  --title "Release v0.1.0" \
  --notes "Initial release of Trackly SDK"

# Isso vai:
# - Criar tag
# - Criar release
# - Trigger o workflow de publish
```

### Opção 3: Via GitHub UI

1. Vá para: `https://github.com/kaycfarias/trackly/releases/new`
2. Tag: `v0.1.0`
3. Release title: `Release v0.1.0`
4. Description: Descreva as mudanças
5. Clique em **Publish release**

## 🔍 Monitoramento

### Ver Workflows Rodando

```bash
# Via CLI
gh run list
gh run watch

# Ou via browser
https://github.com/kaycfarias/trackly/actions
```

### Verificar Publicação

Após workflow de publish completar:

```bash
# Verificar no npm
npm view trackly-sdk
npm view trackly-react

# Ver no browser
https://www.npmjs.com/package/trackly-sdk
https://www.npmjs.com/package/trackly-react
```

## 🛡️ Proteções de Branch (Recomendado)

Configure proteções para branch `main`:

1. Acesse: `https://github.com/kaycfarias/trackly/settings/branches`
2. Add rule para `main`:
   - ☑️ Require pull request reviews
   - ☑️ Require status checks to pass (selecione "Build & Validate")
   - ☑️ Require branches to be up to date

## 🐛 Troubleshooting

### Erro: "NPM_TOKEN not found"

```bash
# Verifique se secret está configurado:
# Settings → Secrets and variables → Actions → NPM_TOKEN
```

### Erro: "Version mismatch"

```bash
# Certifique-se que versões em package.json correspondem à tag:
git tag v0.1.0  # Tag deve ser igual à version nos package.json
```

### Workflow não trigou

```bash
# Verifique se push da tag foi feito:
git push origin v0.1.0  # Não esqueça de push a tag!

# Ou push todas tags:
git push origin --tags
```

### Publicação falhou

```bash
# Verifique logs detalhados:
https://github.com/kaycfarias/trackly/actions

# Ou via CLI:
gh run view --log-failed
```

## 📊 Status Badges

Adicione ao README.md:

```markdown
![CI](https://github.com/kaycfarias/trackly/actions/workflows/ci.yml/badge.svg)
![npm version](https://img.shields.io/npm/v/trackly-sdk.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
```

## 🔄 Workflow de Desenvolvimento

```bash
# 1. Criar branch
git checkout -b feat/nova-funcionalidade

# 2. Fazer mudanças e commit
git add .
git commit -m "feat: adicionar nova funcionalidade"

# 3. Push e criar PR
git push origin feat/nova-funcionalidade
gh pr create

# 4. CI vai rodar automaticamente
# 5. Após aprovação, merge para main
# 6. Para release, criar tag (veja processo acima)
```

## 📝 Conventional Commits

Tipos aceitos nos PRs:

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças em documentação
- `style:` Formatação (sem mudança de código)
- `refactor:` Refatoração
- `perf:` Melhorias de performance
- `test:` Adicionar/atualizar testes
- `build:` Mudanças no build system
- `ci:` Mudanças no CI/CD
- `chore:` Outras tarefas

**Exemplos:**

```
feat(sdk): adicionar retry exponential backoff
fix(react): corrigir memory leak no usePageview
docs: atualizar guia de instalação
```
