const path = require("path");

module.exports = ({ github, context, root }) => {
  const fs = require("fs");

  const tscOutput = fs.readFileSync(path.resolve(root, "tsc_output.txt"), "utf8").trim();
  const tscErrors = "### 🐞 TypeScript output\n" + (tscOutput.trim() == "" ? "*No output*" : `~~~\n${tscOutput}\n~~~`);

  const lintOutput = fs.readFileSync(path.resolve(root, "eslint_output.txt"), "utf8").trim();
  const lintErrors = "### 🪄 ESLint output\n" + (lintOutput.trim() == "" ? "*No output*" : `~~~\n${lintOutput}\n~~~`);

  let finalMessage = `🤖 *This is an automated message to ease code issues detection.*\n\n${tscErrors}\n\n${lintErrors}`;

  if (tscOutput.trim() == "" && lintOutput.trim() == "") {
    finalMessage += "\n\n🎉 *No issues detected!*";
  } else {
    finalMessage += "\n\n🔍 *Please check the output above for more information. Note: Warnings are considered issues*";
  }

  github.rest.issues.createComment({
    issue_number: context.payload.pull_request.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: finalMessage,
  });

  console.log("Commented on PR");

  if (tscOutput.trim() != "" && lintOutput.trim() != "") {
    throw new Error("Errors detected");
  }
}
