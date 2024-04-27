export function areEqual(
  item1: unknown,
  item2: unknown
): boolean {
  if (item1 === item2) {
    return true;
  }
  // else if (
  //   item1 == null
  //   || item2 == null
  //   || typeof item1 !== 'object'
  //   || typeof item2 !== 'object'
  // ) {
  //   return false;
  // }

  // const item1IsArray = item1 instanceof Array;
  // const item2IsArray = item2 instanceof Array;
  // if (item1IsArray && item2IsArray) {
  //   if (item1.length !== item2.length) {
  //     return false;
  //   }
  //   for (let i = 0; i < item1.length; i++) {
  //     if (!areEqual(item1[i], item2[i])) {
  //       return false;
  //     }
  //   }
  //   return true;
  // } else if (item1IsArray || item2IsArray) {
  //   return false;
  // }

  // const item1IsObject = item1 instanceof Object;
  // const item2IsObject = item2 instanceof Object;
  // if (item1IsObject && item2IsObject) {
  //   const keys1 = Object.keys(item1);
  //   const keys2 = Object.keys(item2);
  //   if (keys1.length !== keys2.length) {
  //     return false;
  //   }
  //   for (const key of keys1) {
  //     if (!areEqual(item1[key], item2[key])) {
  //       return false;
  //     }
  //   }
  //   return true;
  // } else if (item1IsObject || item2IsObject) {
  //   return false;
  // }

  return true;
}
