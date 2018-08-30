<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

class TreeNode
{
    /**
     * @var TreeNode
     */
    public $parent = null;

    public $valueMap = [];

    public $valueNum = 0;

    public $ptrNum = 0;

    public $ptrMap = [];

    public $order;

    /**
     * @var BTree
     */
    public $btree;

    public function __construct($btree, $order = 3)
    {
        $this->btree = $btree;
        $this->order = $order;
        for ($i = 0; $i < ($order - 1); $i++) {
            $this->valueMap[$i] = 0;
        }
        for ($i = 0; $i < $order; $i++) {
            $this->ptrMap[$i] = null;
        }
    }

    public function add($value)
    {
        $this->valueMap[$this->valueNum] = $value;
        $this->valueNum++;
    }

    public function isFull()
    {
        return $this->valueNum >= $this->order;
    }

    public function split()
    {
        $index = floor($this->valueNum / 2);
        if (is_null($this->parent)) {
            $node = new self($this->btree, $this->order);
            $this->btree->root = $node;
        } else {
            $node = $this->parent;

        }

        $node->add($this->valueMap[$index]);

        $leftNode = new self($this->btree, $this->order);
        $rightNode = new self($this->btree, $this->order);
        $node->ptrMap[$node->ptrNum++] = $leftNode;
        $node->ptrMap[$node->ptrNum++] = $rightNode;
        $leftNode->parent = $node;
        $rightNode->parent = $node;

        for ($i = 0; $i < $this->order; $i++) {
            if ($i < $index) {
                $leftNode->ptrMap[$leftNode->ptrNum++] = $this->ptrMap[$i];
            } else if ($i > $index) {
                $rightNode->ptrMap[$rightNode->ptrNum++] = $this->ptrMap[$i];
            }
        }

        for ($i = 0; $i < $this->order; $i++) {
            if ($i < $index) {
                $leftNode->add($this->valueMap[$i]);
            } else if ($i > $index) {
                $rightNode->add($this->valueMap[$i]);
            }
        }

        if ($node->isFull()) {
            $node->split();
        }
    }
}

class BTree
{
    /**
     * @var TreeNode
     */
    public $root = null;

    public $order = 3;

    public function __construct($order = 3)
    {
        $this->order = $order;
    }

    public function insert($value)
    {
        if ($this->isEmpty()) {
            $node = new TreeNode($this, $this->order);
            $node->add($value);
            $this->root = $node;
        } else {
            $prevNode = $this->root;
            $tmpNode = $this->root;
            $count = 0;
            while ($tmpNode != null) {
                $prevNode = $tmpNode;
                $list = $tmpNode->valueMap;
                $valueNum = $tmpNode->valueNum;
                $count++;
                if ($count > 30) {
                    break;
                }
                for ($i = 0; $i < $valueNum; $i++) {
                    if ($value === $list[$i]) {
                        return false;
                    } else if ($value < $list[$i]) {
                        $tmpNode = $tmpNode->ptrMap[$i];
                        break;
                    }
                }

                if ($i > $valueNum) {
                    $tmpNode = $tmpNode->ptrMap[$i];
                }
            }

            $prevNode->add($value);
            if ($prevNode->isFull()) {
                $prevNode->split();
            }
        }

        return true;
    }

    public function find($value)
    {
        if (!$this->isEmpty()) {
            $tmpNode = $this->root;
            $count = 0;
            while ($tmpNode != null) {
                $list = $tmpNode->valueMap;
                $valueNum = $tmpNode->valueNum;
                $count++;
                if ($count > 30) {
                    break;
                }
                for ($i = 0; $i < $valueNum; $i++) {
                    if ($value === $list[$i]) {
                        return true;
                    } else if ($value < $list[$i]) {
                        $tmpNode = $tmpNode->ptrMap[$i];
                        break;
                    }
                }

                if ($i > $valueNum) {
                    $tmpNode = $tmpNode->ptrMap[$i];
                }
            }
        }

        return true;
    }

    public function delete()
    {

    }

    public function isEmpty()
    {
        return is_null($this->root);
    }
}

$testList = [5, 7, 12, 6, 3, 4, 9, 32, 22, 11, 23];
$btree = new BTree();
foreach ($testList as $value) {
    $btree->insert($value);
}

$v = 2;
if ($btree->find($v)) {
    var_dump($v.' is exists!');
} else {
    var_dump($v.' is not exists!');
}


