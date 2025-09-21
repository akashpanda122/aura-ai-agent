export const getVar = (property: string, element: Element | null): string => {
    if (!element) {
      return '';
    }
    return getComputedStyle(element).getPropertyValue(property);
  };