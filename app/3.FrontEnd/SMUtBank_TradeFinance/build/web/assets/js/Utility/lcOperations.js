//var getUserItem = sessionStorage.getItem('user');
//var user = $.parseJSON(getUserItem);
var userId = sessionStorage.userID;
var PIN = sessionStorage.PIN;
var OTP = sessionStorage.OTP;
//var userType = sessionStorage.usertype;
//this function handle the ui logic of apply lc page
async function applyLcOperation() {

    var exporterDetails = getExporterDetails();
    if (exporterDetails.length > 0) {
        for (var i in exporterDetails) {
            option =
                "<option value='" +
                exporterDetails.customerId +
                "'>" +
                exporterDetails.userId +
                "</option>";
        }
    }

    const accounts = await getCustomerAccounts(userId, PIN, OTP); //get currency and importer account
    var account = accounts.Content.ServiceResponse.AccountList.account[0];
    if (account == null) {
        account = accounts.Content.ServiceResponse.AccountList.account;
    }

    var errorMsg;
    var globalErrorID;
    var importerAccount = account.accountID;
    //console.log(importerAccount);
    var exporterAccount = document.getElementById("exporterAcct").value;
    var expiryDate = document.getElementById("shipDate").value;
    var confirmed = "false";
    var revocable = "false";
    var availableBy = "TERM";
    var termDays = "90";
    var amount = document.getElementById("amount").value;
    var currency = account.currency; //getCustomerAccounts
    var applicableRules = "none";
    var partialShipments = "false";
    var shipDestination = document.getElementById("shipDestination").value;
    var shipDate = document.getElementById("shipDate").value; // for testing purpose, Remember to change it!!

    var shipPeriod = document.getElementById("shipPeriod").value;
    //console.log(shipDate);
    var goodsDescription = document.getElementById("goodsDesc").value;
    var docsRequired = "none";
    var additionalConditions = "";
    //document.getElementById("additionalConditions").value;
    var senderToReceiverInfo = "none";
    var mode = "BC";
    if (!(exporterAccount.length > 0)) {
        return { errorMsg: "Exporter account cannot be blank" };
    }
    if (!(goodsDescription.length > 0)) {
        return { errorMsg: "Goods description cannot be blank" };
    }
    if (!(shipPeriod.length > 0)) {
        return { errorMsg: "Ship period cannot be blank" };
    } else {
        if (moment(shipDate, "YYYY-MM-DD", true).format() === "Invalid date") {
            return { errorMsg: "Invalid Date Format. Correct Format : 'YYYY-MM-DD'" };
        }
    }
    if (!(amount.length > 0)) {
        return { errorMsg: "Amount cannot be blank" };
    } else {
        if (isNaN(amount)) {
            return { errorMsg: "Amount must be numeric" };
        }
    }
    if (!(shipDate.length > 0)) {
        return { errorMsg: "Ship date cannot be blank" };
    }

    if (!(shipDestination.length > 0)) {
        return { errorMsg: "ship Destination cannot be blank" };
    }

    var lc = {
        importerAccount: importerAccount,
        exporterAccount: exporterAccount,
        expiryDate: expiryDate,
        confirmed: confirmed,
        revocable: revocable,
        availableBy: availableBy,
        termDays: termDays,
        amount: amount,
        currency: currency,
        applicableRules: applicableRules,
        partialShipments: partialShipments,
        shipDestination: shipDestination,
        shipDate: shipDate,
        shipPeriod: shipPeriod,
        goodsDescription: goodsDescription,
        docsRequired: docsRequired,
        additionalConditions: additionalConditions,
        senderToReceiverInfo: senderToReceiverInfo,
        mode: mode
    };
    var globalErrorID = "";
    var errorMsg = "";
    const data = await applyLcApi(userId, PIN, OTP, lc);

    errorMsg = data.Content.ServiceResponse.ServiceRespHeader.ErrorText;
    globalErrorID = data.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
    if (globalErrorID !== "010000") {
        //calling this method from assets/js/DAO/lcHandling.js
        //return {errorMsg: errorMsg};
        $("#authError").html(errorMsg);
    } else if (globalErrorID === "010041") {
        //OTP expiry error - request new otp

        buildSMSOTP();
    } else {
        //submit lc application --> for now get ref num and upload lc to bc
        $("#authError").html("lc application submitted");

        window.location.replace(
            "/SMUtBank_TradeFinance/" + sessionStorage.usertype + "/" + sessionStorage.usertype + ".html"
        );

    }
}

