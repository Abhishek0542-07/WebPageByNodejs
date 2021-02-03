<?php  
//return month 
// return year
// return expnses amount
// return income amount

  $GET_ARRAY_DATA_ALL=[];

  $dbhost='localhost';
  $dbname='demo_db';
  $db_user_name='root';
  $db_password='';
  $mysql_connection=mysqli_connect($dbhost,$db_user_name,$db_password,$dbname);
  if ($mysql_connection->connect_error) {
      die("<br><br>Connection failed: " . $mysql_connection->connect_error);
   }
  	$GET_ARRAY_DATA_ALL['MONTH']=GETMONTH($mysql_connection);
    $GET_ARRAY_DATA_ALL['YEAR']=GETYEAR($mysql_connection); 
    $ARRAY_MONTH=GETMONTH($mysql_connection);
    $ARRAY_YEAR=GETYEAR($mysql_connection);

    for ($i=0; $i <count($ARRAY_MONTH); $i++) 
    {    
      $GET_ARRAY_DATA_ALL['EXPENSES_AMOUNT']=GET_EXPENSES_AMOUNT($mysql_connection,$ARRAY_MONTH[$i],$ARRAY_YEAR[$i]);
      $GET_ARRAY_DATA_ALL['INCOME_AMOUNT']=GET_INCOME_AMOUNT($mysql_connection,$ARRAY_MONTH[$i],$ARRAY_YEAR[$i]);
    }
    echo json_encode($GET_ARRAY_DATA_ALL);

  function GETMONTH($mysql_connection)
  {
  	$sql ="Select month,COUNT(month) from Expences_Page GROUP BY month HAVING COUNT(month)>0";
    $result=mysqli_query($mysql_connection,$sql);
    $arr=[];
    while($row=mysqli_fetch_array($result))
    {
      $arr[]=$row["month"];
      // echo $row['month'];
    }
    return $arr;
   }
   function GETYEAR($mysql_connection)
   {
  	$sql ="Select year,COUNT(year) from Expences_Page GROUP BY year HAVING COUNT(year)>0";
    $result=mysqli_query($mysql_connection,$sql);
    $arr=[];
    while($row=mysqli_fetch_array($result))
    {
      $arr[]=$row["year"];
    }
    return $arr;
  }
  function GET_EXPENSES_AMOUNT($mysql_connection,$month,$year)
  {
  	$sql ="Select Debit from Expences_Page where month='$month' and year='$year'";
    $result=mysqli_query($mysql_connection,$sql);
    $arr=0;
    while($row=mysqli_fetch_array($result))
    {
      $arr+=$row["Debit"];
    }
    return $arr;
   }
   function GET_INCOME_AMOUNT($mysql_connection,$month,$year)
   {
  	$sql ="Select Credit from Expences_Page  where month='$month' and year='$year'";
    $result=mysqli_query($mysql_connection,$sql);
    $arr=0;
    while($row=mysqli_fetch_array($result))
    {
       $arr+=$row["Credit"];
    }
    return $arr;
  }
?>