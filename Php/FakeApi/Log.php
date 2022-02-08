<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

namespace PHPCodes\FakeApi;


class Log
{
    public static $logFile = __DIR__.'/log';

    public static function write($msg)
    {
        $logP = fopen(self::$logFile, 'a+');
        fwrite($logP, $msg."\n");
        fclose($logP);
    }
}