/* call web service used in homepage and consolidate necessary data in homepage data object*/
async function getHomepageData() {
    var homePageData = {};
    /*Part 1 retrieve all ref num under the user*/
    var refNumberList = [];
    //call await/async function --> getRefNumListAsync. Return {errormsg}, or {refNumlist}
    const refNumberListValidation = await getRefNumListAsync(userId, PIN, OTP);
    if (!refNumberListValidation.hasOwnProperty("Content")) {
        refNumberList = refNumberListValidation.RefNumList.RefNum;
    }

    //hard code for now to elliminate  impact of these 2 contracts
    var index1 = refNumberList.indexOf("0000001489");
    if (index1 > -1) {
        refNumberList.splice(index1, 1);
    }
    var index2 = refNumberList.indexOf("0000001450");
    if (index2 > -1) {
        refNumberList.splice(index2, 1);
    }

    /*Part 2 - get all transaction hash*/
    var bcReceipt = {};
    //call async/await function --> getAllBlockchainReceipt, return all blockchain receipt
    const allBlockchainReceipt = await getAllBlockchainReceipt(userId, PIN, OTP);
    if (allBlockchainReceipt != null) {
        for (var i = 0; i < allBlockchainReceipt.length; i++) {
            bcReceipt[allBlockchainReceipt[i][0]] = allBlockchainReceipt[i][1];
        }
    }
    //get number of refnum in the list
    var numOfRows = refNumberList.length;
    if (refNumberList.length > 0) {
        //iterate through up to 5 latest refnum in the list
        for (var i = 0; i < numOfRows && i < 5; i++) {
            var refNum = refNumberList[i]; //key of homepageData
            var lc = {};
            var exporterAcct = "";
            var importerAcct = "";
            var expiryDate = "";
            var status = "";
            var globalErrorId = "";
            /*Part 3 - Get lc details of coresponding ref num*/
            const lcDetails = await getLcDetails(userId, PIN, OTP, refNum);
            var globalErrorId =
                lcDetails.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
            if (globalErrorId === "010000") {
                importerAcct =
                    lcDetails.Content.ServiceResponse.LC_Details.LC_record
                    .importer_account_num;
                exporterAcct =
                    lcDetails.Content.ServiceResponse.LC_Details.LC_record
                    .exporter_account_num;
                expiryDate =
                    lcDetails.Content.ServiceResponse.LC_Details.LC_record.expiry_date;
                status = lcDetails.Content.ServiceResponse.LC_Details.LC_record.status.toLowerCase();
                lc = lcDetails.Content.ServiceResponse.LC_Details.LC_record;
                //console.log("lcDetailsType");
                //console.log(typeof(lc));
            }
            //convert lc object to a jsonString, passing jsonstring through data-variable of the modal
            lc = JSON.stringify(lc);
            /*Part 4 - get Links(Bol, cert of origin, and Cert of Origin) of the ref num*/
            var links = "";
            var linkObj = {};
            //get bol link, insurance link, and cert of origin link by calling this method. Return
            const bolLinks = await getBOLUrl(userId, PIN, OTP, refNum);
            var globalErrorId =
                bolLinks.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
            if (globalErrorId === "010000") {
                links =
                    bolLinks.Content.ServiceResponse.BOL_Details.BOL_record_output
                    .BOL_Link;
                //console.log("bol links Type");
                //console.log(typeof(links));
                linkObj = JSON.parse(links);
            }
            /*Part 5 - get receipt of each refnum in the list*/
            var getReceipt = "";
            if (bcReceipt != null) {
                getReceipt = bcReceipt[refNum];
                //console.log("receipt Type");
                //console.log(typeof(getReceipt));
            }

            /*Part 6 - add each record to data object - Key: RefNum, Value: {lcDetails : lcDetails, bolLinks: bolLinks, receipt : receipt}*/
            var contentObj = {
                lcDetails: lc,
                bolLinks: links,
                receipt: getReceipt
            };
            homePageData[refNum] = contentObj;
        }
    }
    var homepageDataString = JSON.stringify(homePageData);
    return homepageDataString;
}

//this function handles ui logic of homepage
async function homeOperation() {
    /*Part 1 retrieve all ref num under the user*/
    var refNumberList = [];
    //call await/async function --> getRefNumListAsync. Return {errormsg}, or {refNumlist}
    const refNumberListValidation = await getRefNumListAsync(userId, PIN, OTP);
    if (!refNumberListValidation.hasOwnProperty("Content")) {
        refNumberList = refNumberListValidation.RefNumList.RefNum;
    }

    //hard code for now to elliminate  impact of these 2 contracts
    var index1 = refNumberList.indexOf("0000001489");
    if (index1 > -1) {
        refNumberList.splice(index1, 1);
    }
    var index2 = refNumberList.indexOf("0000001450");
    if (index2 > -1) {
        refNumberList.splice(index2, 1);
    }

    /*Part 2 - get all transaction hash*/
    var bcReceipt = {};
    //call async/await function --> getAllBlockchainReceipt, return all blockchain receipt
    const allBlockchainReceipt = await getAllBlockchainReceipt(userId, PIN, OTP);
    if (allBlockchainReceipt != null) {
        for (var i = 0; i < allBlockchainReceipt.length; i++) {
            bcReceipt[allBlockchainReceipt[i][0]] = allBlockchainReceipt[i][1];
        }
    }
    //get number of refnum in the list
    var numOfRows = refNumberList.length;
    if (refNumberList.length > 0) {
        //iterate through up to 5 latest refnum in the list
        for (var i = 0; i < numOfRows && i < 5; i++) {
            var refNum = refNumberList[i]; //key of homepageData
            var lc = {};
            var exporterAcct = "";
            var importerAcct = "";
            var expiryDate = "";
            var status = "";
            var globalErrorId = "";
            /*Part 3 - Get lc details of coresponding ref num*/
            const lcDetails = await getLcDetails(userId, PIN, OTP, refNum);
            var globalErrorId =
                lcDetails.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
            if (globalErrorId === "010000") {
                importerAcct =
                    lcDetails.Content.ServiceResponse.LC_Details.LC_record
                    .importer_account_num;
                exporterAcct =
                    lcDetails.Content.ServiceResponse.LC_Details.LC_record
                    .exporter_account_num;
                expiryDate =
                    lcDetails.Content.ServiceResponse.LC_Details.LC_record.expiry_date;
                status = lcDetails.Content.ServiceResponse.LC_Details.LC_record.status.toLowerCase();
                lc = lcDetails.Content.ServiceResponse.LC_Details.LC_record;
                //console.log("lcDetailsType");
                //console.log(typeof(lc));
            }
            //convert lc object to a jsonString, passing jsonstring through data-variable of the modal
            lc = JSON.stringify(lc);
            /*Part 4 - get Links(Bol, cert of origin, and Cert of Origin) of the ref num*/
            var links = "";
            var linkObj = {};
            //get bol link, insurance link, and cert of origin link by calling this method. Return
            const bolLinks = await getBOLUrl(userId, PIN, OTP, refNum);
            var globalErrorId =
                bolLinks.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
            if (globalErrorId === "010000") {
                links =
                    bolLinks.Content.ServiceResponse.BOL_Details.BOL_record_output
                    .BOL_Link;
                //console.log("bol links Type");
                //console.log(typeof(links));
            }
            /*Part 5 - get receipt of each refnum in the list*/
            var getReceipt = "";
            if (bcReceipt != null) {
                getReceipt = bcReceipt[refNum];
                //console.log("receipt Type");
                //console.log(typeof(getReceipt));
            }

            /*Method 2 - call async/await function --> getHomepageData, (seperate ui and data retriever)*/
            /*const homepageData = await getHomepageData();
 
 var dataObj = JSON.parse(homepageData);
 //console.log(dataObj);
 var dataSize = Object.keys(dataObj).length;
 if(dataSize >0){
 //    console.log(">0");
 
 for (var i = 0; i < dataSize; i++) { 
 //get refnum
 var refNum = Object.keys(dataObj)[i];
 
 //get lc 
 var lc = dataObj[refNum].lcDetails;
 var lcObj = JSON.parse(lc);
 //get status
 var status = lcObj.status;
 console.log(status);
 //get exporter acct
 var exporterAcct = lcObj.exporter_account_num;
 console.log(exporterAcct);
 //get importer acct
 var importerAcct = lcObj.importer_account_num;
 console.log(importerAcct);
 //get expiry date
 var expiryDate = lcObj.expiry_date;
 console.log(expiryDate);
 
 //get links
 var links = dataObj[refNum].bolLinks;
 console.log(links);
 //get receipt
 var getReceipt = dataObj[refNum].receipt;
 
 */
            /*End of Method 2*/

            //Get operation - Call operationMatch method,  returns [action, url] based on user type (e.g.["view lc", "viewLc.html"])
            var operations = operationMatch(status); //calling this method from utility/operationMatch.js
            var operation = operations[0]; //get action to take
            var url = operations[1];
            var $row = $("<tr></tr>");
            var button = "";
            button =
                "<button type='button'  class='btn btn-primary lcDetails' data-action= '" +
                operation +
                "' data-toggle='modal' data-target='#lcDetailsModal' data-bcreceipt='" +
                getReceipt +
                "' data-lc='" +
                lc +
                "' data-links='" +
                links +
                "' data-status='" +
                status +
                "' data-refnum='" +
                refNum +
                "'>" +
                convertToDisplay(operation, " ") +
                "</button>";
            if (operation === "modify lc" || operation === "submit bol") {
                button =
                    "<button type='button'  data-refnum=" +
                    refNum +
                    " class='btn btn-primary homeButton' id='" +
                    url +
                    "'>" +
                    convertToDisplay(operation, " ") +
                    "</button>";
            }

            var $button = $(button);
            $button.addClass(buttonAssigned(operation)[0]);
            var $refNumCell = $("<td></td>");
            $refNumCell.append(refNum);
            $row.append($refNumCell);
            if (sessionStorage.usertype === "importer") {
                var $exporterAcctCell = $("<td>" + exporterAcct + "</td>");
                $row.append($exporterAcctCell);
            } else {
                var $importerAcctCell = $("<td>" + importerAcct + "</td>");
                $row.append($importerAcctCell);
            }
            var $expiryDateCell = $("<td>" + expiryDate + "</td>");
            $row.append($expiryDateCell);
            var $statusCell = $(
                '<td id="status" class="font-bold">' +
                convertToDisplay(status, " ") +
                "</td>"
            );
            $statusCell.addClass(buttonAssigned(operation)[1]);
            $row.append($statusCell);
            var $buttonCell = $("<td></td>");
            $buttonCell.append($button);
            $row.append($buttonCell);
            $("#latestLCs").append($row);
        }
    }
}

