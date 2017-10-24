pragma solidity ^0.4.11;

contract LetterOfCredit {
	//contract mappings
	mapping (string => string) contracts;
	mapping (string => string) status; 

	//events
	event LCCreated( string contractID, string contractValues);
	event LCModified( string contractID, string contractValues);
	event StatusChanged( string contractID, string contractStatus);

	//adding new lc
	function createLC(string contractID, string contractJson) returns(bool set) {
		contracts[contractID] = contractJson;
		status[contractID] = "pending";
		LCCreated(contractID, contractJson);
		return true;
	} 

	//modifying lc
	function modifyLC(string contractID, string contractJson ) returns(bool set) {
		contracts[contractID] = contractJson;
		LCModified(contractID, contractJson);
		return true;
	}

	//set lc status
	function setStatus(string contractID, string stat ) returns(bool changed) {
		status[contractID] = stat;
		StatusChanged(contractID, stat);
		return true;
	}

	//get lc
	function getLC(string contractID) returns(string) {
		return contracts[contractID];
	}

	//get lc status
	function getStatus(string contractID) returns(string) {
		return status[contractID]; 
	}
}