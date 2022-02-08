<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

namespace Service;


use Tools\ObjectSet;
use Tools\StrTool;

class Dispatch
{
    public $route = [];

    public function __construct()
    {
        $request = ObjectSet::$request;
        $this->route = $request->getRoute();
    }

    public function dispatch()
    {
        $route = $this->route;

        $action = array_pop($route);

        $tmp = array_map(function ($value) {
            return StrTool::underscore2camel($value);
        }, $route);

        $class = '\\App\\'.implode('\\', $tmp);

        if (class_exists($class)) {
            $app = new $class();
            if (method_exists($app, $action)) {
                $result = $app->$action();
                $response = ObjectSet::$response;
                $response->setContent($result);
            } else {
                throw new \Exception('method ['.$action.']not exists in class ['.$class.']!');
            }
        } else {
            throw new \Exception('class ['.$class.']not exists!');
        }

    }
}