
<%@page import="java.util.*"%>
<%@page import="com.api_demo.model.*"%>
<%@page import="org.json.*"%>
<%@page import="java.net.*"%>
<%@page import="javax.servlet.RequestDispatcher"%>
<%@page import="java.io.*"%>




<!DOCTYPE html>
<html lang="en" class="app">

<head>
    <meta charset="utf-8" />
    <title>SMU tBank - Trade Finance Application</title>
    <meta name="description" content="app, web app, responsive, admin dashboard, admin, flat, flat ui, ui kit, off screen nav" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <link rel="stylesheet" href="assets/css/bootstrap.css" type="text/css" />
    <link rel="stylesheet" href="assets/css/animate.css" type="text/css" />
    <link rel="stylesheet" href="assets/css/font-awesome.min.css" type="text/css" />
    <link rel="stylesheet" href="assets/css/font.css" type="text/css" />
    <link rel="stylesheet" href="assets/js/calendar/bootstrap_calendar.css" type="text/css" />
    <link rel="stylesheet" href="assets/js/jvectormap/jquery-jvectormap-1.2.2.css" type="text/css" />
    <link rel="stylesheet" href="assets/css/app.css" type="text/css" />
    <!--[if lt IE 9]>
    <script src="js/ie/html5shiv.js"></script>
    <script src="js/ie/respond.min.js"></script>
    <script src="js/ie/excanvas.js"></script>
  <![endif]-->
</head>

