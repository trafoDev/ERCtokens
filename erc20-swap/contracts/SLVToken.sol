pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SLVToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Silver", "SLV") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }    
}