function getAllLcDetails() {
    var refNumberList = [];
    var refNumberListValidation = validateGetRefNumList(userId, PIN, OTP);
    //console.log(refNumberList);
    if (refNumberListValidation !== undefined) {
        if (refNumberListValidation.hasOwnProperty("success")) {
            refNumberList = refNumberListValidation.success;
            //console.log(refNumberList);
        }
    }
    var numOfRows = refNumberList.length;
    var allLcDetails = [];
    for (var i = 0; i < numOfRows; i++) {
        //call web service to get lc details for each ref number
        var refNum = refNumberList[i];
        //var refNumInt = parseInt(refNum);
        //get status of the ref num
        //getStatus(userId, PIN, OTP, refNum, callback)
        var status = "";
        getStatus(userId, PIN, OTP, refNum, function(data) {
            status = data;
        });
        //get contract of the ref num
        var country = "";
        var exporterAcct = "";
        var shipDate = "";
        var lcDetails = {};
        getLcDetails(userId, PIN, OTP, refNum, function(contract) {
            //calling this method from  assets/js/DAO/lcHandling.js
            if (contract !== "") {
                lcDetails = contract.Content;
            }
        });
        var lcObject = {
            refNum: refNum,
            lcDetails: lcDetails,
            status: status
        };
        allLcDetails[i] = lcObject;
    }
    return allLcDetails;
}

//this function handles ui logic of homepage
function shipperHomeOperation(lcToBePrinted) {
    if (lcToBePrinted.length > 0) {
        for (var i in lcToBePrinted) {
            var url = lcToBePrinted[i]["url"];
            var operation = lcToBePrinted[i]["operation"];
            var refNum = lcToBePrinted[i]["refNum"];
            var status = lcToBePrinted[i]["status"];
            var country = lcToBePrinted[i]["country"];
            var shipDate = lcToBePrinted[i]["shipDate"];
            var exporterAcct = lcToBePrinted[i]["exporter"];
            var $row = $("<tr></tr>");
            var href =
                "/SMUtBank_TradeFinance/" +
                sessionStorage.usertype +
                "/" +
                url +
                ".html?action=" +
                url +
                "&refNum=" +
                refNum;
            var $button = $(
                "<a type='button' id='lcDetails' class='btn btn-s-md' href='" +
                href +
                "'>" +
                operation +
                "</a> "
            );
            $button.addClass(buttonAssigned(status)[0]);
            var $refNumCell = $("<td></td>");
            $refNumCell.append(refNum);
            $row.append($refNumCell);
            var $countryCell = $("<td>" + country + "</td>");
            $row.append($countryCell);
            var $exporterAcctCell = $("<td>" + exporterAcct + "</td>");
            $row.append($exporterAcctCell);
            var $shipDateCell = $("<td>" + shipDate + "</td>");
            $row.append($shipDateCell);
            var $statusCell = $(
                '<td id="status" class="font-bold">' + status + "</td>"
            );
            $statusCell.addClass(buttonAssigned(status)[1]);
            $row.append($statusCell);
            var $buttonCell = $("<td></td>");
            $buttonCell.append($button);
            $row.append($buttonCell);
            $("#latestLCs").append($row);
        }
    } else {
        $("#latestLCs").append(
            "<tr><td class='font-bold' style='text-align:center' colspan='6'>No Results found</td></tr>"
        );
    }
}

