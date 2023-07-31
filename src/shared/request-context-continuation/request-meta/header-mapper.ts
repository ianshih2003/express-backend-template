export type IHeaderValue = string | undefined;
export type IHeaderSource = IHeaderValue | IHeaderValue[];

// tslint:disable-next-line:interface-name
export interface IHeaderMapper {
  target: string;
  sources: IHeaderSource;
  defaultValue?: string;
  transform?: (value: string) => string;
}

function isString(value: any): value is string {
  return typeof value === 'string';
}

function isMapper(value: any): value is IHeaderMapper {
  return value !== null && typeof value === 'object' && 'target' in value && 'sources' in value;
}

/**
 * Class that registers different headers with an
 * optional mapper or default value, and builds
 * the headers object with the resolved headers.
 */
export class HeaderMapper {
  private mappers: IHeaderMapper[] = [];
  private headersToForward: Record<string, string> = {};

  registerMapper(target: string, sources: IHeaderSource): void;
  registerMapper(mapper: IHeaderMapper): void;

  registerMapper(mapperOrTarget: string | IHeaderMapper, sources?: string | string[]): void {
    if (isString(mapperOrTarget)) {
      this.mappers.push({ target: mapperOrTarget, sources });
    } else if (isMapper(mapperOrTarget)) {
      this.mappers.push(mapperOrTarget);
    } else {
      console.log(mapperOrTarget, sources);
      throw new Error('Cannot register mapper, incorrect parameters');
    }
  }

  registerRegExpForwarder(regex: RegExp, source: Record<string, string>) {
    for (const header of Object.entries(source)) {
      if (regex.test(header[0])) {
        this.headersToForward[header[0]] = header[1];
      }
    }
  }

  getHeaders(): Record<string, string> {
    const result: Record<string, string> = {};

    const mappedHeaders = this.mappers.reduce((meta, mapper) => {
      const { defaultValue, sources, target, transform } = mapper;
      let value: string | undefined;

      if (Array.isArray(sources)) {
        // more than one sources are specified,
        // take the first valid source
        value = sources.find((value) => !!value);
      } else {
        // only one source was specified, use its value
        value = sources;
      }

      // if no value was assigned and a default value is configured,
      // use the default value
      if (!value && defaultValue) value = defaultValue;

      // if the value was assigned and there is a transform function,
      // apply the transform function to the value
      if (transform && value) value = transform(value);

      if (value) meta[target] = value;

      return meta;
    }, result);

    const lowerCaseHeaders = Object.keys(mappedHeaders).map((header) => header.toLowerCase());

    for (const entry of Object.entries(this.headersToForward)) {
      if (!lowerCaseHeaders.includes(entry[0])) {
        mappedHeaders[entry[0]] = entry[1];
      }
    }

    return mappedHeaders;
  }
}
