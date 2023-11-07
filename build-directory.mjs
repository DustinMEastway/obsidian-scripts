import {
  build,
  context
} from 'esbuild';
import {
  readdir as readDirectory
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

const filesToIgnore = new Set(['.DS_Store']);
const files = (await readDirectory(source)).filter((fileName) => {
  return !filesToIgnore.has(fileName);
});

await Promise.all(files.map(async (file) => {
  const sourceFile = joinPath(source, file);
  const destinationFile = sourceFile.replace(
    source,
    destination
  ).replace(
    /\.[jt]sx?$/,
    '.js'
  );
  const config = {
    bundle: true,
    entryPoints: [sourceFile],
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
