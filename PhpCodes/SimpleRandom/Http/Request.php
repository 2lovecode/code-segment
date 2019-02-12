<?php
namespace Http;
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

class Request
{
    public $identifier = "p";

    public $queryParams = null;

    public function getQueryParams()
    {
        if (is_null($this->queryParams)) {
            $this->queryParams = $_GET;
        }

        return $this->queryParams;
    }

    public function getRoute()
    {
        $route = ['welcome', 'index'];

        if (isset($this->queryParams[$this->identifier])) {
            $value = $this->queryParams[$this->identifier];

            $route = explode('/', $value);

            if (count($route) === 1) {
                $route[] = 'index';
            }
        }

        return $route;
    }
}