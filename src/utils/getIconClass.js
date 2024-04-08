export function getIconClass(condition) {
  if (typeof condition !== 'string') {
    return '';
  }
    switch (condition.toLowerCase()) {
      case 'devops':
        return 'bi bi-terminal me-2';
      case 'database':
        return 'bi bi-database me-2';
      case 'frontend':
        return 'bi bi-code me-2';
      case 'backend':
        return 'bi bi-regex me-2';
      default:
        return 'bi bi-lightbulb me-2';
    }
  }

export default getIconClass;