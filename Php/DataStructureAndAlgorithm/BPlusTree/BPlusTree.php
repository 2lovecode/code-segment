<?php
/**
 * code-segment
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 1.注意
 *  - 叶节点包含所有的索引和数据
 *  - 只有叶节点才会持有具体数据,非叶节点只有索引
 *  - 叶节点之间连接成一个链表,便于范围查询
 * 2.树节点结构
 * BTNode {
 *  id : 标识节点对象的唯一值
 *  parent : 父节点的ID值
 *  isLeaf : 是否是叶节点
 *  indexNum : 当前索引的数量,一旦该值超过树的阶,该节点就需要分裂
 *  indexMap : 索引对象列表
 *  next : 下一个兄弟节点的ID值(该属性仅针对叶子节点)
 * }
 * 3.insert[插入]过程(将值写入叶节点中,叶节点的分裂可能会造成非叶节点的分裂)
 *  - 叶子节点中保存具体的值.
 *  - 树为空,直接创建一个根节点,此节点是叶节点.
 *  - 定位需要插入的叶节点时, 需要处理的下一个树节点是该节点中第一个大于要写入索引值索引对象的上一个兄弟索引对象指向的树节点
 *  - 树中已经存在相同的索引,不做处理.
 *  - 当叶子节点索引对象达到上限后,需要分裂该叶节点
 * 4.split[分裂]过程
 *  - 节点分裂会分裂出两个,一个是去掉中间索引及之后索引的原节点,另一个是新创建的节点,该节点中包含原节点中间索引及之后索引
 *  - 分裂节点为根节点时,树高度+1,创建新节点作为根节点.
 *  - 新树节点的父节点是原节点的父节点,若原节点是根节点,则新树节点的父节点是新的根节点.
 *  - 索引指向子节点的原始父节点是分裂之前的原节点,现在更改为它们移动到的新节点.
 *  - 原节点的父节点更新为新的父节点(原节点为根节点时,会重新创建根节点,此时原节点的父节点是这个新的根节点).
 *  - 原节点分裂后,中间索引及之后的索引都被移动到了新节点,所以把移动的索引在原节点中删除.
 *  - B+树的叶子节点之间形成一个链表,在原节点分裂后,原节点的next指向新节点,新节点的next指向原节点的next.
 *  - 向分裂节点的父节点添加索引对象,该索引对象的索引值是分裂节点的中间索引值,指向的是新创建的树节点.
 *  - 若分裂节点的父节点索引达到上限,需要分裂父节点.
 * 5.find[单条查询]过程
 *  - 需要注意的是,只有叶节点中索引值相同的索引对象才持有具体数据.
 * 6.rangeFind[范围查询]过程
 *  - 根据start索引,定位到叶节点链表开始的节点.
 *  - 从定位到的节点,遍历叶节点链表,查询出范围内的记录
 * 7.delete[单条删除]过程
 *  - 待实现
 */

/**
 * Class Data
 *
 * 数据类
 */
class Data
{
    private $data = [];

    private $indexKey;

    public function __construct(array $data, $indexKey = 'index')
    {
        $this->data = $data;
        $this->indexKey = $indexKey;
    }

    public function getIndex()
    {
        return isset($this->data[$this->indexKey]) ? $this->data[$this->indexKey] : 0;
    }

    public function __toString()
    {
        return json_encode($this->data);
    }
}

/**
 * Class Index
 *
 * 索引对象
 */
class Index
{
    /**
     * @var int
     *
     * 索引值
     */
    private $index;

    /**
     * @var Data
     *
     * 索引指向的具体数据,在叶节点中该属性才有值
     */
    private $data;

    /**
     * @var int
     *
     * 索引指向的BTNode的ID
     */
    private $next;

    public function __construct($index = 0, $next = 0, Data $data = null)
    {
        $this->index = $index;
        $this->next = $next;
        $this->data = $data;
    }

    public function getIndex()
    {
        return $this->index;
    }

    public function getNext()
    {
        return $this->next;
    }

    /**
     * @return Data
     */
    public function getData()
    {
        return $this->data;
    }
}

