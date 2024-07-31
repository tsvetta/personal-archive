const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

const mergeArrays = (target: any[], source: any[]): any[] => {
  const result = [...target];

  source.forEach((sourceItem) => {
    if (isObject(sourceItem)) {
      const sourceKey = Object.keys(sourceItem)[0];
      const existingIndex = result.findIndex(
        (targetItem) =>
          isObject(targetItem) && Object.keys(targetItem)[0] === sourceKey
      );

      if (existingIndex !== -1) {
        result[existingIndex][sourceKey] = mergeDeep(
          result[existingIndex][sourceKey],
          sourceItem[sourceKey]
        );
      } else {
        result.push(sourceItem);
      }
    } else {
      result.push(sourceItem);
    }
  });

  return result;
};

export const mergeDeep = (target: any, source: any): any => {
  let output = { ...target };

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
          output[key] = mergeArrays(target[key], source[key]);
        } else {
          output[key] = source[key];
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  } else if (Array.isArray(target) && Array.isArray(source)) {
    return mergeArrays(target, source);
  } else if (Array.isArray(target) && isObject(source)) {
    const sourceInArray = new Array(source); // {abs: 1} => [{abc: 1}]

    return mergeDeep(target, sourceInArray);
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
    } else if (index === paths.length - 1) {
      current[part].push(fileName);
    }
    current = current[part];
  });

  return result;
};

export const groupByDirectories = (files: any[], cdnUrl: string): any => {
  let groupedFiles: any = {};

  files.forEach((file) => {
    const parts = file.fileName.split('/');
    const filePath = parts.slice(0, -1); // ['2016', 'folder1', 'folder2']
    const fileName = `${cdnUrl}/${file.fileName}`; // URL файла
    const nested = createNestedStructure(filePath, fileName);

    groupedFiles = mergeDeep(groupedFiles, nested);
  });

  return groupedFiles;
};
