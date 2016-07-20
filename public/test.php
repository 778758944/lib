<?php
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-04-16 15:40:01
 * @version $Id$
 */
$name=$_POST["name"];
$age=$_POST["age"];
$arr=Array('name'=>$name,'age'=>$age);
echo json_encode($arr);

?>