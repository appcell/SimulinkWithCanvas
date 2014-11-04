<?php

$data = stripslashes($_POST['data']);
$file = fopen('simulinksample.mdl', 'w') or die('Unable to open file!');
fwrite($file, $data);
fclose($file);

?>