declare global {
  interface String {
    replaceOf: (variables: Object) => string;
  }

  interface Window {
    // ...
  }
}

export {};
