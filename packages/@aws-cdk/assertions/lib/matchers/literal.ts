import { Match } from '../match';

export class LiteralMatch extends Match {
  constructor(private readonly pattern: any) {
    super();
  }

  public test(actual: any): boolean {
    if (Array.isArray(actual) !== Array.isArray(this.pattern)) {
      return false;
    }

    if (Array.isArray(actual)) {
      if (this.pattern.length !== actual.length) {
        return false;
      }

      for (let i = 0; i < this.pattern.length; i++) {
        const p = this.pattern[i];
        const matcher = Match.isMatcher(p) ? p : new LiteralMatch(p);
        if (!matcher.test(actual[i])) return false;
      }

      return true;
    }

    if ((typeof actual === 'object') !== (typeof this.pattern === 'object')) {
      return false;
    }

    if (typeof this.pattern === 'object') {
      const patternKeys = Object.keys(this.pattern).sort();
      const actualKeys = Object.keys(actual).sort();

      const sameKeys = new LiteralMatch(patternKeys).test(actualKeys);
      if (!sameKeys) return false;

      for (const [patternKey, patternVal] of Object.entries(this.pattern)) {
        if (!(patternKey in actual)) return false;
        const matcher = Match.isMatcher(patternVal) ? patternVal : new LiteralMatch(patternVal);
        if (!matcher.test(actual[patternKey])) return false;
      }

      return true;
    }

    if (actual !== this.pattern) {
      return false;
    }

    return true;
  }
}