import { preprocess } from '../src/preprocessor'
import test from 'node:test'
import assert from 'node:assert'

test('TestNft1155', async () => {
  const addr = '0x630C6C3180d3b4B6912644D046f6769dA3e54843'
  const replace_1 = `_mint(${addr}, 1, 10000, "")`
  const replace_2 = `_mint(${addr}, 2, 11000, "")`

  const res: any = await preprocess({
    path: 'contracts/TestNft1155.sol',
    replaces: [['_mint(address(0), 1, 100, "")', replace_1]],
    callback: (input: string) => input.replace('_mint(address(1), 1, 100, "")', replace_2)
  })

  const assembly = res.output.contracts['TestNft1155.sol'].TestNft1155.evm.assembly
  assert.notEqual(assembly.split('\n').findIndex((line: string) => line.includes(replace_1)), -1, 'replace 1')
  assert.notEqual(assembly.split('\n').findIndex((line: string) => line.includes(replace_2)), -1, 'replace 2')
})
