# Solidity preprocessor

[![test](https://github.com/andreas-timm/solidity-preprocessor/actions/workflows/test.yml/badge.svg)](https://github.com/andreas-timm/solidity-preprocessor/actions/workflows/test.yml)

## Motivation

Easy way to preprocess Solidity files, allowing modification of smart contract code dynamically before deployment, improving flexibility in various use cases.

## Usage
```solidity
// TestNft1155.sol
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.25;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract TestNft1155 is ERC1155 {
    constructor(string memory uri_) ERC1155(uri_) {
        _mint(address(0), 1, 100, "");
    }
}
```

```ts
import { preprocessor } from "@andreas-timm/solidity-preprocessor";

const res = await preprocessor({path: 'contracts/TestNft1155.sol', replace: [
  ['_mint(address(0), 1, 100, "")', '_mint(0x630C6C3180d3b4B6912644D046f6769dA3e54843, 1, 10000, "")']
]});

console.log(res.bytecode);
```

## License
[![CC BY 4.0][cc-by-shield]][cc-by]

This work is licensed under a [Creative Commons Attribution 4.0 International License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg

- [LICENSE](https://github.com/andreas-timm//blob/main/LICENSE)
- Author: [Andreas Timm](https://github.com/andreas-timm)
