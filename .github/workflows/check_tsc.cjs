const path = require("path");

module.exports = ({ github, context, root }) => {
  const fs = require("fs");

  const tscOutput = fs.readFileSync(path.resolve(root, "tsc_output.txt"), "utf8").trim();
  const tscErrors = `### 🐞 TypeScript output\n\n~~~\n${tscOutput}\n~~~`;

  const lintOutput = fs.readFileSync(path.resolve(root, "eslint_output.txt"), "utf8").trim();
  const lintErrors = `### 🪄 ESLint output\n\n~~~\n${tscOutput}\n~~~`; lintOutput.includes("error") ? `### ❌ ESLint Errors\n\`\`\`\n${lintOutput}\n\`\`\`` : "✅ No ESLint errors found.";

  const finalMessage = `${tscErrors}\n\n${lintErrors}`;

  github.rest.issues.createComment({
    issue_number: context.payload.pull_request.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: finalMessage,
  });
}
