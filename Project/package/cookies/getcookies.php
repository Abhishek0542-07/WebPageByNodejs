<?php  
$getdatacookie=[];
if (isset($_COOKIE['emailid']) and isset($_COOKIE['password'])) {
	$getdatacookie['emailid']=$_COOKIE['emailid'];
	$getdatacookie['password']=$_COOKIE['password'];
	echo json_encode($getdatacookie);
}
?>