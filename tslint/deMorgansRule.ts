import { Replacement, Rules, RuleWalker } from "tslint"
import { BinaryExpression, IfStatement, Node, PrefixUnaryExpression, SourceFile, SyntaxKind } from "typescript"

/**
 * Rule to minimize the number of exclamation points in a file through foolish
 * use of DeMorgan's law. Do no use the rule, it is for pedagogy only.
 */
export class Rule extends Rules.AbstractRule {
  apply(sourceFile: SourceFile) {
    return this.applyWithWalker(new DeMorgansWalker(sourceFile, this.getOptions()))
  }
}

// The walker takes care of all the work.
class DeMorgansWalker extends RuleWalker {
  public visitBinaryExpression(node: BinaryExpression) {
    if (this.isNegatedBooleanExpression(node.left) && this.isNegatedBooleanExpression(node.right)) {
      switch (node.operatorToken.kind) {
        case SyntaxKind.AmpersandAmpersandToken:
          this.addFailureAtNode(node, "detected (!a && !b)", this.deMorganifyIfStatement(node, "||"))
          break
        case SyntaxKind.BarBarToken:
          this.addFailureAtNode(node, "detected (!a || !b)", this.deMorganifyIfStatement(node, "&&"))
          break
      }
    }

    // call the base version of this visitor to actually parse this node
    super.visitBinaryExpression(node)
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
