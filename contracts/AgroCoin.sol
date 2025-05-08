// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgroCoin {
    string public name = "AgroCoin";
    string public symbol = "AGC";
    uint8 public decimals = 18;
    uint public totalSupply;

    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);

    constructor(uint _initialSupply) {
        require(_initialSupply > 0, "Initial supply must be greater than 0");
        // Calculate total supply with decimals in a safer way
        uint256 multiplier = 10 ** uint256(decimals);
        totalSupply = _initialSupply * multiplier;
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address _to, uint _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Not enough tokens.");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