function emptyShipperHome() {
    $("#latestLCs").empty();
}

function getAllLcDetailsShipper() {
    var refNumberList = [];
    var refNumberListValidation = validateGetRefNumList(userId, PIN, OTP);
    //console.log(refNumberList);
    if (refNumberListValidation !== undefined) {
        if (refNumberListValidation.hasOwnProperty("errorMsg")) {
            var errorMsg = refNumberListValidation.errorMsg;
            //console.log("error");
            //console.log(errorMsg);
            $("#authError").html(errorMsg);
        } else if (refNumberListValidation.hasOwnProperty("success")) {
            refNumberList = refNumberListValidation.success;
            //console.log(refNumberList);
        }
    }

    var numOfRows = refNumberList.length;
    var allLcDetails = [];
    if (refNumberList.length > 0) {
        for (var i = 0; i < numOfRows; i++) {
            //call web service to get lc details for each ref number

            var refNum = refNumberList[i];
            var availableStatus = [
                "acknowledged",
                "relevant documents uploaded",
                "documents accepted by importer",
                "item colleccted"
            ];
            //acknowledged = Awaiting Document Presentation

            //get contract of the ref num
            var exporterAcct = "";
            var importerAcct = "";
            var shipDate = "";
            var status = "";
            var globalErrorId = "";
            var country = "";
            getLcDetails(userId, PIN, OTP, refNum, function(contract) {
                //calling this method from  assets/js/DAO/lcHandling.js
                globalErrorId =
                    contract.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
                //console.log(globalErrorId);
                if (globalErrorId === "010000") {
                    status = contract.Content.ServiceResponse.LC_Details.LC_record.status.toLowerCase();
                    var statusIncluded = $.inArray(status, availableStatus);
                    if (status !== "" && statusIncluded !== -1) {
                        importerAcct =
                            contract.Content.ServiceResponse.LC_Details.LC_record
                            .importer_account_num;
                        exporterAcct =
                            contract.Content.ServiceResponse.LC_Details.LC_record
                            .exporter_account_num;
                        shipDate =
                            contract.Content.ServiceResponse.LC_Details.LC_record.ship_date;
                        country =
                            contract.Content.ServiceResponse.LC_Details.LC_record
                            .ship_destination;
                        var operations = operationMatch(status); //calling this method from utility/operationMatch.js
                        var operation = operations[0];
                        var url = operations[1];
                        var lcObject = {
                            refNum: refNum,
                            country: country,
                            exporter: exporterAcct,
                            shipDate: shipDate,
                            status: status,
                            operation: operation,
                            url: url
                        };
                        allLcDetails[i] = lcObject;
                    }
                }
            });
        }
    }

    return allLcDetails;
}

