// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdentityManager {
    struct Identity {
        string name;
        string email;
        address owner;
    }

    // Mapping to store identities by address
    mapping(address => Identity) private identities;

    // Array to store all registered users
    address[] private registeredUsers;

    // Events
    event IdentityRegistered(address indexed user, string name, string email);
    event IdentityUpdated(address indexed user, string name, string email);

    // Modifier to check if the user is registered
    modifier onlyRegistered() {
        require(
            bytes(identities[msg.sender].name).length > 0,
            "User not registered"
        );
        _;
    }

    // Function to register a new identity
    function registerIdentity(string memory _name, string memory _email) public {
        require(bytes(_name).length > 0, "Name is required");
        require(bytes(_email).length > 0, "Email is required");
        require(
            bytes(identities[msg.sender].name).length == 0,
            "User already registered"
        );

        // Store identity
        identities[msg.sender] = Identity(_name, _email, msg.sender);

        // Add to registered users
        registeredUsers.push(msg.sender);

        emit IdentityRegistered(msg.sender, _name, _email);
    }

    // Function to update an existing identity
    function updateIdentity(string memory _name, string memory _email)
    public
    onlyRegistered
    {
        require(bytes(_name).length > 0, "Name is required");
        require(bytes(_email).length > 0, "Email is required");

        // Update the identity
        identities[msg.sender].name = _name;
        identities[msg.sender].email = _email;

        // Emit event
        emit IdentityUpdated(msg.sender, _name, _email);
    }

    // Function to get identity details for a specific user
    function getIdentity(address _user)
    public
    view
    returns (string memory, string memory)
    {
        Identity memory id = identities[_user];
        require(bytes(id.name).length > 0, "User not registered");
        return (id.name, id.email);
    }

    // Function to get the list of all registered users
    function getAllUsers() public view returns (address[] memory) {
        return registeredUsers;
    }

    // Function to get identity details of all users
    function getAllIdentities() public view returns (Identity[] memory) {
        Identity[] memory allIdentities = new Identity[](registeredUsers.length);
        for (uint256 i = 0; i < registeredUsers.length; i++) {
            allIdentities[i] = identities[registeredUsers[i]];
        }
        return allIdentities;
    }
}
