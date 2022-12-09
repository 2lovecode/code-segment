<?php

class Array2Toml
{
    private $arr = [];
    private $result = "";

    public function __construct($arr = [])
    {
        $this->arr = $arr;
    }

    public function run()
    {
        foreach ($this->arr as $key => $value) {
            if (!empty($value) && is_string($value)) {
                $this->result = $this->result.sprintf("[\"%s\"]\r\none = \"%s\"\r\nother = \"%s\"\r\n", $key, $value, $value);
            }
        }

        echo $this->result;
    }
}

$a2t = new Array2Toml();
$a2t->run();