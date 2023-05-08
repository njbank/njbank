import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  getMethods = (obj: object): string[] => {
    const getOwnMethods = (obj: object) =>
      Object.entries(Object.getOwnPropertyDescriptors(obj))
        .filter(
          ([name, { value }]) =>
            typeof value === 'function' && name !== 'constructor',
        )
        .map(([name]) => name);
    const _getMethods = (o: object, methods: string[]): string[] =>
      o === Object.prototype
        ? methods
        : _getMethods(
            Object.getPrototypeOf(o),
            methods.concat(getOwnMethods(o)),
          );
    return _getMethods(obj, []);
  };
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    response.status(status).send(exception.message);
  }
}
