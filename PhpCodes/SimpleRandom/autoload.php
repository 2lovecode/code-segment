<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

function _autoload($className)
{
    $filePath = str_replace('\\', DIRECTORY_SEPARATOR, $className).'.php';
    include $filePath;
}

spl_autoload_register('_autoload');