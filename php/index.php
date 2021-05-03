<!DOCTYPE html>
<html lang="en">

<head>
  <title>VIT HOSTELS</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
    crossorigin="anonymous">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
    crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css?family=PT+Sans:400,700" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="/stylesheets/main.css">
</head>

<body>
  <nav id="mainNavbar" class="navbar navbar-expand-lg navbar-dark bg-danger">
    <div class="container">
        <a class="navbar-brand" href="http://localhost:8000/hostels">VIT HOSTELS</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li id="home" class="nav-item">
            <a class="nav-link" href="http://localhost:8000/hostels">Hostels</a>
          </li>
          <li id="about" class="nav-item">
            <a class="nav-link" href="http://localhost:8000/about">About</a>
          </li>
          <li id="newHostel" class="nav-item">
            <a class="nav-link" href="http://localhost:8000/hostels/new">New</a>
          </li>
          <li id="newHostel" class="nav-item">
            <a class="nav-link" href="http://localhost:8080">Users</a>
          </li>
          <li id="newHostel" class="nav-item">
            <a class="nav-link" href="http://localhost:3000">Improve</a>
          </li>
          <li id="newHostel" class="nav-item">
            <a class="nav-link" href="index.php">More</a>
          </li>
        </ul>
        <!-- <ul class="navbar-nav ml-auto">
            <li id="login" class="nav-item">
              <a class="nav-link" href="/login">Login</a>
            </li>
            <li id="register" class="nav-item">
              <a class="nav-link" href="/register">Sign Up</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
                <i class="fas fa-user"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="/users/<%= currentUser._id %>">Profile</a>
                <a class="dropdown-item" href="/logout">Log Out</a>
              </div>
            </li>
        </ul> -->
      </div>
    </div>
  </nav>


<?php
include('database.php');
$sql="select id,name from warden order by name asc";
$res=mysqli_query($con,$sql);
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Vit Mens Hostel Administration</title>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	</head>
	<body>
		<br /><br />
		 <div class="container mt-4">    
    	 <div class="row">
		<div class="container">
			<h2 align="center">Vit Mens Hostel Administration</a></h2>
			<div class="row">
				<div class="col-md-12">
					<br />			
					<div class="row">
						<div class="col-md-4"></div>
						<div class="col-md-4">
							<select name="student_list" id="student_list" class="form-control" onchange="getData(this.options[this.selectedIndex].value)">
								<option value="">Select Warden ID</option>
								<?php while($row=mysqli_fetch_assoc($res)){?>
								<option value="<?php echo $row['id']?>"><?php echo $row['name']?></option>
								<?php } ?>
							</select>
						</div>
					</div>
					<br />
					<div class="table-responsive" id="user_details" style="display:none">
						<table class="table table-bordered">
							<tr>
								<td width="10%" align="right"><b>Name</b></td>
								<td width="90%"><span id="user_name"></span></td>
							</tr>
							<tr>
								<td width="10%" align="right"><b>Post</b></td>
								<td width="90%"><span id="user_post"></span></td>
							</tr>
							<tr>
								<td width="10%" align="right"><b>Email</b></td>
								<td width="90%"><span id="user_email"></span></td>
							</tr>
							<tr>
								<td width="10%" align="right"><b>Phone</b></td>
								<td width="90%"><span id="user_phone"></span></td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
		<script>
		function getData(id){
			if(id==''){
				jQuery('#user_details').hide();
			}else{
				jQuery.ajax({
					url:'getData.php',
					type:'post',
					data:'id='+id,
					success:function(result){
						var json_data=jQuery.parseJSON(result);
						jQuery('#user_details').show();
						jQuery('#user_name').html(json_data.name);
						jQuery('#user_post').html(json_data.post);
						jQuery('#user_email').html(json_data.email);
						jQuery('#user_phone').html(json_data.phone);
					}

				})
			}
		}
		</script>
	</body>
</html>