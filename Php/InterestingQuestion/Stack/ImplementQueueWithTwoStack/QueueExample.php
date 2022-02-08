<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

require_once "Queue.php";

$queue = new \PHPCodes\InterestingQuestion\Stack\ImplementQueueWithTwoStack\Queue();

$testData = [12, 1, "a", "b", "dd"];

foreach ($testData as $value) {
    $queue->add($value);
}

while (!$queue->isEmpty()) {
    var_dump($queue->peek());
    var_dump($queue->poll());
}