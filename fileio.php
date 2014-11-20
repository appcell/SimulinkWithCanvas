<?php

$data = stripslashes($_POST['data']);
$file = fopen('untitle.m', 'w') or die('Unable to open file!');
fwrite($file, $data);
fclose($file);

?>