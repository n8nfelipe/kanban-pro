# 🚀 Notas de Lançamento: Kanban Pro v1.1.0

Esta versão consolida o **Kanban Pro** como uma solução full-stack completa, focando em usabilidade intuitiva, persistência robusta e uma interface de alto nível.

---

## 💎 Destaques da Versão 1.1.0

### 1. Edição Evoluída e Intuitiva [NOVO]
A forma como você interage com suas tarefas foi redesenhada para ser mais natural.
- **Cards Clicáveis**: Não é mais necessário clicar apenas no ícone de edição. Agora, clicar em qualquer área do card abre o editor de tarefas.
- **Exclusão de Tarefas**: Implementada a funcionalidade de "Delete". Agora você pode remover tarefas permanentemente com um clique e confirmação de segurança.
- **UX Refinada**: Melhoria nos estados de hover e transições, garantindo que o Drag & Drop e a Edição coexistam sem conflitos.

### 2. Motor Full-Stack (PostgreSQL + Prisma)
O sistema agora possui memória permanente. Seus quadros, colunas e tarefas são salvos em um banco de dados relacional de alto desempenho.
- **Persistência Total**: Recarregue a página sem medo; seus dados estão seguros no PostgreSQL.
- **Updates Otimistas**: As mudanças aparecem instantaneamente na tela enquanto o sincronismo com o servidor acontece em background.

### 3. Gestão Dinâmica de Colunas
Liberdade total para estruturar seu fluxo de trabalho.
- **Adicionar Colunas**: Crie novas etapas para o seu processo diretamente da interface.
- **Auto-Sync**: Cada nova coluna é registrada no banco de dados e vinculada ao seu board atual.

### 4. Infraestrutura Dockerizada
O projeto agora é um ecossistema completo e fácil de subir:
- `docker-compose.yml` orquestra o **Frontend (Next.js)**, **Backend (Express)** e **Banco de Dados (PostgreSQL)**.

---

## 🎨 Design Premium
- **Glassmorphism & Aurora**: A estética foi elevada com fundos vibrantes e componentes translúcidos.
- **Micro-interações**: Feedback visual claro em cada ação (arrastar, salvar, excluir).

---

## 🛠️ Instruções de Atualização
Para aplicar todas as melhorias e garantir que o banco de dados e a API estejam sincronizados:

```bash
# Reconstruir e reiniciar os serviços
docker compose up -d --build
```

---

**Status**: v1.1.0 Estável ✅
*Desenvolvido com foco em performance e elegância.*
