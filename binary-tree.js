class BinaryTreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinaryTree {
  constructor(root = null) {
    this.root = root;
  }

  minDepth(node = this.root) {
    if (!node) return 0;
    if (!node.left) return this.minDepth(node.right) + 1;
    if (!node.right) return this.minDepth(node.left) + 1;
    return Math.min(this.minDepth(node.left), this.minDepth(node.right)) + 1;
  }

  maxDepth(node = this.root) {
    if (!node) return 0;
    return Math.max(this.maxDepth(node.left), this.maxDepth(node.right)) + 1;
  }

  maxSum(node = this.root) {
    if (!node) return 0;

    const leftSum = Math.max(this.maxSum(node.left), 0);
    const rightSum = Math.max(this.maxSum(node.right), 0);

    return node.val + leftSum + rightSum;
  }

  nextLarger(lowerBound, node = this.root) {
    if (!node) return null;

    if (node.val <= lowerBound) {
      return this.nextLarger(lowerBound, node.right);
    } else {
      const leftResult = this.nextLarger(lowerBound, node.left);
      return leftResult !== null ? leftResult : node.val;
    }
  }

  areCousins(node1, node2) {
    return (
      this.getLevel(node1, this.root, 1) ===
        this.getLevel(node2, this.root, 1) &&
      !this.areSiblings(this.root, node1, node2)
    );
  }

  getLevel(node, root, level) {
    if (!root) return 0;

    if (root === node) return level;

    const leftLevel = this.getLevel(node, root.left, level + 1);
    return leftLevel !== 0
      ? leftLevel
      : this.getLevel(node, root.right, level + 1);
  }

  areSiblings(root, node1, node2) {
    if (!root) return false;

    let areSiblings = false;

    if (root.left && root.right) {
      areSiblings =
        (root.left === node1 && root.right === node2) ||
        (root.left === node2 && root.right === node1);
    }

    return (
      areSiblings ||
      this.areSiblings(root.left, node1, node2) ||
      this.areSiblings(root.right, node1, node2)
    );
  }

  static serialize(tree) {
    if (!tree.root) return "[]";

    const queue = [tree.root];
    const result = [];

    while (queue.length) {
      const node = queue.shift();

      if (node) {
        result.push(node.val);
        queue.push(node.left, node.right);
      } else {
        result.push(null);
      }
    }

    while (result[result.length - 1] === null) {
      result.pop();
    }

    return JSON.stringify(result);
  }

  static deserialize(stringTree) {
    const arr = JSON.parse(stringTree);

    if (arr.length === 0) return null;

    const root = new BinaryTreeNode(arr.shift());
    const queue = [root];

    while (queue.length) {
      const node = queue.shift();

      if (arr.length > 0) {
        const leftVal = arr.shift();
        if (leftVal !== null) {
          node.left = new BinaryTreeNode(leftVal);
          queue.push(node.left);
        }
      }

      if (arr.length > 0) {
        const rightVal = arr.shift();
        if (rightVal !== null) {
          node.right = new BinaryTreeNode(rightVal);
          queue.push(node.right);
        }
      }
    }

    return new BinaryTree(root);
  }

  lowestCommonAncestor(node1, node2) {
    return this.findLCA(this.root, node1, node2);
  }

  findLCA(root, node1, node2) {
    if (!root) return null;
    if (root === node1 || root === node2) return root;

    const leftLCA = this.findLCA(root.left, node1, node2);
    const rightLCA = this.findLCA(root.right, node1, node2);

    if (leftLCA && rightLCA) return root;
    return leftLCA ? leftLCA : rightLCA;
  }
}

module.exports = { BinaryTree, BinaryTreeNode };
