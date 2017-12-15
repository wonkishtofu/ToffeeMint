//Import JSON libraries
const app = require('express')();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 9001;

//Import web3 & truffle libraries
const Web3 = require('web3'),
contract = require("truffle-contract"),
path = require('path')
LetterOfCreditJSON = require(path.join(__dirname, 'build/contracts/LetterOfCredit.json'));

const filePath = path.join(__dirname, 'build/contracts/LetterOfCredit.json');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

const LetterOfCredit = contract(LetterOfCreditJSON);
LetterOfCredit.setProvider(web3.currentProvider);


//Account variables
var account = web3.eth.accounts[0];
const gasLimit = 100000000000;

//Starting JSON
app.use(bodyParser.json());

app.listen(PORT, function () {
    console.log("app listening on port: " + PORT);
})


//////////////////////////////ENDPOINTS//////////////////////////////

app.get('/lc/createContract/', function(req, res){
    const lcID = req.param("refNum");    
    const contract = req.param("contract");   

    createLetterOfCredit(lcID ,contract).then(function(result) {
        res.status(200).send(result);
        console.log(result);
    });
})

app.get('/lc/getContract/', function (req, res) {
    const lcID =  req.param("refNum");  

    getLetterOfCredit(lcID).then(function(result) {
        res.status(200).send(result);
        console.log(result);
    });
})

app.get('/lc/modifyContract', function (req, res) {
    const lcID = req.param("refNum");
    const contract = req.param("contract");

    modifyLetterOfCredit(lcID, contract).then(function(result) {
        res.status(200).send(result);
        console.log(result);
    });
})

app.get('/lc/getStatus', function (req, res) {
    const lcID = req.param("refNum");

    getLCStatus(lcID).then(function(result) {
        res.status(200).send(result);
        console.log(result);
    })
})

app.get('/lc/setStatus', function (req, res) {
    const lcID = req.param("refNum");
    const stat = req.param("status");

    setLCStatus(lcID, stat).then(function(result) {
        res.status(200).send(result);
        console.log(result);
    });
})

app.get('/lc/getBOE', function(req, res) {
    const lcID = req.param("refNum");

    getBOE(lcID).then(function(result) {
        res.status(200).send(result);
        console.log(result);
    });
})

app.get('/lc/setBOE', function(req, res) {
    const lcID = req.param("refNum");
    const boeHash = req.param("BOE");

    setBOE(lcID, boeHash).then(function(result) {
        res.status(200).send(result);
        console.log(result);
    });
})

app.get('/lc/amendLC', function(req, res) {
    const refNum = req.param("refNum");
    const amendments = req.param("amendments");
    const lc = getLetterOfCredit(refNum);
    if(lc != null){
        setLCStatus(refNum, "Amendments Requested"); 
        amendContract(refNum, amendments).then(function(result) {
            res.status(200).send(result);
            console.log(result);
        });
    }    
})


//LC getter setters

function createLetterOfCredit(refNum, contract) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.createLC(refNum, contract, {from: account, gas: gasLimit });
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });  
    })
    
}


function getLetterOfCredit(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function (instance) {
            return instance.getLC.call(refNum)
        }).then(function(result) {              
            resolve(result);
        }).catch(function(error) {
                console.log("Error: " + error);
                reject(error);
        });
    })     
}


function modifyLetterOfCredit(refNum, contract) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.modifyLC(refNum, contract, {from: account, gas: gasLimit})
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });  
    })
}

//LC Status getter setter

function getLCStatus(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.getStatus.call(refNum)
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}

function setLCStatus(refNum, stat) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.setStatus(refNum, stat, {from: account, gas: gasLimit})
        }).then(function(result) {
                resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}

//BOE & BOL getter setter

function getBOE(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.getBOE.call(refNum)
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}

function setBOE(refNum, BOEHash) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.setBOE(refNum, BOEHash, {from: account, gas: gasLimit})
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}

function amendContract(refNum, amendmentJSON) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.amendContract(refNum, amendmentJSON, {from: account, gas: gasLimit})
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}




/////EVENTS/////

//endpoints
app.get('/lc/events', function (req, res) {
    statusChangeListener().then(function(event) {
        res.status(200).send(event);
    })
})



//event endpoints exposed
function LCCreationListener() {
    LetterOfCredit.deployed().then(function(instance) {
        instance.LCCreated({}, {fromBlock: 0, toBlock: 'latest'}).watch(function(error, event) {
            console.log(event);
        })
    });
}

function LCModifyListener() {
    LetterOfCredit.deployed().then(function(instance) {
        instance.LCModified().watch(function(error, event) {
            console.log(event);
        })
    });
}

function statusChangeListener() {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            instance.StatusChanged({}, {fromBlock: 0, toBlock: 'latest'}).watch(function(error, event) {
                console.log(event);
                resolve(event);
            })
        }); 
    })
}