<body class="">
    <section class="vbox">
        <header class="bg-black dk header navbar navbar-fixed-top-xs">
            <!--Logo-->
            <div class="navbar-header aside-md">
                <a class="btn btn-link visible-xs" data-toggle="class:nav-off-screen,open" data-target="#nav,html">
                    <i class="fa fa-bars"></i>
                </a>
                <a href="#" class="navbar-brand" data-toggle="fullscreen"><img src="assets/images/logo.png" class="m-r-sm">SMU tBank</a>
                <a class="btn btn-link visible-xs" data-toggle="dropdown" data-target=".nav-user">
                    <i class="fa fa-cog"></i>
                </a>
            </div>
            <!--End of Logo-->

            <ul class="nav navbar-nav navbar-right m-n hidden-xs nav-user">
                <!--Notification-->
                <li class="hidden-xs">
                    <a href="#" class="dropdown-toggle dk" data-toggle="dropdown">
                        <i class="fa fa-bell"></i>
                        <span class="badge badge-sm up bg-danger m-l-n-sm count">2</span>
                    </a>

                    <section class="dropdown-menu aside-xl">
                        <section class="panel bg-white">
                            <header class="panel-heading b-light bg-light">
                                <strong>You have <span class="count">2</span> notifications</strong>
                            </header>
                            <div class="list-group list-group-alt animated fadeInRight">
                                <a href="#" class="media list-group-item">
                                    <span class="pull-left thumb-sm">
                                      <img src="images/avatar.jpg" alt="John said" class="img-circle">
                                    </span>
                                    <span class="media-body block m-b-none">
                                      Use awesome animate.css<br>
                                      <small class="text-muted">10 minutes ago</small>
                                    </span>
                                </a>
                                <a href="#" class="media list-group-item">
                                    <span class="media-body block m-b-none">
                                      1.0 initial released<br>
                                      <small class="text-muted">1 hour ago</small>
                                    </span>
                                </a>
                            </div>
                            <footer class="panel-footer text-sm">
                                <a href="#" class="pull-right"><i class="fa fa-cog"></i></a>
                                <a href="#notes" data-toggle="class:show animated fadeInRight">See all the notifications</a>
                            </footer>
                        </section>
                    </section>
                </li>
                <!--End of Notification-->

                <!--User Info-->
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <span class="thumb-sm avatar pull-left">
                          <img src="images/avatar.jpg">
                        </span> John.Smith <b class="caret"></b>
                    </a>
                    <ul class="dropdown-menu animated fadeInRight">
                        <span class="arrow top"></span>
                        <li>
                            <a href="modal.lockme.html" data-toggle="ajaxModal">Logout</a>
                        </li>
                    </ul>
                </li>
                <!--End of User Info-->
            </ul>
        </header>
        <section>
            <section class="hbox stretch">
                <!-- .aside -->
                <aside class="bg-dark lter aside-md hidden-print hidden-xs" id="nav">
                    <section class="vbox">

                        <section class="w-f scrollable">
                            <div class="slim-scroll" data-height="auto" data-disable-fade-out="true" data-distance="0" data-size="5px" data-color="#333333">

                                <!-- nav -->
                                <nav class="nav-primary hidden-xs">
                                    <ul class="nav">
                                        <li>
                                            <a href="home.jsp">
                                                <i class="fa fa-dashboard icon">
                                                    <b class="bg-danger"></b>
                                                  </i>
                                                <span>Home</span>
                                            </a>
                                        </li>

                                        <li class="active">
                                            <a href="#layout">
                                                <i class="fa fa-file-text icon">
                                                  <b class="bg-warning"></b>
                                                </i>
                                                <span class="pull-right">
                                                  <i class="fa fa-angle-down text"></i>
                                                  <i class="fa fa-angle-up text-active"></i>
                                                </span>
                                                <span>Letter of Credits</span>
                                            </a>
                                            <ul class="nav lt">
                                                <li class="active">
                                                    <a href="#" class="active">
                                                        <i class="fa fa-angle-right"></i>
                                                        <span>Apply LC</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="importerViewLcLog.jsp">
                                                        <i class="fa fa-angle-right"></i>
                                                        <span>View LC Log</span>
                                                    </a>
                                                </li>

                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                                <!-- / nav -->
                            </div>
                        </section>

                        <footer class="footer lt hidden-xs b-t b-dark">
                            <a href="#nav" data-toggle="class:nav-xs" class="pull-right btn btn-sm btn-dark btn-icon">
                                <i class="fa fa-angle-left text"></i>
                                <i class="fa fa-angle-right text-active"></i>
                            </a>

                        </footer>
                    </section>
                </aside>
                <!-- /.aside -->
                <!--Content-->
                <section id="content">
                    <section class="vbox">
                        <section class="scrollable">

                            <div class="wrapper-lg">
                                <h2 class="m-b-xs font-bold m-t-none">Apply Letter of Credits</h2>

                            </div>
                            
                            <%
                                
                            %>
                            <form data-validate="parsley" id="lc" class="padder">

                                <div class="row">
                                    <div class="col-sm-6">

                                        <section class="panel panel-default">
                                            <header class="panel-heading">
                                                <span class="h4">Exporter ID</span>
                                            </header>
                                            <div class="panel-body">
                                                <p class="text-muted">Please select an exporter to continue</p>
                                                <div class="form-group">

                                                    <div class="">
                                                        <select name="exporterId" id="exporterId" class="form-control m-b ">
                                                                  <option value="">--Please select an exporter--</option>
                                                                  <option value="1738">Toffee Mint1</option>
                                                                  <option value="1738">Toffee Mint2</option>
                                                                  <option value="1738">Toffee Mint3</option>           
                                                        </select>
                                                        <%
                                                            
                                                            String exporterId = request.getParameter("exporterId");
                                                        %>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                    </div>
                                    <div class="col-sm-6">

                                        <section class="panel panel-default formHidden">
                                            <header class="panel-heading">
                                                <span class="h4">Exporter Information</span>
                                            </header>
                                            <div class="panel-body">
                                                <div class="form-group">
                                                    <h4>Exporter ID</h4>

                                                    <p id="printExpId">
                                                       
                                                    </p>
                                                   
                                                </div>
                                                <div class="form-group">
                                                    <h4>Bank</h4>
                                                    <p>UOB</p>
                                                   
                                                </div>
                                                <div class="form-group">
                                                    <h4>Account Number</h4>
                                                    <p>456789</p>
                                                </div>
                                            </div>
                                        </section>

                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-6">

                                        <section class="panel panel-default formHidden">
                                            <header class="panel-heading">
                                                <span class="h4">Goods Description</span>
                                            </header>
                                            <div class="panel-body">
                                                <div class="form-group">

                                                    <div class="">
                                                        <select class="form-control show-tick" name="goods">
                                                                    <option value="">-- Please select Goods --</option>
                                                                    <option value="10">Screen</option>
                                                                    <option value="20">Mouse</option>
                                                                    <option value="30">Memory Card</option>
                                                                    <option value="40">Hard-disk</option>
                                                                    <option value="50">Keyboard</option>
                                                                </select>
                                                         <%
                                                            
                                                            String goodsDescription = request.getParameter("goods");
                                                        %>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-6">

                                        <section class="panel panel-default formHidden">
                                            <header class="panel-heading">
                                                <span class="h4">Other Information</span>
                                            </header>
                                            <div class="panel-body">
                                                 <div class="form-group">
                                                    <label>Ship Date (YYYY-MM-DD)</label>
                                                    <input type="text" data-type="dateIso" class="form-control expiryDate" name="expiryDate" data-required="true">
                                               <%
                                                            
                                                            String shipDate = request.getParameter("shipDate");
                                                        %>
                                                </div>
                                                <div class="form-group">
                                                    <label>Amount</label>
                                                    <input type="text" class="form-control" data-required="true" name="amount">
                                                    <%
                                                            
                                                            String amount = request.getParameter("amount");
                                                        %>
                                                </div>
                                                <div class="form-group">
                                                    <label>Expiry Date (YYYY-MM-DD)</label>
                                                    <input type="text" data-type="dateIso" class="form-control expiryDate" name="expiryDate" data-required="true">
                                               <%
                                                            
                                                            String expiryDate = request.getParameter("expiryDate");
                                                        %>
                                                </div>
                                                <div class="form-group">
                                                    <label>Additional Conditions</label>
                                                    <textarea class="form-control" rows="6" data-minwords="0" data-required="true" placeholder="Additional Conditions" name="additonalConditions"></textarea>
                                               <%
                                                            
                                                            String additonalConditions = request.getParameter("additonalConditions");
                                                        %>
                                                </div>

                                                <footer class="text-center bg-light lter">
                                                    <button type="submit" class="btn btn-success btn-s-xs" id="buttonSubmission">Submit</button>
                                                </footer>
                                            </div>
                                        </section>


                                    </div>
                                </div>
                                                    

                            </form>
                            <script type="text/javascript">
                                var elem = document.getElementById("exporterId");
                                elem.onchange = function() {
                                    document.getElementById("printExpId").innerHTML = $('#exporterId option:selected').text();
                                    var elements = document.getElementsByClassName("formHidden");
                                    for (var i = 0, length = elements.length; i < length; i++) {
                                        elements[i].style.display = (elem.value == "") ? "none" : "block";
                                    }
                                };
                            </script>

                        </section>
                        <!--End of Scrollable-->
                    </section>
                    <!--End of vbox-->

                </section>
                <!--End of Content-->

            </section>
            <!--End of hbox stretch -->
        </section>

    </section>
    <!--End of Vbox-->
    
    
    <%
    // api url
		String apiServiceUrl1 = "http://smu.tbankonline.com/SMUtBank_API/Gateway";
