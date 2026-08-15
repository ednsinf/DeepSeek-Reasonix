# Reasonix + Verboo AI

Fork do [DeepSeek-Reasonix](https://github.com/esengine/DeepSeek-Reasonix) configurado para usar a API Verboo AI com auto-compaction automática.

## Modelos Compatíveis

| Modelo | Context Window | Auto-Compact | Uso Recomendado |
|--------|---------------|--------------|-----------------|
| **mimo-v2.5** | 1M tokens | ✅ Automático | Código + Vision (omni-modal) |
| **deepseek-v4-flash** | 1M tokens | ✅ Automático | Código rápido + reasoning |
| **qwen3.6-27b** | 262k tokens | ✅ Automático | Código geral |
| **glm-4.7-flash** | 201k tokens | ✅ Automático | Tarefas leves |

> **Auto-Compact:** O Reasonix gerencia automaticamente a janela de contexto. Quando o contexto excede o limite, as mensagens antigas são resumidas automaticamente. Não é necessário configurar nada.

## Configuração

### 1. Provider Verboo

Adicione em `reasonix.toml`:

```toml
[[providers]]
name        = "verboo-mimo"
kind        = "openai"
base_url    = "https://code.verboo.ai/router/v1"
model       = "mimo-v2.5"
api_key_env = "VERBOO_API_KEY"
context_window = 1000000
thinking    = "enabled"
```

### 2. API Key

```bash
# Linux/Mac
export VERBOO_API_KEY="sua-chave-aqui"

# Windows PowerShell
$env:VERBOO_API_KEY = "sua-chave-aqui"
```

### 3. Iniciar

```bash
# CLI
reasonix run "sua tarefa"

# Desktop
# Abrir: Reasonix.exe
```

## Instalação

### CLI
```bash
npm i -g reasonix
```

### Desktop App
[Baixar installer](https://github.com/esengine/DeepSeek-Reasonix/releases)

### VS Code Extension
```
Extension ID: SivanLiu.reasonix-agent
```

## Skills

| Skill | Comando | Descrição |
|-------|---------|-----------|
| explore | `/explore <pergunta>` | Investigar codebase |
| research | `/research <pergunta>` | Pesquisar + code |
| review | `/review` | Revisar código |
| security | `/security-review` | Review de segurança |

## Links

- [Reasonix Original](https://github.com/esengine/DeepSeek-Reasonix)
- [Verboo AI](https://code.verboo.ai)
- [Documentação Reasonix](https://github.com/esengine/DeepSeek-Reasonix/tree/main/docs)
