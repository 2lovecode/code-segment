<?php

class MockList
{
    protected function getArgs()
    {
        $args = [];

        if (isset($_SERVER['argv'])) {
            $args = $_SERVER['argv'];
            array_shift($args);
        }

        return $args;
    }

    public function run()
    {
        $args = $this->getArgs();

        
    }
}

$list = new MockList();
$list->run();