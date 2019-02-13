<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

namespace PHPCodes\InterestingQuestion\Stack\StackReverse;


class ReverseStack
{
    /**
     * @var \SplStack
     */
    protected $stack;

    public function __construct(array $list = [])
    {
        $stack = new \SplStack();
        foreach ($list as $value) {
            $stack->push($value);
        }
        $this->stack = $stack;

        //逆序
        $this->reverse();
    }

    protected function reverse()
    {
        $this->popValue();
    }

    protected function popValue()
    {
        if (!$this->stack->isEmpty()) {
            $value = $this->stack->pop();
            $this->popValue();
        } else {
            return;
        }
        $this->stack->push($value);
    }

    public function pop()
    {
        return $this->stack->pop();
    }

    public function isEmpty()
    {
        return $this->stack->isEmpty();
    }
}