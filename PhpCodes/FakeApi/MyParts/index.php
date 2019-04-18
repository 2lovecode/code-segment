<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

require_once dirname(dirname(__DIR__)) . '/vendor/autoload.php';

$params = file_get_contents('php://input');

try {
    $myParts = new PHPCodes\FakeApi\MyParts\MyParts(json_decode($params, true));
    $myParts->exec();
} catch (\Exception $e) {
    \PHPCodes\FakeApi\Log::write($e->getMessage());
}
