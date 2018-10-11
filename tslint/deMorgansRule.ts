import { Replacement, Rules, RuleWalker } from "tslint"
import { isBinaryExpression } from "tsutils"
import { BinaryExpression, IfStatement, Node, PrefixUnaryExpression, SourceFile, SyntaxKind } from "typescript"

/*
This is really cool: https://astexplorer.net
*/

export class Rule extends Rules.AbstractRule {
  apply(sourceFile: SourceFile) {
    return this.applyWithWalker(new DeMorgansWalker(sourceFile, this.getOptions()))
  }
}

// The walker takes care of all the work.
class DeMorgansWalker extends RuleWalker {
  public visitIfStatement(node: IfStatement) {
    const { expression } = node // expression is the part of `if (...)` that is in the parens

    if (
      isBinaryExpression(expression) &&
      this.isNegatedBooleanExpression(expression.left) &&
      this.isNegatedBooleanExpression(expression.right)
    ) {
      switch (expression.operatorToken.kind) {
        case SyntaxKind.AmpersandAmpersandToken:
          this.addFailureAtNode(expression, "detected (!a && !b)", this.deMorganifyIfStatement(expression, "||"))
          break
        case SyntaxKind.BarBarToken:
          this.addFailureAtNode(expression, "detected (!a || !b)", this.deMorganifyIfStatement(expression, "&&"))
          break
      }
    }

    // call the base version of this visitor to actually parse this node
    super.visitIfStatement(node)
  }

  deMorganifyIfStatement(expression: BinaryExpression, middle: string): Replacement {
    const left = expression.left as PrefixUnaryExpression
    const right = expression.right as PrefixUnaryExpression
    const newIfExpression = `!(${left.getChildAt(1).getFullText()} ${middle} ${right.getChildAt(1).getFullText()})`
    return Replacement.replaceFromTo(expression.getStart(), expression.getEnd(), newIfExpression)
  }

  isNegatedBooleanExpression(node: Node) {
    return (
      node.kind === SyntaxKind.PrefixUnaryExpression &&
      (node as PrefixUnaryExpression).operator === SyntaxKind.ExclamationToken
    )
  }
}
