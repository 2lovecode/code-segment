<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

require_once './autoload.php';

\Tools\ObjectSet::$request = new \Http\Request();
\Tools\ObjectSet::$response = new \Http\Response();

$dispatch = new \Service\Dispatch();

$dispatch->dispatch();

\Tools\ObjectSet::$response->send();