function modifyLcOps() {
    var refNum = getQueryVariable("refNum");
    var importerAccount = ""; //no change
    var exporterAccount = ""; //no change
    var expiryDate = "";
    var expiryPlace = "";
    var confirmed = "";
    var revocable = "";
    var availableBy = "";
    var termDays = "";
    var amount = "";
    var currency = ""; //no change
    var applicableRules = "";
    var partialShipments = "";
    var shipDestination = "";
    var shipDate = "";
    var shipPeriod = "";
    var goodsDescription = "";
    var docsRequired = "";
    var additionalConditions = "";
    var senderToReceiverInfo = "";
    var mode = "BC"; //no change

    var errorMsg;
    var globalErrorID;
    var allNecessaryFields = [
        "expiry_date",
        "amount",
        "ship_date",
        "goods_description",
        "additional_conditions",
        "importer_account_num",
        "exporter_account_num",
        "expiry_place",
        "confirmed",
        "revocable",
        "available_by",
        "term_days",
        "currency",
        "applicable_rules",
        "partial_shipments",
        "ship_destination",
        "ship_period",
        "sender_to_receiver_info",
        "docs_required"
    ];
    var allNecessaryFieldsName = [
        "expiryDate",
        "amount",
        "shipDate",
        "goodsDescription",
        "additionalConditions",
        "importerAccountNum",
        "exporterAccountNum",
        "expiryPlace",
        "confirmed",
        "revocable",
        "availableBy",
        "termDays",
        "currency",
        "applicableRules",
        "partialShipments",
        "shipDestination",
        "shipPeriod",
        "senderToReceiverInfo",
        "docsRequired"
    ];
    var amendmentDetails = null;
    var originalLc = null;
    //get original contract, store in amendments variable
    getLcDetails(userId, PIN, OTP, refNum, function(contract) {
        //calling this method from  assets/js/DAO/lcHandling.js
        var globalErrorId =
            contract.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
        //console.log(globalErrorId);
        var fields = {};
        if (globalErrorId === "010000") {
            fields = contract.Content.ServiceResponse.LC_Details.LC_record;
            originalLc = fields;
            importerAccount = fields.importer_account_num; //no change
            //console.log(importerAccount);
            exporterAccount = fields.exporter_account_num; //no change
            expiryDate = fields.expiry_date; //no change
            expiryPlace = fields.expiry_place;
            confirmed = fields.confirmed;
            revocable = fields.revocable;
            availableBy = fields.available_by;
            termDays = fields.term_days;
            amount = fields.amount;
            currency = fields.currency; //no change
            applicableRules = fields.applicable_rules;
            partialShipments = fields.partial_shipments;
            shipDestination = fields.ship_destination;
            shipDate = fields.ship_date;
            shipPeriod = fields.ship_period;
            goodsDescription = fields.goods_description;
            docsRequired = fields.docs_required;
            additionalConditions = fields.additional_conditions;
            senderToReceiverInfo = fields.sender_to_receiver_info;
        }
    });
    var originalAmount = "";
    var originalDesc = "";
    var originalExpiryDate = "";
    var originalShipPeriod = "";
    getLcAmendments(userId, PIN, OTP, refNum, function(amendments) {
        //calling this method from  assets/js/DAO/lcHandling.js
        var globalErrorId =
            amendments.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
        //console.log(globalErrorId);
        var fields = {};
        if (globalErrorId === "010000") {
            fields = amendments.Content.ServiceResponse.LC_Amend.LC_Amend;
            //console.log(fields);
            amendmentDetails = fields;
            //importerAccount = fields.importer_account_num; //no change
            //exporterAccount = fields.exporter_account_num; //no change
            originalExpiryDate = fields.expiry_date; //no change
            //expiryPlace = fields.expiry_place;
            //confirmed = fields.confirmed;
            //revocable = fields.revocable;
            //availableBy = fields.available_by;
            //termDays = fields.term_days;
            originalAmount = fields.amount;
            originalShipPeriod = fields.shipPeriod;
            //currency = fields.currency; //no change
            //applicableRules = fields.applicable_rules;
            //partialShipments = fields.partial_shipments;
            //shipDestination = fields.ship_destination;
            // shipDate = fields.ship_date;
            //shipPeriod = fields.ship_period;
            originalDesc = fields.goods_description;
            //docsRequired = fields.docs_required;
            //additionalConditions = fields.additional_conditions;
            //senderToReceiverInfo = fields.sender_to_receiver_info;
            /*$("#goodsDescription").attr("placeholder", goodsDescription);
                       $("#amount").attr("placeholder", amount);
                       $("#expiryDate").attr("placeholder", expiryDate);*/
        }
    });
    if (amendmentDetails !== null && originalLc !== null) {
        for (var field in amendmentDetails) {
            var fieldCamel = attributeMapping(field);
            var originalValue = originalLc[field];
            var amendedValue = amendmentDetails[field];
            if (fieldCamel === "shipPeriod") {
                $('#shipPeriod option[value="' + shipPeriod + '"]').insertBefore(
                    '#shipPeriod option[value=""]'
                );
                $("#shipPeriod").val($("#shipPeriod option:first").val());
            }
            $("#" + fieldCamel).attr("placeholder", originalValue);
            //console.log(fieldCamel);
            var suggestion = "";
            if (originalValue !== amendedValue) {
                if (amendedValue !== null) {
                    var p =
                        "<p class='btn-danger'> Exporter has suggested to amend : " +
                        amendedValue +
                        "</p>";
                    $("#" + fieldCamel + "-p").append(p);
                }
            }
        }
    }

    $("#modifyLcButton").click(function() {
        shipPeriod = document.getElementById("shipPeriod").value;
        if (shipPeriod === "") {
            shipPeriod = document.getElementById("shipPeriod").placeholder;
        }
        expiryDate = document.getElementById("expiryDate").value;
        if (expiryDate === "") {
            expiryDate = document.getElementById("expiryDate").placeholder;
        } else {
            if (moment(expiryDate, "YYYY-MM-DD", true).format() === "Invalid date") {
                return {
                    errorMsg: "Invalid Date Format. Correct Format : 'YYYY-MM-DD'"
                };
            }
        }
        amount = document.getElementById("amount").value;
        if (amount === "") {
            amount = document.getElementById("amount").placeholder;
        } else {
            if (isNaN(amount)) {
                return { errorMsg: "Amount must be numeric" };
            }
        }
        goodsDescription = document.getElementById("goodsDescription").value;
        if (goodsDescription === "") {
            goodsDescription = document.getElementById("goodsDescription")
                .placeholder;
        }
        //console.log(importerAccount);

        var lc = {
            referenceNumber: refNum,
            importerAccount: importerAccount,
            exporterAccount: exporterAccount,
            expiryDate: expiryDate,
            expiryplace: expiryPlace,
            confirmed: confirmed,
            revocable: revocable,
            availableBy: availableBy,
            termDays: termDays,
            amount: amount,
            currency: currency,
            applicableRules: applicableRules,
            partialShipments: partialShipments,
            shipDestination: shipDestination,
            shipDate: shipDate,
            shipPeriod: shipPeriod,
            goodsDescription: goodsDescription,
            docsRequired: docsRequired,
            additionalConditions: additionalConditions,
            senderToReceiverInfo: senderToReceiverInfo,
            mode: mode
        };
        //console.log(lc);
        //amend lc
        var validateLcApplication = lcModificationForm(userId, PIN, OTP, lc);
        //console.log(validateLcApplication);
        if (validateLcApplication !== undefined) {
            if (validateLcApplication.hasOwnProperty("errorMsg")) {
                var errorMsg = validateLcApplication.errorMsg;
                //console.log("error");
                //console.log(errorMsg);
                $("#authError").html(errorMsg);
            } else if (validateLcApplication.hasOwnProperty("success")) {
                $("#authError").html("submitted");
                //console.log("success");
                //console.log(validateLcApplication);
                //After completing both applying lc from Alan's API and bc, page will be redirected to homepage.
                window.location.replace(
                    "/SMUtBank_TradeFinance/importer/importer.html"
                );
            }
        }
    });
    $("#cancelButton").click(function() {
        window.location.replace("/SMUtBank_TradeFinance/importer/importer.html");
    });
}

