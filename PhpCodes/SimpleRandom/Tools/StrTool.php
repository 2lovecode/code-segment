<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

namespace Tools;


class StrTool
{
    public static function underscore2camel($str)
    {
        $list = explode('_', $str);

        foreach ($list as $key => $value) {
            if (!empty($value)) {
                $list[$key] = ucfirst($value);
            } else {
                unset($list[$key]);
            }
        }

        return implode("", $list);
    }

//    public static function camel2underscore($str)
//    {
//    }
}