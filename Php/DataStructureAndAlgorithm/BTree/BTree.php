<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 *
 * 实现部分delete逻辑
 */

class BTNode
{
    public $id;
    public $parent = 0;
    public $indexNum = 0;
    public $childNum = 0;
    public $indexMap = [];

    public $children = [];

    public function __construct(BTree $btree)
    {
        $this->id = uniqid();
        $btree->nodeMap[$this->id] = $this;
    }

    public function add($index = 0, $child = null)
    {
        if ($index !== 0) {
            $this->indexMap[$this->indexNum++] = $index;
            sort($this->indexMap);
        }

        $this->children[$index] = $child;
        ksort($this->children);
        $this->childNum++;
    }

    public function delete($index = 0)
    {
        $child = $this->children[$index];
        unset($this->children[$index]);
        $this->childNum--;
        ksort($this->children);
        $indexNum = 0;
        foreach ($this->indexMap as $key => $value) {
            if ($value == $index) {
                $indexNum = $key;
                break;
            }
        }
        unset($this->indexMap[$indexNum]);
        sort($this->indexMap);
        $this->indexNum--;

        return $child;
    }

    public function update($ori, $to)
    {
        $child = $this->children[$ori];
        $this->delete($ori);
        $this->add($to, $child);

    }

    public function isFull($order)
    {
        return $this->indexNum >= $order;
    }

    public function isMin($order)
    {
        return $this->indexNum < (ceil($order / 2) - 1);
    }
}

class BTree
{
    /**
     * @var BTNode
     */
    public $root = null;

    public $order;

    public $keyNumMin;

    public $keyNumMax;

    public $nodeMap = [];


    public function __construct($order = 3)
    {
        $this->order = $order;
        $this->keyNumMin = ceil($order / 2) - 1;
        $this->keyNumMax = $order - 1;
    }

    public function insert($index)
    {
        if ($this->isEmpty()) {
            $node = new BTNode($this);
            $node->add(0, 0);
            $node->add($index, 0);
            $this->root = $node;
        } else {
            $nextNode = $this->root;
            $prevNode = $this->root;

            while ($nextNode != null) {
                $indexMap = $nextNode->indexMap;
                $indexNum = $nextNode->indexNum;
                $pos = $indexMap[$indexNum - 1];
                $prevNode = $nextNode;

                for ($i = 0; $i < $indexNum; $i++) {
                    if ($index < $indexMap[$i]) {
                        if ($i !== 0) {
                            $pos = $indexMap[$i - 1];
                        } else {
                            $pos = 0;
                        }
                        break;
                    } else if ($index == $indexMap[$i]) {
                        return false;
                    }
                }

                $nextNode = $this->getNode($nextNode->children[$pos]);
            }
            $prevNode->add($index, 0);

            if ($prevNode->isFull($this->order)) {
                $this->split($prevNode);
            }
        }
    }

    public function find($index)
    {
        if (!$this->isEmpty()) {
            $nextNode = $this->root;

            while ($nextNode != null) {
                $indexMap = $nextNode->indexMap;
                $indexNum = $nextNode->indexNum;
                $pos = $indexMap[$indexNum - 1];

                for ($i = 0; $i < $indexNum; $i++) {
                    if ($index < $indexMap[$i]) {
                        if ($i !== 0) {
                            $pos = $indexMap[$i - 1];
                        } else {
                            $pos = 0;
                        }
                        break;
                    } else if ($index == $indexMap[$i]) {
                        return true;
                    }
                }

                $nextNode = $this->getNode($nextNode->children[$pos]);
            }
        }

        return false;
    }

    public function isEmpty()
    {
        return is_null($this->root);
    }

    public function split(BTNode $node)
    {
        $indexMap = $node->indexMap;
        $children = $node->children;
        $indexNum = $node->indexNum;

        $middle = intval(floor($indexNum / 2));
        $middleIndex = $indexMap[$middle];
        $middleChild = $children[$middleIndex];

        $newNode = new BTNode($this);
        $newNode->add(0, $middleChild);
        for ($i = 0; $i < $indexNum; $i++) {
            if ($i >= $middle) {
                if ($i != $middle) {
                    $child = $children[$indexMap[$i]];
                    $newNode->add($indexMap[$i], $child);
                    if ($child != 0) {
                        $tmp = $this->getNode($child);
                        $tmp->parent = $newNode->id;
                    }
                }
                unset($node->indexMap[$i]);
                unset($node->children[$indexMap[$i]]);
                $node->indexNum--;
                $node->childNum--;
            }
        }

        $pid = $node->parent;

        if ($pid === 0) {
            $parent = new BTNode($this);
            $parent->add(0, $node->id);
            $this->root = $parent;
            $pid = $parent->id;
        } else {
            $parent = $this->getNode($pid);
        }

        $node->parent = $pid;
        $newNode->parent = $pid;

        $parent->add($middleIndex, $newNode->id);

        if ($parent->isFull($this->order)) {
            $this->split($parent);
        }
    }

