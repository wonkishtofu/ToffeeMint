<%@include file="config.jsp"%>

<%@page import="java.util.*"%>
<%@page import="com.api_demo.model.*"%>
<%@page import="org.json.*"%>
<%@page import="java.net.*"%>
<%@page import="java.io.*"%>


<%
		
%>

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
    <script src="assets/js/ie/html5shiv.js"></script>
    <script src="assets/js/ie/respond.min.js"></script>
    <script src="assets/js/ie/excanvas.js"></script>
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
                <a href="#" class="navbar-brand" data-toggle="fullscreen"><img src="images/logo.png" class="m-r-sm">SMU tBank</a>
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

                <!--Search-->
                <!--<li class="dropdown hidden-xs">
                    <a href="#" class="dropdown-toggle dker" data-toggle="dropdown"><i class="fa fa-fw fa-search"></i></a>
                    <section class="dropdown-menu aside-xl animated fadeInUp">
                        <section class="panel bg-white">
                            <form role="search">
                                <div class="form-group wrapper m-b-none">
                                    <div class="input-group">
                                        <input type="text" class="form-control" placeholder="Search">
                                        <span class="input-group-btn">
                      <button type="submit" class="btn btn-info btn-icon"><i class="fa fa-search"></i></button>
                    </span>
                                    </div>
                                </div>
                            </form>
                        </section>
                    </section>
                </li>-->
                <!--End of Search-->

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
                                            <a href="importerHome.jsp">
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
                                                <li>
                                                    <a href="applyLc.jsp">
                                                        <i class="fa fa-angle-right"></i>
                                                        <span>Apply LC</span>
                                                    </a>
                                                </li>
                                                <li class="active">
                                                    <a href="importerViewLcLog.jsp" class="active">
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
                                <h2 class="m-b-xs font-bold m-t-none">LC details</h2>

                            </div>

                            <section class="panel panel-default">
                                <header class="panel-heading font-bold">

                                </header>
                                <div class="panel-body">
                                    <div class="form-horizontal">
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Exporter ID </label>
                                            <div class="col-sm-10">
                                                123456
                                            </div>
                                        </div>
                                        <div class="line line-dashed line-lg pull-in"></div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Exporter Bank Account</label>
                                            <div class="col-sm-10">
                                                UOB 3456789
                                            </div>
                                        </div>
                                        <div class="line line-dashed line-lg pull-in"></div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label" for="input-id-1">Goods Description</label>
                                            <div class="col-sm-10">
                                                Mouse
                                            </div>
                                        </div>
                                        <div class="line line-dashed line-lg pull-in"></div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label" for="input-id-1">Amount</label>
                                            <div class="col-sm-10">
                                                SGD 234,566
                                            </div>
                                        </div>
                                        <div class="line line-dashed line-lg pull-in"></div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Expiry Date</label>
                                            <div class="col-sm-10">
                                                2017-12-30
                                            </div>
                                        </div>
                                        <div class="line line-dashed line-lg pull-in"></div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Additional Conditions</label>
                                            <div class="col-sm-10">
                                                N.A.
                                            </div>
                                        </div>
                                        <div class="line line-dashed line-lg pull-in"></div>
                                        <div class="form-group">
                                            <div class="col-sm-4 col-sm-offset-2">
                                                <!--<button type="submit" class="btn btn-default">Cancel</button>-->
                                                <a href="importerViewLcLog.jsp"><button type="submit" class="btn btn-primary">Back</button></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </section>


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