/**
 * Class IndexMapIterator
 *
 * BTNode的indexMap的迭代器
 */
class IndexMapIterator implements Iterator
{
    private $indexMap = [];
    private $position = 0;

    public function __construct($indexMap = [])
    {
        $this->indexMap = $indexMap;
        $this->position = 0;
    }

    /**
     * @return Index
     */
    public function current()
    {
        return $this->indexMap[$this->position];
    }

    public function next()
    {
        $this->position++;
    }

    public function prev()
    {
        $this->position--;
    }

    public function key()
    {
        return $this->position;
    }

    public function valid()
    {
        return isset($this->indexMap[$this->position]);
    }

    public function rewind()
    {
        $this->position = 0;
    }

}

/**
 * Class BTNode
 *
 * B+树节点
 */
class BTNode
{
    /**
     * @var int
     *
     * 标识节点对象的唯一值
     */
    private $id = 0;

    /**
     * @var int
     *
     * 父节点的ID值
     */
    public $parent = 0;

    /**
     * @var bool
     *
     * 是否是叶节点
     */
    public $isLeaf = false;

    /**
     * @var int
     *
     * 当前索引的数量,一旦该值超过树的阶,该节点就需要分裂
     */
    public $indexNum = 0;

    /**
     * @var array
     *
     * 索引对象列表
     */
    private $indexMap = [];

    /**
     * @var int
     *
     * 下一个兄弟节点的ID值(该属性仅针对叶子节点)
     */
    public $next = 0;

    public function __construct($isLeaf = false, $parent = 0)
    {
        $this->init($isLeaf, $parent);
    }

    protected function init($isLeaf, $parent)
    {
        $this->id = uniqid();
        $this->isLeaf = $isLeaf;
        $this->parent = $parent;
        $this->indexMap = [];
    }

    public function getID()
    {
        return $this->id;
    }

    /**
     * @param Index $index
     *
     * 向树节点中添加新的索引对象,添加完成后需要按索引值升序排序
     */
    public function addIndex(Index $index)
    {
        array_push($this->indexMap, $index);
        usort($this->indexMap, function (Index $a, Index $b) {
            if ($a->getIndex() == $b->getIndex()) {
                return 0;
            }
           return $a->getIndex() > $b->getIndex() ? 1 : -1;
        });
        $this->indexNum++;
    }

    /**
     * @return IndexMapIterator
     *
     * 生成indexMap的迭代器
     */
    public function generateIndexMapIterator()
    {
        return new IndexMapIterator($this->indexMap);
    }

    /**
     * @param $order
     * @return bool
     *
     * 判断该节点是否已满,当前的索引对象树超过树的阶即为满.
     */
    public function isFull($order)
    {
        return $this->indexNum > $order;
    }

    public function deleteMap($start)
    {
        $count = 0;
        for ($i = $start; $i < $this->indexNum; $i++) {
            $count++;
            unset($this->indexMap[$i]);
        }

        $this->indexNum = $this->indexNum - $count;
    }

    public function updateParent($id)
    {
        $this->parent = $id;
    }

    public function setNext($id)
    {
        $this->next = $id;
    }
}

/**
 * Class BPlusTree
 *
 * B+树
 */
class BPlusTree
{
    /**
     * @var int
     *
     * 根节点ID
     */
    public $root = 0;

    /**
     * @var array
     * 节点池: 节点的id为key, 节点对象为value
     */
    private $nodeMap = [];

    /**
     * @var int
     *
     * B+树的阶
     */
    private $order;

    public function __construct($order = 3)
    {
        $this->order = $order;
    }

