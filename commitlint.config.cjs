module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // Novas funcionalidades
        "fix", // Correções de bugs
        "docs", // Documentação
        "style", // Alterações que não afetam o significado do código (espaço em branco, formatação, etc)
        "refactor", // Refatoração de código
        "perf", // Melhorias de performance
        "test", // Adição ou modificação de testes
        "build", // Alterações que afetam o sistema de build ou dependências externas
        "ci", // Alterações em arquivos e scripts de configuração de CI
        "chore", // Outras alterações que não modificam src ou arquivos de teste
        "revert", // Reverte um commit anterior
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "scope-empty": [2, "never"],
    "scope-case": [2, "always", "lower-case"],
    "subject-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 72],
  },
};
