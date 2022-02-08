<?php
namespace PHPCodes\InterestingQuestion\Stack\StackWithGetMin;

/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 题目：实现一个特殊的栈,在实现栈基本功能的基础上,实现返回栈中最小元素的操作.
 *
 * 要求：
 *  1.pop,push,getMin操作的时间复杂度为O(1)
 *  2.可使用现成的栈结构
 */

class MyStack extends AbstractMyStack
{
    /**
     * @var null|\SplStack
     */
    private $dataStack = null;

    /**
     * @var null|\SplStack
     */
    private $minStack = null;

    public function __construct()
    {
        $this->dataStack = new \SplStack();
        $this->minStack = new \SplStack();
    }

    public function push($value)
    {
        if (!$this->minStack->isEmpty()) {
            $currentMin = $this->minStack->top();
            if ($currentMin > $value) {
                $this->minStack->push($value);
            }
        } else {
            $this->minStack->push($value);
        }

        $this->dataStack->push($value);
    }

    public function pop()
    {

        if ($this->dataStack->isEmpty()) {
            throw new \RuntimeException("栈为空");
        }

        $value = $this->dataStack->pop();
        $currentMin = $this->minStack->top();
        if ($value == $currentMin) {
            $this->minStack->pop();
        }

        return $value;
    }

    public function getMin()
    {
        if ($this->minStack->isEmpty()) {
            throw new \RuntimeException("栈为空");
        }

        $value = $this->minStack->top();

        return $value;
    }

    public function isEmpty()
    {
        return $this->dataStack->isEmpty();
    }
}
