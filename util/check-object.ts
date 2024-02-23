export function checkObject(object: any, properties: string[]) {
  for (const property of properties) {
    if (!(property in object)) {
      return false;
    }
  }

  return true;
}
