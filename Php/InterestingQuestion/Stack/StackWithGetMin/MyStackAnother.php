<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

namespace PHPCodes\InterestingQuestion\Stack\StackWithGetMin;


class MyStackAnother extends AbstractMyStack
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
        $this->dataStack->push($value);

        if (!$this->minStack->isEmpty()) {
            $current = $this->minStack->top();
            if ($current > $value) {
                $this->minStack->push($value);
            } else {
                $this->minStack->push($current);
            }
        } else {
            $this->minStack->push($value);
        }
    }


    public function pop()
    {
        if ($this->dataStack->isEmpty()) {
            throw new \RuntimeException("stack is empty");
        }
        $value = $this->dataStack->pop();
        $this->minStack->pop();

        return $value;
    }

    public function getMin()
    {
        if ($this->dataStack->isEmpty()) {
            throw new \RuntimeException("stack is empty");
        }
        $value = $this->minStack->top();

        return $value;
    }

    public function isEmpty()
    {
        return $this->dataStack->isEmpty();
    }

}