    /**
     * @param Data $record
     *
     * 写入数据
     */
    public function insert(Data $record)
    {
        $index = $record->getIndex();

        if ($this->isEmpty()) {
            //树为空,直接创建一个根节点,此节点是叶节点.
            $node = new BTNode( true,0);
            $node->addIndex(new Index(0, 0));
            $node->addIndex(new Index($index, 0, $record));
            $this->storeNode($node);
            $this->root = $node->getID();
        } else {
            $tmpNode = $this->getNodeByID($this->root);
            $prevNode = $tmpNode;

            //定位需要插入的叶节点
            while ($tmpNode != null) {
                $prevNode = $tmpNode;
                $indexMapIterator = $tmpNode->generateIndexMapIterator();

                //需要处理的下一个树节点是该节点中第一个大于要写入索引值索引对象的上一个兄弟索引对象指向的树节点
                while ($indexMapIterator->valid()) {
                    $indexObj = $indexMapIterator->current();

                    if ($index > $indexObj->getIndex()) {
                        $indexMapIterator->next();
                    } else if ($index == $indexObj->getIndex()) {
                        //树中已经存在相同的索引,不做处理.
                        return false;
                    } else {
                        break;
                    }
                }

                $indexMapIterator->prev();
                $currentIndex = $indexMapIterator->current();
                $tmpNode = $this->getNodeByID($currentIndex->getNext());
            }

            //叶子节点中保存具体的值.
            $prevNode->addIndex(new Index($index, 0, $record));


            //树节点需要分裂
            if ($prevNode->isFull($this->order)) {
                $this->split($prevNode);
            }
        }
    }

    /**
     * @param BTNode $node
     *
     * 分裂节点
     *
     */
    protected function split(BTNode $node)
    {
        //获取中间索引,创建新的索引
        $middle = intval(ceil($node->indexNum/2));
        $middleIndexValue = 0;

        $pid = $node->parent;

        //分裂节点为根节点时,树高度+1,创建新节点作为根节点.
        if ($pid == 0) {
            $parent = new BTNode(false, 0);
            $this->storeNode($parent);
            $parent->addIndex(new Index(0, $node->getID()));
            $pid = $parent->getID();

            //新节点作为根节点
            $this->root = $pid;
        }
        $parent = $this->getNodeByID($pid);

        //新树节点的父节点是原节点的父节点,若原节点是根节点,则新树节点的父节点是新的根节点.
        $newNode = new BTNode($node->isLeaf, $pid);
        $this->storeNode($newNode);

        $indexMapIterator = $node->generateIndexMapIterator();
        while ($indexMapIterator->valid()) {

            //将中间索引及之后的索引,移动到新节点
            if ($indexMapIterator->key() >= $middle) {
                $indexObj = $indexMapIterator->current();
                $newNode->addIndex(new Index($indexObj->getIndex(), $indexObj->getNext(), $indexObj->getData()));
                $tmp = $this->getNodeByID($indexObj->getNext());
                //索引指向子节点的原始父节点是分裂之前的节点,现在更改为它们移动到的新节点
                if ($tmp != null) {
                    $tmp->updateParent($newNode->getID());
                }
                if ($indexMapIterator->key() == $middle) {
                    $middleIndexValue = $indexObj->getIndex();
                }
            }
            $indexMapIterator->next();
        }

        //原节点的父节点更新为新的父节点(原节点为根节点时,会重新创建根节点,此时原节点的父节点是这个新的根节点)
        $node->updateParent($pid);

        //原节点分裂后,中间索引及之后的索引都被移动到了新节点,所以把移动的索引在原节点中删除
        $node->deleteMap($middle);

        //B+树的叶子节点之间形成一个链表,在原节点分裂后,原节点的next指向新节点,新节点的next指向原节点的next
        if ($node->isLeaf) {
            $newNode->setNext($node->next);
            $node->setNext($newNode->getID());
        }

        //向分裂节点的父节点添加索引对象,该索引对象的索引值是分裂节点的中间索引值,指向的是新创建的树节点
        $parent->addIndex(new Index($middleIndexValue, $newNode->getID()));

        //若分裂节点的父节点索引达到上限,需要分裂父节点
        if ($parent->isFull($this->order)) {
            $this->split($parent);
        }
    }

