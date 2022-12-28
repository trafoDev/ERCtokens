pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenSwap {

    IERC20  public token;
    mapping(bytes32 => TokenSwap) public swaps;

    struct TokenSwap {
        address payable recipient;  // User who should recieve tokens
        address payable sender;     // User who init the swap 
        uint256 amount;             // The amount of the tokens swapped 
        uint256 timelock;           // Time stated for Swap to be executed
        bytes32 Hashlock;           // Cryptographic secret key 
        string secret;              // Secret key 
        bool refunded;              // Boolean to check if the owner has been refunded 
        bool claimed;               // Boolean to check if the token has been claimed
    }

    event NewAtomicSwap( bytes32 swapId, address payable Owner, address payable recipient, address tokenAddress, uint256 amount, bytes32 Hashlock, uint256 timelock);    
    event Claimed(bytes32 swapId);
    event Refunded(bytes32 swapId);

    modifier existing(bytes32 _swapId) {
        require(isRegistered(_swapId), "contract does not exist");
        _;
    }    

    modifier unlockable(bytes32 _swapId, string memory _secret) {
        require(bytes(_secret).length <= 32, "Secret length over 32");
        require(swaps[_swapId].Hashlock == keccak256( abi.encodePacked(_secret)), "Wrong secret");
        _;
    }    

    modifier refundable(bytes32 _swapId) {
        require(swaps[_swapId].sender == msg.sender, "Only the sender of this coin can refund");
        require(swaps[_swapId].refunded == false, "Already refunded");
        require(swaps[_swapId].claimed == false, "Already claimed");
        require(swaps[_swapId].timelock <= block.timestamp, "Timelock not yet passed");
        _;
    }    

    modifier claimable(bytes32 _swapId) {
        require(swaps[_swapId].recipient == msg.sender, "Only the recipient of this coin can claim");
        require(swaps[_swapId].refunded == false, "Already refunded");
        require(swaps[_swapId].claimed == false, "Already claimed");
        _;
    }    

    constructor( address _token) {
        token  = IERC20(_token);
    }

    function isRegistered(bytes32 _swapId) internal view returns (bool registered){
        registered = (swaps[_swapId].sender != address(0));
    }    

    function newSwap( address payable _recipient, bytes32 _Hashlock, uint256 _delay, uint256 _amount) public  payable returns(bytes32 swapId) {
        //create a swap ID which is expected to be unique
        uint256 _timelock = block.timestamp + _delay;
        swapId = keccak256( abi.encodePacked(msg.sender,_recipient,_amount,_Hashlock,_timelock));
        if(isRegistered(swapId)) revert("Swap already exists");

        // Transfer token rrom sender to the contract
        if(!token.transferFrom(msg.sender, address(this), _amount)) revert("transfer failed");

        swaps[swapId] = TokenSwap({
            recipient : _recipient,
            sender : payable(msg.sender),
            amount : _amount,
            timelock : _timelock,
            Hashlock : _Hashlock,
            secret : "",
            refunded : false,
            claimed: false
        });
        emit NewAtomicSwap(swapId, payable(_recipient), payable(msg.sender), address(token), _amount, _Hashlock, _timelock);     
    }

    function refund(bytes32 _swapId) external existing(_swapId) refundable(_swapId) returns(bool) {  
        TokenSwap storage s = swaps[_swapId];
        s.refunded = true;
        token.transfer(s.sender, s.amount);
        emit Refunded(_swapId);
        return true;
    }

    function claim(bytes32 _swapId , string memory _secret ) public payable existing(_swapId) claimable(_swapId) unlockable(_swapId, _secret) returns(bool){
        TokenSwap storage s = swaps[_swapId];
        s.secret = _secret;
        s.claimed = true;
        token.transfer(s.recipient, s.amount);
        emit Claimed(_swapId);
        return true;
    }
}