//		String apiServiceUrl = "http://localhost:8080/SMUtBank_API/Gateway";

		try {		

			// build header
			JSONObject jo = new JSONObject();
			jo.put("serviceName", "applyLetterOfCredit");
			jo.put("userID", "kinetic1");
			jo.put("PIN", "123456");
			jo.put("OTP", "999999");
			JSONObject headerObj = new JSONObject();
			headerObj.put("Header", jo);
			String header = headerObj.toString();
			
			// build content
			jo = new JSONObject();
			jo.put("importerAccount", "2365");	// localhost-324, 169-2365, AWS-3398
			jo.put("exporterAccount", exporterId);	// localhost-99,  169-1738, AWS-????
			jo.put("expiryDate", expiryDate);
			jo.put("expiryPlace", "Singapore");
			jo.put("confirmed", "false");
			jo.put("revocable", "false");
			jo.put("availableBy", "TERM");
			jo.put("termDays", "90");
			jo.put("amount", amount);
			jo.put("currency", "SGD");
			jo.put("applicableRules", "none");
			jo.put("partialShipments", "false");
			jo.put("shipDestination", "London");
			jo.put("shipDate", shipDate);
			jo.put("shipPeriod", "90 Days");
			jo.put("goodsDescription", goodsDescription);
			jo.put("docsRequired", "none");
			jo.put("additionalConditions", additonalConditions);
			jo.put("senderToReceiverInfo", "none");
			jo.put("mode", "BC"); // BC or DB
			JSONObject contentObj = new JSONObject();
			contentObj.put("Content", jo);
			String content = contentObj.toString();

			// connect to API service
			HttpURLConnection urlConnection = (HttpURLConnection) new URL(apiServiceUrl1).openConnection();
			urlConnection.setDoOutput(true);
			urlConnection.setRequestMethod("POST");
			
			// build request parameters
			String parameters
				= "Header="+header+"&"
				+ "Content="+content+"&"
				+ "ConsumerID=TF";
				
			// send request
			BufferedWriter br = new BufferedWriter(new OutputStreamWriter(urlConnection.getOutputStream()));
			br.write(parameters);
			br.close();
			
			// get response
			String response1 = "";
			Scanner s = new Scanner(urlConnection.getInputStream());
			while (s.hasNextLine()){
				response1 += s.nextLine();
			}
			s.close();
			
			// get response object
			JSONObject responseObj = new JSONObject(response1);
			System.out.println(responseObj.toString(4)); // indent 4 spaces
			System.out.println();
                        
                        RequestDispatcher view = request.getRequestDispatcher("/home.jsp");
                        view.forward(request, response);
		}
		catch(Exception e) {e.printStackTrace(System.out);}

%>
<script>
      (function() {

    function init() {
        $('#buttonSubmission').click(submitButtonHandler);
    }

    function submitButtonHandler(evt) {
       windows.location.replace("home.jsp")
    }

})();
</script>

    <script src="assets/js/jquery.min.js"></script>
    <!-- Bootstrap -->
    <script src="assets/js/bootstrap.js"></script>
    <!-- App -->
    <script src="assets/js/app.js"></script>
    <script src="assets/js/slimscroll/jquery.slimscroll.min.js"></script>
    <!-- parsley -->
    <script src="assets/js/parsley/parsley.min.js"></script>
    <script src="assets/js/parsley/parsley.extend.js"></script>
    <script src="assets/js/app.plugin.js"></script>

    <script src="assets/js/app.plugin.js"></script>
</body>

</html>