var userId = sessionStorage.userID;
var PIN = sessionStorage.PIN;
var OTP = sessionStorage.OTP;

/*
 * 
 * Section 1 - Relevant functions for Apply, Amend and Modify LC
 * 
 * */

//this function handle the ui logic of Apply lc page
async function applyLcOperation(importer_account_num, contract_currency) {

    var importerAccount = importer_account_num;
    var exporterAccount = document.getElementById("exporterAcct").value;
    var expiryDate = document.getElementById("shipDate").value;
    var confirmed = "false";
    var revocable = "false";
    var availableBy = "TERM";
    var termDays = "90";
    var amount = document.getElementById("amount").value;
    var currency = contract_currency; //getCustomerAccounts
    var applicableRules = "none";
    var partialShipments = "false";
    var shipDestination = document.getElementById("shipDestination").value;
    var shipDate = document.getElementById("shipDate").value; // for testing purpose, Remember to change it!!

    var shipPeriod = document.getElementById("shipPeriod").value;
    var goodsDescription = document.getElementById("goodsDesc").value;
    var docsRequired = "none";
    var additionalConditions = "";
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
        $("#authError").html(errorMsg);
    } else if (globalErrorID === "010041") {
        //OTP expiry error - request new otp

        buildSMSOTP();
    } else {
        //lc submission message & redirect to homepage
        $("#authError").html("lc application submitted");

        window.location.replace(
            "/SMUtBank_TradeFinance/" +
            sessionStorage.usertype +
            "/" +
            sessionStorage.usertype +
            ".html"
        );
    }
}

//This function handles UI logic of amend lc page
async function amendLcOps() {
    /*Get ref num from url */
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

    /*Part 1 - call getLcDetails to prefilled amendments*/
    const lcDetails = await getLcDetails(userId, PIN, OTP, refNum); //calling this method from  assets/js/DAO/lcHandling.js
    var globalErrorId =
        lcDetails.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
    var fields = {};
    if (globalErrorId === "010000") {
        //Fetch lc details, store in fields object
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
        $('#shipPeriod option[value="' + shipPeriod + '"]').insertBefore(
            '#shipPeriod option[value=""]'
        );
        $("#shipPeriod").val($("#shipPeriod option:first").val());
    }
    $("#amendLcButton").click(function() {
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

        processAmendments(lc); // call amendLc Async function in another async function

    });
    $("#cancelButton").click(function() {
        window.location.replace("/SMUtBank_TradeFinance/exporter/exporter.html");
    });
}

//This function call amend lc web service and retrieve its response
async function processAmendments(lc) {
    const amendments = await amendLc(userId, PIN, OTP, lc);

    var globalErrorID = amendments.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
    var errorMsg = amendments.Content.ServiceResponse.ServiceRespHeader.ErrorText;
    var amendmentsDetails = {};
    if (globalErrorID !== "010000") { //calling this method from assets/js/DAO/lcHandling.js
        //return {errorMsg: errorMsg};
        $("#authError").html(errorMsg);
    } else if (globalErrorID === "010041") { //OTP expiry error - request new otp

        buildSMSOTP();
    } else { //submit lc application --> for now get ref num and upload lc to bc
        $("#authError").html("lc application submitted");
        window.location.replace("/SMUtBank_TradeFinance/" + sessionStorage.usertype + "/" + sessionStorage.usertype + ".html");
    }
}

