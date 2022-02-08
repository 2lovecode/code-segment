<?php
namespace Http;
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

class Response
{
    public $content;

    public function setContent($content = "")
    {
        $this->content = $content;
    }
    public function send()
    {
        echo $this->content;
    }
}