<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

namespace PHPCodes\Tests\InterestingQuestion\Stack\ImplementQueueWithTwoStack;


use PHPCodes\InterestingQuestion\Stack\ImplementQueueWithTwoStack\Queue;

class QueueTest extends \BaseTestCase
{
    public function testIsEmpty()
    {
        $queue = new Queue();

        $this->assertTrue($queue->isEmpty());

        return $queue;
    }

    /**
     * @param Queue $queue
     * @return Queue
     *
     * @depends testIsEmpty
     */
    public function testAdd(Queue $queue)
    {
        $data = ['a', 'b', 1, 2];

        foreach ($data as $value) {
            $queue->add($value);
        }

        $this->assertTrue(!$queue->isEmpty());
        return $queue;
    }

    /**
     * @param Queue $queue
     * @throws \Exception
     *
     * @depends testIsEmpty
     */
    public function testPollAndPeek(Queue $queue)
    {
        $this->assertEquals('a', $queue->poll());
        $this->assertEquals('b', $queue->peek());
    }
}