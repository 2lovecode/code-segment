<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 红黑树
 * 1.节点是红色或黑色
 * 2.根是黑色
 * 3.所有的叶子节点都是黑色
 * 4.每个红色节点必须有两个黑色节点
 * 5.从任一节点到其叶子节点的简单路径都包含相同数量的黑色节点,黑高
 *
 */

class Node
{
    private $id;

    /**
     * @var
     * 1 => red
     * 2 => black
     */
    private $color = 1;

    private $value = null;

    public $parent = 0;
    
    public $left = 0;

    public $right = 0;

    public function __construct($value)
    {
        $this->id = uniqid();
        $this->value = $value;
    }

    public function getID()
    {
        return $this->id;
    }

    public function getValue()
    {
        return $this->value;
    }

    public function setColor($color)
    {
        $this->color = $color;
    }

    public function getColor()
    {
        return $this->color;
    }
}

class RedBlackTree
{
    public $root = 0;

    private $nodePool = [];

    private $nil;

    public function __construct()
    {
        $nilNode = new Node(null);
        $nilNode->setColor(2);
        $this->addNodeToPool($nilNode->getID(), $nilNode);
        $this->nil = $nilNode->getID();
        $this->root = $this->nil;
    }

    public function addNodeToPool($id, $object)
    {
        $this->nodePool[$id] = $object;
    }

    /**
     * @param $id
     * @return Node
     */
    public function getNodeFromPool($id)
    {
        return isset($this->nodePool[$id]) ? $this->nodePool[$id] : null;
    }

    public function find($value)
    {
//        var_dump($this->root);
//        var_dump($this->nodePool);exit;
        $tmp = $this->getNodeFromPool($this->root);

        $count = 0;

        while (!is_null($tmp->getValue())) {
            $count++;
            if ($count > 10)  {
                break;
            }
            var_dump($tmp->getValue());
            if ($tmp->getValue() > $value) {
                $tmp = $this->getNodeFromPool($tmp->left);
            } else if ($tmp->getValue() < $value) {
                $tmp = $this->getNodeFromPool($tmp->right);
            } else {
                return true;
            }
        }

        return false;
    }

    public function walk($nodeID)
    {
        var_dump($this->nodePool);
    }

    public function insert($value)
    {
        $tmpNode = $this->getNodeFromPool($this->root);
        $prevNode = $tmpNode;

        $count = 0;

        while (!is_null($tmpNode->getValue())) {

            $count++;
            if ($count > 100) {
                break;
            }
            $prevNode = $tmpNode;

            if ($tmpNode->getValue() > $value) {
                $tmpNode = $this->getNodeFromPool($tmpNode->left);
            } else {
                $tmpNode = $this->getNodeFromPool($tmpNode->right);
            }
        }

        $newNode = new Node($value);
        $newNode->left = $this->nil;
        $newNode->right = $this->nil;
        $newNode->parent = $prevNode->getID();

        $this->addNodeToPool($newNode->getID(), $newNode);

        if (is_null($prevNode->getValue())) {
            //第一个节点
            $newNode->setColor(2);
            $this->root = $newNode->getID();
        } else if ($prevNode->getValue() > $newNode->getValue()){
            $prevNode->left = $newNode->getID();
        } else {
            $prevNode->right = $newNode->getID();
        }

        $this->insertFix($newNode->getID());

        return true;
    }

    protected function insertFix($node)
    {
        $tmpNode = $this->getNodeFromPool($node);

        $count = 0;

        while (!is_null($tmpNode->getValue()) && ($this->getNodeFromPool($tmpNode->parent)->getColor() == 1)) {
            $count++;
            if ($count > 100) {
                break;
            }

            $grandP = $this->getNodeFromPool($this->getNodeFromPool($tmpNode->parent)->parent);
            $parent = $this->getNodeFromPool($tmpNode->parent);

            if ($tmpNode->parent == $grandP->left) {
                $rightUncle = $this->getNodeFromPool($grandP->right);

                if ($rightUncle->getColor() == 1) {
                    $parent->setColor(2);
                    $rightUncle->setColor(2);
                    $grandP->setColor(1);
                    $tmpNode = $grandP;

                } else if ($tmpNode->getID() == $parent->right) {
                    $tmpNode = $parent;
                    $this->leftRotate($tmpNode->getID(), $parent->getID(), $grandP->getID());
                }

                $parent->setColor(2);
                $grandP->setColor(1);

                $this->rightRotate($parent->getID(), $grandP->getID(), $grandP->parent);

            } else {
                $leftUncle = $this->getNodeFromPool($grandP->left);

                if ($leftUncle->getColor() == 1) {
                    $parent->setColor(2);
                    $leftUncle->setColor(2);
                    $grandP->setColor(1);
                    $tmpNode = $grandP;
                } else if ($tmpNode->getID() == $parent->left) {
                    $tmpNode = $parent;
                    $this->rightRotate($tmpNode->getID(), $parent->getID(), $grandP->getID());
                }
                $parent->setColor(2);
                $grandP->setColor(1);

                $this->leftRotate($parent->getID(), $grandP->getID(), $grandP->parent);

            }
            $this->getNodeFromPool($this->root)->setColor(2);
        }

    }

    protected function leftRotate($nodeID, $parentID, $grandPID)
    {
        $node = $this->getNodeFromPool($nodeID);
        $parent = $this->getNodeFromPool($parentID);
        $grandP = $this->getNodeFromPool($grandPID);

        if ($grandP->left = $parentID) {
            $grandP->left = $nodeID;
        } else {
            $grandP->right = $nodeID;
        }

        $parent->right = $node->left;
        $parent->parent = $nodeID;

        $node->parent = $grandPID;
        $node->left = $parentID;

    }

    protected function rightRotate($nodeID, $parentID, $grandPID)
    {
        $node = $this->getNodeFromPool($nodeID);
        $parent = $this->getNodeFromPool($parentID);
        $grandP = $this->getNodeFromPool($grandPID);

        if ($grandP->left = $parentID) {
            $grandP->left = $nodeID;
        } else {
            $grandP->right = $nodeID;
        }

        $parent->left = $node->right;
        $parent->parent = $nodeID;

        $node->parent = $grandPID;
        $node->right = $parentID;
    }


    public function delete($value)
    {

    }
}

$test = [12, 550, 300, 20, 1, 50, 44, 34, 24, 25, 79];

$testH = [12, 550, 300, 20, 1, 50, 44, 34, 24, 25, 79, 19];

$tree = new RedBlackTree();

foreach ($test as $value) {
    $tree->insert($value);
}

echo '<pre>';

$tree->walk($tree->root);