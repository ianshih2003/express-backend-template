export class Resource implements Resource {
  description: string;
  id: number;
  foo: string;
  constructor(id: number, description: string) {
    this.id = id;
    this.description = description;
    this.foo = id + description;
  }
}
