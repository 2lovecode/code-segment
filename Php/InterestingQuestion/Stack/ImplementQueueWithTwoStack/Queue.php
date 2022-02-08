<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

namespace PHPCodes\InterestingQuestion\Stack\ImplementQueueWithTwoStack;


class Queue
{
    /**
     * @var \SplStack
     */
    protected $stackPush;

    /**
     * @var \SplStack
     */
    protected $stackPop;

    public function __construct()
    {
        $this->stackPush = new \SplStack();
        $this->stackPop = new \SplStack();
    }

    public function add($value)
    {
        $this->stackPush->push($value);
    }

    public function poll()
    {
        if ($this->isEmpty()) {
            throw new \Exception('Queue is empty!');
        } else if ($this->stackPop->isEmpty()) {
            while (!$this->stackPush->isEmpty()) {
                $this->stackPop->push($this->stackPush->pop());
            }
        }

        return $this->stackPop->pop();
    }

    public function peek()
    {
        if ($this->isEmpty()) {
            throw new \Exception('Queue is empty!');
        } else if ($this->stackPop->isEmpty()) {
            while (!$this->stackPush->isEmpty()) {
                $this->stackPop->push($this->stackPush->pop());
            }
        }

        return $this->stackPop->top();
    }

    public function isEmpty()
    {
        return $this->stackPush->isEmpty() && $this->stackPop->isEmpty();
    }
}