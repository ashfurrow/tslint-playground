const a = true
const b = true

// These should trigger the linter rule.
if (!a && !b) {
  console.log("hey")
}
if (!a || !b) {
  console.log("hey")
}

while (!a || !b) {
  console.log("infinite loop")
}

const c = !a && !b ? "asd" : "efg"

/* This code can go to hell! */

// TODO: This comment should be flagged.

// Already been fixed, shouldn't change.
if (!(a || b)) {
  console.log("hey")
}

if (!(a && b)) {
  console.log("hey")
}

while (!(a && b)) {
  console.log("infinite loop")
}

const d = !(a || b) ? "asd" : "efg"
