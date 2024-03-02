import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus, Logger, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { log } from 'console';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError, CannotCreateEntityIdMapError, FindRelationsNotFoundError, TypeORMError } from 'typeorm';
//import { GlobalResponseError } from './global.response.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        log(exception)
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let message = (exception as any).message.message;
        let code = 'HttpException';

        Logger.error(message, (exception as any).stack, `${request.method} ${request.url}`);

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        
        switch (exception.constructor) {
            case HttpException:
                status = (exception as HttpException).getStatus();
                break;
            case NotAcceptableException:
                status = (exception as NotAcceptableException).getStatus();
                message = (exception as NotAcceptableException).message;
                code = (exception as any).code;
                break;
            case UnauthorizedException:
                status = (exception as UnauthorizedException).getStatus();
                message = (exception as UnauthorizedException).message;
                code = (exception as any).code;
            case QueryFailedError:  // this is a TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as QueryFailedError).message;
                code = (exception as any).code;
                break; 
            case FindRelationsNotFoundError:  // this is a TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as FindRelationsNotFoundError).message;
                code = (exception as any).code;
                break;
            case EntityNotFoundError:  // this is another TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as EntityNotFoundError).message;
                code = (exception as any).code;
                break;
            case CannotCreateEntityIdMapError: // and another
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as CannotCreateEntityIdMapError).message;
                code = (exception as any).code;
                break;
            case TypeORMError:  // this is a TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as TypeORMError).message;
                code = (exception as any).code;
                break; 
            case BadRequestException:
                status = exception["response"].statusCode?exception["response"].statusCode: HttpStatus.BAD_REQUEST
               
                message = exception["response"].message?exception["response"].message:(exception as BadRequestException).message

                code = (exception as any).code
            
            default:
                if(exception.constructor.name == "TokenExpiredError"){
                    message = "JWT Token is Expired"
                    status = HttpStatus.UNAUTHORIZED
                    code = exception.constructor.name
                } 
               
        }

        response.status(status).json(GlobalResponseError(status, message, code, request));
    }
}


//import { Request } from 'express';
//import { IResponseError } from './response.error.interface';

export const GlobalResponseError: (statusCode: number, message: string, code: string, request: Request) => IResponseError = (
    statusCode: number,
    message: string,
    code: string,
    request: Request
): IResponseError => {
    return {
        statusCode: statusCode,
        message,
        code,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method
    };
};


export interface IResponseError {
    statusCode: number;
    message: string;
    code: string;
    timestamp: string;
    path: string;
    method: string;
}