//This function handle UI logic of modify lc page
async function modifyLcOps() {
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
    /*Part 1 - call getLcDetails to prefilled amendments*/
    const lcDetails = await getLcDetails(userId, PIN, OTP, refNum); //calling this method from  assets/js/DAO/lcHandling.js

    var globalErrorId =
        lcDetails.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
    //console.log(globalErrorId);

    if (globalErrorId === "010000") {
        //Fetch lc details, store in fields object
        var fields = {};
        fields = lcDetails.Content.ServiceResponse.LC_Details.LC_record;
        originalLc = fields;
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
    }
    console.log(originalLc);
    var originalAmount = "";
    var originalDesc = "";
    var originalExpiryDate = "";
    var originalShipPeriod = "";
    /*Part 2 - call getLcAmendments function, fetch expiryDate, amount, shipPeriod and originalDesc from amendments */
    const amendments = await getLcAmendments(userId, PIN, OTP, refNum);
    var globalErrorId =
        amendments.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
    if (globalErrorId === "010000") {
        var fields = {};
        fields = amendments.Content.ServiceResponse.LC_Amend.LC_Amend;
        amendmentDetails = fields;
        originalExpiryDate = fields.expiry_date; //no change
        originalAmount = fields.amount;
        originalShipPeriod = fields.shipPeriod;
        originalDesc = fields.goods_description;

    }

    /*Part 3- compare original lc and amendments */
    if (amendmentDetails !== null && originalLc !== null) {
        for (var field in amendmentDetails) {
            /*convert attribute format from under_score to camelCase (ship_period--> shipPeriod).
            This is because all "write" methd(applyLc, amendLc) use camelCase parameter, 
            all "read" method(getLcDetails) use under_score parameter*/
            var fieldCamel = attributeMapping(field);
            var originalValue = originalLc[field];
            var amendedValue = amendmentDetails[field];
            if (fieldCamel === "shipPeriod") {
                //swap current value to be the first value in the dropdown list
                $('#shipPeriod option[value="' + shipPeriod + '"]').insertBefore(
                    '#shipPeriod option[value=""]'
                );
                //display current option in dropdown list
                $("#shipPeriod").val($("#shipPeriod option:first").val());
            }
            //display the original value of each filed as a placeholder
            $("#" + fieldCamel).attr("placeholder", originalValue);
            //console.log(fieldCamel);
            var suggestion = "";
            if (originalValue !== amendedValue) {
                /*if field has been changed, indicating the amended value below input box */
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
    // if user clicks modifyLc button,
    $("#modifyLcButton").click(function() {
        //retrieve shipPeriod, expiryDate, amount and goods description from user input.
        shipPeriod = document.getElementById("shipPeriod").value;
        //if user did not enter any input, retrieve placeholder as amended value
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

        //store all values of lc details into an object
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
        /* call processModification --> as modifylc() is async function , only another async function can access its returned value.
         $("#modifyLcButton").click(function() {} is sync function, hence get value from modifyLc directly */
        processModification(lc);
    });
    $("#cancelButton").click(function() {
        window.location.replace("/SMUtBank_TradeFinance/importer/importer.html");
    });
}
//This function call modify lc web service and retrieve its response
async function processModification(lc) {

    const modification = await modifyLc(userId, PIN, OTP, lc);

    var errorMsg = modification.Content.Trade_LC_Update_BCResponse.ServiceRespHeader.ErrorText;
    var globalErrorID = modification.Content.Trade_LC_Update_BCResponse.ServiceRespHeader.GlobalErrorID;
    if (globalErrorID !== "010000") { //calling this method from assets/js/DAO/lcHandling.js
        //return {errorMsg: errorMsg};
        $("#authError").html(errorMsg);
    } else if (globalErrorID === "010041") { //OTP expiry error - request new otp

        buildSMSOTP();
    } else { //submit lc application --> for now get ref num and upload lc to bc
        $("#authError").html("lc details modified");
        window.location.replace("/SMUtBank_TradeFinance/" + sessionStorage.usertype + "/" + sessionStorage.usertype + ".html");
    }
}
/*
 * End of Section 1 - relevant functions for Apply, Amend and Modify LC
 * */

/*
 * 
 * Section 2 - Relevant functions for Homepage
 * 
 * */

// call web service used in homepage and consolidate necessary data in homepage data object 
// --> Importer & Exporter (Shipper homepage data& UI is seperated)
async function getHomepageData() {
    var homePageData = {};
    /*Part 1 retrieve all ref num under the user*/
    /*Part 2 - get all transaction hash*/
    var refNumberList = [];
    console.time("time spent");
    /*call parallel await/async function --> getRefNumListAsync & getBCReceipt(). 
    refnum --> Return {errormsg}, or {refNumlist}, all bc receipt --> return [refnum,transactionHash], [refnum,transactionHash],[...]*/
    const refNumAndReceipt = await Promise.all([getRefNumListAsync(userId, PIN, OTP)]);
    var refNumberListValidation = refNumAndReceipt[0];

    if (!refNumberListValidation.hasOwnProperty("Content")) {
        if (refNumberListValidation.RefNumList !== null) {
            refNumberList = refNumberListValidation.RefNumList.RefNum;
        }

    }
    //get number of refnum in the list
    var numOfRows = refNumberList.length;
    if (refNumberList.length > 0) {
        //iterate through up to 5 latest refnum in the list
        for (var i = 0; i < numOfRows && i < 5; i++) {
            var refNum = refNumberList[i]; //key of homepageData
            var lc = {};
            var globalErrorId = "";
            // const results = await Promise.all([getLcDetails(userId, PIN, OTP, refNum), getBOLUrl(userId, PIN, OTP, refNum), getBlockchainReceiptHash(userId, PIN, OTP, refNum)]);
            const results = await Promise.all([getLcDetails(userId, PIN, OTP, refNum), getBOLUrl(userId, PIN, OTP, refNum)]);
            var lcDetails = results[0];
            var bolLinks = results[1];

            if (lcDetails.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID === "010000") {
                lc = lcDetails.Content.ServiceResponse.LC_Details.LC_record;
                //convert lc object to a jsonString, passing jsonstring through data-variable of the modal
                lc = JSON.stringify(lc);
                var links = "";
                var linkObj = {};
                if (bolLinks.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID === "010000") {
                    links =
                        bolLinks.Content.ServiceResponse.BOL_Details.BOL_record_output
                        .BOL_Link;
                    linkObj = JSON.parse(links);
                }

                /*Part 5 - add each record to data object - Key: RefNum, Value: {lcDetails : lcDetails, bolLinks: bolLinks}*/
                var contentObj = {
                    lcDetails: lc,
                    bolLinks: links,
                };
                homePageData[refNum] = contentObj;

            }

        }
    }
    console.log(homePageData);
    var homepageDataString = JSON.stringify(homePageData);
    console.timeEnd("time spent");
    return homepageDataString;
}
async function processHomepageData() {

}

//this function handles ui logic of homepage
async function homeOperation() {
    let homePageData;

    if (sessionStorage.usertype === "shipper") {
        homepageData = await getAllLcsShipper();

        // Preparation for data table 
    } else {
        homepageData = await getHomepageData();
    }
    /*Method 2 - call async/await function --> getHomepageData, (seperate ui and data retriever)*/

    var dataObj = JSON.parse(homepageData);

    var dataSize = Object.keys(dataObj).length;
    if (dataSize > 0) {
        for (var i = 0; i < dataSize; i++) {
            //get refnum
            var refNum = Object.keys(dataObj)[i];

            //get lc 
            var lc = dataObj[refNum].lcDetails;
            var lcObj = JSON.parse(lc);


            //get status
            var status = lcObj.status.toLowerCase();

            //get destination
            var shipDestination = lcObj.ship_destination;

            //get shipDate 
            var shipDate = lcObj.ship_date;

            //get exporter acct
            var exporterAcct = lcObj.exporter_account_num;

            //get importer acct
            var importerAcct = lcObj.importer_account_num;

            //get expiry date
            var expiryDate = lcObj.expiry_date;

            //get receipt
            var getReceipt = lcObj.sender_to_receiver_info;

            //get links
            var links = dataObj[refNum].bolLinks;

            /*End of Method 2*/

            //Get operation - Call operationMatch method,  returns [action, url] based on user type (e.g.["view lc", "viewLc.html"])
            var operations = operationMatch(status); //calling this method from utility/operationMatch.js
            var operation = operations[0]; //get action to take
            var url = operations[1];

            //Initialize an empty table row
            var $row = $("<tr></tr>");
            //1st Cell - Initialize an empty table cell to store refNum
            var $refNumCell = $("<td></td>");
            //append refnum value in ref num cell
            $refNumCell.append(refNum);
            //append ref num cell into table row
            $row.append($refNumCell);

            //2nd cell - initialize the second table cell - importer --> exporterAccount, exporter --> importerAccount, shipper --> country
            if (sessionStorage.usertype === "importer") {
                var $exporterAcctCell = $("<td>" + exporterAcct + "</td>");
                $row.append($exporterAcctCell);
            } else if (sessionStorage.usertype === "exporter") {
                var $importerAcctCell = $("<td>" + importerAcct + "</td>");
                $row.append($importerAcctCell);
            } else {
                var $countryCell = $("<td>" + shipDestination + "</td>");
                $row.append($countryCell);
            }
            //3rd cell - initialize expiry date cell, importer/exporter --> expiryDate, shipper --> ship date
            if (sessionStorage.usertype === "shipper") {
                var $shipDateCell = $("<td>" + shipDate + "</td>");
                $row.append($shipDateCell);
            } else {
                var $expiryDateCell = $("<td>" + expiryDate + "</td>");
                $row.append($expiryDateCell);
            }

            //4th cell - initialize status cell
            var $statusCell = $(
                '<td id="status" class="font-bold">' +
                convertToDisplay(status, " ") +
                "</td>"
            );
            $statusCell.addClass(buttonAssigned(operation)[1]); //change status text color to red if action is to be taken(Rather than "View lc").
            $row.append($statusCell);
            //5th cell - initialize button cell
            var $buttonCell = $("<td></td>");
            var button = "";
            /*Button triggers lcDetails modal by default, 
            lcDetails, operation,refNum,receipt,link,status are all stored in the modal data variable*/
            //if (sessionStorage.usertype === "shipper" && operation === "collect goods") {
            //    button = "";
            //} else {
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

            //Button triggers modifyLc page or submitBol page, do not store any data, redirection purpose only
            if (operation === "modify lc" || operation === "submit bol") {
                button =
                    "<button type='button'  data-refnum=" +
                    refNum +
                    " class='btn btn-primary homeButton' id='" +
                    url +
                    "'>" +
                    convertToDisplay(operation, " ") +
                    "</button>";
                //  }
            }
            var $button = $(button);
            //$button.css("visibility","hidden");
            $button.addClass(buttonAssigned(operation)[0]); //change button color to red if action is to be taken(Rather than "View lc").
            $buttonCell.append($button);
            $row.append($buttonCell);
            //append tablle row into the table container(id = latestLCs)

            $("#latestLCs").append($row);
        }
    }

    //DataTables instantiation for shipper homepage.
    if (sessionStorage.usertype === "shipper") {
        $('#first-datatable-output table').datatable({
            pageSize: 5,
            pagingNumberOfPages: 5,
            sort: [true, true, true, true, false],
            filters: [true, 'select', true, false, false],
            filterEmptySelect: 'Filter by Country',
            filterText: 'Filter by date',
            pagingDivSelector: "#paging-first-datatable"
        });
    }


}


//This function clear contents of lc table container
function emptyShipperHome() {
    $("#latestLCs").empty();
}

async function getAllLcsShipper() {
    //call lcCreated listener to get all modified!!! lcs --> change format of json
    //call lcCreatedHash to get all hashes
    var homePageData = {};
    const results = await Promise.all([getAllBlockchainReceipt(userId, PIN, OTP)]);
    var lcDetails = results[0];
    //var receipt = results[1];
    //store allBcReceipts in an object {refNum:TransactionHash}
    var lcs = {};
    var bcReceipt = {}
    if (lcDetails != null) {
        for (var i = 0; i < lcDetails.length; i++) {
            //if (!(lcDetails[i][0] in lcs)) {
            lcs[lcDetails[i][0]] = trimLcDetails(lcDetails[i][1]);
            //}
        }
    }
    //trim extra property of lc details
    console.log(lcs);
    //get status,only store lc with listed status - acknowledged --> submit bol, documents uploaded --> accept documents, documents accpeted,goods collected
    var listedStatus = ["acknowledged", "documents uploaded", "documents accepted", "goods collected"];
    if (Object.keys(lcs).length > 0) {
        for (var refNum in lcs) {
            console.log(refNum);
            var lc = lcs[refNum];
            lc = JSON.parse(lc);
            lc = lc["Trade_LC_Create"]["LC_record"];
            console.log(lc);
            var status = lc.status.toLowerCase();
            var statusIncluded = $.inArray(status, listedStatus);
            if (status !== "" && statusIncluded !== -1) {
                // if status correct, call get bol links
                const bolLinks = await getBOLUrl(userId, PIN, OTP, refNum);
                var links = "";
                if (bolLinks.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID === "010000") {
                    links =
                        bolLinks.Content.ServiceResponse.BOL_Details.BOL_record_output
                        .BOL_Link;
                }
                //store lc, bcreceipt and bol links in homepageData
                var getReceipt = "";
                var contentObj = {
                    lcDetails: JSON.stringify(lc),
                    bolLinks: links,
                    receipt: getReceipt
                };
                homePageData[refNum] = contentObj;
            }
        }
    }
    console.log(homePageData);
    var homepageDataString = JSON.stringify(homePageData);
    return homepageDataString;
}

/*async function getReadyToCollectLcsShipper() { // this function is to get importer id, ref num and bol links from api
    var homePageData = {};
    const results = await Promise.all([getAllBlockchainReceipt(userId, PIN, OTP)]);
    var lcDetails = results[0];

    var lcs = {};
    if (lcDetails != null) {
        for (var i = 0; i < lcDetails.length; i++) {
            //trim extra property of lc details
            lcs[lcDetails[i][0]] = trimLcDetails(lcDetails[i][1]);
        }
    }

    if (Object.keys(lcs).length > 0) {
        for (var refNum in lcs) {
            console.log(refNum);
            var lc = lcs[refNum];
            lc = JSON.parse(lc);
            lc = lc["Trade_LC_Create"]["LC_record"];
            console.log(lc);
            var status = lc.status.toLowerCase();
            //var statusIncluded = $.inArray(status, listedStatus);
            if (status === "documents accepted") {
                // if status correct, call get bol links
                const bolLinks = await getBOLUrl(userId, PIN, OTP, refNum);
                var links = "";
                if (bolLinks.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID === "010000") {
                    links =
                        bolLinks.Content.ServiceResponse.BOL_Details.BOL_record_output
                        .BOL_Link;
                }
                //store lc, bcreceipt and bol links in homepageData
                var getReceipt = "";
                var contentObj = {
                    lcDetails: JSON.stringify(lc),
                    bolLinks: links,
                    receipt: getReceipt
                };
                homePageData[refNum] = contentObj;
            }
        }
    }
    console.log(homePageData);
    var homepageDataString = JSON.stringify(homePageData);
    return homepageDataString;
}*/



//This function assigns button color (by adding class name to the button element) based on action --> view lc(green), other actions(red)
function buttonAssigned(action) {

    var name = "btn-primary";
    var text = "text-primary";
    if (action !== "view lc") {
        name = "btn-danger";
        text = "text-danger";
    }
    return [name, text];
}

//This function matches status of a usertype with coresponding action
function operationMatch(status) {

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
            operation = "view qr code";
        }
    } else if (sessionStorage.usertype === "exporter") {
        if (status.toLowerCase() === "pending") {
            url = "reviewLc";
            operation = "review lc";
        }
        /*else if (status.toLowerCase() === "acknowledged") {
            url = "submitBol";
            operation = "submit bol";
        }*/
    } else if (sessionStorage.usertype === "shipper") {
        if (status.toLowerCase() === "acknowledged") {
            url = "submitBol";
            operation = "submit bol";
        } else if (status.toLowerCase() === "documents accepted") {
            url = "collectGoods";
            operation = "scan qr code";
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
            if (sessionStorage.usertype === "shipper") {
                allNecessaryFields = [
                    "goods_description",
                    "importer_ID",
                    "exporter_ID",
                    "creation_datetime",
                    "ship_period",
                    "ship_date",
                    "ship_destination",
                ];
            }
            var allLcHTML = "";
            console.log(links);
            var verified = "";
            if (links !== "") {

                var bolLink = links.BillOfLading;

                if (sessionStorage.usertype !== "shipper" && (status === "documents accepted" || status === "goods collected")) {
                    new QRCode(document.getElementById("qrcode"), {
                        width: 150,
                        height: 150,
                        text: bolLink
                    });
                }
                if (sessionStorage.usertype === "shipper" && status === "documents accepted") {
                    $("#scannerFrame").append("<video class='col-sm-12' id='preview'></video>");
                    let scanner = new Instascan.Scanner({

                        video: document.getElementById('preview'),
                        mirror: true,
                        refractoryPeriod: 5000,
                    });
                    scanner.addListener('scan', function(content) {
                        console.log(content);
                        //$("#qrContent").append(content);
                        verifyQrCodeUI(refNum, content);
                        scanner.stop();

                    });
                    Instascan.Camera.getCameras().then(function(cameras) {
                        if (cameras.length > 0) {
                            scanner.start(cameras[0]);
                            console.log("start");
                        } else {
                            console.error('No cameras found.');
                        }
                    }).catch(function(e) {
                        console.error(e);
                    });

                    // verified = "<button type='button' class='btn btn-primary btn-lg'><i class='fa fa-check'></i> Verfified ! </button>"
                }

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
            } else if (
                sessionStorage.usertype === "importer" &&
                action === "accept documents"
            ) {
                attrToChange = [
                    "acceptDocs",
                    "",
                    "Accept Documents",
                    "",
                    "visible",
                    "hidden"
                ];
            } else if (
                sessionStorage.usertype === "shipper" &&
                action === "scan qr code"
            ) {
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


            var refNumHTML = "<div value='" + refNum + "' id='returnedRef'></div>";
            // Update the modal's content.
            var modal = $(this);
            modal
                .find(".modal-body section header div div div p#refNum")
                .text(refNum);
            //modal.find(".modal-body #verification").html(verified);
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
            $("#scannerFrame").html("");
            $("#statusValue").attr("class", "h3 font-bold m-t");
        });
        /*$(".modal").on("hidden.bs.modal", function () {
                 $(".modal-body").html("");
                 $(".modal-footer").html("");
                 });*/
    });
}


