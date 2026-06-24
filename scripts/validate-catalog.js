const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");

function readJson(relativePath) {
  const fullPath = path.join(rootDir, relativePath);
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    throw new Error(`${relativePath} is not valid JSON: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function stable(value) {
  if (Array.isArray(value)) {
    return value.map(stable);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, stable(item)])
    );
  }

  return value;
}

function assertDeepEqual(left, right, message) {
  const leftJson = JSON.stringify(stable(left));
  const rightJson = JSON.stringify(stable(right));

  if (leftJson !== rightJson) {
    throw new Error(`${message}\nleft=${leftJson}\nright=${rightJson}`);
  }
}

function assertSourceShape(source, context) {
  assert(source && typeof source === "object", `${context}: source must be an object`);
  assert(typeof source.id === "string" && source.id.length > 0, `${context}: id is required`);
  assert(typeof source.adapterKey === "string" && source.adapterKey.length > 0, `${context}: adapterKey is required`);
  assert(typeof source.name === "string" && source.name.length > 0, `${context}: name is required`);
  assert(Number.isInteger(source.version) && source.version > 0, `${context}: version must be positive integer`);
  assert(typeof source.language === "string" && source.language.length > 0, `${context}: language is required`);
  assert(typeof source.description === "string", `${context}: description is required`);
  assert(source.capabilities && typeof source.capabilities === "object", `${context}: capabilities are required`);
  assert(source.safety && typeof source.safety === "object", `${context}: safety is required`);
  assert(Array.isArray(source.safety.allowedDomains), `${context}: safety.allowedDomains must be array`);
  assert(source.safety.allowedDomains.every((domain) => typeof domain === "string" && domain.length > 0), `${context}: allowed domains must be non-empty strings`);
  assert(source.safety.cookies === false, `${context}: cookies must be false`);
  assert(source.safety.auth === false, `${context}: auth must be false`);
  assert(source.safety.customHeaders === false, `${context}: customHeaders must be false`);
  assert(source.safety.redirects === false, `${context}: redirects must be false`);
  assert(Array.isArray(source.safety.fixedRequestHeaders), `${context}: fixedRequestHeaders must be array`);
  assert(source.safety.fixedRequestHeaders.every((header) => typeof header === "string" && header.length > 0), `${context}: fixedRequestHeaders must be non-empty strings`);
}

function comparableCatalogSource(resource) {
  const { sourcePath, iconPath, ...catalogSource } = resource;
  return catalogSource;
}

const repo = readJson("repo.json");
const index = readJson("index.json");
const minIndex = readJson("index.min.json");
const catalog = readJson("catalog/sources.json");

assert(repo.schemaVersion === 3, "repo.json schemaVersion must be 3");
assert(Number.isInteger(repo.version) && repo.version > 0, "repo.json version must be positive integer");
assert(index.schemaVersion === 3, "index.json schemaVersion must be 3");
assert(minIndex.schemaVersion === index.schemaVersion, "index.min.json schemaVersion must match index.json");
assert(Array.isArray(index.resources), "index.json resources must be an array");
assert(Array.isArray(minIndex.resources), "index.min.json resources must be an array");
assert(Array.isArray(catalog.sources), "catalog/sources.json sources must be an array");
assert(Number.isInteger(catalog.catalogVersion), "catalogVersion must be an integer");

assert(index.resources.length === minIndex.resources.length, "index and min index resource counts must match");
assert(index.resources.length === catalog.sources.length, "index and catalog source counts must match");

const ids = new Set();

for (const resource of index.resources) {
  assertSourceShape(resource, `index:${resource?.id ?? "unknown"}`);
  assert(!ids.has(resource.id), `index:${resource.id}: duplicate resource id`);
  ids.add(resource.id);
  assert(typeof resource.sourcePath === "string", `index:${resource.id}: sourcePath is required`);
  assert(fs.existsSync(path.join(rootDir, resource.sourcePath)), `index:${resource.id}: sourcePath does not exist`);
  assert(typeof resource.iconPath === "string", `index:${resource.id}: iconPath is required`);
  assert(fs.existsSync(path.join(rootDir, resource.iconPath)), `index:${resource.id}: iconPath does not exist`);

  const minResource = minIndex.resources.find((source) => source.id === resource.id);
  const catalogResource = catalog.sources.find((source) => source.id === resource.id);
  const packageSource = readJson(resource.sourcePath);

  assert(minResource, `${resource.id}: missing from index.min.json`);
  assert(catalogResource, `${resource.id}: missing from catalog/sources.json`);
  assertSourceShape(minResource, `index.min:${resource.id}`);
  assertSourceShape(catalogResource, `catalog:${resource.id}`);
  assertSourceShape(packageSource, resource.sourcePath);

  assertDeepEqual(minResource, resource, `${resource.id}: index.min must match index metadata`);
  assertDeepEqual(catalogResource, comparableCatalogSource(resource), `${resource.id}: catalog must match index metadata`);

  for (const field of ["id", "adapterKey", "name", "version", "language", "description"]) {
    assert(resource[field] === packageSource[field], `${resource.id}: ${field} must match package source.json`);
  }

  assertDeepEqual(resource.capabilities, packageSource.capabilities, `${resource.id}: capabilities must match package source.json`);
  assertDeepEqual(resource.safety, packageSource.safety, `${resource.id}: safety must match package source.json`);
}

console.log(`Resources catalog validation passed for ${index.resources.length} resources.`);
