import * as Lint from "tslint"
import * as utils from "tsutils"
import * as ts from "typescript"

/**
 * Rule to minimize the number of exclamation points in a file through foolish
 * use of DeMorgan's law. Do no use the rule, it is for pedagogy only.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new DeMorgansWalker(sourceFile, this.getOptions()))
  }
}

// The walker takes care of all the work.
class DeMorgansWalker extends Lint.RuleWalker {
  public visitBinaryExpression(node: ts.BinaryExpression) {
    if (this.isNegatedBooleanExpression(node.left) && this.isNegatedBooleanExpression(node.right)) {
      switch (node.operatorToken.kind) {
        case ts.SyntaxKind.AmpersandAmpersandToken:
          this.addFailureAtNode(node, "detected (!a && !b)", this.deMorganifyIfStatement(node, "||"))
          break
        case ts.SyntaxKind.BarBarToken:
          this.addFailureAtNode(node, "detected (!a || !b)", this.deMorganifyIfStatement(node, "&&"))
          break
      }
    }

    // call the base version of this visitor to actually parse this node
    super.visitBinaryExpression(node)
  }

  deMorganifyIfStatement(expression: ts.BinaryExpression, middle: string): Lint.Replacement {
    const left = expression.left as ts.PrefixUnaryExpression
    const right = expression.right as ts.PrefixUnaryExpression
    const newIfExpression = `!(${left.getChildAt(1).getFullText()} ${middle} ${right.getChildAt(1).getFullText()})`
    return Lint.Replacement.replaceFromTo(expression.getStart(), expression.getEnd(), newIfExpression)
  }

  isNegatedBooleanExpression(node: ts.Node) {
    if (utils.isPrefixUnaryExpression(node)) {
      return node.operator === ts.SyntaxKind.ExclamationToken
    }
  }
}