/*async function amendLcOps() {
var refNum = getQueryVariable("refNum");
        var importerAccount = ""; //no change
        var exporterAccount = ""; //no change
        var expiryDate = "";
        var expiryPlace = "";
        var confirmed = "";
        var revocable = "";
        var availableBy = "";
        var termDays = "";
        var amount = "";
        var currency = ""; //no change
        var applicableRules = "";
        var partialShipments = "";
        var shipDestination = "";
        var shipDate = "";
        var shipPeriod = "";
        var goodsDescription = "";
        var docsRequired = "";
        var additionalConditions = "";
        var senderToReceiverInfo = "";
        var mode = "BC"; //no change

        var errorMsg;
        var globalErrorID;
        const lcDetails = await getLcDetails(userId, PIN, OTP, refNum); //calling this method from  assets/js/DAO/lcHandling.js
        var globalErrorId = lcDetails.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
        //console.log(globalErrorId);
        var fields = {};
        if (globalErrorId === "010000") {
fields = lcDetails.Content.ServiceResponse.LC_Details.LC_record;
        importerAccount = fields.importer_account_num; //no change
        //console.log(fields);
        exporterAccount = fields.exporter_account_num; //no change
        expiryDate = fields.expiry_date; //no change
        expiryPlace = fields.expiry_place;
        confirmed = fields.confirmed;
        revocable = fields.revocable;
        availableBy = fields.available_by;
        termDays = fields.term_days;
        amount = fields.amount;
        currency = fields.currency; //no change
        applicableRules = fields.applicable_rules;
        partialShipments = fields.partial_shipments;
        shipDestination = fields.ship_destination;
        shipDate = fields.ship_date;
        shipPeriod = fields.ship_period;
        goodsDescription = fields.goods_description;
        docsRequired = fields.docs_required;
        additionalConditions = fields.additional_conditions;
        senderToReceiverInfo = fields.sender_to_receiver_info;
        $("#goodsDescription").attr("placeholder", goodsDescription);
        $("#amount").attr("placeholder", amount);
        $("#expiryDate").attr("placeholder", expiryDate);
        $("#shipPeriod").attr("placeholder", shipPeriod);
        $('#shipPeriod option[value="' + shipPeriod + '"]').insertBefore('#shipPeriod option[value=""]');
        $("#shipPeriod").val($("#shipPeriod option:first").val());
}

$("#amendLcButton").click(function () {
shipPeriod = document.getElementById("shipPeriod").value;
        if (shipPeriod === "") {
shipPeriod = document.getElementById("shipPeriod").placeholder;
}
expiryDate = document.getElementById("expiryDate").value;
        if (expiryDate === "") {
expiryDate = document.getElementById("expiryDate").placeholder;
} else {
if (moment(expiryDate, 'YYYY-MM-DD', true).format() === "Invalid date") {
return {errorMsg: "Invalid Date Format. Correct Format : 'YYYY-MM-DD'"};
}
}
amount = document.getElementById("amount").value;
        if (amount === "") {
amount = document.getElementById("amount").placeholder;
} else {
if (isNaN(amount)) {
return {errorMsg: "Amount must be numeric"};
}
}
goodsDescription = document.getElementById("goodsDescription").value;
        if (goodsDescription === "") {
goodsDescription = document.getElementById("goodsDescription").placeholder;
}

var lc = {
referenceNumber: refNum,
        importerAccount: importerAccount,
        exporterAccount: exporterAccount,
        expiryDate: expiryDate,
        expiryplace: expiryPlace,
        confirmed: confirmed,
        revocable: revocable,
        availableBy: availableBy,
        termDays: termDays,
        amount: amount,
        currency: currency,
        applicableRules: applicableRules,
        partialShipments: partialShipments,
        shipDestination: shipDestination,
        shipDate: shipDate,
        shipPeriod: shipPeriod,
        goodsDescription: goodsDescription,
        docsRequired: docsRequired,
        additionalConditions: additionalConditions,
        senderToReceiverInfo: senderToReceiverInfo,
        mode: mode
};
        //console.log("lc to be amended");
        //console.log(lc);
        //amend lc
        const amendments = await amendLc(userId, PIN, OTP, lc);
        var globalErrorID = amendments.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
        var errorMsg = amendments.Content.ServiceResponse.ServiceRespHeader.ErrorText;
        var amendmentsDetails = {};
        if (globalErrorID !== "010000") {//calling this method from assets/js/DAO/lcHandling.js
//return {errorMsg: errorMsg};
$("#authError").html(errorMsg);
} else if (globalErrorID === "010041") {//OTP expiry error - request new otp

buildSMSOTP();
}
else {//submit lc application --> for now get ref num and upload lc to bc
$("#authError").html("lc application submitted");
        window.location.replace("/SMUtBank_TradeFinance/" + sessionStorage.usertype + "/" + sessionStorage.usertype + ".html");
}

});
        $("#cancelButton").click(function () {
window.location.replace("/SMUtBank_TradeFinance/exporter/exporter.html");
});
}*/

function totalLcs() {}

function buttonAssigned(action) {
    // this method is to assign button color (by adding class name to the button element) based on action
    //var element, name, arr;
    //element = document.getElementById("lcDetails");
    var name = "btn-primary";
    var text = "text-primary";
    //if (status === "rejected" || status === "amendments requested") {
    if (action !== "view lc") {
        name = "btn-danger";
        text = "text-danger";
    }
    return [name, text];
}

function operationMatch(status) {
    //var lowerStatus = status.toLowerCase();
    var operation = "view lc";
    var url = "lcDetails";
    if (sessionStorage.usertype === "importer") {
        if (status.toLowerCase() === "amendments requested") {
            url = "modifyLc";
            operation = "modify lc";
        } else if (status.toLowerCase() === "documents uploaded") {
            url = "acceptDocs";
            operation = "accept documents";
        } else if (status.toLowerCase() === "documents accepted") {
            url = "collectGoods";
            operation = "collect goods";
        }
    } else if (sessionStorage.usertype === "exporter") {
        if (status.toLowerCase() === "pending") {
            url = "reviewLc";
            operation = "review lc";
        } else if (status.toLowerCase() === "acknowledged") {
            //url = "shipGoods";
            //operation = "ship goods";
            url = "submitBol";
            operation = "submit bol";
        }
    } else if (sessionStorage.usertype === "shipper") {
        if (status.toLowerCase() === "acknowledged") {
            url = "submitBol";
            operation = "submit bol";
        } else {
            url = "view contract";
            operation = "view contract";
        }
    }
    return [operation, url];
}

