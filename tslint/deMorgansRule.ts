import { Rules, RuleWalker } from "tslint"
import { isBinaryExpression } from "tsutils"
import { IfStatement, Node, PrefixUnaryExpression, SourceFile, SyntaxKind } from "typescript"

/*
This is really cool: https://astexplorer.net
*/

//
export class Rule extends Rules.AbstractRule {
  apply(sourceFile: SourceFile) {
    return this.applyWithWalker(new DeMorgansWalker(sourceFile, this.getOptions()))
  }
}

// The walker takes care of all the work.
class DeMorgansWalker extends RuleWalker {
  public visitIfStatement(node: IfStatement) {
    const { expression } = node
    if (isBinaryExpression(expression)) {
      if (this.isNegatedBooleanExpression(expression.left) && this.isNegatedBooleanExpression(expression.right)) {
        // We have two negated operands inside a
        if (expression.operatorToken.kind === SyntaxKind.AmpersandAmpersandToken) {
          this.addFailureAtNode(expression, "detected (!a && !b)")
        } else if (expression.operatorToken.kind === SyntaxKind.BarBarToken) {
          this.addFailureAtNode(expression, "detected (!a || !b)")
        }
      }
    }

    // call the base version of this visitor to actually parse this node
    super.visitIfStatement(node)
  }

  isNegatedBooleanExpression(node: Node) {
    return (
      node.kind === SyntaxKind.PrefixUnaryExpression &&
      (node as PrefixUnaryExpression).operator === SyntaxKind.ExclamationToken
    )
  }
}
