import {
  build,
  context
} from 'esbuild';
import {
  readdir as readDirectory,
  readFile,
  stat,
  writeFile
} from 'fs/promises';
import {
  join as joinPath,
  resolve as resolvePath
} from 'path';

let [,, source, destination] = process.argv;
let extraDestinations = [];
const notesSyncPath = process.env.NOTES_SYNC_PATH;
if (destination.includes(',') || notesSyncPath) {
  extraDestinations = [
    ...destination.split(','),
    (notesSyncPath) ? `${notesSyncPath}/Core/Script` : null
  ].filter((path) => {
    return !!path;
  }).map((path) => {
    return resolvePath(path);
  });
  destination = extraDestinations.pop();
}

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
    const ctx = await context({
      ...config,
      plugins: [
        {
          name: 'extra-destinations-copy',
          setup: (build) => {
            build.onEnd(async () => {
              if (!extraDestinations.length) {
                return;
              }

              const content = await readFile(destinationFile);
              await Promise.all(
                extraDestinations.map(async (extraDestination) => {
                  await writeFile(
                    destinationFile.replace(destination, extraDestination),
                    content
                  );
                })
              );
            });
          }
        }
      ]
    });
    await ctx.watch();
  } else {
    await build(config);
  }
}));