function buttonClicks() {
    $(".homeButton").click(function() {
        var refNum = $(this).attr('data-refnum');
        var page = $(this).attr('id');
        console.log("TEST!!!!!!!!!!!!!!!!");
        var pageToLoad = {
            page: page
        };
        if (refNum != undefined) {
            pageToLoad.refNum = refNum;
        }
        sessionStorage.setItem('page', JSON.stringify(pageToLoad));
        window.location.replace("/SMUtBank_TradeFinance/" + sessionStorage.usertype + "/" + sessionStorage.usertype + ".html?refNum=" + refNum);
    });
    $("#approveButton").click(function() {
        var refNum = $("#returnedRef").attr("value");
        var status = "acknowledged";
        processUpdateStatus(userId, PIN, OTP, refNum, status, "");
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
    });
    $("#acceptDocs").click(function() {
        var refNum = $("#returnedRef").attr("value");
        //console.log(refNum);
        var status = "documents accepted";
        processUpdateStatus(userId, PIN, OTP, refNum, status, "");
    });
    $("#collectGoods").click(function() {
        var refNum = $("#returnedRef").attr("value");
        //console.log(refNum);
        var status = "goods collected";
        processUpdateStatus(userId, PIN, OTP, refNum, status, "");
    });
}
async function processUpdateStatus(userId, PIN, OTP, refNum, status, statusDetails) {
    const processUpdateStatus = await updateStatus(userId, PIN, OTP, refNum, status, statusDetails);
    var globalErrorID =
        processUpdateStatus.Content.Trade_LCStatus_Update_BCResponse.ServiceRespHeader
        .GlobalErrorID;
    if (globalErrorID === "010000") {
        window.location.replace(
            "/SMUtBank_TradeFinance/" +
            sessionStorage.usertype +
            "/" +
            sessionStorage.usertype +
            ".html"
        );
    }
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