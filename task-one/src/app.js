import FileTree from './fileTree';

export function createFileTree(input) {
  
  const fileTree = new FileTree();

  const parent = input[0];

// remove parent node and sort the IDs in ascending order
  input.splice(0,1)
 
  input.sort((a, b) => a.id - b.id)

 // return parent node after sorting
  input.unshift(parent);

  for (const inputNode of input) {
    const parentNode = inputNode.parentId
      ? fileTree.findNodeById(inputNode.parentId)
      : null;

    fileTree.createNode(
      inputNode.id,
      inputNode.name,
      inputNode.type,
      parentNode
    );
  }

  return fileTree;
}