    public function delete($index)
    {
        if (!$this->isEmpty()) {
            $nextNode = $this->root;

            while ($nextNode != null) {
                $indexMap = $nextNode->indexMap;
                $indexNum = $nextNode->indexNum;
                $pos = $indexMap[$indexNum - 1];

                for ($i = 0; $i < $indexNum; $i++) {
                    if ($index < $indexMap[$i]) {
                        if ($i !== 0) {
                            $pos = $indexMap[$i - 1];
                        } else {
                            $pos = 0;
                        }
                        break;
                    } else if ($index == $indexMap[$i]) {
                        break 2;
                    }
                }

                $nextNode = $this->getNode($nextNode->children[$pos]);
            }
            if ($nextNode->children[$index] == 0) {
                $nextNode->delete($index);
                if ($nextNode->isMin($this->order)) {

                }
            } else {
                $minIndex = $this->findMin($this->getNode($nextNode[$index]));
                $nextNode->update($index, $minIndex);
            }
        }

        return false;
    }

    protected function findMin(BTNode $node)
    {
        $tmpNode = $node;
        $prevNode = $tmpNode;

        while ($tmpNode != null) {
            $prevNode = $tmpNode;
            $tmpNode = $this->getNode($tmpNode->children[0]);
        }

        $index = $prevNode->indexMap[0];
        $prevNode->delete($index);
        if ($prevNode->isMin($this->order)) {

        }
        return $index;
    }

    /**
     * @param $id
     * @return BTNode | null
     */
    public function getNode($id)
    {
        return isset($this->nodeMap[$id]) ? $this->nodeMap[$id] : null;
    }
}


$testList = [3, 4, 5, 10, 22, 32, 7, 6, 2, 1, 999, 101];
$btree = new BTree(3);
echo '<pre>';

foreach ($testList as $value) {
    $btree->insert($value);
}
/************************************ 插入B树的所有元素 **********************************/
echo '插入B树的所有元素: <br>';

foreach ($testList as $value) {
    echo $value.',';
}
echo '<hr>';

//$btree->delete(101);
/******************************* 测试find方法 *****************************************/
$tt = [3, 4, 5, 10, 22, 32, 7, 6, 2, 1, 999, 22, 33, 55, 1, 9, 17, 101];

echo '测试find方法:<br>';

foreach ($tt as $v) {
    if ($btree->find($v)) {
        $msg = in_array($v, $testList) ? 'true' : 'false';
        echo $v.' 存在! 是否正确:['.$msg.']';
    } else {
        $msg = !in_array($v, $testList) ? 'true' : 'false';
        echo $v. ' 不存在! 是否正确:['.$msg.']';
    }
    echo '<br>';
}
echo '<hr>';


/******************************* 测试delete方法 *****************************************/
echo '测试delete方法:<br>';

//只做了删除叶节点，且不会有额外合并的情况
$delete = [101];
foreach ($delete as $e) {
    $btree->delete($e);
}

foreach ($tt as $v) {
    if ($btree->find($v)) {
        $msg = in_array($v, $testList) && !in_array($v, $delete) ? 'true' : 'false';
        echo $v.' 存在! 是否正确:['.$msg.']';
    } else {
        $msg = !in_array($v, $testList) || in_array($v, $delete) ? 'true' : 'false';
        echo $v. ' 不存在! 是否正确:['.$msg.']';
    }
    echo '<br>';
}
echo '<hr>';

/****************************************** 调试代码： 打印节点信息 ************************************************************/

echo '调试： 打印节点信息:<br>';
function dump(BTree $btree) {
    $stack = [$btree->root->id, '关联索引:0'];

    while (!empty($stack)) {
        $tmpNode = array_shift($stack);
        if (is_string($tmpNode) && strpos($tmpNode, '关联索引:') === 0) {
            echo '('.$tmpNode.')';
            echo '<br>';
            continue;
        }

        $tmpNode = $btree->getNode($tmpNode);

        if (!is_null($tmpNode) && is_array($tmpNode->children) && !empty($tmpNode->children)) {

            echo '节点索引数:['.$tmpNode->indexNum.'] ';
            echo '节点列表: ';
            foreach ($tmpNode->indexMap as $index) {
                echo $index.',';
            }
            echo ' | ';

            foreach ($tmpNode->children as $key => $value) {
                if ($value != 0) {
                    array_push($stack, $value);
                    array_push($stack, '关联索引:'.$key);
                }
            }

        }
    }
}
dump($btree);
echo '<hr>';


/*************************************** 调试代码: 打印所有树节点 *****************************************/
echo '调试： 打印所有树节点:<br>';
foreach ($btree->nodeMap as $each) {
    var_dump($each);
}
echo '<hr>';