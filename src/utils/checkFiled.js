export function checkField(obj, fields, defaultValue = "") {
  let result = "";
  try {
    let loop = (ele, index) => {
      let childObj = ele[fields[index]];
      let beforeIndex = fields[index].indexOf("[");
      let afterIndex = fields[index].indexOf("]");
      if (beforeIndex > -1 && afterIndex > -1) {
        // 当为数组时
        let childIndex = fields[index].substring(beforeIndex + 1, afterIndex);
        childObj = ele[fields[index].substring(0, beforeIndex)];
        if (childObj) {
          childObj = childObj[childIndex];
        } else {
          throw new Error();
        }
      }
      if (childObj) {
        if (index < fields.length - 1) {
          loop(childObj, ++index);
        } else {
          result = childObj || defaultValue;
        }
      } else {
        throw new Error();
      }
    };
    loop(obj, 0);
  } catch (error) {
    result = defaultValue;
  }
  return result;
};