    /**
     * @param $index
     * @return Data|string
     *
     * 索引单条查询
     */
    public function find($index)
    {
        $tmpNode = $this->getNodeByID($this->root);
        while ($tmpNode != null) {
            $indexMapIterator = $tmpNode->generateIndexMapIterator();
            while ($indexMapIterator->valid()) {
                $indexObj = $indexMapIterator->current();
                if ($index > $indexObj->getIndex()) {
                    $indexMapIterator->next();
                } else if ($index == $indexObj->getIndex()) {
                    //只有叶节点中索引值相同的索引对象才持有具体数据.
                    if ($tmpNode->isLeaf) {
                        return $indexObj->getData();
                    } else {
                        $indexMapIterator->next();
                    }
                } else {
                    break;
                }
            }
            $indexMapIterator->prev();
            $tmpNode = $this->getNodeByID($indexMapIterator->current()->getNext());
        }

        return 'record ['.$index. '] is not exists!';
    }

    public function delete()
    {
        //TODO
    }

    /**
     * @param $start
     * @param $end
     * @return array
     *
     * 范围查询
     */
    public function rangeFind($start, $end)
    {
        $index = $start;

        $tmpNode = $this->getNodeByID($this->root);
        $prevNode = $tmpNode;

        //根据start索引,定位到叶节点链表开始的节点.
        while ($tmpNode != null) {
            $prevNode = $tmpNode;
            $indexMapIterator = $tmpNode->generateIndexMapIterator();
            while ($indexMapIterator->valid()) {
                $indexObj = $indexMapIterator->current();
                if ($index >= $indexObj->getIndex()) {
                    $indexMapIterator->next();
                } else {
                    break;
                }
            }
            $indexMapIterator->prev();
            $tmpNode = $this->getNodeByID($indexMapIterator->current()->getNext());
        }

        $tNode = $prevNode;
        $resultData  = [];

        //从定位到的节点,遍历叶节点链表,查询出范围内的记录
        while ($tNode != null) {
            $indexMapIterator = $tNode->generateIndexMapIterator();
            while ($indexMapIterator->valid()) {
                $indexObj = $indexMapIterator->current();
                if ($indexObj->getIndex() > $end) {
                    break 2;
                }
                if ($indexObj->getIndex() >= $start) {
                    array_push($resultData, $indexObj->getData());
                }
                $indexMapIterator->next();
            }
            $tNode = $this->getNodeByID($tNode->next);
        }

        return $resultData;
    }

    public function isEmpty()
    {
        return $this->root === 0;
    }

    /**
     * @param BTNode $node
     *
     * 以节点的id为key, 节点对象为value, 保存到节点池中.
     */
    private function storeNode(BTNode $node)
    {
        $id = $node->getID();
        $this->nodeMap[$id] = $node;
    }

    /**
     * @param $id
     * @return BTNode
     */
    public function getNodeByID($id)
    {
        return isset($this->nodeMap[$id]) ? $this->nodeMap[$id] : null;
    }

    /**
     * @param bool $onlyLeafNode
     *
     * 打印所有节点
     */
    public function dumpNodeMap($onlyLeafNode = false)
    {
        echo '<pre>';
        foreach ($this->nodeMap as $eachNode) {
            if (!$onlyLeafNode || $eachNode->isLeaf) {
                var_dump($eachNode);
            }
        }
    }
}

/******************************************** 测试代码 ******************************************************/

$dataList = [
    ['index' => 10, 'name' => 'name_10'],
    ['index' => 20, 'name' => 'name_20'],
    ['index' => 30, 'name' => 'name_30'],
    ['index' => 40, 'name' => 'name_40'],
    ['index' => 5, 'name' => 'name_5'],
    ['index' => 15, 'name' => 'name_15'],
    ['index' => 50, 'name' => 'name_50'],
    ['index' => 35, 'name' => 'name_35'],
    ['index' => 60, 'name' => 'name_60'],
    ['index' => 45, 'name' => 'name_45'],
    ['index' => 22, 'name' => 'name_22'],
];

$testList = [50, 100, 45, 16];

$btree = new BPlusTree(3);

foreach ($dataList as $value) {
    $data = new Data($value);
    $btree->insert($data);
}

//$btree->dumpNodeMap();
//$btree->dumpNodeMap(true);

echo '单条查询 : <br>';
foreach ($testList as $eachIndex) {
    echo $btree->find($eachIndex).'<br>';
}
echo '<hr>';
echo '范围查询 : <br>';

foreach ($btree->rangeFind(4, 33) as $eachData) {
    echo $eachData.'<br>';
}