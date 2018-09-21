<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 跳跃表
 *
 */
class Node
{
    public $id;

    private $level;
    private $value;
    private $next;
    private $nextLevel;

    public function __construct($value, $level)
    {
        $this->value = $value;
        $this->level = $level;
        $this->next = null;
        $this->nextLevel = null;
        $this->id = uniqid();
    }

    public function getLevel()
    {
        return $this->level;
    }

    public function getValue()
    {
        return $this->value;
    }

    public function setNext($next)
    {
        $this->next = $next;
    }

    public function setNextLevel($nextLevel)
    {
        $this->nextLevel = $nextLevel;
    }


    public function getNext()
    {
        return $this->next;
    }

    public function getNextLevel()
    {
        return $this->nextLevel;
    }
}

class SkipList
{
    private $level;

    /**
     * @var Node
     */
    private $topNode = null;

    public $nodeMap = [];

    public function __construct($level)
    {
        $this->level = $level;
        $this->initSkipList();
    }

    private function initSkipList()
    {
        $tmpNode = new Node('inf', 0);
        $this->setObject($tmpNode);

        $this->topNode = $tmpNode->id;

        $prev = $tmpNode;

        for ($i = $this->level; $i >= 1; $i--) {
            $tmp = new Node('inf', $i);
            $node = new Node('gig', $i);

            $this->setObject($tmp);
            $this->setObject($node);

            $tmp->setNext($node->id);
            $prev->setNextLevel($tmp->id);

            $prev = $tmp;
        }
    }

    public function insert($value)
    {
        $level = $this->generateLevelValue();
        $tmp = $this->getObject(($this->getObject($this->topNode))->getNextLevel());

        $prev = null;
        $levelMap = [];


        while ($tmp != null) {
            $prev = $tmp;
            if ($this->cmp($value, $tmp->getValue())) {
                $tmp = $this->getObject($tmp->getNext());
            } else if ($this->cmp($tmp->getValue(), $value)) {
                if ($prev->getLevel() <= $level) {
                    $levelMap[] = $prev;
                }
                $tmp = $this->getObject($prev->getNextLevel());
            } else {
                return false;
            }
        }

        $prevLevel = null;

        foreach ($levelMap as $key => $each) {
            $node = new Node($value, $each->getLevel());
            $node->setNext($each->getNext());
            $each->setNext($node->id);

            $this->setObject($node);

            if (!is_null($prevLevel)) {
                $prevLevel->setNextLevel($node->id);
            }
            $prevLevel = $node;
        }
    }

    public function delete($value)
    {

    }

    public function find($value)
    {
        $tmp = $this->getObject(($this->getObject($this->topNode))->getNextLevel());

        while ($tmp != null) {
            $prev = $tmp;
            if ($this->cmp($value, $tmp->getValue())) {
                $tmp = $this->getObject($tmp->getNext());
            } else if ($this->cmp($tmp->getValue(), $value)) {
                $tmp = $this->getObject($prev->getNextLevel());
            } else {
                return true;
            }
        }

        return false;
    }

    private function generateLevelValue()
    {
        $level = 0;

        do {
            $rand = mt_rand(0, 1);
            $level++;
        } while ($rand && ($level < $this->level));

        return $level;
    }

    private function cmp($a, $b)
    {
        if ($a == 'gig') {
            if ($b == 'gig') {
                return false;
            } else {
                return true;
            }
        } else if ($a == 'inf') {
            return false;
        }

        if ($b == 'gig') {
            return false;
        } else if ($b == 'inf') {
            return true;
        }
        return $a > $b;
    }

    public function setObject($object)
    {
        $this->nodeMap[$object->id] = $object;
    }

    /**
     * @param $id
     * @return Node
     */
    public function getObject($id)
    {
        return isset($this->nodeMap[$id]) ? $this->nodeMap[$id] : null;
    }
}

$testData = [898888];

$skipList = new SkipList(3);
foreach ($testData as $value) {
    $skipList->insert($value);
}

var_dump($skipList);
$test = [898888, 300, 234, 123, 333, 456, 23, 99, 100, 111];

foreach ($test as $value) {
    var_dump($skipList->find($value));
}