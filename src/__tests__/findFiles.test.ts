import { findFiles } from "../findFiles";

const PATH = "src/__tests__/dummyFolder";
describe("findFiles", () => {
  it("returns paths of all files", () => {
    const results = findFiles(PATH);

    expect(results).toMatchInlineSnapshot(`
      Array [
        "src/__tests__/dummyFolder/folder1/folder11/folder111/test.md",
        "src/__tests__/dummyFolder/folder1/folder11/folder111/test.txt",
        "src/__tests__/dummyFolder/folder2/test2.md",
      ]
    `);
  });

  it("filters to select only specified extensions", () => {
    const results = findFiles(PATH, {
      extensions: ["md"],
    });

    expect(results).toMatchInlineSnapshot(`
      Array [
        "src/__tests__/dummyFolder/folder1/folder11/folder111/test.md",
        "src/__tests__/dummyFolder/folder2/test2.md",
      ]
    `);
  });

  it("ignores specified folders", () => {
    const results = findFiles(PATH, {
      extensions: ["md"],
      ignoredFolders: ["folder1"],
    });

    expect(results).toMatchInlineSnapshot(`
      Array [
        "src/__tests__/dummyFolder/folder2/test2.md",
      ]
    `);
  });

  it("stops at specified `maxDepth`", () => {
    const results = findFiles(PATH, {
      extensions: ["md"],
      maxDepth: 2,
    });

    expect(results).toMatchInlineSnapshot(`
      Array [
        "src/__tests__/dummyFolder/folder2/test2.md",
      ]
    `);
  });

  it("provides detailled results", () => {
    const results = findFiles(PATH, {
      extensions: ["txt"],
      detailedResults: true,
    });

    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "depth": 4,
          "extension": "txt",
          "fullExtension": "txt",
          "name": "test.txt",
          "nameWithoutExtension": "test",
          "path": "src/__tests__/dummyFolder/folder1/folder11/folder111/test.txt",
        },
      ]
    `);
  });

  it("uses the specified `filter` function", () => {
    const results = findFiles(PATH, {
      extensions: ["md"],
      filter: ({ nameWithoutExtension }) => nameWithoutExtension === "test2",
    });

    expect(results).toMatchInlineSnapshot(`
      Array [
        "src/__tests__/dummyFolder/folder2/test2.md",
      ]
    `);
  });

  it.only("stops dependings on `maxFiles` param", () => {
    const results = findFiles(PATH, {
      extensions: ["md"],
      maxSearchedFiles: 2,
    });

    expect(results).toMatchInlineSnapshot(`
      Array [
        "src/__tests__/dummyFolder/folder1/folder11/folder111/test.md",
      ]
    `);
  });
});
