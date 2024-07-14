// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.25;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract TestNft1155 is ERC1155 {
    constructor(string memory uri_) ERC1155(uri_) {
        _mint(address(0), 1, 100, "");
        _mint(address(1), 1, 100, "");
    }
}