function showLcDetailsModal() {
    //if user clicks the button -

    $("#lcDetailsModal").modal("show");
}

function loadLcDetailsModal() {
    $(document).ready(function() {
        $("#lcDetailsModal").on("show.bs.modal", function(event) {
            // id of the modal with event
            var button = $(event.relatedTarget); // Button that triggered the modal
            var refNum = button.data("refnum"); // Extract info from data-* attributes
            var status = button.data("status");
            var action = button.data("action");
            var links = button.data("links");
            var bcReceipt = button.data("bcreceipt");
            var fields = button.data("lc"); //convert string to json string
            //var fieldsFromUser = ["exporterAccount", "expiryDate", "amount", "goodsDescription", "additionalConditions"];
            var currency = fields["currency"];
            var allNecessaryFields = [
                "goods_description",
                "importer_ID",
                "exporter_ID",
                "creation_datetime",
                "issuing_bank_id",
                "ship_period",
                "amount",
                "exporter_account_num",
                "ship_destination",
                "importer_account_num"
            ];
            var allLcHTML = "";
            /*Call getBCreceipt after user clicks */
            //get bc receipt
            //var bcReceipt = "";
            /*getBlockchainReceipt(userId, PIN, OTP, refNum, function (data) {
               //(data)
               if (data != null) {
               bcReceipt = data[0][1]
               //(bcReceipt)
               }
               });*/

            //(typeof(bcReceipt))

            if (links !== "") {
                var bolLink = "http://bit.ly/2BPThUM"; //links["bolLink"]
                //new QRCode( document.getElementById"), bolLink);
                if (status === "documents accepted" || status === "goods collected") {
                    new QRCode(document.getElementById("qrcode"), {
                        width: 150,
                        height: 150,
                        text: bolLink
                    });
                }
                //var qrCode = $("<div id='qrcode'></div>")
                //$('#lcQRCode').qrcode({width: 100,height: 100,text: bolLink});
                for (var i in links) {
                    var lcDetailsHTML = "";
                    lcDetailsHTML =
                        "<label class='col-lg-4 control-label lc-label' id=''>" +
                        i +
                        "</label>";
                    lcDetailsHTML +=
                        "<div class='col-lg-8 font-bold' id='lcValue'><a href='" +
                        links[i] +
                        "' target='_blank'>" +
                        links[i] +
                        "</a></div>";

                    allLcHTML +=
                        "<div class='form-group lc-form'>" + lcDetailsHTML + "</div>";
                    allLcHTML += "<div class='line line-dashed line-lg pull-in'></div>";
                }
            }
            for (var i in fields) {
                for (var j = 0; j < allNecessaryFields.length; j++) {
                    if (allNecessaryFields[j] === i) {
                        var field = convertToDisplay(i, "_");
                        //console.log(field)
                        var fieldValue = fields[i];

                        if (i === "amount") {
                            fieldValue = currency + " " + fieldValue;
                        }

                        // convert underscorename to display name
                        //var displayName = convertUnderscoreToDisplay(i);
                        var lcDetailsHTML = "";
                        lcDetailsHTML =
                            "<label class='col-lg-4 control-label lc-label' id=''>" +
                            field +
                            "</label>";
                        lcDetailsHTML +=
                            "<div class='col-lg-8 font-bold' id='lcValue'><p id='" +
                            i +
                            "'></p>" +
                            fieldValue +
                            "</div>";

                        allLcHTML +=
                            "<div class='form-group lc-form'>" + lcDetailsHTML + "</div>";
                        allLcHTML += "<div class='line line-dashed line-lg pull-in'></div>";
                    }
                }
            }
            status = convertToDisplay(status, " ");
            var statusP = $(
                "<p id='statusValue' class='font-bold h3 font-bold m-t'>" +
                status +
                "</p>"
            );

            var buttonGroup = $("<div class='form-group lc-form'></div>");
            var actionDiv = $(
                "<div class='col-lg-4 ' style='' id='actionDiv'></div>"
            );
            var actionButton = $(
                "<button type='button' class='actionButton btn btn-primary btn-lg'><i class='fa fa-check'></i>  </button>"
            );
            var cancelDiv = $(
                "<div class='col-lg-4 ' style='' id='cancelDiv'></div>"
            );
            var cancelButton = $(
                "<button type='button' class='cancelButton btn btn-danger btn-lg'></button>"
            );
            var closeDiv = $("<div class='col-lg-4 '></div>");
            var closeButton = $(
                "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>"
            );
            var attrToChange = [];
            if (sessionStorage.usertype === "exporter" && action === "review lc") {
                attrToChange = [
                    "approveButton",
                    "amendLc",
                    "Approve",
                    "Request to amend",
                    "visible",
                    "visible"
                ];
            } else if (sessionStorage.usertype === "importer" && action === "accept documents") {
                attrToChange = [
                    "acceptDocs",
                    "cancel",
                    "Accept Documents",
                    "Cancel",
                    "visible",
                    "visible"
                ];
            } else if (sessionStorage.usertype === "importer" && action === "collect goods") {
                attrToChange = [
                    "collectGoods",
                    "",
                    "Collect Goods",
                    "",
                    "visible",
                    "hidden"
                ];
            } else {
                attrToChange = ["", "", "", "", "hidden", "hidden"];
            }

            actionButton.attr("id", attrToChange[0]).append(attrToChange[2]);
            cancelButton.attr("id", attrToChange[1]).append(attrToChange[3]);
            actionDiv.css("visibility", attrToChange[4]);
            cancelDiv.css("visibility", attrToChange[5]);

            actionDiv.append(actionButton);
            cancelDiv.append(cancelButton);
            closeDiv.append(closeButton);
            buttonGroup.append(actionDiv);
            buttonGroup.append(cancelDiv);
            buttonGroup.append(closeDiv);

            var text = "text-primary";

            if (action !== "view lc") {
                text = "text-danger";
            }
            statusP.addClass(text);

            /*var buttons = ""
               if (sessionStorage.usertype === "exporter" && action === "approve lc") {
               $("#amendLcContainer").css("display", "block")
               
               } else if (sessionStorage.usertype === "importer" && action === "accept documents") {
               $("#acceptDocsContainer").css("display", "block")
               
               } else {
               $("#viewLcContainer").css("display", "block")
               }*/

            var refNumHTML = "<div value='" + refNum + "' id='returnedRef'></div>";
            // Update the modal's content.
            var modal = $(this);
            modal
                .find(".modal-body section header div div div p#refNum")
                .text(refNum);
            modal.find(".modal-body #status").html(statusP);
            modal.find(".modal-body #lcDetails").html(allLcHTML);
            modal.find(".modal-body #returnedRefNum").html(refNumHTML);
            //modal.find('.modal-body #json').html(JSON.stringify(bcReceipt, undefined, 2))
            modal
                .find(".modal-body #json")
                .html(JSON.stringify(bcReceipt, undefined, 2));
            modal.find(".modal-footer #lcButtons").html(buttonGroup);
            //modal.find('.modal-body #lcQRCode').html(qrCode)
            buttonClicks();
        });
        $("#lcDetailsModal").on("hidden.bs.modal", function(e) {
            $(e.target).removeData("bs.modal");
            $("#qrcode").html("");
            $("#statusValue").attr("class", "h3 font-bold m-t");
        });
        /*$(".modal").on("hidden.bs.modal", function () {
             $(".modal-body").html("");
             $(".modal-footer").html("");
             });*/
    });
}

