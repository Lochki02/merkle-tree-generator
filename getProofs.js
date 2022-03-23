const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const fs = require('fs');

let whitelistAddresses = require('./leafs.json');

const leafNodes = whitelistAddresses.map(user => keccak256(user.address));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true});

const rootHash = merkleTree.getHexRoot();
let output = "Root Hash: "+rootHash + '\n\n';
for(let i = 0; i < whitelistAddresses.length; i++){
    const claimingAddress = leafNodes[i];
    const hexProof = merkleTree.getHexProof(claimingAddress);
    output += "========== Hex proof for address "+ whitelistAddresses[i].user +" ==========\n\n"+ printHexProof(hexProof) + "\n\n";
    //console.log("========== Hex proof for address "+(i+1)+" ==========\n",hexProof);
}

if(!fs.existsSync('./output.txt')) fs.appendFileSync('./output.txt',output);
fs.writeFileSync('./output.txt',output)

function printHexProof(hexProof){
    let print = '[\n'
    for(let i = 0; i < hexProof.length; i++){
        print += '  "'+ hexProof[i] + (i == hexProof.length - 1 ?  '"\n' : '",\n')
    }
    print+=']';
    return print
}