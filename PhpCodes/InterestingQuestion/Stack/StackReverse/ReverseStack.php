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
        if ($this->stack->isEmpty()) {
            return;
        }

        $value = $this->popValue();
        $this->reverse();
        $this->stack->push($value);
    }

    protected function popValue()
    {
        $value = $this->stack->pop();

        if ($this->stack->isEmpty()) {
            return $value;
        } else {
            $last =  $this->popValue();
            $this->stack->push($value);
            return $last;
        }
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