// TODO: fix config from lib
export interface LogstashConfig{

}
export class LoggerBuilder{
    private name: string;
    constructor(name: string) {
        this.name = name
    }

    addStdoutStream(level: string): LoggerBuilder {
        return this;
    }
    addLogstashStream(name: LogstashConfig): LoggerBuilder {
        return this;
    }
    build(): any {
        return this;
    }
}