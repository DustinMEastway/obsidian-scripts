import {
  build,
  context
} from 'esbuild';
import {
  readdir as readDirectory,
  stat
} from 'fs/promises';
import {
  join as joinPath,
  resolve as resolvePath
} from 'path';

let [,, source, destination] = process.argv;
destination = resolvePath(destination);
source = resolvePath(source);
const watch = process.argv.some((arg) => {
  return arg === '--watch';
});

const extensionsToBuild = new Set(['ts']);
async function getPathsToBuild(directory) {
  const paths = [];
  const items = await readDirectory(directory);
  for (const item of items) {
    const path = joinPath(directory, item);
    if ((await stat(path)).isDirectory()) {
      paths.push(...await getPathsToBuild(path));
    } else if (extensionsToBuild.has(path.replace(/.*\.(.*)/, '$1'))) {
      paths.push(path);
    }
  }

  return paths;
}

const files = await getPathsToBuild(source);
await Promise.all(files.map(async (file) => {
  const destinationFile = file.replace(
    source,
    destination
  ).replace(
    /\.[jt]sx?$/,
    '.js'
  );
  const config = {
    bundle: true,
    entryPoints: [file],
    format: 'cjs',
    outfile: destinationFile
  };

  if (watch) {
    const ctx = await context(config);
    await ctx.watch();
  } else {
    await build(config);
  }
}));
