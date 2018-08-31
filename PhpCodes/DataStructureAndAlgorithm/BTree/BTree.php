<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

class Node
{
    public $key = 0;

    /**
     * @var TreeNode
     */
    public $treeNode = null;

    public function __construct($key, $treeNode)
    {
        $this->key = $key;
        $this->treeNode = $treeNode;
    }
}

class TreeNode
{
    /**
     * @var TreeNode
     */
    public $parent;

    public $max = 3;

    public $num = 0;

    public $map = [];

    public function __construct($max = 3)
    {
        $this->max = $max;
    }

    public function setMap($value, $node = null)
    {
        $pos = $this->num;

        $this->map[$this->num++] = new Node($value, $node);

        if ($this->num >= 2) {
            $pos = $this->sort($value);
        }

        return $pos;
    }

    protected function sort($vv)
    {
        $indexList = [];
        foreach ($this->map as $key => $value) {
            $indexList[$key] = $value->key;
        }
        asort($indexList);
        $tmp = [];
        $i = 0;
        $pos = 0;
        foreach ($indexList as $k => $v) {
            if ($v == $vv) {
                $pos = $i;
            }
            $tmp[$i++] = $this->map[$k];
        }
        $this->map = $tmp;

        return $pos;
    }

    public function isFull()
    {
        return $this->num - 1 >= $this->max;
    }

    public function updateNode($index, $treeNode)
    {
        $this->map[$index]->treeNode = $treeNode;
    }
}

class BTree
{
    /**
     * @var TreeNode
     */
    public $root = null;

    public $height = 3;

    public function __construct($height = 3)
    {
        $this->height = $height;
    }

    public function insert($value)
    {
        if ($this->isEmpty()) {
            $node = new TreeNode($this->height);
            $node->setMap(0, null);
            $node->setMap($value, null);
            $this->root = $node;
        } else {
            $tmpNode = $this->root;
            $prevNode = $this->root;
            $count = 0;
            while ($tmpNode != null) {
                $mapList = $tmpNode->map;
                $prevNode = $tmpNode;
                $index = $tmpNode->num - 1;

                $count++;
                if ($count > 30) {
                    echo 'done';
                    break;
                }
                foreach ($mapList as $k => $v) {
                    if ($value < $v->key) {
                        if ($k == 0) {
                            break 2;
                        } else {
                            $index = $k - 1;
                        }
                        break;
                    } else if ($value == $v->key) {
                        return false;
                    }
                }
                $tmpNode = $mapList[$index]->treeNode;
            }

            $prevNode->setMap($value, null);

            if ($prevNode->isFull()) {
                $this->split($prevNode);
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
                $mapList = $tmpNode->map;

                $index = $tmpNode->num - 1;

                $count++;
                if ($count > 30) {
                    echo 'done';
                    break;
                }
                foreach ($mapList as $k => $v) {
                    if ($value < $v->key) {
                        if ($k == 0) {
                            break 2;
                        } else {
                            $index = $k - 1;
                        }
                        break;
                    } else if ($value == $v->key) {
                        return true;
                    }
                }
                $tmpNode = $mapList[$index]->treeNode;
            }
        }

        return false;
    }

    public function isEmpty()
    {
        return is_null($this->root);
    }

    protected function split(TreeNode $treeNode)
    {
        $middle = floor($treeNode->num / 2);
        $middleValue = $treeNode->map[$middle]->key;
        $middleTreeNode = $treeNode->map[$middle]->treeNode;

        $parent = $treeNode->parent;

        $leftNode = $treeNode;
        $rightNode = new TreeNode($this->height);

        $thisNum = $treeNode->num;
        $thisMap = $treeNode->map;

        for ($i = 0; $i < $thisNum; $i++) {
            if ($i > $middle) {
                $rightNode->setMap($thisMap[$i]->key, $thisMap[$i]->treeNode);
                unset($leftNode->map[$i]);
                $leftNode->num--;
            } else if ($i == $middle) {
                unset($leftNode->map[$i]);
                $leftNode->num--;
            }
        }

        if (!is_null($middleTreeNode)) {
            foreach ($middleTreeNode->map as $each) {
                $rightNode->setMap($each->key, $each->treeNode);
            }
        }

        if (is_null($parent)) {
            $parent = new TreeNode($this->height);
            $parent->setMap(0, $leftNode);
            $parent->setMap($middleValue, $rightNode);
            $this->root = $parent;
        } else {
            $pos = $parent->setMap($middleValue, $rightNode);
            $p = $pos - 1;
            $parent->updateNode($p, $leftNode);
        }

        $leftNode->parent = $parent;
        $rightNode->parent = $parent;

        if ($parent->isFull()) {
            $this->split($parent);
        }
    }
}

$testList = [3, 4, 5, 10, 22, 32, 7, 6, 2, 1, 99, 100, 101, 23, 36, 17, 19];
$btree = new BTree(5);
echo '<pre>';
foreach ($testList as $value) {
    $btree->insert($value);
}

$tt = [3, 4, 5, 10, 22, 32, 7, 6, 2, 1, 999, 22, 33, 55, 1, 9, 17, 101];

foreach ($tt as $v) {
    if ($btree->find($v)) {
        echo $v.' is exists!';
    } else {
        echo $v. ' is not exists!';
    }
    echo '<hr>';
}