function buttonClicks() {
    $("#approveButton").click(function() {
        var refNum = $("#returnedRef").attr("value");
        //console.log(refNum);
        var status = "acknowledged";
        updateStatus(userId, PIN, OTP, refNum, status, "", function(data) {
            //console.log(data);
            var globalErrorID =
                data.Content.Trade_LCStatus_Update_BCResponse.ServiceRespHeader
                .GlobalErrorID;
            if (globalErrorID === "010000") {
                window.location.replace(
                    "/SMUtBank_TradeFinance/" + sessionStorage.usertype + "/" + sessionStorage.usertype + ".html"
                );
            }
        });
    });
    $("#amendLc").click(function() {
        var refNum = $("#returnedRef").attr("value");
        //console.log(refNum);
        var page = $(this).attr("id");
        //console.log(page);
        var pageToLoad = { page: page, refNum: refNum }; // append refnum into pagetToLoad and set a session
        sessionStorage.setItem("page", JSON.stringify(pageToLoad));
        window.location.replace(
            "/SMUtBank_TradeFinance/" +
            sessionStorage.usertype +
            "/" +
            sessionStorage.usertype +
            ".html?refNum=" +
            refNum
        );
        //window.location.replace("/SMUtBank_TradeFinance/exporter/amendLcDetails.html?refNum=" + refNum);
    });
    $("#acceptDocs").click(function() {
        var refNum = $("#returnedRef").attr("value");
        //console.log(refNum);
        var status = "documents accepted";
        updateStatus(userId, PIN, OTP, refNum, status, "", function(data) {
            //console.log(data);
            var globalErrorID =
                data.Content.Trade_LCStatus_Update_BCResponse.ServiceRespHeader
                .GlobalErrorID;
            if (globalErrorID === "010000") {
                window.location.replace(
                    "/SMUtBank_TradeFinance/" + sessionStorage.usertype + "/" + sessionStorage.usertype + ".html"
                );
            }
        });
    });
    $("#collectGoods").click(function() {
        var refNum = $("#returnedRef").attr("value");
        //console.log(refNum);
        var status = "goods collected";
        updateStatus(userId, PIN, OTP, refNum, status, "", function(data) {
            //console.log(data);
            var globalErrorID =
                data.Content.Trade_LCStatus_Update_BCResponse.ServiceRespHeader
                .GlobalErrorID;
            if (globalErrorID === "010000") {
                window.location.replace(
                    "/SMUtBank_TradeFinance/" + sessionStorage.usertype + "/" + sessionStorage.usertype + ".html"
                );
            }
        });
    });
}

function getExporterDetails() {
    // get all exporter details of current importer
    //var exporterList = ["0000000915","0000000914"];
    var expoterList = ["toffeemint1", "toffeemint2"]; //user ids

    var allUserCredentials = [{
            userId: "toffeemint1",
            customerId: "0000000914",
            bankId: "1",
            accountId: "0000002473"
        },
        {
            userId: "toffeemint2",
            customerId: "0000000915",
            bankId: "1",
            accountId: "0000002480"
        },
        {
            userId: "toffeemint4",
            customerId: "0000000918",
            bankId: "1",
            accountId: "0000002482"
        },
        {
            userId: "toffeemint5",
            customerId: "0000000919",
            bankId: "1",
            accountId: "0000002483"
        },
        {
            userId: "toffeemint6",
            customerId: "0000000920",
            bankId: "1",
            accountId: "0000002484"
        },
        {
            userId: "toffeemint7",
            customerId: "0000000924",
            bankId: "1",
            accountId: "0000002486"
        },
        {
            userId: "toffeemint8",
            customerId: "0000000921",
            bankId: "1",
            accountId: "0000002485"
        },
        {
            userId: "toffeemint9",
            customerId: "0000000925",
            bankId: "1",
            accountId: "0000002487"
        }
    ];
    //console.log(allUserCredentials);
    var exporterCredentials = [];
    for (var i = 0; i < allUserCredentials.length; i++) {
        var oneCredential = allUserCredentials[i];
        //console.log(oneCredential["userId"]);
        if (oneCredential["userId"] !== userId) {
            exporterCredentials.push(oneCredential);
        }
    }
    //console.log(exporterCredentials);
    return exporterCredentials;
}

function getAllCountries() {
    var countries = ["Norway", "UK", "China", "Japan", "USA"];
    return countries;
}

function getAllShipPeriods() {
    var shipPeriods = ["7days", "14days"];
    return shipPeriods;
}