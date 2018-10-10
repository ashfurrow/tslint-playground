// @ts-check

const Lint = require("tslint")
const utils = require("tsutils")
const ts = require("typescript")

/*
This is really cool: https://astexplorer.net
*/

// 
class Rule extends Lint.Rules.AbstractRule {
  /**
   * @param {ts.SourceFile} sourceFile
   */
  apply(sourceFile) {
    return this.applyWithWalker(
      new DeMorgansWalker(sourceFile, this.getOptions())
    )
  }
}


// The walker takes care of all the work.
class DeMorgansWalker extends Lint.RuleWalker {
  /**
   * TODO: How do I cast things in ts-check documents?
  //  * @param {ts.IfStatement} node
   */
  visitIfStatement(node) {
    const {expression} = node
    if (utils.isBinaryExpression(expression)) {  
      if (this.isNegatedBooleanExpression(expression.left) && this.isNegatedBooleanExpression(expression.right)) {
        // We have two negated operands inside a 
        if (expression.operatorToken.kind == ts.SyntaxKind.AmpersandAmpersandToken) {
          this.addFailureAtNode(expression, "detected (!a && !b)")
        } else if (expression.operatorToken.kind == ts.SyntaxKind.BarBarToken) {
          this.addFailureAtNode(expression, "detected (!a || !b)")
        }
      }
    }

    // call the base version of this visitor to actually parse this node
    super.visitIfStatement(node);
  }

  isNegatedBooleanExpression(node) {
    return node.kind == ts.SyntaxKind.PrefixUnaryExpression &&
      node.operator == ts.SyntaxKind.ExclamationToken
  }
}

module.exports = { Rule: Rule }
