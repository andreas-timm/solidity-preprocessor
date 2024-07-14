// SPDX-License-Identifier: CC-BY-4.0
// This work is licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0) License.
// To view a copy of this license, visit https://creativecommons.org/licenses/by/4.0/
// Author: Andreas Timm
// Repository: https://github.com/andreas-timm/solidity-preprocessor
// Version: 0.1.6
// @sha256sum 0xac24e620690a0ded3ac9c1fddd4cab297c3f5e2fc996ad4f2d158d94bd8d327e
// @eip191signature 0x548313aba2b249fa166c6d39debc6fae6a1d6e8114c4887f4c0bb38d888710e06f9e600406cbaa5163247b4a8b51bc02bed2cd204d6e0df0c795362deed8f4271c
import hre from 'hardhat'
import { Abi } from 'viem'
import solc from 'solc'
import { basename } from 'path'

export type PreprocessArgs = {
    path: string
    callback?: (input: string) => string
    replaces?: [string | RegExp, string][]
    throwOnError?: boolean
    silent?: boolean
}

export type PreprocessResult = {
    output: Record<string, any>
    flattened: string
    errors: any[]
    abi: Abi
    bytecode: `0x${string}`
    size: number
}

export class PreprocessError extends Error {
    errors: any[]

    constructor(errors: any[]) {
        super(errors.map((i) => i.formattedMessage).join('\n'))
        this.name = this.constructor.name
        this.errors = errors
    }
}

export const preprocess = async (args: PreprocessArgs): Promise<PreprocessResult> => {
    args.throwOnError = args.throwOnError ?? true
    args.silent = args.silent ?? true

    let flattened = await hre.run('flatten:get-flattened-sources', { files: [args.path] })

    const name = basename(args.path)
    const stem = name.split('.')[0]

    if (args.replaces) {
        flattened = args.replaces.reduce((acc, item) => acc.replace(item[0], item[1]), flattened)
    }

    if (args.callback) {
        flattened = args.callback(flattened)
    }

    const input = {
        language: 'Solidity',
        sources: { [name]: { content: flattened } },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
    }

    const output = JSON.parse(solc.compile(JSON.stringify(input)))

    if (output.errors?.length > 0) {
        if (args.throwOnError && output.contracts[name] === undefined) {
            throw new PreprocessError(output.errors)
        } else if (!args.silent) {
            console.error(output.errors)
        }
    }

    return {
        output,
        flattened,
        errors: output.errors,
        abi: output.contracts[name][stem].abi as Abi,
        bytecode: `0x${output.contracts[name][stem].evm.bytecode.object}`,
        size: output.contracts[name][stem].evm.deployedBytecode.object.length / 2,
    }
}
