export const mergeDeep = (target: any, source: any): any => {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else if (Array.isArray(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else if (Array.isArray(target[key])) {
          output[key] = target[key].concat(source[key]);
        } else {
          output[key] = source[key];
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  } else if (Array.isArray(target) && Array.isArray(source)) {
    return target.concat(source);
  } else if (Array.isArray(target) && isObject(source)) {
    target.push(source);
    return target;
  } else {
    return source;
  }

  return output;
};

export const createNestedStructure = (
  paths: string[],
  fileName: string
): any => {
  const result: any = {};
  let current = result;

  paths.forEach((part: string, index: number) => {
    if (!current[part]) {
      current[part] = index === paths.length - 1 ? [fileName] : {};
    }
    current = current[part];
  });

  return result;
};

const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};
